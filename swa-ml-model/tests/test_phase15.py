from swa_engine.monitoring_models import MonitoringAlert
from swa_ml.monitoring.alerts import generate_alerts
from swa_ml.monitoring.config import MonitoringConfig
from swa_ml.monitoring.health import artifact_integrity, model_status
from swa_ml.monitoring.metrics import MetricsService
from swa_ml.monitoring.readiness import ProductionReadinessChecker
from swa_ml.monitoring.trackers import LatencyTracker, RequestTracker


def test_latency_and_request_metrics():
    latency = LatencyTracker()
    assert latency.summary()["status"] == "INSUFFICIENT_DATA"
    latency.record(10)
    latency.record(20)
    assert latency.summary()["p95"] == 20
    requests = RequestTracker()
    requests.record(success=True, ml_enabled=True, latency_ms=10)
    requests.record(success=False, fallback=True, latency_ms=20)
    assert requests.summary()["requests"] == 2
    assert requests.summary()["error_rate"] == 0.5


def test_alerts_are_threshold_driven():
    alerts = generate_alerts({"error_rate": 0.2, "fallback_rate": 0.3, "latency": {"p95": 1200}}, MonitoringConfig())
    assert {alert.alert_type for alert in alerts} == {"HIGH_ERROR_RATE", "HIGH_FALLBACK_RATE", "HIGH_LATENCY"}
    assert all(isinstance(alert, MonitoringAlert) for alert in alerts)


def test_active_model_status_is_transparent():
    status = model_status()
    assert status["training_data_source"] == "synthetic"
    assert status["artifact_integrity"] is True
    assert status["model_status"] == "ACTIVE"


def test_invalid_artifact_is_unavailable(tmp_path):
    result = artifact_integrity(tmp_path / "missing.joblib", tmp_path / "missing.json")
    assert result["valid"] is False
    readiness = ProductionReadinessChecker(tmp_path / "missing.joblib", tmp_path / "missing.json").check()
    assert readiness["status"] == "NOT_READY"


def test_metrics_service_without_events_is_honest():
    result = MetricsService().summary()
    assert result["recommendations"]["status"] == "INSUFFICIENT_DATA"