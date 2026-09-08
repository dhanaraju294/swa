import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class PatternConfig:
    minimum_attempts: int = 3
    minimum_events: int = 3
    minimum_confidence: float = 0.45
    recent_days: int = 30
    trend_window_days: int = 14
    short_minutes: int = 15
    long_minutes: int = 30
    high_completion_rate: float = 0.7
    low_completion_rate: float = 0.3
    high_skip_rate: float = 0.5
    high_abandonment_rate: float = 0.4
    preference_share: float = 0.6
    area_focus_share: float = 0.5
    usefulness_high: float = 0.75
    usefulness_low: float = 0.4
    difficult_level: int = 4
    difficulty_abandonment_rate: float = 0.5
    time_preference_share: float = 0.6
    trend_ratio: float = 1.5
    inactive_days: int = 45
    pattern_types: tuple[str, ...] = ()


def load_pattern_config(path: str | Path) -> PatternConfig:
    with Path(path).open(encoding="utf-8") as stream:
        return PatternConfig(**json.load(stream))
