from datetime import datetime, timezone
from math import exp, log

from .difficulty_config import DifficultyConfig
from .difficulty_features import DifficultyEvidence, extract_difficulty_evidence
from .difficulty_models import DifficultyAction, DifficultyDecision, UserDifficultyState
from .models import Exercise
from .user_models import UserSkillState


class DifficultyEngine:
    """Deterministic adaptive challenge rules based only on observable interactions."""

    def __init__(self, config: DifficultyConfig | None = None) -> None:
        self._config = config or DifficultyConfig()

    def decide(self, user_id: str, area: str, skill: str, attempts, events=None, current_level: int | None = None, mastery_state: UserSkillState | None = None, behavioral_patterns=None, now: datetime | None = None) -> tuple[UserDifficultyState, DifficultyDecision]:
        now = now or datetime.now(timezone.utc)
        recent_cutoff = now.timestamp() - (self._config.recency_half_life_days * 2 * 86400)
        recent_attempts = [attempt for attempt in attempts if attempt.started_at.timestamp() >= recent_cutoff]
        recent_ids = {attempt.attempt_id for attempt in recent_attempts}
        recent_events = [event for event in (events or []) if event.timestamp.timestamp() >= recent_cutoff and (not recent_ids or event.exercise_id in {attempt.exercise_id for attempt in recent_attempts})]
        evidence = extract_difficulty_evidence(recent_attempts, recent_events)
        previous = current_level or self._infer_level(evidence)
        confidence = self._confidence(evidence, mastery_state)
        action = DifficultyAction.maintain
        recommended = previous
        reasons = ["There is not enough repeated interaction evidence to change difficulty, so the conservative baseline is maintained."]
        pattern_names = {getattr(pattern.pattern_type, "value", pattern.pattern_type) for pattern in (behavioral_patterns or [])}
        if evidence.evidence_count >= self._config.minimum_evidence:
            increase_ok = evidence.success_rate >= self._config.increase_success_rate and evidence.abandonment_rate < self._config.decrease_failure_rate and evidence.skip_rate < self._config.decrease_failure_rate and (evidence.average_rating is None or evidence.average_rating <= self._config.difficulty_rating_too_hard)
            decrease_ok = evidence.abandonment_rate >= self._config.decrease_failure_rate or evidence.skip_rate >= self._config.decrease_failure_rate or (evidence.average_rating is not None and evidence.average_rating >= self._config.difficulty_rating_too_hard)
            if "frequently_abandons_difficult_exercises" in pattern_names:
                decrease_ok = True
                increase_ok = False
                reasons = ["Behavioral evidence shows repeated abandonment of difficult exercises."]
            elif "handles_increasing_difficulty" in pattern_names:
                increase_ok = increase_ok or evidence.success_rate >= self._config.increase_success_rate
            if decrease_ok and previous > 1:
                action = DifficultyAction.decrease
                recommended = max(1, previous - self._config.maximum_change_per_update)
                reasons = ["Recent abandonment, skipping, or difficulty ratings indicate the current challenge may be too difficult."]
            elif increase_ok and previous < 5:
                action = DifficultyAction.increase
                recommended = min(5, previous + self._config.maximum_change_per_update)
                reasons = ["Recent exercises were repeatedly completed and generally rated as manageable."]
            else:
                action = DifficultyAction.maintain
                reasons = ["Recent evidence indicates that the current challenge can be maintained."]
            if mastery_state and mastery_state.evidence_confidence >= self._config.mastery_influence_min_evidence and mastery_state.mastery_score < 0.25 and action == DifficultyAction.increase:
                action = DifficultyAction.maintain
                recommended = previous
                reasons = ["Mastery evidence is currently low, so the engine is maintaining difficulty conservatively."]
        evidence_dict = {"completed": evidence.completed, "abandoned": evidence.abandoned, "skipped": evidence.skipped, "evidence_count": evidence.evidence_count, "success_rate": round(evidence.success_rate, 4), "abandonment_rate": round(evidence.abandonment_rate, 4), "skip_rate": round(evidence.skip_rate, 4), "average_difficulty_rating": round(evidence.average_rating, 4) if evidence.average_rating is not None else None, "consecutive_successes": evidence.consecutive_successes, "consecutive_failures": evidence.consecutive_failures, "mastery_score": mastery_state.mastery_score if mastery_state else None, "mastery_evidence_confidence": mastery_state.evidence_confidence if mastery_state else None, "behavioral_patterns": sorted(pattern_names)}
        state = UserDifficultyState(user_id=user_id, area=area, skill=skill, current_level=previous, recommended_level=recommended, confidence=confidence, recent_success_rate=evidence.success_rate, recent_abandonment_rate=evidence.abandonment_rate, recent_skip_rate=evidence.skip_rate, recent_difficulty_rating=evidence.average_rating, consecutive_successes=evidence.consecutive_successes, consecutive_failures=evidence.consecutive_failures, last_updated_at=now)
        decision = DifficultyDecision(user_id=user_id, area=area, skill=skill, previous_level=previous, recommended_level=recommended, action=action, confidence=confidence, reasons=reasons, evidence=evidence_dict, timestamp=now)
        return state, decision

    def _infer_level(self, evidence: DifficultyEvidence) -> int:
        if not evidence.attempts:
            return self._config.default_difficulty
        return max(1, min(5, round(sum(int(getattr(attempt, "difficulty_rating", None) or self._config.default_difficulty) for attempt in evidence.attempts) / len(evidence.attempts))))

    def _confidence(self, evidence: DifficultyEvidence, mastery_state: UserSkillState | None) -> float:
        if not evidence.evidence_count:
            return 0.0
        value = min(1.0, evidence.evidence_count / max(1, self._config.minimum_evidence * 2))
        if mastery_state:
            value = (value + mastery_state.evidence_confidence) / 2
        if evidence.last_activity_at:
            age_days = max(0.0, (datetime.now(timezone.utc) - evidence.last_activity_at).total_seconds() / 86400)
            value *= exp(-log(2) * age_days / self._config.recency_half_life_days)
        return round(min(1.0, value), 4)


class ExerciseDifficultySelector:
    def __init__(self, exercises: list[Exercise], tolerance: int = 0) -> None:
        self._exercises = exercises
        self._tolerance = tolerance

    def suitable(self, area: str, skill: str, recommended_level: int) -> list[Exercise]:
        return [exercise for exercise in self._exercises if exercise.status == "active" and exercise.area == area and exercise.skill == skill and abs(int(exercise.difficulty) - recommended_level) <= self._tolerance]
