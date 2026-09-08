from datetime import datetime, timezone
from math import exp, log

from .activity_repository import ActivityRepository
from .mastery_engine import MasteryEngine
from .models import Exercise
from .recommendation_candidates import RecommendationContext
from .recommendation_config import RecommendationConfig
from .recency import recency_weight
from .user_models import AttemptStatus, EventType, Trend


class FeatureScorer:
    def __init__(self, activity: ActivityRepository, mastery: MasteryEngine, config: RecommendationConfig) -> None:
        self._activity = activity
        self._mastery = mastery
        self._config = config

    def components(self, exercise: Exercise, context: RecommendationContext, now: datetime) -> dict[str, float]:
        state = self._mastery.calculate(context.profile.user_id, exercise.area, exercise.skill, now)[0]
        attempts = self._activity.attempts(user_id=context.profile.user_id, exercise_id=exercise.exercise_id)
        events = self._activity.events(user_id=context.profile.user_id, exercise_id=exercise.exercise_id)
        return {
            "goal_relevance": self._goal_relevance(exercise, context),
            "skill_relevance": self._skill_relevance(exercise, context),
            "mastery_relevance": self._mastery_relevance(state.mastery_score, state.evidence_confidence, state.trend),
            "context_relevance": self._context_relevance(exercise, context),
            "recency": self._recency(attempts, events, now),
            "novelty": self._novelty(attempts, events, now),
            "usefulness": self._usefulness(attempts, events),
            "difficulty": self._difficulty(exercise, state.mastery_score, state.evidence_confidence, attempts),
        }

    def score(self, components: dict[str, float]) -> float:
        weights = self._config.weights
        total = sum(weights.values())
        return round(max(0.0, min(1.0, sum(components[name] * weights[name] for name in weights) / total)), 6)

    @staticmethod
    def _goal_relevance(exercise: Exercise, context: RecommendationContext) -> float:
        exact = [goal for goal in context.goals if goal.status == "active" and goal.area == exercise.area and goal.skill == exercise.skill]
        area = [goal for goal in context.goals if goal.status == "active" and goal.area == exercise.area]
        return 1.0 if exact else 0.7 if area else 0.0

    @staticmethod
    def _skill_relevance(exercise: Exercise, context: RecommendationContext) -> float:
        if exercise.skill in context.target_skills:
            return 1.0
        return 0.4 if exercise.area in context.target_areas else 0.0

    @staticmethod
    def _mastery_relevance(mastery: float, evidence: float, trend: str) -> float:
        if evidence < 0.25:
            return 0.55
        value = 1.0 - mastery
        if trend == Trend.improving.value:
            value *= 0.85
        if trend == Trend.declining.value:
            value = min(1.0, value + 0.15)
        return max(0.0, min(1.0, value))

    @staticmethod
    def _context_relevance(exercise: Exercise, context: RecommendationContext) -> float:
        requested = context.current_context or {}
        values = set()
        if isinstance(requested, dict):
            for value in requested.values():
                values.update(str(item).lower() for item in (value if isinstance(value, list) else [value]))
        return 1.0 if values.intersection({tag.lower() for tag in exercise.tags}) else 0.0

    def _recency(self, attempts: list, events: list, now: datetime) -> float:
        timestamps = [attempt.started_at for attempt in attempts] + [event.timestamp for event in events]
        if not timestamps:
            return 1.0
        latest = max(timestamps)
        return recency_weight(latest, now, self._config.novelty_half_life_days)

    def _novelty(self, attempts: list, events: list, now: datetime) -> float:
        timestamps = [attempt.started_at for attempt in attempts] + [event.timestamp for event in events]
        if not timestamps:
            return 1.0
        latest = max(timestamps)
        base = recency_weight(latest, now, self._config.novelty_half_life_days)
        last_attempt = max(attempts, key=lambda attempt: attempt.started_at) if attempts else None
        last_event = max(events, key=lambda event: event.timestamp) if events else None
        if last_event and (not last_attempt or last_event.timestamp > last_attempt.started_at):
            penalty = {EventType.exercise_completed.value: self._config.repeat_penalty, EventType.exercise_skipped.value: self._config.skip_penalty, EventType.exercise_abandoned.value: self._config.abandon_penalty}.get(last_event.event_type, 0.0)
        else:
            penalty = {AttemptStatus.completed: self._config.repeat_penalty, AttemptStatus.skipped: self._config.skip_penalty, AttemptStatus.abandoned: self._config.abandon_penalty}.get(last_attempt.status, 0.0)
        return max(0.0, min(1.0, 1.0 - base * penalty))

    @staticmethod
    def _usefulness(attempts: list, events: list) -> float:
        ratings = [attempt.usefulness_rating / 5 for attempt in attempts if attempt.usefulness_rating is not None]
        ratings.extend(event.metadata["usefulness_rating"] / 5 for event in events if event.event_type == EventType.exercise_rated.value and isinstance(event.metadata.get("usefulness_rating"), (int, float)) and 1 <= event.metadata["usefulness_rating"] <= 5)
        return sum(ratings) / len(ratings) if ratings else 0.5

    def _difficulty(self, exercise: Exercise, mastery: float, evidence: float, attempts: list) -> float:
        target = self._config.default_difficulty + round(mastery * 2) if evidence >= 0.25 else self._config.default_difficulty
        difference = abs(int(exercise.difficulty) - target)
        rating = [attempt.difficulty_rating / 5 for attempt in attempts if attempt.difficulty_rating is not None]
        history_adjustment = sum(rating) / len(rating) if rating else 0.5
        return max(0.0, min(1.0, 1.0 - difference / 4 * 0.7 + history_adjustment * 0.3))
