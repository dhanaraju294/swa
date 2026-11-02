#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
manifest=rust/focus-core/Cargo.toml
cargo build --manifest-path "$manifest" --locked --release --lib
case "$(uname -s)" in Darwin) library=rust/focus-core/target/release/libfocus_core.dylib;; Linux) library=rust/focus-core/target/release/libfocus_core.so;; *) echo 'Run binding generation on macOS or Linux.'; exit 1;; esac
root="$PWD"
cd rust/focus-core
cargo run --manifest-path Cargo.toml --locked --features bindgen-cli --bin uniffi-bindgen -- generate --metadata-no-deps --library "$root/$library" --config uniffi.toml --language kotlin --out-dir "$root"/native/android/src/main/java
cargo run --manifest-path Cargo.toml --locked --features bindgen-cli --bin uniffi-bindgen -- generate --metadata-no-deps --library "$root/$library" --config uniffi.toml --language swift --out-dir "$root"/native/ios/generated
