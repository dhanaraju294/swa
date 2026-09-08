from datetime import datetime
from uuid import uuid4

from .activity_repository import ActivityRepository
from .user_models import AttemptStatus, EventType, ExerciseAttempt, ExerciseEvent


class ActivityService:
    def __init__(self, repository: ActivityRepository) -> None:
        self._repository = repository

    def record_attempt(self, attempt: ExerciseAttempt, session_id: str) -> ExerciseAttempt:
        self._repository.save_attempt(attempt)
        event_type = {
            AttemptStatus.started: EventType.exercise_started,
            AttemptStatus.completed: EventType.exercise_completed,
            AttemptStatus.skipped: EventType.exercise_skipped,
            AttemptStatus.abandoned: EventType.exercise_abandoned,
        }[attempt.status]
        self._repository.save_event(ExerciseEvent(event_id=f"evt_{uuid4().hex}", user_id=attempt.user_id, exercise_id=attempt.exercise_id, event_type=event_type, timestamp=attempt.completed_at or attempt.started_at, session_id=session_id, metadata={"attempt_id": attempt.attempt_id}))
        return attempt

    def record_rating(self, user_id: str, exercise_id: str, session_id: str, difficulty: int | None = None, usefulness: int | None = None, timestamp: datetime | None = None) -> ExerciseEvent:
        metadata = {key: value for key, value in {"difficulty_rating": difficulty, "usefulness_rating": usefulness}.items() if value is not None}
        event = ExerciseEvent(event_id=f"evt_{uuid4().hex}", user_id=user_id, exercise_id=exercise_id, event_type=EventType.exercise_rated, timestamp=timestamp or datetime.now().astimezone(), session_id=session_id, metadata=metadata)
        return self._repository.save_event(event)

    def record_reflection(self, user_id: str, exercise_id: str, session_id: str, reflection_text: str, timestamp: datetime | None = None) -> ExerciseEvent:
        if not reflection_text.strip():
            raise ValueError("reflection_text must not be blank")
        event = ExerciseEvent(event_id=f"evt_{uuid4().hex}", user_id=user_id, exercise_id=exercise_id, event_type=EventType.exercise_reflected, timestamp=timestamp or datetime.now().astimezone(), session_id=session_id, metadata={"reflection_text": reflection_text})
        return self._repository.save_event(event)
