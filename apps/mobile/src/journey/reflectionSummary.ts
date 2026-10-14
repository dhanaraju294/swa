import type { Reflection } from '../native/InwardEngine';
import { parseStoredPart } from './types';

export function reflectionSummaries(rows: Reflection[]) {
  return rows.filter(r => (r.journalId === 'morning' || r.journalId === 'evening') && r.prompt === 'session')
    .map(row => {
      const stored = parseStoredPart(row.response);
      if (!stored) return null;
      const text = Object.values(stored.answers).map(answer => {
        try { const value: unknown = JSON.parse(answer); if (Array.isArray(value)) return value.filter(v => typeof v === 'string').join(', '); } catch { /* plain answer */ }
        return answer;
      }).filter(a => a.trim()).join(' · ');
      return text ? { ...row, summary: text } : null;
    }).filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function homeReflections(rows: Reflection[], day: number) {
  const saved = reflectionSummaries(rows);
  return { today: saved.filter(r => r.dayNumber === day), recent: saved.filter(r => r.dayNumber < day).slice(0, 2), past: saved.filter(r => r.dayNumber !== day) };
}
