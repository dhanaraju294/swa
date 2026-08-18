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
  // iOS/Android: both can run the real Rust engine once the `InwardCore`
  // TurboModule is registered (the generated entry module installs the Rust
  // crate into Hermes via that module). If the module is absent (Expo Go, web,
  // or a dev client built before the Rust bridge was wired in) the require
  // throws and we fall back to the in-memory mock engine.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../native/generated');
    // eslint-disable-next-line no-console
    const g: any = (globalThis as any).NativeInwardCore;
    console.log(
      '[InwardEngine] DIAG NativeInwardCore global =',
      typeof g,
      '| initDb fn =',
      typeof (g && g.ubrn_uniffi_inward_core_fn_func_init_db),
      '| completeJournalDay fn =',
      typeof (g && g.ubrn_uniffi_inward_core_fn_func_complete_journal_day),
    );
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
