from datetime import datetime
from math import exp, log


def recency_weight(timestamp: datetime, reference: datetime, half_life_days: float) -> float:
    """Return exponential evidence decay; half_life_days is explicit configuration."""
    if timestamp.tzinfo is None and reference.tzinfo is not None:
        timestamp = timestamp.replace(tzinfo=reference.tzinfo)
    age_days = max(0.0, (reference - timestamp).total_seconds() / 86400)
    return exp(-log(2) * age_days / half_life_days)
