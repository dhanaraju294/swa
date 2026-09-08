from datetime import datetime, timezone

from .activity_repository import ActivityRepository
from .difficulty_engine import DifficultyEngine, ExerciseDifficultySelector
from .difficulty_history import DifficultyHistoryRepository
from .difficulty_models import DifficultySnapshot


class DifficultyService:
    def __init__(self, activity: ActivityRepository, engine: DifficultyEngine, history: DifficultyHistoryRepository | None = None, mastery_engine=None, pattern_service=None) -> None:
        self._activity = activity
        self._engine = engine
        self._history = history
        self._mastery = mastery_engine
        self._patterns = pattern_service

    def decide(self, user_id: str, area: str, skill: str, current_level: int | None = None, now: datetime | None = None):
        now = now or datetime.now(timezone.utc)
        attempts = self._activity.attempts(user_id=user_id, area=area, skill=skill)
        events = self._activity.events(user_id=user_id, area=area, skill=skill)
        mastery_state = self._mastery.calculate(user_id, area, skill, now)[0] if self._mastery else None
        patterns = self._patterns.analyze_user(user_id, now) if self._patterns else []
        state, decision = self._engine.decide(user_id, area, skill, attempts, events, current_level, mastery_state, patterns, now)
        if self._history:
            self._history.save(DifficultySnapshot(user_id=user_id, area=area, skill=skill, previous_level=decision.previous_level, new_level=decision.recommended_level, action=decision.action, confidence=decision.confidence, evidence=decision.evidence, timestamp=now))
        return state, decision
