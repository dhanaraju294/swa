from .config import EXERCISES_PATH, TAXONOMY_PATH
from .repository import ExerciseRepository
from .taxonomy import load_taxonomy


def load_repository() -> ExerciseRepository:
    taxonomy = load_taxonomy(TAXONOMY_PATH)
    return ExerciseRepository.from_json(EXERCISES_PATH, taxonomy)
