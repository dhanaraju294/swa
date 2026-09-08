from .ml_config import load_training_config
from .ml_training import train_baselines


def main():
    result = train_baselines(load_training_config())
    metadata = result["metadata"]
    print("SWA ML BASELINE TRAINING")
    print("The model was trained using synthetic development data.")
    print("Selected:", metadata["model_name"], metadata["model_version"])
    print("Validation:", metadata["validation_metrics"])
    print("Held-out test:", metadata["test_metrics"])
    print("Artifact:", metadata["artifact_path"])
    print("Registry updated: true")


if __name__ == "__main__":
    main()
