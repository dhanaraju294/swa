import csv
import json
from dataclasses import dataclass
from pathlib import Path

from .synthetic_features import ALLOWED_FEATURES, FEATURE_SCHEMA, TARGET_ONLY_FIELDS


@dataclass(frozen=True)
class DatasetBundle:
    rows: list[dict]
    metadata: dict
    feature_names: tuple[str, ...]
    training: list[dict]
    validation: list[dict]
    test: list[dict]


def load_dataset(csv_path="artifacts/synthetic_training_data.csv", metadata_path="artifacts/synthetic_training_metadata.json", target_column="recommendation_quality") -> DatasetBundle:
    csv_file = Path(csv_path)
    metadata_file = Path(metadata_path)
    if not csv_file.exists() or not metadata_file.exists():
        raise FileNotFoundError("Phase 8 dataset artifacts are missing. Run `python -m swa_engine.demo_phase8` and export the dataset before training.")
    metadata = json.loads(metadata_file.read_text(encoding="utf-8"))
    if metadata.get("synthetic_data") is not True:
        raise ValueError("training requires metadata synthetic_data=true")
    if target_column not in TARGET_ONLY_FIELDS:
        raise ValueError(f"unsupported target column: {target_column}")
    with csv_file.open(encoding="utf-8", newline="") as stream:
        rows = list(csv.DictReader(stream))
    if not rows:
        raise ValueError("training dataset is empty")
    for row in rows:
        for name, kind in FEATURE_SCHEMA.items():
            if name == target_column:
                continue
            if name not in row:
                raise ValueError(f"dataset is missing feature: {name}")
            if kind in {"numeric", "target_only_numeric"}:
                row[name] = float(row[name])
            elif kind == "boolean":
                row[name] = row[name].lower() == "true"
        row[target_column] = float(row[target_column])
        if not 0 <= row[target_column] <= 1:
            raise ValueError(f"target outside 0-1: {row[target_column]}")
    ordered = sorted(rows, key=lambda row: row["interaction_id"])
    first = int(len(ordered) * 0.70)
    second = first + int(len(ordered) * 0.15)
    return DatasetBundle(rows, metadata, tuple(ALLOWED_FEATURES), ordered[:first], ordered[first:second], ordered[second:])


def row_values(rows: list[dict], feature_names: tuple[str, ...], target: str) -> tuple[list[list], list[float]]:
    values = []
    targets = []
    for row in rows:
        values.append([row[name] for name in feature_names])
        targets.append(row[target])
    return values, targets
