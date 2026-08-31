import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
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

  if (!target) return null;

  return <Redirect href={target} />;
}
