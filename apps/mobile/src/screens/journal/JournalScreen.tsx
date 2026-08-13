import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { PetalMark } from '../../design-system/PetalMark';
import { NumberedStep } from '../../design-system/NumberedStep';
import { MoodFacePicker } from '../../design-system/MoodFacePicker';
import { PillSlider } from '../../design-system/PillSlider';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { BreathingSquare } from '../../design-system/BreathingSquare';
import { SensesWheel } from '../../design-system/SensesWheel';
import { ProgressPetals } from '../../design-system/ProgressPetals';
import { Button } from '../../design-system/Button';
import { useJournalProgress, useCompleteDay } from '../../hooks/useJournal';
import { useUI } from '../../hooks/useUI';
import { getDayContent } from '../../content/day1';

// Block type union from content JSON
type Block =
  | { type: 'cover'; eyebrow: string; title: string; quote: string }
  | { type: 'overview-grid'; items: { icon: string; label: string; sub: string }[] }
  | { type: 'learning-card'; eyebrow: string; headline: string; body: string; fact: string }
  | { type: 'guided-exercise'; title: string; steps: { n: number; text: string }[] }
  | { type: 'daily-checkin' }
  | { type: 'reflection-prompts'; prompts: string[] }
  | { type: 'senses-wheel' }
  | { type: 'tiny-challenge'; title: string; body: string; targetCount: number }
  | { type: 'evening-reflection'; prompts: string[] }
  | { type: 'pause-point'; closingLine: string };

