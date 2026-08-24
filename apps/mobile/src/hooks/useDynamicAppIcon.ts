import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpoDynamicAppIcon from '@variant-systems/expo-dynamic-app-icon';
import { useStreak } from './useAwareness';
import { useDailyCatalog } from './useDailyJourney';
import { iconForState, isStreakMaintained, nextBoundary, showedUpToday } from './appIcon';
import type { AppIconName } from './appIcon';

export type { AppIconName };

const STORAGE_KEY = 'swa:appIcon';

export function useDynamicAppIcon() {
  const { data: streak, loading: streakLoading, refresh: refreshStreak } = useStreak();
  const {
    reflections,
    unlockedDay,
    loading: catalogLoading,
    refresh: refreshCatalog,
  } = useDailyCatalog();
  const [now, setNow] = useState(() => new Date());
  const pathname = usePathname();
  const applied = useRef<AppIconName | null>(null);
  const pending = useRef(false);

  const activeToday = useMemo(
    () => showedUpToday(reflections, unlockedDay, now),
    [reflections, unlockedDay, now],
  );

  // Don't apply anything until the data is loaded — otherwise every launch
  // would flash "irregular" for a moment and, on iOS, pop a needless system
  // alert when the real target arrives.
  const target =
    streakLoading || catalogLoading
      ? null
      : iconForState(isStreakMaintained(streak, now) || activeToday, now);

  useEffect(() => {
    if (!target || applied.current === target || pending.current) return;
    pending.current = true;
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
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
        if (active) applied.current = target;
      })
      .finally(() => {
        if (active) pending.current = false;
      });
    return () => {
      active = false;
      pending.current = false;
    };
  }, [target]);

  // Cross the morning/evening boundary while the app stays open so the icon
  // flips at 17:00 (and back at midnight) without waiting for a foregrounding.
  useEffect(() => {
    const delay = Math.max(1000, nextBoundary(now).getTime() - now.getTime());
    const timer = setTimeout(() => setNow(new Date()), delay);
    return () => clearTimeout(timer);
  }, [now]);

  // Re-evaluate on every navigation (e.g. returning from a saved session) and
  // when the app returns to the foreground, so the icon follows fresh data.
  useEffect(() => {
    setNow(new Date());
    refreshStreak();
    refreshCatalog();
  }, [pathname, refreshStreak, refreshCatalog]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setNow(new Date());
        refreshStreak();
        refreshCatalog();
      }
    });
    return () => sub.remove();
  }, [refreshStreak, refreshCatalog]);
}
