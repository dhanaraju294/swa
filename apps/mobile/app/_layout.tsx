import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { getInwardEngine } from '../src/native/InwardEngineProvider';
import { colors, spacing } from '../src/design-system/tokens';
import { Button } from '../src/design-system/Button';
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
  const [initError, setInitError] = useState<string | null>(null);
  const initRun = useRef(0);
  useDynamicAppIcon();

  const initDatabase = useCallback(async () => {
    const runId = ++initRun.current;
    setInitError(null);
    try {
      const engine = await getInwardEngine();
      const appDocumentsDir = FileSystem.documentDirectory || '';
      await engine.initialize(appDocumentsDir);
      if (runId !== initRun.current) return; // superseded by a newer run
      setReady(true);
      // Best-effort: sync the reminder schedule. A failure here must not
      // block the app from starting.
      try {
        const settings = await engine.getSettings();
        await syncReflectionReminders(parseReminders(settings.reminderTime));
      } catch (e) {
        console.warn('Reminder sync failed (non-fatal):', e);
      }
    } catch (e) {
      if (runId !== initRun.current) return;
      console.error('Failed to initialize database:', e);
      // Surface a readable, retryable screen instead of silently rendering
      // an app in which every persisted feature fails in the background.
      setInitError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    configureNotificationHandler();
    initDatabase();
  }, [initDatabase]);

  useEffect(() => {
    return subscribeToReminderTaps((part) => {
      router.push({ pathname: '/session', params: { part } });
    });
  }, []);

  if (initError) {
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorTitle}>Something went wrong while starting up.</Text>
        <Text style={styles.errorBody}>{initError}</Text>
        <Button title="Try again" color={colors.gold} onPress={() => initDatabase()} style={{ marginTop: spacing.xl }} />
      </View>
    );
  }

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

const styles = StyleSheet.create({
  errorWrap: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  errorTitle: {
    fontFamily: 'Fraunces',
    fontSize: 24,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
  },
  errorBody: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: spacing.md,
    lineHeight: 19,
    textAlign: 'center',
  },
});
