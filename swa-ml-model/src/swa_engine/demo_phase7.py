from datetime import datetime, timezone

from .activity_repository import ActivityRepository
from .difficulty_config import load_difficulty_config
from .difficulty_engine import DifficultyEngine
from .difficulty_history import DifficultyHistoryRepository
from .difficulty_service import DifficultyService
from .loader import load_repository
from .persistence import SQLitePersistence
from .services import ActivityService
from .user_models import AttemptStatus, ExerciseAttempt

NOW = datetime(2026, 8, 22, 12, tzinfo=timezone.utc)


def add(activity, user_id, index, exercise_id, status, rating=3):
    started = NOW.replace(day=max(1, 22 - index))
    activity.save_attempt(ExerciseAttempt(attempt_id=f"difficulty_demo_{user_id}_{index}", user_id=user_id, exercise_id=exercise_id, started_at=started, completed_at=started if status == AttemptStatus.completed else None, status=status, difficulty_rating=rating))


def main():
    db = SQLitePersistence(":memory:")
    exercises = load_repository().all()
    activity = ActivityRepository(db, exercises)
    service = ActivityService(activity)
    engine = DifficultyService(activity, DifficultyEngine(load_difficulty_config("config/difficulty.json")), DifficultyHistoryRepository(db))
    for index in range(3):
        add(activity, "consistent_user", index, "sa_values_01", AttemptStatus.completed, 2)
        add(activity, "struggle_user", index, "cm_difficult_02", AttemptStatus.abandoned, 5)
    scenarios = [("new_user", "Self-Awareness", "Values Awareness", 2), ("consistent_user", "Self-Awareness", "Values Awareness", 2), ("struggle_user", "Communication", "Difficult Conversations", 4)]
    for user_id, area, skill, current in scenarios:
        state, decision = engine.decide(user_id, area, skill, current, NOW)
        print(f"\nUSER: {user_id}\nArea/skill: {area} / {skill}\nPrevious: {decision.previous_level}\nRecommended: {decision.recommended_level}\nAction: {decision.action}\nConfidence: {decision.confidence}\nEvidence: {decision.evidence}\nExplanation: {decision.reasons[0]}")
    print("\nHistory records:", len(DifficultyHistoryRepository(db).list("consistent_user")))
    db.close()


if __name__ == "__main__":
    main()
