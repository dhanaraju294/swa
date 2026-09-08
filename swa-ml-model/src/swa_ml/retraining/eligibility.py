from collections import Counter

from swa_engine.interaction_models import InteractionEventType
from swa_engine.learning_dataset import build_training_rows
from swa_engine.learning_quality import validate_interaction_data
from .dataset import validate_training_rows


def check_eligibility(events, config) -> dict:
    real = [event for event in events if event.data_source == "real"]
    from swa_engine.learning_dataset import LearningDatasetConfig
    rows = build_training_rows(real, LearningDatasetConfig(target=config.target))
    quality = validate_interaction_data(real)
    schema = validate_training_rows(rows)
    completed = sum(event.event_type == InteractionEventType.exercise_completed.value for event in real)
    targets = Counter(row["target"] for row in rows)
    checks = {"real_interactions": len(real) >= config.min_real_interactions, "unique_users": len({event.user_id for event in real}) >= config.min_unique_users, "completed_exercises": completed >= config.min_completed_exercises, "target_diversity": len(targets) >= config.min_target_diversity, "missing_rate": schema["missing_rate"] <= config.max_missing_rate, "duplicates": quality["duplicate_events"] == 0, "schema": schema["schema_valid"], "leakage": schema["leakage_rows"] == 0, "quality": quality["passed"]}
    return {"eligible": all(checks.values()), "checks": checks, "rows": len(rows), "message": "Eligible for controlled retraining" if all(checks.values()) else "Insufficient real-world data for retraining."}