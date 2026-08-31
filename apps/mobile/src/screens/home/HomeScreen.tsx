import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { Button } from '../../design-system/Button';
import { useStreak } from '../../hooks/useAwareness';
import { useProfile } from '../../hooks/useProfile';
import { useDailyCatalog, useDailyDay } from '../../hooks/useDailyJourney';
import { allPartsComplete, type JourneyPart } from '../../journey/types';
import blossomHome from '../../../assets/images/blossom-home.png';

const greetingFor = (hours: number) =>
  hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';

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
  const now = new Date();
  const { data: profile } = useProfile();
  const { data: streak, refresh: refreshStreak } = useStreak();
  const { catalog, unlockedDay, statusByDay, completedDays, total, notDoneDays, refresh } =
    useDailyCatalog();
  const { content } = useDailyDay(unlockedDay);

  useEffect(() => {
    if (isFocused) {
      refreshStreak();
      refresh();
    }
  }, [isFocused, refresh, refreshStreak]);

  const status = statusByDay[unlockedDay];
  const todayDone = completedDays.includes(unlockedDay) || allPartsComplete(status);
  const greeting = greetingFor(now.getHours());
  const name = profile?.displayName?.trim();

  const open = (part: JourneyPart) => {
    router.push({ pathname: '/session', params: { day: String(unlockedDay), part } });
  };

  const titleFor = (part: JourneyPart): string => {
    const session = part === 'morning' ? content?.morning : part === 'exercise' ? content?.exercise : content?.evening;
    return (
      session?.title ||
      catalog?.days.find((d) => d.day === unlockedDay)?.theme ||
      PART_META[part].sub
    );
  };

  const streakNum = streak?.currentStreak || 0;
  const longest = streak?.longestStreak || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top row: menu + bell */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/journal')}
          hitSlop={10}
          style={styles.topIcon}
          accessibilityLabel="My Path"
        >
          <Ionicons name="menu" size={22} color={colors.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/settings')}
          hitSlop={10}
          style={styles.topIcon}
          accessibilityLabel="Reminders"
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

      {/* Illustration */}
      <View style={styles.illustrationCard}>
        <Image source={blossomHome} style={styles.illustration} resizeMode="contain" />
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
          {todayDone
            ? 'You lived the loop today. Tomorrow opens a new morning, practice, and evening.'
            : 'Today is a new loop. Unfinished days stay noted — they do not block tomorrow.'}
        </Text>
        {notDoneDays.length > 0 ? (
          <Text style={styles.missedNote}>
            {notDoneDays.length === 1
              ? `Day ${notDoneDays[0]} was not done.`
              : `${notDoneDays.length} days noted as not done.`}{' '}
            Today's morning, practice, and evening are new. Revisit missed days on your path anytime.
          </Text>
        ) : null}
      </Card>

      {/* Today's path — always today's journey day, even if yesterday was skipped. */}
      <EyebrowLabel label="TODAY'S PATH" />
      <Text style={styles.pathKicker}>
        Day {unlockedDay} · {PARTS.filter((p) => status?.[p]).length}/3 done
        {todayDone ? ' · lived' : ''}
      </Text>
      <Card style={styles.pathCard}>
        {PARTS.map((part, i) => {
          const meta = PART_META[part];
          const done = Boolean(status?.[part]);
          return (
            <TouchableOpacity key={part} onPress={() => open(part)} activeOpacity={0.85}>
              <View style={[styles.pathRow, i > 0 && styles.pathRowGap]}>
                <View style={[styles.pathIcon, { backgroundColor: meta.tint }]}>
                  <Ionicons name={meta.icon as 'sunny' | 'leaf' | 'moon'} size={18} color={colors.ink} />
                </View>
                <View style={styles.pathText}>
                  <Text style={styles.pathTitle}>{titleFor(part)}</Text>
                  <Text style={[styles.pathSub, done && styles.pathSubDone]}>
                    {done ? 'Completed' : 'Not done yet'}
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

      <Button
        title="See your path"
        onPress={() => router.push('/(tabs)/journal')}
        color={colors.leaf}
        style={{ marginTop: spacing.lg }}
      />

      <Text style={styles.dayMeta}>
        Day {unlockedDay} of {total} · a new loop each day · no catch-up required
      </Text>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.lg, paddingBottom: 110 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  topIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontFamily: 'Fraunces',
    fontSize: 30,
    fontWeight: '600',
    color: colors.ink,
    marginTop: spacing.xl,
    lineHeight: 38,
  },
  greetingSub: {
    fontFamily: 'Nunito',
    fontSize: 13.5,
    color: colors.inkSoft,
    marginTop: 4,
    lineHeight: 19,
  },
  illustrationCard: {
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    height: 190,
    backgroundColor: '#F9F2E0',
  },
  illustration: { width: '100%', height: '100%' },
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
    fontFamily: 'Fraunces',
    fontSize: 46,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 52,
  },
  rhythmLabel: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 2,
  },
  rhythmMeta: {
    alignItems: 'flex-end',
  },
  rhythmMetaLabel: {
    fontFamily: 'Nunito',
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rhythmMetaValue: {
    fontFamily: 'Fraunces',
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
    fontFamily: 'Nunito',
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 18,
  },
  missedNote: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.inkSoft,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  pathKicker: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkSoft,
    marginTop: -2,
    marginBottom: 4,
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
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  pathSub: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 1,
  },
  pathSubDone: {
    color: colors.leaf,
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
    fontFamily: 'Nunito',
    fontSize: 11.5,
    color: colors.ghost,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
