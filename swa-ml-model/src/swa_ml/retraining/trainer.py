from pathlib import Path
import json
import shutil
from datetime import datetime, timezone

import joblib
from sklearn.model_selection import KFold

from swa_engine.ml_metrics import regression_metrics
from swa_engine.ml_models import build_regression_models
from swa_engine.synthetic_features import ALLOWED_FEATURES


def train_candidate(splits: dict, config, parent_model_version: str | None = None) -> dict:
    def xy(rows):
        return [[row[name] for name in ALLOWED_FEATURES] for row in rows], [row["target"] for row in rows]
    x_train, y_train = xy(splits["train"])
    x_validation, y_validation = xy(splits["validation"])
    x_test, y_test = xy(splits["test"])
    if not x_train or not x_validation or not x_test:
        raise ValueError("time-aware split requires non-empty train, validation, and test sets")
    models = build_regression_models(ALLOWED_FEATURES, config.random_seed, config.random_forest_parameters)
    comparisons = []
    fitted = {}
    for name, model in models.items():
        model.fit(x_train, y_train)
        comparisons.append({"model": name, "validation_metrics": regression_metrics(y_validation, model.predict(x_validation))})
        fitted[name] = model
    selected = min(comparisons, key=lambda value: value["validation_metrics"]["mae"])
    model = fitted[selected["model"]]
    test_metrics = regression_metrics(y_test, model.predict(x_test))
    output = Path(config.output_directory) / config.model_version
    output.mkdir(parents=True, exist_ok=False)
    artifact = output / "model.joblib"
    joblib.dump(model, artifact)
    metadata = {"model_name": selected["model"], "model_version": config.model_version, "parent_model_version": parent_model_version, "dataset_version": config.dataset_version, "target": config.target.value, "training_timestamp": datetime.now(timezone.utc).isoformat(), "data_source": "real", "synthetic_training_data": False, "feature_count": len(ALLOWED_FEATURES), "feature_schema": list(ALLOWED_FEATURES), "metrics": {"validation": selected["validation_metrics"], "test": test_metrics}, "artifact_path": str(artifact), "status": "CANDIDATE"}
    (output / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return {"metadata": metadata, "artifact_path": artifact, "comparisons": comparisons, "output_directory": output}