from .user_models import Trend


def calculate_trend(recent_scores: list[float], previous_scores: list[float], threshold: float, minimum_observations: int) -> tuple[Trend, float | None, float | None]:
    if len(recent_scores) < minimum_observations or len(previous_scores) < minimum_observations:
        return Trend.insufficient_data, average(recent_scores), average(previous_scores)
    recent = average(recent_scores)
    previous = average(previous_scores)
    if recent is None or previous is None:
        return Trend.insufficient_data, recent, previous
    difference = recent - previous
    if difference >= threshold:
        return Trend.improving, recent, previous
    if difference <= -threshold:
        return Trend.declining, recent, previous
    return Trend.stable, recent, previous


def average(values: list[float]) -> float | None:
    return sum(values) / len(values) if values else None
