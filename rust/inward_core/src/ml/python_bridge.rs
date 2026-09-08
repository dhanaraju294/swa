use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PythonArtifactStatus {
    pub suite_available: bool,
    pub suite_models: Vec<String>,
    pub suite_dir: String,
    pub baseline_available: bool,
    pub evaluation_available: bool,
    pub message: String,
}

/// Resolve the Python ML artifacts directory.
/// Search order:
/// 1. $SWA_ML_ARTIFACT_DIR / ml_suite (explicit override)
/// 2. Relative to crate: swa/swa-ml-model/artifacts/ml_suite (when running from rust/inward_core)
/// 3. swa-ml-model sibling (legacy, if project not moved)
/// 4. ./artifacts/ml_suite (fallback)
pub fn resolve_suite_dir() -> PathBuf {
    if let Ok(dir) = std::env::var("SWA_ML_SUITE_DIR") {
        return PathBuf::from(dir);
    }
    // Try candidate paths relative to current crate manifest
    let candidates = [
        // from swa/rust/inward_core -> swa/swa-ml-model/artifacts/ml_suite
        Path::new(env!("CARGO_MANIFEST_DIR")).join("../../swa-ml-model/artifacts/ml_suite"),
        Path::new(env!("CARGO_MANIFEST_DIR")).join("../swa-ml-model/artifacts/ml_suite"),
        // absolute within swa
        PathBuf::from("swa/swa-ml-model/artifacts/ml_suite"),
        PathBuf::from("swa-ml-model/artifacts/ml_suite"),
        PathBuf::from("artifacts/ml_suite"),
    ];
    for c in &candidates {
        if c.exists() {
            return c.clone();
        }
    }
    // default to new location
    PathBuf::from("swa/swa-ml-model/artifacts/ml_suite")
}

pub fn resolve_artifacts_root() -> PathBuf {
    let suite = resolve_suite_dir();
    // suite is .../artifacts/ml_suite -> root is parent
    suite.parent().map(|p| p.to_path_buf()).unwrap_or(suite)
}

pub fn check_python_artifacts() -> PythonArtifactStatus {
    let suite_dir = resolve_suite_dir();
    let root = resolve_artifacts_root();
    let baseline = root.join("ml_baseline").join("swa_ml_baseline_v1.joblib");
    let eval = root.join("ml_evaluation").join("evaluation_report.json");
    let mut models = Vec::new();
    for name in ["linear_regression", "random_forest", "neural_network"] {
        if suite_dir.join(format!("{}.joblib", name)).exists() {
            models.push(name.to_string());
        }
    }
    let suite_available = !models.is_empty();
    let baseline_available = baseline.exists();
    let evaluation_available = eval.exists();
    let message = if suite_available {
        format!("Python ML suite found at {}: {} model(s) [{}]; baseline={}, eval={}",
            suite_dir.display(), models.len(), models.join(","), baseline_available, evaluation_available)
    } else {
        format!("Python ML suite not found at {} (checked env + relative). Baseline={}, eval={}. Run python -m swa_ml_api.train_suite in swa/swa-ml-model.",
            suite_dir.display(), baseline_available, evaluation_available)
    };
    PythonArtifactStatus {
        suite_available,
        suite_models: models,
        suite_dir: suite_dir.to_string_lossy().to_string(),
        baseline_available,
        evaluation_available,
        message,
    }
}

/// Build a JSON payload that can be forwarded to Python's /predict or /recommend.
/// This is the bridge format: Rust's DB state -> 39-field feature vector -> Python.
pub fn build_bridge_payload(
    feature_json: &serde_json::Value,
    exercise_id: &str,
) -> serde_json::Value {
    serde_json::json!({
        "model": "ensemble",
        "features": feature_json,
        "exercise_id": exercise_id,
        "bridge_version": "rust_v1",
        "source": "inward_core"
    })
}
