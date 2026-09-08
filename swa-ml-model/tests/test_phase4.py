from datetime import datetime, timedelta, timezone

import pytest

from swa_engine.activity_repository import ActivityRepository
from swa_engine.loader import load_repository
from swa_engine.mastery_engine import MasteryEngine
from swa_engine.persistence import SQLitePersistence
from swa_engine.recommendation_candidates import CandidateGenerator, RecommendationContext
from swa_engine.recommendation_config import RecommendationConfig, load_recommendation_config
from swa_engine.recommendation_diversity import diversify
from swa_engine.recommendation_engine import RecommendationEngine
from swa_engine.recommendation_filters import HardFilter
from swa_engine.recommendation_models import RecommendationRequest
from swa_engine.recommendation_scoring import FeatureScorer
from swa_engine.services import ActivityService
from swa_engine.user_models import AttemptStatus, ExerciseAttempt, GoalPriority, GoalStatus, UserGoal, UserProfile
from swa_engine.user_repository import UserRepository

NOW = datetime(2026, 8, 21, 12, tzinfo=timezone.utc)


@pytest.fixture
def setup():
    db = SQLitePersistence(":memory:")
    exercises = load_repository().all()
    users = UserRepository(db)
    activity = ActivityRepository(db, exercises)
    service = ActivityService(activity)
    engine = MasteryEngine(activity)
    recommender = RecommendationEngine(exercises, users, activity, engine, config=RecommendationConfig())
    return db, exercises, users, activity, service, recommender


def create_user(users, user_id="recommend_user", areas=None, skills=None):
    users.save_profile(UserProfile(user_id=user_id, created_at=NOW, updated_at=NOW, selected_areas=areas or ["Confidence"], selected_skills=skills or ["Self-Efficacy"], preferences={"preferred_minutes": 15}))
    return user_id


def create_goal(users, user_id="recommend_user", area="Confidence", skill="Self-Efficacy", goal_id="goal_recommend"):
    users.save_goal(UserGoal(goal_id=goal_id, user_id=user_id, area=area, skill=skill, priority=GoalPriority.high, status=GoalStatus.active, created_at=NOW, updated_at=NOW))


def save_attempt(activity, attempt_id, user_id, exercise_id, status=AttemptStatus.completed, days_ago=30, usefulness=None, difficulty=None):
    started = NOW - timedelta(days=days_ago)
    activity.save_attempt(ExerciseAttempt(attempt_id=attempt_id, user_id=user_id, exercise_id=exercise_id, started_at=started, completed_at=started + timedelta(minutes=10) if status == AttemptStatus.completed else None, status=status, usefulness_rating=usefulness, difficulty_rating=difficulty))


def test_candidate_generation_and_active_filtering(setup):
    _, exercises, users, activity, _, _ = setup
    create_user(users)
    create_goal(users)
    context = RecommendationContext(users.get_profile("recommend_user"), users.goals("recommend_user"), [], {"Confidence"}, {"Self-Efficacy"})
    candidates = CandidateGenerator().generate(exercises, context)
    assert candidates
    assert all(exercise.status == "active" for exercise in candidates)
    assert all(exercise.area == "Confidence" or exercise.skill == "Self-Efficacy" for exercise in candidates)


def test_goal_and_skill_relevance(setup):
    _, exercises, users, activity, _, _ = setup
    create_user(users)
    create_goal(users)
    context = RecommendationContext(users.get_profile("recommend_user"), users.goals("recommend_user"), [], {"Confidence"}, {"Self-Efficacy"})
    scorer = FeatureScorer(activity, MasteryEngine(activity), RecommendationConfig())
    exact = next(exercise for exercise in exercises if exercise.skill == "Self-Efficacy")
    unrelated = next(exercise for exercise in exercises if exercise.area == "Communication")
    assert scorer.components(exact, context, NOW)["goal_relevance"] == 1.0
    assert scorer.components(exact, context, NOW)["skill_relevance"] == 1.0
    assert scorer.components(unrelated, context, NOW)["goal_relevance"] == 0.0


