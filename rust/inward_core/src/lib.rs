pub mod api;
pub mod content;
pub mod db;
pub mod engine;
pub mod error;
pub mod logging;
pub mod ml;
pub mod models;
pub mod scoring;

use std::sync::{Arc, OnceLock};

pub use api::CoreApi;
pub use engine::CoreEngine;
pub use error::{CoreError, Result};
pub use models::*;

// Re-export uniffi setup
uniffi::setup_scaffolding!();

/// Process-wide singleton engine. The database is opened exactly once (when
/// `init_db` runs at app startup) and every exported function below delegates
/// to it, so no FFI call ever opens a fresh connection.
static ENGINE: OnceLock<Arc<CoreEngine>> = OnceLock::new();

/// Wrap every exported API call so entry and outcome are logged. Personal
/// values are summarised (lengths / optional presence) rather than dumped raw.
fn logged_call<T>(name: &str, args: &str, f: impl FnOnce() -> Result<T>) -> Result<T> {
    logging::info("inward_core", &format!(">> {}({})", name, args));
    let out = f();
    match &out {
        Ok(_) => logging::info("inward_core", &format!("<< {} -> ok", name)),
        Err(e) => logging::error("inward_core", &format!("<< {} -> {}", name, e)),
    }
    out
}

#[uniffi::export]
pub fn init_db(app_documents_dir: String) -> Result<()> {
    logged_call("init_db", &format!("documents_dir={}", app_documents_dir), || {
        let db_path = std::path::Path::new(&app_documents_dir).join("inward.db");
        let db_path_str = db_path
            .to_str()
            .ok_or_else(|| CoreError::Validation("Invalid db path".to_string()))?
            .to_string();

        logging::set_log_file(std::path::Path::new(&app_documents_dir).join("inward.log"));
        let engine = CoreEngine::new(db_path_str)?;
        // OnceLock::set silently no-ops if already initialized (e.g. hot reload),
        // which is fine — the path never changes for the life of the app.
        let _ = ENGINE.set(engine);
        Ok(())
    })
}

fn engine() -> Result<Arc<CoreEngine>> {
    if let Some(e) = ENGINE.get() {
        return Ok(e.clone());
    }
    // Fallback for CLI / plain test usage before init_db: point at the same
    // env-overridable path the old free functions used.
    let path = std::env::var("INWARD_DB_PATH").unwrap_or_else(|_| "/tmp/inward_test.db".to_string());
    logging::set_log_file("/tmp/inward.log");
    logging::info("inward_core", &format!("engine fallback using db {}", path));
    let e = CoreEngine::new(path)?;
    let _ = ENGINE.set(e.clone());
    Ok(e)
}

// Thin wrappers exported to JS via Uniffi. Signatures are stable so the
// checked-in generated bindings keep working unchanged.
#[uniffi::export]
pub fn save_checkin(input: CheckinInput) -> Result<Checkin> {
    logged_call(
        "save_checkin",
        &format!(
            "mood={} energy={} stress={} sleep={} confidence={} one_word={}",
            input.mood,
            input.energy,
            input.stress,
            input.sleep,
            input.confidence,
            input.one_word.is_some()
        ),
        || engine()?.save_checkin(input),
    )
}

#[uniffi::export]
pub fn list_checkins(from_iso: String, to_iso: String) -> Result<Vec<Checkin>> {
    logged_call(
        "list_checkins",
        &format!("from={} to={}", from_iso, to_iso),
        || engine()?.list_checkins(from_iso, to_iso),
    )
}

#[uniffi::export]
pub fn latest_checkin() -> Result<Option<Checkin>> {
    logged_call("latest_checkin", "", || engine()?.latest_checkin())
}

#[uniffi::export]
pub fn save_on_the_spot(input: OnTheSpotInput) -> Result<OnTheSpotEntry> {
    logged_call(
        "save_on_the_spot",
        &format!(
            "feeling={} intensity={} note={}",
            input.feeling,
            input.intensity,
            input.note.is_some()
        ),
        || engine()?.save_on_the_spot(input),
    )
}

#[uniffi::export]
pub fn list_on_the_spot(limit: u32) -> Result<Vec<OnTheSpotEntry>> {
    logged_call("list_on_the_spot", &format!("limit={}", limit), || {
        engine()?.list_on_the_spot(limit)
    })
}

