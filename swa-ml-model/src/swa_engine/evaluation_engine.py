from datetime import datetime, timezone
from statistics import mean

from sklearn.model_selection import KFold, cross_val_score
from sklearn.dummy import DummyRegressor

from .evaluation_ablation import ablation_results
from .evaluation_baselines import evaluate_baselines
from .evaluation_config import EvaluationConfig
from .evaluation_groups import grouped_metrics
from .evaluation_loader import load_evaluation_bundle
from .evaluation_metrics import prediction_distribution, regression_metrics
from .evaluation_readiness import assess_readiness
from .evaluation_report import write_reports
from .evaluation_robustness import robustness_checks
from .ml_dataset import row_values


class MLEvaluator:
    def __init__(self, config: EvaluationConfig | None = None):
        self.config = config or EvaluationConfig()

    def evaluate(self) -> dict:
        bundle = load_evaluation_bundle(self.config.model_artifact, self.config.model_metadata, self.config.dataset_csv, self.config.dataset_metadata)
        dataset = bundle.dataset
        x_train, y_train = row_values(dataset.training, dataset.feature_names, "recommendation_quality")
        x_validation, y_validation = row_values(dataset.validation, dataset.feature_names, "recommendation_quality")
        x_test, y_test = row_values(dataset.test, dataset.feature_names, "recommendation_quality")
        model = bundle.model
        training_metrics = regression_metrics(y_train, model.predict(x_train))
        validation_metrics = regression_metrics(y_validation, model.predict(x_validation))
        predictions = model.predict(x_test)
        test_metrics = regression_metrics(y_test, predictions)
        dummy = DummyRegressor(strategy="mean").fit(x_train, y_train)
        baseline_metrics = {"dummy_regressor": regression_metrics(y_test, dummy.predict(x_test)), "selected_model": test_metrics}
        cv = KFold(n_splits=self.config.cv_folds, shuffle=True, random_state=self.config.random_seed)
        cv_scores = -cross_val_score(model, x_train, y_train, cv=cv, scoring="neg_mean_absolute_error")
        residuals = [actual - predicted for actual, predicted in zip(y_test, predictions)]
        errors = sorted(({"user_id": row["user_id"], "exercise_id": row["exercise_id"], "actual": actual, "predicted": float(predicted), "absolute_error": abs(actual - predicted), "difficulty": row["exercise_difficulty"], "profile": row["simulation_profile"]} for row, actual, predicted in zip(dataset.test, y_test, predictions)), key=lambda item: item["absolute_error"], reverse=True)[: self.config.top_error_count]
        generalization = grouped_metrics(model, dataset.test, dataset.feature_names, "simulation_profile", self.config.minimum_group_rows)
        area_metrics = grouped_metrics(model, dataset.test, dataset.feature_names, "area", self.config.minimum_group_rows)
        cold_rows = [row for row in dataset.test if row["evidence_confidence"] <= 0.2]
        rich_rows = [row for row in dataset.test if row["evidence_confidence"] > 0.2]
        cold_start = {"cold_start_rows": len(cold_rows), "rich_rows": len(rich_rows), "cold_start_metrics": self._group(model, cold_rows, dataset.feature_names), "rich_metrics": self._group(model, rich_rows, dataset.feature_names)}
        report = {"model_version": bundle.model_metadata["model_version"], "dataset_version": bundle.model_metadata["dataset_version"], "synthetic_data": True, "evaluation_timestamp": datetime.now(timezone.utc).isoformat(), "test_metrics": test_metrics, "validation_metrics": validation_metrics, "training_metrics": training_metrics, "baseline_metrics": baseline_metrics, "cross_validation": {"mae_mean": float(cv_scores.mean()), "mae_std": float(cv_scores.std()), "mae_min": float(cv_scores.min()), "mae_max": float(cv_scores.max()), "folds": self.config.cv_folds}, "overfitting": {"training_mae": training_metrics["mae"], "validation_mae": validation_metrics["mae"], "test_mae": test_metrics["mae"], "max_gap": max(abs(training_metrics["mae"] - validation_metrics["mae"]), abs(training_metrics["mae"] - test_metrics["mae"])), "flagged": max(abs(training_metrics["mae"] - validation_metrics["mae"]), abs(training_metrics["mae"] - test_metrics["mae"])) > self.config.overfit_mae_gap}, "generalization": generalization, "cold_start": cold_start, "feature_ablation": ablation_results(dataset, self.config.random_seed), "feature_importance": self._feature_importance(model), "prediction_distribution": prediction_distribution(predictions), "residual_analysis": {"mean_residual": mean(residuals), "mae": test_metrics["mae"], "rmse": test_metrics["rmse"]}, "error_analysis": errors, "area_metrics": area_metrics, "skill_metrics": grouped_metrics(model, dataset.test, dataset.feature_names, "skill", self.config.minimum_group_rows), "reliability": self._reliability(y_test, predictions), "robustness": robustness_checks(model, dataset.test[0]), "reproducibility": {"status": "deterministic configuration and held-out evaluation", "random_seed": self.config.random_seed}, "readiness": assess_readiness(test_metrics, baseline_metrics, generalization, prediction_distribution(predictions), (self.config.readiness or {}))}
        json_path, text_path = write_reports(report, self.config.report_directory)
        report["report_paths"] = {"json": str(json_path), "text": str(text_path)}
        return report

    @staticmethod
    def _group(model, rows, feature_names):
        if not rows:
            return {"status": "Insufficient evaluation data", "rows": 0}
        x, y = row_values(rows, feature_names, "recommendation_quality")
        return {"status": "evaluated", "rows": len(rows), **regression_metrics(y, model.predict(x))}

    @staticmethod
    def _feature_importance(model):
        estimator = model.named_steps["model"]
        names = model.named_steps["preprocess"].get_feature_names_out()
        values = estimator.coef_[0] if hasattr(estimator, "coef_") and getattr(estimator.coef_, "ndim", 1) > 1 else estimator.coef_ if hasattr(estimator, "coef_") else estimator.feature_importances_ if hasattr(estimator, "feature_importances_") else []
        return sorted(({"feature": name, "value": float(value)} for name, value in zip(names, values)), key=lambda item: abs(item["value"]), reverse=True)[:20]

    @staticmethod
    def _reliability(actual, predicted):
        bins = []
        for lower, upper in ((0, .2), (.2, .4), (.4, .6), (.6, .8), (.8, 1.01)):
            selected = [(a, p) for a, p in zip(actual, predicted) if lower <= p < upper]
            if selected:
                bins.append({"lower": lower, "upper": upper, "rows": len(selected), "predicted_mean": mean(p for _, p in selected), "actual_mean": mean(a for a, _ in selected)})
        return bins
