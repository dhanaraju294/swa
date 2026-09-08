from fastapi import FastAPI

from swa_ml.monitoring.health import model_status
from swa_ml.monitoring.metrics import MetricsService
from swa_ml.monitoring.report import monitoring_report


def add_phase15_routes(app: FastAPI, interaction_repository=None, artifact_path="artifacts/ml_baseline/swa_ml_baseline_v1.joblib", metadata_path="artifacts/ml_baseline/model_metadata.json") -> FastAPI:
    metrics = MetricsService(interaction_repository)

    @app.get("/ml/health")
    def health():
        status = model_status(artifact_path, metadata_path)
        return {"api_status": "ok", "model_loaded": status["artifact_integrity"], "model_version": status["active_model_version"], "model_readiness": status["model_readiness"], "model_data_source": status["training_data_source"], "dataset_version": status["training_dataset_version"], "feature_schema_version": "synthetic_features_v1", "recommendation_engine": "available", "database": "available" if interaction_repository else "not_configured"}

    @app.get("/ml/model/status")
    def model_status_route():
        return model_status(artifact_path, metadata_path)

    @app.get("/ml/metrics")
    def metrics_route():
        return metrics.summary()

    @app.get("/ml/monitoring/report")
    def report_route():
        return monitoring_report(metrics, artifact_path, metadata_path)

    return app