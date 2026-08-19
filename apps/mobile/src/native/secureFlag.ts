// Secure flag storage with a web fallback.
//
// `expo-secure-store` has no web implementation: on web every call rejects,
// which previously caused the app to treat users as never-onboarded on every
// launch (the onboarding flag could never be persisted). This helper tries
// SecureStore first and falls back to localStorage on web so the flag survives
// reloads in browser previews while remaining secure on real devices.
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

export async function getSecureFlag(key: string): Promise<string | null> {
  if (!isWeb) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  }
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

export async function setSecureFlag(key: string, value: string): Promise<void> {
  if (!isWeb) {
    try {
      await SecureStore.setItemAsync(key, value);
      return;
    } catch {
      return;
    }
  }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch {
    // non-fatal
  }
}