from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from .synthetic_features import FEATURE_SCHEMA


def build_preprocessor(feature_names: tuple[str, ...]) -> ColumnTransformer:
    numeric = [index for index, name in enumerate(feature_names) if FEATURE_SCHEMA[name] == "numeric"]
    boolean = [index for index, name in enumerate(feature_names) if FEATURE_SCHEMA[name] == "boolean"]
    categorical = [index for index, name in enumerate(feature_names) if FEATURE_SCHEMA[name] == "categorical"]
    numeric_pipeline = Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())])
    boolean_pipeline = Pipeline([("imputer", SimpleImputer(strategy="most_frequent"))])
    categorical_pipeline = Pipeline([("imputer", SimpleImputer(strategy="most_frequent")), ("onehot", OneHotEncoder(handle_unknown="ignore"))])
    return ColumnTransformer([("numeric", numeric_pipeline, numeric), ("boolean", boolean_pipeline, boolean), ("categorical", categorical_pipeline, categorical)], remainder="drop")
