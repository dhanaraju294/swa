from datetime import datetime, timedelta, timezone

import pytest

from swa_engine.activity_repository import ActivityRepository
from swa_engine.loader import load_repository
from swa_engine.nlp_models import NLPInput
from swa_engine.nlp_pipeline import ExplainableNLPBaseline
from swa_engine.pattern_config import PatternConfig, load_pattern_config
from swa_engine.pattern_engine import PatternEngine
from swa_engine.pattern_models import PatternStatus
from swa_engine.pattern_repository import PatternRepository
from swa_engine.pattern_service import PatternService
from swa_engine.persistence import SQLitePersistence
from swa_engine.services import ActivityService
from swa_engine.user_models import AttemptStatus, ExerciseAttempt, EventType, ExerciseEvent

NOW = datetime(2026, 8, 21, 12, tzinfo=timezone.utc)


@pytest.fixture
def context():
    database = SQLitePersistence(":memory:")
    exercises = load_repository().all()
    activity = ActivityRepository(database, exercises)
    service = ActivityService(activity)
    engine = PatternEngine(exercises, load_pattern_config("config/patterns.json"))
    return database, exercises, activity, service, engine


def save_attempt(activity, user_id, attempt_id, exercise_id, status=AttemptStatus.completed, days_ago=1, usefulness=5, difficulty=2, hour=10):
    started = NOW - timedelta(days=days_ago)
    started = started.replace(hour=hour)
    activity.save_attempt(ExerciseAttempt(attempt_id=attempt_id, user_id=user_id, exercise_id=exercise_id, started_at=started, completed_at=started + timedelta(minutes=10) if status == AttemptStatus.completed else None, status=status, usefulness_rating=usefulness, difficulty_rating=difficulty))


def patterns(context, user_id="pattern_test_user"):
    _, _, activity, _, engine = context
    return {pattern.pattern_type: pattern for pattern in engine.analyze(user_id, activity.attempts(user_id), activity.events(user_id), NOW)}


def test_completion_skip_and_abandonment_rates(context):
    _, _, activity, _, _ = context
    for index in range(3):
        save_attempt(activity, "rate_user", f"complete_{index}", "sa_values_01", days_ago=index + 1)
    save_attempt(activity, "rate_user", "skip_1", "sa_strengths_01", AttemptStatus.skipped)
    save_attempt(activity, "rate_user", "abandon_1", "sa_emotion_01", AttemptStatus.abandoned)
    detected = patterns(context, "rate_user")
    assert detected["high_completion"].evidence["completed"] == 3
    assert detected["high_skip_rate"].evidence["skipped"] == 1
    assert detected["high_abandonment_rate"].evidence["abandoned"] == 1


def test_short_and_long_exercise_preference(context):
    _, _, activity, _, _ = context
    for index, exercise_id in enumerate(("sa_values_01", "sa_strengths_01", "sa_emotion_01")):
        save_attempt(activity, "short_user", f"short_{index}", exercise_id)
    detected = patterns(context, "short_user")
    assert detected["prefers_short_exercises"].status == PatternStatus.active.value
    assert detected["prefers_short_exercises"].evidence["short"] == 3


def test_exercise_type_preference(context):
    _, _, activity, _, _ = context
    for index, exercise_id in enumerate(("sa_strengths_01", "sa_reflect_01", "cm_feedback_02")):
        save_attempt(activity, "reflection_user", f"reflection_{index}", exercise_id)
    detected = patterns(context, "reflection_user")
    assert detected["prefers_reflection"].status == PatternStatus.active.value
    assert detected["prefers_reflection"].evidence["completed_count"] == 3


def test_difficulty_behavior(context):
    _, _, activity, _, _ = context
    for index, exercise_id in enumerate(("cm_difficult_02", "rs_conflict_02", "cg_decision_01")):
        save_attempt(activity, "hard_user", f"hard_{index}", exercise_id, AttemptStatus.abandoned, difficulty=5)
    detected = patterns(context, "hard_user")
    assert detected["frequently_abandons_difficult_exercises"].status == PatternStatus.active.value
    assert detected["frequently_abandons_difficult_exercises"].evidence["abandoned"] == 3


def test_easy_completion_evidence_is_labeled_correctly(context):
    _, _, activity, _, _ = context
    for index, exercise_id in enumerate(("sa_strengths_01", "sa_values_01", "co_efficacy_01")):
        save_attempt(activity, "easy_user", f"easy_{index}", exercise_id)
    pattern = patterns(context, "easy_user")["frequently_completes_easy_exercises"]
    assert pattern.evidence["easy_attempts"] == 3


def test_time_pattern(context):
    _, _, activity, _, _ = context
    for index in range(3):
        save_attempt(activity, "time_user", f"time_{index}", "sa_values_01", days_ago=index + 1, hour=9)
    detected = patterns(context, "time_user")
    assert detected["preferred_time_period"].status == PatternStatus.active.value
    assert detected["preferred_time_period"].evidence["period"] == "morning"


def test_repeated_area_and_skill(context):
    _, _, activity, _, _ = context
    for index, exercise_id in enumerate(("cm_clear_01", "cm_clear_02", "cm_feedback_01")):
        save_attempt(activity, "focus_user", f"focus_{index}", exercise_id)
    detected = patterns(context, "focus_user")
    assert detected["repeated_focus_area"].evidence["area"] == "Communication"
    assert detected["repeated_focus_skill"].evidence["area"] == "Communication"


