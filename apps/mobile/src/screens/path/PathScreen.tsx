import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { colors, spacing } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { Button } from '../../design-system/Button';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { useDailyCatalog } from '../../hooks/useDailyJourney';
import { allPartsComplete, partOfDay } from '../../journey/types';
import { PathMap } from './PathMap';

export default function PathScreen() {
  const router = useRouter();
  const focused = useIsFocused();
  const {
    catalog,
    loading,
    error,
    refresh,
    unlockedDay,
    completedDays,
    statusByDay,
    total,
  } = useDailyCatalog();

  useEffect(() => {
    if (focused) refresh();
  }, [focused, refresh]);

  const openDay = useCallback(
    (day: number) => {
      const status = statusByDay[day];
      const suggested = !status?.morning
        ? 'morning'
        : !status?.exercise
          ? 'exercise'
          : !status?.evening
            ? 'evening'
            : partOfDay();
      router.push({ pathname: '/session', params: { day: String(day), part: suggested } });
    },
    [router, statusByDay],
  );

  if (loading && !catalog) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.gold} />
        <Text style={styles.muted}>Opening your path…</Text>
      </View>
    );
  }

  if (!catalog) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>The path is still packing.</Text>
        <Text style={styles.muted}>{error || 'Content will load from the on-device backend.'}</Text>
        <Button title="Try again" onPress={refresh} color={colors.gold} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  const current = catalog.days.find((d) => d.day === unlockedDay);
  const status = statusByDay[unlockedDay];
  const doneToday = completedDays.includes(unlockedDay) || allPartsComplete(status);
  const doneCount = completedDays.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <EyebrowLabel label="YOUR PATH" />
      <Text style={styles.title}>{catalog.title}</Text>
      <Text style={styles.lede}>{catalog.philosophy || catalog.subtitle}</Text>

      <Card style={styles.hero}>
        <Text style={styles.heroEyebrow}>{doneToday ? 'TODAY IS COMPLETE' : `DAY ${unlockedDay} OF ${total}`}</Text>
        <Text style={styles.heroTitle}>{current?.theme || 'Continue'}</Text>
        <Text style={styles.heroSub}>
          {doneToday
            ? 'Tomorrow a new node opens. You can still revisit today.'
            : current
              ? `Today's practice: ${current.exerciseTitle}`
              : 'A quiet practice, one node at a time.'}
        </Text>
        <View style={styles.pips}>
          {(['morning', 'exercise', 'evening'] as const).map((part) => (
            <View key={part} style={[styles.pip, status?.[part] && styles.pipOn]}>
              <Text style={[styles.pipText, status?.[part] && styles.pipTextOn]}>
                {part === 'exercise' ? 'Practice' : part[0].toUpperCase() + part.slice(1)}
              </Text>
            </View>
          ))}
        </View>
        <Button
          title={doneToday ? 'Revisit today' : 'Continue today'}
          onPress={() => openDay(unlockedDay)}
          color={colors.gold}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{doneCount} of {total} days lived</Text>
        <Text style={styles.meta}>No rush. No catch-up.</Text>
      </View>

      <PathMap
        catalog={catalog}
        unlockedDay={unlockedDay}
        completedDays={completedDays}
        statusByDay={statusByDay}
        onPressDay={openDay}
      />

      <Text style={styles.foot}>
        Locked nodes open the morning after you finish a day — or stay here if you want more time.
      </Text>
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.lg, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, padding: spacing.xl },
  title: { fontFamily: 'Fraunces', fontSize: 30, fontWeight: '600', color: colors.ink, marginTop: 4 },
  lede: { fontFamily: 'Nunito', fontSize: 14, color: colors.inkSoft, lineHeight: 21, marginBottom: spacing.lg, marginTop: 6 },
  muted: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft, marginTop: spacing.sm, textAlign: 'center' },
  hero: { padding: spacing.lg, marginBottom: spacing.lg },
  heroEyebrow: { fontFamily: 'Nunito', fontSize: 10.5, fontWeight: '800', letterSpacing: 2.4, color: colors.inkSoft },
  heroTitle: { fontFamily: 'Fraunces', fontSize: 24, fontWeight: '600', color: colors.ink, marginTop: 4 },
  heroSub: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft, lineHeight: 19, marginTop: 6 },
  pips: { flexDirection: 'row', gap: 8, marginTop: spacing.md },
  pip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F4EFE6',
  },
  pipOn: { backgroundColor: '#E4F0E3' },
  pipText: { fontFamily: 'Nunito', fontSize: 11, fontWeight: '700', color: colors.inkSoft },
  pipTextOn: { color: '#3E5A42' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  meta: { fontFamily: 'Nunito', fontSize: 11, color: colors.inkSoft },
  foot: { fontFamily: 'Nunito', fontSize: 12, color: colors.inkSoft, lineHeight: 18, textAlign: 'center', marginTop: spacing.lg },
});
