import json
from pathlib import Path

from .nlp_models import NLPInput


def evaluate_area_detection(engine, dataset_path: str | Path) -> dict[str, float | int]:
    examples = json.loads(Path(dataset_path).read_text(encoding="utf-8"))
    true_positive = false_positive = false_negative = 0
    for index, example in enumerate(examples):
        result = engine.analyze(NLPInput(user_id=f"eval_{index}", text=example["text"], timestamp="2026-08-21T00:00:00Z", source="free_text"))
        predicted = {signal.area for signal in result.detected_areas}
        expected = set(example.get("areas", []))
        true_positive += len(predicted & expected)
        false_positive += len(predicted - expected)
        false_negative += len(expected - predicted)
    precision = true_positive / (true_positive + false_positive) if true_positive + false_positive else 0.0
    recall = true_positive / (true_positive + false_negative) if true_positive + false_negative else 0.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    return {"examples": len(examples), "true_positive": true_positive, "false_positive": false_positive, "false_negative": false_negative, "precision": round(precision, 4), "recall": round(recall, 4), "f1": round(f1, 4), "note": "Development-set baseline metrics; not representative of real SWA users."}
