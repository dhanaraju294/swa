import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../design-system/Button';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { colors, spacing, radius, shadow } from '../../design-system/tokens';
import { useDailyCatalog, useDailyDay, useSaveJourneyPart, useStoredPartAnswers } from '../../hooks/useDailyJourney';
import { useUI } from '../../hooks/useUI';
import type { JourneyPart, JourneySession, JourneyStep } from '../../journey/types';

const PARTS: JourneyPart[] = ['morning', 'exercise', 'evening'];

const PART_META: Record<JourneyPart, { label: string; tint: string; soft: string; badge: string }> = {
  morning: {
    label: 'Morning',
    tint: '#FDF6EC',
    soft: '#F6C453',
    badge: '☀️ Dawn',
  },
  exercise: {
    label: 'Practice',
    tint: '#F1F7EF',
    soft: '#8fbf8f',
    badge: '🌱 Practice',
  },
  evening: {
    label: 'Evening',
    tint: '#F3EEF9',
    soft: '#c3a6e0',
    badge: '🌙 Dusk',
  },
};

const DEFAULT_FACES = ['😴', '😕', '😐', '🙂', '🚀'];

function sessionOf(content: NonNullable<ReturnType<typeof useDailyDay>['content']>, part: JourneyPart): JourneySession {
  return content[part];
}

function parseAnswerDraft(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
    );
  } catch {
    return {};
  }
}

