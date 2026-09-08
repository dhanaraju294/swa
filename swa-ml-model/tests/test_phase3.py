from datetime import datetime, timedelta, timezone

import pytest
from pydantic import ValidationError

from swa_engine.activity_repository import ActivityRepository
from swa_engine.loader import load_repository
from swa_engine.mastery_config import load_mastery_weights
from swa_engine.mastery_engine import MasteryEngine
from swa_engine.mastery_repository import MasteryRepository
from swa_engine.persistence import SQLitePersistence
from swa_engine.scoring import MasteryScorer, MasteryWeights
from swa_engine.services import ActivityService
from swa_engine.user_models import AttemptStatus, ExerciseAttempt, EventType, ExerciseEvent, Trend


BASE = datetime(2026, 8, 21, 12, 0, tzinfo=timezone.utc)


@pytest.fixture
def context():
    db = SQLitePersistence(":memory:")
    activity = ActivityRepository(db, load_repository().all())
    return db, activity, ActivityService(activity)


def make_attempt(index=1, status=AttemptStatus.completed, area_skill=("Self-Awareness", "Values Awareness"), day=21, before=40, after=50, usefulness=4, difficulty=3, user_id="user_test_01"):
    exercise = {("Self-Awareness", "Values Awareness"): "sa_values_01", ("Communication", "Active Listening"): "cm_listen_01", ("Confidence", "Self-Efficacy"): "co_efficacy_01"}[area_skill]
    started = BASE - timedelta(days=BASE.day - day, hours=9)
    return ExerciseAttempt(attempt_id=f"p3_attempt_{user_id}_{index}", user_id=user_id, exercise_id=exercise, started_at=started, completed_at=started + timedelta(minutes=10) if status == AttemptStatus.completed else None, status=status, duration_seconds=600 if status == AttemptStatus.completed else None, before_score=before, after_score=after if status == AttemptStatus.completed else None, usefulness_rating=usefulness, difficulty_rating=difficulty, reflection_text="A useful reflection." if status == AttemptStatus.completed else None)


def engine_for(activity, weights=None):
    return MasteryEngine(activity, MasteryScorer(weights or MasteryWeights()))


def test_new_user_has_unknown_state(context):
    _, activity, _ = context
    state, explanation, _ = engine_for(activity).calculate("new_user", "Self-Awareness", "Values Awareness", BASE)
    assert state.mastery_score == 0
    assert state.evidence_confidence == 0
    assert state.trend == "insufficient_data"
    assert explanation.evidence["evidence_count"] == 0


def test_single_completed_exercise(context):
    _, activity, service = context
    service.record_attempt(make_attempt(), "session_one")
    state, explanation, _ = engine_for(activity).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    assert 0 < state.mastery_score <= 1
    assert state.evidence_count == 1
    assert explanation.evidence["completed_exercises"] == 1


def test_repeated_completed_exercises_raise_evidence_confidence(context):
    _, activity, service = context
    for index, day in enumerate((18, 19, 20, 21), 1):
        service.record_attempt(make_attempt(index, day=day), "session_repeat")
    state, _, _ = engine_for(activity).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    assert state.evidence_count == 4
    assert state.evidence_confidence > 0.3


def test_skipped_and_abandoned_are_evidence_without_progress(context):
    _, activity, service = context
    service.record_attempt(make_attempt(1, AttemptStatus.skipped), "session_skip")
    service.record_attempt(make_attempt(2, AttemptStatus.abandoned), "session_abandon")
    state, explanation, _ = engine_for(activity).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    assert state.evidence_count == 2
    assert state.mastery_score < 0.5
    assert explanation.evidence["completed_exercises"] == 0


def test_usefulness_and_difficulty_signals_are_explained(context):
    _, activity, service = context
    service.record_attempt(make_attempt(usefulness=5, difficulty=4), "session_rating")
    state, explanation, _ = engine_for(activity).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    assert state.mastery_score > 0
    assert explanation.evidence["useful_exercises"] == 1
    assert explanation.evidence["difficulty_ratings"] == 1


def test_before_after_positive_negative_and_missing_scores():
    scorer = MasteryScorer()
    positive = scorer._improvement(20, 80)
    negative = scorer._improvement(80, 20)
    assert positive == 0.8
    assert negative == 0.2
    assert scorer._improvement(None, 20) is None
    assert scorer._improvement(20, None) is None
    with pytest.raises(ValidationError):
        make_attempt(before=101)


