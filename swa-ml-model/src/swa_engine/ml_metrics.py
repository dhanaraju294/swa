from math import sqrt

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def regression_metrics(actual, predicted):
    mse = mean_squared_error(actual, predicted)
    return {"mae": float(mean_absolute_error(actual, predicted)), "mse": float(mse), "rmse": float(sqrt(mse)), "r2": float(r2_score(actual, predicted))}
