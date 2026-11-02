# Dependency / licensing notes

The module's original source is provided under the included MIT license. Dependencies and generated bindings retain their upstream licenses. Before shipping a native app, run your host's approved full dependency/license inventory and provide the required notices.

Key components to review: React/React Native/React Native Web and safe-area-context (MIT), UniFFI (MPL-2.0), Rust rand/serde family (upstream MIT/Apache-2.0 variants), wasm-bindgen (MIT/Apache-2.0), and JNA (upstream dual-license terms; choose/comply with the applicable option). This summary is **not** a completed license audit or legal determination. The complete Cargo/npm lockfiles are included for reproducibility.

No Android JNA binary, iOS XCFramework, app binary or vendored dependency source tree is shipped in the source archive. The preview bundles web dependencies plus the Rust WASM artifact; keep their licensing obligations in mind if distributing that preview. Generated Rust-to-language bindings are included for integration, with upstream generation metadata.
