import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { homeReflections } from '../../journey/reflectionSummary';
import { SproutMascot } from '../../components/SproutMascot';
import { Button } from '../../design-system/Button';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { colors, spacing, radius } from '../../design-system/tokens';
import { useStreak } from '../../hooks/useAwareness';
import { useDailyCatalog, useDailyDay } from '../../hooks/useDailyJourney';
import { isoDay } from '../../hooks/appIcon';
import { useProfile } from '../../hooks/useProfile';
import { useLatestSpotCheckin } from '../../hooks/useSpotCheckins';
import { streakMoodFor, streakMoodLabel } from '../../journey/streakMood';
import type { JourneyPart } from '../../journey/types';
import type { Streak } from '../../native/InwardEngine';
import { syncStreakWidget } from '../../widgets/streakWidget';

const greetingFor = (hours: number) => (hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening');

const GREETING_EMOJI: Record<string, string> = {
  'Good morning': '☀️',
  'Good afternoon': '🌤️',
  'Good evening': '🌙',
};

const PART_META: Record<JourneyPart, { icon: string; tint: string; sub: string }> = {
  morning: { icon: 'sunny', tint: '#FBF1DE', sub: 'Start your day with awareness' },
  exercise: { icon: 'leaf', tint: '#F1F7EF', sub: "Explore what's within" },
  evening: { icon: 'moon', tint: '#F3EEF9', sub: 'Close your day with clarity' },
};

const PARTS: JourneyPart[] = ['morning', 'evening'];

export default function HomeScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const hasFocusedBefore = useRef(false);
  const [showPast, setShowPast] = useState(false);
  const [showRhythmDetails, setShowRhythmDetails] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const { data: profile } = useProfile();
  const { data: streak, loading: streakLoading, refresh: refreshStreak } = useStreak();
  const { data: spotCheckin, loading: spotCheckinLoading, refresh: refreshSpotCheckin } = useLatestSpotCheckin();
  const {
    catalog,
    reflections,
    exerciseDay,
    reflectionDay,
    statusByDay,
    total,
    exerciseCompletedDays,
    reflectionCompletedDays,
    exerciseNextLocked,
    reflectionNextLocked,
    exerciseAllDone,
    reflectionAllDone,
    refresh,
  } = useDailyCatalog();
  const { content: reflectionContent } = useDailyDay(reflectionDay);
  const { content: exerciseContent } = useDailyDay(exerciseDay);

  useEffect(() => {
    if (isFocused) {
      refreshStreak();
      refresh();
      if (hasFocusedBefore.current) refreshSpotCheckin();
      hasFocusedBefore.current = true;
    }
  }, [isFocused, refresh, refreshSpotCheckin, refreshStreak]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  // Finishing a day in either flow today means the user showed up today, so
  // The rhythm badge and widget must never read it as a lapsed rhythm while that
  // flow's next day is locked.
  const nextDayLocked = exerciseNextLocked || reflectionNextLocked;
  const allDaysDone = exerciseAllDone && reflectionAllDone;
  const todayUtc = isoDay(now);
  const effectiveStreak = useMemo<Streak | null | undefined>(() => {
    if (!nextDayLocked || !streak || streak.lastActiveDate === todayUtc) return streak;
    return { ...streak, currentStreak: Math.max(1, streak.currentStreak), lastActiveDate: todayUtc };
  }, [nextDayLocked, streak, todayUtc]);

  useEffect(() => {
    if (streakLoading) return;
    syncStreakWidget(effectiveStreak).catch((error) => console.warn('Failed to sync streak widget:', error));
  }, [effectiveStreak, streakLoading]);

  const savedReflections = useMemo(() => homeReflections(reflections, reflectionDay), [reflections, reflectionDay]);
  const reflectionStatus = statusByDay[reflectionDay];
  const exerciseStatus = statusByDay[exerciseDay];
  const reflectionPartsDone = Number(Boolean(reflectionStatus?.morning)) + Number(Boolean(reflectionStatus?.evening));
  const greeting = greetingFor(now.getHours());
  const name = profile?.displayName?.trim();

  const open = (part: JourneyPart) => {
    const day = part === 'exercise' ? exerciseDay : reflectionDay;
    router.push({ pathname: '/session', params: { day: String(day), part } });
  };

  const titleFor = (part: JourneyPart): string => {
    const content = part === 'exercise' ? exerciseContent : reflectionContent;
    const session = part === 'morning' ? content?.morning : part === 'exercise' ? content?.exercise : content?.evening;
    const day = part === 'exercise' ? exerciseDay : reflectionDay;
    return session?.title || catalog?.days.find((d) => d.day === day)?.theme || PART_META[part].sub;
  };

  const statusFor = (part: JourneyPart) =>
    part === 'exercise' ? Boolean(exerciseStatus?.exercise) : Boolean(reflectionStatus?.[part]);

  const dayFor = (part: JourneyPart) => (part === 'exercise' ? exerciseDay : reflectionDay);

  const mascotMood = streakMoodFor(effectiveStreak, now);
  const streakNum = streakLoading ? '—' : String(mascotMood === 'sad' ? 0 : (effectiveStreak?.currentStreak ?? 0));
  const longest = streakLoading ? '—' : String(effectiveStreak?.longestStreak ?? 0);
  const moodBadgeLabel = allDaysDone
    ? 'Journey complete'
    : nextDayLocked
      ? 'Nicely done today'
      : streakMoodLabel(mascotMood);
  const unfinishedNote =
    mascotMood === 'sad' && !nextDayLocked
      ? `Your next step is waiting. Reflections Day ${reflectionDay} and Exercise Day ${exerciseDay} are still waiting for you — finish them to move forward.`
      : null;
  const lockLines = [
    reflectionNextLocked ? `Reflections Day ${reflectionDay} is complete — Day ${reflectionDay + 1} opens tomorrow.` : null,
    exerciseNextLocked ? `Exercise Day ${exerciseDay} is complete — Day ${exerciseDay + 1} opens tomorrow.` : null,
  ].filter((line): line is string => Boolean(line));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Top row: menu + bell */}
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/journal')}
            hitSlop={10}
            style={styles.topIcon}
            accessibilityRole="button"
            accessibilityLabel="My Path"
            accessibilityHint="Opens your journey map"
          >
            <Ionicons name="menu" size={22} color={colors.ink} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/settings')}
            hitSlop={10}
            style={styles.topIcon}
            accessibilityRole="button"
            accessibilityLabel="Settings and reminders"
            accessibilityHint="Opens your profile, privacy, and reminder settings"
          >
            <Ionicons name="notifications-outline" size={22} color={colors.ink} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>
          {greeting}
          {name ? `, ${name}` : ''} {GREETING_EMOJI[greeting]}
        </Text>
        <Text style={styles.greetingSub}>Take a breath. You're exactly where you need to be.</Text>

        {/* Home stays gently idle. Rewards belong to successfully completed exercises. */}
        <View style={styles.illustrationCard}>
          <SproutMascot emotion="idle" size={220} active={isFocused} muted hapticsEnabled={false} />
          <View style={[styles.moodBadge, mascotMood === 'sad' && styles.moodBadgeSad]}>
            <View style={[styles.moodDot, mascotMood === 'sad' && styles.moodDotSad]} />
            <Text style={styles.moodBadgeText}>{moodBadgeLabel}</Text>
          </View>
        </View>

        {/* Your rhythm */}
        <Card style={styles.rhythmCard}>
          <View style={styles.rhythmTop}>
            <EyebrowLabel label="YOUR RHYTHM" />
            <View style={styles.leafBadge}>
              <Text style={styles.leafBadgeIcon}>🌿</Text>
            </View>
          </View>
          <View style={styles.rhythmRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rhythmNumber}>{streakNum}</Text>
              <Text style={styles.rhythmLabel}>days showing up for yourself</Text>
            </View>
            <View style={styles.rhythmMeta}>
              <Text style={styles.rhythmMetaLabel}>Longest</Text>
              <Text style={styles.rhythmMetaValue}>{longest} days</Text>
            </View>
          </View>
          <View style={styles.rhythmDivider} />
          <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: showRhythmDetails }} onPress={() => setShowRhythmDetails(v => !v)} style={{ paddingVertical: 8 }}>
            <Text style={styles.rhythmNote}>{showRhythmDetails ? 'Hide progress details ↑' : 'How your rhythm works ↓'}</Text>
          </TouchableOpacity>
          {showRhythmDetails ? <Text style={styles.flowProgressNote}>
            Reflections {reflectionCompletedDays.length}/{total} · Practice {exerciseCompletedDays.length}/{total}. Each flow keeps its own pace; the next day opens tomorrow after completion.
          </Text> : null}
        </Card>

        {unfinishedNote ? <Text style={styles.lockNote}>{unfinishedNote}</Text> : null}

        {lockLines.length > 0 || allDaysDone ? (
          <Card style={styles.lockCard}>
            <Text style={styles.lockTitle}>{allDaysDone ? 'You finished the whole journey 🌸' : 'Nicely done today 🌿'}</Text>
            {(allDaysDone ? ['Every day is complete. You can revisit any of them below.'] : lockLines).map((line) => (
              <Text key={line} style={styles.lockBody}>
                {line}
              </Text>
            ))}
            {allDaysDone ? null : <Text style={styles.lockBody}>Rest well — Sprout will be here.</Text>}
          </Card>
        ) : null}

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Today's Reflection</Text>
          <TouchableOpacity onPress={() => setShowPast(true)} accessibilityRole="button" accessibilityLabel="View past saved reflections" style={{ paddingVertical: 12 }}>
            <Text style={styles.pastLink}>View past →</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.pathKicker}>Day {reflectionDay} · {reflectionPartsDone}/2 moments saved</Text>
        <Card style={styles.pathCard}>
          {PARTS.map((part, i) => {
            const meta = PART_META[part];
            const done = statusFor(part);
            const day = dayFor(part);
            return (
              <TouchableOpacity
                key={part}
                onPress={() => open(part)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`${done ? 'Review' : 'Start'} ${part === 'exercise' ? 'practice' : part + ' reflection'}, day ${day}: ${titleFor(part)}. ${done ? 'Completed.' : 'Open.'}`}
                accessibilityHint="Opens this activity. Your reflection pair and practice progress independently."
              >
                <View style={[styles.pathRow, i > 0 && styles.pathRowGap]}>
                  <View style={[styles.pathIcon, { backgroundColor: meta.tint }]}>
                    <Ionicons name={meta.icon as 'sunny' | 'leaf' | 'moon'} size={18} color={colors.ink} />
                  </View>
                  <View style={styles.pathText}>
                    <Text style={styles.pathTitle}>{titleFor(part)}</Text>
                    <Text style={[styles.pathSub, done && styles.pathSubDone]}>
                      {part === 'exercise' ? `Exercise Day ${day}` : `Reflection Day ${day}`} ·{' '}
                      {done ? 'Completed' : 'Ready when you are'}
                    </Text>
                  </View>
                  {done ? (
                    <View style={styles.pathCheck}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  ) : (
                    <View style={styles.pathOpen}>
                      <Ionicons name="ellipse-outline" size={14} color={colors.ghost} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </Card>

        {savedReflections.today.map(item => (
          <TouchableOpacity key={item.id} accessibilityRole="button" accessibilityLabel={`Review ${item.journalId} reflection, day ${item.dayNumber}`} onPress={() => open(item.journalId as JourneyPart)} style={styles.summaryChip}>
            <Text style={styles.pastLink}>{item.journalId === 'morning' ? '☀️ Morning' : '🌙 Evening'} · Saved</Text>
            <Text style={styles.summaryText} numberOfLines={2}>{item.summary}</Text>
          </TouchableOpacity>
        ))}
        {savedReflections.recent.map(item => (
          <TouchableOpacity key={item.id} style={styles.summaryChip} onPress={() => setShowPast(true)} accessibilityRole="button" accessibilityLabel={`View saved reflection from day ${item.dayNumber}`}>
            <Text style={styles.summaryText} numberOfLines={1}>Day {item.dayNumber} · {item.summary}</Text>
          </TouchableOpacity>
        ))}
        <Card style={styles.firstCheckinCard}>
          <Text style={styles.pathKicker}>TODAY'S PRACTICE · DAY {exerciseDay}</Text>
          <Text style={styles.firstCheckinTitle} numberOfLines={2}>{titleFor('exercise')}</Text>
          <Button title={exerciseStatus?.exercise ? 'Review practice' : 'Start practice'} color={colors.leaf} style={{ marginTop: spacing.md }} onPress={() => open('exercise')} />
        </Card>

        {!spotCheckinLoading && !spotCheckin ? (
          <Card style={styles.firstCheckinCard}>
            <EyebrowLabel label="A MOMENT TO PAUSE" />
            <Text style={styles.firstCheckinTitle}>Take a 3–5 minute check-in</Text>
            <Text style={styles.firstCheckinBody}>
              Notice how you feel. Your path progress stays separate.
            </Text>
            <Button
              title="Start inward check-in"
              onPress={() => router.push('/spot-checkin')}
              color={colors.sage}
              accessibilityHint="Opens a guided twelve-part check-in. Your daily path progress stays separate."
            />
          </Card>
        ) : null}

        <Button
          title="See your path"
          onPress={() => router.push('/(tabs)/journal')}
          color={colors.leaf}
          style={{ marginTop: spacing.lg }}
        />

        <Text style={styles.dayMeta}>One day at a time · each flow's next day opens tomorrow once today's is complete</Text>
        <View style={{ height: 24 }} />
      </ScrollView>
      <Modal visible={showPast} animationType="slide" transparent onRequestClose={() => setShowPast(false)}>
        <View style={styles.modalOverlay}><SafeAreaView style={styles.pastSheet}>
          <Text style={styles.sectionTitle}>Past reflections</Text>
          <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingVertical: spacing.md }}>
            {savedReflections.past.length === 0 ? <Text style={styles.summaryText}>Your saved reflections will appear here.</Text> : null}
            {savedReflections.past.map(item => <TouchableOpacity key={item.id} style={styles.summaryChip} accessibilityRole="button" onPress={() => {
              setShowPast(false);
              router.push({ pathname: '/session', params: { day: String(item.dayNumber), part: item.journalId } });
            }}>
              <Text style={styles.pastLink}>Day {item.dayNumber} · {item.journalId}</Text>
              <Text style={styles.summaryText}>{item.summary}</Text>
            </TouchableOpacity>)}
          </ScrollView>
          <Button title="Close" onPress={() => setShowPast(false)} color={colors.leaf} />
        </SafeAreaView></View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg },
  sectionTitle: { fontFamily: 'Fraunces_600SemiBold', fontSize: 21, color: colors.ink },
  pastLink: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: colors.leafInk },
  summaryChip: { padding: spacing.md, borderRadius: 16, backgroundColor: '#F3EFE6', marginTop: spacing.sm },
  summaryText: { fontSize: 13, lineHeight: 20, color: colors.inkSoft },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(40,30,20,0.45)' },
  pastSheet: { maxHeight: '80%', backgroundColor: colors.cream, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg },
  safe: { flex: 1, backgroundColor: colors.cream },
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.lg, paddingBottom: 110 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  topIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 30,
    fontWeight: '600',
    color: colors.ink,
    marginTop: spacing.xl,
    lineHeight: 38,
  },
  greetingSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13.5,
    color: colors.inkSoft,
    marginTop: 4,
    lineHeight: 19,
  },
  illustrationCard: {
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6EFD9',
    position: 'relative',
  },
  moodBadge: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  moodBadgeSad: { backgroundColor: 'rgba(255,255,255,0.76)' },
  moodDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#6F9A6A' },
  moodDotSad: { backgroundColor: '#999A91' },
  moodBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
    fontWeight: '700',
    color: '#5F6558',
    letterSpacing: 0.15,
  },
  rhythmCard: {
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  rhythmTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leafBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.leafSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafBadgeIcon: { fontSize: 15 },
  rhythmRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  rhythmNumber: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 46,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 52,
  },
  rhythmLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 2,
  },
  rhythmMeta: {
    alignItems: 'flex-end',
  },
  rhythmMetaLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rhythmMetaValue: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 17,
    fontWeight: '600',
    color: colors.ink,
    marginTop: 2,
  },
  rhythmDivider: {
    height: 1,
    backgroundColor: '#F0EBE1',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  rhythmNote: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 18,
  },
  flowProgressNote: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.inkSoft,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  lockNote: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.inkSoft,
    lineHeight: 18,
    marginTop: spacing.md,
  },
  lockCard: {
    padding: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: '#EEF3E8',
    borderColor: '#DDE7D7',
    borderWidth: 1,
  },
  lockTitle: { fontFamily: 'Fraunces_600SemiBold', fontSize: 18, fontWeight: '600', color: colors.leafInk },
  lockBody: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 19,
    marginTop: 4,
  },
  pathKicker: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkSoft,
    marginTop: -2,
    marginBottom: 4,
  },
  firstCheckinCard: {
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderColor: '#DCE8DA',
    borderWidth: 1,
  },
  firstCheckinTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
    marginTop: spacing.sm,
  },
  firstCheckinBody: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: colors.inkSoft,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  pathCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: 6,
  },
  pathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  pathRowGap: {
    borderTopWidth: 1,
    borderTopColor: '#F0EBE1',
  },
  pathIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathText: { flex: 1 },
  pathTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  pathSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 1,
  },
  pathSubDone: {
    color: colors.leafInk,
    fontWeight: '800',
  },
  pathCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathOpen: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#E4DDD0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayMeta: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11.5,
    color: colors.ghost,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
