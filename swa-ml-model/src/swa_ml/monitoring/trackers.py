from collections import Counter
from statistics import mean, median
from time import perf_counter


class LatencyTracker:
    def __init__(self):
        self.values = []

    def record(self, milliseconds):
        self.values.append(float(milliseconds))

    def summary(self):
        if not self.values:
            return {"status": "INSUFFICIENT_DATA", "count": 0, "average": None, "p50": None, "p95": None, "p99": None}
        values = sorted(self.values)
        percentile = lambda fraction: values[min(len(values) - 1, int(len(values) * fraction))]
        return {"status": "OK", "count": len(values), "average": mean(values), "p50": median(values), "p95": percentile(.95), "p99": percentile(.99)}


class RequestTracker:
    def __init__(self):
        self.total = self.success = self.errors = self.fallbacks = self.ml_enabled = self.rule_only = 0
        self.latency = LatencyTracker()

    def record(self, success=True, fallback=False, ml_enabled=False, latency_ms=None):
        self.total += 1
        self.success += bool(success)
        self.errors += not success
        self.fallbacks += bool(fallback)
        self.ml_enabled += bool(ml_enabled)
        self.rule_only += not ml_enabled
        if latency_ms is not None:
            self.latency.record(latency_ms)

    def summary(self):
        return {"requests": self.total, "successful": self.success, "errors": self.errors, "success_rate": self.success / self.total if self.total else None, "error_rate": self.errors / self.total if self.total else None, "fallback_rate": self.fallbacks / self.total if self.total else None, "fallback_requests": self.fallbacks, "ml_enabled_requests": self.ml_enabled, "rule_only_requests": self.rule_only, "latency": self.latency.summary()}


class ErrorTracker:
    def __init__(self):
        self.errors = Counter()

    def record(self, error_type):
        self.errors[str(error_type)] += 1

    def summary(self):
        return dict(self.errors)