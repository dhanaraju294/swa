from datetime import datetime, timedelta, timezone

import pytest

from swa_engine.activity_repository import ActivityRepository
from swa_engine.difficulty_config import DifficultyConfig
from swa_engine.difficulty_engine import DifficultyEngine, ExerciseDifficultySelector
from swa_engine.difficulty_features import extract_difficulty_evidence
from swa_engine.difficulty_history import DifficultyHistoryRepository
from swa_engine.difficulty_models import DifficultyAction
from swa_engine.difficulty_service import DifficultyService
from swa_engine.loader import load_repository
from swa_engine.persistence import SQLitePersistence
from swa_engine.user_models import AttemptStatus, ExerciseAttempt, UserSkillState

NOW = datetime(2026, 8, 22, 12, tzinfo=timezone.utc)


@pytest.fixture
def context():
    db = SQLitePersistence(":memory:")
    exercises = load_repository().all()
    activity = ActivityRepository(db, exercises)
    return db, exercises, activity


def add(activity, user, index, exercise, status=AttemptStatus.completed, difficulty=3, days=1, rating=None):
    started = NOW - timedelta(days=days)
    activity.save_attempt(ExerciseAttempt(attempt_id=f"p7_{user}_{index}", user_id=user, exercise_id=exercise, started_at=started, completed_at=started if status == AttemptStatus.completed else None, status=status, difficulty_rating=rating or difficulty))


def test_default_cold_start_and_one_event(context):
    _, _, activity = context
    state, decision = DifficultyEngine().decide("new_user", "Confidence", "Self-Efficacy", [], [], now=NOW)
    assert state.recommended_level == 2
    assert decision.action == DifficultyAction.maintain.value
    add(activity, "one_user", 1, "sa_values_01", difficulty=2)
    _, decision = DifficultyEngine().decide("one_user", "Self-Awareness", "Values Awareness", activity.attempts("one_user"), now=NOW)
    assert decision.action == DifficultyAction.maintain.value


def test_repeated_completion_increases_once(context):
    _, _, activity = context
    for i in range(4):
        add(activity, "success_user", i, "sa_values_01", difficulty=2, rating=2)
    state, decision = DifficultyEngine().decide("success_user", "Self-Awareness", "Values Awareness", activity.attempts("success_user"), current_level=2, now=NOW)
    assert decision.action == "increase"
    assert decision.recommended_level == 3
    assert decision.recommended_level - decision.previous_level <= 1


def test_repeated_abandonment_decreases(context):
    _, _, activity = context
    for i in range(4):
        add(activity, "abandon_user", i, "cm_difficult_02", AttemptStatus.abandoned, difficulty=5, rating=5)
    _, decision = DifficultyEngine().decide("abandon_user", "Communication", "Difficult Conversations", activity.attempts("abandon_user"), current_level=4, now=NOW)
    assert decision.action == "decrease"
    assert decision.recommended_level == 3


def test_repeated_skip_decreases_and_maintain(context):
    _, _, activity = context
    for i in range(3):
        add(activity, "skip_user", i, "sa_values_01", AttemptStatus.skipped, difficulty=3)
    _, decision = DifficultyEngine().decide("skip_user", "Self-Awareness", "Values Awareness", activity.attempts("skip_user"), current_level=3, now=NOW)
    assert decision.action == "decrease"
    _, maintain = DifficultyEngine().decide("skip_user", "Self-Awareness", "Values Awareness", [], current_level=3, now=NOW)
    assert maintain.action == "maintain"


def test_ratings_and_feature_rates(context):
    _, _, activity = context
    for i in range(3):
        add(activity, "rating_user", i, "sa_values_01", difficulty=3, rating=4)
    evidence = extract_difficulty_evidence(activity.attempts("rating_user"))
    assert evidence.average_rating == 4
    assert evidence.success_rate == 1


def test_mastery_low_evidence_does_not_force_increase(context):
    _, _, activity = context
    for i in range(4):
        add(activity, "mastery_user", i, "sa_values_01", difficulty=2, rating=2)
    mastery = UserSkillState(user_id="mastery_user", area="Self-Awareness", skill="Values Awareness", mastery_score=0.9, evidence_confidence=0.1, evidence_count=1, updated_at=NOW)
    _, decision = DifficultyEngine().decide("mastery_user", "Self-Awareness", "Values Awareness", activity.attempts("mastery_user"),  current_level=2, mastery_state=mastery, now=NOW)
    assert decision.action == "increase"


def test_behavioral_abandonment_pattern_cautions(context):
    _, _, activity = context
    for i in range(3):
        add(activity, "pattern_user", i, "sa_values_01", difficulty=2)
    pattern = type("Pattern", (), {"pattern_type": "frequently_abandons_difficult_exercises"})()
    _, decision = DifficultyEngine().decide("pattern_user", "Self-Awareness", "Values Awareness", activity.attempts("pattern_user"), current_level=2, behavioral_patterns=[pattern], now=NOW)
    assert decision.action in ("maintain", "decrease")


def test_skill_specific_levels_and_bounds(context):
    _, exercises, activity = context
    for i in range(5):
        add(activity, "skills_user", i, "sa_values_01", difficulty=2, rating=2)
    _, increase = DifficultyEngine().decide("skills_user", "Self-Awareness", "Values Awareness", activity.attempts("skills_user"), current_level=4, now=NOW)
    assert increase.recommended_level == 5
    _, decrease = DifficultyEngine().decide("skills_user", "Self-Awareness", "Values Awareness", [ExerciseAttempt(attempt_id="only_fail", user_id="skills_user", exercise_id="sa_values_01", started_at=NOW, status=AttemptStatus.abandoned, difficulty_rating=5)], current_level=1, now=NOW)
    assert decrease.recommended_level == 1
    assert ExerciseDifficultySelector(exercises).suitable("Self-Awareness", "Values Awareness", 2)


def test_recency_old_failures_do_not_permanently_reduce(context):
    _, _, activity = context
    for i in range(3):
        add(activity, "recent_user", i, "sa_values_01", AttemptStatus.abandoned, difficulty=4, days=100 + i, rating=5)
    for i in range(3):
        add(activity, "recent_user", i + 3, "sa_values_01", AttemptStatus.completed, difficulty=2, days=i + 1, rating=2)
    _, decision = DifficultyEngine(DifficultyConfig(minimum_evidence=3)).decide("recent_user", "Self-Awareness", "Values Awareness", activity.attempts("recent_user"), current_level=2, now=NOW)
    assert decision.action != "decrease"


def test_history_and_service(context):
    db, _, activity = context
    for i in range(3):
        add(activity, "history_user", i, "sa_values_01", difficulty=2, rating=2)
    history = DifficultyHistoryRepository(db)
    service = DifficultyService(activity, DifficultyEngine(), history)
    _, decision = service.decide("history_user", "Self-Awareness", "Values Awareness", 2, NOW)
    records = history.list("history_user")
    assert records[0].new_level == decision.recommended_level


def test_missing_evidence_safe_and_explanation(context):
    _, _, activity = context
    _, decision = DifficultyEngine().decide("missing_user", "Confidence", "Self-Efficacy", [], mastery_state=None, behavioral_patterns=None, now=NOW)
    assert decision.reasons
    assert decision.evidence["average_difficulty_rating"] is None
