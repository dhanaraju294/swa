#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
rustup target add wasm32-unknown-unknown
command -v wasm-bindgen >/dev/null || { echo 'Install: cargo install wasm-bindgen-cli --version 0.2.105 --locked --jobs 2'; exit 1; }
cargo build --manifest-path rust/focus-core/Cargo.toml --locked --release --lib --target wasm32-unknown-unknown
wasm-bindgen rust/focus-core/target/wasm32-unknown-unknown/release/focus_core.wasm --target web --out-dir preview/wasm
