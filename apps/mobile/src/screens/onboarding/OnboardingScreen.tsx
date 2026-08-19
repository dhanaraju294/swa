import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../../design-system/tokens';
import { Button } from '../../design-system/Button';
import { PetalMark } from '../../design-system/PetalMark';
import { useProfile } from '../../hooks/useProfile';
import { setSecureFlag } from '../../native/secureFlag';

const ONBOARDING_KEY = 'inward-has-onboarded-v1';

const STEPS = [
  {
    eyebrow: 'WELCOME',
    title: 'The Inward\nJourney',
    body: 'A quiet space to pause, notice, and understand yourself — without judgment or pressure.',
    quote: '"Answers begin within."',
  },
  {
    eyebrow: 'YOUR SPACE',
    title: 'Private &\nSacred',
    body: 'Everything stays on your device. No account, no cloud, no data leaves your hands. Your reflections are yours alone.',
    quote: '',
  },
  {
    eyebrow: 'GET STARTED',
    title: 'Begin\nWhenever',
    body: 'Each day is three small doors: a morning arrival, one tiny practice, an evening look-back. Skip anything. Nothing is homework.',
    quote: '"What you notice, you can change."',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { update } = useProfile();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [showName, setShowName] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const current = STEPS[step];

  const finishOnboarding = async (name: string) => {
    if (finishing) return;
    setFinishing(true);
    console.log('[Onboarding] starting finishOnboarding', { name });
    try {
      console.log('[Onboarding] saving profile');
      await update({ displayName: name.trim() || undefined, appLockEnabled: false });
      console.log('[Onboarding] profile saved successfully');
    } catch (e) {
      console.warn('Failed to save profile during onboarding:', e);
      // Still continue — the name is also backed up locally by useProfile.
    } finally {
      try {
        console.log('[Onboarding] writing onboarding flag');
        await setSecureFlag(ONBOARDING_KEY, 'true');
        console.log('[Onboarding] navigating to tabs screen');
        router.replace('/(tabs)');
      } catch (e) {
        console.warn('Failed to finalize onboarding transition:', e);
      }
    }
  };

  if (showName) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <PetalMark size={40} />
          </View>

          <Text style={styles.eyebrow}>OPTIONAL</Text>
          <Text style={styles.title}>What should{'\n'}we call you?</Text>
          <Text style={styles.body}>
            This name appears on your home screen. It never leaves your device.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Your name (optional)"
            placeholderTextColor={colors.ghost}
            value={displayName}
            onChangeText={setDisplayName}
            autoFocus
          />

          <View style={styles.buttonGroup}>
            <Button
              title="Continue"
              onPress={() => finishOnboarding(displayName)}
              color={colors.gold}
              disabled={finishing}
            />
            <Button
              title="Skip"
              onPress={() => finishOnboarding('')}
              variant="ghost"
              disabled={finishing}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          {step === 0 && <PetalMark size={40} />}
        </View>

        <Text style={styles.eyebrow}>{current.eyebrow}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>

        {current.quote ? (
          <Text style={styles.quote}>{current.quote}</Text>
        ) : (
          <View style={{ height: 40 }} />
        )}

        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.buttonGroup}>
          {step < STEPS.length - 1 ? (
            <Button
              title="Next"
              onPress={() => setStep(step + 1)}
              color={colors.gold}
            />
          ) : (
            <Button
              title="Get Started"
              onPress={() => setShowName(true)}
              color={colors.gold}
            />
          )}
          {step > 0 && (
            <Button
              title="Back"
              onPress={() => setStep(step - 1)}
              variant="ghost"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  eyebrow: {
    fontFamily: 'Nunito',
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.inkSoft,
    letterSpacing: 3.5,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 36,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 42,
    marginBottom: spacing.lg,
  },
  body: {
    fontFamily: 'Nunito',
    fontSize: 15,
    color: colors.inkSoft,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  quote: {
    fontFamily: 'Caveat',
    fontSize: 22,
    fontWeight: '600',
    color: '#7D5A45',
    marginBottom: spacing.xxl,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.writingLine,
  },
  dotActive: {
    backgroundColor: colors.gold,
    width: 24,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
  input: {
    fontFamily: 'Nunito',
    fontSize: 16,
    color: colors.ink,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.writingLine,
    paddingVertical: spacing.md,
    marginBottom: spacing.xxl,
  },
});
