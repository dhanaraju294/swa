import random
from typing import Any

from .synthetic_models import SyntheticConfig, SyntheticUser


PROFILE_SETTINGS = {
    "high_engagement": {"engagement": 0.9, "preference": "mixed", "difficulty_bias": 0},
    "low_engagement": {"engagement": 0.25, "preference": "mixed", "difficulty_bias": -1},
    "short_preference": {"engagement": 0.75, "preference": "short", "difficulty_bias": 0},
    "reflection_preference": {"engagement": 0.75, "preference": "reflection", "difficulty_bias": 0},
    "difficulty_sensitive": {"engagement": 0.65, "preference": "mixed", "difficulty_bias": -1},
    "rapid_improvement": {"engagement": 0.85, "preference": "mixed", "difficulty_bias": 1},
    "slow_improvement": {"engagement": 0.65, "preference": "mixed", "difficulty_bias": 0},
    "inconsistent_activity": {"engagement": 0.55, "preference": "mixed", "difficulty_bias": 0},
    "cold_start": {"engagement": 0.5, "preference": "mixed", "difficulty_bias": 0},
    "multi_goal": {"engagement": 0.8, "preference": "mixed", "difficulty_bias": 0}
}


def generate_users(count: int, config: SyntheticConfig, areas: list[dict[str, Any]], rng: random.Random) -> list[SyntheticUser]:
    users = []
    for index in range(1, count + 1):
        profile = config.profiles[(index - 1) % len(config.profiles)]
        area = areas[(index - 1) % len(areas)]
        skill = area["skills"][0]
        second = areas[(index) % len(areas)] if profile == "multi_goal" else None
        selected_areas = tuple(item for item in (area["name"], second["name"] if second else None) if item)
        selected_skills = tuple(item for item in (skill["name"], second["skills"][0] if second else None) if item)
        states = tuple({"area": selected_areas[pos], "skill": selected_skills[pos], "mastery_score": round(rng.uniform(0.15, 0.85), 4), "evidence_confidence": round(rng.uniform(0.1, 0.9), 4), "trend": rng.choice(["improving", "stable", "declining", "insufficient_data"]), "evidence_count": rng.randint(0, 12), "recent_score": round(rng.uniform(0.1, 0.9), 4), "previous_score": round(rng.uniform(0.1, 0.9), 4)} for pos in range(len(selected_skills)))
        goals = tuple({"area": selected_areas[pos], "skill": selected_skills[pos], "priority": 3 if pos == 0 else 2, "status": "active"} for pos in range(len(selected_skills)))
        settings = PROFILE_SETTINGS[profile]
        users.append(SyntheticUser(f"synthetic_user_{index:06d}", profile, goals, selected_areas, selected_skills, {f"{a}/{s}": round(rng.uniform(20, 80), 2) for a, s in zip(selected_areas, selected_skills)}, states, {"preferred_minutes": rng.choice([10, 15, 20, 30])}, {"engagement": settings["engagement"], "preference": settings["preference"], "difficulty_bias": settings["difficulty_bias"]}))
    return users
