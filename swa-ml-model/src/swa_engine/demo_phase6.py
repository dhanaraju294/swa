from datetime import datetime, timedelta, timezone

from .activity_repository import ActivityRepository
from .loader import load_repository
from .pattern_config import load_pattern_config
from .pattern_engine import PatternEngine
from .pattern_repository import PatternRepository
from .pattern_service import PatternService
from .persistence import SQLitePersistence
from .services import ActivityService
from .user_models import AttemptStatus, ExerciseAttempt


NOW = datetime(2026, 8, 21, 12, tzinfo=timezone.utc)


def main() -> None:
    database = SQLitePersistence(":memory:")
    exercises = load_repository().all()
    activity = ActivityRepository(database, exercises)
    service = ActivityService(activity)
    for index, exercise_id in enumerate(("sa_values_01", "sa_strengths_01", "sa_emotion_01", "sa_pattern_01"), 1):
        started = NOW - timedelta(days=index)
        service.record_attempt(ExerciseAttempt(attempt_id=f"pattern_demo_{index}", user_id="demo_user_001", exercise_id=exercise_id, started_at=started, completed_at=started + timedelta(minutes=8), status=AttemptStatus.completed, usefulness_rating=5, difficulty_rating=2), "pattern_demo_session")
    patterns = PatternService(activity, PatternEngine(exercises, load_pattern_config("config/patterns.json")), PatternRepository(database)).analyze_user("demo_user_001", NOW)
    print("SWA BEHAVIOR ANALYSIS\n\nUser: demo_user_001\n\nPATTERNS")
    for pattern in patterns:
        print(f"\n{pattern.pattern_type} [{pattern.status}]\nConfidence: {pattern.confidence}\nEvidence: {pattern.evidence}")
    database.close()


if __name__ == "__main__":
    main()
