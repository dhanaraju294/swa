import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Native from '../src/native/generated';
import { colors } from '../src/design-system/tokens';

export default function RootLayout() {
  useEffect(() => {
    const initDatabase = async () => {
      try {
        const appDocumentsDir = FileSystem.documentDirectory || '';
        await Native.initDb(appDocumentsDir);
      } catch (e) {
        console.error('Failed to initialize database:', e);
      }
    };
    initDatabase();
  }, []);

  return (
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
  );
}