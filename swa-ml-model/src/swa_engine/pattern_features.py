from collections import Counter, defaultdict
from dataclasses import dataclass, field
from datetime import datetime

from .models import Exercise
from .nlp_models import NLPResult
from .user_models import AttemptStatus, ExerciseAttempt, ExerciseEvent, EventType


@dataclass
class ActivityFeatures:
    attempts: list[ExerciseAttempt] = field(default_factory=list)
    events: list[ExerciseEvent] = field(default_factory=list)
    exercises: dict[str, Exercise] = field(default_factory=dict)
    completed: list[ExerciseAttempt] = field(default_factory=list)
    skipped: list[ExerciseAttempt] = field(default_factory=list)
    abandoned: list[ExerciseAttempt] = field(default_factory=list)
    all_timestamps: list[datetime] = field(default_factory=list)
    type_counts: Counter = field(default_factory=Counter)
    area_counts: Counter = field(default_factory=Counter)
    skill_counts: Counter = field(default_factory=Counter)
    usefulness: list[float] = field(default_factory=list)
    difficulty_ratings: list[float] = field(default_factory=list)
    nlp_results: list[NLPResult] = field(default_factory=list)

    @property
    def total_attempts(self) -> int:
        return len(self.attempts)

    @property
    def last_activity(self) -> datetime | None:
        return max(self.all_timestamps) if self.all_timestamps else None


def extract_features(attempts: list[ExerciseAttempt], events: list[ExerciseEvent], exercises: list[Exercise], nlp_results: list[NLPResult] | None = None) -> ActivityFeatures:
    unique_attempts = list({item.attempt_id: item for item in attempts}.values())
    unique_events = list({item.event_id: item for item in events}.values())
    exercise_map = {item.exercise_id: item for item in exercises}
    completed = [item for item in unique_attempts if item.status == AttemptStatus.completed.value]
    skipped = [item for item in unique_attempts if item.status == AttemptStatus.skipped.value]
    abandoned = [item for item in unique_attempts if item.status == AttemptStatus.abandoned.value]
    type_counts = Counter(exercise_map[item.exercise_id].type for item in completed if item.exercise_id in exercise_map)
    area_counts = Counter(exercise_map[item.exercise_id].area for item in completed if item.exercise_id in exercise_map)
    skill_counts = Counter(exercise_map[item.exercise_id].skill for item in completed if item.exercise_id in exercise_map)
    usefulness = [item.usefulness_rating / 5 for item in unique_attempts if item.usefulness_rating is not None]
    difficulty = [item.difficulty_rating / 5 for item in unique_attempts if item.difficulty_rating is not None]
    for event in unique_events:
        if event.event_type == EventType.exercise_rated.value:
            value = event.metadata.get("usefulness_rating")
            if isinstance(value, (int, float)) and 1 <= value <= 5:
                usefulness.append(value / 5)
            value = event.metadata.get("difficulty_rating")
            if isinstance(value, (int, float)) and 1 <= value <= 5:
                difficulty.append(value / 5)
    timestamps = [item.started_at for item in unique_attempts] + [item.timestamp for item in unique_events]
    return ActivityFeatures(unique_attempts, unique_events, exercise_map, completed, skipped, abandoned, timestamps, type_counts, area_counts, skill_counts, usefulness, difficulty, nlp_results or [])