def test_increasing_and_declining_activity(context):
    _, _, activity, _, _ = context
    for index in range(3):
        save_attempt(activity, "increase_user", f"increase_old_{index}", "sa_values_01", days_ago=25 - index)
    for index in range(5):
        save_attempt(activity, "increase_user", f"increase_new_{index}", "sa_values_01", days_ago=5 - index)
    increasing = patterns(context, "increase_user")
    assert increasing["increasing_activity"].status == PatternStatus.active.value
    for index in range(5):
        save_attempt(activity, "decline_user", f"decline_old_{index}", "sa_values_01", days_ago=20 - index)
    save_attempt(activity, "decline_user", "decline_new", "sa_values_01", days_ago=2)
    declining = patterns(context, "decline_user")
    assert declining["declining_activity"].status == PatternStatus.active.value


def test_inconsistent_activity(context):
    _, _, activity, _, _ = context
    for index, days_ago in enumerate((1, 10, 20)):
        save_attempt(activity, "irregular_user", f"irregular_{index}", "sa_values_01", days_ago=days_ago)
    detected = patterns(context, "irregular_user")
    assert detected["inconsistent_activity"].status == PatternStatus.active.value


def test_usefulness_and_difficulty_mismatch(context):
    _, _, activity, _, _ = context
    for index in range(3):
        save_attempt(activity, "feedback_user", f"feedback_{index}", "sa_values_01", usefulness=5, difficulty=5)
    detected = patterns(context, "feedback_user")
    assert detected["consistently_high_usefulness"].status == PatternStatus.active.value


def test_repeated_nlp_context(context):
    _, _, activity, _, engine = context
    nlp = ExplainableNLPBaseline()
    results = [nlp.analyze(NLPInput(user_id="nlp_user", text="I feel nervous about my presentation.", timestamp=NOW - timedelta(days=index), source="reflection")) for index in range(3)]
    detected = engine.analyze("nlp_user", [], [], NOW, results)
    repeated = next(pattern for pattern in detected if pattern.pattern_type == "repeated_context")
    assert repeated.status == PatternStatus.active.value
    assert repeated.evidence["occurrences"] >= 3


def test_minimum_evidence_and_empty_history(context):
    detected = patterns(context, "empty_user")
    assert detected["high_completion"].status == PatternStatus.insufficient_evidence.value
    assert detected["high_completion"].confidence == 0


def test_confidence_is_bounded_and_explainable(context):
    _, _, activity, _, _ = context
    for index in range(3):
        save_attempt(activity, "confidence_user", f"confidence_{index}", "sa_values_01")
    pattern = patterns(context, "confidence_user")["high_completion"]
    assert 0 <= pattern.confidence <= 1
    assert pattern.evidence["total_attempts"] == 3
    assert pattern.metadata["observation"] == "product interaction pattern"


def test_inactivity_status(context):
    _, _, activity, _, _ = context
    for index in range(3):
        save_attempt(activity, "old_user", f"old_{index}", "sa_values_01", days_ago=100 + index)
    pattern = patterns(context, "old_user")["high_completion"]
    assert pattern.status == PatternStatus.inactive.value


def test_duplicate_events_are_safe(context):
    _, _, activity, service, engine = context
    event = ExerciseEvent(event_id="duplicate_pattern_event", user_id="duplicate_user", exercise_id="sa_values_01", event_type=EventType.exercise_completed, timestamp=NOW, session_id="pattern_session")
    activity.save_event(event)
    activity.save_event(event)
    result = engine.analyze("duplicate_user", activity.attempts("duplicate_user"), activity.events("duplicate_user"), NOW)
    high_completion = next(pattern for pattern in result if pattern.pattern_type == "high_completion")
    assert high_completion.evidence_count < 3


def test_multiple_users_and_history(context):
    database, _, activity, _, engine = context
    for index in range(3):
        save_attempt(activity, "history_a", f"history_a_{index}", "sa_values_01")
    repository = PatternRepository(database)
    service = PatternService(activity, engine, repository)
    service.analyze_users(["history_a", "history_b"], NOW)
    assert repository.history("history_a")
    assert repository.history("history_b")
    assert all(snapshot.status == PatternStatus.insufficient_evidence.value for snapshot in repository.history("history_b"))


def test_pattern_service_groups_status(context):
    _, _, activity, _, engine = context
    for index in range(3):
        save_attempt(activity, "group_user", f"group_{index}", "sa_values_01")
    grouped = PatternService(activity, engine).grouped("group_user", NOW)
    assert "active" in grouped
    assert all(pattern.status == "active" for pattern in grouped["active"])


def test_configurable_pattern_definitions(context):
    config = PatternConfig(minimum_attempts=2, pattern_types=("high_completion",))
    engine = PatternEngine(load_repository().all(), config)
    _, _, activity, _, _ = context
    for index in range(2):
        save_attempt(activity, "config_user", f"config_{index}", "sa_values_01")
    result = engine.analyze("config_user", activity.attempts("config_user"), [], NOW)
    assert len(result) == 1
    assert result[0].pattern_type == "high_completion"
