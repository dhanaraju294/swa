from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ExerciseType(str, Enum):
    reflection = "reflection"
    multiple_choice = "multiple_choice"
    scenario = "scenario"
    journaling = "journaling"
    ranking = "ranking"
    self_assessment = "self_assessment"
    micro_action = "micro_action"
    real_world_challenge = "real_world_challenge"
    communication_task = "communication_task"
    decision_task = "decision_task"
    habit_task = "habit_task"
    gratitude = "gratitude"
    perspective_taking = "perspective_taking"
    situation_analysis = "situation_analysis"
    goal_setting = "goal_setting"
    implementation_intention = "implementation_intention"


class Difficulty(int, Enum):
    very_easy = 1
    easy = 2
    moderate = 3
    challenging = 4
    advanced = 5


class SafetyLevel(str, Enum):
    low = "low"
    moderate = "moderate"
    high = "high"


class ExerciseStatus(str, Enum):
    draft = "draft"
    active = "active"
    archived = "archived"


class Exercise(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    exercise_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    title: str = Field(min_length=5)
    description: str = Field(min_length=20)
    area: str = Field(min_length=2)
    skill: str = Field(min_length=2)
    subskill: str = Field(min_length=2)
    type: ExerciseType
    difficulty: Difficulty
    estimated_minutes: int = Field(ge=1, le=180)
    objective: str = Field(min_length=10)
    instructions: list[str] = Field(min_length=1)
    prompt: str = Field(min_length=10)
    questions: list[str] = Field(default_factory=list)
    reflection_prompt: str | None = None
    tags: list[str] = Field(min_length=1)
    prerequisites: list[str] = Field(default_factory=list)
    expected_behavior: str = Field(min_length=10)
    recommended_frequency: str = Field(min_length=3)
    safety_level: SafetyLevel
    version: str = Field(pattern=r"^\d+\.\d+\.\d+$")
    source: str = Field(min_length=2)
    status: ExerciseStatus
    created_at: datetime
    updated_at: datetime

    @field_validator("instructions", "questions", "tags", "prerequisites")
    @classmethod
    def strip_list_values(cls, values: list[str]) -> list[str]:
        if any(not value.strip() for value in values):
            raise ValueError("list values must not be blank")
        return [value.strip() for value in values]

    @field_validator("updated_at")
    @classmethod
    def updated_not_before_created(cls, value: datetime, info: Any) -> datetime:
        created = info.data.get("created_at")
        if created and value < created:
            raise ValueError("updated_at cannot be earlier than created_at")
        return value
