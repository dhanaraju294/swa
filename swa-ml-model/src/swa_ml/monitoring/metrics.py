from collections import Counter

from .trackers import ErrorTracker, RequestTracker


class MetricsService:
    def __init__(self, interaction_repository=None):
        self.requests = RequestTracker()
        self.errors = ErrorTracker()
        self.interactions = interaction_repository

    def record_request(self, **kwargs):
        self.requests.record(**kwargs)

    def record_error(self, error_type):
        self.errors.record(error_type)

    def outcome_metrics(self):
        if not self.interactions:
            return {"status": "INSUFFICIENT_DATA"}
        events = self.interactions.all_events()
        counts = Counter(event.event_type for event in events)
        shown = counts.get("RECOMMENDATION_SHOWN", 0)
        return {"status": "OK" if shown else "INSUFFICIENT_DATA", "shown": shown, "started": counts.get("EXERCISE_STARTED", 0), "completed": counts.get("EXERCISE_COMPLETED", 0), "skipped": counts.get("EXERCISE_SKIPPED", 0), "abandoned": counts.get("EXERCISE_ABANDONED", 0), "completion_rate": counts.get("EXERCISE_COMPLETED", 0) / shown if shown else None, "skip_rate": counts.get("EXERCISE_SKIPPED", 0) / shown if shown else None, "abandonment_rate": counts.get("EXERCISE_ABANDONED", 0) / shown if shown else None}

    def summary(self):
        return {"system": self.requests.summary(), "errors": self.errors.summary(), "recommendations": self.outcome_metrics()}