from .activity_repository import ActivityRepository
from .config import EXERCISES_PATH, TAXONOMY_PATH
from .loader import load_repository
from .persistence import SQLitePersistence
from .taxonomy import load_taxonomy
from .user_repository import UserRepository


def create_phase2_repositories(database_path: str = ":memory:") -> tuple[UserRepository, ActivityRepository, SQLitePersistence]:
    persistence = SQLitePersistence(database_path)
    user_repository = UserRepository(persistence, load_taxonomy(TAXONOMY_PATH))
    exercise_repository = load_repository()
    activity_repository = ActivityRepository(persistence, exercise_repository.all())
    return user_repository, activity_repository, persistence
