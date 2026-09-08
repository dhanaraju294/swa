from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class PatternStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    insufficient_evidence = "insufficient_evidence"


class PatternType(str, Enum):
    high_completion = "high_completion"
    low_completion = "low_completion"
    high_skip_rate = "high_skip_rate"
    high_abandonment_rate = "high_abandonment_rate"
    consistent_activity = "consistent_activity"
    inconsistent_activity = "inconsistent_activity"
    declining_activity = "declining_activity"
    increasing_activity = "increasing_activity"
    prefers_short_exercises = "prefers_short_exercises"
    prefers_long_exercises = "prefers_long_exercises"
    prefers_reflection = "prefers_reflection"
    prefers_micro_action = "prefers_micro_action"
    prefers_scenario = "prefers_scenario"
    prefers_journaling = "prefers_journaling"
    prefers_real_world_challenge = "prefers_real_world_challenge"
    frequently_completes_easy_exercises = "frequently_completes_easy_exercises"
    frequently_struggles_with_difficult_exercises = "frequently_struggles_with_difficult_exercises"
    frequently_abandons_difficult_exercises = "frequently_abandons_difficult_exercises"
    handles_increasing_difficulty = "handles_increasing_difficulty"
    repeated_focus_area = "repeated_focus_area"
    repeated_focus_skill = "repeated_focus_skill"
    low_activity_area = "low_activity_area"
    high_activity_area = "high_activity_area"
    consistently_high_usefulness = "consistently_high_usefulness"
    consistently_low_usefulness = "consistently_low_usefulness"
    difficulty_mismatch = "difficulty_mismatch"
    preferred_time_period = "preferred_time_period"
    irregular_activity_time = "irregular_activity_time"
    repeated_context = "repeated_context"


class BehavioralPattern(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    pattern_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    user_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    pattern_type: PatternType
    description: str = Field(min_length=10)
    confidence: float = Field(ge=0, le=1)
    evidence_count: int = Field(ge=0)
    first_detected_at: datetime | None = None
    last_observed_at: datetime | None = None
    status: PatternStatus
    evidence: dict[str, Any] = Field(default_factory=dict)
    metadata: dict[str, Any] = Field(default_factory=dict)


class PatternSnapshot(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    pattern_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    user_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    confidence: float = Field(ge=0, le=1)
    status: PatternStatus
    evidence: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime
