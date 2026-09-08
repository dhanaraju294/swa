from sklearn.dummy import DummyRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline

from .ml_preprocessing import build_preprocessor
from .synthetic_features import FEATURE_SCHEMA


def build_regression_models(feature_names, seed=42, forest_parameters=None):
    forest_parameters = forest_parameters or {"n_estimators": 80, "max_depth": 12, "min_samples_leaf": 2, "n_jobs": -1}
    return {
        "dummy_regressor": Pipeline([("preprocess", build_preprocessor(feature_names)), ("model", DummyRegressor(strategy="mean"))]),
        "linear_regression": Pipeline([("preprocess", build_preprocessor(feature_names)), ("model", LinearRegression())]),
        "random_forest_regressor": Pipeline([("preprocess", build_preprocessor(feature_names)), ("model", RandomForestRegressor(random_state=seed, **forest_parameters))]),
    }
