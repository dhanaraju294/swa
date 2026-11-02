#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${ANDROID_NDK_HOME:?Set ANDROID_NDK_HOME to your installed Android NDK (r28 or newer recommended).}"
command -v cargo-ndk >/dev/null || { echo 'Install: cargo install cargo-ndk --locked'; exit 1; }
rustup target add aarch64-linux-android x86_64-linux-android
bash scripts/generate-bindings.sh
# 16 KB page alignment for current Android/Play requirements. Audit JNA and all host libraries too.
export RUSTFLAGS="${RUSTFLAGS:-} -C link-arg=-Wl,-z,max-page-size=16384"
cargo ndk -t arm64-v8a -t x86_64 --platform 24 -o native/android/src/main/jniLibs build --manifest-path rust/focus-core/Cargo.toml --locked --release --lib
