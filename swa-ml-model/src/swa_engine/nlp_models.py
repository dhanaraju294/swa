from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class NLPSource(str, Enum):
    reflection = "reflection"
    check_in = "check_in"
    onboarding = "onboarding"
    exercise_response = "exercise_response"
    free_text = "free_text"


class Signal(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=2)
    confidence: float = Field(ge=0, le=1)
    evidence: list[str] = Field(min_length=1)


class AreaSignal(Signal):
    area: str = Field(min_length=2)


class SkillSignal(Signal):
    area: str = Field(min_length=2)
    skill: str = Field(min_length=2)


class NLPInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    user_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    text: str = Field(min_length=1, max_length=10000)
    timestamp: datetime
    source: NLPSource

    @field_validator("text")
    @classmethod
    def non_blank_text(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("text must not be empty")
        return value


class NLPResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    user_id: str
    timestamp: datetime
    original_text: str
    detected_areas: list[AreaSignal] = Field(default_factory=list)
    detected_skills: list[SkillSignal] = Field(default_factory=list)
    detected_goals: list[AreaSignal] = Field(default_factory=list)
    detected_themes: list[Signal] = Field(default_factory=list)
    detected_emotions: list[Signal] = Field(default_factory=list)
    detected_contexts: list[str] = Field(default_factory=list)
    intensity: float = Field(ge=0, le=1)
    keywords: list[str] = Field(default_factory=list)
    confidence: float = Field(ge=0, le=1)
    processing_metadata: dict[str, Any] = Field(default_factory=dict)
