import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../design-system/Button';
import { Card } from '../../design-system/Card';
import { MoodFacePicker } from '../../design-system/MoodFacePicker';
import { PillSlider } from '../../design-system/PillSlider';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { colors, spacing, radius } from '../../design-system/tokens';
import { useSaveCheckin } from '../../hooks/useCheckins';
import { useUI } from '../../hooks/useUI';

const MOOD_LABELS = ['Sad', 'Low', 'Neutral', 'Good', 'Great'];
const SLEEP_VALUES = [0, 1, 2, 3, 4, 5];

type Feedback = { tone: 'success' | 'error'; message: string } | null;

export default function OnTheSpotScreen() {
  const router = useRouter();
  const { checkinDraft, setCheckinDraft } = useUI();
  const { save: saveCheckin, saving } = useSaveCheckin();
  const saveRef = useRef(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const updateDraft = (patch: Partial<typeof checkinDraft>) => {
    setFeedback(null);
    setCheckinDraft(patch);
  };

  const handleSave = async () => {
    if (saving || saveRef.current) return;
    saveRef.current = true;
    setFeedback(null);
    try {
      await saveCheckin({
        mood: checkinDraft.mood,
        energy: checkinDraft.energy,
        stress: checkinDraft.stress,
        sleep: checkinDraft.sleep,
        confidence: checkinDraft.confidence,
        oneWord: checkinDraft.oneWord.trim() || undefined,
      });
      setFeedback({ tone: 'success', message: 'Saved on this device.' });
    } catch (error) {
      console.warn('Failed to save check-in:', error);
      setFeedback({
        tone: 'error',
        message: 'Could not save your check-in. Your answers are still here; please try again.',
      });
    } finally {
      saveRef.current = false;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.navigate('/(tabs)')}
          style={styles.headerBack}
          accessibilityRole="button"
          accessibilityLabel="Back to Today"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.ink} accessible={false} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check-In</Text>
        <View style={styles.headerBack} />
      </View>

      <KeyboardAvoidingView style={styles.keyboardArea} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>How are you feeling right now?</Text>
          <Text style={styles.subtitle}>A quick check-in. There is no right or wrong answer.</Text>

          <Card style={styles.card}>
            <Text style={styles.fieldLabel}>Mood</Text>
            <MoodFacePicker
              value={checkinDraft.mood}
              onChange={(value) => updateDraft({ mood: value })}
              labels={MOOD_LABELS}
            />
          </Card>

          <Card style={styles.card}>
            <SliderHeading label="Energy" value={checkinDraft.energy} ends="Low to high" />
            <PillSlider
              value={checkinDraft.energy}
              onChange={(value) => updateDraft({ energy: value })}
              color={colors.gold}
              accessibilityLabel="Energy, from low to high"
            />
          </Card>

          <Card style={styles.card}>
            <SliderHeading label="Stress" value={checkinDraft.stress} ends="Low to high" />
            <PillSlider
              value={checkinDraft.stress}
              onChange={(value) => updateDraft({ stress: value })}
              color={colors.peach}
              accessibilityLabel="Stress, from low to high"
            />
          </Card>

          <Card style={styles.card}>
            <SliderHeading label="Confidence" value={checkinDraft.confidence} ends="Low to high" />
            <Text style={styles.helper}>How capable do you feel of handling what is in front of you?</Text>
            <PillSlider
              value={checkinDraft.confidence}
              onChange={(value) => updateDraft({ confidence: value })}
              color={colors.sage}
              accessibilityLabel="Confidence, from low to high"
            />
          </Card>

          <Card style={styles.card}>
            <View style={styles.fieldRow}>
              <View style={[styles.fieldIcon, { backgroundColor: '#F3EEF9' }]}>
                <Ionicons name="moon" size={16} color="#6C5B8A" accessible={false} />
              </View>
              <Text style={styles.fieldLabel}>Sleep</Text>
            </View>
            <Text style={styles.helper}>About how many hours did you sleep?</Text>
            <View style={styles.sleepRow} accessibilityRole="radiogroup" accessibilityLabel="Hours of sleep">
              {SLEEP_VALUES.map((value) => {
                const selected = checkinDraft.sleep === value;
                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() => updateDraft({ sleep: value })}
                    style={[styles.sleepPill, selected && styles.sleepPillActive]}
                    activeOpacity={0.8}
                    accessibilityRole="radio"
                    accessibilityLabel={`${value + 3} hours`}
                    accessibilityState={{ checked: selected, selected }}
                  >
                    <Text style={styles.sleepPillText}>{value + 3}h</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.fieldLabel}>One word for right now</Text>
            <Text style={styles.optional}>Optional</Text>
            <WritingLineInput
              value={checkinDraft.oneWord}
              onChangeText={(value) => updateDraft({ oneWord: value })}
              placeholder="A word, if one comes to mind"
              multiline={false}
              maxLength={80}
              accessibilityLabel="One word for right now, optional"
            />
          </Card>

          {feedback ? (
            <Text
              style={[styles.feedback, feedback.tone === 'error' && styles.feedbackError]}
              accessibilityRole={feedback.tone === 'error' ? 'alert' : 'text'}
              accessibilityLiveRegion="polite"
            >
              {feedback.message}
            </Text>
          ) : null}

          <Button
            title="Save check-in"
            onPress={handleSave}
            color={colors.leaf}
            disabled={saving}
            loading={saving}
            style={styles.saveButton}
          />
          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SliderHeading({ label, value, ends }: { label: string; value: number; ends: string }) {
  return (
    <View style={styles.sliderHeading}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.sliderValue}>
        {ends} · {Math.round(value)}/100
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  keyboardArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  headerBack: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 32,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 25,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 33,
    marginTop: spacing.md,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 4,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  fieldIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  sliderHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  sliderValue: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  helper: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    lineHeight: 18,
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
  optional: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.ghost,
    marginBottom: spacing.sm,
  },
  feedback: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: colors.leafInk,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  feedbackError: { color: '#8A3B24' },
  saveButton: { marginTop: spacing.sm },
});
