from math import sqrt
from statistics import mean, median, stdev

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def regression_metrics(actual, predicted):
    mse = mean_squared_error(actual, predicted)
    return {"mae": float(mean_absolute_error(actual, predicted)), "mse": float(mse), "rmse": float(sqrt(mse)), "r2": float(r2_score(actual, predicted))}


def prediction_distribution(predicted, expected_range=(0.0, 1.0)):
    values = list(map(float, predicted))
    if not values:
        return {"count": 0, "minimum": None, "maximum": None, "mean": None, "median": None, "standard_deviation": None, "outside_expected_range": 0, "constant_predictions": False}
    return {"count": len(values), "minimum": min(values), "maximum": max(values), "mean": mean(values), "median": median(values), "standard_deviation": stdev(values) if len(values) > 1 else 0.0, "outside_expected_range": sum(value < expected_range[0] or value > expected_range[1] for value in values), "constant_predictions": len(set(round(value, 12) for value in values)) == 1}
