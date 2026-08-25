import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, shadow } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { Button } from '../../design-system/Button';
import {
  SPOT_CLOSING,
  SPOT_FIELDS,
  SPOT_OPENING,
  SPOT_SCREENS,
  type SpotField,
  type SpotQuestion,
} from '../../content/spotCheckin';
import { useSaveSpotCheckin } from '../../hooks/useSpotCheckins';
import type { SpotCheckinInput } from '../../native/InwardEngine';

// The first inward check-in: shown once, right after onboarding. Twelve small
// exercises transcribed from data.html; answers are stored in the Rust
// backend's `spot_checkins` table.

type Draft = Partial<Record<SpotField, string | number>>;
type Phase = { kind: 'opening' } | { kind: 'screen'; index: number } | { kind: 'closing' };

export default function SpotCheckinScreen() {
  const router = useRouter();
  const { save, saving } = useSaveSpotCheckin();
  const [phase, setPhase] = useState<Phase>({ kind: 'opening' });
  const [draft, setDraft] = useState<Draft>({});

  const set = (field: SpotField, value: string | number) =>
    setDraft((d) => ({ ...d, [field]: value }));

  const screenComplete = (index: number) =>
    SPOT_SCREENS[index].questions.every((q) => draft[q.field] !== undefined);

  const screenProgress = (index: number) => {
    const qs = SPOT_SCREENS[index].questions;
    return qs.filter((q) => draft[q.field] !== undefined).length + '/' + qs.length;
  };

  const finish = async () => {
    const missing = SPOT_FIELDS.filter((f) => draft[f] === undefined);
    if (missing.length > 0) return;
    try {
      await save({ ...(draft as SpotCheckinInput) });
      setPhase({ kind: 'closing' });
    } catch (e) {
      Alert.alert('Error', 'Something went wrong saving your check-in. Please try again.');
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
          <Button
            title={SPOT_OPENING.cta}
            onPress={() => setPhase({ kind: 'screen', index: 0 })}
            color={colors.ink}
            style={styles.cta}
          />
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
      <ScrollView contentContainerStyle={styles.scroll}>
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
                {'"Today, I will simply notice and try'}
                {'\n'}
                {String(draft.tinyExperiment)}
                .{'"'}
              </Text>
            </View>
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
        <View style={styles.scaleRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.scaleDot, value === n && styles.scaleDotActive]}
              onPress={() => onSet(question.field, n)}
              activeOpacity={0.8}
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
        <View style={styles.pairRow}>
          {[question.left, question.right].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.option, styles.pairOption, value === opt && styles.optionActive]}
              onPress={() => onSet(question.field, opt)}
              activeOpacity={0.85}
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
      {question.options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.option, value === opt && styles.optionActive]}
          onPress={() => onSet(question.field, opt)}
          activeOpacity={0.85}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.outerBg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  screen: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl },
  centered: { alignItems: 'center' },
  bigTitle: {
    fontFamily: 'Fraunces',
    fontSize: 30,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 38,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  closingTitle: { marginTop: spacing.xxl },
  line: {
    fontFamily: 'Nunito',
    fontSize: 16,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  cta: { marginTop: spacing.xxl, alignSelf: 'stretch' },
  progressHint: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  thisOrThatHint: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: colors.inkSoft,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
  },
  card: { padding: spacing.xl },
  intro: {
    fontFamily: 'Nunito',
    fontSize: 15,
    color: colors.inkSoft,
    lineHeight: 21,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  title: {
    fontFamily: 'Fraunces',
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
    fontFamily: 'Fraunces',
    fontSize: 18,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 24,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  scaleHint: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft, marginBottom: spacing.sm },
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
  scaleDotText: { fontFamily: 'Nunito', fontSize: 16, fontWeight: '800', color: colors.ink },
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
  optionText: { fontFamily: 'Nunito', fontSize: 15, fontWeight: '700', color: colors.ink },
  commit: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  commitText: {
    fontFamily: 'Fraunces',
    fontSize: 18,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 26,
    textAlign: 'center',
  },
});
