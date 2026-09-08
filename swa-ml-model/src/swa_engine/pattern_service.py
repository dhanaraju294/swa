from datetime import datetime, timezone

from .activity_repository import ActivityRepository
from .nlp_models import NLPResult
from .pattern_engine import PatternEngine
from .pattern_models import BehavioralPattern, PatternSnapshot, PatternStatus
from .pattern_repository import PatternRepository


class PatternService:
    def __init__(self, activity: ActivityRepository, engine: PatternEngine, history: PatternRepository | None = None) -> None:
        self._activity = activity
        self._engine = engine
        self._history = history

    def analyze_user(self, user_id: str, now: datetime | None = None, nlp_results: list[NLPResult] | None = None) -> list[BehavioralPattern]:
        now = now or datetime.now(timezone.utc)
        patterns = self._engine.analyze(user_id, self._activity.attempts(user_id), self._activity.events(user_id), now, nlp_results)
        if self._history:
            for pattern in patterns:
                self._history.save_snapshot(PatternSnapshot(pattern_id=pattern.pattern_id, user_id=user_id, confidence=pattern.confidence, status=pattern.status, evidence=pattern.evidence, timestamp=now))
        return patterns

    def analyze_users(self, user_ids: list[str], now: datetime | None = None) -> dict[str, list[BehavioralPattern]]:
        return {user_id: self.analyze_user(user_id, now) for user_id in user_ids}

    def grouped(self, user_id: str, now: datetime | None = None, nlp_results: list[NLPResult] | None = None) -> dict[str, list[BehavioralPattern]]:
        patterns = self.analyze_user(user_id, now, nlp_results)
        return {status.value: [pattern for pattern in patterns if pattern.status == status.value] for status in PatternStatus}
