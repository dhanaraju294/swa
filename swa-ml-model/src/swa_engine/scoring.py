from dataclasses import dataclass
from datetime import datetime, timezone
from math import exp
from typing import Any

from .recency import recency_weight
from .user_models import AttemptStatus, EventType, ExerciseAttempt, ExerciseEvent


@dataclass(frozen=True)
class MasteryWeights:
    completion: float = 0.35
    usefulness: float = 0.15
    improvement: float = 0.25
    difficulty: float = 0.05
    reflection: float = 0.10
    consistency: float = 0.10
    recency_half_life_days: float = 30.0
    consistency_window_days: int = 30
    consistency_evidence_target: int = 4
    confidence_saturation_evidence: float = 8.0
    trend_threshold: float = 0.08
    trend_minimum_observations: int = 2
    minimum_score: float = 0.0


@dataclass(frozen=True)
class EvidenceObservation:
    timestamp: datetime
    score: float
    weight: float
    completed: bool
    usefulness: float | None
    difficulty: float | None
    improvement: float | None
    reflection: bool


@dataclass(frozen=True)
class ScoreResult:
    mastery_score: float
    evidence_confidence: float
    evidence_count: int
    last_activity_at: datetime | None
    recent_scores: list[float]
    previous_scores: list[float]
    summary: dict[str, Any]