export default function SessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ day?: string; part?: string }>();
  const { exerciseDay, reflectionDay, statusByDay, loading: catalogLoading } = useDailyCatalog();
  const partParam = Array.isArray(params.part) ? params.part[0] : params.part;
  const part = (PARTS.includes(partParam as JourneyPart) ? partParam : 'morning') as JourneyPart;
  const currentFlowDay = part === 'exercise' ? exerciseDay : reflectionDay;
  const requestedDay = parseInt(Array.isArray(params.day) ? params.day[0] : params.day || '', 10);
  const requestedIsSaved = Number.isFinite(requestedDay) && Boolean(statusByDay[requestedDay]?.[part]);
  // Older saved sessions can still be reviewed, but an incomplete future day
  // cannot be opened ahead of its own flow's current step.
  const day =
    Number.isFinite(requestedDay) && requestedDay > 0
      ? requestedDay <= currentFlowDay || requestedIsSaved
        ? requestedDay
        : currentFlowDay
      : currentFlowDay;

  const { content, loading, refresh: refreshDay } = useDailyDay(day);
  const { savePart, saving, error: saveError, clearError: clearSaveError } = useSaveJourneyPart();
  const { stored, storedKey, loading: storedLoading } = useStoredPartAnswers(day, part);
  const sessionDraftKey = `journey-${part}-${day}`;
  const localAnswerDraft = useUI((state) => state.journalDrafts[sessionDraftKey]);
  const setJournalDraft = useUI((state) => state.setJournalDraft);
  const clearJournalDraft = useUI((state) => state.clearJournalDraft);

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [unexpectedSaveError, setUnexpectedSaveError] = useState('');

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const savingRef = useRef(false);
  const advancingRef = useRef(false);

  const session = content ? sessionOf(content, part) : null;
  const steps = session?.steps ?? [];
  const step = steps[stepIndex];
  const progressValue = steps.length ? (stepIndex + 1) / steps.length : 0;

  const persistAnswers = useCallback(
    (next: Record<string, string>) => {
      answersRef.current = next;
      setAnswers(next);
      setJournalDraft(sessionDraftKey, JSON.stringify(next));
    },
    [sessionDraftKey, setJournalDraft],
  );

  const canContinue = useMemo(() => {
    if (!step) return false;
    if (step.optional || step.allowSkip) return true;
    if (step.type === 'notice' || step.type === 'info') return true;
    if (step.type === 'breathe' || step.type === 'countdown') return true;
    if (step.type === 'text' || step.type === 'one-line') return true;

    const answer = answers[step.id];
    if (!answer) return false;
    if (step.type === 'tap' || step.type === 'choice') {
      return !answer.startsWith('other:') || Boolean(answer.slice('other:'.length).trim());
    }
    if (step.type === 'chips' || step.type === 'multitap') {
      try {
        const selected = JSON.parse(answer) as unknown;
        return (
          Array.isArray(selected) &&
          selected.some(
            (item) =>
              typeof item === 'string' &&
              Boolean(item.trim()) &&
              (!item.startsWith('Other: ') || Boolean(item.slice('Other: '.length).trim())),
          )
        );
      } catch {
        return answer.split(',').some((item) => item.trim());
      }
    }
    return true;
  }, [answers, step]);

  const write = useCallback(
    (value: string) => {
      if (!step) return;
      setUnexpectedSaveError('');
      clearSaveError();
      persistAnswers({ ...answersRef.current, [step.id]: value });
    },
    [clearSaveError, persistAnswers, step?.id],
  );

  const goNext = useCallback(
    async (forceSkip = false) => {
      if (!session || !content || savingRef.current || advancingRef.current) return;

      const currentAnswers = answersRef.current;
      const finalAnswers =
        forceSkip && step
          ? {
              ...currentAnswers,
              [step.id]: currentAnswers[step.id] || '__skip__',
            }
          : currentAnswers;
      if (forceSkip) persistAnswers(finalAnswers);
      setUnexpectedSaveError('');
      clearSaveError();

      if (stepIndex < steps.length - 1) {
        advancingRef.current = true;
        setStepIndex((index) => index + 1);
        return;
      }

      savingRef.current = true;
      try {
        const result = await savePart(day, part, finalAnswers);
        if (result.error) return;
        clearJournalDraft(sessionDraftKey);
        setDone(true);
      } catch (error) {
        console.warn('Could not save this journey step:', error);
        setUnexpectedSaveError('Could not save this activity. Your answers are still here; please try again.');
      } finally {
        savingRef.current = false;
      }
    },
    [
      session,
      content,
      step,
      stepIndex,
      steps.length,
      savePart,
      day,
      part,
      clearSaveError,
      clearJournalDraft,
      sessionDraftKey,
      persistAnswers,
    ],
  );

  // Hydrate submitted answers first, otherwise restore this flow's unfinished
  // local draft. The key guard prevents stale in-flight reads from replacing a
  // different day/part and keeps post-save refreshes from resetting the screen.
  const hydratedKey = useRef<string | null>(null);
  const storedKeyForView = `${part}-${day}`;
  const storedReady = !storedLoading && storedKey === storedKeyForView;
  useEffect(() => {
    advancingRef.current = false;
  }, [stepIndex]);
  useEffect(() => {
    if (!storedReady) return;
    if (hydratedKey.current === storedKeyForView) return;
    hydratedKey.current = storedKeyForView;
    advancingRef.current = false;
    setStepIndex(0);
    setDone(false);
    setUnexpectedSaveError('');
    clearSaveError();
    const restored = stored?.answers ?? parseAnswerDraft(localAnswerDraft);
    if (stored) clearJournalDraft(sessionDraftKey);
    answersRef.current = { ...restored };
    setAnswers({ ...restored });
  }, [storedReady, storedKeyForView, stored, localAnswerDraft, clearSaveError, clearJournalDraft, sessionDraftKey]);

  if (catalogLoading || loading || !storedReady) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.leafInk} size="large" accessibilityLabel="Loading your activity" />
          <Text style={styles.body}>Loading this activity…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!content || !session) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>This activity could not be loaded.</Text>
          <Text style={styles.body}>Your saved progress is unchanged. Please try again.</Text>
          <Button
            title="Try again"
            onPress={refreshDay}
            color={colors.gold}
            loading={loading}
            disabled={loading}
            style={{ marginTop: spacing.lg }}
          />
          <Button title="Back" onPress={() => router.back()} variant="ghost" style={{ marginTop: spacing.sm }} />
        </View>
      </SafeAreaView>
    );
  }

  const meta = PART_META[part];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: meta.tint }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={14}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close activity"
            accessibilityHint="Your unfinished answers are saved on this device."
          >
            <Text style={styles.close}>✕ Close</Text>
          </TouchableOpacity>
          <View style={styles.headerPill}>
            <Text style={styles.headerTitle}>
              Day {day} · {meta.badge}
            </Text>
          </View>
          <View style={{ width: 60 }} accessible={false} />
        </View>

        <View
          style={styles.barTrack}
          accessibilityRole="progressbar"
          accessibilityLabel={`${meta.label} progress`}
          accessibilityValue={{
            min: 0,
            max: 100,
            now: Math.round((done ? 1 : progressValue) * 100),
          }}
        >
          <View
            style={[
              styles.barFill,
              {
                width: `${Math.round((done ? 1 : progressValue) * 100)}%`,
                backgroundColor: meta.soft,
              },
            ]}
          />
        </View>

        {stored && !done ? (
          <View style={styles.editingBanner}>
            <Text style={styles.editingText}>
              You already completed this — your answers are loaded. Change anything, then save again.
            </Text>
          </View>
        ) : null}

        {done ? (
          <View style={styles.doneWrap}>
            <View style={styles.doneCard}>
              <Text style={styles.doneEmoji} accessible={false}>
                ✨
              </Text>
              <Text style={styles.eyebrow}>{session.eyebrow}</Text>
              <Text style={styles.doneTitle}>That's it.</Text>
              <Text style={styles.doneBody}>
                {part === 'exercise'
                  ? `You completed Exercise Day ${day}. Your progress is saved.`
                  : `You completed the ${meta.label.toLowerCase()} reflection for Day ${day}. Your progress is saved.`}
              </Text>
              <View style={{ height: spacing.xl }} />
              <Button title="Back to the path" color={colors.gold} onPress={() => router.back()} />
            </View>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.screenCard}>
              <View style={styles.kickerRow}>
                <Text style={styles.eyebrow}>{step?.kicker || session.eyebrow || 'SELF-AWARENESS'}</Text>
                <Text style={styles.stepBadge} accessibilityLabel={`Step ${stepIndex + 1} of ${steps.length}`}>
                  {stepIndex + 1} of {steps.length}
                </Text>
              </View>

              <Text style={styles.prompt} accessibilityRole="header">
                {step?.prompt}
              </Text>
              {step?.hint ? <Text style={styles.hint}>{step.hint}</Text> : null}
              {step ? <StepRenderer step={step} value={answers[step.id]} onChange={write} accent={meta.soft} /> : null}

              {saveError || unexpectedSaveError ? (
                <View style={styles.saveErrorBox}>
                  <Text style={styles.saveErrorText} accessibilityRole="alert" accessibilityLiveRegion="polite">
                    {saveError || unexpectedSaveError}
                  </Text>
                </View>
              ) : null}

              <View style={styles.navRow}>
                <Button
                  title={
                    step?.type === 'notice' || step?.type === 'info'
                      ? step.cta || 'Continue →'
                      : stepIndex === steps.length - 1
                        ? 'Save this moment ✓'
                        : 'Continue →'
                  }
                  onPress={() => goNext(false)}
                  color={colors.gold}
                  disabled={!canContinue || saving}
                  loading={saving}
                  style={styles.primaryBtn}
                />
                {step?.allowSkip ? (
                  <TouchableOpacity
                    onPress={() => goNext(true)}
                    disabled={saving}
                    style={styles.skipBtn}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={session.skipLabel || "That's enough for now"}
                  >
                    <Text style={styles.skipText}>{session.skipLabel || "That's enough for now"}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StepRenderer({
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
  switch (step.type) {
    case 'notice':
    case 'info':
      return <InfoBody step={step} accent={accent} />;
    case 'scale':
      return <ScaleBody step={step} value={value} onChange={onChange} accent={accent} />;
    case 'slider':
      return <SliderBody step={step} value={value} onChange={onChange} accent={accent} />;
    case 'truefalse':
    case 'quiz':
      return <TrueFalseBody step={step} value={value} onChange={onChange} accent={accent} />;
    case 'chips':
    case 'multitap':
      return <MultiChoiceBody step={step} value={value} onChange={onChange} accent={accent} />;
    case 'breathe':
      return <BreatheBody step={step} value={value} onChange={onChange} accent={accent} />;
    case 'spin':
      return <SpinBody step={step} value={value} onChange={onChange} accent={accent} />;
    case 'countdown':
      return <CountdownBody step={step} value={value} onChange={onChange} accent={accent} />;
    case 'text':
    case 'one-line':
      return <TextPromiseBody step={step} value={value} onChange={onChange} />;
    case 'this-or-that':
      return <ThisOrThatBody step={step} value={value} onChange={onChange} accent={accent} />;
    case 'tap':
    case 'choice':
    default:
      return <TapChoiceBody step={step} value={value} onChange={onChange} accent={accent} />;
  }
}

// 1. Single Choice / Tap Cards
function TapChoiceBody({
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
  const options = step.options || [];
  const isOtherActive = Boolean(value?.startsWith('other:'));
  const otherText = isOtherActive && value ? value.replace('other:', '') : '';

  return (
    <View style={styles.optionStack} accessibilityRole="radiogroup" accessibilityLabel={step.prompt || 'Choose one'}>
      {options.map((opt) => {
        const isOptOther = opt.isOther || opt.id === 'other';
        const isSelected = isOptOther ? isOtherActive : value === opt.id || value === opt.label;
        return (
          <View key={opt.id} style={{ marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => onChange(isOptOther ? `other:${otherText}` : opt.label)}
              style={[styles.optionCard, isSelected && styles.optionCardActive]}
              activeOpacity={0.85}
              accessibilityRole="radio"
              accessibilityLabel={opt.label}
              accessibilityState={{ checked: isSelected, selected: isSelected }}
            >
              <View style={styles.optionContent}>
                {opt.emoji ? (
                  <Text style={styles.optionEmoji} accessible={false}>
                    {opt.emoji}
                  </Text>
                ) : null}
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>{opt.label}</Text>
              </View>
              <View style={[styles.radioDot, isSelected && styles.radioDotActive]} accessible={false}>
                {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
            </TouchableOpacity>

            {isOptOther && isSelected ? (
              <TextInput
                style={styles.otherInput}
                placeholder="Type your answer here..."
                placeholderTextColor={colors.ghost}
                value={otherText}
                onChangeText={(text) => onChange(`other:${text}`)}
                accessibilityLabel="Your other answer"
                accessibilityHint="Type a short answer"
                returnKeyType="done"
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function MultiChoiceBody({
  step,
  value,
  onChange,
}: {
  step: JourneyStep;
  value?: string;
  onChange: (v: string) => void;
  accent: string;
}) {
  const options = step.options || [];
  const selectedList = useMemo(() => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }, [value]);

  const toggle = (label: string) => {
    const nextList = selectedList.includes(label)
      ? selectedList.filter((item) => item !== label)
      : [...selectedList, label];
    onChange(JSON.stringify(nextList));
  };

  const hasOther = options.some((option) => option.isOther || option.id === 'other');
  const otherSelected = selectedList.some((item) => item.startsWith('Other: '));
  const customText = otherSelected
    ? (selectedList.find((item) => item.startsWith('Other: ')) || '').replace('Other: ', '')
    : '';

  return (
    <View style={styles.optionStack}>
      {options.map((option) => {
        const isOther = option.isOther || option.id === 'other';
        const selected = isOther ? otherSelected : selectedList.includes(option.label);
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => {
              if (isOther) {
                const next = otherSelected
                  ? selectedList.filter((item) => !item.startsWith('Other: '))
                  : [...selectedList, `Other: ${customText}`];
                onChange(JSON.stringify(next));
              } else {
                toggle(option.label);
              }
            }}
            style={[styles.optionCard, selected && styles.optionCardActive]}
            activeOpacity={0.85}
            accessibilityRole="checkbox"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected, selected }}
          >
            <View style={styles.optionContent}>
              {option.emoji ? (
                <Text style={styles.optionEmoji} accessible={false}>
                  {option.emoji}
                </Text>
              ) : null}
              <Text style={[styles.optionLabel, selected && styles.optionLabelActive]}>{option.label}</Text>
            </View>
            <View style={[styles.multiBox, selected && styles.multiBoxActive]} accessible={false}>
              {selected ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
          </TouchableOpacity>
        );
      })}
      {hasOther && otherSelected ? (
        <TextInput
          style={styles.otherInput}
          placeholder="Other (type here)..."
          placeholderTextColor={colors.ghost}
          value={customText}
          onChangeText={(text) => {
            const next = selectedList.filter((item) => !item.startsWith('Other: '));
            onChange(JSON.stringify([...next, `Other: ${text}`]));
          }}
          accessibilityLabel="Your other answer"
          accessibilityHint="Type a short answer"
          returnKeyType="done"
        />
      ) : null}
    </View>
  );
}

function ScaleBody({
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
  const lowLabel = step.low || step.labels?.[0] || 'Low';
  const highLabel = step.high || step.labels?.[step.labels.length - 1] || 'High';

  return (
    <View style={styles.scaleCard}>
      <View
        style={styles.scaleRow}
        accessibilityRole="radiogroup"
        accessibilityLabel={step.prompt || 'Choose a rating'}
      >
        {[1, 2, 3, 4, 5].map((number) => {
          const selected = value === String(number);
          return (
            <TouchableOpacity
              key={number}
              style={[styles.scaleBtn, selected && styles.scaleBtnActive]}
              onPress={() => onChange(String(number))}
              activeOpacity={0.85}
              accessibilityRole="radio"
              accessibilityLabel={`${number} of 5`}
              accessibilityHint={`${lowLabel} to ${highLabel}`}
              accessibilityState={{ checked: selected, selected }}
            >
              <Text style={[styles.scaleBtnText, selected && styles.scaleBtnTextActive]}>{number}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.scaleEnds}>
        <Text style={styles.scaleEndText}>1 · {lowLabel}</Text>
        <Text style={styles.scaleEndText}>{highLabel} · 5</Text>
      </View>
    </View>
  );
}

function SliderBody({
  step,
  value,
  onChange,
}: {
  step: JourneyStep;
  value?: string;
  onChange: (v: string) => void;
  accent: string;
}) {
  const faces = step.faces && step.faces.length > 0 ? step.faces : DEFAULT_FACES;
  const numVal = parseInt(value || '3', 10);
  const faceIdx = Math.max(0, Math.min(faces.length - 1, Math.round(((numVal - 1) / 4) * (faces.length - 1))));
  const currentFace = faces[faceIdx] || '🙂';
  const lowLabel = step.low || 'Low';
  const highLabel = step.high || 'High';

  return (
    <View style={styles.faceSliderCard}>
      <View style={styles.faceDisplay} accessibilityLiveRegion="polite">
        <Text style={styles.bigFace} accessible={false}>
          {currentFace}
        </Text>
        <Text style={styles.faceValue}>{numVal} / 5</Text>
      </View>
      <View
        style={styles.scaleRow}
        accessibilityRole="radiogroup"
        accessibilityLabel={step.prompt || 'Choose a rating'}
      >
        {[1, 2, 3, 4, 5].map((number) => {
          const selected = numVal === number && value !== undefined;
          return (
            <TouchableOpacity
              key={number}
              style={[styles.scaleBtn, selected && styles.scaleBtnActive]}
              onPress={() => onChange(String(number))}
              activeOpacity={0.85}
              accessibilityRole="radio"
              accessibilityLabel={`${number} of 5`}
              accessibilityHint={`${lowLabel} to ${highLabel}`}
              accessibilityState={{ checked: selected, selected }}
            >
              <Text style={[styles.scaleBtnText, selected && styles.scaleBtnTextActive]}>{number}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.scaleEnds}>
        <Text style={styles.scaleEndText}>1 · {lowLabel}</Text>
        <Text style={styles.scaleEndText}>{highLabel} · 5</Text>
      </View>
    </View>
  );
}

function TrueFalseBody({
  step,
  value,
  onChange,
}: {
  step: JourneyStep;
  value?: string;
  onChange: (v: string) => void;
  accent: string;
}) {
  const options =
    step.options && step.options.length > 0
      ? step.options
      : [
          { id: 'true', label: "Yes, that's me" },
          { id: 'false', label: 'Not really' },
        ];
  const revealText = step.reveal || step.fact;

  return (
    <View style={styles.optionStack} accessibilityRole="radiogroup" accessibilityLabel={step.prompt || 'Choose one'}>
      {options.map((option) => {
        const selected = value === option.id || value === option.label;
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => onChange(option.label)}
            style={[styles.optionCard, selected && styles.optionCardActive]}
            activeOpacity={0.85}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected, selected }}
          >
            <Text style={[styles.optionLabel, selected && styles.optionLabelActive]}>{option.label}</Text>
            <View style={[styles.radioDot, selected && styles.radioDotActive]} accessible={false}>
              {selected ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
          </TouchableOpacity>
        );
      })}
      {value && revealText ? (
        <View style={styles.revealBox}>
          <Text style={styles.revealIcon}>💡 Insight</Text>
          <Text style={styles.revealText}>{revealText}</Text>
        </View>
      ) : null}
    </View>
  );
}

function BreatheBody({
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
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(12);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setActive(false);
    setPhase('Inhale');
    setSecondsLeft(12);
  }, [step.id]);

  const start = () => {
    if (active) return;
    setActive(true);
    setSecondsLeft(12);
    let count = 12;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      count -= 1;
      setSecondsLeft(count);
      if (count > 8) setPhase('Inhale');
      else if (count > 4) setPhase('Hold');
      else if (count > 0) setPhase('Exhale');
      else {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setActive(false);
        onChange('Breathe session completed');
      }
    }, 1000);
  };

  return (
    <View style={styles.breatheWrap}>
      <View
        style={[styles.breatheCircle, { borderColor: accent }]}
        accessible
        accessibilityLabel={active ? `${phase}, ${secondsLeft} seconds remaining` : 'Breathing exercise ready'}
      >
        <Text style={styles.breathePhase} accessible={false}>
          {active ? phase : '🌿'}
        </Text>
        <Text style={styles.breatheSeconds} accessible={false}>
          {active ? `${secondsLeft}s` : 'Ready'}
        </Text>
      </View>
      <Text style={styles.breatheLabel}>{step.body || 'Breathe in... Hold... Breathe out slowly.'}</Text>
      {!active ? (
        <Button
          title={value ? 'Done ✓ (Tap to repeat)' : 'Start Breathing Exercise'}
          onPress={start}
          color={colors.sage}
          style={{ width: '100%', marginTop: 12 }}
        />
      ) : null}
    </View>
  );
}

function SpinBody({
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
  const options = step.options || [];
  const [spinning, setSpinning] = useState(false);
  const [display, setDisplay] = useState(value || 'Tap spin to reveal your challenge');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setSpinning(false);
    setDisplay(value || 'Tap spin to reveal your challenge');
  }, [step.id, value]);

  const spin = () => {
    if (!options.length || spinning) return;
    setSpinning(true);
    let count = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const randomOption = options[Math.floor(Math.random() * options.length)].label;
      setDisplay(randomOption);
      count += 1;
      if (count > 10) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setSpinning(false);
        const chosen = options[Math.floor(Math.random() * options.length)].label;
        setDisplay(chosen);
        onChange(chosen);
      }
    }, 100);
  };

  return (
    <View style={styles.spinCard}>
      <View
        style={[styles.spinResultBox, value && styles.spinResultBoxSelected]}
        accessible
        accessibilityLabel={value ? `Challenge selected: ${display}` : display}
        accessibilityLiveRegion="polite"
      >
        <Text style={styles.spinEmoji} accessible={false}>
          {value ? '🎉' : '🎲'}
        </Text>
        <Text style={styles.spinText} accessible={false}>
          {display}
        </Text>
      </View>
      <Button
        title={spinning ? 'Spinning...' : value ? 'Spin Again 🎲' : 'Spin! 🎲'}
        onPress={spin}
        disabled={spinning}
        loading={spinning}
        color={colors.gold}
        style={{ width: '100%', marginTop: 14 }}
      />
    </View>
  );
}

function CountdownBody({
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
  const totalSeconds = step.seconds || 10;
  const [seconds, setSeconds] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
    setSeconds(totalSeconds);
  }, [step.id, totalSeconds]);

  const start = () => {
    if (running) return;
    setRunning(true);
    let left = totalSeconds;
    setSeconds(totalSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      left -= 1;
      setSeconds(left);
      if (left <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setRunning(false);
        onChange('Countdown completed');
      }
    }, 1000);
  };

  return (
    <View style={styles.countdownWrap}>
      <View
        style={[styles.countdownRing, { borderColor: accent }]}
        accessible
        accessibilityLabel={value ? 'Countdown completed' : `${seconds} seconds remaining`}
        accessibilityLiveRegion="polite"
      >
        <Text style={styles.countdownNum} accessible={false}>
          {value ? '🌟' : `${seconds}`}
        </Text>
      </View>
      <Text style={styles.countdownLabel}>{value ? 'Completed! Fantastic job.' : 'Take this moment right now.'}</Text>
      {!running && !value ? (
        <Button title="Start Timer" onPress={start} color={colors.gold} style={{ width: '100%', marginTop: 14 }} />
      ) : null}
    </View>
  );
}

function TextPromiseBody({
  step,
  value,
  onChange,
}: {
  step: JourneyStep;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.writingWrap}>
      <WritingLineInput
        value={value && value !== '__skip__' ? value : ''}
        onChangeText={onChange}
        placeholder={step.placeholder || 'Type here... a few honest words are enough'}
        accessibilityLabel={step.prompt || 'Your reflection'}
        accessibilityHint={step.optional ? 'Optional response' : 'Your answer is saved on this device.'}
        returnKeyType="default"
        multiline
      />
    </View>
  );
}

function InfoBody({ step, accent }: { step: JourneyStep; accent: string }) {
  return (
    <View style={[styles.insightCard, { borderColor: accent }]}>
      <View style={styles.insightHeader}>
        <Text style={styles.insightBadge}>💡 {step.insightTitle || 'KEY TAKEAWAY'}</Text>
      </View>
      <Text style={styles.insightBody}>
        {step.body || 'You have taken another conscious step inward today. Keep building your daily momentum.'}
      </Text>
    </View>
  );
}

function ThisOrThatBody({
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
  if (!step.left || !step.right) return null;
  return (
    <View style={{ gap: 12 }} accessibilityRole="radiogroup" accessibilityLabel={step.prompt || 'Choose one'}>
      {[step.left, step.right].map((option) => {
        const selected = value === option.id || value === option.label;
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => onChange(option.label)}
            style={[styles.optionCard, selected && styles.optionCardActive]}
            activeOpacity={0.85}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected, selected }}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.optionLabel, selected && styles.optionLabelActive]}>{option.label}</Text>
              {option.sub ? <Text style={styles.optionSub}>{option.sub}</Text> : null}
            </View>
            <View style={[styles.radioDot, selected && styles.radioDotActive]} accessible={false}>
              {selected ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    minWidth: 60,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  close: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  headerPill: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  headerTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: 0.5,
  },
  barTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginHorizontal: spacing.lg,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  barFill: { height: 6, borderRadius: radius.full },
  editingBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editingText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 17,
  },
  scroll: { padding: spacing.md, paddingBottom: 40 },
  screenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 24,
    ...shadow.lift,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  kickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eyebrow: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  stepBadge: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkSoft,
    backgroundColor: '#F5F2EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  prompt: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 24,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 32,
    marginBottom: 10,
  },
  hint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13.5,
    color: colors.inkSoft,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 16,
  },
  navRow: { marginTop: 24 },
  saveErrorBox: {
    backgroundColor: '#FBEAE4',
    borderLeftWidth: 4,
    borderLeftColor: '#8A3B24',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  saveErrorText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: '#8A3B24',
    lineHeight: 19,
  },
  primaryBtn: { width: '100%' },
  skipBtn: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  skipText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  optionStack: { marginTop: 8 },
  optionCard: {
    minHeight: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#ECE5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow.soft,
  },
  optionCardActive: { borderColor: colors.ink, backgroundColor: '#FFF' },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  optionEmoji: { fontSize: 20, marginRight: 12 },
  optionLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    flex: 1,
    lineHeight: 21,
  },
  optionLabelActive: { color: colors.ink },
  optionSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12.5,
    color: colors.inkSoft,
    marginTop: 3,
  },
  radioDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D8CFC0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  radioDotActive: { borderColor: colors.ink, backgroundColor: colors.gold },
  multiBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D8CFC0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  multiBoxActive: { borderColor: colors.ink, backgroundColor: colors.sage },
  checkMark: { fontSize: 12, fontWeight: '800', color: colors.ink },
  otherInput: {
    minHeight: 44,
    backgroundColor: '#FBF8F4',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.ink,
  },
  scaleCard: {
    backgroundColor: '#FBF8F4',
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  scaleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#ECE5F5',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  scaleBtnActive: { backgroundColor: colors.gold, borderColor: colors.ink },
  scaleBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  scaleBtnTextActive: { color: colors.ink },
  scaleEnds: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  scaleEndText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  faceSliderCard: {
    backgroundColor: '#FBF8F4',
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  faceDisplay: { alignItems: 'center', marginBottom: 12 },
  bigFace: { fontSize: 48, marginBottom: 4 },
  faceValue: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  revealBox: {
    backgroundColor: '#FFF8EE',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
  revealIcon: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    fontWeight: '800',
    color: '#8A5D00',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  revealText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
  },
  breatheWrap: { alignItems: 'center', paddingVertical: 18 },
  breatheCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F7EF',
    marginBottom: 16,
    ...shadow.soft,
  },
  breathePhase: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Fraunces_600SemiBold',
    color: colors.ink,
  },
  breatheSeconds: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: colors.inkSoft,
    marginTop: 4,
  },
  breatheLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    textAlign: 'center',
    color: colors.inkSoft,
    lineHeight: 21,
  },
  spinCard: { alignItems: 'center', marginTop: 8 },
  spinResultBox: {
    width: '100%',
    backgroundColor: '#FDF6EC',
    borderRadius: 18,
    padding: 20,
    borderWidth: 2,
    borderColor: '#ECE5F5',
    alignItems: 'center',
    ...shadow.soft,
  },
  spinResultBoxSelected: { borderColor: colors.gold },
  spinEmoji: { fontSize: 36, marginBottom: 8 },
  spinText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  countdownWrap: { alignItems: 'center', paddingVertical: 18 },
  countdownRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginBottom: 14,
    ...shadow.lift,
  },
  countdownNum: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 32,
    fontWeight: '700',
    color: colors.ink,
  },
  countdownLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: 'center',
  },
  writingWrap: {
    backgroundColor: '#FBF8F4',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  insightCard: {
    backgroundColor: '#FDF7EC',
    borderRadius: 18,
    padding: 20,
    borderLeftWidth: 5,
    marginTop: 8,
    ...shadow.soft,
  },
  insightHeader: { marginBottom: 8 },
  insightBadge: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  insightBody: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14.5,
    color: colors.ink,
    lineHeight: 22,
  },
  emptyTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 28,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
  },
  body: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },
  doneWrap: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  doneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 30,
    alignItems: 'center',
    ...shadow.lift,
  },
  doneEmoji: { fontSize: 48, marginBottom: 12 },
  doneTitle: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 30,
    fontWeight: '700',
    color: colors.ink,
    marginVertical: 6,
  },
  doneBody: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.inkSoft,
    textAlign: 'center',
    lineHeight: 22,
  },
});
