import json
from pathlib import Path

from .config import RetrainingConfig
from .dataset import build_real_dataset, temporal_split, validate_training_rows
from .eligibility import check_eligibility
from .trainer import train_candidate
from .registry import CandidateRegistry
from .reports import model_card, write_report


class RetrainingPipeline:
    def __init__(self, config: RetrainingConfig | None = None, registry: CandidateRegistry | None = None):
        self.config = config or RetrainingConfig()
        self.registry = registry or CandidateRegistry()

    def dry_run(self, events):
        eligibility = check_eligibility(events, self.config)
        return {"dry_run": True, "active_model_unchanged": True, "eligibility": eligibility}

    def run(self, events, dry_run=False, parent_model_version=None):
        eligibility = check_eligibility(events, self.config)
        if dry_run:
            return self.dry_run(events)
        if not eligibility["eligible"]:
            return {"trained": False, "eligibility": eligibility, "message": "Insufficient real-world data for retraining."}
        dataset = build_real_dataset(events, dataset_version=self.config.dataset_version)
        quality = validate_training_rows(dataset["rows"])
        splits = temporal_split(dataset["rows"], self.config.train_fraction, self.config.validation_fraction)
        result = train_candidate(splits, self.config, parent_model_version)
        result["dataset_metadata"] = dataset["metadata"]
        result["quality"] = quality
        self.registry.register({"model_name": result["metadata"]["model_name"], "model_version": self.config.model_version, "dataset_version": self.config.dataset_version, "target": self.config.target.value, "training_timestamp": result["metadata"]["training_timestamp"], "data_source": "real", "metrics": result["metadata"]["metrics"], "status": "CANDIDATE", "artifact_path": result["metadata"]["artifact_path"], "parent_model_version": parent_model_version})
        result["model_card_path"] = write_report({"model_card": model_card(result["metadata"])}, result["output_directory"] / "model_card.json")
        result["report_path"] = write_report({"dataset": result["dataset_metadata"], "quality": quality, "candidate": result["metadata"], "promotion": {"eligible": False, "reason": "manual approval required"}}, result["output_directory"] / "retraining_report.json")
        return {"trained": True, **result}