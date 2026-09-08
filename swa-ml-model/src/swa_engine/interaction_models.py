from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator


_ID = r"^[a-z0-9][a-z0-9_-]+$"


class InteractionEventType(str, Enum):
    recommendation_shown = "RECOMMENDATION_SHOWN"
    exercise_started = "EXERCISE_STARTED"
    exercise_completed = "EXERCISE_COMPLETED"
    exercise_skipped = "EXERCISE_SKIPPED"
    exercise_abandoned = "EXERCISE_ABANDONED"
    exercise_rated = "EXERCISE_RATED"
    exercise_dismissed = "EXERCISE_DISMISSED"
    feedback_submitted = "FEEDBACK_SUBMITTED"


class CompletionStatus(str, Enum):
    completed = "completed"
    skipped = "skipped"
    abandoned = "abandoned"
    started = "started"


class ExerciseOutcome(BaseModel):
    model_config = ConfigDict(extra="forbid")

    completion_status: CompletionStatus | None = None
    completion_duration: int | None = Field(default=None, ge=0, le=604800)
    self_rating: int | None = Field(default=None, ge=1, le=5)
    usefulness_rating: int | None = Field(default=None, ge=1, le=5)
    difficulty_rating: int | None = Field(default=None, ge=1, le=5)
    mood_before: int | None = Field(default=None, ge=1, le=5)
    mood_after: int | None = Field(default=None, ge=1, le=5)
    confidence_before: float | None = Field(default=None, ge=0, le=100)
    confidence_after: float | None = Field(default=None, ge=0, le=100)
    user_feedback: str | None = None


class InteractionFeedback(BaseModel):
    model_config = ConfigDict(extra="forbid")

    useful: bool | None = None
    difficulty: int | None = Field(default=None, ge=1, le=5)
    rating: int | None = Field(default=None, ge=1, le=5)
    completed: bool | None = None
    text: str | None = None


class InteractionEvent(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    event_id: str = Field(pattern=_ID)
    user_id: str = Field(pattern=_ID)
    recommendation_id: str = Field(pattern=_ID)
    exercise_id: str = Field(pattern=_ID)
    timestamp: datetime
    event_type: InteractionEventType
    model_version: str | None = None
    recommendation_version: str | None = None
    strategy: str = "hybrid"
    rule_score: float | None = Field(default=None, ge=0, le=1)
    ml_score: float | None = Field(default=None, ge=0, le=1)
    hybrid_score: float | None = Field(default=None, ge=0, le=1)
    selected_rank: int | None = Field(default=None, ge=1)
    difficulty: int = Field(ge=1, le=5)
    area: str = Field(min_length=2)
    skill: str = Field(min_length=2)
    exercise_type: str = Field(min_length=2)
    outcome: ExerciseOutcome | None = None
    feedback: InteractionFeedback | None = None
    data_source: str = "real"
    pre_features: dict[str, Any] = Field(default_factory=dict)
    candidate_trace: list[dict[str, Any]] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_source(self) -> "InteractionEvent":
        if self.data_source not in {"real", "synthetic"}:
            raise ValueError("data_source must be real or synthetic")
        if self.timestamp.tzinfo is None:
            raise ValueError("timestamp must include timezone information")
        return self