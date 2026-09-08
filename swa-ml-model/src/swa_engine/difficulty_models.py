from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class DifficultyAction(str, Enum):
    increase = "increase"
    maintain = "maintain"
    decrease = "decrease"
    insufficient_evidence = "insufficient_evidence"


class UserDifficultyState(BaseModel):
    model_config = ConfigDict(extra="forbid")

    user_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    area: str = Field(min_length=2)
    skill: str = Field(min_length=2)
    current_level: int = Field(ge=1, le=5)
    recommended_level: int = Field(ge=1, le=5)
    confidence: float = Field(ge=0, le=1)
    recent_success_rate: float = Field(ge=0, le=1)
    recent_abandonment_rate: float = Field(ge=0, le=1)
    recent_skip_rate: float = Field(ge=0, le=1)
    recent_difficulty_rating: float | None = Field(default=None, ge=1, le=5)
    consecutive_successes: int = Field(ge=0)
    consecutive_failures: int = Field(ge=0)
    last_updated_at: datetime


class DifficultyDecision(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    user_id: str
    area: str
    skill: str
    previous_level: int = Field(ge=1, le=5)
    recommended_level: int = Field(ge=1, le=5)
    action: DifficultyAction
    confidence: float = Field(ge=0, le=1)
    reasons: list[str] = Field(min_length=1)
    evidence: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime


class DifficultySnapshot(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    user_id: str
    area: str
    skill: str
    previous_level: int = Field(ge=1, le=5)
    new_level: int = Field(ge=1, le=5)
    action: DifficultyAction
    confidence: float = Field(ge=0, le=1)
    evidence: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime
