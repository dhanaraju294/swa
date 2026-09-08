from dataclasses import dataclass, field

from swa_engine.learning_dataset import LearningTarget


@dataclass(frozen=True)
class RetrainingConfig:
    dataset_version: str = "swa_real_dataset_v1"
    target: LearningTarget = LearningTarget.outcome_score
    min_real_interactions: int = 100
    min_unique_users: int = 10
    min_completed_exercises: int = 50
    min_target_diversity: int = 2
    max_missing_rate: float = 0.05
    train_fraction: float = 0.70
    validation_fraction: float = 0.15
    random_seed: int = 42
    model_version: str = "swa_ml_real_v1"
    output_directory: str = "artifacts/ml_retraining"
    promotion_mae_tolerance: float = 0.0
    random_forest_parameters: dict = field(default_factory=lambda: {"n_estimators": 80, "max_depth": 12, "min_samples_leaf": 2, "n_jobs": -1})
