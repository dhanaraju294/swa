def assess_readiness(test_metrics, baseline_metrics, group_metrics, prediction_distribution, config):
    rules = config or {"minimum_r2": 0.0, "maximum_mae": 0.1, "maximum_group_mae_gap": 0.1}
    baseline_mae = baseline_metrics.get("dummy_regressor", {}).get("mae", float("inf"))
    evaluated = [value["mae"] for value in group_metrics.values() if value.get("status") == "evaluated"]
    group_gap = max(evaluated) - min(evaluated) if evaluated else float("inf")
    checks = {"beats_dummy": test_metrics["mae"] < baseline_mae, "r2_threshold": test_metrics["r2"] >= rules["minimum_r2"], "mae_threshold": test_metrics["mae"] <= rules["maximum_mae"], "group_gap": group_gap <= rules["maximum_group_mae_gap"], "predictions_in_range": prediction_distribution["outside_expected_range"] == 0, "not_constant": not prediction_distribution["constant_predictions"]}
    status = "EXPERIMENTALLY_READY" if all(checks.values()) else "BASELINE_READY" if checks["beats_dummy"] and checks["predictions_in_range"] else "NOT_READY"
    return {"status": status, "checks": checks, "group_mae_gap": group_gap, "note": "Synthetic-data evaluation only; never production readiness."}
