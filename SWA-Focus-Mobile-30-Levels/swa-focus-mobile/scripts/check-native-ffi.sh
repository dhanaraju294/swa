#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../rust/focus-core"
cargo build --locked --release --lib
case "$(uname -s)" in Darwin) lib=target/release/libfocus_core.dylib;; Linux) lib=target/release/libfocus_core.so;; *) echo 'Run C-ABI check on Linux/macOS.'; exit 1;; esac
cargo run --locked --features bindgen-cli --bin uniffi-bindgen -- generate --metadata-no-deps --library "$lib" --language python --out-dir target/ffi-check
cp "$lib" target/ffi-check/
PYTHONPATH=target/ffi-check python3 ../../scripts/check_native_ffi.py
