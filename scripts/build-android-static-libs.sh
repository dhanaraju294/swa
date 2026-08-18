#!/usr/bin/env bash
#
# Cross-compiles the Rust core (inward_core) into STATIC libraries
# (libinward_core.a) for the four Android ABIs using cargo-ndk.
#
# The Android Gradle build (app/build.gradle) runs this automatically before
# the CMake step, which links against these .a files. The artifacts are
# gitignored and rebuilt on demand — no large binaries live in git.
#
# Produces: apps/mobile/android/src/main/jniLibs/{abi}/libinward_core.a
#
# Prereqs:
#   - cargo-ndk:   cargo install cargo-ndk
#   - Android NDK installed (ANDROID_NDK_HOME set, or ANDROID_HOME with an ndk dir)
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CRATE_DIR="$REPO_ROOT/rust/inward_core"
OUT_DIR="$REPO_ROOT/apps/mobile/android/src/main/jniLibs"

ABIS=(arm64-v8a armeabi-v7a x86_64 x86)

if ! command -v cargo >/dev/null 2>&1; then
  echo "error: cargo not found. Install Rust: https://rustup.rs" >&2
  exit 1
fi

if ! cargo ndk --version >/dev/null 2>&1; then
  echo "==> Installing cargo-ndk"
  cargo install cargo-ndk
fi

if [[ -z "${ANDROID_NDK_HOME:-}" && -z "${ANDROID_HOME:-}" ]]; then
  echo "error: neither ANDROID_NDK_HOME nor ANDROID_HOME is set.
Install the Android NDK and point ANDROID_NDK_HOME at it." >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

echo "==> Building static Rust libraries for ABIs: ${ABIS[*]}"
(
  cd "$CRATE_DIR"
  cargo ndk \
    -t "${ABIS[0]}" \
    -t "${ABIS[1]}" \
    -t "${ABIS[2]}" \
    -t "${ABIS[3]}" \
    -o "$OUT_DIR" \
    build --release
)

echo "==> Done: $OUT_DIR"
find "$OUT_DIR" -name '*.a' -print
