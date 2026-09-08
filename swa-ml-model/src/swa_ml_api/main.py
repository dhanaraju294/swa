from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from types import SimpleNamespace

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from swa_engine.hybrid_config import load_hybrid_config
from swa_engine.hybrid_engine import HybridEngine
from swa_engine.interaction_models import InteractionEvent
from swa_engine.interaction_repository import InteractionEventRepository
from swa_engine.learning_service import LearningLoopService
from swa_engine.nlp_models import NLPInput
from swa_engine.phase2_loader import create_phase2_repositories
from swa_engine.recommendation_loader import create_recommendation_engine
from swa_engine.recommendation_models import RecommendationRequest
from swa_engine.user_models import UserProfile

from .model_suite import ModelSuite

BASE_DIR = Path(__file__).resolve().parents[2]
DB_PATH = os.getenv("SWA_ML_DB_PATH", str(BASE_DIR / "runtime" / "swa_ml.db"))
BASELINE_DIR = Path(os.getenv("SWA_ML_BASELINE_DIR", str(BASE_DIR / "artifacts" / "ml_baseline")))
EVAL_REPORT = BASE_DIR / "artifacts" / "ml_evaluation" / "evaluation_report.json"
SUITE_DIR = BASE_DIR / "artifacts" / "ml_suite"
Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)

users, activity, database = create_phase2_repositories(DB_PATH)
exercise_repository = __import__("swa_engine.loader", fromlist=["load_repository"]).load_repository()
exercises = exercise_repository.all()
rule_engine = create_recommendation_engine(users, activity)
interaction_repository = InteractionEventRepository(database, exercises)
learning_service = LearningLoopService(interaction_repository, activity, users, exercises)
model_suite = ModelSuite(SUITE_DIR)

# Keep the original SWA hybrid recommendation engine, but replace its single
# baseline adapter with an ensemble adapter so LR + RF + NN all contribute.
class EnsembleMLAdapter:
    def __init__(self, suite: ModelSuite, evaluation_report_path: Path):
        self.suite = suite
        self.available = bool(suite.available())
        self.failure_reason = None if self.available else "No trained ML suite artifacts are available"
        self.readiness = "EXPERIMENTALLY_READY" if self.available else "NOT_READY"
        self.report = {}
        if evaluation_report_path.exists():
            import json
            self.report = json.loads(evaluation_report_path.read_text(encoding="utf-8"))
        versions = [self.suite.metadata[n].get("model_version") for n in self.suite.available()]
        dataset_versions = [self.suite.metadata[n].get("dataset_version") for n in self.suite.available()]
        self.model_version = "ensemble(" + "+".join(v or n for n, v in zip(self.suite.available(), versions)) + ")" if versions else None
        self.dataset_version = dataset_versions[0] if dataset_versions else None
        self.inference = SimpleNamespace(metadata={"synthetic_training_data": True}) if self.available else None

    def predict(self, features: dict) -> float:
        if not self.available:
            raise RuntimeError(self.failure_reason or "ML unavailable")
        result = self.suite.predict(features, "ensemble")
        return float(result["predicted_score"])


hybrid_adapter = EnsembleMLAdapter(model_suite, EVAL_REPORT)
hybrid_engine = HybridEngine(rule_engine, hybrid_adapter, load_hybrid_config())

app = FastAPI(title="SWA ML Service", version="1.0.0")

class ProfileRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    user_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    selected_areas: list[str] = Field(default_factory=list)
    selected_skills: list[str] = Field(default_factory=list)
    goals: list[str] = Field(default_factory=list)
    preferences: dict = Field(default_factory=dict)

class PredictRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    model: str = "ensemble"
    features: dict

class RecommendRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    user_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    requested_area: str | None = None
    requested_skill: str | None = None
    current_context: dict | None = None
    text: str | None = None
    limit: int = Field(default=5, ge=1, le=20)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "swa-ml",
        "recommendation_engine": "available",
        "trained_models": model_suite.available(),
        "model_versions": {n: model_suite.metadata[n].get("model_version") for n in model_suite.available()},
        "ensemble_available": hybrid_adapter.available,
        "database": "available",
    }

@app.put("/users/profile")
def save_profile(request: ProfileRequest):
    now = datetime.now(timezone.utc)
    existing = users.get_profile(request.user_id)
    profile = UserProfile(
        user_id=request.user_id,
        created_at=existing.created_at if existing else now,
        updated_at=now,
        selected_areas=request.selected_areas,
        selected_skills=request.selected_skills,
        goals=request.goals,
        preferences=request.preferences,
    )
    users.save_profile(profile)
    return profile.model_dump(mode="json")

@app.post("/events")
def record_event(event: InteractionEvent):
    try:
        return learning_service.record(event).model_dump(mode="json")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

@app.post("/predict")
def predict(request: PredictRequest):
    try:
        return model_suite.predict(request.features, request.model)
    except (ValueError, RuntimeError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

@app.post("/recommend")
def recommend(request: RecommendRequest):
    try:
        now = datetime.now(timezone.utc)
        if users.get_profile(request.user_id) is None:
            users.save_profile(UserProfile(user_id=request.user_id, created_at=now, updated_at=now))
        recommendation_request = RecommendationRequest(
            user_id=request.user_id,
            requested_area=request.requested_area,
            requested_skill=request.requested_skill,
            current_context=request.current_context,
            limit=request.limit,
        )
        nlp_result = None
        if request.text:
            nlp_result = hybrid_engine.nlp_engine.analyze(NLPInput(
                user_id=request.user_id, text=request.text, timestamp=now, source="free_text"
            ))
        result = hybrid_engine.recommend(recommendation_request, now, nlp_result)
        return result.model_dump(mode="json")
    except (ValueError, RuntimeError, KeyError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
