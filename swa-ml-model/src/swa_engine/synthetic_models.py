from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class SyntheticUser:
    user_id: str
    profile: str
    goals: tuple[dict[str, Any], ...]
    selected_areas: tuple[str, ...]
    selected_skills: tuple[str, ...]
    baseline_scores: dict[str, float]
    skill_states: tuple[dict[str, Any], ...]
    preferences: dict[str, Any]
    activity_profile: dict[str, Any]


@dataclass(frozen=True)
class SyntheticConfig:
    rows: int = 10000
    seed: int = 42
    dataset_version: str = "8.0.0"
    generator_version: str = "1.0.0"
    train_fraction: float = 0.70
    validation_fraction: float = 0.15
    test_fraction: float = 0.15
    profiles: tuple[str, ...] = ("high_engagement", "low_engagement", "short_preference", "reflection_preference", "difficulty_sensitive", "rapid_improvement", "slow_improvement", "inconsistent_activity", "cold_start", "multi_goal")
    target_definition: str = "Synthetic recommendation_quality simulates utility from pre-outcome features; it is not a real-user label."


@dataclass(frozen=True)
class SyntheticDataset:
    rows: list[dict[str, Any]]
    metadata: dict[str, Any]
    feature_schema: dict[str, str]
