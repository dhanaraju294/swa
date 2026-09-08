from pathlib import Path

import joblib

from .ml_dataset import load_dataset
from .synthetic_features import ALLOWED_FEATURES


class BaselineInference:
    def __init__(self, artifact_path="artifacts/ml_baseline/swa_ml_baseline_v1.joblib", metadata_path="artifacts/ml_baseline/model_metadata.json"):
        if not Path(artifact_path).exists() or not Path(metadata_path).exists():
            raise FileNotFoundError("trained model artifacts are missing; run the Phase 9 training script first")
        self.model = joblib.load(artifact_path)
        import json
        self.metadata = json.loads(Path(metadata_path).read_text(encoding="utf-8"))

    def predict_one(self, row: dict) -> dict:
        missing = [name for name in ALLOWED_FEATURES if name not in row]
        if missing:
            raise ValueError(f"missing inference features: {missing}")
        values = [[row[name] for name in ALLOWED_FEATURES]]
        return {"exercise_id": row.get("exercise_id"), "predicted_score": float(self.model.predict(values)[0]), "model_version": self.metadata["model_version"]}

    def predict_batch(self, rows: list[dict]) -> list[dict]:
        return [self.predict_one(row) for row in rows]
