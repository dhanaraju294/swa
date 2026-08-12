pub mod api;
pub mod db;
pub mod error;
pub mod models;
pub mod scoring;

use std::sync::OnceLock;

pub use api::CoreApi;
pub use error::{CoreError, Result};
pub use models::*;

// Re-export uniffi setup
uniffi::setup_scaffolding!();

/// Holds the DB path set by `init_db`, so every subsequent call opens the
/// *same* on-device database instead of silently falling back to a dummy path.
/// This is set exactly once, at app start, before any other API call is made.
static DB_PATH: OnceLock<String> = OnceLock::new();

// Thin wrappers exported to JS via Uniffi
#[uniffi::export]
pub fn init_db(app_documents_dir: String) -> Result<()> {
    let db_path = std::path::Path::new(&app_documents_dir).join("inward.db");
    let db_path_str = db_path
        .to_str()
        .ok_or_else(|| CoreError::Validation("Invalid db path".to_string()))?
        .to_string();

    // Actually create/migrate the DB at this path.
    let _conn = db::open_or_create(&db_path_str)?;

    // Remember the path for every subsequent call in this process.
    // OnceLock::set silently no-ops if already initialized (e.g. hot reload),
    // which is fine — the path never changes for the life of the app.
    let _ = DB_PATH.set(db_path_str);
    Ok(())
}

#[uniffi::export]
pub fn save_checkin(input: CheckinInput) -> Result<Checkin> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.save_checkin(input)
}

#[uniffi::export]
pub fn list_checkins(from_iso: String, to_iso: String) -> Result<Vec<Checkin>> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.list_checkins(&from_iso, &to_iso)
}

#[uniffi::export]
pub fn latest_checkin() -> Result<Option<Checkin>> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.latest_checkin()
}

#[uniffi::export]
pub fn save_on_the_spot(input: OnTheSpotInput) -> Result<OnTheSpotEntry> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.save_on_the_spot(input)
}

#[uniffi::export]
pub fn list_on_the_spot(limit: u32) -> Result<Vec<OnTheSpotEntry>> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.list_on_the_spot(limit)
}

#[uniffi::export]
pub fn get_journal_day(journal_id: String, day: u32) -> Result<JournalDay> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.get_journal_day(&journal_id, day)
}

#[uniffi::export]
pub fn get_journal_progress(journal_id: String) -> Result<JournalProgress> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.get_journal_progress(&journal_id)
}

#[uniffi::export]
pub fn complete_journal_day(journal_id: String, day: u32) -> Result<JournalProgress> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.complete_journal_day(&journal_id, day)
}

#[uniffi::export]
pub fn save_reflection(
    journal_id: String,
    day: u32,
    prompt: String,
    response: String,
) -> Result<Reflection> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.save_reflection(&journal_id, day, &prompt, &response)
}

#[uniffi::export]
pub fn list_reflections(journal_id: Option<String>) -> Result<Vec<Reflection>> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.list_reflections(journal_id.as_deref())
}

#[uniffi::export]
pub fn get_streak() -> Result<Streak> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.get_streak()
}

#[uniffi::export]
pub fn list_badges() -> Result<Vec<Badge>> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.list_badges()
}

#[uniffi::export]
pub fn get_awareness_snapshot() -> Result<Vec<AwarenessDimensionScore>> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.get_awareness_snapshot()
}

#[uniffi::export]
pub fn get_profile() -> Result<Profile> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.get_profile()
}

#[uniffi::export]
pub fn update_profile(input: ProfileInput) -> Result<Profile> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.update_profile(input)
}

#[uniffi::export]
pub fn get_settings() -> Result<AppSettings> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.get_settings()
}

#[uniffi::export]
pub fn update_settings(input: AppSettingsInput) -> Result<AppSettings> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.update_settings(input)
}

#[uniffi::export]
pub fn export_all_data_json() -> Result<String> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.export_all_data_json()
}

#[uniffi::export]
pub fn delete_all_data() -> Result<()> {
    let db_path = get_db_path();
    let conn = db::open_existing(&db_path)?;
    let api = CoreApi::new(conn);
    api.delete_all_data()
}

fn get_db_path() -> String {
    // Primary path: whatever init_db recorded for this process (the real,
    // sandboxed on-device path). Falls back to INWARD_DB_PATH (used by Rust
    // integration tests) and finally a temp file so a mistaken call before
    // init_db doesn't panic — it will just miss the real user data, which
    // get_db_path() callers should treat as a bug if it ever happens.
    if let Some(path) = DB_PATH.get() {
        return path.clone();
    }
    std::env::var("INWARD_DB_PATH").unwrap_or_else(|_| "/tmp/inward_test.db".to_string())
}