class MasteryScorer:
    def __init__(self, weights: MasteryWeights | None = None) -> None:
        self.weights = weights or MasteryWeights()
        if sum((self.weights.completion, self.weights.usefulness, self.weights.improvement, self.weights.difficulty, self.weights.reflection, self.weights.consistency)) <= 0:
            raise ValueError("at least one mastery weight must be positive")

    def score(self, attempts: list[ExerciseAttempt], events: list[ExerciseEvent], now: datetime | None = None) -> ScoreResult:
        now = now or datetime.now(timezone.utc)
        attempts = self._unique_attempts(attempts)
        events = self._unique_events(events)
        ratings = self._rating_by_exercise(events)
        reflections = {event.exercise_id for event in events if event.event_type == EventType.exercise_reflected}
        observations = [self._observation(attempt, ratings.get(attempt.exercise_id), attempt.exercise_id in reflections, attempts, now) for attempt in attempts]
        observations.extend(self._event_observations(events, attempts, now))
        observations.sort(key=lambda item: item.timestamp)
        if not observations:
            return ScoreResult(0.0, 0.0, 0, None, [], [], self._summary(observations, ratings, reflections, now))
        total_weight = sum(item.weight for item in observations)
        mastery = sum(item.score * item.weight for item in observations) / total_weight if total_weight else 0.0
        effective_evidence = sum(item.weight for item in observations)
        evidence_confidence = 1 - exp(-effective_evidence / self.weights.confidence_saturation_evidence)
        split = len(observations) // 2
        previous = [item.score for item in observations[:split]] if split else []
        recent = [item.score for item in observations[split:]] if split else [item.score for item in observations]
        return ScoreResult(round(self._clamp(mastery), 6), round(self._clamp(evidence_confidence), 6), len(observations), observations[-1].timestamp, recent, previous, self._summary(observations, ratings, reflections, now))

    def _observation(self, attempt: ExerciseAttempt, rating: dict[str, float] | None, reflected: bool, attempts: list[ExerciseAttempt], now: datetime) -> EvidenceObservation:
        completion = {AttemptStatus.completed: 1.0, AttemptStatus.started: 0.15, AttemptStatus.skipped: 0.0, AttemptStatus.abandoned: 0.0}[attempt.status]
        usefulness = rating.get("usefulness") if rating else (attempt.usefulness_rating / 5 if attempt.usefulness_rating is not None else None)
        difficulty = rating.get("difficulty") if rating else (attempt.difficulty_rating / 5 if attempt.difficulty_rating is not None else None)
        improvement = self._improvement(attempt.before_score, attempt.after_score)
        consistency = self._consistency(attempt.started_at, attempts)
        values = [(self.weights.completion, completion), (self.weights.usefulness, usefulness), (self.weights.improvement, improvement), (self.weights.difficulty, difficulty), (self.weights.reflection, 1.0 if reflected else None), (self.weights.consistency, consistency)]
        available = [(weight, value) for weight, value in values if value is not None]
        score = sum(weight * value for weight, value in available) / sum(weight for weight, _ in available)
        return EvidenceObservation(attempt.started_at, score, recency_weight(attempt.started_at, now, self.weights.recency_half_life_days), attempt.status == AttemptStatus.completed, usefulness, difficulty, improvement, reflected)

    def _event_observations(self, events: list[ExerciseEvent], attempts: list[ExerciseAttempt], now: datetime) -> list[EvidenceObservation]:
        attempt_ids = {attempt.exercise_id for attempt in attempts}
        result = []
        for event in events:
            if event.exercise_id in attempt_ids or event.event_type in (EventType.exercise_rated, EventType.exercise_reflected):
                continue
            completion = 1.0 if event.event_type == EventType.exercise_completed else 0.0
            result.append(EvidenceObservation(event.timestamp, completion, recency_weight(event.timestamp, now, self.weights.recency_half_life_days), completion == 1.0, None, None, None, event.event_type == EventType.exercise_reflected))
        return result

    def _rating_by_exercise(self, events: list[ExerciseEvent]) -> dict[str, dict[str, float]]:
        ratings: dict[str, dict[str, float]] = {}
        for event in events:
            if event.event_type != EventType.exercise_rated:
                continue
            values = ratings.setdefault(event.exercise_id, {})
            if isinstance(event.metadata.get("usefulness_rating"), (int, float)) and 1 <= event.metadata["usefulness_rating"] <= 5:
                values["usefulness"] = event.metadata["usefulness_rating"] / 5
            if isinstance(event.metadata.get("difficulty_rating"), (int, float)) and 1 <= event.metadata["difficulty_rating"] <= 5:
                values["difficulty"] = event.metadata["difficulty_rating"] / 5
        return ratings

    def _consistency(self, timestamp: datetime, attempts: list[ExerciseAttempt]) -> float:
        window_start = timestamp.timestamp() - self.weights.consistency_window_days * 86400
        count = len({attempt.started_at.date() for attempt in attempts if window_start <= attempt.started_at.timestamp() <= timestamp.timestamp()})
        return min(1.0, count / self.weights.consistency_evidence_target)

    @staticmethod
    def _improvement(before: float | None, after: float | None) -> float | None:
        if before is None or after is None:
            return None
        delta = after - before
        return max(0.0, min(1.0, 0.5 + delta / 200))

    @staticmethod
    def _unique_attempts(attempts: list[ExerciseAttempt]) -> list[ExerciseAttempt]:
        return list({attempt.attempt_id: attempt for attempt in attempts}.values())

    @staticmethod
    def _unique_events(events: list[ExerciseEvent]) -> list[ExerciseEvent]:
        return list({event.event_id: event for event in events}.values())

    @staticmethod
    def _clamp(value: float) -> float:
        return max(0.0, min(1.0, value))

    def _summary(self, observations: list[EvidenceObservation], ratings: dict[str, dict[str, float]], reflections: set[str], now: datetime) -> dict[str, Any]:
        return {
            "completed_exercises": sum(item.completed for item in observations),
            "useful_exercises": sum(1 for item in observations if item.usefulness is not None and item.usefulness >= 0.6),
            "reflections": len(reflections),
            "recent_activity": bool(observations and (now - observations[-1].timestamp).total_seconds() <= self.weights.recency_half_life_days * 86400),
            "difficulty_ratings": sum(item.difficulty is not None for item in observations),
            "improvement_observations": sum(item.improvement is not None for item in observations),
        }
