import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { MoodFacePicker } from '../../design-system/MoodFacePicker';
import { PillSlider } from '../../design-system/PillSlider';
import { SleepDots } from '../../design-system/SleepDots';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { Button } from '../../design-system/Button';
import { useUI } from '../../hooks/useUI';
import { useSaveCheckin } from '../../hooks/useCheckins';

const FEELINGS = [
  'Anxious', 'Calm', 'Sad', 'Happy', 'Angry', 'Grateful',
  'Overwhelmed', 'Curious', 'Lonely', 'Hopeful', 'Tired', 'Excited',
];

export default function OnTheSpotScreen() {
  const router = useRouter();
  const { checkinDraft, setCheckinDraft, clearCheckinDraft } = useUI();
  const { save: saveCheckin, saving } = useSaveCheckin();
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await saveCheckin({
        mood: checkinDraft.mood,
        energy: checkinDraft.energy,
        stress: checkinDraft.stress,
        sleep: checkinDraft.sleep,
        confidence: checkinDraft.confidence,
        oneWord: checkinDraft.oneWord || undefined,
      });
      clearCheckinDraft();
      Alert.alert('Saved', 'Your check-in has been recorded.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <EyebrowLabel label="ON-THE-SPOT" />
      <Text style={styles.title}>How Are You,{'\n'}Right Now?</Text>
      <Text style={styles.subtitle}>
        Take a moment. There's no wrong answer here.
      </Text>

      {/* Mood */}
      <Card style={styles.card}>
        <Text style={styles.fieldLabel}>MOOD</Text>
        <MoodFacePicker
          value={checkinDraft.mood}
          onChange={(v) => setCheckinDraft({ mood: v })}
        />
      </Card>

      {/* Sliders */}
      <Card style={styles.card}>
        <PillSlider
          label="ENERGY"
          value={checkinDraft.energy}
          onChange={(v) => setCheckinDraft({ energy: v })}
          color={colors.gold}
        />
        <PillSlider
          label="STRESS"
          value={checkinDraft.stress}
          onChange={(v) => setCheckinDraft({ stress: v })}
          color={colors.peach}
        />
      </Card>

      {/* Sleep */}
      <Card style={styles.card}>
        <Text style={styles.fieldLabel}>SLEEP</Text>
        <Text style={styles.sleepHint}>How many hours did you get?</Text>
        <View style={styles.sleepRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Button
              key={n}
              title={`${n + 3}h`}
              variant={checkinDraft.sleep === n ? 'primary' : 'secondary'}
              color={colors.lavender}
              onPress={() => setCheckinDraft({ sleep: n })}
              style={styles.sleepBtn}
            />
          ))}
        </View>
      </Card>

      {/* Confidence */}
      <Card style={styles.card}>
        <PillSlider
          label="CONFIDENCE"
          value={checkinDraft.confidence}
          onChange={(v) => setCheckinDraft({ confidence: v })}
          color={colors.sky}
        />
      </Card>

      {/* One word */}
      <Card style={styles.card}>
        <EyebrowLabel label="ONE WORD FOR RIGHT NOW" />
        <WritingLineInput
          value={checkinDraft.oneWord}
          onChangeText={(t) => setCheckinDraft({ oneWord: t })}
          placeholder="Type one word..."
          multiline={false}
        />
      </Card>

      {/* Feeling chips (optional enhancement) */}
      <Card style={styles.card}>
        <EyebrowLabel label="OPTIONAL: NAME THE FEELING" />
        <View style={styles.chipRow}>
          {FEELINGS.map((f) => (
            <Button
              key={f}
              title={f}
              variant={selectedFeeling === f ? 'primary' : 'secondary'}
              color={colors.sage}
              onPress={() => {
                setSelectedFeeling(f);
                setCheckinDraft({ oneWord: f });
              }}
              style={styles.chip}
            />
          ))}
        </View>
      </Card>

      <Button
        title={saving ? 'Saving...' : 'Save Check-In'}
        onPress={handleSave}
        color={colors.gold}
        disabled={saving}
        style={{ marginTop: spacing.md }}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 28,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: colors.inkSoft,
    marginBottom: spacing.xl,
  },
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  sleepHint: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
  },
  sleepRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sleepBtn: {
    flex: 1,
    paddingHorizontal: 0,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
