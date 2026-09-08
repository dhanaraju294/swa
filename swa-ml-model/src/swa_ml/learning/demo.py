from datetime import datetime, timezone
from uuid import uuid4

from swa_engine.interaction_models import ExerciseOutcome, InteractionEvent, InteractionEventType, InteractionFeedback
from swa_engine.interaction_repository import InteractionEventRepository
from swa_engine.learning_dataset import build_training_rows
from swa_engine.learning_service import LearningLoopService
from swa_engine.phase2_loader import create_phase2_repositories
from swa_engine.recommendation_loader import create_recommendation_engine
from swa_engine.recommendation_models import RecommendationRequest
from swa_engine.retraining_guard import assess_retraining
from swa_engine.user_models import UserProfile


def main():
    users, activity, database = create_phase2_repositories()
    now = datetime(2026, 8, 22, 12, tzinfo=timezone.utc)
    user_id = "phase13_demo_user"
    users.save_profile(UserProfile(user_id=user_id, created_at=now, updated_at=now, selected_areas=["Confidence"], selected_skills=["Self-Efficacy"]))
    exercises = list(activity._exercises.values())
    recommendation = create_recommendation_engine(users, activity).recommend(RecommendationRequest(user_id=user_id, limit=1), now).recommendations[0]
    service = LearningLoopService(InteractionEventRepository(database, exercises), activity, users, exercises)
    recommendation_id = "phase13_demo_rec"
    common = {"user_id": user_id, "recommendation_id": recommendation_id, "exercise_id": recommendation.exercise_id, "timestamp": now, "model_version": "demo", "recommendation_version": "1.0.0", "strategy": "rule_based_weighted", "rule_score": recommendation.score, "difficulty": recommendation.difficulty, "area": recommendation.area, "skill": recommendation.skill, "exercise_type": next(exercise.type for exercise in exercises if exercise.exercise_id == recommendation.exercise_id), "data_source": "real"}
    events = [InteractionEvent(event_id=f"phase13_demo_{suffix}", event_type=event_type, pre_features={"mastery_score": 0.0, "area": recommendation.area, "skill": recommendation.skill}, **common) for suffix, event_type in (("shown", InteractionEventType.recommendation_shown), ("started", InteractionEventType.exercise_started), ("completed", InteractionEventType.exercise_completed))]
    events[-1] = events[-1].model_copy(update={"outcome": ExerciseOutcome(completion_status="completed", completion_duration=600, usefulness_rating=5, difficulty_rating=3), "feedback": InteractionFeedback(useful=True, completed=True, difficulty=3, rating=5)})
    for event in events:
        service.record(event)
    state = service.update_state(user_id, recommendation.area, recommendation.skill, now)
    saved = service.interactions.get_user_events(user_id)
    print("SWA PHASE 13 LEARNING LOOP")
    print("Events:", [event.model_dump(mode="json", exclude={"pre_features"}) for event in saved])
    print("Updated state:", {key: value.model_dump(mode="json") if hasattr(value, "model_dump") else [item.model_dump(mode="json") for item in value] for key, value in state.items() if key in {"skill_state", "behavioral_patterns", "difficulty_state"}})
    print("Training rows:", build_training_rows(saved))
    print("Retraining:", assess_retraining(saved))
    database.close()


if __name__ == "__main__":
    main()