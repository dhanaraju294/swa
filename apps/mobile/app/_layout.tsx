import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { getInwardEngine } from '../src/native/InwardEngineProvider';
import { colors } from '../src/design-system/tokens';
import { AppLockProvider } from '../src/navigation/AppLockContext';
import AppLockGate from '../src/components/AppLockGate';

export default function RootLayout() {
  useEffect(() => {
    const initDatabase = async () => {
      try {
        const engine = await getInwardEngine();
        const appDocumentsDir = FileSystem.documentDirectory || '';
        await engine.initialize(appDocumentsDir);
      } catch (e) {
        console.error('Failed to initialize database:', e);
      }
    };
    initDatabase();
  }, []);

  return (
    <AppLockProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <AppLockGate />
    </AppLockProvider>
  );
}
