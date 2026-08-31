import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { colors, spacing, radius } from '../../design-system/tokens';
import { Button } from '../../design-system/Button';
import { useDailyCatalog } from '../../hooks/useDailyJourney';
import { allPartsComplete, type JourneyPart } from '../../journey/types';
import { PathMap } from './PathMap';

const PARTS: JourneyPart[] = ['morning', 'exercise', 'evening'];

export default function PathScreen() {
  const router = useRouter();
  const focused = useIsFocused();
  const {
    catalog, loading, error, refresh, unlockedDay, completedDays, statusByDay, total,
    notDoneDays,
  } = useDailyCatalog();

  // Refresh when the tab gains focus (coming back from any session).
  useEffect(() => {
    if (focused) refresh();
  }, [focused, refresh]);

  const openPart = useCallback(
    (part: JourneyPart, day = unlockedDay) => {
      router.push({ pathname: '/session', params: { day: String(day), part } });
    },
    [router, unlockedDay],
  );

  // Tapping a roadmap node opens that day's first still-open part.
  const openDay = useCallback(
    (day: number) => {
      const st = statusByDay[day];
      const first = PARTS.find((p) => !st?.[p]);
      openPart(first || 'exercise', day);
    },
    [openPart, statusByDay],
  );

  if (loading && !catalog) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.leaf} />
        <Text style={styles.muted}>Opening your path…</Text>
      </View>
    );
  }

  if (!catalog) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>The path is still packing.</Text>
        <Text style={styles.muted}>{error || 'Content will load from the on-device backend.'}</Text>
        <Button title="Try again" onPress={refresh} color={colors.leaf} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  const status = statusByDay[unlockedDay];
  const todayDone = completedDays.includes(unlockedDay) || allPartsComplete(status);
  const firstOpen = PARTS.find((p) => !status?.[p]) || 'exercise';
  const nextDay = Math.min(unlockedDay + 1, total);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Path</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.mapHead}>The whole journey, one winding road</Text>
        <PathMap
          catalog={catalog}
          unlockedDay={unlockedDay}
          completedDays={completedDays}
          statusByDay={statusByDay}
          onPressDay={openDay}
        />
        <Text style={styles.foot}>
          {completedDays.length} of {total} days lived
          {notDoneDays.length ? ` · ${notDoneDays.length} not done` : ''}
          {' · tap an open day to start it.'}
        </Text>

        {/* Next-up card */}
        <View style={styles.tomorrowCardWrap}>
          <TouchableOpacity
            onPress={() => openPart(firstOpen)}
            activeOpacity={0.9}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.tomorrowCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tomorrowTitle}>
                  {todayDone ? `Day ${nextDay} begins tomorrow` : `Day ${unlockedDay} is still open`}
                </Text>
                <Text style={styles.tomorrowSub}>
                  {todayDone
                    ? 'Tomorrow brings a new morning, practice, and evening — even if a past day was left undone.'
                    : notDoneDays.length
                      ? "Yesterday's unfinished loop stays noted as not done. Today's three parts are new."
                      : 'Morning, practice, and evening — whenever you are ready. Skip a day and tomorrow still opens a new loop.'}
                </Text>
              </View>
              <Text style={styles.tomorrowLeaf}>🌿</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
    padding: spacing.xl,
  },
  title: { fontFamily: 'Fraunces', fontSize: 28, fontWeight: '600', color: colors.ink },
  muted: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  headerTitle: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
  },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  mapHead: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: 0.2,
  },
  foot: {
    fontFamily: 'Nunito',
    fontSize: 11.5,
    color: colors.ghost,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    lineHeight: 17,
  },
  tomorrowCardWrap: {
    marginTop: spacing.lg,
  },
  tomorrowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#F6F1E7',
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  tomorrowTitle: {
    fontFamily: 'Fraunces',
    fontSize: 17,
    fontWeight: '600',
    color: colors.ink,
  },
  tomorrowSub: {
    fontFamily: 'Nunito',
    fontSize: 12.5,
    color: colors.inkSoft,
    marginTop: 3,
    lineHeight: 18,
  },
  tomorrowLeaf: {
    fontSize: 30,
  },
});
