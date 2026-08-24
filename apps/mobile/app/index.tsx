import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { getSecureFlag } from '../src/native/secureFlag';
import { getInwardEngine } from '../src/native/InwardEngineProvider';

const ONBOARDING_KEY = 'inward-has-onboarded-v1';

// First launch: onboarding. Right after onboarding the first inward
// check-in (spot check-in) runs once; afterwards the app opens on the tabs.
async function resolveTarget(): Promise<'/onboarding' | '/(tabs)' | '/spot-checkin'> {
  const flag = await getSecureFlag(ONBOARDING_KEY).catch(() => null);
  if (flag !== 'true') return '/onboarding';
  try {
    const engine = await getInwardEngine();
    const done = await engine.latestSpotCheckin();
    return done ? '/(tabs)' : '/spot-checkin';
  } catch (e) {
    console.warn('Failed to check spot check-in status:', e);
    return '/(tabs)';
  }
}

export default function Index() {
  const [target, setTarget] = useState<'/onboarding' | '/(tabs)' | '/spot-checkin' | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setTarget('/onboarding'), 3000);
    resolveTarget()
      .then((value) => setTarget(value))
      .catch(() => setTarget('/onboarding'))
      .finally(() => clearTimeout(timeout));
    return () => clearTimeout(timeout);
  }, []);

  // Render nothing while we check — avoids a flash of the wrong screen.
  if (!target) return null;

  return <Redirect href={target} />;
}
