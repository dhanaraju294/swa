import { NativeModules, Platform } from 'react-native';

import type { Streak } from '../native/InwardEngine';

type NativeStreakWidget = {
  requestPinWidget(currentStreak: number, lastActiveDate: string): Promise<boolean>;
  updateWidget(currentStreak: number, lastActiveDate: string): Promise<boolean>;
};

const nativeWidget = NativeModules.StreakWidget as NativeStreakWidget | undefined;

export const hasAndroidStreakWidget = Platform.OS === 'android' && Boolean(nativeWidget);

function widgetState(streak: Streak | null | undefined) {
  return {
    currentStreak: Math.max(0, streak?.currentStreak ?? 0),
    lastActiveDate: streak?.lastActiveDate ?? '',
  };
}

export async function requestStreakWidget(streak: Streak | null | undefined): Promise<boolean> {
  if (!hasAndroidStreakWidget || !nativeWidget) return false;
  const state = widgetState(streak);
  return nativeWidget.requestPinWidget(state.currentStreak, state.lastActiveDate);
}

export async function syncStreakWidget(streak: Streak | null | undefined): Promise<void> {
  if (!hasAndroidStreakWidget || !nativeWidget) return;
  const state = widgetState(streak);
  await nativeWidget.updateWidget(state.currentStreak, state.lastActiveDate);
}
