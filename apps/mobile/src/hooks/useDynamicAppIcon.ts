import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpoDynamicAppIcon from '@variant-systems/expo-dynamic-app-icon';
import { useDailyCatalog } from './useDailyJourney';
import { allPartsComplete, type PartStatus } from '../journey/types';

// The home-screen icon is a quiet mirror of the day's practice.
//   nothing done yet      -> "irregular"  (off the path, not practising)
//   practice begun         -> "morning"   (the day has been entered)
//   all three parts done   -> "evening"   (settled, the loop is closed)
export type AppIconName = 'morning' | 'evening' | 'irregular';

const STORAGE_KEY = 'swa:appIcon';

export function iconForStatus(status: PartStatus | undefined): AppIconName {
  if (!status) return 'irregular';
  if (allPartsComplete(status)) return 'evening';
  if (status.morning || status.exercise || status.evening) return 'morning';
  return 'irregular';
}

export function useDynamicAppIcon() {
  const { statusByDay, unlockedDay, refresh } = useDailyCatalog();
  const target = iconForStatus(statusByDay[unlockedDay]);
  const applied = useRef<AppIconName | null>(null);
  const pending = useRef(false);

  useEffect(() => {
    if (applied.current === target || pending.current) return;
    pending.current = true;
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        // Skip the native call if the OS icon already matches — iOS pops a
        // system alert on every real change, so we never re-apply needlessly.
        if (stored === target) {
          applied.current = target;
          return;
        }
        ExpoDynamicAppIcon.setAppIcon(target);
        applied.current = target;
        AsyncStorage.setItem(STORAGE_KEY, target).catch(() => {});
      })
      .catch(() => {
        applied.current = target;
      })
      .finally(() => {
        if (active) pending.current = false;
      });
    return () => {
      active = false;
    };
  }, [target]);

  // Re-evaluate when the app returns to the foreground so the icon updates
  // after a reflection is saved in another tab or the session screen.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => sub.remove();
  }, [refresh]);
}
