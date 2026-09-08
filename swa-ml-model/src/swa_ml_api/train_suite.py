from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.neural_network import MLPRegressor
from sklearn.pipeline import Pipeline

from swa_engine.ml_dataset import load_dataset, row_values
from swa_engine.ml_metrics import regression_metrics
from swa_engine.ml_preprocessing import build_preprocessor


def main() -> None:
    dataset = load_dataset(
        "artifacts/synthetic_training_data.csv",
        "artifacts/synthetic_training_metadata.json",
        "recommendation_quality",
    )
    x_train, y_train = row_values(
        dataset.training, dataset.feature_names, "recommendation_quality"
    )
    x_test, y_test = row_values(
        dataset.test, dataset.feature_names, "recommendation_quality"
    )

    models = {
        "linear_regression": LinearRegression(),
        "random_forest": RandomForestRegressor(
            n_estimators=120,
            max_depth=12,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1,
        ),
        "neural_network": MLPRegressor(
            hidden_layer_sizes=(32, 16),
            activation="relu",
            solver="adam",
            alpha=1e-4,
            learning_rate_init=1e-3,
            max_iter=150,
            early_stopping=True,
            validation_fraction=0.15,
            random_state=42,
        ),
    }

    output = Path("artifacts/ml_suite")
    output.mkdir(parents=True, exist_ok=True)
    for name, estimator in models.items():
        model = Pipeline([
            ("preprocess", build_preprocessor(dataset.feature_names)),
            ("model", estimator),
        ])
        model.fit(x_train, y_train)
        test_metrics = regression_metrics(y_test, model.predict(x_test))
        cv_mae = []

        version = f"swa_{name}_v1"
        joblib.dump(model, output / f"{name}.joblib")

        metadata = {
            "model_name": name,
            "model_version": version,
            "dataset_version": dataset.metadata.get("dataset_version"),
            "feature_schema": list(dataset.feature_names),
            "target_column": "recommendation_quality",
            "test_metrics": test_metrics,
            "cv_mae_mean": None,
            "cv_mae_std": None,
            "synthetic_training_data": True,
            "training_timestamp": datetime.now(timezone.utc).isoformat(),
        }

        (output / f"{name}_metadata.json").write_text(
            json.dumps(metadata, indent=2), encoding="utf-8"
        )
        print(name, test_metrics)

    print("Model suite written to artifacts/ml_suite/")
    print("Training source is synthetic development data.")


if __name__ == "__main__":
    main()
