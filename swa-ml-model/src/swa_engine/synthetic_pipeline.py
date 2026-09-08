from .synthetic_config import load_synthetic_config
from .synthetic_generator import SyntheticDatasetGenerator
from .synthetic_split import split_dataset, time_aware_split
from .synthetic_validation import validate_dataset


def generate_development_dataset(config_path="config/synthetic_data.json"):
    config = load_synthetic_config(config_path)
    dataset = SyntheticDatasetGenerator(config).generate()
    report = validate_dataset(dataset.rows)
    if not report["valid"]:
        raise ValueError(report["errors"])
    return dataset, split_dataset(dataset.rows, config.train_fraction, config.validation_fraction), report
