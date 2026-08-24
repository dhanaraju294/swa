//! Stateful `CoreEngine` — the long-lived, process-wide Rust core.
//!
//! The database connection is opened exactly once (when the engine is created
//! during app startup) and kept inside an `Arc<Mutex<Connection>>`. Every FFI
//! call reuses that single connection instead of opening/closing a fresh
//! handle per call, which eliminates file-lock churn, preserves the SQLite WAL
//! page cache, and avoids `SQLITE_BUSY` races.
//!
//! The struct is exported to JS as a UniFFI `Object` (`#[uniffi::Object]`),
//! so bindings generators can hand the JS side a stable engine instance.
//! The thin free-function wrappers in `lib.rs` also route through a process-wide
//! singleton of this engine so the checked-in JS bindings keep working verbatim.

use std::sync::{Arc, Mutex};

use rusqlite::Connection;

use crate::api::CoreApi;
use crate::db;
use crate::error::{CoreError, Result};
use crate::models::*;

#[derive(uniffi::Object)]
pub struct CoreEngine {
    conn: Arc<Mutex<Connection>>,
}

impl CoreEngine {
    fn with_conn<T>(
        &self,
        f: impl FnOnce(&Connection) -> Result<T>,
    ) -> Result<T> {
        let conn = self.conn.lock().map_err(|_| CoreError::LockError)?;
        f(&conn)
    }
}

#[uniffi::export]
impl CoreEngine {
    /// Open (creating + migrating if needed) the SQLite database at `db_path`
    /// and return a stateful engine that owns the connection for the process.
    #[uniffi::constructor]
    pub fn new(db_path: String) -> Result<Arc<Self>> {
        let conn = db::open_or_create(&db_path)?;
        Ok(Arc::new(Self {
            conn: Arc::new(Mutex::new(conn)),
        }))
    }

    pub fn save_checkin(&self, input: CheckinInput) -> Result<Checkin> {
        self.with_conn(|conn| CoreApi::save_checkin(conn, input))
    }

    pub fn list_checkins(&self, from_iso: String, to_iso: String) -> Result<Vec<Checkin>> {
        self.with_conn(|conn| CoreApi::list_checkins(conn, &from_iso, &to_iso))
    }

    pub fn latest_checkin(&self) -> Result<Option<Checkin>> {
        self.with_conn(CoreApi::latest_checkin)
    }

    pub fn save_on_the_spot(&self, input: OnTheSpotInput) -> Result<OnTheSpotEntry> {
        self.with_conn(|conn| CoreApi::save_on_the_spot(conn, input))
    }

    pub fn list_on_the_spot(&self, limit: u32) -> Result<Vec<OnTheSpotEntry>> {
        self.with_conn(|conn| CoreApi::list_on_the_spot(conn, limit))
    }

    pub fn save_spot_checkin(&self, input: SpotCheckinInput) -> Result<SpotCheckin> {
        self.with_conn(|conn| CoreApi::save_spot_checkin(conn, input))
    }

    pub fn latest_spot_checkin(&self) -> Result<Option<SpotCheckin>> {
        self.with_conn(CoreApi::latest_spot_checkin)
    }

    pub fn list_spot_checkins(&self, limit: u32) -> Result<Vec<SpotCheckin>> {
        self.with_conn(|conn| CoreApi::list_spot_checkins(conn, limit))
    }

    pub fn get_journal_day(&self, journal_id: String, day: u32) -> Result<JournalDay> {
        self.with_conn(|conn| CoreApi::get_journal_day(conn, &journal_id, day))
    }

    pub fn get_journal_progress(&self, journal_id: String) -> Result<JournalProgress> {
        self.with_conn(|conn| CoreApi::get_journal_progress(conn, &journal_id))
    }

    pub fn complete_journal_day(&self, journal_id: String, day: u32) -> Result<JournalProgress> {
        self.with_conn(|conn| CoreApi::complete_journal_day(conn, &journal_id, day))
    }

    pub fn save_reflection(
        &self,
        journal_id: String,
        day: u32,
        prompt: String,
        response: String,
    ) -> Result<Reflection> {
        self.with_conn(|conn| {
            CoreApi::save_reflection(conn, &journal_id, day, &prompt, &response)
        })
    }

    pub fn list_reflections(&self, journal_id: Option<String>) -> Result<Vec<Reflection>> {
        self.with_conn(|conn| CoreApi::list_reflections(conn, journal_id.as_deref()))
    }

    pub fn get_streak(&self) -> Result<Streak> {
        self.with_conn(CoreApi::get_streak)
    }

    pub fn list_badges(&self) -> Result<Vec<Badge>> {
        self.with_conn(CoreApi::list_badges)
    }

    pub fn get_awareness_snapshot(&self) -> Result<Vec<AwarenessDimensionScore>> {
        self.with_conn(CoreApi::get_awareness_snapshot)
    }

    pub fn get_profile(&self) -> Result<Profile> {
        self.with_conn(CoreApi::get_profile)
    }

    pub fn update_profile(&self, input: ProfileInput) -> Result<Profile> {
        self.with_conn(|conn| CoreApi::update_profile(conn, input))
    }

    pub fn get_settings(&self) -> Result<AppSettings> {
        self.with_conn(CoreApi::get_settings)
    }

    pub fn update_settings(&self, input: AppSettingsInput) -> Result<AppSettings> {
        self.with_conn(|conn| CoreApi::update_settings(conn, input))
    }

    pub fn export_all_data_json(&self) -> Result<String> {
        self.with_conn(CoreApi::export_all_data_json)
    }

    pub fn delete_all_data(&self) -> Result<()> {
        self.with_conn(CoreApi::delete_all_data)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn engine_for_test() -> Arc<CoreEngine> {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("engine.db").to_str().unwrap().to_string();
        CoreEngine::new(path).unwrap()
    }

    #[test]
    fn engine_reuses_connection_across_calls() {
        let engine = engine_for_test();
        let input = CheckinInput {
            mood: 4,
            energy: 70,
            stress: 30,
            sleep: 4,
            confidence: 65,
            one_word: Some("steady".into()),
        };
        let saved = engine.save_checkin(input).unwrap();
        let list = engine.list_checkins("0000-01-01".into(), "9999-12-31".into()).unwrap();
        assert_eq!(list.len(), 1);
        assert_eq!(list[0].id, saved.id);
        let streak = engine.get_streak().unwrap();
        // A check-in counts as showing up today, so the streak starts at 1.
        assert_eq!(streak.current_streak, 1);
    }

    #[test]
    fn engine_profile_settings_round_trip() {
        let engine = engine_for_test();
        engine
            .update_profile(ProfileInput {
                display_name: Some("Rust".into()),
                app_lock_enabled: true,
            })
            .unwrap();
        let profile = engine.get_profile().unwrap();
        assert_eq!(profile.display_name.as_deref(), Some("Rust"));
        engine
            .update_settings(AppSettingsInput {
                theme: "dark".into(),
                reminder_time: Some("08:30".into()),
                export_format_pref: "json".into(),
            })
            .unwrap();
        let settings = engine.get_settings().unwrap();
        assert_eq!(settings.theme, "dark");
    }

    #[test]
    fn engine_journal_progress() {
        let engine = engine_for_test();
        let progress = engine.complete_journal_day("seven-day".into(), 1).unwrap();
        assert_eq!(progress.current_day, 2);
        assert!(progress.completed_days.contains(&1));
    }
}
