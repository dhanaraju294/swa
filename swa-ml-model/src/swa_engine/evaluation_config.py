import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class EvaluationConfig:
    model_artifact: str = "artifacts/ml_baseline/swa_ml_baseline_v1.joblib"
    model_metadata: str = "artifacts/ml_baseline/model_metadata.json"
    dataset_csv: str = "artifacts/synthetic_training_data.csv"
    dataset_metadata: str = "artifacts/synthetic_training_metadata.json"
    report_directory: str = "artifacts/ml_evaluation"
    random_seed: int = 42
    cv_folds: int = 3
    overfit_mae_gap: float = 0.05
    minimum_group_rows: int = 10
    prediction_bin_count: int = 5
    top_error_count: int = 10
    readiness: dict | None = None


def load_evaluation_config(path: str | Path = "config/evaluation.json") -> EvaluationConfig:
    with Path(path).open(encoding="utf-8") as stream:
        return EvaluationConfig(**json.load(stream))
