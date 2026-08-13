import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const ONBOARDING_KEY = 'inward-has-onboarded-v1';

export default function Index() {
  const [target, setTarget] = useState<'/onboarding' | '/(tabs)' | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setTarget('/onboarding'), 3000);
    SecureStore.getItemAsync(ONBOARDING_KEY)
      .then((value) => setTarget(value === 'true' ? '/(tabs)' : '/onboarding'))
      .catch(() => setTarget('/onboarding'))
      .finally(() => clearTimeout(timeout));
    return () => clearTimeout(timeout);
  }, []);

  // Render nothing while we check — avoids a flash of the wrong screen.
  if (!target) return null;

  return <Redirect href={target} />;
}
