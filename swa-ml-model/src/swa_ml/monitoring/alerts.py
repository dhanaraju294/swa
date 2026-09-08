from .config import MonitoringConfig
from .models import MonitoringAlert


def generate_alerts(metrics: dict, config: MonitoringConfig | None = None, model_version=None):
    config = config or MonitoringConfig()
    alerts = []
    checks = (("HIGH_ERROR_RATE", "error_rate", config.max_error_rate), ("HIGH_FALLBACK_RATE", "fallback_rate", config.max_fallback_rate), ("HIGH_LATENCY", "latency.p95", config.max_p95_latency_ms))
    for alert_type, metric, threshold in checks:
        value = metrics.get(metric) if "." not in metric else metrics.get("latency", {}).get(metric.split(".")[1])
        if value is not None and value > threshold:
            alerts.append(MonitoringAlert(alert_type=alert_type, severity="warning", metric=metric, threshold=threshold, actual_value=value, model_version=model_version, description=f"{metric} exceeded configured threshold"))
    return alerts