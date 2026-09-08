from datetime import datetime, timezone

from .activity_repository import ActivityRepository
from .loader import load_repository
from .mastery_engine import MasteryEngine
from .mastery_repository import MasteryRepository
from .persistence import SQLitePersistence
from .scoring import MasteryScorer, MasteryWeights
from .services import ActivityService
from .user_models import AttemptStatus, ExerciseAttempt


def main() -> None:
    database = SQLitePersistence(":memory:")
    activity = ActivityRepository(database, load_repository().all())
    service = ActivityService(activity)
    engine = MasteryEngine(activity, MasteryScorer(MasteryWeights()))
    started = datetime(2026, 8, 20, 9, 0, tzinfo=timezone.utc)
    for index, score in enumerate((42, 55), start=1):
        service.record_attempt(ExerciseAttempt(attempt_id=f"demo_attempt_{index}", user_id="demo_user_01", exercise_id="sa_values_01", started_at=started.replace(day=20 + index - 1), completed_at=started.replace(day=20 + index - 1, hour=9, minute=15), status=AttemptStatus.completed, duration_seconds=900, difficulty_rating=2, usefulness_rating=5, before_score=score - 10, after_score=score), "demo_session")
    state, explanation, snapshot = engine.calculate("demo_user_01", "Self-Awareness", "Values Awareness", now=datetime(2026, 8, 21, tzinfo=timezone.utc))
    print("Initial/current skill state:", state.model_dump())
    print("Evidence confidence:", state.evidence_confidence)
    print("Trend:", state.trend)
    print("Explanation:", explanation.model_dump())
    print("Snapshot:", snapshot.model_dump())
    repository = MasteryRepository(database)
    repository.save_snapshot(snapshot)
    print("History entries:", len(repository.history("demo_user_01")))
    database.close()


if __name__ == "__main__":
    main()
