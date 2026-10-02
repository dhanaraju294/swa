import { useCallback, useRef, useState } from 'react';
import { Alert, ToastAndroid } from 'react-native';

import type { Streak } from '../native/InwardEngine';
import { hasAndroidStreakWidget, requestStreakWidget } from './streakWidget';

/** Asks the launcher to pin the Blossom streak widget; shared by the Profile card and the first-run popup. */
export function useAddStreakWidget(streak: Streak | null | undefined) {
  const inFlight = useRef(false);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const add = useCallback(async (): Promise<boolean> => {
    if (inFlight.current) return false;
    inFlight.current = true;
    setRequesting(true);
    try {
      const ok = await requestStreakWidget(streak);
      if (ok) {
        setRequested(true);
        ToastAndroid.show('Choose a spot on your home screen for Blossom', ToastAndroid.LONG);
      } else {
        Alert.alert(
          'Widget unavailable',
          'Your launcher could not open the widget picker. Long-press your home screen, choose Widgets, then select SWA.',
        );
      }
      return ok;
    } catch (error) {
      console.warn('Could not request the streak widget:', error);
      Alert.alert('Could not add widget', 'Please try adding SWA from your home-screen widget picker.');
      return false;
    } finally {
      inFlight.current = false;
      setRequesting(false);
    }
  }, [streak]);

  return { supported: hasAndroidStreakWidget, requesting, requested, add };
}
