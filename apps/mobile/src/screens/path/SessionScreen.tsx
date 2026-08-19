import React, { useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, shadow } from '../../design-system/tokens';
import { Button } from '../../design-system/Button';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { useDailyCatalog, useDailyDay, useSaveJourneyPart } from '../../hooks/useDailyJourney';
import type { JourneyPart, JourneySession, JourneyStep } from '../../journey/types';

const PARTS: JourneyPart[] = ['morning', 'exercise', 'evening'];

const PART_META: Record<JourneyPart, { label: string; tint: string; soft: string }> = {
  morning: { label: 'Morning', tint: '#FBF1DE', soft: '#E8B23C' },
  exercise: { label: 'Practice', tint: '#F1F7EF', soft: '#6F8F73' },
  evening: { label: 'Evening', tint: '#F3EEF9', soft: '#8d7fae' },
};

function sessionOf(content: NonNullable<ReturnType<typeof useDailyDay>['content']>, part: JourneyPart): JourneySession {
  return content[part];
}

export default function SessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ day?: string; part?: string }>();
  const { unlockedDay, loading: catalogLoading } = useDailyCatalog();
  const requestedDay = parseInt(Array.isArray(params.day) ? params.day[0] : params.day || '', 10);
  const day = Number.isFinite(requestedDay) && requestedDay > 0 ? requestedDay : unlockedDay;
  const partParam = Array.isArray(params.part) ? params.part[0] : params.part;
  const initialPart = (PARTS.includes(partParam as JourneyPart) ? partParam : 'morning') as JourneyPart;

  const { content, loading, error } = useDailyDay(day);
  const { savePart, saving } = useSaveJourneyPart();

  const [part, setPart] = useState<JourneyPart>(initialPart);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  // Use a ref to track answers for the skip-on-last-step case to avoid stale closures
  const answersRef = useRef(answers);
  answersRef.current = answers;

  // Guard against rapid double-saves
  const savingRef = useRef(false);

  const session = content ? sessionOf(content, part) : null;
  const steps = session?.steps ?? [];
  const step = steps[stepIndex];
  const progressValue = steps.length ? (stepIndex + 1) / steps.length : 0;

  const canContinue = useMemo(() => {
    if (!step) return false;
    if (step.optional || step.allowSkip) return true;
    if (step.type === 'notice') return true;
    if (step.type === 'one-line') return true;
    return Boolean(answers[step.id]);
  }, [answers, step]);

  const write = useCallback((value: string) => {
    if (!step) return;
    setAnswers((prev) => ({ ...prev, [step.id!]: value }));
  }, [step?.id]);

  const goNext = useCallback(async (forceSkip = false) => {
    if (!session || !content) return;
    if (savingRef.current) return;

    if (forceSkip && step) {
      // Use functional update to avoid stale closure, then capture via ref
      setAnswers((prev) => {
        const next = { ...prev, [step.id]: prev[step.id] || '__skip__' };
        answersRef.current = next;
        return next;
      });
    }

    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }

    // For the last step, capture latest answers from ref (handles the stale closure from forceSkip)
    const finalAnswers = answersRef.current;
    savingRef.current = true;
    try {
      const result = await savePart(day, part, finalAnswers);
      if (result.error) {
        Alert.alert('Could not save', result.error);
        return;
      }
      setDone(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      Alert.alert('Could not save', message);
    } finally {
      savingRef.current = false;
    }
  }, [session, content, step, stepIndex, steps.length, savePart, day, part]);

  const openPart = (next: JourneyPart) => {
    setPart(next);
    setStepIndex(0);
    setAnswers({});
    setDone(false);
  };

  if ((loading || catalogLoading) && !content) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.gold} />
        </View>
      </SafeAreaView>
    );
  }

  if (!content || !session) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.title}>This page is empty.</Text>
          <Text style={styles.body}>{error || 'The backend has no content for this day yet.'}</Text>
          <Button title="Back" onPress={() => router.back()} color={colors.gold} style={{ marginTop: spacing.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  const meta = PART_META[part];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: meta.tint }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Day {day} · {meta.label}</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.tabs}>
          {PARTS.map((p) => (
            <TouchableOpacity key={p} onPress={() => openPart(p)} style={[styles.tab, part === p && styles.tabOn]}>
              <Text style={[styles.tabText, part === p && styles.tabTextOn]}>{PART_META[p].label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${Math.round((done ? 1 : progressValue) * 100)}%`, backgroundColor: meta.soft }]} />
        </View>

        {done ? (
          <View style={styles.doneWrap}>
            <Text style={styles.eyebrow}>{session.eyebrow}</Text>
            <Text style={styles.title}>That's it.</Text>
            <Text style={styles.body}>
              You showed up for {meta.label.toLowerCase()}. Nothing else is required.
            </Text>
            <View style={{ height: spacing.xl }} />
            {part !== 'evening' && (
              <Button
                title={part === 'morning' ? "Today's practice" : 'Evening look-back'}
                onPress={() => openPart(part === 'morning' ? 'exercise' : 'evening')}
                color={colors.gold}
              />
            )}
            <Button title="Back to the path" variant="ghost" onPress={() => router.back()} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Text style={styles.eyebrow}>{session.eyebrow}</Text>
            <Text style={styles.kicker}>{session.purpose}</Text>
            {stepIndex === 0 && session.intro ? (
              <Text style={styles.intro}>{session.intro}</Text>
            ) : null}
            <Text style={styles.prompt}>{step?.prompt}</Text>
            {step?.hint ? <Text style={styles.hint}>{step.hint}</Text> : null}

            {step ? <StepBody step={step} value={answers[step.id]} onChange={write} accent={meta.soft} /> : null}

            <View style={{ height: spacing.xxl }} />
            <Button
              title={step?.type === 'notice' ? step.cta || 'Continue' : stepIndex === steps.length - 1 ? 'Save this moment' : 'Continue'}
              onPress={() => goNext(false)}
              color={colors.gold}
              disabled={!canContinue || saving}
              loading={saving}
            />
            {step?.allowSkip ? (
              <Button
                title={session.skipLabel || "That's enough for now"}
                variant="ghost"
                onPress={() => goNext(true)}
                disabled={saving}
              />
            ) : null}
            <Text style={styles.stepCount}>
              {stepIndex + 1} of {steps.length} · about a minute
            </Text>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StepBody({
  step,
  value,
  onChange,
  accent,
}: {
  step: JourneyStep;
  value?: string;
  onChange: (v: string) => void;
  accent: string;
}) {
  if (step.type === 'notice') {
    return step.body ? <Text style={styles.noticeBody}>{step.body}</Text> : null;
  }

  if (step.type === 'one-line') {
    return (
      <View style={styles.card}>
        <WritingLineInput
          value={value && value !== '__skip__' ? value : ''}
          onChangeText={onChange}
          placeholder={step.placeholder || 'A few words are enough…'}
          multiline
        />
      </View>
    );
  }

  if (step.type === 'this-or-that' && step.left && step.right) {
    return (
      <View style={{ gap: 12 }}>
        {[step.left, step.right].map((opt) => {
          const on = value === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => onChange(opt.id)}
              style={[styles.choiceCard, on && { borderColor: accent, backgroundColor: '#fff' }]}
              activeOpacity={0.85}
            >
              <Text style={styles.choiceTitle}>{opt.label}</Text>
              {opt.sub ? <Text style={styles.choiceSub}>{opt.sub}</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  if (step.type === 'scale' && step.labels) {
    return (
      <View style={{ gap: 8 }}>
        {step.labels.map((label, i) => {
          const id = String(i + 1);
          const on = value === id;
          return (
            <TouchableOpacity
              key={id}
              onPress={() => onChange(id)}
              style={[styles.scaleRow, on && { borderColor: accent, backgroundColor: '#fff' }]}
            >
              <View style={[styles.scaleDot, on && { backgroundColor: accent }]} />
              <Text style={styles.scaleLabel}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  const options = step.options || [];
  return (
    <View style={styles.chipWrap}>
      {options.map((opt) => {
        const on = value === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onChange(opt.id)}
            style={[styles.chip, on && { backgroundColor: accent, borderColor: accent }]}
            activeOpacity={0.85}
          >
            <Text style={[styles.chipText, on && styles.chipTextOn]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  close: { fontFamily: 'Nunito', fontSize: 14, fontWeight: '700', color: colors.ink },
  headerTitle: { fontFamily: 'Nunito', fontSize: 13, fontWeight: '700', color: colors.inkSoft },
  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  tab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.45)' },
  tabOn: { backgroundColor: '#fff' },
  tabText: { fontFamily: 'Nunito', fontSize: 12, fontWeight: '700', color: colors.inkSoft },
  tabTextOn: { color: colors.ink },
  barTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.55)', marginHorizontal: spacing.lg, borderRadius: 99 },
  barFill: { height: 6, borderRadius: 99 },
  scroll: { padding: spacing.lg, paddingBottom: 80 },
  eyebrow: { fontFamily: 'Nunito', fontSize: 10.5, fontWeight: '800', letterSpacing: 2.6, color: colors.inkSoft, marginBottom: 8 },
  kicker: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft, marginBottom: spacing.md },
  intro: { fontFamily: 'Nunito', fontSize: 14, color: colors.ink, lineHeight: 21, marginBottom: spacing.md },
  prompt: { fontFamily: 'Fraunces', fontSize: 26, fontWeight: '600', color: colors.ink, lineHeight: 32, marginBottom: spacing.md },
  hint: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft, marginBottom: spacing.md, lineHeight: 19 },
  noticeBody: { fontFamily: 'Nunito', fontSize: 15, color: colors.ink, lineHeight: 23, marginBottom: spacing.lg },
  card: { backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.lg, ...shadow.soft },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E7E2D8',
  },
  chipText: { fontFamily: 'Nunito', fontSize: 14, fontWeight: '700', color: colors.ink },
  chipTextOn: { color: '#fff' },
  choiceCard: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: '#E7E2D8',
  },
  choiceTitle: { fontFamily: 'Nunito', fontSize: 16, fontWeight: '800', color: colors.ink },
  choiceSub: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft, marginTop: 4, lineHeight: 18 },
  scaleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  scaleDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#D8CFC0' },
  scaleLabel: { fontFamily: 'Nunito', fontSize: 14, fontWeight: '700', color: colors.ink },
  stepCount: { fontFamily: 'Nunito', fontSize: 12, color: colors.inkSoft, textAlign: 'center', marginTop: spacing.md },
  title: { fontFamily: 'Fraunces', fontSize: 32, fontWeight: '600', color: colors.ink },
  body: { fontFamily: 'Nunito', fontSize: 15, color: colors.inkSoft, lineHeight: 22, marginTop: spacing.sm },
  doneWrap: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
});
