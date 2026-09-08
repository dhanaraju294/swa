from datetime import datetime, timezone

from .activity_repository import ActivityRepository
from .mastery_models import MasteryExplanation, MasteryResult, MasterySnapshot
from .scoring import MasteryScorer
from .trend import calculate_trend
from .user_models import Trend, UserSkillState


class MasteryEngine:
    """Deterministic, explainable learner-state calculation; no diagnosis or ML."""

    def __init__(self, activity_repository: ActivityRepository, scorer: MasteryScorer | None = None) -> None:
        self._activity = activity_repository
        self._scorer = scorer or MasteryScorer()

    def calculate(self, user_id: str, area: str, skill: str, now: datetime | None = None) -> tuple[UserSkillState, MasteryExplanation, MasterySnapshot]:
        now = now or datetime.now(timezone.utc)
        attempts = self._activity.attempts(user_id=user_id, area=area, skill=skill)
        events = self._activity.events(user_id=user_id, area=area, skill=skill)
        result = self._scorer.score(attempts, events, now)
        trend, recent_score, previous_score = calculate_trend(result.recent_scores, result.previous_scores, self._scorer.weights.trend_threshold, self._scorer.weights.trend_minimum_observations)
        state = UserSkillState(user_id=user_id, area=area, skill=skill, mastery_score=result.mastery_score, evidence_confidence=result.evidence_confidence, evidence_count=result.evidence_count, last_activity_at=result.last_activity_at, trend=trend, recent_score=recent_score, previous_score=previous_score, updated_at=now)
        evidence = {**result.summary, "evidence_count": result.evidence_count, "recency_half_life_days": self._scorer.weights.recency_half_life_days}
        explanation = MasteryExplanation(user_id=user_id, area=area, skill=skill, mastery_score=state.mastery_score, previous_score=previous_score, trend=trend, evidence=evidence)
        snapshot = MasterySnapshot(user_id=user_id, area=area, skill=skill, mastery_score=state.mastery_score, evidence_confidence=state.evidence_confidence, trend=trend, timestamp=now, evidence_summary=evidence)
        return state, explanation, snapshot

    def calculate_for_user(self, user_id: str, skills: list[tuple[str, str]], now: datetime | None = None) -> list[tuple[UserSkillState, MasteryExplanation, MasterySnapshot]]:
        return [self.calculate(user_id, area, skill, now) for area, skill in skills]
