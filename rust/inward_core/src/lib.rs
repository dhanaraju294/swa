pub mod api;
pub mod db;
pub mod engine;
pub mod error;
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

#[uniffi::export]
pub fn init_db(app_documents_dir: String) -> Result<()> {
    let db_path = std::path::Path::new(&app_documents_dir).join("inward.db");
    let db_path_str = db_path
        .to_str()
        .ok_or_else(|| CoreError::Validation("Invalid db path".to_string()))?
        .to_string();

    let engine = CoreEngine::new(db_path_str)?;
    // OnceLock::set silently no-ops if already initialized (e.g. hot reload),
    // which is fine — the path never changes for the life of the app.
    let _ = ENGINE.set(engine);
    Ok(())
}

fn engine() -> Result<Arc<CoreEngine>> {
    if let Some(e) = ENGINE.get() {
        return Ok(e.clone());
    }
    // Fallback for CLI / plain test usage before init_db: point at the same
    // env-overridable path the old free functions used.
    let path = std::env::var("INWARD_DB_PATH").unwrap_or_else(|_| "/tmp/inward_test.db".to_string());
    let e = CoreEngine::new(path)?;
    let _ = ENGINE.set(e.clone());
    Ok(e)
}

// Thin wrappers exported to JS via Uniffi. Signatures are stable so the
// checked-in generated bindings keep working unchanged.
#[uniffi::export]
pub fn save_checkin(input: CheckinInput) -> Result<Checkin> {
    engine()?.save_checkin(input)
}

#[uniffi::export]
pub fn list_checkins(from_iso: String, to_iso: String) -> Result<Vec<Checkin>> {
    engine()?.list_checkins(from_iso, to_iso)
}

#[uniffi::export]
pub fn latest_checkin() -> Result<Option<Checkin>> {
    engine()?.latest_checkin()
}

#[uniffi::export]
pub fn save_on_the_spot(input: OnTheSpotInput) -> Result<OnTheSpotEntry> {
    engine()?.save_on_the_spot(input)
}

#[uniffi::export]
pub fn list_on_the_spot(limit: u32) -> Result<Vec<OnTheSpotEntry>> {
    engine()?.list_on_the_spot(limit)
}

#[uniffi::export]
pub fn get_journal_day(journal_id: String, day: u32) -> Result<JournalDay> {
    engine()?.get_journal_day(journal_id, day)
}

#[uniffi::export]
pub fn get_journal_progress(journal_id: String) -> Result<JournalProgress> {
    engine()?.get_journal_progress(journal_id)
}

#[uniffi::export]
pub fn complete_journal_day(journal_id: String, day: u32) -> Result<JournalProgress> {
    engine()?.complete_journal_day(journal_id, day)
}

#[uniffi::export]
pub fn save_reflection(
    journal_id: String,
    day: u32,
    prompt: String,
    response: String,
) -> Result<Reflection> {
    engine()?.save_reflection(journal_id, day, prompt, response)
}

#[uniffi::export]
pub fn list_reflections(journal_id: Option<String>) -> Result<Vec<Reflection>> {
    engine()?.list_reflections(journal_id)
}

#[uniffi::export]
pub fn get_streak() -> Result<Streak> {
    engine()?.get_streak()
}

#[uniffi::export]
pub fn list_badges() -> Result<Vec<Badge>> {
    engine()?.list_badges()
}

#[uniffi::export]
pub fn get_awareness_snapshot() -> Result<Vec<AwarenessDimensionScore>> {
    engine()?.get_awareness_snapshot()
}

#[uniffi::export]
pub fn get_profile() -> Result<Profile> {
    engine()?.get_profile()
}

#[uniffi::export]
pub fn update_profile(input: ProfileInput) -> Result<Profile> {
    engine()?.update_profile(input)
}

#[uniffi::export]
pub fn get_settings() -> Result<AppSettings> {
    engine()?.get_settings()
}

#[uniffi::export]
pub fn update_settings(input: AppSettingsInput) -> Result<AppSettings> {
    engine()?.update_settings(input)
}

#[uniffi::export]
pub fn export_all_data_json() -> Result<String> {
    engine()?.export_all_data_json()
}

#[uniffi::export]
pub fn delete_all_data() -> Result<()> {
    engine()?.delete_all_data()
}
