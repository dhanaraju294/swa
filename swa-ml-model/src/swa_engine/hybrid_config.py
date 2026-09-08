import json
from pathlib import Path

from .hybrid_models import HybridConfig


def load_hybrid_config(path: str | Path = "config/hybrid.json") -> HybridConfig:
    with Path(path).open(encoding="utf-8") as stream:
        return HybridConfig.model_validate(json.load(stream))
