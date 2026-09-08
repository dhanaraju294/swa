FEATURE_SCHEMA = {
    "user_id": "categorical", "simulation_profile": "categorical", "area": "categorical", "skill": "categorical", "goal_priority": "numeric", "mastery_score": "numeric", "evidence_confidence": "numeric", "activity_rate": "numeric", "completion_rate": "numeric", "skip_rate": "numeric", "abandonment_rate": "numeric", "short_exercise_preference": "numeric", "exercise_type_preference": "categorical", "difficulty_behavior": "categorical", "activity_consistency": "numeric", "recent_activity": "boolean", "usefulness_pattern": "numeric", "current_difficulty": "numeric", "recommended_difficulty": "numeric", "success_rate": "numeric", "average_difficulty_rating": "numeric", "consecutive_successes": "numeric", "consecutive_failures": "numeric", "nlp_area_signal": "numeric", "nlp_skill_signal": "numeric", "nlp_theme_signal": "numeric", "nlp_emotion_signal": "numeric", "nlp_context_signal": "numeric", "nlp_confidence": "numeric", "nlp_intensity": "numeric", "exercise_id": "categorical", "exercise_type": "categorical", "exercise_difficulty": "numeric", "estimated_minutes": "numeric", "prerequisite_status": "boolean", "historical_usefulness": "numeric", "requested_area": "categorical", "requested_skill": "categorical", "current_context": "categorical", "recommendation_quality": "target_only_numeric"
}

ALLOWED_FEATURES = tuple(name for name, kind in FEATURE_SCHEMA.items() if kind != "target_only_numeric")
TARGET_ONLY_FIELDS = ("recommendation_quality",)


def validate_feature_row(row: dict[str, object]) -> list[str]:
    errors = []
    for name, kind in FEATURE_SCHEMA.items():
        if name not in row:
            errors.append(f"missing feature: {name}")
        elif kind == "numeric" and not isinstance(row[name], (int, float)):
            errors.append(f"non-numeric feature: {name}")
        elif kind == "boolean" and not isinstance(row[name], bool):
            errors.append(f"non-boolean feature: {name}")
    return errors
