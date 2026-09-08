import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class DifficultyConfig:
    default_difficulty: int = 2
    minimum_evidence: int = 3
    increase_success_rate: float = 0.75
    decrease_failure_rate: float = 0.5
    maximum_change_per_update: int = 1
    difficulty_rating_too_hard: int = 4
    difficulty_rating_too_easy: int = 2
    difficulty_tolerance: int = 0
    recency_half_life_days: float = 30.0
    minimum_confidence: float = 0.45
    mastery_influence_min_evidence: float = 0.5
    consecutive_success_threshold: int = 3
    consecutive_failure_threshold: int = 2


def load_difficulty_config(path: str | Path) -> DifficultyConfig:
    with Path(path).open(encoding="utf-8") as stream:
        return DifficultyConfig(**json.load(stream))
