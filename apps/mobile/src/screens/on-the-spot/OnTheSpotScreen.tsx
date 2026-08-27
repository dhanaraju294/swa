import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { MoodFacePicker } from '../../design-system/MoodFacePicker';
import { PillSlider } from '../../design-system/PillSlider';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { Button } from '../../design-system/Button';
import { useUI } from '../../hooks/useUI';
import { useSaveCheckin } from '../../hooks/useCheckins';

const MOOD_LABELS = ['Sad', 'Low', 'Neutral', 'Good', 'Great'];

// Fresh-draft defaults (mirrors defaultCheckin in hooks/useUI) so the
// progress dots can tell which sections the user has touched.
const DEFAULTS = { mood: 3, energy: 50, stress: 50, sleep: 3, oneWord: '' };

export default function OnTheSpotScreen() {
  const router = useRouter();
  const { checkinDraft, setCheckinDraft } = useUI();
  const { save: saveCheckin, saving } = useSaveCheckin();
  const [justSaved, setJustSaved] = useState(false);

  const sectionsTouched =
    1 +
    [checkinDraft.energy !== DEFAULTS.energy, checkinDraft.stress !== DEFAULTS.stress,
      checkinDraft.sleep !== DEFAULTS.sleep, checkinDraft.oneWord !== DEFAULTS.oneWord]
      .filter(Boolean).length;

  const handleSave = async () => {
    if (saving || justSaved) return;
    try {
      await saveCheckin({
        mood: checkinDraft.mood,
        energy: checkinDraft.energy,
        stress: checkinDraft.stress,
        sleep: checkinDraft.sleep,
        confidence: checkinDraft.confidence,
        oneWord: checkinDraft.oneWord || undefined,
      });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    } catch (e) {
      console.warn('Failed to save check-in:', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)')}
          hitSlop={10}
          style={styles.headerBack}
          accessibilityLabel="Back to Today"
        >
          <Ionicons name="arrow-back" size={20} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check-In</Text>
        <View style={styles.headerBack} />
      </View>

      {/* Progress dots (one per section, lit as you go) */}
      <View style={styles.dots}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={[styles.dot, i < sectionsTouched && styles.dotActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>How are you feeling right now?</Text>
        <Text style={styles.subtitle}>There's no right or wrong answer.</Text>

        {/* Mood */}
        <Card style={styles.card}>
          <MoodFacePicker
            value={checkinDraft.mood}
            onChange={(v) => setCheckinDraft({ mood: v })}
            labels={MOOD_LABELS}
          />
        </Card>

        {/* Energy */}
        <Card style={styles.card}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: '#FBF1DE' }]}>
              <Ionicons name="flash" size={16} color="#C99A2C" />
            </View>
            <Text style={styles.fieldLabel}>Energy</Text>
          </View>
          <PillSlider
            value={checkinDraft.energy}
            onChange={(v) => setCheckinDraft({ energy: v })}
            color={colors.gold}
          />
        </Card>

        {/* Stress */}
        <Card style={styles.card}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: '#FBEFEC' }]}>
              <Ionicons name="pulse" size={16} color="#D4795F" />
            </View>
            <Text style={styles.fieldLabel}>Stress</Text>
          </View>
          <PillSlider
            value={checkinDraft.stress}
            onChange={(v) => setCheckinDraft({ stress: v })}
            color={colors.peach}
          />
        </Card>

        {/* Sleep */}
        <Card style={styles.card}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: '#F3EEF9' }]}>
              <Ionicons name="moon" size={16} color="#8D7FAE" />
            </View>
            <Text style={styles.fieldLabel}>Sleep</Text>
          </View>
          <Text style={styles.sleepHint}>How many hours did you get?</Text>
          <View style={styles.sleepRow}>
            {[1, 2, 3, 4, 5].map((n) => {
              const selected = checkinDraft.sleep === n;
              return (
                <TouchableOpacity
                  key={n}
                  onPress={() => setCheckinDraft({ sleep: n })}
                  style={[styles.sleepPill, selected && styles.sleepPillActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.sleepPillText, selected && styles.sleepPillTextActive]}>
                    {n + 3}h
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Anything on your mind */}
        <Card style={styles.card}>
          <Text style={styles.fieldLabel}>Anything on your mind?</Text>
          <Text style={styles.optional}>Optional</Text>
          <WritingLineInput
            value={checkinDraft.oneWord}
            onChangeText={(t) => setCheckinDraft({ oneWord: t })}
            placeholder="Type here..."
            multiline={false}
          />
        </Card>

        <Button
          title={justSaved ? 'Saved ✓' : saving ? 'Saving...' : 'Continue'}
          onPress={handleSave}
          color={justSaved ? colors.leaf : colors.leaf}
          disabled={saving}
          style={styles.continue}
        />
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  headerBack: { width: 32, height: 32 },
  headerTitle: {
    fontFamily: 'Fraunces',
    fontSize: 19,
    fontWeight: '600',
    color: colors.ink,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.xs,
  },
  dot: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5DFD3',
  },
  dotActive: {
    backgroundColor: colors.leaf,
    width: 26,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 25,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 33,
    marginTop: spacing.md,
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontSize: 13.5,
    color: colors.inkSoft,
    marginTop: 4,
    marginBottom: spacing.lg,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  sleepHint: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
    marginTop: -spacing.xs,
  },
  sleepRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sleepPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#EDE7DB',
    alignItems: 'center',
  },
  sleepPillActive: {
    backgroundColor: colors.lavender,
    borderColor: colors.lavender,
  },
  sleepPillText: {
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  sleepPillTextActive: {
    color: colors.ink,
    fontWeight: '800',
  },
  optional: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.ghost,
    marginBottom: spacing.sm,
  },
  continue: {
    marginTop: spacing.sm,
  },
});
