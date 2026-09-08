from dataclasses import dataclass

from .interaction_models import InteractionEvent
from .learning_dataset import build_training_rows
from .learning_quality import validate_interaction_data


@dataclass(frozen=True)
class RetrainingRequirements:
    min_real_interactions: int = 100
    min_unique_users: int = 10
    min_completed_exercises: int = 50


def assess_retraining(events: list[InteractionEvent], requirements: RetrainingRequirements | None = None) -> dict:
    requirements = requirements or RetrainingRequirements()
    real = [event for event in events if event.data_source == "real"]
    completed = [event for event in real if event.event_type == "EXERCISE_COMPLETED"]
    quality = validate_interaction_data(real)
    checks = {"real_interactions": len(real) >= requirements.min_real_interactions, "unique_users": len({event.user_id for event in real}) >= requirements.min_unique_users, "completed_exercises": len(completed) >= requirements.min_completed_exercises, "data_quality": quality["passed"], "dataset_rows": bool(build_training_rows(real))}
    return {"eligible": all(checks.values()), "checks": checks, "message": "Eligible for controlled evaluation" if all(checks.values()) else "Insufficient real-world data for retraining."}