from copy import deepcopy


def robustness_checks(model, row):
    feature_names = tuple(model.named_steps["preprocess"].feature_names_in_) if hasattr(model.named_steps["preprocess"], "feature_names_in_") else tuple(name for name in row if name not in {"recommendation_quality", "interaction_id"})
    baseline_row = [[row[name] for name in feature_names]]
    baseline = float(model.predict(baseline_row)[0])
    variants = []
    for name, delta in (("mastery_score", 0.05), ("activity_rate", 0.05), ("exercise_difficulty", 1)):
        if name not in row:
            continue
        changed = deepcopy(row)
        changed[name] = min(1.0, row[name] + delta) if name in {"mastery_score", "activity_rate"} else min(5, row[name] + delta)
        variant_score = float(model.predict([[changed[item] for item in feature_names]])[0])
        variants.append({"changed_feature": name, "baseline": baseline, "variant_prediction": variant_score, "delta": variant_score - baseline})
    return {"checked_variants": len(variants), "results": variants, "status": "controlled predictions evaluated"}
