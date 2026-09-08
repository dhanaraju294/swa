import json
from pathlib import Path

from .health import model_status
from .metrics import MetricsService
from .readiness import ProductionReadinessChecker


def monitoring_report(metrics=None, artifact_path="artifacts/ml_baseline/swa_ml_baseline_v1.joblib", metadata_path="artifacts/ml_baseline/model_metadata.json"):
    summary = metrics.summary() if metrics else MetricsService().summary()
    status = model_status(artifact_path, metadata_path)
    return {"system_health": {"api": "ok", "model_loaded": status["artifact_integrity"], "database": "not_configured"}, "model_status": status, "metrics": summary, "drift": {"feature_drift": {"status": "INSUFFICIENT_DATA"}, "target_drift": {"status": "INSUFFICIENT_DATA", "message": "Insufficient data for target drift analysis."}, "model_drift": {"status": "INSUFFICIENT_DATA"}}, "data_quality": {"status": "INSUFFICIENT_DATA"}, "alerts": [], "readiness": ProductionReadinessChecker(artifact_path, metadata_path).check()}


def write_report(report, json_path="artifacts/monitoring/monitoring_report.json", text_path="artifacts/monitoring/monitoring_report.txt"):
    Path(json_path).parent.mkdir(parents=True, exist_ok=True)
    Path(json_path).write_text(json.dumps(report, indent=2, default=str), encoding="utf-8")
    Path(text_path).write_text("SWA ML MONITORING REPORT\n\n" + json.dumps(report, indent=2, default=str), encoding="utf-8")
    return {"json": str(json_path), "text": str(text_path)}