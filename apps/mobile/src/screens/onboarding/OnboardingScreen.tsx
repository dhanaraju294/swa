import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../design-system/tokens';
import { Button } from '../../design-system/Button';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { PetalMark } from '../../design-system/PetalMark';
import { MoodFacePicker } from '../../design-system/MoodFacePicker';
import { PillSlider } from '../../design-system/PillSlider';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { setSecureFlag } from '../../native/secureFlag';
import { useSaveCheckin } from '../../hooks/useCheckins';
import { useProfile } from '../../hooks/useProfile';
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
import { ONBOARDING_FLAG_KEY, readOnboardingRecord } from '../../onboarding/store';
import { saveOnboardingLocalThenSync } from '../../onboarding/sync';
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

const MOOD_LABELS = ['Sad', 'Low', 'Neutral', 'Good', 'Great'];

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const STEP_META: Array<{ title: string; body: string }> = [
  { title: '', body: '' },
  { title: 'About you', body: 'Tell us a little about yourself.' },
  { title: 'What do you want to improve?', body: 'Pick what matters most — you can choose more than one.' },
  { title: "What's on your mind right now?", body: "Select what you're currently struggling with." },
  { title: 'Your preference', body: 'How would you like to use SWA?' },
  { title: 'Check-in time', body: 'When would you like SWA to check in with you?' },
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
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    readOnboardingRecord().then((row) => {
      if (!row) return;
      setDraft(row.draft);
      if (!row.completed && row.step >= 1 && row.step <= 7) {
        setStep(row.step as Step);
      }
    });
  }, []);

  const patch = (partial: Partial<OnboardingDraft>) => setDraft((d) => ({ ...d, ...partial }));

  const persistStep = (nextStep: number, completed = false) => {
    // Normalise the email before it leaves the screen so keyboard autocomplete
    // can't smuggle a trailing space / capitalisation past the server's format
    // check (which would make the column fall back to NULL).
    void saveOnboardingLocalThenSync(normalizeDraft(draftRef.current), {
      step: nextStep,
      completed,
    });
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

  const goNext = () => {
    if (step >= 7) return;
    const next = (step + 1) as Step;
    persistStep(next);
    setStep(next);
  };

  const goBack = () => {
    if (step <= 0) return;
    setStep((step - 1) as Step);
  };

  const finish = async () => {
    if (finishing) return;
    setFinishing(true);
    try {
      const finalDraft = normalizeDraft(draftRef.current);
      await saveOnboardingLocalThenSync(finalDraft, { step: 7, completed: true });
      // Mirror the name into the local engine profile so the home screen can
      // greet the user even though the questionnaire lives in Supabase.
      if (finalDraft.displayName) {
        try {
          await updateProfile({ displayName: finalDraft.displayName, appLockEnabled: false });
        } catch (e) {
          console.warn('Saving display name to local profile failed (non-fatal):', e);
        }
      }
      try {
        await saveCheckin({
          mood: draft.firstMood,
          energy: draft.firstEnergy,
          stress: draft.firstStress,
          sleep: 3,
          confidence: 50,
          oneWord: draft.firstIntention.trim() || undefined,
        });
      } catch (e) {
        console.warn('First check-in local save failed (non-fatal):', e);
      }
      await setSecureFlag(ONBOARDING_FLAG_KEY, 'true');
      router.replace('/(tabs)');
    } catch (e) {
      console.warn('Failed to finish onboarding locally:', e);
      setFinishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {step === 0 ? (
          <Welcome onContinue={goNext} />
        ) : (
          <>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={goBack} hitSlop={12} style={styles.backBtn} accessibilityLabel="Back">
                <Ionicons name="chevron-back" size={22} color={colors.ink} />
              </TouchableOpacity>
              <View style={styles.barTrack}>
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
              {step < 7 ? (
                <Button
                  title="Continue"
                  onPress={goNext}
                  color={colors.gold}
                  disabled={!canContinue}
                />
              ) : (
                <Button
                  title={finishing ? 'Opening…' : "Let's begin  →"}
                  onPress={finish}
                  color={colors.gold}
                  disabled={finishing}
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

function Welcome({ onContinue }: { onContinue: () => void }) {
  return (
    <View style={styles.welcome}>
      <View style={styles.welcomeArt}>
        <PetalMark size={88} />
      </View>
      <Text style={styles.brand}>SWA</Text>
      <Text style={styles.welcomeLine}>Understand yourself{'\n'}one step at a time</Text>
      <View style={{ flex: 1 }} />
      <Button title="Continue" onPress={onContinue} color={colors.gold} />
      <View style={styles.privacy}>
        <Ionicons name="shield-checkmark" size={16} color={colors.leaf} />
        <Text style={styles.privacyText}>
          Your journal stays on this device. This setup is saved locally even without internet, and sent when you are back online.
        </Text>
      </View>
    </View>
  );
}

function AboutStep({
  draft,
  patch,
}: {
  draft: OnboardingDraft;
  patch: (p: Partial<OnboardingDraft>) => void;
}) {
  // Validate as the user types, but only *complain* once they've moved on from
  // the field (or typed something that can no longer become valid). Showing
  // "missing @" while someone is still on the first keystroke is just noise.
  const [emailTouched, setEmailTouched] = useState(false);

  const nameProblem = describeNameProblem(draft.displayName);
  const nameTouched = Boolean(draft.displayName);

  const emailProblem = describeEmailProblem(draft.email);
  const emailAccepted = !emailProblem && Boolean(draft.email);
  const showEmailProblem = Boolean(emailProblem) && (emailTouched || hasEmailShape(draft.email));

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
        <ChoiceRow
          key={f}
          label={f}
          selected={draft.fieldOfStudy === f}
          onPress={() => patch({ fieldOfStudy: f })}
        />
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
      <EyebrowLabel label="YOUR EMAIL" />
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
        />
        {showEmailProblem ? (
          <Text style={styles.emailHint}>{emailProblem}</Text>
        ) : emailAccepted ? (
          <Text style={styles.emailOk}>Looks good.</Text>
        ) : (
          <Text style={styles.emailNote}>We'll only use this to keep in touch — never to spam you.</Text>
        )}
      </Card>
    </View>
  );
}

function PrefsStep({
  draft,
  patch,
}: {
  draft: OnboardingDraft;
  patch: (p: Partial<OnboardingDraft>) => void;
}) {
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

function TimesStep({
  draft,
  patch,
}: {
  draft: OnboardingDraft;
  patch: (p: Partial<OnboardingDraft>) => void;
}) {
  return (
    <View>
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

function CheckinStep({
  draft,
  patch,
}: {
  draft: OnboardingDraft;
  patch: (p: Partial<OnboardingDraft>) => void;
}) {
  return (
    <View>
      <EyebrowLabel label="HOW ARE YOU FEELING TODAY?" />
      <Card style={styles.padCard}>
        <Text style={styles.fieldLabel}>Mood</Text>
        <MoodFacePicker
          value={draft.firstMood}
          onChange={(v) => patch({ firstMood: v })}
          labels={MOOD_LABELS}
        />
      </Card>
      <Card style={styles.padCard}>
        <View style={styles.sliderLabels}>
          <Text style={styles.fieldLabel}>Energy</Text>
          <Text style={styles.sliderEnds}>Low → High</Text>
        </View>
        <PillSlider value={draft.firstEnergy} onChange={(v) => patch({ firstEnergy: v })} color={colors.gold} />
      </Card>
      <Card style={styles.padCard}>
        <View style={styles.sliderLabels}>
          <Text style={styles.fieldLabel}>Stress</Text>
          <Text style={styles.sliderEnds}>Low → High</Text>
        </View>
        <PillSlider value={draft.firstStress} onChange={(v) => patch({ firstStress: v })} color={colors.peach} />
      </Card>
      <Card style={styles.padCard}>
        <Text style={styles.fieldLabel}>What's one thing you want today to go better?</Text>
        <WritingLineInput
          value={draft.firstIntention}
          onChangeText={(t) => patch({ firstIntention: t })}
          placeholder="A few honest words are enough"
          multiline
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
  items: Array<{ id: string; label: string }>;
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
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.choice, selected && styles.choiceOn]} activeOpacity={0.85}>
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
    <TouchableOpacity onPress={onPress} style={[styles.pill, selected && styles.choiceOn]} activeOpacity={0.85}>
      <Text style={[styles.pillText, selected && styles.choiceLabelOn]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
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
    fontFamily: 'Fraunces',
    fontSize: 42,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: 4,
  },
  welcomeLine: {
    fontFamily: 'Fraunces',
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
    fontFamily: 'Nunito',
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
    fontFamily: 'Nunito',
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
    fontFamily: 'Fraunces',
    fontSize: 26,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 32,
    marginTop: spacing.sm,
  },
  body: {
    fontFamily: 'Nunito',
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
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  choiceLabelOn: {
    color: colors.ink,
  },
  choiceSub: {
    fontFamily: 'Nunito',
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
    fontFamily: 'Nunito',
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
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  padCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  emailHint: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.peach,
    marginTop: spacing.sm,
  },
  emailOk: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.leaf,
    marginTop: spacing.sm,
  },
  emailNote: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.ghost,
    marginTop: spacing.sm,
  },
  fieldLabel: {
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderEnds: {
    fontFamily: 'Nunito',
    fontSize: 11,
    color: colors.inkSoft,
    fontWeight: '700',
  },
  begin: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  beginTitle: {
    fontFamily: 'Fraunces',
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
    fontFamily: 'Nunito',
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 19,
  },
});
