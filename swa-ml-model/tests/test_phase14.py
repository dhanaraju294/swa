from datetime import datetime, timezone

from swa_engine.interaction_models import ExerciseOutcome, InteractionEvent, InteractionEventType
from swa_ml.retraining.config import RetrainingConfig
from swa_ml.retraining.dataset import temporal_split, validate_training_rows
from swa_ml.retraining.eligibility import check_eligibility
from swa_ml.retraining.pipeline import RetrainingPipeline
from swa_ml.retraining.registry import CandidateRegistry
from swa_ml.retraining.promotion import PromotionManager
from swa_ml.retraining.reports import compare_models, model_card


def event(index, user="phase14_user", event_type=InteractionEventType.recommendation_shown, outcome=None):
    return InteractionEvent(event_id=f"phase14_{index}", user_id=user, recommendation_id=f"phase14_rec_{index}", exercise_id="co_efficacy_01", timestamp=datetime(2026, 8, 22, 12, index, tzinfo=timezone.utc), event_type=event_type, model_version="baseline", recommendation_version="1.0.0", difficulty=2, area="Confidence", skill="Self-Efficacy", exercise_type="reflection", outcome=outcome, pre_features={"mastery_score": 0.2})


def test_dry_run_blocks_without_mutating_registry(tmp_path):
    registry = CandidateRegistry(tmp_path / "registry.json")
    result = RetrainingPipeline(RetrainingConfig(output_directory=str(tmp_path / "artifacts")), registry).run([], dry_run=True)
    assert result["active_model_unchanged"] is True
    assert result["eligibility"]["eligible"] is False
    assert registry.entries() == []


def test_temporal_split_and_schema_validation():
    rows = [{"event_timestamp": f"2026-08-0{index}T00:00:00+00:00"} for index in range(1, 11)]
    split = temporal_split(rows)
    assert len(split["train"]) == 7
    assert split["train"][-1]["event_timestamp"] < split["validation"][0]["event_timestamp"]
    assert validate_training_rows([])["schema_valid"] is False


def test_real_data_separation_and_eligibility(tmp_path):
    shown = event(1)
    completed = event(2, event_type=InteractionEventType.exercise_completed, outcome=ExerciseOutcome(completion_status="completed"))
    config = RetrainingConfig(min_real_interactions=1, min_unique_users=1, min_completed_exercises=1, min_target_diversity=1)
    result = check_eligibility([shown, completed], config)
    assert result["checks"]["real_interactions"] is True
    assert result["checks"]["unique_users"] is True


def test_registry_manual_promotion_requires_confirmation(tmp_path):
    registry = CandidateRegistry(tmp_path / "registry.json")
    registry.register({"model_version": "candidate_1", "status": "CANDIDATE", "metrics": {"test": {"mae": 0.2}}})
    manager = PromotionManager(registry)
    try:
        manager.approve("candidate_1", "")
    except ValueError as error:
        assert "confirmation" in str(error)
    assert manager.approve("candidate_1", "PROMOTE")["status"] == "ACTIVE"


def test_reporting_and_candidate_comparison():
    result = compare_models({"test": {"mae": 0.3, "r2": 0.4}}, {"test": {"mae": 0.2, "r2": 0.5}})
    assert result["mae"]["difference"] == -0.1
    assert "Trained on SWA interaction data." in model_card({"data_source": "real", "model_version": "candidate", "feature_schema": []})