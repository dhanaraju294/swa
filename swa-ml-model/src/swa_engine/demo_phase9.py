from .ml_inference import BaselineInference
from .synthetic_generator import SyntheticDatasetGenerator


def main():
    predictor = BaselineInference()
    rows = SyntheticDatasetGenerator().generate().rows[:3]
    predictions = sorted(predictor.predict_batch(rows), key=lambda item: item["predicted_score"], reverse=True)
    for result in predictions:
        print(result["exercise_id"], "->", round(result["predicted_score"], 6), result["model_version"])


if __name__ == "__main__":
    main()
