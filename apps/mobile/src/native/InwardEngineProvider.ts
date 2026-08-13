// Engine provider. Resolves a single long-lived engine for the process:
//  - the native Rust engine (via UniFFI JSI bindings) on iOS/Android dev-client
//    and custom builds, or
//  - an in-memory JS fallback for Expo Go / web previews.
//
// The native path is only taken when the `InwardCore` TurboModule is actually
// registered, which also guarantees the generated entry module (which installs
// the Rust crate into Hermes) is never evaluated in environments without it.
import { Platform } from 'react-native';

import { MockCoreEngine } from './MockInwardCore';
import { NativeInwardEngine } from './NativeInwardEngine';
import type { InwardEngine } from './InwardEngine';

let engineInstance: InwardEngine | null = null;
let nativeAvailability: boolean | null = null;

// Probe for the native `InwardCore` TurboModule. The generated entry module
// (`src/native/generated`) installs the Rust crate into Hermes via that module,
// so requiring it is the exact same signal uniffi itself uses
// (`TurboModuleRegistry.getEnforcing('InwardCore')`). If the module is absent
// (Expo Go, web, or a dev client built before the Rust bridge was wired in)
// the require throws and we fall back to the in-memory mock engine.
//
// Returns a tuple so the caller can log *why* a fallback happened.
function probeNativeBridge(): { available: boolean; detail: string } {
  if (Platform.OS === 'web') {
    return { available: false, detail: 'Platform is web' };
  }
  // Android: the C++ TurboModule bridge is not wired in this build. Only the
  // prebuilt libinward_core.so is bundled; there is no CMake/externalNativeBuild
  // compiling the JSI shim (cpp/inward-core.cpp + cpp/generated) and no
  // Java/Kotlin registration of the `InwardCore` module. RN codegen still emits
  // a stub `InwardCore` spec whose installRustCrate() aborts natively at launch,
  // which surfaces as a white screen. Skip the native path entirely and use the
  // in-memory mock engine until the Android native bridge is wired (phase 1.3).
  if (Platform.OS === 'android') {
    return {
      available: false,
      detail:
        'Android native bridge not wired (no C++ TurboModule registration) — using mock engine (phase 1.3)',
    };
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../native/generated');
    return { available: true, detail: 'InwardCore TurboModule resolved' };
  } catch (e) {
    return {
      available: false,
      detail: `require('../native/generated') failed: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

export async function getInwardEngine(): Promise<InwardEngine> {
  if (engineInstance) return engineInstance;

  if (nativeAvailability === null) {
    const { available, detail } = probeNativeBridge();
    nativeAvailability = available;
    // eslint-disable-next-line no-console
    console.log(`[InwardEngine] native bridge probe → ${available ? 'AVAILABLE' : 'UNAVAILABLE'} (${detail})`);
  }

  if (nativeAvailability) {
    console.log('[InwardEngine] Using native Rust bridge.');
    engineInstance = new NativeInwardEngine();
  } else {
    console.warn(
      '[InwardEngine] Native Rust bridge unavailable — using in-memory JS fallback. ' +
        'This means the running app does NOT contain the InwardCore native module. ' +
        'Cause: running in Expo Go, or a dev client built before the Rust bridge was wired in. ' +
        'Fix: build & run the custom dev client (npm run ios / npm run android), not Expo Go.',
    );
    engineInstance = new MockCoreEngine();
  }
  return engineInstance;
}
