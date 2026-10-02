import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BlossomMascot } from './BlossomMascot';
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
import { allPartsComplete, type JourneyPart } from '../../journey/types';
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

const PARTS: JourneyPart[] = ['morning', 'exercise', 'evening'];

export default function HomeScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const hasFocusedBefore = useRef(false);
  const [now, setNow] = useState(() => new Date());
  const { data: profile } = useProfile();
  const { data: streak, loading: streakLoading, refresh: refreshStreak } = useStreak();
  const { data: spotCheckin, loading: spotCheckinLoading, refresh: refreshSpotCheckin } = useLatestSpotCheckin();
  const {
    catalog,
    exerciseDay,
    reflectionDay,
    statusByDay,
    total,
    currentDay,
    nextDayLocked,
    allDaysDone,
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

  // Finishing a day today means the user showed up today, so Blossom and the
  // widget must never read it as a lapsed rhythm while the next day is locked.
  const todayUtc = isoDay(now);
  const effectiveStreak = useMemo<Streak | null | undefined>(() => {
    if (!nextDayLocked || !streak || streak.lastActiveDate === todayUtc) return streak;
    return { ...streak, currentStreak: Math.max(1, streak.currentStreak), lastActiveDate: todayUtc };
  }, [nextDayLocked, streak, todayUtc]);

  useEffect(() => {
    if (streakLoading) return;
    syncStreakWidget(effectiveStreak).catch((error) => console.warn('Failed to sync streak widget:', error));
  }, [effectiveStreak, streakLoading]);

  const dayStatus = statusByDay[currentDay];
  const partsDone =
    Number(Boolean(dayStatus?.morning)) + Number(Boolean(dayStatus?.exercise)) + Number(Boolean(dayStatus?.evening));
  const daysComplete = Object.values(statusByDay).filter(allPartsComplete).length;
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

  const statusFor = (part: JourneyPart) => Boolean(dayStatus?.[part]);

  const dayFor = (_part: JourneyPart) => currentDay;

  const mascotMood = streakMoodFor(effectiveStreak, now);
  const streakNum = streakLoading ? '—' : String(mascotMood === 'sad' ? 0 : (effectiveStreak?.currentStreak ?? 0));
  const longest = streakLoading ? '—' : String(effectiveStreak?.longestStreak ?? 0);
  const moodBadgeLabel = allDaysDone
    ? 'Journey complete'
    : nextDayLocked
      ? `Day ${currentDay} complete`
      : streakMoodLabel(mascotMood);
  const unfinishedNote =
    mascotMood === 'sad' && !nextDayLocked
      ? `Blossom is resting. Day ${currentDay} is still waiting for you — finish it to move forward.`
      : null;

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

        {/* Blossom mirrors the streak gently; missed days never block the daily path. */}
        <View style={styles.illustrationCard}>
          <BlossomMascot mood={mascotMood} active={isFocused} />
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
          <Text style={styles.rhythmNote}>
            Each day has a morning reflection, a practice and an evening reflection. Finish all three to complete the
            day; the next day opens tomorrow. Until then you stay on the same day.
          </Text>
          <Text style={styles.flowProgressNote}>
            Day {currentDay} of {total} · {partsDone}/3 done · {daysComplete}/{total} days complete
          </Text>
        </Card>

        {unfinishedNote ? <Text style={styles.lockNote}>{unfinishedNote}</Text> : null}

        {nextDayLocked || allDaysDone ? (
          <Card style={styles.lockCard}>
            <Text style={styles.lockTitle}>
              {allDaysDone ? 'You finished the whole journey 🌸' : `Day ${currentDay} complete 🌿`}
            </Text>
            <Text style={styles.lockBody}>
              {allDaysDone
                ? 'Every day is complete. You can revisit any of them below.'
                : `Day ${currentDay + 1} opens tomorrow. Rest well — Blossom will be here. You can still revisit today's sessions.`}
            </Text>
          </Card>
        ) : null}

        {/* The reflection pair and exercise each keep their own sequence day. */}
        <EyebrowLabel label="CONTINUE YOUR PATH" />
        <Text style={styles.pathKicker}>
          Day {currentDay} · {partsDone}/3 done
        </Text>
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

        {!spotCheckinLoading && !spotCheckin ? (
          <Card style={styles.firstCheckinCard}>
            <EyebrowLabel label="A MOMENT TO PAUSE" />
            <Text style={styles.firstCheckinTitle}>Take a 3–5 minute check-in</Text>
            <Text style={styles.firstCheckinBody}>
              Twelve short prompts to notice what feels true for you right now. No right answers, and no change to your
              daily-path progress.
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

        <Text style={styles.dayMeta}>One day at a time · the next day opens tomorrow once today is complete</Text>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    height: 202,
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
