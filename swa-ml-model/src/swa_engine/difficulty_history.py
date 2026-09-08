from .difficulty_models import DifficultySnapshot
from .persistence import SQLitePersistence


class DifficultyHistoryRepository:
    def __init__(self, persistence: SQLitePersistence) -> None:
        self._db = persistence

    def save(self, snapshot: DifficultySnapshot) -> DifficultySnapshot:
        key = f"{snapshot.user_id}:{snapshot.area}:{snapshot.skill}:{snapshot.timestamp.isoformat()}"
        self._db.upsert("difficulty_history", "snapshot_key", key, snapshot.model_dump(mode="json"), user_id=snapshot.user_id, timestamp=snapshot.timestamp.isoformat())
        return snapshot

    def list(self, user_id: str, area: str | None = None, skill: str | None = None) -> list[DifficultySnapshot]:
        rows = self._db.rows("difficulty_history", "user_id = ?", [user_id])
        snapshots = [DifficultySnapshot.model_validate_json(row["payload"]) for row in rows]
        return [item for item in snapshots if (area is None or item.area == area) and (skill is None or item.skill == skill)]
