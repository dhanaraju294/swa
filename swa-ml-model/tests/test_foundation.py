import json
from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from swa_engine.config import EXERCISES_PATH, TAXONOMY_PATH
from swa_engine.loader import load_repository
from swa_engine.models import Exercise
from swa_engine.taxonomy import load_taxonomy


@pytest.fixture
def taxonomy():
    return load_taxonomy(TAXONOMY_PATH)


@pytest.fixture
def repository():
    return load_repository()


def test_taxonomy_loading(taxonomy):
    assert len(taxonomy.areas) == 7
    assert taxonomy.areas[0].name == "Self-Awareness"
    assert taxonomy.has_skill("Confidence", "Assertiveness", "boundary setting")


def test_taxonomy_validation_rejects_unknown_shape(tmp_path):
    path = tmp_path / "invalid-taxonomy.json"
    path.write_text(json.dumps({"version": "1.0.0", "areas": [{"name": "Only area"}]}), encoding="utf-8")
    with pytest.raises(ValidationError):
        load_taxonomy(path)


def test_exercise_validation_rejects_invalid_difficulty(repository):
    payload = repository.all()[0].model_dump()
    payload["difficulty"] = 6
    with pytest.raises(ValidationError):
        Exercise.model_validate(payload)


def test_exercise_validation_rejects_unknown_type(repository):
    payload = repository.all()[0].model_dump()
    payload["type"] = "prediction"
    with pytest.raises(ValidationError):
        Exercise.model_validate(payload)


def test_exercise_loading(repository):
    assert len(repository.all()) == 70
    assert all(item.status == "active" for item in repository.all())


def test_repository_rejects_unknown_taxonomy_reference(repository, taxonomy):
    payload = repository.all()[0].model_dump()
    payload["exercise_id"] = "invalid_reference_01"
    payload["skill"] = "Unknown skill"
    with pytest.raises(ValueError, match="unknown taxonomy skill"):
        repository.add(Exercise.model_validate(payload))


def test_filtering_by_area(repository):
    exercises = repository.by_area("Self-Awareness")
    assert len(exercises) == 10
    assert all(item.area == "Self-Awareness" for item in exercises)


def test_filtering_by_skill(repository):
    exercises = repository.by_skill("Goal Setting", area="Career Clarity / Growth")
    assert len(exercises) == 3
    assert all(item.skill == "Goal Setting" for item in exercises)


def test_duplicate_exercise_ids_are_rejected(repository):
    payload = repository.all()[0].model_dump()
    payload["created_at"] = datetime.now(timezone.utc)
    payload["updated_at"] = payload["created_at"]
    with pytest.raises(ValueError, match="duplicate exercise_id"):
        repository.add(Exercise.model_validate(payload))
