import json
from pathlib import Path

import pytest

from swa_engine.ml_config import TrainingConfig, load_training_config
from swa_engine.ml_dataset import load_dataset, row_values
from swa_engine.ml_inference import BaselineInference
from swa_engine.ml_metrics import regression_metrics
from swa_engine.ml_models import build_regression_models
from swa_engine.ml_preprocessing import build_preprocessor
from swa_engine.ml_registry import ModelRegistry
from swa_engine.ml_training import train_baselines
from swa_engine.synthetic_features import ALLOWED_FEATURES, TARGET_ONLY_FIELDS


@pytest.fixture(scope="module")
def training_result():
    return train_baselines(TrainingConfig(output_directory="artifacts/ml_test_baseline", random_forest_parameters={"n_estimators": 12, "max_depth": 8, "n_jobs": 1}))


def test_dataset_loading_and_schema():
    dataset = load_dataset()
    assert dataset.metadata["synthetic_data"] is True
    assert dataset.feature_names == ALLOWED_FEATURES
    assert len(dataset.training) == 7000
    assert len(dataset.validation) == 1500
    assert len(dataset.test) == 1500


def test_target_validation_and_separation():
    dataset = load_dataset()
    assert "recommendation_quality" not in dataset.feature_names
    assert TARGET_ONLY_FIELDS == ("recommendation_quality",)
    values, targets = row_values(dataset.training[:2], dataset.feature_names, "recommendation_quality")
    assert len(values[0]) == len(ALLOWED_FEATURES)
    assert len(targets) == 2


def test_preprocessing_and_model_definitions():
    preprocessor = build_preprocessor(ALLOWED_FEATURES)
    models = build_regression_models(ALLOWED_FEATURES, forest_parameters={"n_estimators": 4, "n_jobs": 1})
    assert "categorical" in {name for name, _, _ in preprocessor.transformers}
    assert set(models) == {"dummy_regressor", "linear_regression", "random_forest_regressor"}


def test_metrics():
    metrics = regression_metrics([0, 1], [0.25, 0.75])
    assert set(metrics) == {"mae", "mse", "rmse", "r2"}
    assert metrics["mae"] == 0.25


def test_training_comparison_and_selection(training_result):
    assert len(training_result["comparison"]) == 3
    assert training_result["metadata"]["model_name"] in {"dummy_regressor", "linear_regression", "random_forest_regressor"}
    assert training_result["metadata"]["synthetic_training_data"] is True
    assert training_result["metadata"]["validation_rows"] == 1500
    assert training_result["metadata"]["test_rows"] == 1500


def test_reproducible_training_metrics():
    config = TrainingConfig(output_directory="artifacts/ml_repro_a", random_forest_parameters={"n_estimators": 8, "n_jobs": 1})
    first = train_baselines(config)
    second = train_baselines(TrainingConfig(output_directory="artifacts/ml_repro_b", random_forest_parameters={"n_estimators": 8, "n_jobs": 1}))
    assert first["metadata"]["model_name"] == second["metadata"]["model_name"]
    assert first["metadata"]["validation_metrics"] == second["metadata"]["validation_metrics"]
    assert first["metadata"]["test_metrics"] == second["metadata"]["test_metrics"]


def test_artifacts_metadata_registry_and_feature_importance(training_result):
    result = training_result
    output = Path("artifacts/ml_test_baseline")
    assert result["artifact_path"].exists()
    assert (output / "model_metadata.json").exists()
    assert (output / "feature_importance.json").exists()
    registry = ModelRegistry(output / "model_registry.json")
    entries = registry.list()
    assert entries[-1]["status"] == "selected"
    assert entries[-1]["version"] == "swa_ml_baseline_v1"
    importance = json.loads((output / "feature_importance.json").read_text(encoding="utf-8"))
    assert importance


def test_single_and_batch_inference(training_result):
    predictor = BaselineInference(training_result["artifact_path"], "artifacts/ml_test_baseline/model_metadata.json")
    row = load_dataset().test[0]
    result = predictor.predict_one(row)
    assert result["exercise_id"] == row["exercise_id"]
    assert isinstance(result["predicted_score"], float)
    batch = predictor.predict_batch(load_dataset().test[:3])
    assert len(batch) == 3
    assert all("predicted_score" in item for item in batch)


def test_invalid_inference_input(training_result):
    predictor = BaselineInference(training_result["artifact_path"], "artifacts/ml_test_baseline/model_metadata.json")
    with pytest.raises(ValueError, match="missing inference features"):
        predictor.predict_one({})


def test_missing_dataset_error(tmp_path):
    with pytest.raises(FileNotFoundError, match="Phase 8 dataset artifacts are missing"):
        load_dataset(tmp_path / "missing.csv", tmp_path / "missing.json")


def test_config_loader():
    config = load_training_config()
    assert config.random_seed == 42
    assert config.target_column == "recommendation_quality"
