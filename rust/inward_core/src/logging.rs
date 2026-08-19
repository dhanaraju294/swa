//! Lightweight, dependency-free logging for the mobile core.
//!
//! Writes timestamped, leveled lines to stderr (visible in Xcode's console on
//! iOS and in logcat on Android) and, once a database directory is known,
//! appends the same lines to `<db_dir>/inward.log` for durable on-device
//! diagnostics.
//!
//! The logger initialises lazily on the first call, so no explicit setup is
//! required and the checked-in UniFFI bindings keep working unchanged.

use std::fs::OpenOptions;
use std::io::Write;
use std::path::PathBuf;
use std::sync::{Mutex, OnceLock};

use log::{Level, LevelFilter, Log, Metadata, Record};

struct CoreLogger {
    file_path: OnceLock<Mutex<Option<PathBuf>>>,
}

impl CoreLogger {
    fn set_file(&self, path: PathBuf) {
        let lock = self.file_path.get_or_init(|| Mutex::new(None));
        if let Ok(mut guard) = lock.lock() {
            *guard = Some(path);
        }
    }
}

impl Log for CoreLogger {
    fn enabled(&self, metadata: &Metadata<'_>) -> bool {
        metadata.level() <= Level::Debug
    }

    fn log(&self, record: &Record<'_>) {
        if !self.enabled(record.metadata()) {
            return;
        }
        let line = format!(
            "{} [{}] {}: {}",
            crate::models::now_iso(),
            record.level(),
            record.target(),
            record.args()
        );
        // stderr surfaces in Xcode's console on iOS and logcat on Android.
        eprintln!("{}", line);
        if let Some(lock) = self.file_path.get() {
            if let Ok(guard) = lock.lock() {
                if let Some(path) = guard.as_ref() {
                    if let Ok(mut f) = OpenOptions::new().create(true).append(true).open(path) {
                        let _ = writeln!(f, "{}", line);
                    }
                }
            }
        }
    }

    fn flush(&self) {}
}

static LOGGER: CoreLogger = CoreLogger {
    file_path: OnceLock::new(),
};

static INIT: OnceLock<()> = OnceLock::new();

/// Idempotently install the core logger (safe to call from any thread).
pub fn ensure_logger() {
    INIT.get_or_init(|| {
        // Only own the level if we actually installed the logger; otherwise a
        // host-provided logger keeps its own filtering.
        if log::set_logger(&LOGGER).is_ok() {
            log::set_max_level(LevelFilter::Debug);
        }
    });
}

/// Point the on-device log file at `path` (usually the db directory +
/// `inward.log`).
pub fn set_log_file(path: impl Into<PathBuf>) {
    ensure_logger();
    LOGGER.set_file(path.into());
}

pub fn info(target: &str, msg: &str) {
    ensure_logger();
    log::info!(target: target, "{}", msg);
}

pub fn debug(target: &str, msg: &str) {
    ensure_logger();
    log::debug!(target: target, "{}", msg);
}

pub fn error(target: &str, msg: &str) {
    ensure_logger();
    log::error!(target: target, "{}", msg);
}
