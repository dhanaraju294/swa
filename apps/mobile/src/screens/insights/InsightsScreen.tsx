import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { useCheckins } from '../../hooks/useCheckins';
import { useReflections, useOnTheSpot } from '../../hooks/useJournal';
import { useAwarenessSnapshot, useStreak } from '../../hooks/useAwareness';
import { useDailyCatalog } from '../../hooks/useDailyJourney';
import { useLatestSpotCheckin } from '../../hooks/useSpotCheckins';
import { partsCompleteCount } from '../../journey/calendar';
import {
  computeInsightCards,
  dimensionLabel,
  innerWeather,
  moodFace,
  namedFeelings,
  pathStats,
  resolveAwareness,
  weekLoop,
} from '../../insights/compute';
import type { Checkin } from '../../native/InwardEngine';

function prettyReflection(prompt: string, response: string): { title: string; body: string } {
  if (prompt !== 'session') {
    return { title: prompt, body: response };
  }
  try {
    const parsed = JSON.parse(response) as { part?: string; day?: number; answers?: Record<string, string> };
    const answers = parsed.answers || {};
    const bits = Object.values(answers)
      .filter((v) => v && v !== '__skip__')
      .map((v) => {
        if (typeof v === 'string' && v.startsWith('other:')) {
          return v.replace('other:', '').trim();
        }
        if (typeof v === 'string' && v.startsWith('[') && v.endsWith(']')) {
          try {
            const arr = JSON.parse(v);
            if (Array.isArray(arr)) return arr.join(', ');
          } catch {}
        }
        return v;
      })
      .filter(Boolean)
      .slice(0, 3);
    const dayLabel = parsed.day ? `Day ${parsed.day} · ` : '';
    const partLabel = parsed.part ? `${parsed.part.charAt(0).toUpperCase() + parsed.part.slice(1)}` : 'Session';
    return {
      title: `${dayLabel}${partLabel}`,
      body: bits.length ? bits.join(' · ') : 'Completed, mostly skipped.',
    };
  } catch {
    return { title: 'Session', body: 'Saved.' };
  }
}

const PART_MARK: Record<'morning' | 'exercise' | 'evening', { icon: 'sunny' | 'leaf' | 'moon'; label: string }> = {
  morning: { icon: 'sunny', label: 'Morning' },
  exercise: { icon: 'leaf', label: 'Practice' },
  evening: { icon: 'moon', label: 'Evening' },
};

