import random
from datetime import datetime, timedelta, timezone
from typing import Any

from .loader import load_repository
from .taxonomy import load_taxonomy
from .synthetic_features import ALLOWED_FEATURES, FEATURE_SCHEMA
from .synthetic_models import SyntheticConfig, SyntheticDataset
from .synthetic_users import generate_users


class SyntheticDatasetGenerator:
    def __init__(self, config: SyntheticConfig | None = None) -> None:
        self.config = config or SyntheticConfig()
        self.rng = random.Random(self.config.seed)
        self.exercises = load_repository().all()
        self.taxonomy = load_taxonomy("data/taxonomy.json")

    def generate(self) -> SyntheticDataset:
        area_payload = [{"name": area.name, "skills": [{"name": skill.name} for skill in area.skills]} for area in self.taxonomy.areas]
        user_count = max(1, min(self.config.rows // 5, 2000))
        users = generate_users(user_count, self.config, area_payload, self.rng)
        repeated_users = (user for user in users for _ in range(max(1, self.config.rows // len(users))))
        rows = [self._row(index, user) for index, user in enumerate(repeated_users, 1)]
        rows = rows[: self.config.rows]
        metadata = {"dataset_version": self.config.dataset_version, "generated_at": datetime.now(timezone.utc).isoformat(), "row_count": len(rows), "feature_count": len(ALLOWED_FEATURES), "random_seed": self.config.seed, "generator_version": self.config.generator_version, "synthetic_data": True, "target_definition": self.config.target_definition, "allowed_features": list(ALLOWED_FEATURES), "target_only_fields": ["recommendation_quality"]}
        return SyntheticDataset(rows, metadata, FEATURE_SCHEMA)

    def _row(self, index: int, user) -> dict[str, Any]:
        exercise = self.rng.choice(self.exercises)
        settings = user.activity_profile
        difficulty = int(exercise.difficulty)
        mismatch = max(0, difficulty - (2 + settings["difficulty_bias"]))
        completion = max(0.05, min(0.98, settings["engagement"] - mismatch * 0.12 + self.rng.uniform(-0.08, 0.08)))
        skip = max(0.01, min(0.8, (1 - settings["engagement"]) * 0.5 + self.rng.uniform(0, 0.08)))
        abandon = max(0.01, min(0.8, mismatch * 0.12 + (1 - settings["engagement"]) * 0.15 + self.rng.uniform(0, 0.06)))
        mastery = next((state["mastery_score"] for state in user.skill_states if state["skill"] == exercise.skill), 0.35)
        evidence = next((state["evidence_confidence"] for state in user.skill_states if state["skill"] == exercise.skill), 0.15)
        usefulness = max(0, min(1, 0.45 + completion * 0.35 - mismatch * 0.08 + self.rng.uniform(-0.08, 0.08)))
        type_preference = settings["preference"] if settings["preference"] != "mixed" else exercise.type
        preference_signal = 0.9 if settings["preference"] == "short" and exercise.estimated_minutes <= 15 else 0.9 if settings["preference"] == "reflection" and exercise.type == "reflection" else 0.5
        goal_match = 1.0 if exercise.area in user.selected_areas and exercise.skill in user.selected_skills else 0.25
        context_signal = self.rng.random()
        novelty = self.rng.uniform(0.3, 1.0)
        suitability = max(0, min(1, 1 - abs(difficulty - (2 + settings["difficulty_bias"])) / 4))
        quality = max(0, min(1, 0.25 * goal_match + 0.2 * suitability + 0.15 * novelty + 0.15 * usefulness + 0.15 * mastery + 0.1 * context_signal + self.rng.uniform(-0.05, 0.05)))
        return {"user_id": user.user_id, "simulation_profile": user.profile, "area": exercise.area, "skill": exercise.skill, "goal_priority": max(goal["priority"] for goal in user.goals if goal["area"] == exercise.area) if any(goal["area"] == exercise.area for goal in user.goals) else 0, "mastery_score": mastery, "evidence_confidence": evidence, "activity_rate": settings["engagement"], "completion_rate": completion, "skip_rate": skip, "abandonment_rate": abandon, "short_exercise_preference": 1.0 if settings["preference"] == "short" else 0.5, "exercise_type_preference": type_preference, "difficulty_behavior": "sensitive" if settings["difficulty_bias"] < 0 else "adaptive", "activity_consistency": 0.8 if settings["engagement"] > 0.7 else 0.35, "recent_activity": settings["engagement"] > 0.35, "usefulness_pattern": usefulness, "current_difficulty": 2 + settings["difficulty_bias"], "recommended_difficulty": max(1, min(5, 2 + settings["difficulty_bias"])), "success_rate": completion, "average_difficulty_rating": max(1, min(5, 3 + mismatch)), "consecutive_successes": int(completion * 5), "consecutive_failures": int(abandon * 3), "nlp_area_signal": goal_match, "nlp_skill_signal": goal_match, "nlp_theme_signal": context_signal, "nlp_emotion_signal": self.rng.random(), "nlp_context_signal": context_signal, "nlp_confidence": evidence, "nlp_intensity": self.rng.random(), "exercise_id": exercise.exercise_id, "exercise_type": exercise.type, "exercise_difficulty": difficulty, "estimated_minutes": exercise.estimated_minutes, "prerequisite_status": True, "historical_usefulness": usefulness, "requested_area": exercise.area if goal_match else "", "requested_skill": exercise.skill if goal_match else "", "current_context": self.rng.choice(exercise.tags), "recommendation_quality": round(quality, 6), "interaction_id": f"synthetic_interaction_{index:08d}"}
