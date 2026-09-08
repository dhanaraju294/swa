from datetime import datetime, timezone

from .activity_repository import ActivityRepository
from .mastery_engine import MasteryEngine
from .models import Exercise
from .recommendation_candidates import CandidateGenerator, RecommendationContext
from .recommendation_config import RecommendationConfig
from .recommendation_diversity import diversify
from .recommendation_explanations import explain
from .recommendation_filters import HardFilter
from .recommendation_models import Recommendation, RecommendationRequest, RecommendationResult
from .recommendation_ranking import RecommendationRanker
from .recommendation_scoring import FeatureScorer
from .taxonomy import Taxonomy
from .user_models import GoalStatus, UserProfile, UserSkillState
from .user_repository import UserRepository


class RecommendationEngine:
    def __init__(self, exercises: list[Exercise], users: UserRepository, activity: ActivityRepository, mastery: MasteryEngine, taxonomy: Taxonomy | None = None, config: RecommendationConfig | None = None) -> None:
        self._exercises = exercises
        self._users = users
        self._activity = activity
        self._mastery = mastery
        self._taxonomy = taxonomy
        self._config = config or RecommendationConfig()
        self._generator = CandidateGenerator()
        self._filters = HardFilter(activity, self._config)
        self._scorer = FeatureScorer(activity, mastery, self._config)
        self._ranker = RecommendationRanker(self._scorer)

    def recommend(self, request: RecommendationRequest, now: datetime | None = None) -> RecommendationResult:
        now = now or datetime.now(timezone.utc)
        context = self._context(request)
        candidates = self._generator.generate(self._exercises, context)
        filtered = self._filters.apply(candidates, context, now)
        if not filtered:
            filtered = self._fallback_candidates(context, now)
        ranked = self._ranker.rank(filtered, context, now)
        selected = diversify(ranked, request.limit, self._config.diversity_types, self._config.diversity_skills)
        recommendations = [Recommendation(exercise_id=exercise.exercise_id, title=exercise.title, area=exercise.area, skill=exercise.skill, difficulty=int(exercise.difficulty), score=score, score_components=components, reason=explain(exercise, components, context)) for exercise, score, components in selected]
        return RecommendationResult(user_id=request.user_id, generated_at=now, recommendations=recommendations, recommendation_version=self._config.recommendation_version, strategy="rule_based_weighted", explanation=f"Ranked {len(candidates)} candidates after configurable goal, skill, mastery, context, history, novelty, usefulness, and difficulty rules.")

    def _context(self, request: RecommendationRequest) -> RecommendationContext:
        profile = self._users.get_profile(request.user_id)
        if profile is None:
            raise ValueError(f"unknown user_id: {request.user_id}")
        goals = self._users.goals(request.user_id)
        states = self._users.skill_states(request.user_id)
        active_goals = [goal for goal in goals if goal.status == GoalStatus.active.value]
        areas = {request.requested_area} if request.requested_area else {goal.area for goal in active_goals} | set(profile.selected_areas)
        skills = {request.requested_skill} if request.requested_skill else {goal.skill for goal in active_goals} | set(profile.selected_skills) | {state.skill for state in states}
        return RecommendationContext(profile, goals, states, {value for value in areas if value}, {value for value in skills if value}, request.current_context)

    def _fallback_candidates(self, context: RecommendationContext, now: datetime) -> list[Exercise]:
        active = sorted((exercise for exercise in self._exercises if exercise.status == "active"), key=lambda exercise: exercise.exercise_id)
        targeted = [exercise for exercise in active if not context.target_areas or exercise.area in context.target_areas or exercise.skill in context.target_skills]
        candidates = targeted or active
        filtered = self._filters.apply(candidates, context, now)
        return filtered or active[:1]
