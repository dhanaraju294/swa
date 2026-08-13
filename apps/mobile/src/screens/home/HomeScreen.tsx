import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { colors, typography, spacing, radius, shadow } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { PetalMark } from '../../design-system/PetalMark';
import { ProgressPetals } from '../../design-system/ProgressPetals';
import { Button } from '../../design-system/Button';
import { useStreak, useAwarenessSnapshot } from '../../hooks/useAwareness';
import { useLatestCheckin } from '../../hooks/useCheckins';
import { useJournalProgress } from '../../hooks/useJournal';

const today = new Date();
const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';
const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

export default function HomeScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { data: streak, refresh: refreshStreak } = useStreak();
  const { data: latestCheckin, refresh: refreshLatestCheckin } = useLatestCheckin();
  const { data: sevenDayProgress, refresh: refreshSevenDayProgress } = useJournalProgress('seven-day');
  const { data: twentyOneDayProgress, refresh: refreshTwentyOneDayProgress } = useJournalProgress('twenty-one-day');
  const { data: awareness, refresh: refreshAwareness } = useAwarenessSnapshot();

  const refreshHomeData = useCallback(async () => {
    await Promise.all([
      refreshStreak(),
      refreshLatestCheckin(),
      refreshSevenDayProgress(),
      refreshTwentyOneDayProgress(),
      refreshAwareness(),
    ]);
  }, [refreshAwareness, refreshLatestCheckin, refreshSevenDayProgress, refreshStreak, refreshTwentyOneDayProgress]);

  useEffect(() => {
    if (isFocused) {
      refreshHomeData();
    }
  }, [isFocused, refreshHomeData]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        <PetalMark size={32} />
      </View>

      {/* Streak Card */}
      <Card style={styles.streakCard}>
        <View style={styles.streakRow}>
          <View>
            <EyebrowLabel label="YOUR STREAK" />
            <Text style={styles.streakNumber}>{streak?.currentStreak || 0}</Text>
            <Text style={styles.streakLabel}>days showing up</Text>
          </View>
          <View style={styles.streakMeta}>
            <Text style={styles.streakMetaLabel}>Best</Text>
            <Text style={styles.streakMetaValue}>{streak?.longestStreak || 0}</Text>
          </View>
        </View>
      </Card>

      {/* Journey Cards */}
      <EyebrowLabel label="CONTINUE YOUR JOURNEY" />

      <TouchableOpacity onPress={() => router.push('/(tabs)/on-the-spot')}>
        <Card style={styles.journeyCard}>
          <View style={styles.journeyCardInner}>
            <View style={[styles.journeyIcon, { backgroundColor: '#FBEFEC' }]}>
              <Text style={styles.journeyEmoji}>⏸</Text>
            </View>
            <View style={styles.journeyInfo}>
              <Text style={styles.journeyTitle}>On-the-Spot</Text>
              <Text style={styles.journeySub}>Quick reflection · under 60 seconds</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(tabs)/journal')}>
        <Card style={styles.journeyCard}>
          <View style={styles.journeyCardInner}>
            <View style={[styles.journeyIcon, { backgroundColor: '#EAF5F9' }]}>
              <Text style={styles.journeyEmoji}>📝</Text>
            </View>
            <View style={styles.journeyInfo}>
              <Text style={styles.journeyTitle}>7-Day Journal</Text>
              <Text style={styles.journeySub}>
                Day {sevenDayProgress?.currentDay || 1} of 7
              </Text>
              <ProgressPetals
                total={7}
                current={sevenDayProgress?.currentDay || 1}
                completed={sevenDayProgress?.completedDays || []}
              />
            </View>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(tabs)/journal')}>
        <Card style={styles.journeyCard}>
          <View style={styles.journeyCardInner}>
            <View style={[styles.journeyIcon, { backgroundColor: '#F3EEF9' }]}>
              <Text style={styles.journeyEmoji}>📖</Text>
            </View>
            <View style={styles.journeyInfo}>
              <Text style={styles.journeyTitle}>21-Day Deep Journal</Text>
              <Text style={styles.journeySub}>
                Day {twentyOneDayProgress?.currentDay || 1} of 21
              </Text>
              <ProgressPetals
                total={21}
                current={twentyOneDayProgress?.currentDay || 1}
                completed={twentyOneDayProgress?.completedDays || []}
              />
            </View>
          </View>
        </Card>
      </TouchableOpacity>

      {/* Quick Check-In */}
      <Card style={styles.checkinCard}>
        <EyebrowLabel label="QUICK CHECK-IN" />
        {latestCheckin ? (
          <View>
            <Text style={styles.checkinText}>
              Last check-in: mood {latestCheckin.mood}/5, energy {latestCheckin.energy}%
            </Text>
            <Text style={styles.checkinTime}>
              {new Date(latestCheckin.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ) : (
          <Text style={styles.checkinText}>
            No check-ins yet. Tap below to start.
          </Text>
        )}
        <Button
          title="Check In Now"
          onPress={() => router.push('/(tabs)/on-the-spot')}
          color={colors.gold}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      {/* Awareness Snapshot */}
      {awareness.length > 0 && (
        <Card style={styles.awarenessCard}>
          <EyebrowLabel label="AWARENESS SNAPSHOT" />
          {awareness.map((dim) => (
            <View key={dim.dimension} style={styles.awarenessRow}>
              <Text style={styles.awarenessDim}>
                {dim.dimension.replace(/_/g, ' ')}
              </Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.outerBg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  greeting: {
    fontFamily: 'Fraunces',
    fontSize: 28,
    fontWeight: '600',
    color: colors.ink,
  },
  date: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 2,
  },
  streakCard: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  streakNumber: {
    fontFamily: 'Fraunces',
    fontSize: 48,
    fontWeight: '700',
    color: colors.gold,
    lineHeight: 52,
  },
  streakLabel: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: colors.inkSoft,
  },
  streakMeta: {
    alignItems: 'center',
  },
  streakMetaLabel: {
    fontFamily: 'Nunito',
    fontSize: 10,
    color: colors.inkSoft,
    textTransform: 'uppercase',
  },
  streakMetaValue: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
  },
  journeyCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  journeyCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  journeyIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyEmoji: {
    fontSize: 22,
  },
  journeyInfo: {
    flex: 1,
    gap: 2,
  },
  journeyTitle: {
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  journeySub: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.inkSoft,
  },
  checkinCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  checkinText: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: colors.ink,
    lineHeight: 19,
  },
  checkinTime: {
    fontFamily: 'Nunito',
    fontSize: 11,
    color: colors.inkSoft,
    marginTop: 4,
  },
  awarenessCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  awarenessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: spacing.sm,
  },
  awarenessDim: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '600',
    color: colors.ink,
    width: 100,
    textTransform: 'capitalize',
  },
  awarenessBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EDE8DD',
  },
  awarenessBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sage,
  },
  awarenessScore: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkSoft,
    width: 24,
    textAlign: 'right',
  },
});
