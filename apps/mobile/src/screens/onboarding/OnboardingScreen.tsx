import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../design-system/Button';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { MoodFacePicker } from '../../design-system/MoodFacePicker';
import { PetalMark } from '../../design-system/PetalMark';
import { PillSlider } from '../../design-system/PillSlider';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { colors, spacing, radius, shadow } from '../../design-system/tokens';
import { useSaveCheckin } from '../../hooks/useCheckins';
import { useProfile } from '../../hooks/useProfile';
import { setSecureFlag } from '../../native/secureFlag';
import {
  CHALLENGES,
  EVENING_TIMES,
  FIELDS,
  FREQUENCIES,
  GOALS,
  LENGTHS,
  MORNING_TIMES,
  ROLES,
  YEARS,
  formatClock,
} from '../../onboarding/options';
import { ONBOARDING_FLAG_KEY, readOnboardingRecord } from '../../onboarding/store';
import { saveOnboardingLocalThenSync } from '../../onboarding/sync';
import {
  describeEmailProblem,
  describeNameProblem,
  emptyDraft,
  hasEmailShape,
  isValidEmail,
  isValidName,
  NAME_MAX_LENGTH,
  type OnboardingDraft,
} from '../../onboarding/types';

const MOOD_LABELS = ['Sad', 'Low', 'Neutral', 'Good', 'Great'];

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const STEP_META: { title: string; body: string }[] = [
  { title: '', body: '' },
  { title: 'About you', body: 'Tell us a little about yourself.' },
  { title: 'What do you want to improve?', body: 'Pick what matters most — you can choose more than one.' },
  { title: "What's on your mind right now?", body: "Select what you're currently struggling with." },
  { title: 'Your preference', body: 'How would you like to use SWA?' },
  { title: 'Reminder times', body: 'Choose preferred times. Reminders stay off until you enable them in Settings.' },
  { title: 'First check-in', body: "Let's understand how you're feeling right now." },
  { title: 'Your SWA journey begins now', body: "We're here to support you, every step of the way." },
];

/**
 * Trim + lowercase the email and collapse whitespace in the name before the
 * draft leaves the screen, so keyboard autocomplete can't slip a trailing
 * space past the server's format check (which would store NULL).
 */
function normalizeDraft(draft: OnboardingDraft): OnboardingDraft {
  const email = draft.email ? draft.email.trim().toLowerCase() : null;
  const displayName = draft.displayName ? draft.displayName.trim().replace(/\s+/g, ' ') : null;
  return { ...draft, email: email || null, displayName: displayName || null };
}

