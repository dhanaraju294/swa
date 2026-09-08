from dataclasses import dataclass


@dataclass(frozen=True)
class DatasetSplit:
    training: list[dict]
    validation: list[dict]
    test: list[dict]


def split_dataset(rows: list[dict], train_fraction=0.70, validation_fraction=0.15) -> DatasetSplit:
    first = int(len(rows) * train_fraction)
    second = first + int(len(rows) * validation_fraction)
    return DatasetSplit(rows[:first], rows[first:second], rows[second:])


def time_aware_split(rows: list[dict], train_fraction=0.70, validation_fraction=0.15) -> DatasetSplit:
    ordered = sorted(rows, key=lambda row: row["interaction_id"])
    return split_dataset(ordered, train_fraction, validation_fraction)
