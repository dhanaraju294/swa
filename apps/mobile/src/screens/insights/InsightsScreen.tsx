import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { useCheckins } from '../../hooks/useCheckins';
import { useReflections } from '../../hooks/useJournal';
import { useAwarenessSnapshot } from '../../hooks/useAwareness';
import { useDailyCatalog } from '../../hooks/useDailyJourney';
import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';

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

export default function InsightsScreen() {
  const isFocused = useIsFocused();
  const { data: checkins, refresh: refreshCheckins } = useCheckins();
  const { data: reflections, refresh: refreshReflections } = useReflections();
  const { data: awareness, refresh: refreshAwareness } = useAwarenessSnapshot();
  const { completedDays, statusByDay, unlockedDay, total, refresh: refreshPath } = useDailyCatalog();

  useEffect(() => {
    if (isFocused) {
      refreshCheckins();
      refreshReflections();
      refreshAwareness();
      refreshPath();
    }
  }, [isFocused, refreshAwareness, refreshCheckins, refreshPath, refreshReflections]);

  const last7 = checkins.slice(0, 7);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Insights</Text>
      <Text style={styles.subtitle}>Your patterns, seen gently.</Text>

      {/* Summary stats */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{checkins.length}</Text>
          <Text style={styles.statLabel}>Total Check-ins</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{completedDays.length}</Text>
          <Text style={styles.statLabel}>Path days</Text>
        </Card>
      </View>

      <Card style={styles.card}>
        <EyebrowLabel label="THE LOOP" />
        <Text style={styles.emptyText}>
          Day {unlockedDay} of {total}. Morning, practice, and evening are counted only when you finish them — never as a grade.
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
      </Card>

      {/* Recent check-ins */}
      <Card style={styles.card}>
        <EyebrowLabel label="RECENT CHECK-INS" />
        {last7.length === 0 ? (
          <Text style={styles.emptyText}>
            No check-ins yet. Start your first one from the home screen.
          </Text>
        ) : (
          last7.map((c, i) => (
            <View key={c.id} style={styles.checkinRow}>
              <Text style={styles.checkinDate}>
                {new Date(c.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </Text>
              <View style={styles.checkinMood}>
                <Text style={styles.moodEmoji}>
                  {['😔', '😟', '😐', '🙂', '😊'][c.mood - 1]}
                </Text>
              </View>
              <Text style={styles.checkinWord}>{c.oneWord ?? '-'}</Text>
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
              <Text style={styles.dimName}>
                {dim.dimension.replace(/_/g, ' ')}
              </Text>
              <View style={styles.dimBarBg}>
                <View style={[styles.dimBarFill, { width: `${dim.score}%` }]} />
              </View>
              <Text style={styles.dimScore}>{dim.score}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* Reflections */}
      <Card style={styles.card}>
        <EyebrowLabel label="YOUR REFLECTIONS" />
        {reflections.length === 0 ? (
          <Text style={styles.emptyText}>
            No reflections yet. Finish a morning, practice, or evening to leave a trace.
          </Text>
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

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.lg, paddingBottom: 100 },
  title: { fontFamily: 'Fraunces', fontSize: 28, fontWeight: '600', color: colors.ink, marginBottom: spacing.xs },
  subtitle: { fontFamily: 'Nunito', fontSize: 14, color: colors.inkSoft, marginBottom: spacing.xl },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1, padding: spacing.lg, alignItems: 'center' },
  statValue: { fontFamily: 'Fraunces', fontSize: 32, fontWeight: '700', color: colors.gold },
  statLabel: { fontFamily: 'Nunito', fontSize: 11, color: colors.inkSoft, marginTop: 4 },
  card: { padding: spacing.lg, marginBottom: spacing.lg },
  emptyText: { fontFamily: 'Nunito', fontSize: 13, color: colors.inkSoft, lineHeight: 19 },
  checkinRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#EDE8DD',
  },
  checkinDate: { fontFamily: 'Nunito', fontSize: 12, color: colors.inkSoft, width: 90 },
  checkinMood: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F5F0E5', alignItems: 'center', justifyContent: 'center' },
  moodEmoji: { fontSize: 16 },
  checkinWord: { fontFamily: 'Nunito', fontSize: 12, color: colors.ink, fontWeight: '600' },
  dimRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: spacing.sm },
  dimName: { fontFamily: 'Nunito', fontSize: 11, fontWeight: '600', color: colors.ink, width: 110, textTransform: 'capitalize' },
  dimBarBg: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#EDE8DD' },
  dimBarFill: { height: 6, borderRadius: 3, backgroundColor: colors.sage },
  dimScore: { fontFamily: 'Nunito', fontSize: 11, fontWeight: '700', color: colors.inkSoft, width: 24, textAlign: 'right' },
  reflectionItem: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: '#EDE8DD' },
  reflectionPrompt: { fontFamily: 'Nunito', fontSize: 12, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  reflectionResponse: { fontFamily: 'Nunito', fontSize: 12, color: colors.inkSoft, lineHeight: 17 },
  reflectionDate: { fontFamily: 'Nunito', fontSize: 10, color: colors.ghost, marginTop: 4 },
  loopRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.md },
  loopChip: { backgroundColor: '#F4EFE6', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  loopChipText: { fontFamily: 'Nunito', fontSize: 11, fontWeight: '700', color: colors.ink, textTransform: 'capitalize' },
});
