#!/usr/bin/env bash
#
# Builds the Rust core (inward_core) into an iOS XCFramework.
#
# Produces: apps/mobile/build/InwardCore.xcframework
# (the path vendored by apps/mobile/InwardCore.podspec)
#
# Prereqs: macOS + Xcode command line tools + Rust toolchain
#   rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CRATE_MANIFEST="$REPO_ROOT/rust/inward_core/Cargo.toml"
IOS_ARCH_DIR="$REPO_ROOT/apps/mobile/ios/arch"
OUT_DIR="$REPO_ROOT/apps/mobile/build"
FRAMEWORK_OUT="$OUT_DIR/InwardCore.xcframework"

TARGETS=(aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios)

echo "==> Ensuring iOS Rust targets are installed"
rustup target add "${TARGETS[@]}"

echo "==> Building release binaries"
for target in "${TARGETS[@]}"; do
  cargo build --manifest-path "$CRATE_MANIFEST" --target "$target" --release
done

echo "==> Bundling simulator slices into a fat library"
mkdir -p "$IOS_ARCH_DIR"
SIM_DEVICE_LIB="$REPO_ROOT/rust/inward_core/target/aarch64-apple-ios-sim/release/libinward_core.a"
SIM_X86_LIB="$REPO_ROOT/rust/inward_core/target/x86_64-apple-ios/release/libinward_core.a"
SIM_FAT_LIB="$IOS_ARCH_DIR/libinward_core-sim.a"

# Only lipo when both simulator slices exist; x86_64 is unavailable on Apple
# Silicon hosts' Xcode toolchains for older versions but modern ones ship it.
# The fat lib must keep the SAME binary name as the device slice so CocoaPods
# accepts the vendored XCFramework.
if [[ -f "$SIM_DEVICE_LIB" && -f "$SIM_X86_LIB" ]]; then
  lipo -create "$SIM_DEVICE_LIB" "$SIM_X86_LIB" -output "$IOS_ARCH_DIR/libinward_core.a"
fi
SIM_FAT_LIB="$IOS_ARCH_DIR/libinward_core.a"

echo "==> Packaging XCFramework"
rm -rf "$FRAMEWORK_OUT"
xcodebuild -create-xcframework \
  -library "$REPO_ROOT/rust/inward_core/target/aarch64-apple-ios/release/libinward_core.a" \
  -library "$SIM_FAT_LIB" \
  -output "$FRAMEWORK_OUT"

echo "==> Done: $FRAMEWORK_OUT"
