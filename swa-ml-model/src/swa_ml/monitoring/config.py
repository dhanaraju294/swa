from dataclasses import dataclass


@dataclass(frozen=True)
class MonitoringConfig:
    max_p95_latency_ms: float = 1000.0
    max_error_rate: float = 0.05
    max_fallback_rate: float = 0.25
    max_data_quality_error_rate: float = 0.05
    drift_threshold: float = 0.1
    min_monitoring_sample_size: int = 30
