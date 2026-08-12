use serde::{Deserialize, Serialize};
use time::OffsetDateTime;
use uuid::Uuid;

pub fn now_iso() -> String {
    OffsetDateTime::now_utc()
        .format(&time::format_description::well_known::Iso8601::DEFAULT)
        .unwrap_or_else(|_| Uuid::new_v4().to_string())
}

pub fn parse_iso(s: &str) -> Result<OffsetDateTime, time::error::Parse> {
    OffsetDateTime::parse(s, &time::format_description::well_known::Iso8601::DEFAULT)
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct CheckinInput {
    pub mood: u32,
    pub energy: u32,
    pub stress: u32,
    pub sleep: u32,
    pub confidence: u32,
    pub one_word: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct Checkin {
    pub id: String,
    pub created_at: String,
    pub mood: u32,
    pub energy: u32,
    pub stress: u32,
    pub sleep: u32,
    pub confidence: u32,
    pub one_word: Option<String>,
}

impl Checkin {
    pub fn new(input: CheckinInput) -> Self {
        let now = now_iso();
        Checkin {
            id: Uuid::new_v4().to_string(),
            created_at: now,
            mood: input.mood,
            energy: input.energy,
            stress: input.stress,
            sleep: input.sleep,
            confidence: input.confidence,
            one_word: input.one_word,
        }
    }

    pub fn validate(&self) -> Result<(), super::error::CoreError> {
        if !(1..=5).contains(&self.mood) {
            return Err(super::error::CoreError::Validation(format!(
                "mood must be 1-5, got {}",
                self.mood
            )));
        }
        for (field, val) in [
            ("energy", self.energy),
            ("stress", self.stress),
            ("confidence", self.confidence),
        ] {
            if !(0..=100).contains(&val) {
                return Err(super::error::CoreError::Validation(format!(
                    "{} must be 0-100, got {}",
                    field, val
                )));
            }
        }
        if !(0..=5).contains(&self.sleep) {
            return Err(super::error::CoreError::Validation(format!(
                "sleep must be 0-5, got {}",
                self.sleep
            )));
        }
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct OnTheSpotInput {
    pub feeling: String,
    pub intensity: u32,
    pub note: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct OnTheSpotEntry {
    pub id: String,
    pub created_at: String,
    pub feeling: String,
    pub intensity: u32,
    pub note: Option<String>,
}

impl OnTheSpotEntry {
    pub fn new(input: OnTheSpotInput) -> Self {
        OnTheSpotEntry {
            id: Uuid::new_v4().to_string(),
            created_at: now_iso(),
            feeling: input.feeling,
            intensity: input.intensity,
            note: input.note,
        }
    }

    pub fn validate(&self) -> Result<(), super::error::CoreError> {
        if self.feeling.trim().is_empty() {
            return Err(super::error::CoreError::Validation(
                "feeling must not be empty".to_string(),
            ));
        }
        if !(1..=5).contains(&self.intensity) {
            return Err(super::error::CoreError::Validation(format!(
                "intensity must be 1-5, got {}",
                self.intensity
            )));
        }
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct JournalDay {
    pub journal_id: String,
    pub day_number: u32,
    pub title: String,
    pub subtitle: Option<String>,
    pub content_json: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct JournalProgress {
    pub journal_id: String,
    pub current_day: u32,
    pub completed_days: Vec<u32>,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct Reflection {
    pub id: String,
    pub journal_id: String,
    pub day_number: u32,
    pub prompt: String,
    pub response: String,
    pub created_at: String,
}

impl Reflection {
    pub fn new(journal_id: String, day_number: u32, prompt: String, response: String) -> Self {
        Reflection {
            id: Uuid::new_v4().to_string(),
            journal_id,
            day_number,
            prompt,
            response,
            created_at: now_iso(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct Streak {
    pub current_streak: u32,
    pub longest_streak: u32,
    pub last_active_date: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct Badge {
    pub key: String,
    pub earned_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct AwarenessDimensionScore {
    pub dimension: String,
    pub score: u32,
    pub week_of: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct ProfileInput {
    pub display_name: Option<String>,
    pub app_lock_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct Profile {
    pub display_name: Option<String>,
    pub app_lock_enabled: bool,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct AppSettingsInput {
    pub theme: String,
    pub reminder_time: Option<String>,
    pub export_format_pref: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct AppSettings {
    pub theme: String,
    pub reminder_time: Option<String>,
    pub export_format_pref: String,
}

pub mod models {
    pub use super::*;
}
