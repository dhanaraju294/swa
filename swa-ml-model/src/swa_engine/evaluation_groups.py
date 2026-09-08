from collections import defaultdict

from .ml_dataset import row_values
from .ml_metrics import regression_metrics


def grouped_metrics(model, rows, feature_names, group_column, minimum_rows=10):
    groups = defaultdict(list)
    for row in rows:
        groups[row.get(group_column)].append(row)
    result = {}
    for group, group_rows in sorted(groups.items(), key=lambda item: str(item[0])):
        if len(group_rows) < minimum_rows:
            result[str(group)] = {"status": "Insufficient evaluation data", "rows": len(group_rows)}
            continue
        x, y = row_values(group_rows, feature_names, "recommendation_quality")
        result[str(group)] = {"status": "evaluated", "rows": len(group_rows), **regression_metrics(y, model.predict(x))}
    return result
