from .config import RECOMMENDATION_CONFIG_PATH, TAXONOMY_PATH
from .hybrid_config import load_hybrid_config
from .hybrid_engine import HybridEngine
from .hybrid_ml_adapter import HybridMLAdapter
from .nlp_pipeline import ExplainableNLPBaseline
from .recommendation_loader import create_recommendation_engine


def create_hybrid_engine(users, activity, artifact_path="artifacts/ml_baseline/swa_ml_baseline_v1.joblib", metadata_path="artifacts/ml_baseline/model_metadata.json", evaluation_report_path="artifacts/ml_evaluation/evaluation_report.json") -> HybridEngine:
    rule_engine = create_recommendation_engine(users, activity)
    ml = HybridMLAdapter(artifact_path, metadata_path, evaluation_report_path)
    return HybridEngine(rule_engine, ml, load_hybrid_config(), ExplainableNLPBaseline())
