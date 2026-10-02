import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { colors, spacing, radius } from '../../design-system/tokens';
import { useAwarenessSnapshot, useStreak } from '../../hooks/useAwareness';
import { useCheckins } from '../../hooks/useCheckins';
import { useDailyCatalog } from '../../hooks/useDailyJourney';
import { useReflections, useOnTheSpot } from '../../hooks/useJournal';
import { useLatestSpotCheckin } from '../../hooks/useSpotCheckins';
import {
  computeInsightCards,
  dimensionLabel,
  evidenceCards,
  innerWeather,
  moodFace,
  namedFeelings,
  pathStats,
  resolveAwareness,
  weekLoop,
} from '../../insights/compute';
import {
  awarenessLine,
  bestAndHardest,
  buildHeadline,
  formatDelta,
  lensChips,
  weekCompare,
} from '../../insights/story';
import type { Checkin } from '../../native/InwardEngine';
import { useOnboardingProfile } from '../../onboarding/useOnboardingProfile';

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
  const { draft, refresh: refreshOnboarding } = useOnboardingProfile();
  const {
    completedDays,
    statusByDay,
    exerciseDay,
    reflectionDay,
    reflections: journeyReflections,
    total,
    refresh: refreshPath,
  } = useDailyCatalog();
  const [showMoreReflections, setShowMoreReflections] = useState(false);
  const [showMoreCheckins, setShowMoreCheckins] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    if (isFocused) {
      refreshCheckins();
      refreshReflections();
      refreshOnTheSpot();
      refreshAwareness();
      refreshPath();
      refreshStreak();
      refreshSpot();
      refreshOnboarding();
    }
  }, [
    isFocused,
    refreshAwareness,
    refreshCheckins,
    refreshOnTheSpot,
    refreshOnboarding,
    refreshPath,
    refreshReflections,
    refreshSpot,
    refreshStreak,
  ]);

  const reflectionStatus = statusByDay[reflectionDay];
  const exerciseStatus = statusByDay[exerciseDay];
  const reflectionPartsDone = Number(Boolean(reflectionStatus?.morning)) + Number(Boolean(reflectionStatus?.evening));
  const stats = useMemo(() => pathStats(total, completedDays, statusByDay), [total, completedDays, statusByDay]);
  const week = useMemo(
    () =>
      weekLoop({
        reflections: journeyReflections,
        checkins,
        onTheSpot,
      }),
    [journeyReflections, checkins, onTheSpot],
  );
  const weather = useMemo(() => innerWeather(checkins), [checkins]);
  const compare = useMemo(() => weekCompare(checkins), [checkins]);
  const feelings = useMemo(() => namedFeelings(checkins, onTheSpot), [checkins, onTheSpot]);
  const poles = useMemo(() => bestAndHardest(weather.days), [weather.days]);
  const chips = useMemo(() => lensChips(draft), [draft]);
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
        exerciseDay,
        reflectionDay,
        streak,
        spot,
        draft,
      }),
    [checkins, onTheSpot, reflections, statusByDay, exerciseDay, reflectionDay, streak, spot, draft],
  );
  const headline = useMemo(
    () =>
      buildHeadline({
        checkinCount: checkins.length,
        lived: stats.lived,
        compare,
        days: weather.days,
        named: feelings,
        draft,
        onTheSpot,
      }),
    [checkins.length, stats.lived, compare, weather.days, feelings, draft, onTheSpot],
  );

  const overall = awareness.find((d) => d.dimension === 'overall');
  const dims = awareness.filter((d) => d.dimension !== 'overall');
  const lastCheckins = showMoreCheckins ? checkins.slice(0, 14) : checkins.slice(0, 5);
  const lastReflections = showMoreReflections ? reflections.slice(0, 16) : reflections.slice(0, 6);
  const story = evidenceCards(insightCards)
    .filter((c) => c.id !== 'loop-today')
    .slice(0, 5);
  const fallbackNudge = insightCards.find((c) => c.kind === 'nudge' && c.id !== 'loop-today');
  const thisWeek = compare.thisWeek;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        <Ionicons name="sparkles" size={18} color="#C99A2C" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>{headline.title}</Text>
        <Text style={styles.leadBody}>{headline.body}</Text>

        {chips.length > 0 ? (
          <View style={styles.lensWrap}>
            <Text style={styles.lensKicker}>Looking through</Text>
            <View style={styles.feelWrap}>
              {chips.map((c) => (
                <View key={c.id} style={[styles.lensChip, c.kind === 'challenge' && styles.lensChipChallenge]}>
                  <Text style={styles.lensChipText}>{c.label}</Text>
                </View>
              ))}
            </View>
            {draft?.firstIntention?.trim() ? (
              <Text style={styles.intention}>“{draft.firstIntention.trim()}”</Text>
            ) : null}
          </View>
        ) : null}

        {/* This week vs last week */}
        <Card style={styles.card}>
          <EyebrowLabel label="THIS WEEK" />
          <Text style={styles.cardHead}>
            {thisWeek.count === 0
              ? 'No check-ins in the last 7 days yet.'
              : `${thisWeek.count} check-in${thisWeek.count === 1 ? '' : 's'} · compared with the week before.`}
          </Text>
          <View style={styles.weatherGrid}>
            <MetricTile
              label="Mood"
              value={thisWeek.avgMood != null ? `${moodFace(thisWeek.avgMood)} ${thisWeek.avgMood.toFixed(1)}/5` : '—'}
              delta={formatDelta(compare.dMood)}
              invert={false}
              series={weather.days.map((d) => d.mood)}
              max={5}
              color={colors.gold}
            />
            <MetricTile
              label="Energy"
              value={thisWeek.avgEnergy != null ? `${Math.round(thisWeek.avgEnergy)}/100` : '—'}
              delta={compare.dEnergy != null ? `${formatDelta(compare.dEnergy, 0)} pts` : null}
              invert={false}
              series={weather.days.map((d) => d.energy)}
              max={100}
              color={colors.gold}
            />
            <MetricTile
              label="Stress"
              value={thisWeek.avgStress != null ? `${Math.round(thisWeek.avgStress)}/100` : '—'}
              delta={compare.dStress != null ? `${formatDelta(compare.dStress, 0)} pts` : null}
              invert
              series={weather.days.map((d) => d.stress)}
              max={100}
              color={colors.peach}
            />
            <MetricTile
              label="Sleep"
              value={thisWeek.avgSleepHours != null ? `${thisWeek.avgSleepHours.toFixed(1)}h` : '—'}
              delta={compare.dSleep != null ? `${formatDelta(compare.dSleep)}h` : null}
              invert={false}
              series={weather.days.map((d) => (d.sleep != null ? d.sleep + 3 : undefined))}
              max={8}
              color="#8D7FAE"
            />
            <MetricTile
              label="Confidence"
              value={thisWeek.avgConfidence != null ? `${Math.round(thisWeek.avgConfidence)}/100` : '—'}
              delta={compare.dConfidence != null ? `${formatDelta(compare.dConfidence, 0)} pts` : null}
              invert={false}
              series={weather.days.map((day) => day.confidence)}
              max={100}
              color={colors.sage}
            />
          </View>
          <MoodWeek days={weather.days} />
          {poles.best && poles.hardest ? (
            <Text style={styles.hint}>
              Lightest: {poles.best.label} · heaviest: {poles.hardest.label}. Contrast, not a verdict.
            </Text>
          ) : (
            <Text style={styles.hint}>
              Week-over-week moves only appear once both weeks have check-ins. Empty days stay empty.
            </Text>
          )}
        </Card>

        {/* Independent reflection and exercise progression */}
        <Card style={styles.card}>
          <EyebrowLabel label="YOUR TWO FLOWS" />
          <Text style={styles.cardHead}>
            Reflections · Day {reflectionDay} of {total} · {reflectionPartsDone}/2 complete
          </Text>
          <View style={styles.loopRow}>
            {(['morning', 'evening'] as const).map((part) => {
              const done = Boolean(reflectionStatus?.[part]);
              const meta = PART_MARK[part];
              return (
                <View key={part} style={[styles.loopChip, done ? styles.loopChipDone : styles.loopChipOpen]}>
                  <Ionicons name={meta.icon} size={14} color={done ? colors.leaf : colors.inkSoft} />
                  <Text style={[styles.loopChipText, done && styles.loopChipTextDone]}>{meta.label}</Text>
                  <Text style={[styles.loopChipState, done ? styles.loopDone : styles.loopOpen]}>
                    {done ? 'complete' : 'open'}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text style={[styles.cardHead, styles.secondFlowTitle]}>
            Practice · Day {exerciseDay} of {total} · {exerciseStatus?.exercise ? 'complete' : 'open'}
          </Text>
          <View style={styles.loopRow}>
            <View style={[styles.loopChip, exerciseStatus?.exercise ? styles.loopChipDone : styles.loopChipOpen]}>
              <Ionicons
                name={PART_MARK.exercise.icon}
                size={14}
                color={exerciseStatus?.exercise ? colors.leaf : colors.inkSoft}
              />
              <Text style={[styles.loopChipText, exerciseStatus?.exercise && styles.loopChipTextDone]}>Exercise</Text>
              <Text style={[styles.loopChipState, exerciseStatus?.exercise ? styles.loopDone : styles.loopOpen]}>
                {exerciseStatus?.exercise ? 'complete' : 'open'}
              </Text>
            </View>
          </View>
          <Text style={styles.hint}>
            Each flow advances only after its current day is complete. An unfinished step stays here for next time.
          </Text>
        </Card>

        {/* This week — activity by calendar date, independent of sequence day */}
        <Card style={styles.card}>
          <EyebrowLabel label="SEVEN DAYS" />
          <Text style={styles.cardHead}>Sun, leaf, moon — the three marks of a day.</Text>
          <View style={styles.week}>
            {week.map((d) => {
              const partsToday = Number(d.morning) + Number(d.exercise) + Number(d.evening);
              return (
                <View
                  key={d.iso}
                  style={styles.weekCol}
                  accessible
                  accessibilityLabel={`${d.weekday}: morning ${d.morning ? 'complete' : 'open'}, practice ${d.exercise ? 'complete' : 'open'}, evening ${d.evening ? 'complete' : 'open'}. ${d.checkins} check-in${d.checkins === 1 ? '' : 's'}.`}
                >
                  <Text style={[styles.weekLabel, d.isToday && styles.weekLabelToday]} accessible={false}>
                    {d.weekday.slice(0, 3)}
                  </Text>
                  <View style={[styles.petalStack, d.isToday && styles.petalStackToday]}>
                    <PetalDot filled={d.morning} tone="sun" />
                    <PetalDot filled={d.exercise} tone="leaf" />
                    <PetalDot filled={d.evening} tone="moon" />
                  </View>
                  <Text style={styles.weekFoot}>
                    {d.kind === 'lived' ? '3/3' : partsToday ? `${partsToday}/3` : '—'}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Evidence-backed observations */}
        <EyebrowLabel label="WHAT THIS IS SHOWING YOU" />
        {story.length === 0 ? (
          <Card style={styles.insightRow}>
            <View style={[styles.insightIcon, { backgroundColor: '#FBF1DE' }]}>
              <Ionicons name="eye" size={17} color="#C99A2C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.insightTitle}>Waiting on a pattern</Text>
              <Text style={styles.insightBody}>
                {fallbackNudge?.body ||
                  'A few check-ins across different days is enough. This page will not invent a story.'}
              </Text>
            </View>
          </Card>
        ) : (
          story.map((ins) => (
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
          ))
        )}

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

        {/* Path stats */}
        <Card style={styles.card}>
          <EyebrowLabel label="THE PATH" />
          <View style={styles.statRow}>
            <Stat n={stats.reflectionDaysDone} label="reflection days" />
            <Stat n={stats.exerciseDaysDone} label="exercise days" />
            <Stat n={stats.lived} label="full loops" />
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barLived, { flex: Math.max(stats.partsDone, 0.01) }]} />
            <View style={[styles.barRest, { flex: Math.max(stats.partsPossible - stats.partsDone, 0.01) }]} />
          </View>
          <Text style={styles.hint}>
            {stats.partsDone} of {stats.partsPossible} activities saved · {stats.loopRate}% of the authored path
            completed. Incomplete flows stay open; they are not missed.
          </Text>
        </Card>

        {/* Awareness */}
        <Card style={styles.card}>
          <EyebrowLabel label="AWARENESS DIMENSIONS" />
          {overall ? (
            <Text style={styles.cardHead}>
              Overall {overall.score} · {awarenessLine(overall.score)}
            </Text>
          ) : (
            <Text style={styles.cardHead}>{awarenessLine(undefined)}</Text>
          )}
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

        {spot ? (
          <Card style={styles.card}>
            <EyebrowLabel label="YOU NOTICED" />
            <Text style={styles.cardHead}>From your first inward check-in — a snapshot, not a verdict.</Text>
            <SpotLine label="Right now" value={spot.presentMoment} />
            <SpotLine label="Under difficulty" value={spot.difficultyFirst} />
            <SpotLine label="Self-trust" value={`${spot.selfTrust} / 5`} />
            <SpotLine label="A need" value={spot.emotionNeed} />
            <SpotLine label="Stress pattern" value={spot.stressPattern} />
            <SpotLine
              label="Values"
              value={`${spot.valueSuccessVsPeace} · ${spot.valueRecognitionVsPride} · ${spot.valueSecurityVsExploration}`}
            />
            <SpotLine label="Tiny experiment" value={spot.tinyExperiment} />
          </Card>
        ) : null}

        <Card style={styles.card}>
          <EyebrowLabel label="SHOWING UP" />
          <View style={styles.statRow}>
            <Stat n={streak?.currentStreak || 0} label="current streak" />
            <Stat n={streak?.longestStreak || 0} label="longest" />
            <Stat n={reflections.length} label="reflections" />
          </View>
        </Card>

        <TouchableOpacity
          onPress={() => setShowLogs((visible) => !visible)}
          style={styles.logToggle}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={showLogs ? 'Hide the log behind this' : 'See the log behind this'}
          accessibilityState={{ expanded: showLogs }}
        >
          <Text style={styles.moreText}>{showLogs ? 'Hide the log' : 'See the log behind this'}</Text>
          <Ionicons name={showLogs ? 'chevron-up' : 'chevron-down'} size={16} color={colors.ink} />
        </TouchableOpacity>

        {showLogs ? (
          <>
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
                <TouchableOpacity
                  onPress={() => setShowMoreReflections((visible) => !visible)}
                  style={styles.moreBtn}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: showMoreReflections }}
                >
                  <Text style={styles.moreText}>{showMoreReflections ? 'Show less' : 'More reflections'}</Text>
                </TouchableOpacity>
              ) : null}
            </Card>

            <Card style={styles.card}>
              <EyebrowLabel label="RECENT CHECK-INS" />
              {checkins.length === 0 ? (
                <Text style={styles.emptyText}>No check-ins yet. Start your first one from the Check-In tab.</Text>
              ) : (
                lastCheckins.map((c: Checkin) => (
                  <View
                    key={c.id}
                    style={styles.checkinRow}
                    accessible
                    accessibilityLabel={`Check-in on ${new Date(c.createdAt).toLocaleDateString()}. Mood ${c.mood} of 5. ${c.oneWord || 'No word added'}. Energy ${c.energy} of 100, stress ${c.stress} of 100, confidence ${c.confidence} of 100, sleep ${c.sleep + 3} hours.`}
                  >
                    <Text style={styles.checkinDate} accessible={false}>
                      {new Date(c.createdAt).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
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
                <TouchableOpacity
                  onPress={() => setShowMoreCheckins((visible) => !visible)}
                  style={styles.moreBtn}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: showMoreCheckins }}
                >
                  <Text style={styles.moreText}>{showMoreCheckins ? 'Show less' : 'More check-ins'}</Text>
                </TouchableOpacity>
              ) : null}
            </Card>
          </>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function MoodWeek({ days }: { days: { iso: string; label: string; mood?: number }[] }) {
  const summary = days
    .map((day) => `${day.label}: ${day.mood == null ? 'no check-in' : `${day.mood.toFixed(1)} out of 5`}`)
    .join('. ');
  return (
    <View style={styles.moodWeek} accessible accessibilityLabel={`Mood over the last seven days. ${summary}`}>
      {days.map((d) => {
        const h = d.mood == null ? 4 : Math.max(6, Math.round((d.mood / 5) * 36));
        return (
          <View key={d.iso} style={styles.moodWeekCol}>
            <View style={styles.moodWeekTrack}>
              <View
                style={[styles.moodWeekFill, { height: h, backgroundColor: d.mood == null ? '#EFE9DC' : colors.gold }]}
              />
            </View>
            <Text style={styles.moodWeekFace}>{d.mood == null ? '·' : moodFace(d.mood)}</Text>
            <Text style={styles.weekLabel}>{d.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

function MetricTile({
  label,
  value,
  delta,
  invert,
  series,
  max,
  color,
}: {
  label: string;
  value: string;
  delta: string | null;
  invert: boolean;
  series: (number | undefined)[];
  max: number;
  color: string;
}) {
  const up = delta != null && delta.startsWith('+');
  const down = delta != null && delta.startsWith('−');
  const good = invert ? down : up;
  const bad = invert ? up : down;
  const deltaColor = good ? colors.leafInk : bad ? '#8A3B24' : colors.inkSoft;
  return (
    <View
      style={styles.weatherCell}
      accessible
      accessibilityLabel={`${label}: ${value === '—' ? 'no data yet' : value}. ${delta ? `Change of ${delta} compared with last week.` : 'No week-to-week comparison yet.'}`}
    >
      <Text style={styles.weatherLabel} accessible={false}>
        {label}
      </Text>
      <View style={styles.metricRow}>
        <Text style={styles.weatherValue}>{value}</Text>
        {delta && delta !== '0' ? <Text style={[styles.delta, { color: deltaColor }]}>{delta}</Text> : null}
      </View>
      <View style={styles.spark}>
        {series.map((v, i) => {
          const h = v == null ? 3 : Math.max(4, Math.round((v / max) * 22));
          return (
            <View key={i} style={[styles.sparkBar, { height: h, backgroundColor: v == null ? '#EFE9DC' : color }]} />
          );
        })}
      </View>
    </View>
  );
}

function PetalDot({ filled, tone }: { filled: boolean; tone: 'sun' | 'leaf' | 'moon' }) {
  const color = tone === 'sun' ? colors.gold : tone === 'leaf' ? colors.leaf : '#8D7FAE';
  return <View style={[styles.petal, { backgroundColor: filled ? color : '#EFE9DC' }]} />;
}

function Stat({ n, label, warn }: { n: number; label: string; warn?: boolean }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${n} ${label}`}>
      <Text style={[styles.statN, warn && { color: '#C46A52' }]} accessible={false}>
        {n}
      </Text>
      <Text style={styles.statL} accessible={false}>
        {label}
      </Text>
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
    fontFamily: 'Fraunces_600SemiBold',
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
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 24,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 32,
    marginBottom: 6,
  },
  leadBody: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  lensWrap: {
    marginBottom: spacing.lg,
  },
  lensKicker: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.inkSoft,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  lensChip: {
    backgroundColor: colors.leafSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lensChipChallenge: {
    backgroundColor: '#FBEFEC',
  },
  lensChipText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
  },
  intention: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHead: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.md,
    lineHeight: 19,
  },
  hint: {
    fontFamily: 'Nunito_400Regular',
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
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    fontWeight: '800',
    color: colors.ink,
  },
  loopChipTextDone: {
    color: colors.ink,
  },
  secondFlowTitle: {
    marginTop: spacing.lg,
  },
  loopChipState: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'lowercase',
  },
  loopDone: { color: colors.leaf },
  loopOpen: { color: colors.inkSoft },
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
    fontFamily: 'Nunito_800ExtraBold',
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
  petal: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  weekFoot: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 8.5,
    fontWeight: '700',
    color: colors.ghost,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statN: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 28,
    fontWeight: '700',
    color: colors.ink,
  },
  statL: {
    fontFamily: 'Nunito_700Bold',
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
  barRest: { backgroundColor: '#EDE8DD', borderRadius: 4 },
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
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  weatherValue: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
    marginTop: 2,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 6,
  },
  delta: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    fontWeight: '800',
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
  moodWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: 4,
  },
  moodWeekCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  moodWeekTrack: {
    height: 40,
    width: '70%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  moodWeekFill: {
    width: '100%',
    borderRadius: 4,
  },
  moodWeekFace: {
    fontSize: 11,
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
    fontFamily: 'Nunito_700Bold',
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.ink,
  },
  feelCount: {
    fontFamily: 'Nunito_800ExtraBold',
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
    fontFamily: 'Nunito_600SemiBold',
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
    fontFamily: 'Nunito_700Bold',
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
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.ink,
  },
  insightTag: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    fontWeight: '800',
  },
  insightBody: {
    fontFamily: 'Nunito_400Regular',
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
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  spotValue: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 2,
    lineHeight: 19,
  },
  emptyText: {
    fontFamily: 'Nunito_400Regular',
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
    fontFamily: 'Nunito_400Regular',
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
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: colors.ink,
    fontWeight: '600',
  },
  checkinMeta: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10.5,
    color: colors.ghost,
  },
  reflectionItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8DD',
  },
  reflectionPrompt: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  reflectionResponse: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.inkSoft,
    lineHeight: 17,
  },
  reflectionDate: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    color: colors.ghost,
    marginTop: 4,
  },
  moreBtn: {
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  moreText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
  },
  logToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
});
