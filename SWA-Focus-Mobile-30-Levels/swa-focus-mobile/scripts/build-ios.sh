#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
[[ "$(uname -s)" == Darwin ]] || { echo 'iOS builds require macOS with Xcode.'; exit 1; }
rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
bash scripts/generate-bindings.sh
for target in aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios; do cargo build --manifest-path rust/focus-core/Cargo.toml --locked --release --lib --target "$target"; done
mkdir -p native/ios/Frameworks /tmp/swa-focus-ios/headers
cp native/ios/generated/*FFI.h /tmp/swa-focus-ios/headers/
cp native/ios/generated/*FFI.modulemap /tmp/swa-focus-ios/headers/module.modulemap
lipo -create rust/focus-core/target/aarch64-apple-ios-sim/release/libfocus_core.a rust/focus-core/target/x86_64-apple-ios/release/libfocus_core.a -output /tmp/swa-focus-ios/libfocus_core_sim.a
rm -rf native/ios/Frameworks/FocusCore.xcframework
xcodebuild -create-xcframework -library rust/focus-core/target/aarch64-apple-ios/release/libfocus_core.a -headers /tmp/swa-focus-ios/headers -library /tmp/swa-focus-ios/libfocus_core_sim.a -headers /tmp/swa-focus-ios/headers -output native/ios/Frameworks/FocusCore.xcframework
