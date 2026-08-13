import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useProfile } from '../hooks/useProfile';

const PASSCODE_KEY = 'inward-applock-passcode';

async function loadPasscode(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(PASSCODE_KEY);
  } catch {
    return null;
  }
}

async function savePasscode(code: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(PASSCODE_KEY, code);
  } catch {
    /* non-fatal: storage may be unavailable (e.g. web preview) */
  }
}

async function clearPasscode(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(PASSCODE_KEY);
  } catch {
    /* non-fatal */
  }
}

type AppLockContextValue = {
  enabled: boolean;
  locked: boolean;
  hasPasscode: boolean;
  enableAppLock: (code?: string) => Promise<void>;
  disableAppLock: () => Promise<void>;
  unlock: () => void;
  verify: (code: string) => boolean;
};

const AppLockContext = createContext<AppLockContextValue | null>(null);

export function AppLockProvider({ children }: { children: React.ReactNode }) {
  const { data: profile, update } = useProfile();
  const enabled = !!profile?.appLockEnabled;
  const [passcode, setPasscode] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  // Tracks whether the user has explicitly unlocked during the current
  // foreground session, so we don't re-lock them while they're actively using
  // the app (e.g. after a profile update triggers a re-render).
  const sessionUnlocked = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const passcodeRef = useRef(passcode);
  passcodeRef.current = passcode;

  useEffect(() => {
    loadPasscode().then(setPasscode);
  }, []);

  // Lock whenever the app returns to the foreground and app lock is on.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'background') {
        sessionUnlocked.current = false;
      } else if (next === 'active') {
        if (enabledRef.current && passcodeRef.current && !sessionUnlocked.current) {
          setLocked(true);
        }
      }
    });
    return () => sub.remove();
  }, []);

  // Initial lock once we know the passcode exists and lock is enabled.
  useEffect(() => {
    if (passcode && enabled && !sessionUnlocked.current) {
      setLocked(true);
    }
  }, [passcode, enabled]);

  const enableAppLock = useCallback(
    async (code?: string) => {
      if (code) {
        await savePasscode(code);
        setPasscode(code);
      }
      sessionUnlocked.current = true;
      setLocked(false);
      await update({
        displayName: profile?.displayName || undefined,
        appLockEnabled: true,
      });
    },
    [profile, update],
  );

  const disableAppLock = useCallback(
    async () => {
      await clearPasscode();
      setPasscode(null);
      sessionUnlocked.current = true;
      setLocked(false);
      await update({
        displayName: profile?.displayName || undefined,
        appLockEnabled: false,
      });
    },
    [profile, update],
  );

  const unlock = useCallback(() => {
    sessionUnlocked.current = true;
    setLocked(false);
  }, []);

  const verify = useCallback((code: string) => code === passcode, [passcode]);

  const value: AppLockContextValue = {
    enabled,
    locked,
    hasPasscode: !!passcode,
    enableAppLock,
    disableAppLock,
    unlock,
    verify,
  };

  return <AppLockContext.Provider value={value}>{children}</AppLockContext.Provider>;
}

export function useAppLockContext(): AppLockContextValue {
  const ctx = useContext(AppLockContext);
  if (!ctx) {
    throw new Error('useAppLockContext must be used within an AppLockProvider');
  }
  return ctx;
}
