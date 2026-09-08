from datetime import datetime
from pathlib import Path
import json

from swa_engine.learning_dataset import LearningDatasetConfig, build_training_rows
from swa_engine.synthetic_features import ALLOWED_FEATURES


def build_real_dataset(events, config: LearningDatasetConfig | None = None, dataset_version: str = "swa_real_dataset_v1") -> dict:
    config = config or LearningDatasetConfig()
    rows = build_training_rows(events, config)
    if not rows:
        return {"rows": [], "metadata": _metadata(dataset_version, rows, config)}
    timestamps = [datetime.fromisoformat(row["event_timestamp"]) for row in rows]
    users = {row.get("user_id") for row in rows if row.get("user_id")}
    return {"rows": rows, "metadata": _metadata(dataset_version, rows, config, timestamps, users)}


def validate_training_rows(rows: list[dict]) -> dict:
    missing = sum(any(name not in row for name in ALLOWED_FEATURES) for row in rows)
    leakage = sum(any(name in row for name in {"outcome", "feedback", "target"}) for row in rows)
    return {"row_count": len(rows), "missing_rows": missing, "missing_rate": missing / len(rows) if rows else 1.0, "leakage_rows": leakage, "schema_valid": bool(rows) and missing == 0 and leakage == 0}


def temporal_split(rows: list[dict], train_fraction: float = 0.70, validation_fraction: float = 0.15) -> dict[str, list[dict]]:
    ordered = sorted(rows, key=lambda row: (row["event_timestamp"], row.get("recommendation_id", "")))
    first = int(len(ordered) * train_fraction)
    second = first + int(len(ordered) * validation_fraction)
    return {"train": ordered[:first], "validation": ordered[first:second], "test": ordered[second:]}


def save_dataset(dataset: dict, path: str | Path) -> Path:
    output = Path(path)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(dataset, indent=2, default=str), encoding="utf-8")
    return output


def _metadata(version, rows, config, timestamps=None, users=None):
    timestamps = timestamps or []
    return {"dataset_version": version, "generated_at": datetime.now().astimezone().isoformat(), "data_source": "real", "row_count": len(rows), "unique_users": len(users or set()), "feature_count": len(ALLOWED_FEATURES), "target_definition": config.target.value, "date_range": {"start": min(timestamps).isoformat() if timestamps else None, "end": max(timestamps).isoformat() if timestamps else None}, "quality_status": "pending"}