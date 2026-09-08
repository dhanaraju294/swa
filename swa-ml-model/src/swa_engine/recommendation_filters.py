from datetime import datetime, timedelta

from .activity_repository import ActivityRepository
from .models import Exercise
from .recommendation_config import RecommendationConfig
from .recommendation_candidates import RecommendationContext
from .user_models import AttemptStatus, EventType


class HardFilter:
    def __init__(self, activity: ActivityRepository, config: RecommendationConfig) -> None:
        self._activity = activity
        self._config = config

    def apply(self, candidates: list[Exercise], context: RecommendationContext, now: datetime) -> list[Exercise]:
        completed_ids = {attempt.exercise_id for attempt in self._activity.completed_exercises(context.profile.user_id)}
        recent = now - timedelta(days=self._config.recent_history_days)
        recent_attempts = [attempt for attempt in self._activity.attempts(context.profile.user_id) if attempt.started_at >= recent]
        recent_events = [event for event in self._activity.events(context.profile.user_id) if event.timestamp >= recent]
        result = []
        for exercise in candidates:
            if not self._prerequisites_met(exercise, completed_ids):
                continue
            if not self._available(exercise, recent_attempts, recent_events):
                continue
            if not self._config.minimum_difficulty <= int(exercise.difficulty) <= self._config.maximum_difficulty:
                continue
            result.append(exercise)
        return result

    @staticmethod
    def _prerequisites_met(exercise: Exercise, completed_ids: set[str]) -> bool:
        return all(prerequisite in completed_ids for prerequisite in exercise.prerequisites)

    def _available(self, exercise: Exercise, recent_attempts: list, recent_events: list) -> bool:
        matching = [attempt for attempt in recent_attempts if attempt.exercise_id == exercise.exercise_id]
        matching_events = [event for event in recent_events if event.exercise_id == exercise.exercise_id]
        return not any(attempt.status in (AttemptStatus.started, AttemptStatus.completed) for attempt in matching) and not any(event.event_type in (EventType.exercise_started.value, EventType.exercise_completed.value) for event in matching_events)
