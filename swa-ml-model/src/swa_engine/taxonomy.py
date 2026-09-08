import json
from pathlib import Path

from pydantic import BaseModel, ConfigDict, Field


class Skill(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(min_length=2)
    description: str = Field(min_length=10)
    subskills: list[str] = Field(min_length=1)


class DevelopmentArea(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(min_length=2)
    description: str = Field(min_length=10)
    skills: list[Skill] = Field(min_length=1)


class Taxonomy(BaseModel):
    model_config = ConfigDict(extra="forbid")
    version: str
    areas: list[DevelopmentArea] = Field(min_length=1)

    def skill_names(self, area: str | None = None) -> set[str]:
        areas = self.areas if area is None else [item for item in self.areas if item.name == area]
        return {skill.name for item in areas for skill in item.skills}

    def has_skill(self, area: str, skill: str, subskill: str | None = None) -> bool:
        for item in self.areas:
            if item.name != area:
                continue
            for candidate in item.skills:
                if candidate.name == skill and (subskill is None or subskill in candidate.subskills):
                    return True
        return False


def load_taxonomy(path: str | Path) -> Taxonomy:
    with Path(path).open(encoding="utf-8") as stream:
        return Taxonomy.model_validate(json.load(stream))
