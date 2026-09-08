from datetime import datetime, timedelta, timezone

from .activity_repository import ActivityRepository
from .loader import load_repository
from .mastery_engine import MasteryEngine
from .persistence import SQLitePersistence
from .recommendation_engine import RecommendationEngine
from .recommendation_models import RecommendationRequest
from .services import ActivityService
from .user_models import AttemptStatus, ExerciseAttempt, GoalPriority, GoalStatus, UserGoal, UserProfile
from .user_repository import UserRepository


NOW = datetime(2026, 8, 21, 12, tzinfo=timezone.utc)


def add_user(users: UserRepository, user_id: str, areas: list[str], skills: list[str], goal_id: str, goal_area: str, goal_skill: str) -> None:
    users.save_profile(UserProfile(user_id=user_id, created_at=NOW, updated_at=NOW, selected_areas=areas, selected_skills=skills, preferences={"preferred_minutes": 15}))
    users.save_goal(UserGoal(goal_id=goal_id, user_id=user_id, area=goal_area, skill=goal_skill, priority=GoalPriority.high, status=GoalStatus.active, created_at=NOW, updated_at=NOW))


def add_attempt(activity: ActivityRepository, attempt_id: str, user_id: str, exercise_id: str, days_ago: int, status: AttemptStatus = AttemptStatus.completed) -> None:
    started = NOW - timedelta(days=days_ago)
    activity.save_attempt(ExerciseAttempt(attempt_id=attempt_id, user_id=user_id, exercise_id=exercise_id, started_at=started, completed_at=started + timedelta(minutes=12) if status == AttemptStatus.completed else None, status=status, usefulness_rating=5 if status == AttemptStatus.completed else None, difficulty_rating=3))


def print_scenario(label: str, engine: RecommendationEngine, request: RecommendationRequest) -> None:
    result = engine.recommend(request, NOW)
    print(f"\n{label}")
    for index, recommendation in enumerate(result.recommendations, 1):
        print(f"{index}. {recommendation.exercise_id} | {recommendation.title} | score={recommendation.score:.3f} | {recommendation.area} / {recommendation.skill}")
        print(f"   components={recommendation.score_components}")
    if result.recommendations:
        print(f"Top explanation: {result.recommendations[0].reason}")


def main() -> None:
    database = SQLitePersistence(":memory:")
    exercise_repository = load_repository()
    users = UserRepository(database)
    activity = ActivityRepository(database, exercise_repository.all())
    add_user(users, "demo_new_confidence", ["Confidence"], ["Self-Efficacy", "Assertiveness"], "goal_demo_confidence", "Confidence", "Self-Efficacy")
    add_user(users, "demo_repeat_confidence", ["Confidence"], ["Self-Efficacy", "Self-Compassion"], "goal_demo_repeat", "Confidence", "Self-Compassion")
    add_user(users, "demo_communication", ["Communication"], ["Clarity", "Active Listening"], "goal_demo_communication", "Communication", "Clarity")
    add_attempt(activity, "demo_repeat_1", "demo_repeat_confidence", "co_efficacy_01", 20)
    add_attempt(activity, "demo_repeat_2", "demo_repeat_confidence", "co_efficacy_02", 10)
    add_attempt(activity, "demo_repeat_3", "demo_repeat_confidence", "co_compassion_01", 3)
    add_attempt(activity, "demo_communication_1", "demo_communication", "cm_clear_01", 4)
    engine = RecommendationEngine(exercise_repository.all(), users, activity, MasteryEngine(activity))
    print_scenario("SCENARIO A: new user interested in confidence", engine, RecommendationRequest(user_id="demo_new_confidence", limit=5))
    print_scenario("SCENARIO B: repeated confidence exercise history", engine, RecommendationRequest(user_id="demo_repeat_confidence", limit=5))
    print_scenario("SCENARIO C: strong communication goal", engine, RecommendationRequest(user_id="demo_communication", requested_area="Communication", requested_skill="Clarity", current_context={"context": "listening"}, limit=5))
    database.close()


if __name__ == "__main__":
    main()
