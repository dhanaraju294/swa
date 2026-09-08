from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from swa_engine.interaction_models import ExerciseOutcome, InteractionEvent, InteractionEventType
from swa_engine.interaction_repository import InteractionEventRepository
from swa_engine.learning_dataset import LearningDatasetConfig, LearningTarget, build_training_rows
from swa_engine.learning_quality import sequence_issues
from swa_engine.phase2_loader import create_phase2_repositories
from swa_engine.retraining_guard import RetrainingRequirements, assess_retraining


NOW = datetime(2026, 8, 22, 12, tzinfo=timezone.utc)


def event(event_id="p13_event", event_type=InteractionEventType.recommendation_shown, **updates):
    values = {"event_id": event_id, "user_id": "phase13_user", "recommendation_id": "phase13_rec", "exercise_id": "co_efficacy_01", "timestamp": NOW, "event_type": event_type, "model_version": "baseline", "recommendation_version": "1.0.0", "difficulty": 2, "area": "Confidence", "skill": "Self-Efficacy", "exercise_type": "reflection", "pre_features": {"mastery_score": 0.2}}
    values.update(updates)
    return InteractionEvent(**values)


def test_feedback_and_outcome_ranges():
    assert ExerciseOutcome(usefulness_rating=5, completion_duration=600)
    with pytest.raises(ValidationError):
        ExerciseOutcome(difficulty_rating=6)
    with pytest.raises(ValidationError):
        ExerciseOutcome(completion_duration=604801)


def test_event_repository_is_shared_and_immutable():
    users, activity, database = create_phase2_repositories()
    repository = InteractionEventRepository(database, activity._exercises.values())
    saved = repository.create(event())
    assert repository.get_user_events(saved.user_id)[0].event_id == saved.event_id
    with pytest.raises(ValueError, match="already exists"):
        repository.create(saved)
    database.close()


def test_event_validation_and_sequence():
    with pytest.raises(ValidationError):
        event(event_type="NOT_CONTROLLED")
    assert sequence_issues([event(event_id="orphan", event_type=InteractionEventType.exercise_completed)])


def test_dataset_uses_real_observed_outcome_and_target():
    shown = event(pre_features={"mastery_score": 0.2})
    started = event(event_id="started", event_type=InteractionEventType.exercise_started)
    completed = event(event_id="completed", event_type=InteractionEventType.exercise_completed, outcome=ExerciseOutcome(completion_status="completed", usefulness_rating=5))
    rows = build_training_rows([shown, started, completed], LearningDatasetConfig(target=LearningTarget.useful))
    assert len(rows) == 1
    assert rows[0]["target"] == 1.0


def test_dataset_rejects_target_leakage():
    shown = event(pre_features={"target": 1.0})
    completed = event(event_id="completed", event_type=InteractionEventType.exercise_completed, outcome=ExerciseOutcome(completion_status="completed"))
    with pytest.raises(ValueError, match="target leakage"):
        build_training_rows([shown, completed])


def test_retraining_guard_blocks_small_real_dataset():
    result = assess_retraining([event()], RetrainingRequirements(min_real_interactions=2, min_unique_users=1, min_completed_exercises=1))
    assert result["eligible"] is False
    assert result["message"] == "Insufficient real-world data for retraining."