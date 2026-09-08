from collections import Counter
from statistics import mean, median, stdev

from .synthetic_features import ALLOWED_FEATURES, FEATURE_SCHEMA, TARGET_ONLY_FIELDS, validate_feature_row


def validate_dataset(rows: list[dict]) -> dict:
    errors = []
    ids = [row.get("interaction_id") for row in rows]
    if len(ids) != len(set(ids)):
        errors.append("duplicate interaction_id values")
    for index, row in enumerate(rows):
        errors.extend(f"row {index}: {error}" for error in validate_feature_row(row))
        for name in ("mastery_score", "evidence_confidence", "completion_rate", "skip_rate", "abandonment_rate", "recommendation_quality"):
            if isinstance(row.get(name), (int, float)) and not 0 <= row[name] <= 1:
                errors.append(f"row {index}: {name} outside 0-1")
    leakage = sorted(set(row for row in TARGET_ONLY_FIELDS if row in ALLOWED_FEATURES))
    if leakage:
        errors.append(f"target leakage: {leakage}")
    values = [row["recommendation_quality"] for row in rows] if rows else []
    stats = {"mean": mean(values) if values else 0, "median": median(values) if values else 0, "minimum": min(values) if values else 0, "maximum": max(values) if values else 0, "standard_deviation": stdev(values) if len(values) > 1 else 0, "class_counts": dict(Counter(value >= 0.5 for value in values))}
    return {"valid": not errors, "errors": errors, "row_count": len(rows), "feature_count": len(FEATURE_SCHEMA), "missing_value_count": sum(value is None for row in rows for value in row.values()), "target_distribution": stats}
