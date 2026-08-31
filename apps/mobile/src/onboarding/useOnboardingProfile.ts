import { useCallback, useEffect, useState } from 'react';
import { readOnboardingRecord } from './store';
import type { OnboardingDraft, OnboardingRecord } from './types';

export function useOnboardingProfile() {
  const [record, setRecord] = useState<OnboardingRecord | null>(null);

  const refresh = useCallback(async () => {
    try {
      setRecord(await readOnboardingRecord());
    } catch {
      setRecord(null);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { record, draft: (record?.draft ?? null) as OnboardingDraft | null, refresh };
}
