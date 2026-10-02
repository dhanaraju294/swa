import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  SPOT_CLOSING,
  SPOT_FIELDS,
  SPOT_OPENING,
  SPOT_SCREENS,
  type SpotField,
  type SpotQuestion,
} from '../../content/spotCheckin';
import { Button } from '../../design-system/Button';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { colors, spacing, radius, shadow } from '../../design-system/tokens';
import { useLatestSpotCheckin, useSaveSpotCheckin } from '../../hooks/useSpotCheckins';
import { useUI } from '../../hooks/useUI';
import type { SpotCheckinInput } from '../../native/InwardEngine';

// The first inward check-in: shown once, right after onboarding. Twelve small
// exercises transcribed from data.html; answers are stored in the Rust
// backend's `spot_checkins` table.

type Draft = Partial<Record<SpotField, string | number>>;
type Phase = { kind: 'opening' } | { kind: 'screen'; index: number } | { kind: 'closing' };

export default function SpotCheckinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ source?: string | string[] }>();
  const source = Array.isArray(params.source) ? params.source[0] : params.source;
  const closeCheckin = () => {
    if (source === 'onboarding') router.replace('/(tabs)');
    else router.back();
  };
  const { save, saving } = useSaveSpotCheckin();
  const { data: latest, loading: latestLoading, refresh: refreshLatest } = useLatestSpotCheckin();
  const [phase, setPhase] = useState<Phase>({ kind: 'opening' });
  const [saveError, setSaveError] = useState('');
  const draft = useUI((state) => state.spotCheckinDraft as Draft);
  const setSavedDraft = useUI((state) => state.setSpotCheckinDraft);
  const clearSavedDraft = useUI((state) => state.clearSpotCheckinDraft);

  // Revisits (after a previous submission) start from the user's own answers
  // instead of a blank slate: hydrate the draft once the latest entry is
  // known, exactly once per mount.
  const hydratedRef = useRef(false);
  const finishingRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current || latestLoading) return;
    hydratedRef.current = true;
    if (Object.keys(draft).length || !latest) return;
    const hydrated: Draft = {};
    for (const field of SPOT_FIELDS) {
      const value = latest[field];
      if (value !== undefined && value !== null) hydrated[field] = value;
    }
    setSavedDraft(hydrated);
  }, [draft, latest, latestLoading, setSavedDraft]);

  const set = (field: SpotField, value: string | number) => {
    const current = useUI.getState().spotCheckinDraft;
    setSavedDraft({ ...current, [field]: value });
    setSaveError('');
  };

  const screenComplete = (index: number) => SPOT_SCREENS[index].questions.every((q) => draft[q.field] !== undefined);

  const screenProgress = (index: number) => {
    const qs = SPOT_SCREENS[index].questions;
    return qs.filter((q) => draft[q.field] !== undefined).length + '/' + qs.length;
  };

  const finish = async () => {
    const missing = SPOT_FIELDS.filter((field) => draft[field] === undefined);
    if (missing.length > 0 || saving || finishingRef.current) return;
    finishingRef.current = true;
    setSaveError('');
    try {
      await save({ ...(draft as SpotCheckinInput) });
      clearSavedDraft();
      await refreshLatest();
      setPhase({ kind: 'closing' });
    } catch (error) {
      console.warn('Failed to save first inward check-in:', error);
      setSaveError('Your answers are still saved on this device. Please try saving again.');
    } finally {
      finishingRef.current = false;
    }
  };

  const next = async () => {
    if (phase.kind !== 'screen') return;
    if (phase.index < SPOT_SCREENS.length - 1) {
      setPhase({ kind: 'screen', index: phase.index + 1 });
    } else {
      await finish();
    }
  };

  if (phase.kind === 'opening') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={[styles.screen, styles.centered]}>
          <Text style={styles.bigTitle}>{SPOT_OPENING.title}</Text>
          {SPOT_OPENING.lines.map((line) => (
            <Text key={line} style={styles.line}>
              {line}
            </Text>
          ))}
          {latestLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.leafInk} accessibilityLabel="Loading your previous answers" />
              <Text style={styles.progressHint}>Checking for saved answers…</Text>
            </View>
          ) : latest ? (
            <Text style={styles.resubmitNote}>
              You've completed this check-in before — your answers are loaded. Review them, change anything, and save
              again.
            </Text>
          ) : null}
          <Text style={styles.privacyNote}>Your answers are saved on this device.</Text>
          <Button
            title={latest ? 'Review my answers' : SPOT_OPENING.cta}
            onPress={() => setPhase({ kind: 'screen', index: 0 })}
            color={colors.ink}
            disabled={latestLoading}
            loading={latestLoading}
            style={styles.cta}
          />
          <TouchableOpacity
            onPress={closeCheckin}
            style={styles.exitButton}
            accessibilityRole="button"
            accessibilityLabel="Close check-in"
          >
            <Text style={styles.exitText}>Not now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (phase.kind === 'closing') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={[styles.screen, styles.centered]}>
          {SPOT_CLOSING.lead.map((line) => (
            <Text key={line} style={styles.line}>
              {line}
            </Text>
          ))}
          <Text style={[styles.bigTitle, styles.closingTitle]}>{SPOT_CLOSING.title}</Text>
          {SPOT_CLOSING.lines.map((line) => (
            <Text key={line} style={styles.line}>
              {line}
            </Text>
          ))}
          <Button
            title={SPOT_CLOSING.cta}
            onPress={() => router.replace('/(tabs)')}
            color={colors.sage}
            style={styles.cta}
          />
        </View>
      </SafeAreaView>
    );
  }

  const def = SPOT_SCREENS[phase.index];
  const done = screenComplete(phase.index);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => setPhase(phase.index > 0 ? { kind: 'screen', index: phase.index - 1 } : { kind: 'opening' })}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel={phase.index > 0 ? 'Previous question group' : 'Back to check-in introduction'}
        >
          <Ionicons name="chevron-back" size={22} color={colors.ink} accessible={false} />
        </TouchableOpacity>
        <View style={styles.progressArea}>
          <View
            style={styles.progressTrack}
            accessibilityRole="progressbar"
            accessibilityLabel="Check-in progress"
            accessibilityValue={{ min: 1, max: SPOT_SCREENS.length, now: phase.index + 1 }}
          >
            <View style={[styles.progressFill, { width: `${((phase.index + 1) / SPOT_SCREENS.length) * 100}%` }]} />
          </View>
          <Text style={styles.screenCount}>
            Part {phase.index + 1} of {SPOT_SCREENS.length}
          </Text>
        </View>
        <TouchableOpacity
          onPress={closeCheckin}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Exit check-in"
          accessibilityHint="Your unfinished answers stay saved on this device."
        >
          <Ionicons name="close" size={22} color={colors.ink} accessible={false} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Card tint={def.tint} style={styles.card}>
          <EyebrowLabel label={def.label} />
          {def.intro ? <Text style={styles.intro}>{def.intro}</Text> : null}
          {def.title ? <Text style={styles.title}>{def.title}</Text> : null}
          {def.questions.map((q, i) => (
            <QuestionBlock key={q.field} question={q} draft={draft} onSet={set} first={i === 0 && !def.title} />
          ))}
          {def.exercise === 12 && draft.tinyExperiment ? (
            <View style={styles.commit}>
              <Text style={styles.commitText}>
                "Today, I will simply notice and try
                {'\n'}
                {String(draft.tinyExperiment)}."
              </Text>
            </View>
          ) : null}
          {saveError ? (
            <Text style={styles.saveError} accessibilityRole="alert" accessibilityLiveRegion="polite">
              {saveError}
            </Text>
          ) : null}
          <Button
            title={phase.index < SPOT_SCREENS.length - 1 ? 'Continue' : 'Finish'}
            onPress={next}
            disabled={!done || saving}
            loading={saving}
            color={colors.gold}
            style={styles.cta}
          />
          {!done ? (
            <Text style={styles.progressHint}>
              {screenProgress(phase.index)} answered — answer all questions to continue
            </Text>
          ) : null}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuestionBlock({
  question,
  draft,
  onSet,
  first,
}: {
  question: SpotQuestion;
  draft: Draft;
  onSet: (field: SpotField, value: string | number) => void;
  first: boolean;
}) {
  const value = draft[question.field];

  if (question.kind === 'scale') {
    return (
      <View style={styles.question}>
        <Text style={[styles.questionTitle, first && styles.questionFirst]}>{question.title}</Text>
        <Text style={styles.scaleHint}>
          {question.low}, {question.high}
        </Text>
        <View style={styles.scaleRow} accessibilityRole="radiogroup" accessibilityLabel={question.title}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.scaleDot, value === n && styles.scaleDotActive]}
              onPress={() => onSet(question.field, n)}
              activeOpacity={0.8}
              accessibilityRole="radio"
              accessibilityLabel={`${n} of 5`}
              accessibilityHint={`${question.low} to ${question.high}`}
              accessibilityState={{ checked: value === n, selected: value === n }}
            >
              <Text style={[styles.scaleDotText, value === n && styles.scaleDotTextActive]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  if (question.kind === 'this-or-that') {
    return (
      <View style={styles.question}>
        <Text style={styles.questionTitle}>{question.prompt}</Text>
        <Text style={styles.thisOrThatHint}>Choose the one that feels more meaningful</Text>
        <View style={styles.pairRow} accessibilityRole="radiogroup" accessibilityLabel={question.prompt}>
          {[question.left, question.right].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.option, styles.pairOption, value === opt && styles.optionActive]}
              onPress={() => onSet(question.field, opt)}
              activeOpacity={0.85}
              accessibilityRole="radio"
              accessibilityLabel={opt}
              accessibilityState={{ checked: value === opt, selected: value === opt }}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.question}>
      <Text style={[styles.questionTitle, first && styles.questionFirst]}>{question.title}</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel={question.title}>
        {question.options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.option, value === opt && styles.optionActive]}
            onPress={() => onSet(question.field, opt)}
            activeOpacity={0.85}
            accessibilityRole="radio"
            accessibilityLabel={opt}
            accessibilityState={{ checked: value === opt, selected: value === opt }}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.outerBg },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    backgroundColor: colors.outerBg,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressArea: { flex: 1, gap: 4 },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#D8D2C8',
  },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: colors.leafInk },
  screenCount: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkSoft,
    textAlign: 'center',
  },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  loadingRow: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
  privacyNote: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  exitButton: { minHeight: 44, minWidth: 44, justifyContent: 'center', padding: spacing.sm, marginTop: spacing.sm },
  exitText: { fontFamily: 'Nunito_700Bold', fontSize: 14, fontWeight: '700', color: colors.inkSoft },
  saveError: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    fontWeight: '700',
    color: '#8A3B24',
    lineHeight: 19,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  screen: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl },
  centered: { alignItems: 'center' },
  bigTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 30,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 38,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  closingTitle: { marginTop: spacing.xxl },
  line: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  cta: { marginTop: spacing.xxl, alignSelf: 'stretch' },
  resubmitNote: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressHint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  thisOrThatHint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.inkSoft,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
  },
  card: { padding: spacing.xl },
  intro: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.inkSoft,
    lineHeight: 21,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 22,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 29,
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  question: { marginTop: spacing.lg },
  questionFirst: { marginTop: 0 },
  questionTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 24,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  scaleHint: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: colors.inkSoft, marginBottom: spacing.sm },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: spacing.md },
  scaleDot: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  scaleDotActive: { backgroundColor: colors.gold },
  scaleDotText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 16, fontWeight: '800', color: colors.ink },
  scaleDotTextActive: { color: colors.white },
  pairRow: { flexDirection: 'row', gap: spacing.sm },
  pairOption: { flex: 1, marginBottom: 0 },
  option: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadow.soft,
  },
  optionActive: { borderColor: colors.sky },
  optionText: { fontFamily: 'Nunito_700Bold', fontSize: 15, fontWeight: '700', color: colors.ink },
  commit: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  commitText: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 26,
    textAlign: 'center',
  },
});
