import json
from pathlib import Path

from swa_engine.synthetic_features import ALLOWED_FEATURES


def artifact_integrity(artifact_path, metadata_path):
    try:
        import joblib
        artifact = Path(artifact_path)
        metadata = json.loads(Path(metadata_path).read_text(encoding="utf-8"))
        model = joblib.load(artifact)
        valid = bool(metadata.get("model_version") and metadata.get("feature_count") == len(ALLOWED_FEATURES) and metadata.get("feature_schema", list(ALLOWED_FEATURES)) == list(ALLOWED_FEATURES) and hasattr(model, "predict"))
        return {"valid": valid, "model_version": metadata.get("model_version"), "metadata": metadata, "reason": None if valid else "artifact metadata or feature schema is incompatible"}
    except (OSError, ValueError, KeyError, ImportError, EOFError) as error:
        return {"valid": False, "model_version": None, "metadata": {}, "reason": str(error)}


def model_status(artifact_path="artifacts/ml_baseline/swa_ml_baseline_v1.joblib", metadata_path="artifacts/ml_baseline/model_metadata.json"):
    result = artifact_integrity(artifact_path, metadata_path)
    metadata = result["metadata"]
    return {"active_model_version": metadata.get("model_version"), "model_status": "ACTIVE" if result["valid"] else "UNAVAILABLE", "training_dataset_version": metadata.get("dataset_version"), "training_data_source": "synthetic" if metadata.get("synthetic_training_data") else metadata.get("data_source"), "target": metadata.get("target_column", metadata.get("target")), "model_readiness": "BASELINE_READY" if result["valid"] else "NOT_READY", "activation_timestamp": metadata.get("training_timestamp"), "parent_model_version": metadata.get("parent_model_version"), "artifact_integrity": result["valid"]}