#[uniffi::export]
pub fn get_journal_day(journal_id: String, day: u32) -> Result<JournalDay> {
    logged_call(
        "get_journal_day",
        &format!("journal_id={} day={}", journal_id, day),
        || engine()?.get_journal_day(journal_id, day),
    )
}

#[uniffi::export]
pub fn get_journal_progress(journal_id: String) -> Result<JournalProgress> {
    logged_call("get_journal_progress", &format!("journal_id={}", journal_id), || {
        engine()?.get_journal_progress(journal_id)
    })
}

#[uniffi::export]
pub fn complete_journal_day(journal_id: String, day: u32) -> Result<JournalProgress> {
    logged_call(
        "complete_journal_day",
        &format!("journal_id={} day={}", journal_id, day),
        || engine()?.complete_journal_day(journal_id, day),
    )
}

#[uniffi::export]
pub fn save_reflection(
    journal_id: String,
    day: u32,
    prompt: String,
    response: String,
) -> Result<Reflection> {
    logged_call(
        "save_reflection",
        &format!(
            "journal_id={} day={} prompt_len={} response_len={}",
            journal_id,
            day,
            prompt.chars().count(),
            response.chars().count()
        ),
        || engine()?.save_reflection(journal_id, day, prompt, response),
    )
}

#[uniffi::export]
pub fn list_reflections(journal_id: Option<String>) -> Result<Vec<Reflection>> {
    logged_call(
        "list_reflections",
        &format!("journal_id={:?}", journal_id),
        || engine()?.list_reflections(journal_id),
    )
}

#[uniffi::export]
pub fn get_streak() -> Result<Streak> {
    logged_call("get_streak", "", || engine()?.get_streak())
}

#[uniffi::export]
pub fn list_badges() -> Result<Vec<Badge>> {
    logged_call("list_badges", "", || engine()?.list_badges())
}

#[uniffi::export]
pub fn get_awareness_snapshot() -> Result<Vec<AwarenessDimensionScore>> {
    logged_call("get_awareness_snapshot", "", || {
        engine()?.get_awareness_snapshot()
    })
}

#[uniffi::export]
pub fn get_profile() -> Result<Profile> {
    logged_call("get_profile", "", || engine()?.get_profile())
}

#[uniffi::export]
pub fn update_profile(input: ProfileInput) -> Result<Profile> {
    logged_call(
        "update_profile",
        &format!(
            "display_name={} app_lock_enabled={}",
            input.display_name.is_some(),
            input.app_lock_enabled
        ),
        || engine()?.update_profile(input),
    )
}

#[uniffi::export]
pub fn get_settings() -> Result<AppSettings> {
    logged_call("get_settings", "", || engine()?.get_settings())
}

#[uniffi::export]
pub fn update_settings(input: AppSettingsInput) -> Result<AppSettings> {
    logged_call(
        "update_settings",
        &format!(
            "theme={} reminder_time={} export_format_pref={}",
            input.theme,
            input.reminder_time.is_some(),
            input.export_format_pref
        ),
        || engine()?.update_settings(input),
    )
}

#[uniffi::export]
pub fn export_all_data_json() -> Result<String> {
    logged_call("export_all_data_json", "", || engine()?.export_all_data_json())
}

#[uniffi::export]
pub fn delete_all_data() -> Result<()> {
    logged_call("delete_all_data", "", || engine()?.delete_all_data())
}

// ── ML integration (Rust ↔ Python hybrid) ────────────────────────────────
#[uniffi::export]
pub fn create_feature_snapshot() -> Result<ml::features::FeatureSnapshot> {
    logged_call("create_feature_snapshot", "", || engine()?.create_feature_snapshot())
}

#[uniffi::export]
pub fn list_feature_snapshots(limit: u32) -> Result<Vec<ml::features::FeatureSnapshot>> {
    logged_call("list_feature_snapshots", &format!("limit={}", limit), || {
        engine()?.list_feature_snapshots(limit)
    })
}

#[uniffi::export]
pub fn ml_predict(features_json: String) -> Result<ml::features::MlPrediction> {
    logged_call("ml_predict", &format!("json_len={}", features_json.len()), || {
        engine()?.ml_predict(features_json)
    })
}

#[uniffi::export]
pub fn ml_health() -> Result<ml::features::MlHealthStatus> {
    logged_call("ml_health", "", || engine()?.ml_health())
}

#[uniffi::export]
pub fn list_exercises() -> Result<Vec<ml::exercise_store::Exercise>> {
    logged_call("list_exercises", "", || engine()?.list_exercises())
}

