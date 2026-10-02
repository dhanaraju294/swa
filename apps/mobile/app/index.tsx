import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../src/design-system/tokens';
import { getSecureFlag } from '../src/native/secureFlag';
import { ONBOARDING_FLAG_KEY, readOnboardingRecord } from '../src/onboarding/store';
import { flushPendingOnboarding } from '../src/onboarding/sync';

async function resolveTarget(): Promise<'/onboarding' | '/(tabs)'> {
  const flag = await getSecureFlag(ONBOARDING_FLAG_KEY).catch(() => null);
  if (flag === 'true') {
    void flushPendingOnboarding();
    return '/(tabs)';
  }
  const local = await readOnboardingRecord().catch(() => null);
  if (local?.completed) {
    void flushPendingOnboarding();
    return '/(tabs)';
  }
  return '/onboarding';
}

export default function Index() {
  const [target, setTarget] = useState<'/onboarding' | '/(tabs)' | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setTarget('/onboarding'), 3000);
    resolveTarget()
      .then((value) => setTarget(value))
      .catch(() => setTarget('/onboarding'))
      .finally(() => clearTimeout(timeout));
    return () => clearTimeout(timeout);
  }, []);

  if (!target) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.leafInk} accessibilityLabel="Opening your saved space" />
        <Text style={styles.loadingText}>Finding your place…</Text>
      </View>
    );
  }

  return <Redirect href={target} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    gap: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  loadingText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.inkSoft,
  },
});
