import json
from pathlib import Path

from pydantic import ValidationError

from .models import Exercise
from .taxonomy import Taxonomy


class ExerciseRepository:
    def __init__(self, exercises: list[Exercise], taxonomy: Taxonomy):
        self._exercises = exercises
        self._taxonomy = taxonomy
        self._validate_taxonomy_references()

    @classmethod
    def from_json(cls, path: str | Path, taxonomy: Taxonomy) -> "ExerciseRepository":
        with Path(path).open(encoding="utf-8") as stream:
            payload = json.load(stream)
        if not isinstance(payload, list):
            raise ValueError("exercise data must be a JSON list")
        try:
            exercises = [Exercise.model_validate(item) for item in payload]
        except ValidationError as error:
            raise ValueError(f"invalid exercise data: {error}") from error
        return cls(exercises, taxonomy)

    def _validate_taxonomy_references(self) -> None:
        for exercise in self._exercises:
            if not self._taxonomy.has_skill(exercise.area, exercise.skill, exercise.subskill):
                raise ValueError(f"exercise {exercise.exercise_id} references an unknown taxonomy skill")

    def all(self) -> list[Exercise]:
        return list(self._exercises)

    def by_area(self, area: str) -> list[Exercise]:
        return [item for item in self._exercises if item.area == area]

    def by_skill(self, skill: str, area: str | None = None) -> list[Exercise]:
        return [item for item in self._exercises if item.skill == skill and (area is None or item.area == area)]

    def add(self, exercise: Exercise) -> None:
        if not self._taxonomy.has_skill(exercise.area, exercise.skill, exercise.subskill):
            raise ValueError("exercise references an unknown taxonomy skill")
        if any(item.exercise_id == exercise.exercise_id for item in self._exercises):
            raise ValueError(f"duplicate exercise_id: {exercise.exercise_id}")
        self._exercises.append(exercise)
