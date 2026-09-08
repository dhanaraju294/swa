from pathlib import Path
from math import isfinite

from .ml_inference import BaselineInference
from .synthetic_features import ALLOWED_FEATURES


class HybridMLAdapter:
    def __init__(self, artifact_path: str, metadata_path: str, evaluation_report_path: str):
        self.available = False
        self.failure_reason = None
        try:
            self.inference = BaselineInference(artifact_path, metadata_path)
            report = __import__("json").loads(Path(evaluation_report_path).read_text(encoding="utf-8"))
            metadata = self.inference.metadata
            if metadata.get("feature_count") != len(ALLOWED_FEATURES):
                raise ValueError("model feature schema is incompatible with the inference schema")
            if metadata.get("dataset_version") != report.get("dataset_version"):
                raise ValueError("model and evaluation dataset versions are incompatible")
            self.readiness = report.get("readiness", {}).get("status", "NOT_READY")
            self.report = report
            if self.readiness not in {"BASELINE_READY", "EXPERIMENTALLY_READY"}:
                self.failure_reason = f"model readiness is {self.readiness}"
            elif not report.get("synthetic_data"):
                self.failure_reason = "evaluation report is not marked synthetic"
            else:
                self.available = True
        except (FileNotFoundError, ValueError, KeyError, OSError) as error:
            self.failure_reason = str(error)
            self.inference = None
            self.readiness = "NOT_READY"
            self.report = {}

    @property
    def model_version(self):
        return self.inference.metadata.get("model_version") if self.inference else None

    @property
    def dataset_version(self):
        return self.inference.metadata.get("dataset_version") if self.inference else None

    def predict(self, features: dict) -> float:
        if not self.available:
            raise RuntimeError(self.failure_reason or "ML model unavailable")
        prediction = self.inference.predict_one(features)["predicted_score"]
        if not isfinite(prediction):
            raise ValueError("ML prediction is not finite")
        return prediction
