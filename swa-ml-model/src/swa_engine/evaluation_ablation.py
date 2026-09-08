from .ml_dataset import row_values
from .ml_metrics import regression_metrics
from .ml_models import build_regression_models


GROUPS = {
    "without_nlp": {"nlp_"},
    "without_behavior": {"completion_rate", "skip_rate", "abandonment_rate", "activity_rate", "activity_consistency", "short_exercise_preference", "exercise_type_preference", "difficulty_behavior", "recent_activity", "usefulness_pattern"},
    "without_mastery": {"mastery_score", "evidence_confidence", "recent_score", "previous_score"},
    "without_exercise_metadata": {"exercise_id", "exercise_type", "exercise_difficulty", "estimated_minutes", "prerequisite_status", "historical_usefulness"}
}


def ablation_results(dataset, seed=42):
    output = {}
    x_test_all, y_test = row_values(dataset.test, dataset.feature_names, "recommendation_quality")
    for name, excluded in GROUPS.items():
        features = tuple(feature for feature in dataset.feature_names if not any(feature.startswith(prefix) for prefix in excluded) and feature not in excluded)
        x_train, y_train = row_values(dataset.training, features, "recommendation_quality")
        x_test, _ = row_values(dataset.test, features, "recommendation_quality")
        model = build_regression_models(features, seed)["linear_regression"]
        model.fit(x_train, y_train)
        output[name] = regression_metrics(y_test, model.predict(x_test))
    return output
