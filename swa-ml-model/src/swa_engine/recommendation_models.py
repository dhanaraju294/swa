from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class RecommendationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    user_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    requested_area: str | None = Field(default=None, min_length=2)
    requested_skill: str | None = Field(default=None, min_length=2)
    current_context: dict[str, Any] | None = None
    limit: int = Field(default=5, ge=1, le=50)


class Recommendation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    exercise_id: str
    title: str
    area: str
    skill: str
    difficulty: int
    score: float = Field(ge=0, le=1)
    score_components: dict[str, float]
    reason: str


class RecommendationResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    user_id: str
    generated_at: datetime
    recommendations: list[Recommendation]
    recommendation_version: str
    strategy: str
    explanation: str
