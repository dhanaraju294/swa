from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import joblib

from swa_engine.synthetic_features import ALLOWED_FEATURES


class ModelSuite:
    def __init__(self, artifact_dir: str | Path = "artifacts/ml_suite"):
        self.artifact_dir = Path(artifact_dir)
        self.models = {}
        self.metadata = {}
        self._load("linear_regression")
        self._load("random_forest")
        self._load("neural_network")

    def _load(self, name: str) -> None:
        artifact = self.artifact_dir / f"{name}.joblib"
        metadata = self.artifact_dir / f"{name}_metadata.json"
        if artifact.exists() and metadata.exists():
            self.models[name] = joblib.load(artifact)
            self.metadata[name] = json.loads(
                metadata.read_text(encoding="utf-8")
            )

    def available(self) -> list[str]:
        return sorted(self.models)

    def predict(
        self, features: dict[str, Any], model: str = "ensemble"
    ) -> dict[str, Any]:
        missing = [name for name in ALLOWED_FEATURES if name not in features]
        if missing:
            raise ValueError(f"missing inference features: {missing}")

        names = self.available() if model == "ensemble" else [model]
        if not names:
            raise RuntimeError("no trained ML suite artifacts are available")

        unknown = [name for name in names if name not in self.models]
        if unknown:
            raise RuntimeError(
                f"requested model(s) are not trained: {unknown}. "
                "Run `python -m swa_ml_api.train_suite`."
            )

        row = [[features[name] for name in ALLOWED_FEATURES]]
        predictions = {
            name: float(self.models[name].predict(row)[0])
            for name in names
        }
        ensemble = sum(predictions.values()) / len(predictions)

        return {
            "model": model,
            "predictions": predictions,
            "predicted_score": float(
                ensemble if model == "ensemble" else predictions[names[0]]
            ),
            "model_versions": {
                name: self.metadata[name].get("model_version")
                for name in names
            },
        }
