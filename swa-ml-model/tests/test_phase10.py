import json
from pathlib import Path

import pytest

from swa_engine.evaluation_config import EvaluationConfig, load_evaluation_config
from swa_engine.evaluation_engine import MLEvaluator
from swa_engine.evaluation_loader import load_evaluation_bundle
from swa_engine.evaluation_metrics import prediction_distribution, regression_metrics
from swa_engine.evaluation_readiness import assess_readiness
from swa_engine.evaluation_robustness import robustness_checks


@pytest.fixture(scope="module")
def report():
    return MLEvaluator(EvaluationConfig(report_directory="artifacts/test_evaluation")).evaluate()


def test_model_loading_and_compatibility():
    bundle = load_evaluation_bundle("artifacts/ml_baseline/swa_ml_baseline_v1.joblib", "artifacts/ml_baseline/model_metadata.json", "artifacts/synthetic_training_data.csv", "artifacts/synthetic_training_metadata.json")
    assert bundle.model_metadata["dataset_version"] == bundle.dataset.metadata["dataset_version"]
    assert bundle.model_metadata["feature_count"] == len(bundle.dataset.feature_names)


def test_invalid_compatibility(tmp_path):
    metadata = json.loads(Path("artifacts/ml_baseline/model_metadata.json").read_text(encoding="utf-8"))
    metadata["dataset_version"] = "wrong"
    path = tmp_path / "metadata.json"
    path.write_text(json.dumps(metadata), encoding="utf-8")
    with pytest.raises(ValueError, match="versions are incompatible"):
        load_evaluation_bundle("artifacts/ml_baseline/swa_ml_baseline_v1.joblib", path, "artifacts/synthetic_training_data.csv", "artifacts/synthetic_training_metadata.json")


def test_baseline_test_metrics_and_cv(report):
    assert report["baseline_metrics"]["dummy_regressor"]["mae"] > report["test_metrics"]["mae"]
    assert report["cross_validation"]["folds"] == 3
    assert report["cross_validation"]["mae_min"] <= report["cross_validation"]["mae_max"]


def test_overfitting_generalization_and_cold_start(report):
    assert "flagged" in report["overfitting"]
    assert report["generalization"]
    assert report["cold_start"]["cold_start_rows"] + report["cold_start"]["rich_rows"] == 1500


def test_ablation_feature_importance_and_reliability(report):
    assert set(report["feature_ablation"]) == {"without_nlp", "without_behavior", "without_mastery", "without_exercise_metadata"}
    assert report["feature_importance"]
    assert report["reliability"]


def test_prediction_distribution_residuals_and_errors(report):
    distribution = report["prediction_distribution"]
    assert distribution["outside_expected_range"] >= 0
    assert distribution["count"] == 1500
    assert set(report["residual_analysis"]) == {"mean_residual", "mae", "rmse"}
    assert len(report["error_analysis"]) <= 10


def test_area_and_skill_evaluation(report):
    assert report["area_metrics"]
    assert report["skill_metrics"]
    assert all("mae" in value or value["status"] == "Insufficient evaluation data" for value in report["area_metrics"].values())


def test_robustness_has_actual_predictions():
    bundle = load_evaluation_bundle("artifacts/ml_baseline/swa_ml_baseline_v1.joblib", "artifacts/ml_baseline/model_metadata.json", "artifacts/synthetic_training_data.csv", "artifacts/synthetic_training_metadata.json")
    result = robustness_checks(bundle.model, bundle.dataset.test[0])
    assert result["checked_variants"] >= 1
    assert all("variant_prediction" in item for item in result["results"])


def test_reproducibility_and_report_files(report):
    assert report["reproducibility"]["random_seed"] == 42
    assert Path(report["report_paths"]["json"]).exists()
    assert Path(report["report_paths"]["text"]).exists()
    payload = json.loads(Path(report["report_paths"]["json"]).read_text(encoding="utf-8"))
    assert payload["synthetic_data"] is True


def test_readiness_is_transparent():
    distribution = prediction_distribution([0.2, 0.4])
    readiness = assess_readiness(regression_metrics([0, 1], [0.2, 0.8]), {"dummy_regressor": {"mae": 0.5}}, {"one": {"status": "evaluated", "mae": 0.1}}, distribution, {"minimum_r2": -1, "maximum_mae": 1, "maximum_group_mae_gap": 1})
    assert readiness["status"] in {"NOT_READY", "BASELINE_READY", "EXPERIMENTALLY_READY"}
    assert "checks" in readiness


def test_config_loader():
    config = load_evaluation_config()
    assert config.random_seed == 42
    assert config.overfit_mae_gap == 0.05
