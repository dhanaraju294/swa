from .synthetic_pipeline import generate_development_dataset


def main():
    dataset, splits, report = generate_development_dataset()
    print("Dataset version:", dataset.metadata["dataset_version"])
    print("Synthetic:", dataset.metadata["synthetic_data"])
    print("Rows:", dataset.metadata["row_count"])
    print("Features:", dataset.metadata["feature_count"])
    print("Seed:", dataset.metadata["random_seed"])
    stats = report["target_distribution"]
    print("Target statistics:", stats)
    print("Train rows:", len(splits.training), "Validation rows:", len(splits.validation), "Test rows:", len(splits.test))
    print("Sample records:")
    for row in dataset.rows[:3]:
        print(row)


if __name__ == "__main__":
    main()