export default function InsightsScreen() {
  const isFocused = useIsFocused();
  const { data: checkins, refresh: refreshCheckins } = useCheckins();
  const { data: reflections, refresh: refreshReflections } = useReflections();
  const { data: onTheSpot, refresh: refreshOnTheSpot } = useOnTheSpot();
  const { data: awarenessSnap, refresh: refreshAwareness } = useAwarenessSnapshot();
  const { data: streak, refresh: refreshStreak } = useStreak();
  const { data: spot, refresh: refreshSpot } = useLatestSpotCheckin();
  const {
    completedDays,
    statusByDay,
    unlockedDay,
    total,
    startedOn,
    notDoneDays,
    refresh: refreshPath,
  } = useDailyCatalog();
  const [showMoreReflections, setShowMoreReflections] = useState(false);
  const [showMoreCheckins, setShowMoreCheckins] = useState(false);

  useEffect(() => {
    if (isFocused) {
      refreshCheckins();
      refreshReflections();
      refreshOnTheSpot();
      refreshAwareness();
      refreshPath();
      refreshStreak();
      refreshSpot();
    }
  }, [
    isFocused,
    refreshAwareness,
    refreshCheckins,
    refreshOnTheSpot,
    refreshPath,
    refreshReflections,
    refreshSpot,
    refreshStreak,
  ]);

  const todayStatus = statusByDay[unlockedDay];
  const todayParts = partsCompleteCount(todayStatus);
  const stats = useMemo(
    () => pathStats(unlockedDay, total, completedDays, statusByDay),
    [unlockedDay, total, completedDays, statusByDay],
  );
  const week = useMemo(
    () =>
      weekLoop({
        startedOn,
        statusByDay,
        completedDays,
        unlockedDay,
        total,
        checkins,
        onTheSpot,
      }),
    [startedOn, statusByDay, completedDays, unlockedDay, total, checkins, onTheSpot],
  );
  const weather = useMemo(() => innerWeather(checkins), [checkins]);
  const feelings = useMemo(() => namedFeelings(checkins, onTheSpot), [checkins, onTheSpot]);
  const awareness = useMemo(
    () => resolveAwareness(awarenessSnap, checkins, reflections, streak, completedDays),
    [awarenessSnap, checkins, reflections, streak, completedDays],
  );
  const insightCards = useMemo(
    () =>
      computeInsightCards({
        checkins,
        onTheSpot,
        reflections,
        statusByDay,
        unlockedDay,
        completedDays,
        streak,
        spot,
      }),
    [checkins, onTheSpot, reflections, statusByDay, unlockedDay, completedDays, streak, spot],
  );

  const overall = awareness.find((d) => d.dimension === 'overall');
  const dims = awareness.filter((d) => d.dimension !== 'overall');
  const lastCheckins = showMoreCheckins ? checkins.slice(0, 14) : checkins.slice(0, 5);
  const lastReflections = showMoreReflections ? reflections.slice(0, 16) : reflections.slice(0, 6);

  const lead =
    stats.lived + stats.notDone === 0 && checkins.length === 0
      ? 'Nothing to plot yet. Live a loop or check in, and this page becomes a mirror.'
      : stats.notDone > 0
        ? 'Here is what your days have been teaching you — including the ones you left undone.'
        : "Here's what your recent days are showing you.";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        <Ionicons name="sparkles" size={18} color="#C99A2C" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>{lead}</Text>

        {/* Today's loop */}
        <Card style={styles.card}>
          <EyebrowLabel label="TODAY'S LOOP" />
          <Text style={styles.cardHead}>
            Day {unlockedDay} of {total}
            {todayParts === 3 ? ' · lived' : todayParts === 0 ? ' · not done yet' : ` · ${todayParts}/3`}
          </Text>
          <View style={styles.loopRow}>
            {(['morning', 'exercise', 'evening'] as const).map((part) => {
              const done = Boolean(todayStatus?.[part]);
              const meta = PART_MARK[part];
              return (
                <View key={part} style={[styles.loopChip, done ? styles.loopChipDone : styles.loopChipOpen]}>
                  <Ionicons name={meta.icon} size={14} color={done ? colors.leaf : colors.inkSoft} />
                  <Text style={[styles.loopChipText, done && styles.loopChipTextDone]}>
                    {meta.label}
                  </Text>
                  <Text style={[styles.loopChipState, done ? styles.loopDone : styles.loopNot]}>
                    {done ? 'done' : 'not done'}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.hint}>
            A new morning, practice, and evening open every calendar day. Yesterday is noted, never carried.
          </Text>
        </Card>

        {/* This week — three marks per day */}
        <Card style={styles.card}>
          <EyebrowLabel label="THIS WEEK" />
          <Text style={styles.cardHead}>Sun, leaf, moon — the three marks of a day.</Text>
          <View style={styles.week}>
            {week.map((d) => {
              const isToday = d.kind === 'today';
              const missed = d.kind === 'missed';
              return (
                <View key={d.iso} style={styles.weekCol}>
                  <Text style={[styles.weekLabel, isToday && styles.weekLabelToday]}>{d.label}</Text>
                  <View style={[styles.petalStack, isToday && styles.petalStackToday, missed && styles.petalStackMissed]}>
                    <PetalDot filled={d.morning} tone="sun" />
                    <PetalDot filled={d.exercise} tone="leaf" />
                    <PetalDot filled={d.evening} tone="moon" />
                  </View>
                  <Text style={[styles.weekFoot, missed && styles.weekFootMissed]}>
                    {d.journeyDay == null ? '—' : missed ? 'not done' : d.kind === 'lived' ? 'lived' : `${Number(d.morning) + Number(d.exercise) + Number(d.evening)}/3`}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Path stats */}
        <Card style={styles.card}>
          <EyebrowLabel label="THE PATH" />
          <View style={styles.statRow}>
            <Stat n={stats.lived} label="lived" />
            <Stat n={stats.notDone} label="not done" warn={stats.notDone > 0} />
            <Stat n={stats.remaining} label="ahead" />
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barLived, { flex: Math.max(stats.lived, 0.01) }]} />
            <View style={[styles.barMissed, { flex: Math.max(stats.notDone, 0.01) }]} />
            <View style={[styles.barRest, { flex: Math.max(stats.remaining + (todayParts < 3 ? 1 : 0), 0.01) }]} />
          </View>
          <Text style={styles.hint}>
            {stats.partsDone} of {stats.partsPossible} parts so far · {stats.loopRate}% of the loop you have met.
          </Text>
          {notDoneDays.length > 0 ? (
            <View style={styles.missedWrap}>
              {notDoneDays.map((d) => {
                const n = partsCompleteCount(statusByDay[d]);
                return (
                  <View key={d} style={styles.missedChip}>
                    <Text style={styles.missedChipText}>
                      Day {d} · {n === 0 ? 'not done' : `${n}/3 · not done`}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.hint}>No missed days on the path behind you.</Text>
          )}
        </Card>

        {/* Inner weather */}
        <Card style={styles.card}>
          <EyebrowLabel label="INNER WEATHER" />
          {weather.count === 0 ? (
            <Text style={styles.emptyText}>
              Check-ins (mood, energy, stress, sleep) will plot here. Start from the Check-In tab.
            </Text>
          ) : (
            <>
              <View style={styles.weatherGrid}>
                <WeatherStat
                  label="Mood"
                  value={weather.avgMood != null ? `${moodFace(weather.avgMood)} ${weather.avgMood.toFixed(1)}` : '—'}
                  series={weather.days.map((d) => d.mood)}
                  max={5}
                  color={colors.gold}
                />
                <WeatherStat
                  label="Energy"
                  value={weather.avgEnergy != null ? `${Math.round(weather.avgEnergy)}` : '—'}
                  series={weather.days.map((d) => d.energy)}
                  max={100}
                  color={colors.gold}
                />
                <WeatherStat
                  label="Stress"
                  value={weather.avgStress != null ? `${Math.round(weather.avgStress)}` : '—'}
                  series={weather.days.map((d) => d.stress)}
                  max={100}
                  color={colors.peach}
                />
                <WeatherStat
                  label="Sleep"
                  value={weather.avgSleepHours != null ? `${weather.avgSleepHours.toFixed(1)}h` : '—'}
                  series={weather.days.map((d) => (d.sleep != null ? d.sleep + 3 : undefined))}
                  max={8}
                  color="#8D7FAE"
                />
              </View>
              <Text style={styles.hint}>
                {weather.count} check-in{weather.count === 1 ? '' : 's'} · averages across everything you have logged.
              </Text>
            </>
          )}
        </Card>

        {/* Named feelings */}
        <Card style={styles.card}>
          <EyebrowLabel label="FEELINGS YOU'VE NAMED" />
          {feelings.length === 0 ? (
            <Text style={styles.emptyText}>
              One-word check-ins and on-the-spot notes collect here. Naming is how patterns get visible.
            </Text>
          ) : (
            <View style={styles.feelWrap}>
              {feelings.slice(0, 12).map((f) => (
                <View key={f.word} style={styles.feelChip}>
                  <Text style={styles.feelWord}>{f.word}</Text>
                  {f.count > 1 ? <Text style={styles.feelCount}>×{f.count}</Text> : null}
                </View>
              ))}
            </View>
          )}
          {onTheSpot.length > 0 ? (
            <Text style={styles.hint}>
              {onTheSpot.length} on-the-spot note{onTheSpot.length === 1 ? '' : 's'} · avg intensity{' '}
              {(onTheSpot.reduce((a, s) => a + s.intensity, 0) / onTheSpot.length).toFixed(1)}/5.
            </Text>
          ) : null}
        </Card>

        {/* Awareness */}
        <Card style={styles.card}>
          <EyebrowLabel label="AWARENESS DIMENSIONS" />
          {overall ? (
            <Text style={styles.cardHead}>Overall {overall.score} · grown from showing up, not from a grade.</Text>
          ) : null}
          {dims.map((dim) => (
            <View key={dim.dimension} style={styles.dimRow}>
              <Text style={styles.dimName}>{dimensionLabel(dim.dimension)}</Text>
              <View style={styles.dimBarBg}>
                <View style={[styles.dimBarFill, { width: `${Math.min(100, dim.score)}%` }]} />
              </View>
              <Text style={styles.dimScore}>{dim.score}</Text>
            </View>
          ))}
        </Card>

        {/* Computed observations */}
        <EyebrowLabel label="WHAT THIS IS SHOWING YOU" />
        {insightCards.map((ins) => (
          <Card key={ins.id} style={styles.insightRow}>
            <View style={[styles.insightIcon, { backgroundColor: ins.tint }]}>
              <Ionicons name={ins.icon} size={17} color={ins.iconColor} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.insightTitleRow}>
                <Text style={styles.insightTitle}>{ins.title}</Text>
                <Text style={[styles.insightTag, { color: ins.tagColor }]}>{ins.tag}</Text>
              </View>
              <Text style={styles.insightBody}>{ins.body}</Text>
            </View>
          </Card>
        ))}

        {/* First inward check-in */}
        {spot ? (
          <Card style={styles.card}>
            <EyebrowLabel label="YOU NOTICED" />
            <Text style={styles.cardHead}>From your first inward check-in — a snapshot, not a verdict.</Text>
            <SpotLine label="Right now" value={spot.presentMoment} />
            <SpotLine label="Under difficulty" value={spot.difficultyFirst} />
            <SpotLine label="Self-trust" value={`${spot.selfTrust} / 5`} />
            <SpotLine label="A need" value={spot.emotionNeed} />
            <SpotLine label="Stress pattern" value={spot.stressPattern} />
            <SpotLine label="Values" value={`${spot.valueSuccessVsPeace} · ${spot.valueRecognitionVsPride} · ${spot.valueSecurityVsExploration}`} />
            <SpotLine label="Tiny experiment" value={spot.tinyExperiment} />
          </Card>
        ) : null}

        {/* Streak */}
        <Card style={styles.card}>
          <EyebrowLabel label="SHOWING UP" />
          <View style={styles.statRow}>
            <Stat n={streak?.currentStreak || 0} label="current streak" />
            <Stat n={streak?.longestStreak || 0} label="longest" />
            <Stat n={reflections.length} label="reflections" />
          </View>
        </Card>

        {/* Reflections */}
        <Card style={styles.card}>
          <EyebrowLabel label="YOUR REFLECTIONS" />
          {reflections.length === 0 ? (
            <Text style={styles.emptyText}>Finish a morning, practice, or evening to leave a trace.</Text>
          ) : (
            lastReflections.map((r) => {
              const pretty = prettyReflection(r.prompt, r.response);
              return (
                <View key={r.id} style={styles.reflectionItem}>
                  <Text style={styles.reflectionPrompt}>{pretty.title}</Text>
                  <Text style={styles.reflectionResponse}>{pretty.body}</Text>
                  <Text style={styles.reflectionDate}>
                    {r.journalId} · day {r.dayNumber} · {new Date(r.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              );
            })
          )}
          {reflections.length > 6 ? (
            <TouchableOpacity onPress={() => setShowMoreReflections((s) => !s)} style={styles.moreBtn}>
              <Text style={styles.moreText}>{showMoreReflections ? 'Show less' : 'More reflections'}</Text>
            </TouchableOpacity>
          ) : null}
        </Card>

        {/* Check-ins */}
        <Card style={styles.card}>
          <EyebrowLabel label="RECENT CHECK-INS" />
          {checkins.length === 0 ? (
            <Text style={styles.emptyText}>No check-ins yet. Start your first one from the Check-In tab.</Text>
          ) : (
            lastCheckins.map((c: Checkin) => (
              <View key={c.id} style={styles.checkinRow}>
                <Text style={styles.checkinDate}>
                  {new Date(c.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
                <View style={styles.checkinMood}>
                  <Text style={styles.moodEmoji}>{moodFace(c.mood)}</Text>
                </View>
                <Text style={styles.checkinWord}>{c.oneWord || '—'}</Text>
                <Text style={styles.checkinMeta}>
                  E{c.energy} · S{c.stress} · {c.sleep + 3}h
                </Text>
              </View>
            ))
          )}
          {checkins.length > 5 ? (
            <TouchableOpacity onPress={() => setShowMoreCheckins((s) => !s)} style={styles.moreBtn}>
              <Text style={styles.moreText}>{showMoreCheckins ? 'Show less' : 'More check-ins'}</Text>
            </TouchableOpacity>
          ) : null}
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function PetalDot({ filled, tone }: { filled: boolean; tone: 'sun' | 'leaf' | 'moon' }) {
  const color = tone === 'sun' ? colors.gold : tone === 'leaf' ? colors.leaf : '#8D7FAE';
  return <View style={[styles.petal, { backgroundColor: filled ? color : '#EFE9DC' }]} />;
}

function Stat({ n, label, warn }: { n: number; label: string; warn?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statN, warn && { color: '#C46A52' }]}>{n}</Text>
      <Text style={styles.statL}>{label}</Text>
    </View>
  );
}

function WeatherStat({
  label,
  value,
  series,
  max,
  color,
}: {
  label: string;
  value: string;
  series: Array<number | undefined>;
  max: number;
  color: string;
}) {
  return (
    <View style={styles.weatherCell}>
      <Text style={styles.weatherLabel}>{label}</Text>
      <Text style={styles.weatherValue}>{value}</Text>
      <View style={styles.spark}>
        {series.map((v, i) => {
          const h = v == null ? 3 : Math.max(4, Math.round((v / max) * 22));
          return (
            <View
              key={i}
              style={[styles.sparkBar, { height: h, backgroundColor: v == null ? '#EFE9DC' : color }]}
            />
          );
        })}
      </View>
    </View>
  );
}

function SpotLine({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null;
  return (
    <View style={styles.spotLine}>
      <Text style={styles.spotLabel}>{label}</Text>
      <Text style={styles.spotValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
    marginRight: 24,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  lead: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 28,
    marginBottom: spacing.lg,
  },
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHead: {
    fontFamily: 'Nunito',
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.md,
    lineHeight: 19,
  },
  hint: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.inkSoft,
    lineHeight: 17,
    marginTop: spacing.md,
  },
  loopRow: {
    flexDirection: 'row',
    gap: 8,
  },
  loopChip: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
  },
  loopChipDone: {
    backgroundColor: colors.leafSoft,
  },
  loopChipOpen: {
    backgroundColor: '#F4EFE6',
  },
  loopChipText: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '800',
    color: colors.ink,
  },
  loopChipTextDone: {
    color: colors.ink,
  },
  loopChipState: {
    fontFamily: 'Nunito',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'lowercase',
  },
  loopDone: { color: colors.leaf },
  loopNot: { color: '#C46A52' },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  weekCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  weekLabel: {
    fontFamily: 'Nunito',
    fontSize: 10,
    fontWeight: '800',
    color: colors.inkSoft,
  },
  weekLabelToday: {
    color: colors.ink,
  },
  petalStack: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FBF8F2',
  },
  petalStackToday: {
    backgroundColor: '#FBF1DE',
  },
  petalStackMissed: {
    backgroundColor: '#FBEFEC',
  },
  petal: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  weekFoot: {
    fontFamily: 'Nunito',
    fontSize: 8.5,
    fontWeight: '700',
    color: colors.ghost,
    textAlign: 'center',
  },
  weekFootMissed: {
    color: '#C46A52',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statN: {
    fontFamily: 'Fraunces',
    fontSize: 28,
    fontWeight: '700',
    color: colors.ink,
  },
  statL: {
    fontFamily: 'Nunito',
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  barTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#EDE8DD',
    gap: 2,
  },
  barLived: { backgroundColor: colors.leaf, borderRadius: 4 },
  barMissed: { backgroundColor: colors.peach, borderRadius: 4 },
  barRest: { backgroundColor: '#EDE8DD', borderRadius: 4 },
  missedWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.md,
  },
  missedChip: {
    backgroundColor: '#FBEFEC',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  missedChipText: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '700',
    color: '#8A3B24',
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  weatherCell: {
    width: '47%',
    backgroundColor: '#FBF8F2',
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  weatherLabel: {
    fontFamily: 'Nunito',
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  weatherValue: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
    marginTop: 2,
  },
  spark: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 24,
    marginTop: 8,
  },
  sparkBar: {
    flex: 1,
    borderRadius: 2,
  },
  feelWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3EEF9',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  feelWord: {
    fontFamily: 'Nunito',
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.ink,
  },
  feelCount: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '800',
    color: '#8D7FAE',
  },
  dimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: spacing.sm,
  },
  dimName: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '600',
    color: colors.ink,
    width: 118,
  },
  dimBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EDE8DD',
  },
  dimBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sage,
  },
  dimScore: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkSoft,
    width: 24,
    textAlign: 'right',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  insightIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  insightTitle: {
    flex: 1,
    fontFamily: 'Nunito',
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.ink,
  },
  insightTag: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '800',
  },
  insightBody: {
    fontFamily: 'Nunito',
    fontSize: 12.5,
    color: colors.inkSoft,
    marginTop: 3,
    lineHeight: 18,
  },
  spotLine: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8DD',
  },
  spotLabel: {
    fontFamily: 'Nunito',
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  spotValue: {
    fontFamily: 'Nunito',
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 2,
    lineHeight: 19,
  },
  emptyText: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 19,
  },
  checkinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8DD',
  },
  checkinDate: {
    fontFamily: 'Nunito',
    fontSize: 11.5,
    color: colors.inkSoft,
    width: 84,
  },
  checkinMood: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F0E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: { fontSize: 15 },
  checkinWord: {
    flex: 1,
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.ink,
    fontWeight: '600',
  },
  checkinMeta: {
    fontFamily: 'Nunito',
    fontSize: 10.5,
    color: colors.ghost,
  },
  reflectionItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8DD',
  },
  reflectionPrompt: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  reflectionResponse: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.inkSoft,
    lineHeight: 17,
  },
  reflectionDate: {
    fontFamily: 'Nunito',
    fontSize: 10,
    color: colors.ghost,
    marginTop: 4,
  },
  moreBtn: {
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  moreText: {
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
  },
});
