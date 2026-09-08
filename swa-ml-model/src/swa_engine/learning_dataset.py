from dataclasses import dataclass
from enum import Enum

from .interaction_models import InteractionEvent, InteractionEventType


LEAKAGE_FIELDS = {"outcome", "feedback", "target", "completion_status", "completion_duration", "self_rating", "usefulness_rating", "difficulty_rating", "user_feedback"}


class LearningTarget(str, Enum):
    completed = "recommendation_completed"
    useful = "recommendation_useful"
    satisfaction = "recommendation_satisfaction"
    outcome_score = "recommendation_outcome_score"


@dataclass(frozen=True)
class LearningDatasetConfig:
    target: LearningTarget = LearningTarget.outcome_score
    require_real: bool = True


def learning_signal(event: InteractionEvent) -> dict[str, float | None]:
    outcome = event.outcome
    feedback = event.feedback
    has_completion_evidence = outcome is not None or feedback is not None or event.event_type == InteractionEventType.exercise_completed.value
    completed = ((outcome and outcome.completion_status == "completed") or (feedback and feedback.completed is True) or event.event_type == InteractionEventType.exercise_completed.value) if has_completion_evidence else None
    useful = feedback.useful if feedback and feedback.useful is not None else (outcome.usefulness_rating >= 4 if outcome and outcome.usefulness_rating else None)
    satisfaction = feedback.rating / 5 if feedback and feedback.rating else (outcome.self_rating / 5 if outcome and outcome.self_rating else None)
    values = [float(value) for value in (float(completed) if completed is not None else None, float(useful) if useful is not None else None, satisfaction) if value is not None]
    return {"completion": float(completed) if completed is not None else None, "usefulness": float(useful) if useful is not None else None, "satisfaction": satisfaction, "engagement": sum(values) / len(values) if values else None}


def target_value(event: InteractionEvent, target: LearningTarget) -> float | None:
    signal = learning_signal(event)
    return {LearningTarget.completed: signal["completion"], LearningTarget.useful: signal["usefulness"], LearningTarget.satisfaction: signal["satisfaction"], LearningTarget.outcome_score: signal["engagement"]}[target]


def build_training_rows(events: list[InteractionEvent], config: LearningDatasetConfig | None = None) -> list[dict]:
    config = config or LearningDatasetConfig()
    shown = {event.recommendation_id: event for event in events if event.event_type == InteractionEventType.recommendation_shown.value}
    rows = []
    for event in events:
        target = target_value(event, config.target)
        if event.event_type == InteractionEventType.recommendation_shown.value or target is None or (config.require_real and event.data_source != "real"):
            continue
        source = shown.get(event.recommendation_id)
        if not source:
            continue
        leaked = LEAKAGE_FIELDS.intersection(source.pre_features)
        if leaked:
            raise ValueError(f"pre-recommendation features contain target leakage: {sorted(leaked)}")
        row = dict(source.pre_features)
        row.update({"user_id": source.user_id, "recommendation_id": source.recommendation_id, "exercise_id": source.exercise_id, "event_type": event.event_type, "event_timestamp": event.timestamp.isoformat(), "data_source": event.data_source, "target": target})
        rows.append(row)
    return rows