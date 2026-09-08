from datetime import datetime, timezone
import re

from pydantic import BaseModel, ConfigDict, Field

from swa_engine.hybrid_loader import create_hybrid_engine
from swa_engine.nlp_models import NLPInput
from swa_engine.phase2_loader import create_phase2_repositories
from swa_engine.recommendation_models import RecommendationRequest
from swa_engine.user_models import UserProfile


class SessionAnswers(BaseModel):
    model_config = ConfigDict(extra="forbid")

    user_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]+$")
    focus_text: str = Field(min_length=1, max_length=10000)
    preferred_minutes: int = Field(default=10, ge=1, le=180)
    limit: int = Field(default=3, ge=1, le=5)


class InteractiveSession:
    """Collects a small amount of user input and runs the existing SWA pipeline."""

    def __init__(self, users=None, activity=None, database=None, engine=None):
        if engine is not None:
            self.users = users
            self.activity = activity
            self.database = database
            self.engine = engine
        else:
            self.users, self.activity, self.database = create_phase2_repositories()
            self.engine = create_hybrid_engine(self.users, self.activity)

    def recommend(self, answers: SessionAnswers, now: datetime | None = None):
        now = now or datetime.now(timezone.utc)
        nlp_result = self.engine.nlp_engine.analyze(NLPInput(user_id=answers.user_id, text=answers.focus_text, timestamp=now, source="free_text"))
        areas = [signal.area for signal in nlp_result.detected_areas]
        skills = [signal.skill for signal in nlp_result.detected_skills]
        if not areas:
            areas = ["Confidence"]
        if not skills:
            skills = ["Self-Efficacy"]
        profile = UserProfile(user_id=answers.user_id, created_at=now, updated_at=now, selected_areas=list(dict.fromkeys(areas)), selected_skills=list(dict.fromkeys(skills)), preferences={"preferred_minutes": answers.preferred_minutes})
        self.users.save_profile(profile)
        request = RecommendationRequest(user_id=answers.user_id, requested_area=areas[0], requested_skill=skills[0], current_context={"nlp_context": nlp_result.detected_contexts}, limit=answers.limit)
        result = self.engine.recommend(request, now, nlp_result)
        return {"answers": answers, "nlp": nlp_result, "recommendation": result}

    def close(self):
        if self.database is not None:
            self.database.close()


def ask_questions(input_fn=input, output_fn=print) -> SessionAnswers:
    output_fn("SWA exercise check-in")
    output_fn("Answer a few questions in your own words. The text is used only to find relevant exercise areas and skills.")
    user_id = input_fn("User ID [demo_user]: ").strip() or "demo_user"
    if not re.fullmatch(r"[a-z0-9][a-z0-9_-]+", user_id):
        raise ValueError("User ID must contain lowercase letters, numbers, underscores, or hyphens.")
    focus = input_fn("What would you like help practicing today? ").strip()
    minutes_text = input_fn("How many minutes do you have [10]? ").strip()
    limit_text = input_fn("How many recommendations should I show, 1-5 [3]? ").strip()
    return SessionAnswers(user_id=user_id, focus_text=focus, preferred_minutes=int(minutes_text or 10), limit=int(limit_text or 3))


def format_session(result: dict, output_fn=print) -> None:
    nlp = result["nlp"]
    recommendation = result["recommendation"]
    output_fn("\nDetected areas: " + ", ".join(signal.area for signal in nlp.detected_areas) or "none")
    output_fn("Detected skills: " + ", ".join(signal.skill for signal in nlp.detected_skills) or "none")
    output_fn(f"\nRecommendations ({recommendation.strategy}; ML available: {recommendation.ml_available}):")
    for index, item in enumerate(recommendation.recommendations, 1):
        output_fn(f"{index}. {item.title} [{item.area} / {item.skill}, difficulty {item.difficulty}]")
        output_fn(f"   score={item.hybrid_score:.3f} rule={item.rule_score:.3f} ml={item.ml_score if item.ml_score is not None else 'not used'}")
        output_fn(f"   {item.explanation}")