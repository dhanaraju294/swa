from dataclasses import dataclass
from datetime import datetime
from statistics import mean

from .models import Exercise
from .user_models import AttemptStatus, ExerciseAttempt, ExerciseEvent, EventType


@dataclass(frozen=True)
class DifficultyEvidence:
    attempts: list[ExerciseAttempt]
    completed: int
    abandoned: int
    skipped: int
    success_rate: float
    abandonment_rate: float
    skip_rate: float
    average_rating: float | None
    consecutive_successes: int
    consecutive_failures: int
    last_activity_at: datetime | None
    evidence_count: int


def extract_difficulty_evidence(attempts: list[ExerciseAttempt], events: list[ExerciseEvent] | None = None) -> DifficultyEvidence:
    unique = list({attempt.attempt_id: attempt for attempt in attempts}.values())
    unique.sort(key=lambda item: item.started_at)
    completed = sum(item.status == AttemptStatus.completed.value for item in unique)
    abandoned = sum(item.status == AttemptStatus.abandoned.value for item in unique)
    skipped = sum(item.status == AttemptStatus.skipped.value for item in unique)
    ratings = [item.difficulty_rating for item in unique if item.difficulty_rating is not None]
    if events:
        for event in {event.event_id: event for event in events}.values():
            if event.event_type == EventType.exercise_rated.value:
                rating = event.metadata.get("difficulty_rating")
                if isinstance(rating, (int, float)) and 1 <= rating <= 5:
                    ratings.append(float(rating))
    success_streak = failure_streak = 0
    for item in reversed(unique):
        if item.status == AttemptStatus.completed.value and failure_streak == 0:
            success_streak += 1
        elif item.status in (AttemptStatus.abandoned.value, AttemptStatus.skipped.value) and success_streak == 0:
            failure_streak += 1
        else:
            break
    total = len(unique)
    return DifficultyEvidence(unique, completed, abandoned, skipped, completed / total if total else 0, abandoned / total if total else 0, skipped / total if total else 0, mean(ratings) if ratings else None, success_streak, failure_streak, unique[-1].started_at if unique else None, total)
