from datetime import datetime, timezone

from .difficulty_engine import DifficultyEngine
from .interaction_models import InteractionEvent, InteractionEventType
from .interaction_repository import InteractionEventRepository
from .mastery_engine import MasteryEngine
from .pattern_engine import PatternEngine
from .user_models import AttemptStatus, EventType, ExerciseAttempt, ExerciseEvent


class LearningLoopService:
    def __init__(self, interactions: InteractionEventRepository, activity, users, exercises, mastery=None, patterns=None, difficulty=None) -> None:
        self.interactions = interactions
        self.activity = activity
        self.users = users
        self.exercises = {exercise.exercise_id: exercise for exercise in exercises}
        self.mastery = mastery or MasteryEngine(activity)
        self.patterns = patterns or PatternEngine(list(self.exercises.values()))
        self.difficulty = difficulty or DifficultyEngine()

    def record(self, event: InteractionEvent, now: datetime | None = None) -> InteractionEvent:
        saved = self.interactions.create(event)
        self._project_activity(saved)
        return saved

    def update_state(self, user_id: str, area: str, skill: str, now: datetime | None = None) -> dict:
        now = now or datetime.now(timezone.utc)
        state, explanation, snapshot = self.mastery.calculate(user_id, area, skill, now)
        self.users.save_skill_state(state)
        patterns = self.patterns.analyze(user_id, self.activity.attempts(user_id), self.activity.events(user_id), now)
        attempts = self.activity.attempts(user_id, area=area, skill=skill)
        events = self.activity.events(user_id, area=area, skill=skill)
        difficulty_state, difficulty_decision = self.difficulty.decide(user_id, area, skill, attempts, events, mastery_state=state, behavioral_patterns=patterns, now=now)
        return {"skill_state": state, "mastery_explanation": explanation, "behavioral_patterns": patterns, "difficulty_state": difficulty_state, "difficulty_decision": difficulty_decision}

    def _project_activity(self, event: InteractionEvent) -> None:
        mapping = {
            InteractionEventType.exercise_started.value: EventType.exercise_started,
            InteractionEventType.exercise_completed.value: EventType.exercise_completed,
            InteractionEventType.exercise_skipped.value: EventType.exercise_skipped,
            InteractionEventType.exercise_abandoned.value: EventType.exercise_abandoned,
            InteractionEventType.exercise_rated.value: EventType.exercise_rated,
        }
        event_type = mapping.get(event.event_type)
        if event_type:
            metadata = {"recommendation_id": event.recommendation_id, "feedback": event.feedback.model_dump(mode="json") if event.feedback else None}
            self.activity.save_event(ExerciseEvent(event_id=f"interaction_{event.event_id}", user_id=event.user_id, exercise_id=event.exercise_id, event_type=event_type, timestamp=event.timestamp, session_id=event.recommendation_id, metadata=metadata))
        status = {InteractionEventType.exercise_started.value: AttemptStatus.started, InteractionEventType.exercise_completed.value: AttemptStatus.completed, InteractionEventType.exercise_skipped.value: AttemptStatus.skipped, InteractionEventType.exercise_abandoned.value: AttemptStatus.abandoned}.get(event.event_type)
        if status:
            outcome = event.outcome
            completed = status == AttemptStatus.completed
            self.activity.save_attempt(ExerciseAttempt(attempt_id=f"interaction_{event.event_id}", user_id=event.user_id, exercise_id=event.exercise_id, started_at=event.timestamp, completed_at=event.timestamp if completed else None, status=status, duration_seconds=outcome.completion_duration if outcome else None, difficulty_rating=outcome.difficulty_rating if outcome else None, usefulness_rating=outcome.usefulness_rating if outcome else None, before_score=outcome.confidence_before if outcome else None, after_score=outcome.confidence_after if outcome and completed else None, notes=outcome.user_feedback if outcome else None))
