import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { useCheckins } from '../../hooks/useCheckins';
import { useReflections, useOnTheSpot } from '../../hooks/useJournal';
import { useAwarenessSnapshot } from '../../hooks/useAwareness';
import { useDailyCatalog } from '../../hooks/useDailyJourney';
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

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

export default function InsightsScreen() {
  const isFocused = useIsFocused();
  const { data: checkins, refresh: refreshCheckins } = useCheckins();
  const { data: reflections, refresh: refreshReflections } = useReflections();
  const { data: onTheSpot, refresh: refreshOnTheSpot } = useOnTheSpot();
  const { data: awareness, refresh: refreshAwareness } = useAwarenessSnapshot();
  const { completedDays, statusByDay, unlockedDay, total, refresh: refreshPath } = useDailyCatalog();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (isFocused) {
      refreshCheckins();
      refreshReflections();
      refreshOnTheSpot();
      refreshAwareness();
      refreshPath();
    }
  }, [isFocused, refreshAwareness, refreshCheckins, refreshOnTheSpot, refreshPath, refreshReflections]);

  // Last 7 calendar days (oldest first, today last), with an activity score
  // per day from real data: check-ins + reflections saved that day.
  const week = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const iso = d.toISOString().slice(0, 10);
      const score =
        checkins.filter((c) => c.createdAt.slice(0, 10) === iso).length +
        reflections.filter((r) => r.createdAt.slice(0, 10) === iso).length;
      return {
        label: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
        iso,
        score,
      };
    });
  }, [checkins, reflections]);

  const bestIdx = week.reduce((best, d, i) => (d.score > (week[best]?.score || 0) ? i : best), 0);
  const activeDays = week.filter((d) => d.score > 0).length;
  const maxScore = Math.max(1, ...week.map((d) => d.score));

  // --- Real, small insights from the data (never invented) ---
  const namedFeelings = checkins.filter((c) => c.oneWord).length + onTheSpot.length;
  const morning = checkins.filter((c) => new Date(c.createdAt).getHours() < 12);
  const afternoon = checkins.filter((c) => new Date(c.createdAt).getHours() >= 12);
  const lowSleep = checkins.filter((c) => c.sleep <= 2);
  const highSleep = checkins.filter((c) => c.sleep >= 4);

  const emotionalBody =
    namedFeelings > 0
      ? "You've been getting better at naming your feelings."
      : 'Name one feeling in your next check-in — that is where this starts.';

  const energyBody = useMemo(() => {
    if (morning.length >= 1 && afternoon.length >= 1) {
      const diff = avg(morning.map((c) => c.energy)) - avg(afternoon.map((c) => c.energy));
      if (diff >= 5) return 'Your energy tends to dip in the afternoons.';
      if (diff <= -5) return 'Your energy picks up in the afternoons.';
      return 'Your energy looks steady across the day.';
    }
    return 'Check in on a couple of days to reveal your energy curve.';
  }, [checkins]);

  const sleepStressBody = useMemo(() => {
    if (lowSleep.length >= 1 && highSleep.length >= 1) {
      const diff = avg(lowSleep.map((c) => c.stress)) - avg(highSleep.map((c) => c.stress));
      if (diff >= 5) return 'On days you sleep less, stress tends to be higher.';
      return 'Sleep and stress look unrelated for now — keep watching.';
    }
    return 'Track sleep and stress for a few days to find the link.';
  }, [checkins]);

  const progressLine =
    activeDays >= 3
      ? "You've been more consistent this week. Keep going!"
      : activeDays >= 1
        ? `You showed up ${activeDays} ${activeDays === 1 ? 'day' : 'days'} this week. Keep going!`
        : 'A quiet week so far — check in whenever you are ready.';

  const insights: Array<{ icon: 'heart' | 'leaf' | 'accessibility'; tint: string; iconColor: string; title: string; body: string; tag: string; tagColor: string }> = [
    {
      icon: 'heart',
      tint: '#F3EEF9',
      iconColor: '#8D7FAE',
      title: 'Emotional clarity',
      body: emotionalBody,
      tag: namedFeelings > 0 ? 'Improving' : 'Start here',
      tagColor: '#8D7FAE',
    },
    {
      icon: 'leaf',
      tint: '#F1F7EF',
      iconColor: '#7C9A72',
      title: 'Energy pattern',
      body: energyBody,
      tag: 'Notice',
      tagColor: colors.leaf,
    },
    {
      icon: 'accessibility',
      tint: '#FBEFEC',
      iconColor: '#D4795F',
      title: 'Sleep & Stress',
      body: sleepStressBody,
      tag: 'Explore',
      tagColor: '#C99A2C',
    },
  ];

  const last7 = checkins.slice(0, 7);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        <Ionicons name="sparkles" size={18} color="#C99A2C" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>Here's what your recent days are showing you.</Text>

        {/* Progress */}
        <Card style={styles.card}>
          <EyebrowLabel label="AWESOME PROGRESS" />
          <View style={styles.progressRow}>
            <View style={styles.progressIcon}>
              <Ionicons name="trending-up" size={15} color="#C99A2C" />
            </View>
            <Text style={styles.progressText}>{progressLine}</Text>
          </View>
          <View style={styles.chart}>
            {week.map((d, i) => {
              const h = d.score === 0 ? 6 : Math.min(72, 24 + (d.score / maxScore) * 48);
              const isBest = d.score > 0 && i === bestIdx;
              return (
                <View key={d.iso} style={styles.chartCol}>
                  {isBest ? <Text style={styles.chartStar}>⭐</Text> : <View style={{ height: 14 }} />}
                  <View
                    style={[
                      styles.chartBar,
                      { height: h },
                      d.score === 0 && styles.chartBarEmpty,
                      isBest && { backgroundColor: colors.gold },
                    ]}
                  />
                  <Text style={styles.chartLabel}>{d.label}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Insights */}
        {insights.map((ins) => (
          <Card key={ins.title} style={styles.insightRow}>
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

        {/* View all */}
        <TouchableOpacity onPress={() => setShowAll((s) => !s)} activeOpacity={0.85}>
          <Card style={styles.viewAll}>
            <Text style={styles.viewAllText}>View all insights</Text>
            <Ionicons name={showAll ? 'chevron-up' : 'chevron-forward'} size={16} color={colors.inkSoft} />
          </Card>
        </TouchableOpacity>

        {showAll && (
          <>
            {/* Recent check-ins */}
            <Card style={styles.card}>
              <EyebrowLabel label="RECENT CHECK-INS" />
              {last7.length === 0 ? (
                <Text style={styles.emptyText}>No check-ins yet. Start your first one from the Check-In tab.</Text>
              ) : (
                last7.map((c: Checkin, i: number) => (
                  <View key={c.id} style={styles.checkinRow}>
                    <Text style={styles.checkinDate}>
                      {new Date(c.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                    <View style={styles.checkinMood}>
                      <Text style={styles.moodEmoji}>{['😔', '😟', '😐', '🙂', '😊'][c.mood - 1]}</Text>
                    </View>
                    <Text style={styles.checkinWord}>{c.oneWord || '—'}</Text>
                    <Text style={styles.checkinMeta}>
                      E{c.energy} · S{c.stress} · {c.sleep + 3}h
                    </Text>
                  </View>
                ))
              )}
            </Card>

            {/* Awareness dimensions */}
            {awareness.length > 0 && (
              <Card style={styles.card}>
                <EyebrowLabel label="AWARENESS DIMENSIONS" />
                {awareness.map((dim) => (
                  <View key={dim.dimension} style={styles.dimRow}>
                    <Text style={styles.dimName}>{dim.dimension.replace(/_/g, ' ')}</Text>
                    <View style={styles.dimBarBg}>
                      <View style={[styles.dimBarFill, { width: `${dim.score}%` }]} />
                    </View>
                    <Text style={styles.dimScore}>{dim.score}</Text>
                  </View>
                ))}
              </Card>
            )}

            {/* Loop + reflections */}
            <Card style={styles.card}>
              <EyebrowLabel label="THE LOOP" />
              <Text style={styles.emptyText}>
                Day {unlockedDay} of {total}. Morning, practice, and evening count only when you finish them — never as a grade.
              </Text>
              <View style={styles.loopRow}>
                {(['morning', 'exercise', 'evening'] as const).map((part) => (
                  <View key={part} style={styles.loopChip}>
                    <Text style={styles.loopChipText}>
                      {part} · {statusByDay[unlockedDay]?.[part] ? 'done' : 'open'}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={{ height: spacing.md }} />
              <EyebrowLabel label="YOUR REFLECTIONS" />
              {reflections.length === 0 ? (
                <Text style={styles.emptyText}>No reflections yet. Finish a morning, practice, or evening to leave a trace.</Text>
              ) : (
                reflections.slice(0, 12).map((r) => {
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
            </Card>
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  progressIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FBF1DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    flex: 1,
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 19,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  chartStar: {
    fontSize: 12,
  },
  chartBar: {
    width: '72%',
    borderRadius: 5,
    backgroundColor: colors.leaf,
  },
  chartBarEmpty: {
    backgroundColor: '#EFE9DC',
  },
  chartLabel: {
    fontFamily: 'Nunito',
    fontSize: 10,
    fontWeight: '700',
    color: colors.inkSoft,
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
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  viewAllText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
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
    width: 110,
    textTransform: 'capitalize',
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
  loopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.md,
  },
  loopChip: {
    backgroundColor: '#F4EFE6',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  loopChipText: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
    textTransform: 'capitalize',
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
});
