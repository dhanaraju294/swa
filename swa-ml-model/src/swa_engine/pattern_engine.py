from datetime import datetime, timedelta, timezone
from statistics import mean

from .models import Exercise
from .nlp_models import NLPResult
from .pattern_config import PatternConfig
from .pattern_definitions import PATTERN_DEFINITIONS
from .pattern_features import ActivityFeatures, extract_features
from .pattern_models import BehavioralPattern, PatternStatus, PatternType
from .user_models import AttemptStatus


class PatternEngine:
    """Explainable product-interaction analytics; not diagnosis or personality inference."""

    def __init__(self, exercises: list[Exercise], config: PatternConfig | None = None) -> None:
        self._exercises = exercises
        self._config = config or PatternConfig()

    def analyze(self, user_id: str, attempts, events, now: datetime | None = None, nlp_results: list[NLPResult] | None = None) -> list[BehavioralPattern]:
        now = now or datetime.now(timezone.utc)
        features = extract_features(attempts, events, self._exercises, nlp_results)
        patterns = []
        for pattern_type in self._config.pattern_types or tuple(PATTERN_DEFINITIONS):
            pattern = self._detect(pattern_type, user_id, features, now)
            if pattern:
                patterns.append(pattern)
        return patterns

    def _detect(self, pattern_type: str, user_id: str, data: ActivityFeatures, now: datetime) -> BehavioralPattern | None:
        if pattern_type not in PATTERN_DEFINITIONS:
            return None
        if pattern_type in {"high_completion", "low_completion", "high_skip_rate", "high_abandonment_rate"}:
            return self._rate_pattern(pattern_type, user_id, data, now)
        if pattern_type in {"consistent_activity", "inconsistent_activity", "declining_activity", "increasing_activity"}:
            return self._activity_pattern(pattern_type, user_id, data, now)
        if pattern_type.startswith("prefers_"):
            return self._preference_pattern(pattern_type, user_id, data, now)
        if pattern_type in {"frequently_completes_easy_exercises", "frequently_struggles_with_difficult_exercises", "frequently_abandons_difficult_exercises", "handles_increasing_difficulty", "difficulty_mismatch"}:
            return self._difficulty_pattern(pattern_type, user_id, data, now)
        if pattern_type in {"repeated_focus_area", "repeated_focus_skill", "low_activity_area", "high_activity_area"}:
            return self._area_pattern(pattern_type, user_id, data, now)
        if pattern_type in {"consistently_high_usefulness", "consistently_low_usefulness"}:
            return self._usefulness_pattern(pattern_type, user_id, data, now)
        if pattern_type in {"preferred_time_period", "irregular_activity_time"}:
            return self._time_pattern(pattern_type, user_id, data, now)
        if pattern_type == "repeated_context":
            return self._context_pattern(user_id, data, now)
        return None

    def _pattern(self, pattern_type, user_id, data, now, evidence, count, active, last=None, description=None):
        confidence = self._confidence(count, active, last or data.last_activity, now)
        observed_at = last or data.last_activity
        stale = observed_at is not None and (now - observed_at).total_seconds() > self._config.inactive_days * 86400
        status = PatternStatus.inactive if active and stale else PatternStatus.active if active and confidence >= self._config.minimum_confidence else PatternStatus.insufficient_evidence
        return BehavioralPattern(pattern_id=f"{user_id}_{pattern_type}", user_id=user_id, pattern_type=pattern_type, description=description or PATTERN_DEFINITIONS[pattern_type].description, confidence=confidence, evidence_count=count, first_detected_at=min(data.all_timestamps) if data.all_timestamps else None, last_observed_at=last or data.last_activity, status=status, evidence=evidence, metadata={"category": PATTERN_DEFINITIONS[pattern_type].category, "observation": "product interaction pattern"})

    def _insufficient(self, pattern_type, user_id, data, now):
        return self._pattern(pattern_type, user_id, data, now, {"required_attempts": self._config.minimum_attempts, "observed_attempts": data.total_attempts}, 0, False)

    def _rate_pattern(self, kind, user_id, data, now):
        if data.total_attempts < self._config.minimum_attempts:
            return self._insufficient(kind, user_id, data, now)
        total = data.total_attempts
        rates = {"high_completion": len(data.completed) / total, "low_completion": len(data.completed) / total, "high_skip_rate": len(data.skipped) / total, "high_abandonment_rate": len(data.abandoned) / total}
        thresholds = {"high_completion": rates["high_completion"] >= self._config.high_completion_rate, "low_completion": rates["low_completion"] <= self._config.low_completion_rate, "high_skip_rate": rates["high_skip_rate"] >= self._config.high_skip_rate, "high_abandonment_rate": rates["high_abandonment_rate"] >= self._config.high_abandonment_rate}
        threshold_names = {"high_completion": "high_completion_rate", "low_completion": "low_completion_rate", "high_skip_rate": "high_skip_rate", "high_abandonment_rate": "high_abandonment_rate"}
        threshold = getattr(self._config, threshold_names[kind])
        return self._pattern(kind, user_id, data, now, {"completed": len(data.completed), "skipped": len(data.skipped), "abandoned": len(data.abandoned), "total_attempts": total, "rate": round(rates[kind], 4), "threshold": threshold}, total, thresholds[kind])

    def _activity_pattern(self, kind, user_id, data, now):
        days = {timestamp.date() for timestamp in data.all_timestamps}
        if len(days) < self._config.minimum_events:
            return self._insufficient(kind, user_id, data, now)
        recent_start = now - timedelta(days=self._config.trend_window_days)
        earlier_start = now - timedelta(days=self._config.trend_window_days * 2)
        recent = sum(timestamp >= recent_start for timestamp in data.all_timestamps)
        earlier = sum(earlier_start <= timestamp < recent_start for timestamp in data.all_timestamps)
        active_days = len(days)
        if kind == "consistent_activity":
            active = active_days >= self._config.minimum_events and active_days / max(1, self._config.recent_days) >= 0.2
        elif kind == "inconsistent_activity":
            active = active_days >= self._config.minimum_events and active_days / max(1, self._config.recent_days) < 0.2
        elif kind == "increasing_activity":
            active = earlier > 0 and recent >= earlier * 1.5
        else:
            active = earlier > 0 and recent * 1.5 <= earlier
        return self._pattern(kind, user_id, data, now, {"active_days": active_days, "recent_events": recent, "earlier_events": earlier, "window_days": self._config.trend_window_days}, len(data.all_timestamps), active)

    def _preference_pattern(self, kind, user_id, data, now):
        if len(data.completed) < self._config.minimum_attempts:
            return self._insufficient(kind, user_id, data, now)
        if kind in {"prefers_short_exercises", "prefers_long_exercises"}:
            counts = {"short": 0, "medium": 0, "long": 0}
            for attempt in data.completed:
                minutes = data.exercises.get(attempt.exercise_id).estimated_minutes if attempt.exercise_id in data.exercises else 0
                counts["short" if minutes <= self._config.short_minutes else "long" if minutes >= self._config.long_minutes else "medium"] += 1
            selected = "short" if kind.endswith("short_exercises") else "long"
            share = counts[selected] / len(data.completed)
            return self._pattern(kind, user_id, data, now, {**counts, "total_completed": len(data.completed), "share": round(share, 4)}, len(data.completed), share >= self._config.preference_share)
        exercise_type = kind.removeprefix("prefers_")
        count = data.type_counts.get(exercise_type, 0)
        share = count / len(data.completed)
        return self._pattern(kind, user_id, data, now, {"type": exercise_type, "completed_count": count, "total_completed": len(data.completed), "share": round(share, 4)}, len(data.completed), share >= self._config.preference_share)

    def _difficulty_pattern(self, kind, user_id, data, now):
        if kind == "frequently_completes_easy_exercises":
            relevant = [attempt for attempt in data.attempts if attempt.exercise_id in data.exercises and int(data.exercises[attempt.exercise_id].difficulty) <= 2]
        else:
            relevant = [attempt for attempt in data.attempts if attempt.exercise_id in data.exercises and int(data.exercises[attempt.exercise_id].difficulty) >= self._config.difficult_level]
        if len(relevant) < self._config.minimum_attempts:
            return self._insufficient(kind, user_id, data, now)
        completed = sum(attempt.status == AttemptStatus.completed.value for attempt in relevant)
        abandoned = sum(attempt.status == AttemptStatus.abandoned.value for attempt in relevant)
        completion_rate = completed / len(relevant)
        abandonment_rate = abandoned / len(relevant)
        active = {"frequently_completes_easy_exercises": completion_rate >= self._config.high_completion_rate, "frequently_struggles_with_difficult_exercises": completion_rate <= self._config.low_completion_rate, "frequently_abandons_difficult_exercises": abandonment_rate >= self._config.difficulty_abandonment_rate, "handles_increasing_difficulty": completion_rate >= self._config.high_completion_rate}.get(kind, False)
        evidence_key = "easy_attempts" if kind == "frequently_completes_easy_exercises" else "difficult_attempts"
        return self._pattern(kind, user_id, data, now, {evidence_key: len(relevant), "completed": completed, "abandoned": abandoned, "completion_rate": round(completion_rate, 4), "abandonment_rate": round(abandonment_rate, 4)}, len(relevant), active)

    def _area_pattern(self, kind, user_id, data, now):
        if len(data.completed) < self._config.minimum_attempts or not data.area_counts:
            return self._insufficient(kind, user_id, data, now)
        area, count = data.area_counts.most_common(1)[0]
        share = count / len(data.completed)
        if kind in {"repeated_focus_area", "high_activity_area"}:
            active = share >= self._config.area_focus_share
        else:
            active = len(data.area_counts) > 1 and share <= 1 / len(data.area_counts)
        return self._pattern(kind, user_id, data, now, {"area": area, "area_completed": count, "total_completed": len(data.completed), "share": round(share, 4), "all_area_counts": dict(data.area_counts)}, len(data.completed), active)

    def _usefulness_pattern(self, kind, user_id, data, now):
        if len(data.usefulness) < self._config.minimum_attempts:
            return self._insufficient(kind, user_id, data, now)
        average = mean(data.usefulness)
        active = average >= self._config.usefulness_high if kind == "consistently_high_usefulness" else average <= self._config.usefulness_low
        return self._pattern(kind, user_id, data, now, {"ratings_count": len(data.usefulness), "average_usefulness": round(average, 4), "ratings": data.usefulness}, len(data.usefulness), active)

    def _time_pattern(self, kind, user_id, data, now):
        if len(data.all_timestamps) < self._config.minimum_events:
            return self._insufficient(kind, user_id, data, now)
        buckets = {"morning": 0, "afternoon": 0, "evening": 0, "night": 0}
        for timestamp in data.all_timestamps:
            hour = timestamp.hour
            bucket = "morning" if 5 <= hour < 12 else "afternoon" if 12 <= hour < 17 else "evening" if 17 <= hour < 22 else "night"
            buckets[bucket] += 1
        period, count = max(buckets.items(), key=lambda pair: pair[1])
        share = count / len(data.all_timestamps)
        active = share >= self._config.time_preference_share if kind == "preferred_time_period" else share < self._config.time_preference_share
        return self._pattern(kind, user_id, data, now, {"period_counts": buckets, "period": period, "share": round(share, 4)}, len(data.all_timestamps), active)

    def _context_pattern(self, user_id, data, now):
        contexts = {}
        for result in data.nlp_results:
            for context in result.detected_contexts:
                contexts[context] = contexts.get(context, 0) + 1
            for theme in result.detected_themes:
                contexts[theme.name] = contexts.get(theme.name, 0) + 1
        if not contexts:
            return self._insufficient("repeated_context", user_id, data, now)
        context, count = max(contexts.items(), key=lambda pair: pair[1])
        active = count >= self._config.minimum_events
        return self._pattern("repeated_context", user_id, data, now, {"context": context, "occurrences": count, "all_context_counts": contexts}, count, active)

    def _confidence(self, count, active, last, now):
        if count <= 0:
            return 0.0
        evidence_strength = min(1.0, count / max(1, self._config.minimum_attempts))
        recency = 1.0 if last is None else max(0.0, 1.0 - (now - last).total_seconds() / (self._config.inactive_days * 86400))
        return round(min(1.0, 0.2 + 0.5 * evidence_strength + 0.3 * recency) if active else 0.2 * evidence_strength, 4)
