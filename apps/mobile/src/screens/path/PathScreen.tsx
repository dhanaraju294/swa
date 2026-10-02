import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PathMap } from './PathMap';
import { Button } from '../../design-system/Button';
import { colors, spacing, radius } from '../../design-system/tokens';
import { useDailyCatalog } from '../../hooks/useDailyJourney';

export default function PathScreen() {
  const router = useRouter();
  const focused = useIsFocused();
  const { catalog, loading, refresh, exerciseDay, exerciseCompletedDays, statusByDay, total } = useDailyCatalog();

  // Refresh when the tab gains focus (coming back from an exercise).
  useEffect(() => {
    if (focused) refresh();
  }, [focused, refresh]);

  const openExercise = useCallback(
    (day?: number) => {
      const saved = day != null && Boolean(statusByDay[day]?.exercise);
      const selectedDay = day != null && (day <= exerciseDay || saved) ? day : exerciseDay;
      router.push({ pathname: '/session', params: { day: String(selectedDay), part: 'exercise' } });
    },
    [router, exerciseDay, statusByDay],
  );

  const openDay = useCallback(
    (day: number) => {
      if (day <= exerciseDay || statusByDay[day]?.exercise) openExercise(day);
    },
    [openExercise, exerciseDay, statusByDay],
  );

  if (loading && !catalog) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <ActivityIndicator color={colors.leafInk} accessibilityLabel="Loading your path" />
        <Text style={styles.muted}>Opening your path…</Text>
      </SafeAreaView>
    );
  }

  if (!catalog) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <Text style={styles.title}>The path is taking a moment.</Text>
        <Text style={styles.muted}>Your saved progress is safe. Check your connection, then try again.</Text>
        <Button title="Try again" onPress={refresh} color={colors.leaf} style={{ marginTop: spacing.lg }} />
      </SafeAreaView>
    );
  }

  const exerciseDone = Boolean(statusByDay[exerciseDay]?.exercise);
  const allExercisesDone = exerciseCompletedDays.length === total;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Path</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.mapHead}>Your exercises, one winding road</Text>
        <PathMap catalog={catalog} exerciseDay={exerciseDay} statusByDay={statusByDay} onPressDay={openDay} />
        <Text style={styles.foot}>
          Exercises {exerciseCompletedDays.length}/{total} complete
        </Text>

        <View style={styles.exerciseCardWrap}>
          <TouchableOpacity
            onPress={() => openExercise()}
            activeOpacity={0.9}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`${allExercisesDone ? 'Review' : 'Open'} exercise, Day ${exerciseDay}. ${exerciseDone ? 'Complete' : 'Still open'}.`}
            accessibilityHint="Exercise progress advances independently and stays on its current day until the exercise is complete."
          >
            <View style={styles.exerciseCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseTitle}>
                  {allExercisesDone ? 'Review exercises' : `Exercise · Day ${exerciseDay}`}
                </Text>
                <Text style={styles.exerciseSub}>
                  {allExercisesDone
                    ? `All ${total} exercises are complete.`
                    : `${exerciseDone ? 'Completed' : 'Still open'}. Your exercise path advances when you finish this practice.`}
                </Text>
              </View>
              <Text style={styles.exerciseLeaf}>🌱</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
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
  title: { fontFamily: 'Fraunces_600SemiBold', fontSize: 28, fontWeight: '600', color: colors.ink },
  muted: {
    fontFamily: 'Nunito_400Regular',
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
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
  },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  mapHead: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: 0.2,
  },
  foot: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11.5,
    color: colors.ghost,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    lineHeight: 17,
  },
  exerciseCardWrap: {
    marginTop: spacing.lg,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#F6F1E7',
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  exerciseTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 17,
    fontWeight: '600',
    color: colors.ink,
  },
  exerciseSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12.5,
    color: colors.inkSoft,
    marginTop: 3,
    lineHeight: 18,
  },
  exerciseLeaf: {
    fontSize: 30,
  },
});
