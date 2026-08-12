use thiserror::Error;

#[derive(Debug, Error, uniffi::Error)]
#[uniffi(flat_error)]
pub enum CoreError {
    #[error("Database error: {0}")]
    Database(String),
    #[error("Validation error: {0}")]
    Validation(String),
    #[error("Not found: {0}")]
    NotFound(String),
    #[error("Migration error: {0}")]
    Migration(String),
    #[error("Serialization error: {0}")]
    Serialization(String),
    #[error("UUID parse error: {0}")]
    UuidParse(String),
    #[error("Time parse error: {0}")]
    TimeParse(String),
}

impl From<rusqlite::Error> for CoreError {
    fn from(e: rusqlite::Error) -> Self {
        CoreError::Database(e.to_string())
    }
}

impl From<serde_json::Error> for CoreError {
    fn from(e: serde_json::Error) -> Self {
        CoreError::Serialization(e.to_string())
    }
}

impl From<uuid::Error> for CoreError {
    fn from(e: uuid::Error) -> Self {
        CoreError::UuidParse(e.to_string())
    }
}

impl From<time::error::Parse> for CoreError {
    fn from(e: time::error::Parse) -> Self {
        CoreError::TimeParse(e.to_string())
    }
}

pub type Result<T> = std::result::Result<T, CoreError>;
