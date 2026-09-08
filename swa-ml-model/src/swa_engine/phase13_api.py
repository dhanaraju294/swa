from datetime import datetime

from fastapi import FastAPI, HTTPException, Query

from .interaction_models import InteractionEvent
from .interaction_repository import InteractionEventRepository
from .learning_service import LearningLoopService
from .phase15_api import add_phase15_routes


def create_phase13_app(users, activity, database, exercises) -> FastAPI:
    repository = InteractionEventRepository(database, exercises)
    service = LearningLoopService(repository, activity, users, exercises)
    app = FastAPI(title="SWA interaction learning API")

    @app.post("/events", response_model=InteractionEvent, status_code=201)
    def create_event(event: InteractionEvent):
        try:
            return service.record(event)
        except ValueError as error:
            raise HTTPException(status_code=400, detail=str(error)) from error

    @app.get("/users/{user_id}/history")
    def user_history(user_id: str, limit: int = Query(default=50, ge=1, le=500), start: datetime | None = None, end: datetime | None = None, event_type: str | None = None):
        return {"user_id": user_id, "events": [event.model_dump(mode="json", exclude={"pre_features"}) for event in repository.get_user_events(user_id, start, end, event_type, limit)]}

    @app.get("/users/{user_id}/state")
    def user_state(user_id: str):
        profile = users.get_profile(user_id)
        if profile is None:
            raise HTTPException(status_code=404, detail=f"unknown user_id: {user_id}")
        states = users.skill_states(user_id)
        patterns = []
        difficulties = []
        for state in states:
            updated = service.update_state(user_id, state.area, state.skill)
            patterns.extend(updated["behavioral_patterns"])
            difficulties.append(updated["difficulty_state"])
        return {"user_id": user_id, "goals": [goal.model_dump(mode="json") for goal in users.goals(user_id)], "skill_states": [state.model_dump(mode="json") for state in states], "behavioral_patterns": [pattern.model_dump(mode="json") for pattern in patterns], "difficulty_states": [state.model_dump(mode="json") for state in difficulties]}

    return add_phase15_routes(app, repository)