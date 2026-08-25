#!/usr/bin/env bash
#
# Cross-compiles the Rust core (inward_core) into shared libraries for the
# four primary Android ABIs using cargo-ndk.
#
# Produces: apps/mobile/android/app/src/main/jniLibs/{abi}/libinward_core.so
#
# Prereqs:
#   - cargo-ndk:            cargo install cargo-ndk
#   - Android NDK installed with ANDROID_NDK_HOME (or ANDROID_HOME/ndk) set
#   - The Android project generated first:  cd apps/mobile && npx expo prebuild --platform android
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CRATE_MANIFEST="$REPO_ROOT/rust/inward_core/Cargo.toml"
OUT_DIR="$REPO_ROOT/apps/mobile/android/app/src/main/jniLibs"

ABIS=(arm64-v8a armeabi-v7a x86_64 x86)

if ! command -v cargo >/dev/null 2>&1; then
  echo "error: cargo not found" >&2
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

# cargo-ndk 4.x cannot parse NDK 30+ version metadata ("Error detecting NDK
# version"). When ANDROID_NDK_HOME is unset, prefer the newest installed NDK
# that cargo-ndk can handle instead of letting cargo-ndk pick a broken one.
if [[ -z "${ANDROID_NDK_HOME:-}" ]]; then
  ndk_root="${ANDROID_HOME:-$HOME/Library/Android/sdk}/ndk"
  if [[ -d "$ndk_root" ]]; then
    for candidate in "$ndk_root"/*/; do
      rev=""
      if [[ -f "$candidate/source.properties" ]]; then
        rev="$(grep -E '^Pkg\.Revision' "$candidate/source.properties" 2>/dev/null | sed 's/.*= *//' | cut -d. -f1)"
      fi
      # cargo-ndk 4.x fails on NDKs whose revision it cannot parse (e.g. NDK 30
      # ships without a Pkg.Revision in source.properties). Skip those.
      [[ -z "$rev" || "$rev" == "30" ]] && continue
      ANDROID_NDK_HOME="$(cd "$candidate" && pwd)"
    done
  fi
  echo "==> Auto-detected ANDROID_NDK_HOME=$ANDROID_NDK_HOME"
fi
export ANDROID_NDK_HOME

mkdir -p "$OUT_DIR"

echo "==> Building .so libraries for ABIs: ${ABIS[*]}"
# cargo-ndk resolves the Cargo.toml from the working directory.
cd "$REPO_ROOT/rust/inward_core"
cargo ndk \
  -t "${ABIS[0]}" \
  -t "${ABIS[1]}" \
  -t "${ABIS[2]}" \
  -t "${ABIS[3]}" \
  -o "$OUT_DIR" \
  build --release

echo "==> Done: $OUT_DIR"
find "$OUT_DIR" -name '*.so' -print
