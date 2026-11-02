//! SWA Focus: deterministic rules, authoritative on-device monotonic session clock,
//! and a versioned JSON boundary shared by native UniFFI and the WASM preview.
use rand::{seq::SliceRandom, Rng, SeedableRng};
use rand_chacha::ChaCha8Rng;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
#[cfg(not(target_arch = "wasm32"))]
use std::time::Instant;

const API_VERSION: u8 = 1;
const MAX_COMMAND_BYTES: usize = 4096;
#[cfg(not(target_arch = "wasm32"))]
uniffi::setup_scaffolding!();

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Game {
    Stroop,
    Schulte,
    Go,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Level {
    pub id: u8,
    pub game: Game,
    pub number: u8,
    pub title: String,
    pub skill: String,
    pub duration_ms: u64,
    pub stimulus_ms: u64,
    pub gap_ms: u64,
    pub congruent_percent: Option<u8>,
    pub grid_size: Option<u8>,
    pub order: Option<String>,
    pub target_percent: Option<u8>,
    pub description: String,
    pub rule: String,
    pub goal_accuracy: u8,
}
pub fn levels() -> Vec<Level> {
    serde_json::from_str(include_str!("../../../levels.json"))
        .expect("Bundled level catalogue must be valid")
}

#[derive(Debug, Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase", deny_unknown_fields)]
enum Command {
    Levels {},
    Interrupt {},
    Start {
        #[serde(rename = "levelId")]
        level_id: u8,
        #[serde(default)]
        practice: bool,
        seed: Option<u64>,
    },
    Poll {
        #[serde(rename = "sessionId")]
        session_id: String,
    },
    Answer {
        #[serde(rename = "sessionId")]
        session_id: String,
        #[serde(rename = "trialId")]
        trial_id: u32,
        choice: i32,
    },
    Pause {
        #[serde(rename = "sessionId")]
        session_id: String,
    },
    Resume {
        #[serde(rename = "sessionId")]
        session_id: String,
    },
    Abandon {
        #[serde(rename = "sessionId")]
        session_id: String,
    },
}
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum Phase {
    Active,
    Paused,
    Completed,
    Abandoned,
}
#[derive(Debug, Clone, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Counters {
    pub presented: u32,
    pub correct: u32,
    pub incorrect: u32,
    pub missed: u32,
    pub targets: u32,
    pub non_targets: u32,
    pub hits: u32,
    pub false_alarms: u32,
    pub withheld: u32,
}
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Metrics {
    pub score: u32,
    pub accuracy: f64,
    pub hit_rate: Option<f64>,
    pub false_alarm_rate: Option<f64>,
    pub average_response_ms: Option<f64>,
}
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stimulus {
    pub kind: Game,
    pub word: Option<u8>,
    pub ink: Option<u8>,
    pub letter: Option<String>,
    pub visible: bool,
    pub responded: bool,
    pub remaining_ms: u64,
}
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResultRecord {
    pub started_at_ms: u64,
    pub ended_at_ms: u64,
    pub session_id: String,
    pub game: Game,
    pub game_version: u8,
    pub level_id: u8,
    pub is_practice: bool,
    pub duration_ms: u64,
    pub completion_status: Phase,
    pub counters: Counters,
    pub metrics: Metrics,
}
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Snapshot {
    pub started_at_ms: u64,
    pub session_id: String,
    pub phase: Phase,
    pub level_id: u8,
    pub game: Game,
    pub is_practice: bool,
    pub elapsed_ms: u64,
    pub remaining_ms: Option<u64>,
    pub trial_id: u32,
    pub stimulus: Option<Stimulus>,
    pub grid: Option<Vec<u8>>,
    pub found: Vec<u8>,
    pub next_number: Option<u8>,
    pub sequence: Option<Vec<u8>>,
    pub counters: Counters,
    pub metrics: Metrics,
    pub feedback: Option<Feedback>,
    pub result: Option<ResultRecord>,
}
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Feedback {
    pub id: u32,
    pub positive: bool,
    pub message: String,
}
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct Response {
    api_version: u8,
    ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    snapshot: Option<Snapshot>,
    #[serde(skip_serializing_if = "Option::is_none")]
    levels: Option<Vec<Level>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<CoreError>,
}
#[derive(Debug, Clone, Serialize)]
struct CoreError {
    code: String,
    message: String,
}
fn error(code: &str, msg: &str) -> CoreError {
    CoreError {
        code: code.to_string(),
        message: msg.to_string(),
    }
}
fn ratio(a: u32, b: u32) -> f64 {
    if b == 0 {
        0.0
    } else {
        a as f64 / b as f64
    }
}
fn percent(a: u32, b: u32) -> f64 {
    (ratio(a, b) * 1000.0).round() / 10.0
}
fn metrics(game: Game, c: &Counters, responses: &[u64]) -> Metrics {
    let avg = if responses.is_empty() {
        None
    } else {
        Some(responses.iter().sum::<u64>() as f64 / responses.len() as f64)
    };
    match game {
        Game::Go => {
            let good = c.hits + c.withheld;
            let total = c.hits + c.missed + c.false_alarms + c.withheld;
            Metrics {
                score: (good as f64 * 100.0 * ratio(good, total)).round() as u32,
                accuracy: percent(good, total),
                hit_rate: Some(percent(c.hits, c.targets)),
                false_alarm_rate: Some(percent(c.false_alarms, c.non_targets)),
                average_response_ms: avg,
            }
        }
        _ => {
            let attempted = c.correct + c.incorrect;
            Metrics {
                score: if game == Game::Schulte {
                    (10000.0 * ratio(c.correct, attempted)).round() as u32
                } else {
                    (c.correct as f64 * 100.0 * ratio(c.correct, attempted)).round() as u32
                },
                accuracy: percent(c.correct, attempted),
                hit_rate: None,
                false_alarm_rate: None,
                average_response_ms: avg,
            }
        }
    }
}
fn wall_ms() -> u64 {
    #[cfg(not(target_arch = "wasm32"))]
    {
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis()
            .min(u64::MAX as u128) as u64
    }
    #[cfg(target_arch = "wasm32")]
    {
        let p = web_sys::window()
            .and_then(|w| w.performance())
            .expect("Browser clock unavailable");
        (p.time_origin() + p.now()) as u64
    }
}
fn random_seed() -> u64 {
    let mut bytes = [0u8; 8];
    getrandom::getrandom(&mut bytes).expect("OS entropy unavailable");
    u64::from_le_bytes(bytes)
}
fn session_id() -> String {
    let mut bytes = [0u8; 16];
    getrandom::getrandom(&mut bytes).expect("OS entropy unavailable");
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}
fn number_sequence(size: u8, order: &str) -> Vec<u8> {
    let n = size * size;
    match order {
        "descending" => (1..=n).rev().collect(),
        "oddsFirst" => (1..=n)
            .filter(|n| n % 2 == 1)
            .chain((1..=n).filter(|n| n % 2 == 0))
            .collect(),
        "outsideIn" => {
            let mut a = Vec::new();
            let (mut lo, mut hi) = (1, n);
            while lo <= hi {
                a.push(lo);
                if hi != lo {
                    a.push(hi);
                }
                lo += 1;
                hi -= 1;
            }
            a
        }
        _ => (1..=n).collect(),
    }
}
#[derive(Debug, Clone)]
struct Trial {
    word: Option<u8>,
    ink: Option<u8>,
    letter: Option<String>,
    start: u64,
    deadline: u64,
    responded: bool,
    finalized: bool,
}
struct Session {
    started_at: u64,
    ended_at: Option<u64>,
    id: String,
    level: Level,
    practice: bool,
    phase: Phase,
    elapsed: u64,
    last_clock: u64,
    rng: ChaCha8Rng,
    trial: Option<Trial>,
    trial_id: u32,
    next_at: Option<u64>,
    grid: Option<Vec<u8>>,
    sequence: Vec<u8>,
    found: Vec<u8>,
    go_bag: Vec<String>,
    counters: Counters,
    responses: Vec<u64>,
    feedback: Option<Feedback>,
    feedback_id: u32,
}
impl Session {
    fn new(level: Level, practice: bool, seed: u64, now: u64) -> Self {
        let mut s = Self {
            started_at: wall_ms(),
            ended_at: None,
            id: session_id(),
            level,
            practice,
            phase: Phase::Active,
            elapsed: 0,
            last_clock: now,
            rng: ChaCha8Rng::seed_from_u64(seed),
            trial: None,
            trial_id: 0,
            next_at: None,
            grid: None,
            sequence: vec![],
            found: vec![],
            go_bag: vec![],
            counters: Counters::default(),
            responses: vec![],
            feedback: None,
            feedback_id: 0,
        };
        if s.level.game == Game::Schulte {
            let size = s.level.grid_size.expect("Schulte grid");
            let mut grid = (1..=size * size).collect::<Vec<_>>();
            grid.shuffle(&mut s.rng);
            s.grid = Some(grid);
            s.sequence = number_sequence(size, s.level.order.as_deref().unwrap_or("ascending"));
            s.trial_id = 1;
        } else {
            s.new_trial();
        }
        s
    }
    fn complete(&mut self) {
        self.phase = Phase::Completed;
        self.ended_at = Some(wall_ms());
    }
    fn feedback(&mut self, positive: bool, message: &str) {
        self.feedback_id += 1;
        self.feedback = Some(Feedback {
            id: self.feedback_id,
            positive,
            message: message.to_string(),
        });
    }
    fn new_trial(&mut self) {
        self.trial_id += 1;
        self.next_at = None;
        let (mut word, mut ink, mut letter) = (None, None, None);
        if self.level.game == Game::Stroop {
            let c = self.rng.gen_range(0..4);
            ink = Some(c);
            word = Some(
                if self.rng.gen_range(0..100) < self.level.congruent_percent.unwrap_or(25) {
                    c
                } else {
                    (c + self.rng.gen_range(1..4)) % 4
                },
            );
        } else if self.practice {
            letter = Some(
                if self.counters.presented == 1 {
                    "A"
                } else {
                    "X"
                }
                .to_string(),
            );
        } else {
            if self.go_bag.is_empty() {
                let targets = self.level.target_percent.unwrap_or(50) as usize / 5;
                self.go_bag = (0..20)
                    .map(|i| {
                        if i < targets {
                            "X".into()
                        } else {
                            ["A", "B", "K", "O"][self.rng.gen_range(0..4)].into()
                        }
                    })
                    .collect();
                self.go_bag.shuffle(&mut self.rng);
            }
            letter = self.go_bag.pop();
        }
        let ms = if self.practice {
            1800
        } else {
            self.level.stimulus_ms
        };
        if self.level.game == Game::Go {
            if letter.as_deref() == Some("X") {
                self.counters.targets += 1;
            } else {
                self.counters.non_targets += 1;
            }
        }
        self.counters.presented += 1;
        self.trial = Some(Trial {
            word,
            ink,
            letter,
            start: self.elapsed,
            deadline: self.elapsed + ms,
            responded: false,
            finalized: false,
        });
    }
    fn finalize_trial(&mut self, show_feedback: bool) {
        let Some(t) = self.trial.as_mut() else {
            return;
        };
        if t.finalized {
            return;
        }
        t.finalized = true;
        let (answered, is_target, ink) = (t.responded, t.letter.as_deref() == Some("X"), t.ink);
        if !answered {
            if self.level.game == Game::Go {
                if is_target {
                    self.counters.missed += 1;
                    if show_feedback {
                        self.feedback(false, "X passed. A new chance is coming.");
                    }
                } else {
                    self.counters.withheld += 1;
                    if show_feedback {
                        self.feedback(true, "A good pause.");
                    }
                }
            } else {
                self.counters.missed += 1;
                if show_feedback {
                    self.feedback(
                        false,
                        &format!("The ink was {}.", colour_name(ink.unwrap_or(0))),
                    );
                }
            }
        }
    }
    fn advance(&mut self, now: u64) {
        let delta = now.saturating_sub(self.last_clock);
        self.last_clock = now;
        if self.phase != Phase::Active {
            return;
        }
        self.elapsed = self.elapsed.saturating_add(delta);
        // A delayed/background callback must not manufacture unseen trials.
        // Only the currently displayed trial can be finalized; the next starts now.
        if !self.practice && self.level.duration_ms > 0 && self.elapsed >= self.level.duration_ms {
            self.elapsed = self.level.duration_ms;
            self.finalize_trial(false);
            self.complete();
            return;
        }
        if self.level.game == Game::Schulte {
            return;
        }
        if let Some(t) = self.trial.as_ref() {
            if !t.finalized && self.elapsed >= t.deadline {
                self.finalize_trial(true);
                self.next_at = Some(
                    self.elapsed
                        + if self.practice {
                            500
                        } else {
                            self.level.gap_ms
                        },
                );
            }
        }
        if self.next_at.is_some_and(|t| self.elapsed >= t) {
            if self.practice && self.counters.presented >= 3 {
                self.complete();
                self.next_at = None;
            } else {
                self.new_trial();
            }
        }
    }
    fn answer(&mut self, id: u32, choice: i32) -> Result<(), CoreError> {
        if self.phase != Phase::Active {
            return Err(error("not_active", "This round is not active."));
        }
        if id != self.trial_id {
            return Err(error(
                "stale_trial",
                "That input belongs to an earlier trial.",
            ));
        }
        if self.level.game == Game::Schulte {
            let Some(grid) = self.grid.as_ref() else {
                return Err(error("invalid_state", "No grid is available."));
            };
            if choice < 1 || choice > grid.len() as i32 || !grid.contains(&(choice as u8)) {
                return Err(error("invalid_choice", "Choose a number in this grid."));
            }
            let n = choice as u8;
            if self.found.contains(&n) {
                return Ok(());
            }
            if self.sequence.get(self.found.len()) == Some(&n) {
                self.found.push(n);
                self.counters.correct += 1;
                self.counters.presented += 1;
                self.trial_id += 1;
                self.feedback(true, "One step at a time.");
                if self.found.len() == self.sequence.len() {
                    self.complete();
                }
            } else {
                self.counters.incorrect += 1;
                self.feedback(false, "Find the next number shown.");
            }
            return Ok(());
        }
        if (self.level.game == Game::Stroop && !(0..=3).contains(&choice))
            || (self.level.game == Game::Go && choice != 1)
        {
            return Err(error("invalid_choice", "This response is not valid."));
        }
        let Some(t) = self.trial.as_mut() else {
            return Err(error("invalid_state", "No stimulus is available."));
        };
        if t.responded || t.finalized {
            return Err(error(
                "duplicate_input",
                "This trial has already been handled.",
            ));
        }
        t.responded = true;
        let rt = self.elapsed.saturating_sub(t.start);
        if self.level.game == Game::Stroop {
            let ink = t.ink.unwrap_or(0);
            let correct = choice == ink as i32;
            t.finalized = true;
            self.responses.push(rt);
            if correct {
                self.counters.correct += 1;
                self.feedback(true, "Nicely noticed.");
            } else {
                self.counters.incorrect += 1;
                self.feedback(false, &format!("The ink was {}.", colour_name(ink)));
            }
            self.next_at = Some(self.elapsed + self.level.gap_ms);
        } else {
            let target = t.letter.as_deref() == Some("X");
            if target {
                self.counters.hits += 1;
                self.responses.push(rt);
                self.feedback(true, "Target noticed.");
            } else {
                self.counters.false_alarms += 1;
                self.feedback(false, "Let this one pass. Wait for X.");
            }
        }
        Ok(())
    }
    fn snapshot(&self) -> Snapshot {
        let m = metrics(self.level.game, &self.counters, &self.responses);
        let result = if self.phase == Phase::Completed {
            Some(ResultRecord {
                started_at_ms: self.started_at,
                ended_at_ms: self.ended_at.unwrap_or(self.started_at),
                session_id: self.id.clone(),
                game: self.level.game,
                game_version: 1,
                level_id: self.level.id,
                is_practice: self.practice,
                duration_ms: self.elapsed,
                completion_status: self.phase,
                counters: self.counters.clone(),
                metrics: m.clone(),
            })
        } else {
            None
        };
        Snapshot {
            started_at_ms: self.started_at,
            session_id: self.id.clone(),
            phase: self.phase,
            level_id: self.level.id,
            game: self.level.game,
            is_practice: self.practice,
            elapsed_ms: self.elapsed,
            remaining_ms: if self.level.duration_ms > 0 && !self.practice {
                Some(self.level.duration_ms.saturating_sub(self.elapsed))
            } else {
                None
            },
            trial_id: self.trial_id,
            stimulus: self.trial.as_ref().map(|t| Stimulus {
                kind: self.level.game,
                word: t.word,
                ink: t.ink,
                letter: t.letter.clone(),
                visible: !t.finalized,
                responded: t.responded,
                remaining_ms: t.deadline.saturating_sub(self.elapsed),
            }),
            grid: self.grid.clone(),
            found: self.found.clone(),
            next_number: self.sequence.get(self.found.len()).copied(),
            sequence: if self.level.game == Game::Schulte {
                Some(self.sequence.clone())
            } else {
                None
            },
            counters: self.counters.clone(),
            metrics: m,
            feedback: self.feedback.clone(),
            result,
        }
    }
}
fn colour_name(i: u8) -> &'static str {
    ["Red", "Blue", "Green", "Yellow"][i as usize]
}
struct Runtime {
    session: Option<Session>,
}
impl Runtime {
    fn dispatch(&mut self, command: Command, now: u64) -> Result<Response, CoreError> {
        if matches!(command, Command::Levels { .. }) {
            return Ok(Response {
                api_version: API_VERSION,
                ok: true,
                snapshot: None,
                levels: Some(levels()),
                error: None,
            });
        }
        if matches!(command, Command::Interrupt { .. }) {
            if let Some(s) = self.session.as_mut() {
                s.advance(now);
                if s.phase == Phase::Active {
                    s.phase = Phase::Paused;
                }
            }
            return Ok(Response {
                api_version: API_VERSION,
                ok: true,
                snapshot: self.session.as_ref().map(Session::snapshot),
                levels: None,
                error: None,
            });
        }
        if let Command::Start {
            level_id,
            practice,
            seed,
        } = command
        {
            let level = levels()
                .into_iter()
                .find(|l| l.id == level_id)
                .ok_or_else(|| error("invalid_level", "Choose one of the 30 configured levels."))?;
            if practice && level.game != Game::Go {
                return Err(error(
                    "invalid_practice",
                    "Practice is available for Go / No-Go.",
                ));
            }
            self.session = Some(Session::new(
                level,
                practice,
                seed.unwrap_or_else(random_seed),
                now,
            ));
        } else {
            let s = self
                .session
                .as_mut()
                .ok_or_else(|| error("no_session", "Start a round first."))?;
            let id = match &command {
                Command::Poll { session_id }
                | Command::Answer { session_id, .. }
                | Command::Pause { session_id }
                | Command::Resume { session_id }
                | Command::Abandon { session_id } => session_id,
                _ => unreachable!(),
            };
            if id != &s.id {
                return Err(error(
                    "stale_session",
                    "That input belongs to a different round.",
                ));
            }
            // Resume does not add any paused time; all other commands advance first.
            s.advance(now);
            match command {
                Command::Answer {
                    trial_id, choice, ..
                } => s.answer(trial_id, choice)?,
                Command::Pause { .. } => {
                    if s.phase == Phase::Active {
                        s.phase = Phase::Paused;
                    }
                }
                Command::Resume { .. } => {
                    if s.phase == Phase::Paused {
                        s.phase = Phase::Active;
                        s.last_clock = now;
                    }
                }
                Command::Abandon { .. } if s.phase != Phase::Completed => {
                    s.phase = Phase::Abandoned;
                }
                _ => {}
            }
        }
        Ok(Response {
            api_version: API_VERSION,
            ok: true,
            snapshot: self.session.as_ref().map(Session::snapshot),
            levels: None,
            error: None,
        })
    }
    fn json(&mut self, text: &str, now: u64) -> String {
        let r = if text.len() > MAX_COMMAND_BYTES {
            Err(error(
                "command_too_large",
                "Command exceeds the supported limit.",
            ))
        } else {
            serde_json::from_str::<Command>(text)
                .map_err(|_| {
                    error(
                        "invalid_command",
                        "The game command is not valid JSON or has unsupported fields.",
                    )
                })
                .and_then(|c| self.dispatch(c, now))
        };
        let response = match r {
            Ok(v) => v,
            Err(e) => Response {
                api_version: API_VERSION,
                ok: false,
                snapshot: self.session.as_ref().map(Session::snapshot),
                levels: None,
                error: Some(e),
            },
        };
        serde_json::to_string(&response).expect("Serializing a finite snapshot cannot fail")
    }
}
#[cfg_attr(not(target_arch = "wasm32"), derive(uniffi::Object))]
pub struct FocusEngine {
    runtime: Mutex<Runtime>,
    #[cfg(not(target_arch = "wasm32"))]
    origin: Instant,
}
#[cfg_attr(not(target_arch = "wasm32"), uniffi::export)]
impl FocusEngine {
    #[cfg_attr(not(target_arch = "wasm32"), uniffi::constructor)]
    pub fn new() -> Arc<Self> {
        Arc::new(Self {
            runtime: Mutex::new(Runtime { session: None }),
            #[cfg(not(target_arch = "wasm32"))]
            origin: Instant::now(),
        })
    }
    pub fn dispatch(&self, command_json: String) -> String {
        #[cfg(not(target_arch = "wasm32"))]
        let now = self.origin.elapsed().as_millis().min(u64::MAX as u128) as u64;
        #[cfg(target_arch = "wasm32")]
        let now = web_sys::window()
            .and_then(|w| w.performance())
            .expect("Browser monotonic clock unavailable")
            .now() as u64;
        match self.runtime.lock() {
            Ok(mut runtime) => runtime.json(&command_json, now),
            Err(_) => serde_json::to_string(&Response {
                api_version: API_VERSION,
                ok: false,
                snapshot: None,
                levels: None,
                error: Some(error("engine_unavailable", "Restart the Focus module.")),
            })
            .unwrap(),
        }
    }
}
#[cfg(target_arch = "wasm32")]
mod wasm {
    use super::*;
    use wasm_bindgen::prelude::*;
    #[wasm_bindgen]
    pub struct WebFocusCore {
        engine: Arc<FocusEngine>,
    }
    #[wasm_bindgen]
    impl WebFocusCore {
        #[wasm_bindgen(constructor)]
        pub fn new() -> Self {
            Self {
                engine: FocusEngine::new(),
            }
        }
        pub fn dispatch(&self, json: String) -> String {
            self.engine.dispatch(json)
        }
    }
}

#[cfg(test)]
mod tests;
