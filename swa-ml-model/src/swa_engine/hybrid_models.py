from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class HybridConfig(BaseModel):
    rule_weight: float = Field(ge=0, le=1)
    ml_weight: float = Field(ge=0, le=1)
    cold_start_rule_weight: float = Field(ge=0, le=1)
    cold_start_ml_weight: float = Field(ge=0, le=1)
    cold_start_evidence_threshold: int = Field(ge=0)
    prediction_minimum: float = 0
    prediction_maximum: float = 1
    invalid_prediction_action: str = "fallback"
    recommendation_version: str = "1.0.0"

    @property
    def normalized_weights(self) -> tuple[float, float]:
        total = self.rule_weight + self.ml_weight
        return (self.rule_weight / total, self.ml_weight / total) if total else (1.0, 0.0)

    @property
    def normalized_cold_start_weights(self) -> tuple[float, float]:
        total = self.cold_start_rule_weight + self.cold_start_ml_weight
        return (self.cold_start_rule_weight / total, self.cold_start_ml_weight / total) if total else (1.0, 0.0)


class HybridRecommendation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    exercise_id: str
    title: str
    area: str
    skill: str
    difficulty: int
    rule_score: float = Field(ge=0, le=1)
    ml_score: float | None = Field(default=None, ge=0, le=1)
    rule_weight: float = Field(ge=0, le=1)
    ml_weight: float = Field(ge=0, le=1)
    hybrid_score: float = Field(ge=0, le=1)
    score_components: dict[str, float]
    explanation: str


class HybridRecommendationResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    user_id: str
    generated_at: datetime
    recommendation_version: str
    strategy: str = "hybrid"
    model_version: str | None
    model_readiness: str
    dataset_version: str | None
    synthetic_data: bool
    ml_available: bool
    fallback_reason: str | None = None
    recommendations: list[HybridRecommendation]


class HybridComparison(BaseModel):
    exercise_id: str
    rule_score: float
    ml_score: float | None
    hybrid_score: float
    rule_only_score: float | None = None
    ml_only_score: float | None = None


class WeightExperimentResult(BaseModel):
    rule_weight: float
    ml_weight: float
    mean_hybrid_score: float
    top_exercise_id: str | None
