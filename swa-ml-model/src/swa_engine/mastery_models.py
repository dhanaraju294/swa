from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from .user_models import Trend


class MasterySnapshot(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    user_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    area: str = Field(min_length=2)
    skill: str = Field(min_length=2)
    mastery_score: float = Field(ge=0, le=1)
    evidence_confidence: float = Field(ge=0, le=1)
    trend: Trend
    timestamp: datetime
    evidence_summary: dict[str, Any] = Field(default_factory=dict)


class MasteryExplanation(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    user_id: str
    area: str
    skill: str
    mastery_score: float = Field(ge=0, le=1)
    previous_score: float | None = Field(default=None, ge=0, le=1)
    trend: Trend
    evidence: dict[str, Any] = Field(default_factory=dict)


class MasteryResult(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    state: Any
    explanation: MasteryExplanation
    snapshot: MasterySnapshot