function BlockRenderer({
  block,
  journalId,
  dayNumber,
}: {
  block: Block;
  journalId: string;
  dayNumber: number;
}) {
  const { journalDrafts, setJournalDraft, checkinDraft, setCheckinDraft } = useUI();
  const [breathingActive, setBreathingActive] = useState(false);
  const [sensesValues, setSensesValues] = useState<Record<string, string>>({});

  const draftKey = `${journalId}-${dayNumber}`;

  switch (block.type) {
    case 'cover':
      return (
        <View style={[styles.coverPage, styles.page]}>
          <View style={styles.coverTop}>
            <EyebrowLabel label={block.eyebrow} color={colors.inkSoft} />
          </View>
          <View style={styles.coverCenter}>
            <PetalMark size={100} />
            <Text style={styles.coverTitle}>{block.title}</Text>
          </View>
          <Text style={styles.coverQuote}>{block.quote}</Text>
          <Card style={styles.coverCta}>
            <Text style={styles.coverCtaText}>I'm ready to begin</Text>
          </Card>
        </View>
      );

    case 'overview-grid':
      return (
        <View style={styles.page}>
          <EyebrowLabel label={`DAY ${dayNumber}`} />
          <Text style={styles.h2}>What You'll Explore Today</Text>
          <View style={styles.grid}>
            {block.items.map((item, i) => (
              <Card key={i} style={styles.gridCard}>
                <Text style={styles.gridLabel}>{item.label}</Text>
                <Text style={styles.gridSub}>{item.sub}</Text>
              </Card>
            ))}
          </View>
        </View>
      );

    case 'learning-card':
      return (
        <View style={[styles.page, { backgroundColor: '#F4F1EB' }]}>
          <EyebrowLabel label={block.eyebrow} />
          <Text style={styles.h2}>{block.headline}</Text>
          <Text style={styles.body}>{block.body}</Text>
          <Card style={styles.factCard}>
            <Text style={styles.factLabel}>DID YOU KNOW?</Text>
            <Text style={styles.factText}>{block.fact}</Text>
          </Card>
        </View>
      );

    case 'guided-exercise':
      return (
        <View style={[styles.page, { backgroundColor: '#EAF5F9' }]}>
          <EyebrowLabel label="2-MINUTE EXERCISE" />
          <Text style={styles.h2}>{block.title}</Text>
          <View style={styles.exerciseContainer}>
            <BreathingSquare
              isActive={breathingActive}
              onComplete={() => setBreathingActive(false)}
            />
          </View>
          {block.steps.map((step, i) => (
            <NumberedStep key={i} number={step.n} text={step.text} />
          ))}
          <Button
            title={breathingActive ? 'Breathing...' : 'Start Breathing'}
            onPress={() => setBreathingActive(!breathingActive)}
            color={colors.sky}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      );

    case 'daily-checkin':
      return (
        <View style={styles.page}>
          <PetalMark size={28} />
          <EyebrowLabel label="DAILY CHECK-IN" />
          <Text style={styles.h2}>How Are You, Right Now?</Text>
          <Card style={styles.card}>
            <Text style={styles.fieldLabel}>MOOD</Text>
            <MoodFacePicker
              value={checkinDraft.mood}
              onChange={(v) => setCheckinDraft({ mood: v })}
            />
          </Card>
          <Card style={styles.card}>
            <PillSlider label="ENERGY" value={checkinDraft.energy} onChange={(v) => setCheckinDraft({ energy: v })} color={colors.gold} />
            <PillSlider label="STRESS" value={checkinDraft.stress} onChange={(v) => setCheckinDraft({ stress: v })} color={colors.peach} />
          </Card>
          <Card style={styles.card}>
            <Text style={styles.fieldLabel}>SLEEP</Text>
            <View style={styles.sleepRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setCheckinDraft({ sleep: n })}
                  style={[styles.sleepBtn, checkinDraft.sleep === n && styles.sleepBtnActive]}
                >
                  <Text style={[styles.sleepText, checkinDraft.sleep === n && styles.sleepTextActive]}>
                    {n + 3}h
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.fieldLabel}>ONE WORD FOR RIGHT NOW</Text>
            <WritingLineInput
              value={checkinDraft.oneWord}
              onChangeText={(t) => setCheckinDraft({ oneWord: t })}
              placeholder="Type one word..."
              multiline={false}
            />
          </Card>
        </View>
      );

    case 'reflection-prompts':
      return (
        <View style={[styles.page, { backgroundColor: '#F3EEF9' }]}>
          <PetalMark size={28} />
          <EyebrowLabel label="REFLECTION" />
          <Text style={styles.h2}>Notice It On Paper</Text>
          {block.prompts.map((prompt, i) => (
            <Card key={i} style={styles.promptCard}>
              <Text style={styles.promptText}>{prompt}</Text>
              <WritingLineInput
                value={journalDrafts[`${draftKey}-ref-${i}`] || ''}
                onChangeText={(t) => setJournalDraft(`${draftKey}-ref-${i}`, t)}
                placeholder="Write your thoughts here..."
              />
            </Card>
          ))}
        </View>
      );

    case 'senses-wheel':
      return (
        <View style={styles.page}>
          <PetalMark size={28} />
          <EyebrowLabel label="GROUNDING" />
          <Text style={styles.h2}>The Five Senses Wheel</Text>
          <Text style={styles.subtitle}>Come back to now. Notice one thing with each sense.</Text>
          <SensesWheel values={sensesValues} onChange={(sense, text) => setSensesValues({ ...sensesValues, [sense]: text })} />
        </View>
      );

    case 'tiny-challenge':
      return (
        <View style={[styles.page, { backgroundColor: '#F1F7EF' }]}>
          <PetalMark size={28} />
          <EyebrowLabel label="TINY CHALLENGE" />
          <Text style={styles.h2}>{block.title}</Text>
          <Card style={styles.card}>
            <Text style={styles.body}>{block.body}</Text>
          </Card>
          <Text style={styles.fieldLabel}>TRACK YOUR CATCHES</Text>
          <View style={styles.catches}>
            {Array.from({ length: block.targetCount }).map((_, i) => (
              <View key={i} style={styles.catchBox}>
                <Text style={styles.catchNum}>{i + 1}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.fieldLabel}>WHAT DID YOU CATCH?</Text>
          <WritingLineInput
            value={journalDrafts[`${draftKey}-challenge`] || ''}
            onChangeText={(t) => setJournalDraft(`${draftKey}-challenge`, t)}
            placeholder="Describe what you noticed..."
          />
        </View>
      );

    case 'evening-reflection':
      return (
        <View style={[styles.page, { backgroundColor: '#FBF1DE' }]}>
          <PetalMark size={28} />
          <EyebrowLabel label="EVENING REFLECTION" />
          <Text style={styles.h2}>Looking Back on Today</Text>
          {block.prompts.map((prompt, i) => (
            <Card key={i} style={styles.promptCard}>
              <Text style={styles.promptText}>{prompt}</Text>
              <WritingLineInput
                value={journalDrafts[`${draftKey}-evening-${i}`] || ''}
                onChangeText={(t) => setJournalDraft(`${draftKey}-evening-${i}`, t)}
                placeholder="Write about your day..."
              />
            </Card>
          ))}
        </View>
      );

    case 'pause-point':
      return (
        <View style={[styles.page, styles.pausePage]}>
          <EyebrowLabel label="PAUSE POINT" />
          <Text style={styles.h2}>Just Breathe</Text>
          <View style={styles.pauseCircles}>
            <View style={[styles.circle, { width: 180, height: 180, borderRadius: 90, borderColor: colors.sage }]} />
            <View style={[styles.circle, { width: 140, height: 140, borderRadius: 70, borderColor: colors.sky }]} />
            <View style={[styles.circle, { width: 100, height: 100, borderRadius: 50, borderColor: colors.gold }]} />
            <View style={[styles.circle, { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.peach, opacity: 0.3 }]} />
          </View>
          <Card style={styles.card}>
            <Text style={styles.fieldLabel}>TODAY I'M GRATEFUL FOR</Text>
            <WritingLineInput
              value={journalDrafts[`${draftKey}-grateful`] || ''}
              onChangeText={(t) => setJournalDraft(`${draftKey}-grateful`, t)}
            />
          </Card>
          <Card style={styles.card}>
            <Text style={styles.fieldLabel}>TOMORROW, I WANT TO NOTICE</Text>
            <WritingLineInput
              value={journalDrafts[`${draftKey}-tomorrow`] || ''}
              onChangeText={(t) => setJournalDraft(`${draftKey}-tomorrow`, t)}
            />
          </Card>
          <Text style={styles.closingLine}>{block.closingLine}</Text>
        </View>
      );

    default:
      return null;
  }
}

export default function JournalScreen() {
  const router = useRouter();
  const [journalId, setJournalId] = useState('seven-day');
  const [dayNumber, setDayNumber] = useState(1);
  const { data: progress } = useJournalProgress(journalId);
  const { complete, saving } = useCompleteDay();

  const content = getDayContent(journalId, dayNumber) as { blocks: Block[] };
  const blocks: Block[] = content.blocks || [];

  const handleComplete = async () => {
    try {
      await complete(journalId, dayNumber);
      Alert.alert('Day Complete', 'Great work showing up today!', [
        { text: 'OK' },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Could not save progress.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Journal selector */}
        <View style={styles.selector}>
          <Button
            title="7-Day"
            variant={journalId === 'seven-day' ? 'primary' : 'secondary'}
            color={colors.sage}
            onPress={() => { setJournalId('seven-day'); setDayNumber(1); }}
            style={styles.selectorBtn}
          />
          <Button
            title="21-Day"
            variant={journalId === 'twenty-one-day' ? 'primary' : 'secondary'}
            color={colors.lavender}
            onPress={() => { setJournalId('twenty-one-day'); setDayNumber(1); }}
            style={styles.selectorBtn}
          />
        </View>

        {/* Day navigation */}
        <View style={styles.dayNav}>
          <Button
            title="← Prev"
            variant="ghost"
            onPress={() => setDayNumber(Math.max(1, dayNumber - 1))}
            disabled={dayNumber <= 1}
            style={styles.dayNavBtn}
          />
          <Text style={styles.dayLabel}>Day {dayNumber}</Text>
          <Button
            title="Next →"
            variant="ghost"
            onPress={() => setDayNumber(dayNumber + 1)}
            disabled={dayNumber >= (journalId === 'seven-day' ? 7 : 21)}
            style={styles.dayNavBtn}
          />
        </View>

        <ProgressPetals
          total={journalId === 'seven-day' ? 7 : 21}
          current={dayNumber}
          completed={progress?.completedDays || []}
        />

        {/* Render blocks */}
        {blocks.map((block, i) => (
          <BlockRenderer
            key={i}
            block={block}
            journalId={journalId}
            dayNumber={dayNumber}
          />
        ))}

        <Button
          title={saving ? 'Saving...' : 'Complete Day'}
          onPress={handleComplete}
          color={colors.gold}
          disabled={saving}
          style={{ marginTop: spacing.xl }}
        />

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scrollContent: { padding: spacing.lg },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontFamily: 'Nunito', fontSize: 14, color: colors.inkSoft },
  selector: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  selectorBtn: { flex: 1 },
  dayNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  dayNavBtn: { paddingHorizontal: spacing.md },
  dayLabel: { fontFamily: 'Fraunces', fontSize: 16, fontWeight: '600', color: colors.ink },
  page: { marginTop: spacing.xxl },
  coverPage: { alignItems: 'center', paddingVertical: spacing.xxxl },
  coverTop: { marginBottom: spacing.xxl },
  coverCenter: { alignItems: 'center', marginBottom: spacing.xxl },
  coverTitle: { fontFamily: 'Fraunces', fontSize: 36, fontWeight: '600', color: colors.ink, marginTop: spacing.lg, textAlign: 'center' },
  coverQuote: { fontFamily: 'Caveat', fontSize: 22, fontWeight: '600', color: '#7D5A45', textAlign: 'center', marginBottom: spacing.xxl },
  coverCta: { padding: spacing.lg, alignItems: 'center', width: '100%' },
  coverCtaText: { fontFamily: 'Nunito', fontSize: 13, fontWeight: '700', color: colors.ink },
  h2: { fontFamily: 'Fraunces', fontSize: 24, fontWeight: '600', color: colors.ink, marginBottom: spacing.md },
  subtitle: { fontFamily: 'Nunito', fontSize: 12, color: colors.inkSoft, marginBottom: spacing.md },
  body: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft, lineHeight: 20, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gridCard: { width: '48%', padding: spacing.md },
  gridLabel: { fontFamily: 'Nunito', fontSize: 12, fontWeight: '800', color: colors.ink },
  gridSub: { fontFamily: 'Nunito', fontSize: 10.5, color: colors.inkSoft, marginTop: 2 },
  factCard: { padding: spacing.md, borderLeftWidth: 4, borderLeftColor: colors.gold, marginBottom: spacing.md },
  factLabel: { fontFamily: 'Nunito', fontSize: 10.5, fontWeight: '800', color: '#A37A1F' },
  factText: { fontFamily: 'Nunito', fontSize: 11.5, color: colors.ink, marginTop: 4, lineHeight: 17 },
  exerciseContainer: { alignItems: 'center', marginBottom: spacing.lg },
  card: { padding: spacing.lg, marginBottom: spacing.md },
  promptCard: { padding: spacing.lg, marginBottom: spacing.sm },
  promptText: { fontFamily: 'Nunito', fontSize: 12, fontWeight: '700', color: colors.ink, marginBottom: spacing.md },
  fieldLabel: { fontFamily: 'Nunito', fontSize: 11, fontWeight: '800', color: colors.ink, marginBottom: spacing.sm, textTransform: 'uppercase' },
  sleepRow: { flexDirection: 'row', gap: spacing.sm },
  sleepBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: 12, borderWidth: 1.5, borderColor: colors.writingLine, alignItems: 'center' },
  sleepBtnActive: { backgroundColor: colors.lavender, borderColor: colors.lavender },
  sleepText: { fontFamily: 'Nunito', fontSize: 12, fontWeight: '700', color: colors.inkSoft },
  sleepTextActive: { color: '#fff' },
  catches: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  catchBox: { width: 46, height: 46, borderRadius: 14, borderWidth: 2, borderColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  catchNum: { fontFamily: 'Nunito', fontSize: 14, fontWeight: '800', color: colors.inkSoft },
  pausePage: { alignItems: 'center' },
  pauseCircles: { alignItems: 'center', justifyContent: 'center', marginVertical: spacing.xl },
  circle: { position: 'absolute', borderWidth: 1.2 },
  closingLine: { fontFamily: 'Caveat', fontSize: 20, fontWeight: '600', color: '#7D5A45', textAlign: 'center', marginTop: spacing.xl },
});
