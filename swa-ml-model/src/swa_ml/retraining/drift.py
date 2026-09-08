from statistics import mean


def data_drift(reference, current, numeric_fields=("mastery_score", "completion_rate", "exercise_difficulty")):
    report = {}
    for field in numeric_fields:
        old = [float(row[field]) for row in reference if field in row]
        new = [float(row[field]) for row in current if field in row]
        report[field] = {"reference_mean": mean(old) if old else None, "current_mean": mean(new) if new else None, "warning": bool(old and new and abs(mean(old) - mean(new)) > 0.1)}
    return report


def target_drift(reference, current):
    old = [row["target"] for row in reference if "target" in row]
    new = [row["target"] for row in current if "target" in row]
    return {"reference_mean": mean(old) if old else None, "current_mean": mean(new) if new else None, "warning": bool(old and new and abs(mean(old) - mean(new)) > 0.1)}


def model_drift(current_model, candidate_model, rows):
    current = current_model.predict(rows)
    candidate = candidate_model.predict(rows)
    pairs = list(zip(current, candidate))
    mean_difference = mean(abs(float(a) - float(b)) for a, b in pairs) if pairs else None
    return {"prediction_count": len(pairs), "mean_absolute_difference": mean_difference}