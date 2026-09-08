from dataclasses import dataclass

from .models import Exercise
from .user_models import UserGoal, UserProfile, UserSkillState


@dataclass(frozen=True)
class RecommendationContext:
    profile: UserProfile
    goals: list[UserGoal]
    skill_states: list[UserSkillState]
    target_areas: set[str]
    target_skills: set[str]
    current_context: dict | None = None


class CandidateGenerator:
    def generate(self, exercises: list[Exercise], context: RecommendationContext) -> list[Exercise]:
        return [exercise for exercise in exercises if exercise.status == "active" and self._matches_target(exercise, context)]

    def _matches_target(self, exercise: Exercise, context: RecommendationContext) -> bool:
        if not context.target_areas and not context.target_skills:
            return True
        return exercise.area in context.target_areas or exercise.skill in context.target_skills
