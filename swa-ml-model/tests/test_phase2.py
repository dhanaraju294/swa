from datetime import datetime, timedelta, timezone

import pytest
from pydantic import ValidationError

from swa_engine.activity_repository import ActivityRepository
from swa_engine.loader import load_repository
from swa_engine.persistence import SQLitePersistence
from swa_engine.services import ActivityService
from swa_engine.user_models import (
    AttemptStatus,
    EventType,
    ExerciseAttempt,
    ExerciseEvent,
    GoalPriority,
    GoalStatus,
    Trend,
    UserGoal,
    UserProfile,
    UserSkillState,
)
from swa_engine.user_repository import UserRepository


@pytest.fixture
def context():
    database = SQLitePersistence(":memory:")
    users = UserRepository(database)
    activity = ActivityRepository(database, load_repository().all())
    return users, activity, ActivityService(activity), database


def profile(user_id="user_test_01"):
    now = datetime.now(timezone.utc)
    return UserProfile(user_id=user_id, created_at=now, updated_at=now, selected_areas=["Confidence"], selected_skills=["Self-Efficacy"], baseline_scores={"Confidence/Self-Efficacy": 45}, preferences={"preferred_minutes": 15}, onboarding_data={"completed": True})


def attempt(status=AttemptStatus.started, user_id="user_test_01", exercise_id="co_efficacy_01"):
    started = datetime(2026, 8, 20, 10, 0, tzinfo=timezone.utc)
    return ExerciseAttempt(attempt_id=f"attempt_{status}", user_id=user_id, exercise_id=exercise_id, started_at=started, completed_at=started + timedelta(minutes=10) if status == AttemptStatus.completed else None, status=status, duration_seconds=600 if status == AttemptStatus.completed else None, difficulty_rating=3, usefulness_rating=4, before_score=40, after_score=55 if status == AttemptStatus.completed else None, reflection_text="I noticed the first step was smaller than I expected." if status == AttemptStatus.completed else None)


def test_create_and_update_user(context):
    users, _, _, _ = context
    saved = users.save_profile(profile())
    assert users.get_profile(saved.user_id).baseline_scores["Confidence/Self-Efficacy"] == 45
    updated = saved.model_copy(update={"updated_at": datetime.now(timezone.utc), "preferences": {"preferred_minutes": 10}})
    users.save_profile(updated)
    assert users.get_profile(saved.user_id).preferences["preferred_minutes"] == 10


def test_create_and_validate_goals(context):
    users, _, _, _ = context
    users.save_profile(profile())
    goal = UserGoal(goal_id="goal_test_01", user_id="user_test_01", area="Confidence", skill="Self-Efficacy", priority=GoalPriority.high, status=GoalStatus.active, created_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    users.save_goal(goal)
    assert users.goals("user_test_01")[0].priority == 3
    with pytest.raises(ValidationError):
        UserGoal.model_validate({**goal.model_dump(), "priority": 4})


def test_create_skill_state():
    state = UserSkillState(user_id="user_test_01", area="Confidence", skill="Self-Efficacy", mastery_score=0.42, confidence_score=50, evidence_count=2, trend=Trend.unknown, updated_at=datetime.now(timezone.utc))
    assert state.mastery_score == 0.42
    assert state.evidence_confidence == 0.5
    with pytest.raises(ValidationError):
        UserSkillState.model_validate({**state.model_dump(), "mastery_score": 1.01})


def test_event_validation_and_types():
    event = ExerciseEvent(event_id="event_test_01", user_id="user_test_01", exercise_id="co_efficacy_01", event_type=EventType.exercise_started, timestamp=datetime.now(timezone.utc), session_id="session_test_01", metadata={"source": "test"})
    assert event.event_type == "exercise_started"
    with pytest.raises(ValidationError):
        ExerciseEvent.model_validate({**event.model_dump(), "event_type": "exercise_predicted"})


def test_attempt_creation_and_statuses(context):
    _, activity, service, _ = context
    for status in AttemptStatus:
        current = attempt(status, exercise_id=f"co_efficacy_0{1 if status == AttemptStatus.started else 2}")
        if status == AttemptStatus.completed:
            service.record_attempt(current, "session_test_01")
        else:
            activity.save_attempt(current)
    assert len(activity.attempts("user_test_01")) == 4
    assert len(activity.completed_exercises("user_test_01")) == 1
    assert len(activity.skipped_exercises("user_test_01")) == 1
    assert len(activity.abandoned_exercises("user_test_01")) == 1


def test_record_rating_and_reflection(context):
    _, activity, service, _ = context
    service.record_rating("user_test_01", "co_efficacy_01", "session_test_01", difficulty=4, usefulness=5, timestamp=datetime.now(timezone.utc))
    service.record_reflection("user_test_01", "co_efficacy_01", "session_test_01", "The evidence felt concrete.", timestamp=datetime.now(timezone.utc))
    assert len(activity.ratings("user_test_01")) == 1
    assert len(activity.reflections("user_test_01")) == 1
    events = activity.events(user_id="user_test_01")
    assert {event.event_type for event in events} == {"exercise_rated", "exercise_reflected"}
    assert events[0].metadata


def test_history_filters_by_event_area_skill_and_time(context):
    _, activity, service, _ = context
    timestamp = datetime(2026, 8, 21, 12, 0, tzinfo=timezone.utc)
    service.record_attempt(attempt(AttemptStatus.completed, exercise_id="co_efficacy_01"), "session_test_01")
    service.record_rating("user_test_01", "cm_listen_01", "session_test_02", difficulty=2, usefulness=3, timestamp=timestamp)
    assert len(activity.events(user_id="user_test_01", event_type=EventType.exercise_rated)) == 1
    assert len(activity.events(user_id="user_test_01", area="Communication")) == 1
    assert len(activity.events(user_id="user_test_01", skill="Active Listening")) == 1
    assert len(activity.events(user_id="user_test_01", start=timestamp - timedelta(minutes=1), end=timestamp + timedelta(minutes=1))) == 1


def test_persistence_and_retrieval(context):
    users, activity, service, database = context
    users.save_profile(profile("persistent_user"))
    assert users.get_profile("persistent_user").user_id == "persistent_user"
    saved = service.record_attempt(attempt(AttemptStatus.completed, user_id="persistent_user"), "session_persist")
    assert activity.recent_exercises("persistent_user")[0].attempt_id == saved.attempt_id
    database.close()


def test_invalid_activity_references_are_rejected(context):
    _, activity, _, _ = context
    with pytest.raises(ValueError, match="unknown exercise_id"):
        activity.save_event(ExerciseEvent(event_id="event_bad", user_id="user_test_01", exercise_id="missing_exercise", event_type=EventType.exercise_started, timestamp=datetime.now(timezone.utc), session_id="session_test_01"))
