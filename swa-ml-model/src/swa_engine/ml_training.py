import json
import time
from pathlib import Path

import joblib
from sklearn.model_selection import KFold, cross_val_score

from .ml_config import TrainingConfig
from .ml_dataset import load_dataset, row_values
from .ml_metrics import regression_metrics
from .ml_models import build_regression_models
from .ml_registry import ModelRegistry


def train_baselines(config: TrainingConfig | None = None, csv_path="artifacts/synthetic_training_data.csv", metadata_path="artifacts/synthetic_training_metadata.json") -> dict:
    config = config or TrainingConfig()
    dataset = load_dataset(csv_path, metadata_path, config.target_column)
    x_train, y_train = row_values(dataset.training, dataset.feature_names, config.target_column)
    x_validation, y_validation = row_values(dataset.validation, dataset.feature_names, config.target_column)
    x_test, y_test = row_values(dataset.test, dataset.feature_names, config.target_column)
    models = build_regression_models(dataset.feature_names, config.random_seed, config.random_forest_parameters)
    comparison = []
    fitted = {}
    cv = KFold(n_splits=config.cv_folds, shuffle=True, random_state=config.random_seed)
    for name, model in models.items():
        started = time.perf_counter()
        model.fit(x_train, y_train)
        elapsed = time.perf_counter() - started
        validation_metrics = regression_metrics(y_validation, model.predict(x_validation))
        cv_scores = -cross_val_score(model, x_train, y_train, cv=cv, scoring="neg_mean_absolute_error", n_jobs=None)
        comparison.append({"model": name, "validation_metrics": validation_metrics, "cv_mae_mean": float(cv_scores.mean()), "cv_mae_std": float(cv_scores.std()), "training_time_seconds": elapsed, "notes": "synthetic development data; validation only"})
        fitted[name] = model
    selected = min(comparison, key=lambda item: item["validation_metrics"][config.primary_metric])
    selected_model = fitted[selected["model"]]
    test_metrics = regression_metrics(y_test, selected_model.predict(x_test))
    output = Path(config.output_directory)
    output.mkdir(parents=True, exist_ok=True)
    artifact_path = output / f"{config.model_version}.joblib"
    joblib.dump(selected_model, artifact_path)
    transformed_names = list(selected_model.named_steps["preprocess"].get_feature_names_out())
    importance = _importance(selected_model, transformed_names)
    (output / "feature_importance.json").write_text(json.dumps(importance, indent=2), encoding="utf-8")
    metadata = {"model_name": selected["model"], "model_version": config.model_version, "dataset_version": dataset.metadata.get("dataset_version"), "training_timestamp": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(), "random_seed": config.random_seed, "target_column": config.target_column, "feature_count": len(dataset.feature_names), "training_rows": len(dataset.training), "validation_rows": len(dataset.validation), "test_rows": len(dataset.test), "validation_metrics": selected["validation_metrics"], "test_metrics": test_metrics, "comparison": comparison, "preprocessing_version": "column_transformer_v1", "synthetic_training_data": True, "artifact_path": str(artifact_path)}
    (output / "model_metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    registry = ModelRegistry(output / "model_registry.json")
    registry.register({"model_name": selected["model"], "version": config.model_version, "artifact_path": str(artifact_path), "dataset_version": metadata["dataset_version"], "metrics": test_metrics, "status": "selected"})
    return {"metadata": metadata, "comparison": comparison, "artifact_path": artifact_path, "feature_importance": importance}


def _importance(model, names):
    estimator = model.named_steps["model"]
    if hasattr(estimator, "feature_importances_"):
        values = estimator.feature_importances_
    elif hasattr(estimator, "coef_"):
        values = estimator.coef_[0] if getattr(estimator.coef_, "ndim", 1) > 1 else estimator.coef_
    else:
        return []
    return sorted(({"feature": name, "importance": float(value)} for name, value in zip(names, values)), key=lambda item: abs(item["importance"]), reverse=True)
