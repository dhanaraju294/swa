from .evaluation_config import load_evaluation_config
from .evaluation_engine import MLEvaluator


def main():
    report = MLEvaluator(load_evaluation_config()).evaluate()
    print("SWA ML EVALUATION")
    print("Evaluation is based on synthetic development data.")
    print("Model:", report["model_version"])
    print("Baseline:", report["baseline_metrics"]["dummy_regressor"])
    print("Test:", report["test_metrics"])
    print("CV MAE:", report["cross_validation"]["mae_mean"], "+/-", report["cross_validation"]["mae_std"])
    print("Overfitting flagged:", report["overfitting"]["flagged"])
    print("Readiness:", report["readiness"]["status"])
    print("Reports:", report["report_paths"])


if __name__ == "__main__":
    main()
