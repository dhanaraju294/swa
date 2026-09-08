import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class NLPVocabulary:
    themes: dict[str, list[str]]
    emotions: dict[str, list[str]]
    contexts: dict[str, list[str]]
    synonyms: dict[str, list[str]]
    goals: dict[str, list[str]]
    areas: dict[str, list[str]]
    skills: dict[str, list[str]]
    settings: dict[str, Any]


def load_vocabulary(vocabulary_path: str | Path, settings_path: str | Path) -> NLPVocabulary:
    with Path(vocabulary_path).open(encoding="utf-8") as stream:
        vocabulary = json.load(stream)
    with Path(settings_path).open(encoding="utf-8") as stream:
        settings = json.load(stream)
    return NLPVocabulary(settings=settings, **vocabulary)
