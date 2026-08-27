import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { Button } from '../../design-system/Button';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { useDailyCatalog, useDailyDay } from '../../hooks/useDailyJourney';
import { useCheckins } from '../../hooks/useCheckins';
import { useReflections } from '../../hooks/useJournal';
import { allPartsComplete, type JourneyPart } from '../../journey/types';
import { PathMap } from './PathMap';

type Segment = 'day' | 'week' | 'month' | 'map';

const PART_META: Record<JourneyPart, { icon: string; tint: string; sub: string }> = {
  morning: { icon: 'sunny', tint: '#FBF1DE', sub: 'Start your day with awareness' },
  exercise: { icon: 'leaf', tint: '#F1F7EF', sub: "Explore what's within" },
  evening: { icon: 'moon', tint: '#F3EEF9', sub: 'Close your day with clarity' },
};

const PARTS: JourneyPart[] = ['morning', 'exercise', 'evening'];

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function weekStart(now: Date): Date {
  // Monday of the current week (the design's Mon..Sun row).
  const d = new Date(now);
  const dow = d.getDay(); // 0 = Sunday
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function PathScreen() {
  const router = useRouter();
  const focused = useIsFocused();
  const [segment, setSegment] = useState<Segment>('week');
  const {
    catalog, loading, error, refresh, unlockedDay, completedDays, statusByDay, total,
  } = useDailyCatalog();
  const { content } = useDailyDay(unlockedDay);
  const { data: checkins } = useCheckins();
  const { data: reflections } = useReflections();

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

  // Days (this week) the user was active in, from real data: any check-in or
  // reflection saved on that calendar day.
  const activeDays = useMemo(() => {
    const set = new Set<string>();
    for (const c of checkins) set.add(c.createdAt.slice(0, 10));
    for (const r of reflections) set.add(r.createdAt.slice(0, 10));
    return set;
  }, [checkins, reflections]);

  const now = new Date();
  const todayIso = isoDay(now);
  const week = useMemo(() => {
    const start = weekStart(now);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        iso: isoDay(d),
      };
    });
  }, [todayIso]);
  const activeThisWeek = week.filter((d) => activeDays.has(d.iso)).length;

  const status = statusByDay[unlockedDay];
  const todayDone = completedDays.includes(unlockedDay) || allPartsComplete(status);

  const titleFor = (part: JourneyPart): string => {
    const session = part === 'morning' ? content?.morning : part === 'exercise' ? content?.exercise : content?.evening;
    return session?.title || catalog?.days.find((d) => d.day === unlockedDay)?.theme || PART_META[part].sub;
  };

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

  const firstOpen = PARTS.find((p) => !status?.[p]) || 'exercise';
  const nextDay = Math.min(unlockedDay + 1, total);

  const partNodes = (
    <View style={styles.nodes}>
      {PARTS.map((part, i) => {
        const meta = PART_META[part];
        const done = Boolean(status?.[part]);
        return (
          <TouchableOpacity key={part} onPress={() => openPart(part)} activeOpacity={0.85}>
            <View style={styles.nodeRow}>
              <View style={styles.nodeIconCol}>
                <View style={[styles.nodeIcon, { backgroundColor: meta.tint }]}>
                  <Ionicons name={meta.icon as 'sunny' | 'leaf' | 'moon'} size={18} color={colors.ink} />
                </View>
                {i < PARTS.length - 1 ? <View style={styles.nodeLine} /> : null}
              </View>
              <View style={styles.nodeText}>
                <Text style={styles.nodeTitle}>{titleFor(part)}</Text>
                <Text style={styles.nodeSub}>{meta.sub}</Text>
              </View>
              {done ? (
                <View style={styles.nodeCheck}>
                  <Ionicons name="checkmark" size={14} color="#fff" />
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const tomorrowCard = (
    <TouchableOpacity onPress={() => openPart(firstOpen)} activeOpacity={0.9}>
      <View style={styles.tomorrowCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.tomorrowTitle}>
            {todayDone ? `Day ${nextDay} begins tomorrow` : `Day ${unlockedDay} is still open`}
          </Text>
          <Text style={styles.tomorrowSub}>
            {todayDone
              ? 'Every day is a new chance to come back to yourself.'
              : 'Morning, practice, and evening — whenever you are ready.'}
          </Text>
        </View>
        <Text style={styles.tomorrowLeaf}>🌿</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Path</Text>
      </View>

      {/* Segments */}
      <View style={styles.segmentRow}>
        {(['day', 'week', 'month', 'map'] as Segment[]).map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setSegment(s)}
            style={[styles.segment, segment === s && styles.segmentActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, segment === s && styles.segmentTextActive]}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {segment === 'week' && (
          <>
            {/* Week day row */}
            <View style={styles.weekRow}>
              {week.map((d) => {
                const active = activeDays.has(d.iso);
                const isToday = d.iso === todayIso;
                return (
                  <View key={d.iso} style={styles.weekCell}>
                    <Text style={styles.weekLabel}>{d.label.charAt(0)}</Text>
                    <View
                      style={[
                        styles.weekDot,
                        active && styles.weekDotDone,
                        isToday && !active && styles.weekDotToday,
                      ]}
                    >
                      {active ? <Ionicons name="checkmark" size={11} color="#fff" /> : null}
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.weekMetaRow}>
              <Text style={styles.weekMeta}>This week</Text>
              <Text style={styles.weekMeta}>{activeThisWeek} of 7 days</Text>
            </View>
            <View style={styles.weekBarBg}>
              <View style={[styles.weekBarFill, { width: `${(activeThisWeek / 7) * 100}%` }]} />
            </View>
          </>
        )}

        {segment !== 'month' && segment !== 'map' && partNodes}
        {segment !== 'month' && segment !== 'map' && tomorrowCard}

        {segment === 'map' && (
          <View>
            <Text style={styles.mapHead}>The whole journey, one winding road</Text>
            <PathMap
              catalog={catalog}
              unlockedDay={unlockedDay}
              completedDays={completedDays}
              statusByDay={statusByDay}
              onPressDay={openDay}
            />
            <Text style={styles.foot}>
              {completedDays.length} of {total} days lived · tap an open day to start it.
            </Text>
            {tomorrowCard}
          </View>
        )}

        {segment === 'month' && (
          <View>
            {catalog.units.map((unit) => (
              <Card key={unit.id} style={styles.unitCard}>
                <Text style={styles.unitTitle}>{unit.title}</Text>
                <Text style={styles.unitSub}>{unit.subtitle}</Text>
                <View style={styles.unitChips}>
                  {unit.days.map((day) => {
                    const done = completedDays.includes(day);
                    const current = day === unlockedDay && !done;
                    const locked = day > unlockedDay;
                    return (
                      <TouchableOpacity
                        key={day}
                        disabled={locked}
                        onPress={() => openPart('exercise', day)}
                        style={[
                          styles.chip,
                          done && styles.chipDone,
                          current && styles.chipCurrent,
                          locked && styles.chipLocked,
                        ]}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.chipText, done && styles.chipTextDone, current && styles.chipTextCurrent]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Card>
            ))}
            <Text style={styles.foot}>
              {completedDays.length} of {total} days lived · locked days open the morning after you finish a day.
            </Text>
            {tomorrowCard}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cream, padding: spacing.xl,
  },
  title: { fontFamily: 'Fraunces', fontSize: 28, fontWeight: '600', color: colors.ink },
  muted: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft, marginTop: spacing.sm, textAlign: 'center' },
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
  segmentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    padding: 4,
    backgroundColor: '#F0EBE0',
    borderRadius: 999,
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.white,
    shadowColor: '#3A3A3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  segmentText: {
    fontFamily: 'Nunito',
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  segmentTextActive: { color: colors.ink, fontWeight: '800' },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  weekCell: {
    alignItems: 'center',
    gap: 6,
  },
  weekLabel: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  weekDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#E0D8C8',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDotDone: {
    backgroundColor: colors.leaf,
    borderColor: colors.leaf,
  },
  weekDotToday: {
    borderColor: colors.gold,
    borderWidth: 2,
  },
  weekMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  weekMeta: {
    fontFamily: 'Nunito',
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.ink,
  },
  weekBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5DFD3',
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  weekBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.leaf,
  },
  mapHead: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: 0.2,
  },
  nodes: {
    marginTop: spacing.sm,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  nodeIconCol: {
    alignItems: 'center',
    width: 42,
  },
  nodeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLine: {
    width: 2,
    flex: 1,
    minHeight: 18,
    backgroundColor: '#E0D8C8',
    marginVertical: 4,
  },
  nodeText: {
    flex: 1,
    paddingBottom: spacing.lg,
    paddingTop: 4,
  },
  nodeTitle: {
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  nodeSub: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 2,
  },
  nodeCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  tomorrowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#F6F1E7',
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
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
  unitCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  unitTitle: {
    fontFamily: 'Fraunces',
    fontSize: 17,
    fontWeight: '600',
    color: colors.ink,
  },
  unitSub: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  unitChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E0D8C8',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipDone: {
    backgroundColor: colors.leaf,
    borderColor: colors.leaf,
  },
  chipCurrent: {
    borderColor: colors.gold,
    borderWidth: 2,
  },
  chipLocked: {
    opacity: 0.45,
  },
  chipText: {
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  chipTextDone: { color: '#fff', fontWeight: '800' },
  chipTextCurrent: { color: colors.ink, fontWeight: '800' },
  foot: {
    fontFamily: 'Nunito',
    fontSize: 11.5,
    color: colors.ghost,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    lineHeight: 17,
  },
});
