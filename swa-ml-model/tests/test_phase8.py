import csv
import json
from pathlib import Path

import pytest

from swa_engine.synthetic_config import load_synthetic_config
from swa_engine.synthetic_export import export_csv, export_metadata
from swa_engine.synthetic_features import ALLOWED_FEATURES, FEATURE_SCHEMA, TARGET_ONLY_FIELDS, validate_feature_row
from swa_engine.synthetic_generator import SyntheticDatasetGenerator
from swa_engine.synthetic_models import SyntheticConfig
from swa_engine.synthetic_pipeline import generate_development_dataset
from swa_engine.synthetic_split import split_dataset, time_aware_split
from swa_engine.synthetic_validation import validate_dataset


def generate(rows=40, seed=42):
    return SyntheticDatasetGenerator(SyntheticConfig(rows=rows, seed=seed)).generate()


def test_user_generation_and_synthetic_metadata():
    dataset = generate()
    assert dataset.rows[0]["user_id"].startswith("synthetic_user_")
    assert dataset.metadata["synthetic_data"] is True
    assert dataset.metadata["random_seed"] == 42


def test_skill_state_features_are_valid():
    dataset = generate()
    for row in dataset.rows:
        assert 0 <= row["mastery_score"] <= 1
        assert 0 <= row["evidence_confidence"] <= 1
        assert 0 <= row["success_rate"] <= 1
        assert 0 <= row["recommended_difficulty"] <= 5


def test_behavior_profiles_are_correlated():
    dataset = generate(100)
    high = [row["completion_rate"] for row in dataset.rows if row["simulation_profile"] == "high_engagement"]
    low = [row["completion_rate"] for row in dataset.rows if row["simulation_profile"] == "low_engagement"]
    assert sum(high) / len(high) > sum(low) / len(low)


def test_difficulty_and_nlp_features_exist():
    row = generate().rows[0]
    assert {"current_difficulty", "recommended_difficulty", "consecutive_successes", "consecutive_failures"}.issubset(row)
    assert {"nlp_area_signal", "nlp_confidence", "nlp_intensity"}.issubset(row)


def test_exercise_features_and_target_are_present():
    row = generate().rows[0]
    assert row["exercise_id"]
    assert row["exercise_type"]
    assert 1 <= row["exercise_difficulty"] <= 5
    assert 0 <= row["recommendation_quality"] <= 1
    assert "recommendation_quality" in TARGET_ONLY_FIELDS


def test_target_is_not_phase4_score_copy():
    dataset = generate(100)
    assert len({row["recommendation_quality"] for row in dataset.rows}) > 10
    assert any(row["recommendation_quality"] != row["completion_rate"] for row in dataset.rows)


def test_reproducibility_and_seed():
    first = generate(100, 42).rows
    second = generate(100, 42).rows
    third = generate(100, 43).rows
    assert first == second
    assert first != third


def test_feature_schema_and_row_validation():
    row = generate().rows[0]
    assert not validate_feature_row(row)
    assert len(FEATURE_SCHEMA) == len(ALLOWED_FEATURES) + len(TARGET_ONLY_FIELDS)
    errors = validate_feature_row({})
    assert any("missing feature" in error for error in errors)


def test_missing_values_and_range_validation():
    row = generate().rows[0].copy()
    row["completion_rate"] = 2
    report = validate_dataset([row])
    assert not report["valid"]
    assert any("completion_rate outside 0-1" in error for error in report["errors"])


def test_duplicate_detection():
    rows = generate(2).rows
    rows[1]["interaction_id"] = rows[0]["interaction_id"]
    report = validate_dataset(rows)
    assert not report["valid"]
    assert "duplicate interaction_id values" in report["errors"]


def test_leakage_contract():
    assert "recommendation_quality" not in ALLOWED_FEATURES
    assert TARGET_ONLY_FIELDS == ("recommendation_quality",)
    assert "recommendation_quality" not in [name for name in ALLOWED_FEATURES]


def test_dataset_splits():
    rows = generate(100).rows
    splits = split_dataset(rows)
    assert len(splits.training) == 70
    assert len(splits.validation) == 15
    assert len(splits.test) == 15


def test_time_aware_split_is_deterministic():
    rows = generate(20).rows
    first = time_aware_split(rows)
    second = time_aware_split(rows)
    assert first == second
    assert len(first.training) + len(first.validation) + len(first.test) == 20


def test_target_distribution_report():
    report = validate_dataset(generate(100).rows)
    distribution = report["target_distribution"]
    assert distribution["minimum"] >= 0
    assert distribution["maximum"] <= 1
    assert "mean" in distribution and "median" in distribution and "standard_deviation" in distribution
    assert "class_counts" in distribution


def test_csv_export_and_metadata(tmp_path):
    dataset = generate(10)
    csv_path = export_csv(dataset.rows, tmp_path / "synthetic.csv")
    metadata_path = export_metadata(dataset.metadata, tmp_path / "metadata.json")
    with csv_path.open(encoding="utf-8") as stream:
        assert len(list(csv.DictReader(stream))) == 10
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    assert metadata["synthetic_data"] is True


def test_configurable_dataset_sizes():
    assert len(generate(1).rows) == 1
    assert len(generate(100).rows) == 100


def test_config_loader():
    config = load_synthetic_config("config/synthetic_data.json")
    assert config.rows == 10000
    assert config.seed == 42


def test_default_pipeline_and_report():
    dataset, splits, report = generate_development_dataset()
    assert len(dataset.rows) == 10000
    assert report["valid"]
    assert len(splits.training) + len(splits.validation) + len(splits.test) == 10000


def test_edge_empty_dataset_report():
    report = validate_dataset([])
    assert report["valid"]
    assert report["row_count"] == 0
    assert report["target_distribution"]["mean"] == 0
