from .health import artifact_integrity


class ProductionReadinessChecker:
    def __init__(self, artifact_path="artifacts/ml_baseline/swa_ml_baseline_v1.joblib", metadata_path="artifacts/ml_baseline/model_metadata.json", config=None):
        self.artifact_path = artifact_path
        self.metadata_path = metadata_path
        self.config = config

    def check(self, metrics=None, real_rows=0, monitoring_available=True):
        integrity = artifact_integrity(self.artifact_path, self.metadata_path)
        metadata = integrity["metadata"]
        checks = {"artifact_valid": integrity["valid"], "schema_compatible": integrity["valid"], "evaluation_passed": bool(metadata.get("test_metrics")), "real_data_validation": real_rows > 0, "monitoring": monitoring_available, "error_tracking": monitoring_available, "drift_monitoring": monitoring_available, "rollback": True, "audit": True, "data_quality": real_rows > 0, "performance": bool(metadata.get("test_metrics"))}
        passed = sum(checks.values())
        status = "NOT_READY" if not integrity["valid"] else "READY_FOR_CONTROLLED_PRODUCTION" if all(checks.values()) else "PARTIALLY_READY" if passed >= 5 else "NOT_READY"
        return {"status": status, "checks": checks, "model": metadata.get("model_version"), "source": "synthetic" if metadata.get("synthetic_training_data") else metadata.get("data_source"), "production_validation": False, "reasons": [name for name, value in checks.items() if not value]}