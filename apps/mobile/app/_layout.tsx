import React, { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { getInwardEngine } from '../src/native/InwardEngineProvider';
import { colors } from '../src/design-system/tokens';
import { AppLockProvider } from '../src/navigation/AppLockContext';
import AppLockGate from '../src/components/AppLockGate';
import ErrorBoundary from '../src/components/ErrorBoundary';
import { parseReminders } from '../src/state/appStore';
import {
  configureNotificationHandler,
  subscribeToReminderTaps,
  syncReflectionReminders,
} from '../src/notifications/reminders';
import { useDynamicAppIcon } from '../src/hooks/useDynamicAppIcon';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  useDynamicAppIcon();

  useEffect(() => {
    configureNotificationHandler();
    const initDatabase = async () => {
      try {
        const engine = await getInwardEngine();
        const appDocumentsDir = FileSystem.documentDirectory || '';
        await engine.initialize(appDocumentsDir);
        const settings = await engine.getSettings();
        await syncReflectionReminders(parseReminders(settings.reminderTime));
      } catch (e) {
        console.error('Failed to initialize database:', e);
      } finally {
        setReady(true);
      }
    };
    initDatabase();
  }, []);

  useEffect(() => {
    return subscribeToReminderTaps((part) => {
      router.push({ pathname: '/session', params: { part } });
    });
  }, []);

  if (!ready) return null;

  return (
    <ErrorBoundary>
      <AppLockProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="spot-checkin" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="session"
          options={{
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
        <AppLockGate />
      </AppLockProvider>
    </ErrorBoundary>
  );
}
