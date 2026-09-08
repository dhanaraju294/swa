import json
from pathlib import Path


def write_reports(report: dict, directory: str | Path) -> tuple[Path, Path]:
    directory = Path(directory)
    directory.mkdir(parents=True, exist_ok=True)
    json_path = directory / "evaluation_report.json"
    text_path = directory / "evaluation_report.txt"
    json_path.write_text(json.dumps(report, indent=2, default=str), encoding="utf-8")
    lines = ["SWA ML EVALUATION REPORT", f"Model: {report['model_version']}", f"Dataset: {report['dataset_version']}", "Synthetic Data: true", "", "BASELINE", json.dumps(report["baseline_metrics"], indent=2), "", "TEST PERFORMANCE", json.dumps(report["test_metrics"], indent=2), "", "CROSS VALIDATION", json.dumps(report["cross_validation"], indent=2), "", "OVERFITTING", json.dumps(report["overfitting"], indent=2), "", "GENERALIZATION", json.dumps(report["generalization"], indent=2), "", "COLD START", json.dumps(report["cold_start"], indent=2), "", "FEATURE ABLATION", json.dumps(report["feature_ablation"], indent=2), "", "ERROR ANALYSIS", json.dumps(report["error_analysis"], indent=2), "", "AREA PERFORMANCE", json.dumps(report["area_metrics"], indent=2), "", "ROBUSTNESS", json.dumps(report["robustness"], indent=2), "", "FINAL STATUS", json.dumps(report["readiness"], indent=2), "", "Evaluation is based on synthetic development data.", "Real-world validation requires actual SWA interaction data."]
    text_path.write_text("\n".join(lines), encoding="utf-8")
    return json_path, text_path