def test_cold_start_uses_neutral_history_and_onboarding(setup):
    _, _, users, _, _, recommender = setup
    create_user(users, areas=["Confidence"], skills=["Assertiveness"])
    result = recommender.recommend(RecommendationRequest(user_id="recommend_user", limit=5), NOW)
    assert result.recommendations
    assert all(item.area == "Confidence" or item.skill == "Assertiveness" for item in result.recommendations)
    assert all(item.score_components["usefulness"] == 0.5 for item in result.recommendations)


def test_active_goal_influences_top_recommendation(setup):
    _, _, users, _, _, recommender = setup
    create_user(users)
    create_goal(users)
    result = recommender.recommend(RecommendationRequest(user_id="recommend_user", limit=1), NOW)
    assert result.recommendations[0].area == "Confidence"
    assert "goal" in result.recommendations[0].reason


def test_completed_exercise_is_hard_filtered_recently(setup):
    _, _, users, activity, _, recommender = setup
    create_user(users)
    create_goal(users)
    save_attempt(activity, "recent_complete", "recommend_user", "co_efficacy_01", days_ago=2)
    result = recommender.recommend(RecommendationRequest(user_id="recommend_user", requested_skill="Self-Efficacy", limit=10), NOW)
    assert all(item.exercise_id != "co_efficacy_01" for item in result.recommendations)


def test_skipped_and_abandoned_remain_available_with_novelty_penalty(setup):
    _, _, users, activity, _, recommender = setup
    create_user(users)
    create_goal(users)
    save_attempt(activity, "recent_skip", "recommend_user", "co_efficacy_01", AttemptStatus.skipped, days_ago=2)
    result = recommender.recommend(RecommendationRequest(user_id="recommend_user", requested_skill="Self-Efficacy", limit=5), NOW)
    match = next(item for item in result.recommendations if item.exercise_id == "co_efficacy_01")
    assert match.score_components["novelty"] < 1.0


def test_usefulness_history_affects_scoring(setup):
    _, _, users, activity, _, recommender = setup
    create_user(users)
    create_goal(users)
    save_attempt(activity, "rated_useful", "recommend_user", "co_efficacy_01", usefulness=5, days_ago=30)
    result = recommender.recommend(RecommendationRequest(user_id="recommend_user", requested_skill="Self-Efficacy", limit=10), NOW)
    match = next(item for item in result.recommendations if item.exercise_id == "co_efficacy_01")
    assert match.score_components["usefulness"] == 1.0


def test_recency_and_difficulty_components_are_bounded(setup):
    _, _, users, activity, _, _ = setup
    create_user(users)
    create_goal(users)
    save_attempt(activity, "difficulty_history", "recommend_user", "co_efficacy_01", usefulness=3, difficulty=5, days_ago=1)
    context = RecommendationContext(users.get_profile("recommend_user"), users.goals("recommend_user"), [], {"Confidence"}, {"Self-Efficacy"})
    exercise = next(item for item in load_repository().all() if item.exercise_id == "co_efficacy_01")
    components = FeatureScorer(activity, MasteryEngine(activity), RecommendationConfig()).components(exercise, context, NOW)
    assert all(0 <= value <= 1 for value in components.values())
    assert components["recency"] < 1.0


def test_context_matching(setup):
    _, exercises, users, activity, _, _ = setup
    create_user(users, areas=["Communication"], skills=["Clarity"])
    context = RecommendationContext(users.get_profile("recommend_user"), [], [], {"Communication"}, {"Clarity"}, {"context": "listening"})
    scorer = FeatureScorer(activity, MasteryEngine(activity), RecommendationConfig())
    matched = next(item for item in exercises if "listening" in item.tags)
    unmatched = next(item for item in exercises if "listening" not in item.tags and item.area == "Communication")
    assert scorer.components(matched, context, NOW)["context_relevance"] == 1.0
    assert scorer.components(unmatched, context, NOW)["context_relevance"] == 0.0


def test_weighted_score_is_reproducible(setup):
    _, exercises, users, activity, _, _ = setup
    create_user(users)
    create_goal(users)
    context = RecommendationContext(users.get_profile("recommend_user"), users.goals("recommend_user"), [], {"Confidence"}, {"Self-Efficacy"})
    scorer = FeatureScorer(activity, MasteryEngine(activity), RecommendationConfig())
    components = scorer.components(exercises[0], context, NOW)
    assert scorer.score(components) == scorer.score(components)


