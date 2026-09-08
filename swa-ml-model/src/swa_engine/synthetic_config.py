import json
from dataclasses import fields
from pathlib import Path

from .synthetic_models import SyntheticConfig


def load_synthetic_config(path: str | Path) -> SyntheticConfig:
    with Path(path).open(encoding="utf-8") as stream:
        payload = json.load(stream)
    return SyntheticConfig(**{key: value for key, value in payload.items() if key in {field.name for field in fields(SyntheticConfig)}})
