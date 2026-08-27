import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
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
  TextInput,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, shadow } from '../../design-system/tokens';
import { Button } from '../../design-system/Button';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { useDailyCatalog, useDailyDay, useSaveJourneyPart } from '../../hooks/useDailyJourney';
import type { JourneyPart, JourneySession, JourneyStep, StepOption } from '../../journey/types';

const PARTS: JourneyPart[] = ['morning', 'exercise', 'evening'];

const PART_META: Record<JourneyPart, { label: string; tint: string; soft: string; badge: string }> = {
  morning: { label: 'Morning', tint: '#FDF6EC', soft: '#F6C453', badge: '☀️ Dawn' },
  exercise: { label: 'Practice', tint: '#F1F7EF', soft: '#8fbf8f', badge: '🌱 Practice' },
  evening: { label: 'Evening', tint: '#F3EEF9', soft: '#c3a6e0', badge: '🌙 Dusk' },
};

const DEFAULT_FACES = ['😴', '😕', '😐', '🙂', '🚀'];

function sessionOf(
  content: NonNullable<ReturnType<typeof useDailyDay>['content']>,
  part: JourneyPart,
): JourneySession {
  return content[part];
}

export default function SessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ day?: string; part?: string }>();
  const { unlockedDay, loading: catalogLoading } = useDailyCatalog();
  const requestedDay = parseInt(Array.isArray(params.day) ? params.day[0] : params.day || '', 10);
  const day = Number.isFinite(requestedDay) && requestedDay > 0 ? requestedDay : unlockedDay;
  const partParam = Array.isArray(params.part) ? params.part[0] : params.part;
  const part = (PARTS.includes(partParam as JourneyPart) ? partParam : 'morning') as JourneyPart;

  const { content, loading, error } = useDailyDay(day);
  const { savePart, saving, error: saveError, clearError: clearSaveError } = useSaveJourneyPart();

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const savingRef = useRef(false);

  const session = content ? sessionOf(content, part) : null;
  const steps = session?.steps ?? [];
  const step = steps[stepIndex];
  const progressValue = steps.length ? (stepIndex + 1) / steps.length : 0;

  const canContinue = useMemo(() => {
    if (!step) return false;
    if (step.optional || step.allowSkip) return true;
    if (step.type === 'notice' || step.type === 'info') return true;
    if (step.type === 'breathe' || step.type === 'countdown') return true;
    if (step.type === 'text' || step.type === 'one-line') return true;
    return Boolean(answers[step.id]);
  }, [answers, step]);

  const write = useCallback((value: string) => {
    if (!step) return;
    setAnswers((prev) => ({ ...prev, [step.id]: value }));
  }, [step?.id]);

  const goNext = useCallback(async (forceSkip = false) => {
    if (!session || !content) return;
    if (savingRef.current) return;

    if (forceSkip && step) {
      setAnswers((prev) => {
        const nextAnswers = { ...prev, [step.id]: prev[step.id] || '__skip__' };
        answersRef.current = nextAnswers;
        return nextAnswers;
      });
    }

    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }

    const finalAnswers = answersRef.current;
    savingRef.current = true;
    clearSaveError();
    try {
      const result = await savePart(day, part, finalAnswers);
      if (result.error) {
        // Alert is a no-op on web, so the error is also rendered inline in the
        // UI (see saveError below) — it must never be the only feedback.
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

  useEffect(() => {
    setStepIndex(0);
    setAnswers({});
    setDone(false);
    clearSaveError();
  }, [part, day, clearSaveError]);

  if ((loading || catalogLoading) && !content) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.gold} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!content || !session) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>This page is empty.</Text>
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
        {/* Navigation Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={14} style={styles.closeBtn}>
            <Text style={styles.close}>✕ Close</Text>
          </TouchableOpacity>
          <View style={styles.headerPill}>
            <Text style={styles.headerTitle}>Day {day} · {meta.badge}</Text>
          </View>
          <View style={{ width: 60 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${Math.round((done ? 1 : progressValue) * 100)}%`, backgroundColor: meta.soft },
            ]}
          />
        </View>

        {done ? (
          <View style={styles.doneWrap}>
            <View style={styles.doneCard}>
              <Text style={styles.doneEmoji}>✨</Text>
              <Text style={styles.eyebrow}>{session.eyebrow}</Text>
              <Text style={styles.doneTitle}>That's it.</Text>
              <Text style={styles.doneBody}>
                You showed up for {meta.label.toLowerCase()} reflection. Nothing else is required. Your data is saved.
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
              {/* Eyebrow / Kicker */}
              <View style={styles.kickerRow}>
                <Text style={styles.eyebrow}>
                  {step?.kicker || session.eyebrow || 'SELF-AWARENESS'}
                </Text>
                <Text style={styles.stepBadge}>
                  {stepIndex + 1} of {steps.length}
                </Text>
              </View>

              {/* Prompt / Question */}
              <Text style={styles.prompt}>{step?.prompt}</Text>

              {/* Gentle Hint / Coaching Note */}
              {step?.hint ? <Text style={styles.hint}>{step.hint}</Text> : null}

              {/* Interactive Step Body */}
              {step ? (
                <StepRenderer
                  step={step}
                  value={answers[step.id]}
                  onChange={write}
                  accent={meta.soft}
                />
              ) : null}

              {/* Inline save error (Alert is a no-op on web, so this is the
                  only feedback there) */}
              {saveError ? (
                <View style={styles.saveErrorBox}>
                  <Text style={styles.saveErrorText}>{saveError}</Text>
                </View>
              ) : null}

              {/* Navigation Action Buttons */}
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
                  >
                    <Text style={styles.skipText}>
                      {session.skipLabel || "That's enough for now"}
                    </Text>
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

// 1. Single Choice / Tap Cards (matches data.html option-btn and tap-grid)
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
    <View style={styles.optionStack}>
      {options.map((opt) => {
        const isOptOther = opt.isOther || opt.id === 'other';
        const isSelected = isOptOther ? isOtherActive : value === opt.id || value === opt.label;

        return (
          <View key={opt.id} style={{ marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => {
                if (isOptOther) {
                  onChange(`other:${otherText}`);
                } else {
                  onChange(opt.label);
                }
              }}
              style={[
                styles.optionCard,
                isSelected && { borderColor: colors.ink, backgroundColor: '#FFF' },
              ]}
              activeOpacity={0.85}
            >
              <View style={styles.optionContent}>
                {opt.emoji ? <Text style={styles.optionEmoji}>{opt.emoji}</Text> : null}
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
                  {opt.label}
                </Text>
              </View>
              <View
                style={[
                  styles.radioDot,
                  isSelected && { borderColor: colors.ink, backgroundColor: colors.gold },
                ]}
              >
                {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
            </TouchableOpacity>

            {isOptOther && isSelected ? (
              <TextInput
                style={styles.otherInput}
                placeholder="Type your answer here..."
                placeholderTextColor={colors.ghost}
                value={otherText}
                onChangeText={(txt) => onChange(`other:${txt}`)}
                autoFocus
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

// 2. Multi Choice / Chips (Pick all that apply, matches HTML chip-wrap)
function MultiChoiceBody({
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
  const selectedList = useMemo(() => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }, [value]);

  const toggle = (label: string) => {
    let nextList: string[];
    if (selectedList.includes(label)) {
      nextList = selectedList.filter((x) => x !== label);
    } else {
      nextList = [...selectedList, label];
    }
    onChange(JSON.stringify(nextList));
  };

  const hasOther = options.some((o) => o.isOther || o.id === 'other');
  const otherSelected = selectedList.some((s) => s.startsWith('Other: '));
  const customText = otherSelected
    ? (selectedList.find((s) => s.startsWith('Other: ')) || '').replace('Other: ', '')
    : '';

  return (
    <View style={styles.optionStack}>
      {options.map((opt) => {
        const isOptOther = opt.isOther || opt.id === 'other';
        const isSelected = isOptOther ? otherSelected : selectedList.includes(opt.label);

        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => {
              if (isOptOther) {
                if (otherSelected) {
                  const filtered = selectedList.filter((s) => !s.startsWith('Other: '));
                  onChange(JSON.stringify(filtered));
                } else {
                  onChange(JSON.stringify([...selectedList, `Other: ${customText}`]));
                }
              } else {
                toggle(opt.label);
              }
            }}
            style={[
              styles.optionCard,
              isSelected && { borderColor: colors.ink, backgroundColor: '#FFF' },
            ]}
            activeOpacity={0.85}
          >
            <View style={styles.optionContent}>
              {opt.emoji ? <Text style={styles.optionEmoji}>{opt.emoji}</Text> : null}
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
                {opt.label}
              </Text>
            </View>
            <View
              style={[
                styles.multiBox,
                isSelected && { borderColor: colors.ink, backgroundColor: colors.sage },
              ]}
            >
              {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
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
          onChangeText={(txt) => {
            const filtered = selectedList.filter((s) => !s.startsWith('Other: '));
            onChange(JSON.stringify([...filtered, `Other: ${txt}`]));
          }}
          autoFocus
        />
      ) : null}
    </View>
  );
}

// 3. 1 to 5 Scale Buttons (matches data.html and week1-4 exercises scale-row)
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
      <View style={styles.scaleRow}>
        {[1, 2, 3, 4, 5].map((n) => {
          const isSelected = value === String(n);
          return (
            <TouchableOpacity
              key={n}
              style={[
                styles.scaleBtn,
                isSelected && { backgroundColor: colors.gold, borderColor: colors.ink },
              ]}
              onPress={() => onChange(String(n))}
              activeOpacity={0.85}
            >
              <Text style={[styles.scaleBtnText, isSelected && styles.scaleBtnTextActive]}>
                {n}
              </Text>
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

// 4. Slider with Face Emojis (matches week1 reflections & week3/4 sliders)
function SliderBody({
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
  const faces = step.faces && step.faces.length > 0 ? step.faces : DEFAULT_FACES;
  const numVal = parseInt(value || '3', 10);
  const faceIdx = Math.max(0, Math.min(faces.length - 1, Math.round(((numVal - 1) / 4) * (faces.length - 1))));
  const currentFace = faces[faceIdx] || '🙂';

  return (
    <View style={styles.faceSliderCard}>
      <View style={styles.faceDisplay}>
        <Text style={styles.bigFace}>{currentFace}</Text>
        <Text style={styles.faceValue}>{numVal} / 5</Text>
      </View>
      <View style={styles.scaleRow}>
        {[1, 2, 3, 4, 5].map((n) => {
          const isSelected = numVal === n;
          return (
            <TouchableOpacity
              key={n}
              style={[
                styles.scaleBtn,
                isSelected && { backgroundColor: colors.gold, borderColor: colors.ink },
              ]}
              onPress={() => onChange(String(n))}
              activeOpacity={0.85}
            >
              <Text style={[styles.scaleBtnText, isSelected && styles.scaleBtnTextActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.scaleEnds}>
        <Text style={styles.scaleEndText}>1 · {step.low || 'Low'}</Text>
        <Text style={styles.scaleEndText}>{step.high || 'High'} · 5</Text>
      </View>
    </View>
  );
}

// 5. True/False and Quiz with coaching reveal (matches HTML truefalse / quiz)
function TrueFalseBody({
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
  const options = step.options && step.options.length > 0
    ? step.options
    : [
        { id: 'true', label: "Yes, that's me" },
        { id: 'false', label: 'Not really' },
      ];

  const revealText = step.reveal || step.fact;

  return (
    <View style={styles.optionStack}>
      {options.map((opt) => {
        const isSelected = value === opt.id || value === opt.label;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onChange(opt.label)}
            style={[
              styles.optionCard,
              isSelected && { borderColor: colors.ink, backgroundColor: '#FFF' },
            ]}
            activeOpacity={0.85}
          >
            <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
              {opt.label}
            </Text>
            <View
              style={[
                styles.radioDot,
                isSelected && { borderColor: colors.ink, backgroundColor: colors.gold },
              ]}
            >
              {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
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

// 6. Interactive Breathing Circle (matches HTML breathe-circle)
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

  const start = () => {
    setActive(true);
    setSecondsLeft(12);
    let count = 12;
    const interval = setInterval(() => {
      count -= 1;
      setSecondsLeft(count);
      if (count > 8) setPhase('Inhale');
      else if (count > 4) setPhase('Hold');
      else if (count > 0) setPhase('Exhale');
      else {
        clearInterval(interval);
        setActive(false);
        onChange('Breathe session completed');
      }
    }, 1000);
  };

  return (
    <View style={styles.breatheWrap}>
      <View style={[styles.breatheCircle, { borderColor: accent }]}>
        <Text style={styles.breathePhase}>{active ? phase : '🌿'}</Text>
        <Text style={styles.breatheSeconds}>{active ? `${secondsLeft}s` : 'Ready'}</Text>
      </View>
      <Text style={styles.breatheLabel}>
        {step.body || 'Breathe in... Hold... Breathe out slowly.'}
      </Text>
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

// 7. Mystery Spin Box (matches HTML spin-grid & spin-btn)
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

  const spin = () => {
    if (options.length === 0) return;
    setSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomOpt = options[Math.floor(Math.random() * options.length)].label;
      setDisplay(randomOpt);
      count += 1;
      if (count > 10) {
        clearInterval(interval);
        setSpinning(false);
        const chosen = options[Math.floor(Math.random() * options.length)].label;
        setDisplay(chosen);
        onChange(chosen);
      }
    }, 100);
  };

  return (
    <View style={styles.spinCard}>
      <View style={[styles.spinResultBox, value && { borderColor: colors.gold }]}>
        <Text style={styles.spinEmoji}>{value ? '🎉' : '🎲'}</Text>
        <Text style={styles.spinText}>{display}</Text>
      </View>
      <Button
        title={spinning ? 'Spinning...' : value ? 'Spin Again 🎲' : 'Spin! 🎲'}
        onPress={spin}
        disabled={spinning}
        color={colors.gold}
        style={{ width: '100%', marginTop: 14 }}
      />
    </View>
  );
}

// 8. Countdown Timer Ring (matches HTML countdown-ring)
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

  const start = () => {
    setRunning(true);
    let left = totalSeconds;
    const interval = setInterval(() => {
      left -= 1;
      setSeconds(left);
      if (left <= 0) {
        clearInterval(interval);
        setRunning(false);
        onChange('Countdown completed');
      }
    }, 1000);
  };

  return (
    <View style={styles.countdownWrap}>
      <View style={[styles.countdownRing, { borderColor: accent }]}>
        <Text style={styles.countdownNum}>{value ? '🌟' : `${seconds}`}</Text>
      </View>
      <Text style={styles.countdownLabel}>
        {value ? 'Completed! Fantastic job.' : 'Take this moment right now.'}
      </Text>
      {!running && !value ? (
        <Button
          title="Start Timer"
          onPress={start}
          color={colors.gold}
          style={{ width: '100%', marginTop: 14 }}
        />
      ) : null}
    </View>
  );
}

// 9. Text / Promise Input (matches HTML textarea and promise input)
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
        multiline
      />
    </View>
  );
}

// 10. Info / Insight Takeaway Card (matches HTML insight-box)
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

// 11. This-or-That (2-column cards)
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
    <View style={{ gap: 12 }}>
      {[step.left, step.right].map((opt) => {
        const isSelected = value === opt.id || value === opt.label;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onChange(opt.label)}
            style={[
              styles.optionCard,
              isSelected && { borderColor: colors.ink, backgroundColor: '#FFF' },
            ]}
            activeOpacity={0.85}
          >
            <View>
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
                {opt.label}
              </Text>
              {opt.sub ? <Text style={styles.optionSub}>{opt.sub}</Text> : null}
            </View>
            <View
              style={[
                styles.radioDot,
                isSelected && { borderColor: colors.ink, backgroundColor: colors.gold },
              ]}
            >
              {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
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
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  close: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  headerPill: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  headerTitle: {
    fontFamily: 'Nunito',
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
  barFill: {
    height: 6,
    borderRadius: radius.full,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: 40,
  },
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
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  stepBadge: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkSoft,
    backgroundColor: '#F5F2EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  prompt: {
    fontFamily: 'Fraunces',
    fontSize: 24,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 32,
    marginBottom: 10,
  },
  hint: {
    fontFamily: 'Nunito',
    fontSize: 13.5,
    color: colors.inkSoft,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 16,
  },
  navRow: {
    marginTop: 24,
  },
  saveErrorBox: {
    backgroundColor: '#FBEAE4',
    borderLeftWidth: 4,
    borderLeftColor: '#D4795F',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  saveErrorText: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: '#8A3B24',
    lineHeight: 18,
  },
  primaryBtn: {
    width: '100%',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  skipText: {
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  optionStack: {
    marginTop: 8,
  },
  optionCard: {
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
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  optionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  optionLabel: {
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    flex: 1,
    lineHeight: 21,
  },
  optionLabelActive: {
    color: colors.ink,
  },
  optionSub: {
    fontFamily: 'Nunito',
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
  multiBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D8CFC0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  checkMark: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
  },
  otherInput: {
    backgroundColor: '#FBF8F4',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    fontFamily: 'Nunito',
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
  scaleBtnText: {
    fontFamily: 'Nunito',
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  scaleBtnTextActive: {
    color: colors.ink,
  },
  scaleEnds: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  scaleEndText: {
    fontFamily: 'Nunito',
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
  faceDisplay: {
    alignItems: 'center',
    marginBottom: 12,
  },
  bigFace: {
    fontSize: 48,
    marginBottom: 4,
  },
  faceValue: {
    fontFamily: 'Nunito',
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
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '800',
    color: '#8A5D00',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  revealText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
  },
  breatheWrap: {
    alignItems: 'center',
    paddingVertical: 18,
  },
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
    fontFamily: 'Fraunces',
    color: colors.ink,
  },
  breatheSeconds: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '700',
    color: colors.inkSoft,
    marginTop: 4,
  },
  breatheLabel: {
    fontFamily: 'Nunito',
    fontSize: 14,
    textAlign: 'center',
    color: colors.inkSoft,
    lineHeight: 21,
  },
  spinCard: {
    alignItems: 'center',
    marginTop: 8,
  },
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
  spinEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  spinText: {
    fontFamily: 'Nunito',
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  countdownWrap: {
    alignItems: 'center',
    paddingVertical: 18,
  },
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
    fontFamily: 'Fraunces',
    fontSize: 32,
    fontWeight: '700',
    color: colors.ink,
  },
  countdownLabel: {
    fontFamily: 'Nunito',
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
  insightHeader: {
    marginBottom: 8,
  },
  insightBadge: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  insightBody: {
    fontFamily: 'Nunito',
    fontSize: 14.5,
    color: colors.ink,
    lineHeight: 22,
  },
  emptyTitle: {
    fontFamily: 'Fraunces',
    fontSize: 28,
    fontWeight: '600',
    color: colors.ink,
  },
  body: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 8,
  },
  doneWrap: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  doneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 30,
    alignItems: 'center',
    ...shadow.lift,
  },
  doneEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  doneTitle: {
    fontFamily: 'Fraunces',
    fontSize: 30,
    fontWeight: '700',
    color: colors.ink,
    marginVertical: 6,
  },
  doneBody: {
    fontFamily: 'Nunito',
    fontSize: 15,
    color: colors.inkSoft,
    textAlign: 'center',
    lineHeight: 22,
  },
});
