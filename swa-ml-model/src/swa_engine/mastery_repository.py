from .mastery_models import MasterySnapshot
from .persistence import SQLitePersistence


class MasteryRepository:
    def __init__(self, persistence: SQLitePersistence) -> None:
        self._db = persistence

    def save_snapshot(self, snapshot: MasterySnapshot) -> MasterySnapshot:
        key = f"{snapshot.user_id}:{snapshot.area}:{snapshot.skill}:{snapshot.timestamp.isoformat()}"
        self._db.upsert("mastery_history", "snapshot_key", key, snapshot.model_dump(mode="json"), user_id=snapshot.user_id, timestamp=snapshot.timestamp.isoformat())
        return snapshot

    def history(self, user_id: str, area: str | None = None, skill: str | None = None) -> list[MasterySnapshot]:
        rows = self._db.rows("mastery_history", "user_id = ?", [user_id])
        snapshots = [MasterySnapshot.model_validate_json(row["payload"]) for row in rows]
        return [snapshot for snapshot in snapshots if (area is None or snapshot.area == area) and (skill is None or snapshot.skill == skill)]
