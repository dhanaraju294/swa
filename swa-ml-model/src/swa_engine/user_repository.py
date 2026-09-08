from datetime import datetime
from typing import TypeVar

from .persistence import SQLitePersistence
from .taxonomy import Taxonomy
from .user_models import UserGoal, UserProfile, UserSkillState

Model = TypeVar("Model", UserProfile, UserGoal, UserSkillState)


class UserRepository:
    def __init__(self, persistence: SQLitePersistence, taxonomy: Taxonomy | None = None) -> None:
        self._db = persistence
        self._taxonomy = taxonomy

    def save_profile(self, profile: UserProfile) -> UserProfile:
        self._db.upsert("user_profiles", "user_id", profile.user_id, profile.model_dump(mode="json"))
        return profile

    def get_profile(self, user_id: str) -> UserProfile | None:
        rows = self._db.rows("user_profiles", "user_id = ?", [user_id])
        return UserProfile.model_validate_json(rows[0]["payload"]) if rows else None

    def save_goal(self, goal: UserGoal) -> UserGoal:
        self._validate_taxonomy_reference(goal.area, goal.skill)
        self._db.upsert("user_goals", "goal_id", goal.goal_id, goal.model_dump(mode="json"), user_id=goal.user_id)
        profile = self.get_profile(goal.user_id)
        if profile and goal.goal_id not in profile.goals:
            profile.goals.append(goal.goal_id)
            profile.updated_at = max(profile.updated_at, goal.updated_at)
            self.save_profile(profile)
        return goal

    def goals(self, user_id: str) -> list[UserGoal]:
        return [UserGoal.model_validate_json(row["payload"]) for row in self._db.rows("user_goals", "user_id = ?", [user_id])]

    def save_skill_state(self, state: UserSkillState) -> UserSkillState:
        self._validate_taxonomy_reference(state.area, state.skill)
        key = f"{state.user_id}:{state.area}:{state.skill}"
        self._db.upsert("skill_states", "state_key", key, state.model_dump(mode="json"), user_id=state.user_id)
        return state

    def skill_states(self, user_id: str) -> list[UserSkillState]:
        return [UserSkillState.model_validate_json(row["payload"]) for row in self._db.rows("skill_states", "user_id = ?", [user_id])]

    def _validate_taxonomy_reference(self, area: str, skill: str) -> None:
        if self._taxonomy and not self._taxonomy.has_skill(area, skill):
            raise ValueError(f"unknown taxonomy skill: {area} / {skill}")
