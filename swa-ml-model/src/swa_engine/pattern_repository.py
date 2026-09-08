from .pattern_models import PatternSnapshot
from .persistence import SQLitePersistence


class PatternRepository:
    def __init__(self, persistence: SQLitePersistence) -> None:
        self._db = persistence

    def save_snapshot(self, snapshot: PatternSnapshot) -> PatternSnapshot:
        key = f"{snapshot.user_id}:{snapshot.pattern_id}:{snapshot.timestamp.isoformat()}"
        self._db.upsert("pattern_history", "snapshot_key", key, snapshot.model_dump(mode="json"), user_id=snapshot.user_id, timestamp=snapshot.timestamp.isoformat())
        return snapshot

    def history(self, user_id: str, pattern_id: str | None = None) -> list[PatternSnapshot]:
        rows = self._db.rows("pattern_history", "user_id = ?", [user_id])
        snapshots = [PatternSnapshot.model_validate_json(row["payload"]) for row in rows]
        return [snapshot for snapshot in snapshots if pattern_id is None or snapshot.pattern_id == pattern_id]
