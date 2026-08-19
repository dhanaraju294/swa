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

# cargo-ndk only copies shared libraries (.so) into -o. The CMake step links
# against the STATIC archive instead, so copy the .a files from the cargo
# target dirs into the per-ABI folders ourselves.
#   ABI            cargo triple
#   arm64-v8a      aarch64-linux-android
#   armeabi-v7a    armv7-linux-androideabi
#   x86_64         x86_64-linux-android
#   x86            i686-linux-android
abi_triple() {
  case "$1" in
    arm64-v8a) echo aarch64-linux-android ;;
    armeabi-v7a) echo armv7-linux-androideabi ;;
    x86_64) echo x86_64-linux-android ;;
    x86) echo i686-linux-android ;;
    *) echo "" ;;
  esac
}
for abi in "${ABIS[@]}"; do
  triple="$(abi_triple "$abi")"
  src="$CRATE_DIR/target/$triple/release/libinward_core.a"
  if [[ -f "$src" ]]; then
    cp "$src" "$OUT_DIR/$abi/libinward_core.a"
  else
    echo "error: static library not found for $abi ($triple): $src" >&2
    exit 1
  fi
done

echo "==> Done: $OUT_DIR"
find "$OUT_DIR" -name '*.a' -print