#[uniffi::export]
pub fn save_exercise(input: ml::exercise_store::ExerciseInput) -> Result<ml::exercise_store::Exercise> {
    logged_call(
        "save_exercise",
        &format!("id={} difficulty={}", input.id, input.difficulty),
        || engine()?.save_exercise(input),
    )
}

#[uniffi::export]
pub fn record_exercise_attempt(
    input: ml::exercise_store::ExerciseAttemptInput,
) -> Result<ml::exercise_store::ExerciseAttempt> {
    logged_call(
        "record_exercise_attempt",
        &format!("exercise_id={} status={}", input.exercise_id, input.status),
        || engine()?.record_exercise_attempt(input),
    )
}

#[uniffi::export]
pub fn list_exercise_attempts(
    exercise_id: Option<String>,
    limit: u32,
) -> Result<Vec<ml::exercise_store::ExerciseAttempt>> {
    logged_call(
        "list_exercise_attempts",
        &format!("exercise_id={:?} limit={}", exercise_id, limit),
        || engine()?.list_exercise_attempts(exercise_id, limit),
    )
}

#[uniffi::export]
pub fn get_recommendations(request: ml::recommend::RecommendationRequest) -> Result<Vec<ml::recommend::Recommendation>> {
    logged_call(
        "get_recommendations",
        &format!("limit={} dim={:?} diff={:?}", request.limit, request.preferred_dimension, request.preferred_difficulty),
        || engine()?.get_recommendations(request),
    )
}

#[uniffi::export]
pub fn list_recommendations(limit: u32) -> Result<Vec<ml::recommend::Recommendation>> {
    logged_call("list_recommendations", &format!("limit={}", limit), || {
        engine()?.list_recommendations(limit)
    })
}

#[uniffi::export]
pub fn record_recommendation_outcome(
    recommendation_id: String,
    outcome: String,
    completed: bool,
    user_rating: Option<u32>,
) -> Result<()> {
    logged_call(
        "record_recommendation_outcome",
        &format!("rec_id={} outcome={} completed={}", recommendation_id, outcome, completed),
        || engine()?.record_recommendation_outcome(recommendation_id, outcome, completed, user_rating),
    )
}

#[uniffi::export]
pub fn register_model_version(
    model_name: String,
    version: String,
    algorithm: String,
    metrics_json: String,
) -> Result<ml::recommend::ModelVersion> {
    logged_call(
        "register_model_version",
        &format!("model={} version={}", model_name, version),
        || engine()?.register_model_version(model_name, version, algorithm, metrics_json),
    )
}

#[uniffi::export]
pub fn list_model_versions() -> Result<Vec<ml::recommend::ModelVersion>> {
    logged_call("list_model_versions", "", || engine()?.list_model_versions())
}

#[uniffi::export]
pub fn get_ml_model_info() -> Result<String> {
    logged_call("get_ml_model_info", "", || engine()?.get_ml_model_info())
}

#[uniffi::export]
pub fn build_full_feature_vector(
    exercise_id: String,
    area: String,
    skill: String,
) -> Result<String> {
    logged_call(
        "build_full_feature_vector",
        &format!("exercise_id={} area={} skill={}", exercise_id, area, skill),
        || engine()?.build_full_feature_vector(exercise_id, area, skill),
    )
}

#[uniffi::export]
pub fn check_python_artifacts() -> Result<String> {
    logged_call("check_python_artifacts", "", || engine()?.check_python_artifacts())
}

#[uniffi::export]
pub fn get_python_bridge_payload(
    exercise_id: String,
    area: String,
    skill: String,
) -> Result<String> {
    logged_call(
        "get_python_bridge_payload",
        &format!("exercise_id={} area={} skill={}", exercise_id, area, skill),
        || engine()?.get_python_bridge_payload(exercise_id, area, skill),
    )
}

#[uniffi::export]
pub fn export_in_app_training_data_json() -> Result<String> {
    logged_call("export_in_app_training_data_json", "", || {
        engine()?.export_in_app_training_data_json()
    })
}

#[uniffi::export]
pub fn export_in_app_training_data_csv() -> Result<String> {
    logged_call("export_in_app_training_data_csv", "", || {
        engine()?.export_in_app_training_data_csv()
    })
}

#[uniffi::export]
pub fn count_in_app_training_rows() -> Result<u32> {
    logged_call("count_in_app_training_rows", "", || {
        engine()?.count_in_app_training_rows()
    })
}
