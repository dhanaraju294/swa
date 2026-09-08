from datetime import datetime, timezone
import json


class PromotionManager:
    def __init__(self, registry):
        self.registry = registry

    def eligible(self, candidate, current=None, safety=None, tolerance=0.0):
        candidate_mae = candidate["metadata"]["metrics"]["test"]["mae"]
        current_mae = current.get("metrics", {}).get("test", {}).get("mae") if current else None
        performance = current_mae is None or candidate_mae <= current_mae + tolerance
        result = {"eligible": performance and not safety, "performance_non_regression": performance, "safety_block": bool(safety), "reason": "eligible for manual approval" if performance and not safety else "promotion blocked"}
        return result

    def approve(self, version, confirmation: str):
        if confirmation != "PROMOTE":
            raise ValueError("explicit confirmation PROMOTE is required")
        entries = self.registry.entries()
        current = [entry for entry in entries if entry.get("status") == "ACTIVE"]
        for entry in current:
            entry["status"] = "ARCHIVED"
        match = next((entry for entry in entries if entry.get("model_version") == version), None)
        if not match or match.get("status") not in {"CANDIDATE", "APPROVED"}:
            raise ValueError("candidate model is not promotable")
        match["status"] = "ACTIVE"
        self.registry.path.write_text(json.dumps(entries, indent=2), encoding="utf-8")
        return match

    def rollback(self, version, confirmation: str):
        if confirmation != "ROLLBACK":
            raise ValueError("explicit confirmation ROLLBACK is required")
        return self.approve(version, "PROMOTE")