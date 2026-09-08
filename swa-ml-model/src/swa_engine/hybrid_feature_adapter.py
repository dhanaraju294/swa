from collections import Counter

from .activity_repository import ActivityRepository
from .mastery_engine import MasteryEngine
from .models import Exercise
from .nlp_models import NLPResult
from .recommendation_candidates import RecommendationContext
from .synthetic_features import ALLOWED_FEATURES


class HybridFeatureAdapter:
    """Builds the exact Phase 8/9 feature contract from current observable state."""

    def __init__(self, activity: ActivityRepository, mastery: MasteryEngine):
        self._activity = activity
        self._mastery = mastery

    def build(self, exercise: Exercise, context: RecommendationContext, now, nlp_result: NLPResult | None = None) -> dict:
        user_id = context.profile.user_id
        attempts = self._activity.attempts(user_id=user_id)
        completed = [attempt for attempt in attempts if attempt.status == "completed"]
        skipped = [attempt for attempt in attempts if attempt.status == "skipped"]
        abandoned = [attempt for attempt in attempts if attempt.status == "abandoned"]
        total = len(attempts)
        state = self._mastery.calculate(user_id, exercise.area, exercise.skill, now)[0]
        goal = next((goal for goal in context.goals if goal.status == "active" and goal.area == exercise.area and goal.skill == exercise.skill), None)
        skill_signal = next((signal.confidence for signal in nlp_result.detected_skills if signal.skill == exercise.skill), 0.0) if nlp_result else 0.0
        area_signal = next((signal.confidence for signal in nlp_result.detected_areas if signal.area == exercise.area), 0.0) if nlp_result else 0.0
        theme_signal = max((signal.confidence for signal in nlp_result.detected_themes), default=0.0) if nlp_result else 0.0
        emotion_signal = max((signal.confidence for signal in nlp_result.detected_emotions), default=0.0) if nlp_result else 0.0
        context_signal = 1.0 if nlp_result and set(nlp_result.detected_contexts).intersection(exercise.tags) else 0.0
        usefulness = [attempt.usefulness_rating / 5 for attempt in attempts if attempt.usefulness_rating is not None]
        difficulty_ratings = [attempt.difficulty_rating for attempt in attempts if attempt.difficulty_rating is not None]
        counts = Counter(attempt.exercise_id for attempt in completed)
        latest = max((attempt.started_at for attempt in attempts), default=None)
        return {
            "user_id": user_id, "simulation_profile": "real_user", "area": exercise.area, "skill": exercise.skill,
            "goal_priority": goal.priority if goal else 0, "mastery_score": state.mastery_score, "evidence_confidence": state.evidence_confidence,
            "activity_rate": min(1.0, total / 10), "completion_rate": len(completed) / total if total else 0.0,
            "skip_rate": len(skipped) / total if total else 0.0, "abandonment_rate": len(abandoned) / total if total else 0.0,
            "short_exercise_preference": sum(1 for attempt in completed if attempt.exercise_id in counts) / len(completed) if completed else 0.5,
            "exercise_type_preference": exercise.type, "difficulty_behavior": "observed" if difficulty_ratings else "unknown",
            "activity_consistency": min(1.0, len({attempt.started_at.date() for attempt in attempts}) / 7) if attempts else 0.0,
            "recent_activity": latest is not None and (now - latest).total_seconds() <= 30 * 86400,
            "usefulness_pattern": sum(usefulness) / len(usefulness) if usefulness else 0.5,
            "current_difficulty": int(exercise.difficulty), "recommended_difficulty": int(exercise.difficulty),
            "success_rate": len(completed) / total if total else 0.0, "average_difficulty_rating": sum(difficulty_ratings) / len(difficulty_ratings) if difficulty_ratings else 3.0,
            "consecutive_successes": 0, "consecutive_failures": 0, "nlp_area_signal": area_signal, "nlp_skill_signal": skill_signal,
            "nlp_theme_signal": theme_signal, "nlp_emotion_signal": emotion_signal, "nlp_context_signal": context_signal,
            "nlp_confidence": nlp_result.confidence if nlp_result else 0.0, "nlp_intensity": nlp_result.intensity if nlp_result else 0.0,
            "exercise_id": exercise.exercise_id, "exercise_type": exercise.type, "exercise_difficulty": int(exercise.difficulty),
            "estimated_minutes": exercise.estimated_minutes, "prerequisite_status": True, "historical_usefulness": sum(usefulness) / len(usefulness) if usefulness else 0.5,
            "requested_area": exercise.area if context.target_areas and exercise.area in context.target_areas else "",
            "requested_skill": exercise.skill if context.target_skills and exercise.skill in context.target_skills else "",
            "current_context": next(iter(nlp_result.detected_contexts), "") if nlp_result else ""
        }

    @staticmethod
    def validate(features: dict) -> None:
        missing = [name for name in ALLOWED_FEATURES if name not in features]
        if missing:
            raise ValueError(f"missing hybrid ML features: {missing}")
