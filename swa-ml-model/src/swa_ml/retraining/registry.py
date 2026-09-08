import json
from datetime import datetime, timezone
from pathlib import Path


class CandidateRegistry:
    statuses = {"CANDIDATE", "APPROVED", "ACTIVE", "REJECTED", "ARCHIVED"}

    def __init__(self, path="artifacts/ml_retraining/registry.json"):
        self.path = Path(path)

    def entries(self):
        return json.loads(self.path.read_text(encoding="utf-8")) if self.path.exists() else []

    def register(self, entry):
        if entry.get("status") not in self.statuses:
            raise ValueError("invalid model registry status")
        if any(item.get("model_version") == entry.get("model_version") for item in self.entries()):
            raise ValueError("model version already registered")
        entry = {**entry, "registered_at": datetime.now(timezone.utc).isoformat()}
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps([*self.entries(), entry], indent=2), encoding="utf-8")
        return entry

    def update_status(self, version, status):
        if status not in self.statuses:
            raise ValueError("invalid model registry status")
        entries = self.entries()
        match = next((item for item in entries if item.get("model_version") == version), None)
        if match is None:
            raise ValueError(f"unknown model version: {version}")
        match["status"] = status
        self.path.write_text(json.dumps(entries, indent=2), encoding="utf-8")
        return match