function toggleIn(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { save: saveCheckin } = useSaveCheckin();
  const { update: updateProfile } = useProfile();
  const [step, setStep] = useState<Step>(0);
  const [draft, setDraft] = useState<OnboardingDraft>(emptyDraft);
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const [hydrating, setHydrating] = useState(true);
  const [savingStep, setSavingStep] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const finishingRef = useRef(false);
  const savingStepRef = useRef(false);
  const [onboardingError, setOnboardingError] = useState('');

  useEffect(() => {
    let active = true;
    readOnboardingRecord()
      .catch((error) => {
        console.warn('Could not restore the local setup draft:', error);
        return null;
      })
      .then((row) => {
        if (!active) return;
        if (row) {
          setDraft(row.draft);
          if (!row.completed && row.step >= 1 && row.step <= 7) {
            // Email is required; a draft saved before that rule goes back to
            // the details step instead of skipping past it.
            setStep(isValidEmail(row.draft.email) ? (row.step as Step) : 1);
          }
        }
      })
      .finally(() => {
        if (active) setHydrating(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const patch = (partial: Partial<OnboardingDraft>) => {
    setOnboardingError('');
    setDraft((current) => ({ ...current, ...partial }));
  };

  const canContinue = useMemo(() => {
    if (step === 1) {
      if (!isValidName(draft.displayName)) return false;
      if (!draft.role || !draft.fieldOfStudy) return false;
      if (draft.role === 'college_student' && !draft.yearOfStudy) return false;
      if (!isValidEmail(draft.email)) return false;
      return true;
    }
    if (step === 2) return draft.goals.length > 0;
    if (step === 3) return draft.challenges.length > 0;
    if (step === 4) return Boolean(draft.experienceLength && draft.reflectFrequency);
    return true;
  }, [step, draft]);

  const goNext = async () => {
    if (step >= 7 || savingStepRef.current || finishingRef.current || !canContinue) return;
    savingStepRef.current = true;
    const next = (step + 1) as Step;
    setSavingStep(true);
    setOnboardingError('');
    try {
      await saveOnboardingLocalThenSync(normalizeDraft(draftRef.current), { step: next });
      setStep(next);
    } catch (error) {
      console.warn('Could not save the setup step locally:', error);
      setOnboardingError('Your answers could not be saved on this device. Please try again.');
    } finally {
      savingStepRef.current = false;
      setSavingStep(false);
    }
  };

  const goBack = () => {
    if (step <= 0 || savingStepRef.current || finishingRef.current) return;
    setOnboardingError('');
    setStep((current) => (current - 1) as Step);
  };

  const finish = async () => {
    if (finishingRef.current || savingStepRef.current) return;
    if (!isValidEmail(draftRef.current.email)) {
      setStep(1);
      setOnboardingError('Please add your email address to continue.');
      return;
    }
    finishingRef.current = true;
    setFinishing(true);
    try {
      const finalDraft = normalizeDraft(draftRef.current);
      await saveOnboardingLocalThenSync(finalDraft, { step: 7, completed: false });
      // Mirror the name into the local engine profile so the home screen can
      // greet the user even though the questionnaire lives in Supabase.
      if (finalDraft.displayName) {
        try {
          await updateProfile({ displayName: finalDraft.displayName, appLockEnabled: false });
        } catch (e) {
          console.warn('Saving display name to local profile failed (non-fatal):', e);
        }
      }
      await saveCheckin({
        mood: finalDraft.firstMood,
        energy: finalDraft.firstEnergy,
        stress: finalDraft.firstStress,
        sleep: finalDraft.firstSleep,
        confidence: finalDraft.firstConfidence,
        oneWord: undefined,
      });
      await saveOnboardingLocalThenSync(finalDraft, { step: 7, completed: true });
      await setSecureFlag(ONBOARDING_FLAG_KEY, 'true');
      router.replace({ pathname: '/spot-checkin', params: { source: 'onboarding' } });
    } catch (error) {
      console.warn('Failed to finish onboarding locally:', error);
      setOnboardingError('Your setup could not be finished. Your answers are still here; please try again.');
    } finally {
      finishingRef.current = false;
      setFinishing(false);
    }
  };

  if (hydrating) {
    return (
      <SafeAreaView style={[styles.safe, styles.hydrating]} edges={['top', 'bottom']}>
        <ActivityIndicator color={colors.leafInk} accessibilityLabel="Restoring your setup" />
        <Text style={styles.body}>Restoring your setup…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {step === 0 ? (
          <Welcome onContinue={goNext} busy={savingStep} />
        ) : (
          <>
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={goBack}
                disabled={savingStep || finishing}
                hitSlop={12}
                style={styles.backBtn}
                accessibilityRole="button"
                accessibilityLabel="Back"
              >
                <Ionicons name="chevron-back" size={22} color={colors.ink} accessible={false} />
              </TouchableOpacity>
              <View
                style={styles.barTrack}
                accessibilityRole="progressbar"
                accessibilityLabel="Setup progress"
                accessibilityValue={{ min: 0, max: 7, now: step }}
              >
                <View style={[styles.barFill, { width: `${Math.round((step / 7) * 100)}%` }]} />
              </View>
              <Text style={styles.stepLabel}>Step {step} of 7</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
              {step < 7 ? (
                <>
                  <Text style={styles.title}>{STEP_META[step].title}</Text>
                  <Text style={styles.body}>{STEP_META[step].body}</Text>
                </>
              ) : null}

              {step === 1 && <AboutStep draft={draft} patch={patch} />}
              {step === 2 && (
                <ChipGrid
                  items={GOALS}
                  selected={draft.goals}
                  onToggle={(id) => patch({ goals: toggleIn(draft.goals, id) })}
                />
              )}
              {step === 3 && (
                <ChipGrid
                  items={CHALLENGES}
                  selected={draft.challenges}
                  onToggle={(id) => patch({ challenges: toggleIn(draft.challenges, id) })}
                  twoCol
                />
              )}
              {step === 4 && <PrefsStep draft={draft} patch={patch} />}
              {step === 5 && <TimesStep draft={draft} patch={patch} />}
              {step === 6 && <CheckinStep draft={draft} patch={patch} />}
              {step === 7 && <BeginStep />}
            </ScrollView>

            <View style={styles.footer}>
              {onboardingError ? (
                <Text style={styles.formError} accessibilityRole="alert">
                  {onboardingError}
                </Text>
              ) : null}
              {step < 7 ? (
                <Button
                  title="Continue"
                  onPress={goNext}
                  color={colors.gold}
                  disabled={!canContinue || savingStep}
                  loading={savingStep}
                />
              ) : (
                <Button
                  title={finishing ? 'Opening…' : "Let's begin →"}
                  onPress={finish}
                  color={colors.gold}
                  disabled={finishing || savingStep}
                  loading={finishing}
                />
              )}
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Welcome({ onContinue, busy }: { onContinue: () => void; busy: boolean }) {
  return (
    <View style={styles.welcome}>
      <View style={styles.welcomeArt}>
        <PetalMark size={88} />
      </View>
      <Text style={styles.brand}>SWA</Text>
      <Text style={styles.welcomeLine}>Understand yourself{'\n'}one step at a time</Text>
      <View style={{ flex: 1 }} />
      <Button title="Continue" onPress={onContinue} color={colors.gold} disabled={busy} loading={busy} />
      <View style={styles.privacy}>
        <Ionicons name="shield-checkmark" size={16} color={colors.leaf} />
        <Text style={styles.privacyText}>
          Your journal and check-ins stay on this device. Your setup details, including your email, are saved locally
          and sync online when a connection is available.
        </Text>
      </View>
    </View>
  );
}

function AboutStep({ draft, patch }: { draft: OnboardingDraft; patch: (p: Partial<OnboardingDraft>) => void }) {
  // Validate as the user types, but only *complain* once they've moved on from
  // the field (or typed something that can no longer become valid). Showing
  // "missing @" while someone is still on the first keystroke is just noise.
  const [emailTouched, setEmailTouched] = useState(false);

  const nameProblem = describeNameProblem(draft.displayName);
  const nameTouched = Boolean(draft.displayName);

  const emailProblem = describeEmailProblem(draft.email);
  const hasEmailText = Boolean(draft.email?.trim());
  const emailAccepted = hasEmailText && !emailProblem;
  const showEmailProblem =
    Boolean(emailProblem) && (hasEmailText ? emailTouched || hasEmailShape(draft.email) : emailTouched);

  return (
    <View>
      <EyebrowLabel label="I AM A" />
      {ROLES.map((r) => (
        <ChoiceRow
          key={r.id}
          label={r.label}
          sub={r.sub}
          selected={draft.role === r.id}
          onPress={() =>
            patch({
              role: r.id,
              yearOfStudy: r.id === 'working_professional' ? null : draft.yearOfStudy,
            })
          }
        />
      ))}

      {draft.role === 'college_student' ? (
        <>
          <View style={{ height: spacing.lg }} />
          <EyebrowLabel label="YEAR OF STUDY" />
          <View style={styles.wrapRow}>
            {YEARS.map((y) => (
              <Pill
                key={y.id}
                label={y.label}
                selected={draft.yearOfStudy === y.id}
                onPress={() => patch({ yearOfStudy: y.id })}
              />
            ))}
          </View>
        </>
      ) : null}

      <View style={{ height: spacing.lg }} />
      <EyebrowLabel label={draft.role === 'working_professional' ? 'FIELD OF WORK' : 'FIELD OF STUDY'} />
      {FIELDS.map((f) => (
        <ChoiceRow key={f} label={f} selected={draft.fieldOfStudy === f} onPress={() => patch({ fieldOfStudy: f })} />
      ))}

      <View style={{ height: spacing.lg }} />
      <EyebrowLabel label="YOUR NAME" />
      <Card style={styles.padCard}>
        <WritingLineInput
          value={draft.displayName ?? ''}
          onChangeText={(t) => patch({ displayName: t })}
          placeholder="What should we call you?"
          multiline={false}
          numberOfLines={1}
          autoCapitalize="words"
          autoCorrect={false}
          autoComplete="name"
          textContentType="givenName"
          returnKeyType="next"
          maxLength={NAME_MAX_LENGTH}
        />
        {nameTouched && nameProblem ? (
          <Text style={styles.emailHint}>{nameProblem}</Text>
        ) : (
          <Text style={styles.emailNote}>We'll use this to greet you inside the app.</Text>
        )}
      </Card>

      <View style={{ height: spacing.lg }} />
      <EyebrowLabel label="YOUR EMAIL (REQUIRED)" />
      <Card style={styles.padCard}>
        <WritingLineInput
          value={draft.email ?? ''}
          onChangeText={(t) => patch({ email: t })}
          onBlur={() => setEmailTouched(true)}
          placeholder="you@example.com"
          multiline={false}
          numberOfLines={1}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          maxLength={254}
        />
        {showEmailProblem ? (
          <Text style={styles.emailHint}>{emailProblem}</Text>
        ) : emailAccepted ? (
          <Text style={styles.emailOk}>This is stored with your online setup profile.</Text>
        ) : (
          <Text style={styles.emailNote}>
            Required. This is stored with your setup profile and syncs online.
          </Text>
        )}
      </Card>
    </View>
  );
}

function PrefsStep({ draft, patch }: { draft: OnboardingDraft; patch: (p: Partial<OnboardingDraft>) => void }) {
  return (
    <View>
      <EyebrowLabel label="PREFERRED EXPERIENCE LENGTH" />
      {LENGTHS.map((x) => (
        <ChoiceRow
          key={x.id}
          label={x.label}
          sub={x.sub}
          selected={draft.experienceLength === x.id}
          onPress={() => patch({ experienceLength: x.id })}
        />
      ))}
      <View style={{ height: spacing.lg }} />
      <EyebrowLabel label="HOW OFTEN WOULD YOU LIKE TO REFLECT?" />
      {FREQUENCIES.map((x) => (
        <ChoiceRow
          key={x.id}
          label={x.label}
          sub={x.sub}
          selected={draft.reflectFrequency === x.id}
          onPress={() => patch({ reflectFrequency: x.id })}
        />
      ))}
    </View>
  );
}

function TimesStep({ draft, patch }: { draft: OnboardingDraft; patch: (p: Partial<OnboardingDraft>) => void }) {
  return (
    <View>
      <Text style={styles.timeNote}>
        These are saved as preferences only. Both reminders stay off until you enable them in Settings.
      </Text>
      <Card style={styles.timeCard}>
        <View style={styles.timeHead}>
          <View style={[styles.timeIcon, { backgroundColor: '#FBF1DE' }]}>
            <Ionicons name="sunny" size={16} color="#C99A2C" />
          </View>
          <Text style={styles.timeTitle}>Morning check-in</Text>
        </View>
        {MORNING_TIMES.map((t) => (
          <ChoiceRow
            key={t}
            label={formatClock(t)}
            selected={draft.morningCheckinTime === t}
            onPress={() => patch({ morningCheckinTime: t })}
          />
        ))}
      </Card>
      <Card style={styles.timeCard}>
        <View style={styles.timeHead}>
          <View style={[styles.timeIcon, { backgroundColor: '#F3EEF9' }]}>
            <Ionicons name="moon" size={16} color="#8D7FAE" />
          </View>
          <Text style={styles.timeTitle}>Evening check-in</Text>
        </View>
        {EVENING_TIMES.map((t) => (
          <ChoiceRow
            key={t}
            label={formatClock(t)}
            selected={draft.eveningCheckinTime === t}
            onPress={() => patch({ eveningCheckinTime: t })}
          />
        ))}
      </Card>
    </View>
  );
}

function CheckinStep({ draft, patch }: { draft: OnboardingDraft; patch: (p: Partial<OnboardingDraft>) => void }) {
  return (
    <View>
      <EyebrowLabel label="HOW ARE YOU FEELING TODAY?" />
      <Card style={styles.padCard}>
        <Text style={styles.fieldLabel}>Mood</Text>
        <MoodFacePicker
          value={draft.firstMood}
          onChange={(value) => patch({ firstMood: value })}
          labels={MOOD_LABELS}
        />
      </Card>
      <Card style={styles.padCard}>
        <View style={styles.sliderLabels}>
          <Text style={styles.fieldLabel}>Energy</Text>
          <Text style={styles.sliderEnds}>Low → high · {draft.firstEnergy}/100</Text>
        </View>
        <PillSlider
          value={draft.firstEnergy}
          onChange={(value) => patch({ firstEnergy: value })}
          color={colors.gold}
          accessibilityLabel="Energy, from low to high"
        />
      </Card>
      <Card style={styles.padCard}>
        <View style={styles.sliderLabels}>
          <Text style={styles.fieldLabel}>Stress</Text>
          <Text style={styles.sliderEnds}>Low → high · {draft.firstStress}/100</Text>
        </View>
        <PillSlider
          value={draft.firstStress}
          onChange={(value) => patch({ firstStress: value })}
          color={colors.peach}
          accessibilityLabel="Stress, from low to high"
        />
      </Card>
      <Card style={styles.padCard}>
        <Text style={styles.fieldLabel}>Sleep</Text>
        <Text style={styles.inputHelper}>About how many hours did you sleep?</Text>
        <View style={styles.sleepRow} accessibilityRole="radiogroup" accessibilityLabel="Hours of sleep">
          {[0, 1, 2, 3, 4, 5].map((value) => {
            const selected = draft.firstSleep === value;
            return (
              <TouchableOpacity
                key={value}
                onPress={() => patch({ firstSleep: value })}
                style={[styles.sleepPill, selected && styles.sleepPillActive]}
                accessibilityRole="radio"
                accessibilityLabel={`${value + 3} hours`}
                accessibilityState={{ checked: selected, selected }}
              >
                <Text style={[styles.sleepPillText, selected && styles.sleepPillTextActive]}>{value + 3}h</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>
      <Card style={styles.padCard}>
        <View style={styles.sliderLabels}>
          <Text style={styles.fieldLabel}>Confidence</Text>
          <Text style={styles.sliderEnds}>Low → high · {draft.firstConfidence}/100</Text>
        </View>
        <PillSlider
          value={draft.firstConfidence}
          onChange={(value) => patch({ firstConfidence: value })}
          color={colors.sage}
          accessibilityLabel="Confidence, from low to high"
        />
      </Card>
      <Card style={styles.padCard}>
        <Text style={styles.fieldLabel}>What's one thing you want today to go better?</Text>
        <WritingLineInput
          value={draft.firstIntention}
          onChangeText={(value) => patch({ firstIntention: value })}
          placeholder="A few honest words are enough"
          multiline
          accessibilityLabel="One thing you want today to go better"
        />
      </Card>
    </View>
  );
}

function BeginStep() {
  return (
    <View style={styles.begin}>
      <PetalMark size={72} />
      <Text style={styles.beginTitle}>Your SWA journey{'\n'}begins now</Text>
      <Text style={styles.body}>We're here to support you, every step of the way.</Text>
      <View style={styles.beginList}>
        <BeginRow icon="heart" text="Daily check-ins — understand your mind" />
        <BeginRow icon="sparkles" text="Personalized insights — just for you" />
        <BeginRow icon="trending-up" text="Growth over time — reflect, learn, grow" />
      </View>
    </View>
  );
}

function BeginRow({ icon, text }: { icon: 'heart' | 'sparkles' | 'trending-up'; text: string }) {
  return (
    <View style={styles.beginRow}>
      <View style={styles.beginIcon}>
        <Ionicons name={icon} size={16} color={colors.leaf} />
      </View>
      <Text style={styles.beginText}>{text}</Text>
    </View>
  );
}

function ChipGrid({
  items,
  selected,
  onToggle,
  twoCol,
}: {
  items: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  twoCol?: boolean;
}) {
  if (twoCol) {
    return (
      <View style={styles.grid}>
        {items.map((item) => {
          const on = selected.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onToggle(item.id)}
              style={[styles.gridCell, on && styles.choiceOn]}
              activeOpacity={0.85}
              accessibilityRole="checkbox"
              accessibilityLabel={item.label}
              accessibilityState={{ checked: on, selected: on }}
            >
              <Text style={[styles.choiceLabel, on && styles.choiceLabelOn]}>{item.label}</Text>
              <View style={[styles.check, on && styles.checkOn]}>
                {on ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  return (
    <View>
      {items.map((item) => (
        <ChoiceRow
          key={item.id}
          label={item.label}
          selected={selected.includes(item.id)}
          onPress={() => onToggle(item.id)}
          selectionMode="multiple"
        />
      ))}
    </View>
  );
}

function ChoiceRow({
  label,
  sub,
  selected,
  onPress,
  selectionMode = 'single',
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
  selectionMode?: 'single' | 'multiple';
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.choice, selected && styles.choiceOn]}
      activeOpacity={0.85}
      accessibilityRole={selectionMode === 'multiple' ? 'checkbox' : 'radio'}
      accessibilityLabel={label}
      accessibilityHint={selectionMode === 'multiple' ? 'Select or clear this option' : 'Select this option'}
      accessibilityState={{ checked: selected, selected }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.choiceLabel, selected && styles.choiceLabelOn]}>{label}</Text>
        {sub ? <Text style={styles.choiceSub}>{sub}</Text> : null}
      </View>
      <View style={[styles.check, selected && styles.checkOn]}>
        {selected ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
      </View>
    </TouchableOpacity>
  );
}

function Pill({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.pill, selected && styles.choiceOn]}
      activeOpacity={0.85}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected, selected }}
    >
      <Text style={[styles.pillText, selected && styles.choiceLabelOn]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  hydrating: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  welcome: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
  },
  welcomeArt: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  brand: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 42,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: 4,
  },
  welcomeLine: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 22,
    fontWeight: '600',
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 30,
  },
  privacy: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    alignItems: 'flex-start',
  },
  privacyText: {
    flex: 1,
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.inkSoft,
    lineHeight: 17,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EDE8DD',
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    backgroundColor: colors.gold,
    borderRadius: 3,
  },
  stepLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    fontWeight: '800',
    color: colors.inkSoft,
    width: 72,
    textAlign: 'right',
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 32,
    marginTop: spacing.sm,
  },
  body: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 21,
    marginTop: 6,
    marginBottom: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  formError: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    fontWeight: '700',
    color: '#8A3B24',
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadow.soft,
  },
  choiceOn: {
    borderColor: colors.ink,
    backgroundColor: '#FFF',
  },
  choiceLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  choiceLabelOn: {
    color: colors.ink,
  },
  choiceSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 2,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D8CFC0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: colors.leaf,
    borderColor: colors.leaf,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadow.soft,
  },
  pillText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCell: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 88,
    justifyContent: 'space-between',
    ...shadow.soft,
  },
  timeNote: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  timeCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  timeHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  timeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  padCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  emailHint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#8A3B24',
    marginTop: spacing.sm,
  },
  emailOk: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.leafInk,
    marginTop: spacing.sm,
  },
  emailNote: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.ghost,
    marginTop: spacing.sm,
  },
  fieldLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  inputHelper: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
  },
  sleepRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  sleepPill: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: '#D8CFC0',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sleepPillActive: {
    borderColor: '#6C5B8A',
    backgroundColor: '#F3EEF9',
  },
  sleepPillText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  sleepPillTextActive: {
    color: colors.ink,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderEnds: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: colors.inkSoft,
    fontWeight: '700',
  },
  begin: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  beginTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 28,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 34,
  },
  beginList: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  beginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: spacing.lg,
    ...shadow.soft,
  },
  beginIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.leafSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beginText: {
    flex: 1,
    fontFamily: 'Nunito_700Bold',
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 19,
  },
});
