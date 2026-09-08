import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { colors, spacing, radius, shadow } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { PetalMark } from '../../design-system/PetalMark';
import { Button } from '../../design-system/Button';
import { useStreak, useAwarenessSnapshot } from '../../hooks/useAwareness';
import { useLatestCheckin } from '../../hooks/useCheckins';
import { useProfile } from '../../hooks/useProfile';
import { useDailyCatalog, useDailyDay } from '../../hooks/useDailyJourney';
import { allPartsComplete, partOfDay, reflectionForHome, type JourneyPart } from '../../journey/types';
import { useMLRecommendations } from '../../hooks/useMLRecommendations';

const greetingFor = (hours: number) =>
  hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';

const PART_COPY: Record<JourneyPart, { title: string; sub: string; tint: string }> = {
  morning: { title: 'Morning reflection', sub: 'What state am I entering?', tint: '#FBF1DE' },
  exercise: { title: "Today's practice", sub: 'One tiny noticing', tint: '#F1F7EF' },
  evening: { title: 'Evening reflection', sub: 'What did I notice?', tint: '#F3EEF9' },
};

export default function HomeScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const now = new Date();
  const { data: profile, refresh: refreshProfile } = useProfile();
  const { data: streak, refresh: refreshStreak } = useStreak();
  const { data: latestCheckin, refresh: refreshLatest } = useLatestCheckin();
  const { data: awareness, refresh: refreshAwareness } = useAwarenessSnapshot();
  const { catalog, unlockedDay, statusByDay, completedDays, refresh, total } = useDailyCatalog();
  const { content } = useDailyDay(unlockedDay);
  const { data: mlRecommendations, loading: mlLoading, available: mlAvailable, refresh: refreshML } = useMLRecommendations(profile);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshProfile(), refreshStreak(), refreshLatest(), refreshAwareness(), refresh(), refreshML()]);
  }, [refresh, refreshAwareness, refreshLatest, refreshProfile, refreshStreak, refreshML]);

  useEffect(() => {
    if (isFocused) refreshAll();
  }, [isFocused, refreshAll]);

  const status = statusByDay[unlockedDay];
  const suggested = partOfDay(now);
  const todayDone = completedDays.includes(unlockedDay) || allPartsComplete(status);
  // Home dashboard reflection toggle: 00:00–13:59 → morning, 14:00–23:59 → evening
  const activeReflection: JourneyPart = reflectionForHome(now);
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const greeting = profile?.displayName
    ? `${greetingFor(now.getHours())}, ${profile.displayName}`
    : greetingFor(now.getHours());

  const open = (part: JourneyPart) => {
    router.push({ pathname: '/session', params: { day: String(unlockedDay), part } });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        <PetalMark size={32} />
      </View>

      <Card style={styles.streakCard}>
        <View style={styles.streakRow}>
          <View>
            <EyebrowLabel label="SHOWING UP" />
            <Text style={styles.streakNumber}>{streak?.currentStreak || 0}</Text>
            <Text style={styles.streakLabel}>days you returned to yourself</Text>
          </View>
          <View style={styles.streakMeta}>
            <Text style={styles.streakMetaLabel}>Longest</Text>
            <Text style={styles.streakMetaValue}>{streak?.longestStreak || 0}</Text>
          </View>
        </View>
        <Text style={styles.streakNote}>Missed a day? Nothing is broken. Continue when you're ready.</Text>
      </Card>

      <EyebrowLabel label="TODAY'S RITUAL" />
      <Text style={styles.sectionTitle}>{content?.theme || catalog?.days.find((d) => d.day === unlockedDay)?.theme || 'A quiet practice'}</Text>
      <Text style={styles.sectionSub}>
        {todayDone
          ? 'You lived the loop today. The next node opens tomorrow.'
          : activeReflection === 'morning'
            ? `Day ${unlockedDay} of ${total} · morning reflection + practice`
            : `Day ${unlockedDay} of ${total} · practice + evening reflection`}
      </Text>

      {/* Home now shows: 1) today's practice (always) + 2) time-bound reflection (morning 00:00–13:59, evening 14:00–23:59) */}
      {(() => {
        const parts: JourneyPart[] = ['exercise', activeReflection];
        return parts.map((part, idx) => {
          const copy = PART_COPY[part];
          const done = Boolean(status?.[part]);
          const title =
            part === 'exercise' && content?.exercise.title ? content.exercise.title : copy.title;
          const glow = suggested === part && !done && !todayDone;
          // Keep exercise first (✓/1), reflection second (✓/2) for consistent 1–2 numbering
          const indexLabel = done ? '✓' : String(idx + 1);
          return (
            <TouchableOpacity key={part} onPress={() => open(part)} activeOpacity={0.88}>
              <View style={[styles.ritual, { backgroundColor: copy.tint }, glow && styles.ritualGlow]}>
                <View style={styles.ritualIndex}>
                  <Text style={styles.ritualIndexText}>{indexLabel}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ritualTitle}>{title}</Text>
                  <Text style={styles.ritualSub}>{done ? 'Saved · revisit anytime' : copy.sub}</Text>
                </View>
                <Text style={styles.ritualCta}>{done ? 'View' : 'Begin'}</Text>
              </View>
            </TouchableOpacity>
          );
        });
      })()}

      <Button
        title={todayDone ? 'See your path' : suggested === 'evening' ? 'Open evening' : 'Continue the path'}
        onPress={() => (todayDone ? router.push('/(tabs)/journal') : open(suggested))}
        color={colors.gold}
        style={{ marginTop: spacing.md }}
      />

      {mlAvailable && mlRecommendations.length > 0 ? (
        <Card style={styles.mlCard}>
          <EyebrowLabel label="ADAPTIVE RECOMMENDATION" />
          <Text style={styles.mlTitle}>A practice chosen for you</Text>
          <Text style={styles.mlSub}>Linear Regression + Random Forest + Neural Network ensemble</Text>
          {mlRecommendations.map((item) => (
            <TouchableOpacity key={item.exercise_id} style={styles.mlRow} onPress={() => open('exercise')} activeOpacity={0.85}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mlExercise}>{item.title}</Text>
                <Text style={styles.mlMeta}>{item.area} · {item.skill} · difficulty {item.difficulty}</Text>
              </View>
              <Text style={styles.mlScore}>{Math.round(item.hybrid_score * 100)}</Text>
            </TouchableOpacity>
          ))}
        </Card>
      ) : null}

      <TouchableOpacity onPress={() => router.push('/(tabs)/on-the-spot')} style={{ marginTop: spacing.xl }}>
        <Card style={styles.spot}>
          <EyebrowLabel label="ANYTIME" />
          <Text style={styles.spotTitle}>On-the-spot</Text>
          <Text style={styles.spotSub}>
            A 30-second pause when something snags. Not part of today's path — just a pocket.
          </Text>
          {latestCheckin ? (
            <Text style={styles.spotMeta}>
              Last check-in · mood {latestCheckin.mood}/5
            </Text>
          ) : null}
        </Card>
      </TouchableOpacity>

      {awareness.length > 0 && (
        <Card style={styles.awarenessCard}>
          <EyebrowLabel label="THIS WEEK" />
          {awareness.slice(0, 4).map((dim) => (
            <View key={dim.dimension} style={styles.awarenessRow}>
              <Text style={styles.awarenessDim}>{dim.dimension.replace(/_/g, ' ')}</Text>
              <View style={styles.awarenessBarBg}>
                <View style={[styles.awarenessBarFill, { width: `${dim.score}%` }]} />
              </View>
              <Text style={styles.awarenessScore}>{dim.score}</Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.outerBg },
  content: { padding: spacing.lg, paddingBottom: 110 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  greeting: { fontFamily: 'Fraunces', fontSize: 28, fontWeight: '600', color: colors.ink },
  date: { fontFamily: 'Nunito', fontSize: 14, color: colors.inkSoft, marginTop: 2 },
  streakCard: { padding: spacing.lg, marginBottom: spacing.xl },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  streakNumber: { fontFamily: 'Fraunces', fontSize: 48, fontWeight: '700', color: colors.gold, lineHeight: 52 },
  streakLabel: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft },
  streakMeta: { alignItems: 'center' },
  streakMetaLabel: { fontFamily: 'Nunito', fontSize: 10, color: colors.inkSoft, textTransform: 'uppercase' },
  streakMetaValue: { fontFamily: 'Fraunces', fontSize: 20, fontWeight: '600', color: colors.ink },
  streakNote: { fontFamily: 'Nunito', fontSize: 12, color: colors.inkSoft, marginTop: spacing.md, lineHeight: 17 },
  sectionTitle: { fontFamily: 'Fraunces', fontSize: 22, fontWeight: '600', color: colors.ink, marginTop: 6 },
  sectionSub: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft, marginBottom: spacing.md, marginTop: 4 },
  ritual: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    ...shadow.soft,
  },
  ritualGlow: { borderWidth: 1.5, borderColor: colors.gold },
  ritualIndex: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ritualIndexText: { fontFamily: 'Nunito', fontSize: 14, fontWeight: '800', color: colors.ink },
  ritualTitle: { fontFamily: 'Nunito', fontSize: 15, fontWeight: '800', color: colors.ink },
  ritualSub: { fontFamily: 'Nunito', fontSize: 12, color: colors.inkSoft, marginTop: 1 },
  ritualCta: { fontFamily: 'Nunito', fontSize: 12, fontWeight: '700', color: colors.inkSoft },
  spot: { padding: spacing.lg },
  spotTitle: { fontFamily: 'Fraunces', fontSize: 20, fontWeight: '600', color: colors.ink, marginTop: 4 },
  spotSub: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft, lineHeight: 19, marginTop: 4 },
  spotMeta: { fontFamily: 'Nunito', fontSize: 11, color: colors.ghost, marginTop: 8 },
  awarenessCard: { padding: spacing.lg, marginTop: spacing.lg },
  awarenessRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: spacing.sm },
  awarenessDim: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '600',
    color: colors.ink,
    width: 100,
    textTransform: 'capitalize',
  },
  awarenessBarBg: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#EDE8DD' },
  awarenessBarFill: { height: 6, borderRadius: 3, backgroundColor: colors.sage },
  awarenessScore: { fontFamily: 'Nunito', fontSize: 11, fontWeight: '700', color: colors.inkSoft, width: 24, textAlign: 'right' },
  mlCard: { padding: spacing.lg, marginTop: spacing.lg },
  mlTitle: { fontFamily: 'Fraunces', fontSize: 20, fontWeight: '600', color: colors.ink, marginTop: 4 },
  mlSub: { fontFamily: 'Nunito', fontSize: 12, color: colors.inkSoft, marginTop: 3, marginBottom: spacing.sm },
  mlRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: '#EDE8DD' },
  mlExercise: { fontFamily: 'Nunito', fontSize: 14, fontWeight: '800', color: colors.ink },
  mlMeta: { fontFamily: 'Nunito', fontSize: 11, color: colors.inkSoft, marginTop: 2 },
  mlScore: { fontFamily: 'Fraunces', fontSize: 18, fontWeight: '700', color: colors.gold, marginLeft: spacing.sm },
});
