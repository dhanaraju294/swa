import json
from pathlib import Path


def compare_models(current_metrics: dict | None, candidate_metrics: dict) -> dict:
    current = (current_metrics or {}).get("test", current_metrics or {})
    candidate = candidate_metrics.get("test", candidate_metrics)
    return {metric: {"current": current.get(metric), "candidate": candidate.get(metric), "difference": round(candidate[metric] - current[metric], 10) if metric in current and metric in candidate else None} for metric in {"mae", "mse", "rmse", "r2"}}


def model_card(metadata: dict) -> str:
    source = "Trained on SWA interaction data." if metadata.get("data_source") == "real" else "Trained on synthetic development data."
    return "\n".join(["# SWA Candidate Model Card", "", "Purpose: predict explicitly configured recommendation outcomes.", source, f"Dataset: {metadata.get('dataset_version')}", f"Target: {metadata.get('target')}", f"Features: {', '.join(metadata.get('feature_schema', []))}", f"Model version: {metadata.get('model_version')}", f"Parent model: {metadata.get('parent_model_version')}", "Evaluation: time-aware train/validation/test split.", "Limitations: this is not evidence of psychological validity or production safety.", "Known risks: distribution shift, sparse outcomes, and subgroup under-representation."])


def write_report(result: dict, path: str | Path) -> Path:
    output = Path(path)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")
    return output