import json
from datetime import datetime, timezone
from pathlib import Path


class ModelRegistry:
    def __init__(self, path="artifacts/ml_baseline/model_registry.json"):
        self.path = Path(path)

    def register(self, entry: dict) -> dict:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        entries = json.loads(self.path.read_text(encoding="utf-8")) if self.path.exists() else []
        entries = [item for item in entries if not (item.get("model_name") == entry.get("model_name") and item.get("status") == "selected")]
        entry = {**entry, "created_at": datetime.now(timezone.utc).isoformat()}
        entries.append(entry)
        self.path.write_text(json.dumps(entries, indent=2), encoding="utf-8")
        return entry

    def list(self) -> list[dict]:
        return json.loads(self.path.read_text(encoding="utf-8")) if self.path.exists() else []
