from .ml_dataset import row_values
from .ml_metrics import regression_metrics
from .ml_models import build_regression_models


def evaluate_baselines(dataset, seed=42):
    x_train, y_train = row_values(dataset.training, dataset.feature_names, "recommendation_quality")
    x_test, y_test = row_values(dataset.test, dataset.feature_names, "recommendation_quality")
    result = {}
    for name, model in build_regression_models(dataset.feature_names, seed).items():
        model.fit(x_train, y_train)
        result[name] = regression_metrics(y_test, model.predict(x_test))
    return result
