from datetime import datetime
from typing import Any

from .models import Exercise
from .persistence import SQLitePersistence
from .user_models import EventType, ExerciseAttempt, ExerciseEvent, AttemptStatus


class ActivityRepository:
    def __init__(self, persistence: SQLitePersistence, exercises: list[Exercise]) -> None:
        self._db = persistence
        self._exercises = {exercise.exercise_id: exercise for exercise in exercises}

    def save_event(self, event: ExerciseEvent) -> ExerciseEvent:
        self._validate_references(event.user_id, event.exercise_id)
        self._db.upsert("exercise_events", "event_id", event.event_id, event.model_dump(mode="json"), user_id=event.user_id, timestamp=event.timestamp.isoformat())
        return event

    def save_attempt(self, attempt: ExerciseAttempt) -> ExerciseAttempt:
        self._validate_references(attempt.user_id, attempt.exercise_id)
        self._db.upsert("exercise_attempts", "attempt_id", attempt.attempt_id, attempt.model_dump(mode="json"), user_id=attempt.user_id, exercise_id=attempt.exercise_id)
        return attempt

    def _validate_references(self, user_id: str, exercise_id: str) -> None:
        if not user_id:
            raise ValueError("user_id is required")
        if exercise_id not in self._exercises:
            raise ValueError(f"unknown exercise_id: {exercise_id}")

    def events(self, user_id: str | None = None, area: str | None = None, skill: str | None = None, exercise_id: str | None = None, event_type: EventType | str | None = None, start: datetime | None = None, end: datetime | None = None) -> list[ExerciseEvent]:
        rows = self._db.rows("exercise_events", "user_id = ?" if user_id else "", [user_id] if user_id else [])
        events = [ExerciseEvent.model_validate_json(row["payload"]) for row in rows]
        return [event for event in events if self._matches(event.user_id, event.exercise_id, event.timestamp, area, skill, exercise_id, start, end) and (event_type is None or event.event_type == getattr(event_type, "value", event_type))]

    def attempts(self, user_id: str | None = None, area: str | None = None, skill: str | None = None, exercise_id: str | None = None, status: AttemptStatus | str | None = None) -> list[ExerciseAttempt]:
        rows = self._db.rows("exercise_attempts", "user_id = ?" if user_id else "", [user_id] if user_id else [])
        attempts = [ExerciseAttempt.model_validate_json(row["payload"]) for row in rows]
        return [attempt for attempt in attempts if self._matches(attempt.user_id, attempt.exercise_id, attempt.started_at, area, skill, exercise_id, None, None) and (status is None or attempt.status == status)]

    def _matches(self, user_id: str, exercise_id: str, timestamp: datetime, area: str | None, skill: str | None, target_exercise_id: str | None, start: datetime | None, end: datetime | None) -> bool:
        exercise = self._exercises.get(exercise_id)
        return (not target_exercise_id or exercise_id == target_exercise_id) and (not area or exercise and exercise.area == area) and (not skill or exercise and exercise.skill == skill) and (start is None or timestamp >= start) and (end is None or timestamp <= end)

    def recent_events(self, user_id: str, limit: int = 20) -> list[ExerciseEvent]:
        return sorted(self.events(user_id=user_id), key=lambda event: event.timestamp, reverse=True)[:limit]

    def recent_exercises(self, user_id: str, limit: int = 20) -> list[ExerciseAttempt]:
        return sorted(self.attempts(user_id=user_id), key=lambda attempt: attempt.started_at, reverse=True)[:limit]

    def completed_exercises(self, user_id: str) -> list[ExerciseAttempt]:
        return self.attempts(user_id=user_id, status=AttemptStatus.completed)

    def skipped_exercises(self, user_id: str) -> list[ExerciseAttempt]:
        return self.attempts(user_id=user_id, status=AttemptStatus.skipped)

    def abandoned_exercises(self, user_id: str) -> list[ExerciseAttempt]:
        return self.attempts(user_id=user_id, status=AttemptStatus.abandoned)

    def ratings(self, user_id: str) -> list[ExerciseEvent]:
        return [event for event in self.events(user_id=user_id, event_type=EventType.exercise_rated)]

    def reflections(self, user_id: str) -> list[ExerciseEvent]:
        return [event for event in self.events(user_id=user_id, event_type=EventType.exercise_reflected)]

    def activity_by_area(self, user_id: str, area: str) -> list[ExerciseAttempt]:
        return self.attempts(user_id=user_id, area=area)

    def activity_by_skill(self, user_id: str, skill: str) -> list[ExerciseAttempt]:
        return self.attempts(user_id=user_id, skill=skill)