def test_top_k_and_diversity(setup):
    _, _, users, _, _, recommender = setup
    create_user(users, areas=["Confidence", "Communication"], skills=["Self-Efficacy", "Active Listening"])
    result = recommender.recommend(RecommendationRequest(user_id="recommend_user", limit=3), NOW)
    assert len(result.recommendations) <= 3
    assert len({item.exercise_id for item in result.recommendations}) == len(result.recommendations)


def test_fallback_is_available_for_unselected_area(setup):
    _, _, users, _, _, recommender = setup
    create_user(users, areas=["Nonexistent area"], skills=["Nonexistent skill"])
    result = recommender.recommend(RecommendationRequest(user_id="recommend_user", limit=1), NOW)
    assert len(result.recommendations) == 1
    assert result.recommendations[0].score >= 0


def test_explicit_area_and_skill_request(setup):
    _, _, users, _, _, recommender = setup
    create_user(users)
    result = recommender.recommend(RecommendationRequest(user_id="recommend_user", requested_area="Communication", requested_skill="Active Listening", limit=5), NOW)
    assert result.recommendations
    assert all(item.area == "Communication" or item.skill == "Active Listening" for item in result.recommendations)


def test_explanation_and_result_contract(setup):
    _, _, users, _, _, recommender = setup
    create_user(users)
    result = recommender.recommend(RecommendationRequest(user_id="recommend_user", limit=1), NOW)
    recommendation = result.recommendations[0]
    assert result.strategy == "rule_based_weighted"
    assert set(recommendation.score_components) == {"goal_relevance", "skill_relevance", "mastery_relevance", "context_relevance", "recency", "novelty", "usefulness", "difficulty"}
    assert recommendation.reason.startswith("This exercise")


def test_invalid_user_and_request_are_rejected(setup):
    _, _, _, _, _, recommender = setup
    with pytest.raises(ValueError, match="unknown user_id"):
        recommender.recommend(RecommendationRequest(user_id="missing_user"), NOW)
    with pytest.raises(ValueError):
        RecommendationRequest(user_id="bad user", limit=1)


def test_multiple_users_are_isolated(setup):
    _, _, users, _, _, recommender = setup
    create_user(users, "user_a", ["Confidence"], ["Self-Efficacy"])
    create_user(users, "user_b", ["Communication"], ["Active Listening"])
    result_a = recommender.recommend(RecommendationRequest(user_id="user_a", limit=1), NOW)
    result_b = recommender.recommend(RecommendationRequest(user_id="user_b", limit=1), NOW)
    assert result_a.user_id == "user_a"
    assert result_b.user_id == "user_b"
    assert result_a.recommendations[0].area != result_b.recommendations[0].area


def test_multiple_goals_are_considered(setup):
    _, _, users, _, _, recommender = setup
    create_user(users, areas=["Confidence", "Communication"], skills=["Self-Efficacy", "Clarity"])
    create_goal(users, area="Confidence", skill="Self-Efficacy", goal_id="goal_confidence")
    create_goal(users, area="Communication", skill="Clarity", goal_id="goal_clarity")
    result = recommender.recommend(RecommendationRequest(user_id="recommend_user", limit=5), NOW)
    assert result.recommendations
    assert any(item.area == "Confidence" for item in result.recommendations)
    assert any(item.area == "Communication" for item in result.recommendations)


def test_config_load_and_direct_diversity(setup):
    _, exercises, _, _, _, _ = setup
    config = load_recommendation_config("config/recommendation.json")
    assert config.goal_relevance == 0.20
    ranked = [(exercise, 0.5, {}) for exercise in exercises[:4]]
    result = diversify(ranked, 2, True, True)
    assert len(result) == 2


def test_prerequisite_filtering(setup):
    _, exercises, users, activity, _, _ = setup
    create_user(users)
    context = RecommendationContext(users.get_profile("recommend_user"), [], [], {"Self-Awareness"}, {"Values Awareness"})
    candidates = [item for item in exercises if item.area == "Self-Awareness"]
    filtered = HardFilter(activity, RecommendationConfig()).apply(candidates, context, NOW)
    assert all(not item.prerequisites for item in filtered)
