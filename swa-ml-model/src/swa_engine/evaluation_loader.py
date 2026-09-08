import json
from pathlib import Path

import joblib

from .ml_dataset import DatasetBundle, load_dataset


class EvaluationBundle:
    def __init__(self, model, model_metadata: dict, dataset: DatasetBundle):
        self.model = model
        self.model_metadata = model_metadata
        self.dataset = dataset


def load_evaluation_bundle(artifact_path: str, model_metadata_path: str, dataset_csv: str, dataset_metadata: str) -> EvaluationBundle:
    artifact = Path(artifact_path)
    metadata_file = Path(model_metadata_path)
    if not artifact.exists() or not metadata_file.exists():
        raise FileNotFoundError("Phase 9 model artifacts are missing. Run `python -m swa_engine.train_phase9` first.")
    metadata = json.loads(metadata_file.read_text(encoding="utf-8"))
    dataset = load_dataset(dataset_csv, dataset_metadata, metadata.get("target_column", "recommendation_quality"))
    if metadata.get("synthetic_training_data") is not True or dataset.metadata.get("synthetic_data") is not True:
        raise ValueError("Phase 10 requires synthetic dataset and model metadata flags to be true")
    if metadata.get("dataset_version") != dataset.metadata.get("dataset_version"):
        raise ValueError("model and dataset versions are incompatible")
    if metadata.get("feature_count") != len(dataset.feature_names):
        raise ValueError("model and dataset feature schemas are incompatible")
    return EvaluationBundle(joblib.load(artifact), metadata, dataset)
