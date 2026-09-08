from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


_ID_PATTERN = r"^[a-z0-9][a-z0-9_-]+$"


class GoalPriority(int, Enum):
    low = 1
    medium = 2
    high = 3


class GoalStatus(str, Enum):
    active = "active"
    completed = "completed"
    paused = "paused"


class Trend(str, Enum):
    improving = "improving"
    stable = "stable"
    declining = "declining"
    insufficient_data = "insufficient_data"
    unknown = "insufficient_data"


class EventType(str, Enum):
    exercise_started = "exercise_started"
    exercise_completed = "exercise_completed"
    exercise_skipped = "exercise_skipped"
    exercise_abandoned = "exercise_abandoned"
    exercise_rated = "exercise_rated"
    exercise_reflected = "exercise_reflected"


class AttemptStatus(str, Enum):
    started = "started"
    completed = "completed"
    skipped = "skipped"
    abandoned = "abandoned"


class UserProfile(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    user_id: str = Field(pattern=_ID_PATTERN)
    created_at: datetime
    updated_at: datetime
    goals: list[str] = Field(default_factory=list)
    selected_areas: list[str] = Field(default_factory=list)
    selected_skills: list[str] = Field(default_factory=list)
    baseline_scores: dict[str, float] = Field(default_factory=dict)
    preferences: dict[str, Any] = Field(default_factory=dict)
    onboarding_data: dict[str, Any] = Field(default_factory=dict)

    @field_validator("goals", "selected_areas", "selected_skills")
    @classmethod
    def validate_string_lists(cls, values: list[str]) -> list[str]:
        if any(not value.strip() for value in values):
            raise ValueError("list values must not be blank")
        return [value.strip() for value in values]

    @field_validator("baseline_scores")
    @classmethod
    def validate_baseline_scores(cls, values: dict[str, float]) -> dict[str, float]:
        if any(not key.strip() for key in values):
            raise ValueError("baseline score keys must not be blank")
        if any(score < 0 or score > 100 for score in values.values()):
            raise ValueError("baseline scores must be between 0 and 100")
        return values

    @model_validator(mode="after")
    def validate_dates(self) -> "UserProfile":
        if self.updated_at < self.created_at:
            raise ValueError("updated_at cannot be earlier than created_at")
        return self


class UserGoal(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    goal_id: str = Field(pattern=_ID_PATTERN)
    user_id: str = Field(pattern=_ID_PATTERN)
    area: str = Field(min_length=2)
    skill: str = Field(min_length=2)
    priority: GoalPriority
    status: GoalStatus
    created_at: datetime
    updated_at: datetime

    @model_validator(mode="after")
    def validate_dates(self) -> "UserGoal":
        if self.updated_at < self.created_at:
            raise ValueError("updated_at cannot be earlier than created_at")
        return self


class UserSkillState(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    user_id: str = Field(pattern=_ID_PATTERN)
    area: str = Field(min_length=2)
    skill: str = Field(min_length=2)
    mastery_score: float = Field(ge=0, le=1)
    evidence_confidence: float = Field(ge=0, le=1, default=0)
    confidence_score: float | None = Field(default=None, ge=0, le=100, exclude=True)
    evidence_count: int = Field(ge=0)
    last_activity_at: datetime | None = None
    trend: Trend = Trend.insufficient_data
    recent_score: float | None = Field(default=None, ge=0, le=1)
    previous_score: float | None = Field(default=None, ge=0, le=1)
    updated_at: datetime

    @model_validator(mode="after")
    def normalize_legacy_confidence(self) -> "UserSkillState":
        if self.confidence_score is not None and self.evidence_confidence == 0:
            self.evidence_confidence = self.confidence_score / 100
        return self


class ExerciseEvent(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    event_id: str = Field(pattern=_ID_PATTERN)
    user_id: str = Field(pattern=_ID_PATTERN)
    exercise_id: str = Field(pattern=_ID_PATTERN)
    event_type: EventType
    timestamp: datetime
    session_id: str = Field(pattern=_ID_PATTERN)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ExerciseAttempt(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    attempt_id: str = Field(pattern=_ID_PATTERN)
    user_id: str = Field(pattern=_ID_PATTERN)
    exercise_id: str = Field(pattern=_ID_PATTERN)
    started_at: datetime
    completed_at: datetime | None = None
    status: AttemptStatus
    duration_seconds: int | None = Field(default=None, ge=0)
    difficulty_rating: int | None = Field(default=None, ge=1, le=5)
    usefulness_rating: int | None = Field(default=None, ge=1, le=5)
    before_score: float | None = Field(default=None, ge=0, le=100)
    after_score: float | None = Field(default=None, ge=0, le=100)
    reflection_text: str | None = None
    notes: str | None = None

    @model_validator(mode="after")
    def validate_completion(self) -> "ExerciseAttempt":
        if self.completed_at and self.completed_at < self.started_at:
            raise ValueError("completed_at cannot be earlier than started_at")
        if self.status == AttemptStatus.completed and self.completed_at is None:
            raise ValueError("completed attempts require completed_at")
        return self
