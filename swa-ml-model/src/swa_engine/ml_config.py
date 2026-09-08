import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class TrainingConfig:
    random_seed: int = 42
    target_column: str = "recommendation_quality"
    dataset_version: str = "8.0.0"
    model_version: str = "swa_ml_baseline_v1"
    output_directory: str = "artifacts/ml_baseline"
    primary_metric: str = "mae"
    cv_folds: int = 3
    random_forest_parameters: dict | None = None


def load_training_config(path: str | Path = "config/training.json") -> TrainingConfig:
    with Path(path).open(encoding="utf-8") as stream:
        return TrainingConfig(**json.load(stream))
