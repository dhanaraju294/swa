from collections import Counter
from datetime import datetime

from .interaction_models import InteractionEvent, InteractionEventType


def validate_interaction_data(events: list[InteractionEvent]) -> dict:
    ids = [event.event_id for event in events]
    duplicate_count = len(ids) - len(set(ids))
    missing_context = sum(event.event_type in {InteractionEventType.exercise_started.value, InteractionEventType.exercise_completed.value} and not any(previous.recommendation_id == event.recommendation_id and previous.event_type == InteractionEventType.recommendation_shown.value for previous in events) for event in events)
    invalid_versions = sum(not event.model_version for event in events if event.event_type == InteractionEventType.recommendation_shown.value)
    return {"event_count": len(events), "duplicate_events": duplicate_count, "missing_recommendation_context": missing_context, "missing_model_versions": invalid_versions, "event_types": dict(Counter(event.event_type for event in events)), "passed": duplicate_count == 0 and missing_context == 0}


def sequence_issues(events: list[InteractionEvent]) -> list[str]:
    shown = {event.recommendation_id for event in events if event.event_type == InteractionEventType.recommendation_shown.value}
    return [f"{event.event_id}: outcome has no recommendation context" for event in events if event.event_type != InteractionEventType.recommendation_shown.value and event.recommendation_id not in shown]