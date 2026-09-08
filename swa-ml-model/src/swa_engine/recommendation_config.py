import json
from dataclasses import dataclass, fields
from pathlib import Path


@dataclass(frozen=True)
class RecommendationConfig:
    goal_relevance: float = 0.20
    skill_relevance: float = 0.20
    mastery_relevance: float = 0.15
    context_relevance: float = 0.10
    recency: float = 0.08
    novelty: float = 0.12
    usefulness: float = 0.08
    difficulty: float = 0.07
    recent_history_days: int = 14
    repeat_penalty: float = 0.65
    skip_penalty: float = 0.35
    abandon_penalty: float = 0.45
    novelty_half_life_days: float = 21.0
    minimum_difficulty: int = 1
    maximum_difficulty: int = 5
    default_difficulty: int = 2
    diversity_types: bool = True
    diversity_skills: bool = True
    default_limit: int = 5
    recommendation_version: str = "1.0.0"

    @property
    def weights(self) -> dict[str, float]:
        return {name: getattr(self, name) for name in ("goal_relevance", "skill_relevance", "mastery_relevance", "context_relevance", "recency", "novelty", "usefulness", "difficulty")}


def load_recommendation_config(path: str | Path) -> RecommendationConfig:
    with Path(path).open(encoding="utf-8") as stream:
        payload = json.load(stream)
    return RecommendationConfig(**payload.get("weights", {}), **{key: value for key, value in payload.items() if key != "weights"})