def test_recency_weighting_is_configurable(context):
    _, activity, service = context
    service.record_attempt(make_attempt(1, day=1, before=0, after=0), "session_old")
    service.record_attempt(make_attempt(2, day=21, before=0, after=100), "session_new")
    weights = MasteryWeights(recency_half_life_days=5)
    state, _, _ = engine_for(activity, weights).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    assert state.mastery_score > 0.5
    assert load_mastery_weights("config/mastery.json").recency_half_life_days == 30.0


def test_consistency_and_evidence_confidence(context):
    _, activity, service = context
    service.record_attempt(make_attempt(1, day=18), "session_consistent")
    service.record_attempt(make_attempt(2, day=19), "session_consistent")
    service.record_attempt(make_attempt(3, day=20), "session_consistent")
    state, _, _ = engine_for(activity).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    assert state.evidence_confidence > 0
    assert state.evidence_count == 3


def trend_engine(activity):
    return engine_for(activity, MasteryWeights(completion=0.1, usefulness=0, improvement=0.9, difficulty=0, reflection=0, consistency=0, trend_minimum_observations=2, trend_threshold=0.05))


def test_improving_trend(context):
    _, activity, service = context
    for index, (day, before, after) in enumerate(((1, 0, 0), (2, 0, 0), (20, 0, 50), (21, 0, 60)), 1):
        service.record_attempt(make_attempt(index, day=day, before=before, after=after), "session_trend")
    state, _, _ = trend_engine(activity).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    assert state.trend == "improving"


def test_stable_trend(context):
    _, activity, service = context
    for index, day in enumerate((1, 2, 20, 21), 1):
        service.record_attempt(make_attempt(index, day=day, before=0, after=50), "session_stable")
    state, _, _ = trend_engine(activity).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    assert state.trend == "stable"


def test_declining_trend(context):
    _, activity, service = context
    for index, (day, before, after) in enumerate(((1, 0, 80), (2, 0, 80), (20, 0, 20), (21, 0, 10)), 1):
        service.record_attempt(make_attempt(index, day=day, before=before, after=after), "session_decline")
    state, _, _ = trend_engine(activity).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    assert state.trend == "declining"


def test_insufficient_data_trend_for_one_event(context):
    _, activity, service = context
    service.record_attempt(make_attempt(), "session_one")
    state, _, _ = engine_for(activity).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    assert state.trend == "insufficient_data"


def test_mastery_history(context):
    db, activity, service = context
    service.record_attempt(make_attempt(), "session_history")
    _, _, snapshot = engine_for(activity).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    history = MasteryRepository(db)
    history.save_snapshot(snapshot)
    assert history.history("user_test_01", area="Self-Awareness")[0].skill == "Values Awareness"


def test_multiple_skills_and_users(context):
    _, activity, service = context
    service.record_attempt(make_attempt(1, area_skill=("Self-Awareness", "Values Awareness"), user_id="user_a"), "session_a")
    service.record_attempt(make_attempt(2, area_skill=("Communication", "Active Listening"), user_id="user_b"), "session_b")
    engine = engine_for(activity)
    assert engine.calculate("user_a", "Self-Awareness", "Values Awareness", BASE)[0].evidence_count == 1
    assert engine.calculate("user_b", "Communication", "Active Listening", BASE)[0].evidence_count == 1


def test_reflection_event_and_duplicate_event_are_safe(context):
    _, activity, service = context
    service.record_attempt(make_attempt(), "session_edge")
    event = ExerciseEvent(event_id="p3_reflection", user_id="user_test_01", exercise_id="sa_values_01", event_type=EventType.exercise_reflected, timestamp=BASE, session_id="session_edge", metadata={"reflection_text": "Useful."})
    activity.save_event(event)
    activity.save_event(event)
    state, explanation, _ = engine_for(activity).calculate("user_test_01", "Self-Awareness", "Values Awareness", BASE)
    assert state.evidence_count == 1
    assert explanation.evidence["reflections"] == 1


def test_invalid_scores_do_not_enter_attempt_model():
    with pytest.raises(ValidationError):
        make_attempt(after=-1)
