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

function isNativeBridgeAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RN = require('react-native') as { TurboModuleRegistry?: { get: (name: string) => unknown } };
    const registered =
      typeof RN.TurboModuleRegistry?.get === 'function' &&
      RN.TurboModuleRegistry.get('InwardCore') != null;
    // Belt-and-braces: the crate installer also hangs the module off globalThis.
    const installed = (globalThis as { NativeInwardCore?: unknown }).NativeInwardCore != null;
    return registered || installed;
  } catch {
    return false;
  }
}

export async function getInwardEngine(): Promise<InwardEngine> {
  if (engineInstance) return engineInstance;

  if (nativeAvailability === null) {
    nativeAvailability = isNativeBridgeAvailable();
  }

  if (nativeAvailability) {
    engineInstance = new NativeInwardEngine();
  } else {
    console.warn('[InwardEngine] Native Rust bridge unavailable. Using in-memory JS fallback.');
    engineInstance = new MockCoreEngine();
  }
  return engineInstance;
}
