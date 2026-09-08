import json
from dataclasses import asdict
from pathlib import Path

from .scoring import MasteryWeights


def load_mastery_weights(path: str | Path) -> MasteryWeights:
    with Path(path).open(encoding="utf-8") as stream:
        payload = json.load(stream)
    return MasteryWeights(**payload.get("weights", {}), **{key: value for key, value in payload.items() if key != "weights"})


def mastery_config_dict(weights: MasteryWeights | None = None) -> dict[str, float | int | dict[str, float]]:
    weights = weights or MasteryWeights()
    values = asdict(weights)
    component_names = {"completion", "usefulness", "improvement", "difficulty", "reflection", "consistency"}
    return {"weights": {key: values.pop(key) for key in component_names}, **values}
