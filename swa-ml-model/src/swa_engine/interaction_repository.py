from datetime import datetime

from .interaction_models import InteractionEvent, InteractionEventType
from .persistence import SQLitePersistence


class InteractionEventRepository:
    """Immutable historical interaction storage backed by the shared SQLite adapter."""

    def __init__(self, persistence: SQLitePersistence, exercises) -> None:
        self._db = persistence
        self._exercise_ids = {exercise.exercise_id for exercise in exercises}

    def create(self, event: InteractionEvent) -> InteractionEvent:
        if event.exercise_id not in self._exercise_ids:
            raise ValueError(f"unknown exercise_id: {event.exercise_id}")
        if self._db.rows("interaction_events", "event_id = ?", [event.event_id]):
            raise ValueError(f"interaction event already exists: {event.event_id}")
        self._db.upsert("interaction_events", "event_id", event.event_id, event.model_dump(mode="json"), user_id=event.user_id, recommendation_id=event.recommendation_id, exercise_id=event.exercise_id, timestamp=event.timestamp.isoformat())
        return event

    def get_user_events(self, user_id: str, start: datetime | None = None, end: datetime | None = None, event_type: InteractionEventType | str | None = None, limit: int | None = None) -> list[InteractionEvent]:
        rows = self._db.rows("interaction_events", "user_id = ?", [user_id])
        events = [InteractionEvent.model_validate_json(row["payload"]) for row in rows]
        expected_type = getattr(event_type, "value", event_type)
        events = [event for event in events if (start is None or event.timestamp >= start) and (end is None or event.timestamp <= end) and (expected_type is None or event.event_type == expected_type)]
        events.sort(key=lambda event: (event.timestamp, event.event_id), reverse=True)
        return events[:limit] if limit else events

    def get_exercise_events(self, exercise_id: str) -> list[InteractionEvent]:
        return self._filter_column("exercise_id", exercise_id)

    def all_events(self) -> list[InteractionEvent]:
        return [InteractionEvent.model_validate_json(row["payload"]) for row in self._db.rows("interaction_events")]

    def get_recommendation_events(self, recommendation_id: str) -> list[InteractionEvent]:
        return self._filter_column("recommendation_id", recommendation_id)

    def _filter_column(self, column: str, value: str) -> list[InteractionEvent]:
        return [InteractionEvent.model_validate_json(row["payload"]) for row in self._db.rows("interaction_events", f"{column} = ?", [value])]