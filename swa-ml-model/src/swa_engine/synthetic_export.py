import csv
import json
from pathlib import Path


def export_csv(rows: list[dict], path: str | Path) -> Path:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]) if rows else [])
        writer.writeheader()
        writer.writerows(rows)
    return path


def export_metadata(metadata: dict, path: str | Path) -> Path:
    path = Path(path)
    path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return path


def export_parquet(rows: list[dict], path: str | Path) -> Path:
    try:
        import pandas as pd
    except ImportError as error:
        raise RuntimeError("Parquet export requires optional pandas and pyarrow dependencies") from error
    pd.DataFrame(rows).to_parquet(path, index=False)
    return Path(path)
