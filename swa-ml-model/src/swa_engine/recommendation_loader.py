from .config import RECOMMENDATION_CONFIG_PATH, TAXONOMY_PATH
from .loader import load_repository
from .mastery_engine import MasteryEngine
from .recommendation_config import load_recommendation_config
from .recommendation_engine import RecommendationEngine
from .taxonomy import load_taxonomy


def create_recommendation_engine(users, activity) -> RecommendationEngine:
    exercise_repository = load_repository()
    taxonomy = load_taxonomy(TAXONOMY_PATH)
    mastery = MasteryEngine(activity)
    return RecommendationEngine(exercise_repository.all(), users, activity, mastery, taxonomy, load_recommendation_config(RECOMMENDATION_CONFIG_PATH))
