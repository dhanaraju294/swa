import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, AppState, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SproutMascot } from './SproutMascot';
import { EXERCISE_CELEBRATION } from '../journey/completionCelebration';

type Props = {
  day: number;
  active?: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onSoundChange: (enabled: boolean) => void;
  onContinue: () => void;
};

/** Mounted only after a first exercise completion has been successfully saved. */
export function ExerciseCompletion({ day, active = true, soundEnabled, hapticsEnabled, onSoundChange, onContinue }: Props) {
  const { width } = useWindowDimensions();
  const [phase, setPhase] = useState(0);
  const [finished, setFinished] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [foreground, setForeground] = useState(AppState.currentState !== 'background' && AppState.currentState !== 'inactive');
  const remaining = useRef<{ phase: number; millis: number }>({ phase: 0, millis: EXERCISE_CELEBRATION[0].duration });
  useEffect(() => {
    let alive = true;
    let changed = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => { if (alive && !changed) setReduced(value); }).catch(() => { if (alive && !changed) setReduced(false); });
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => { changed = true; setReduced(value); });
    const app = AppState.addEventListener('change', (state) => setForeground(state === 'active'));
    return () => { alive = false; motion.remove(); app.remove(); };
  }, []);
  const running = active && foreground && !reduced && !finished;
  useEffect(() => {
    if (!running) return;
    if (remaining.current.phase !== phase) remaining.current = { phase, millis: EXERCISE_CELEBRATION[phase].duration };
    const started = Date.now();
    const timer = setTimeout(() => {
      if (phase === EXERCISE_CELEBRATION.length - 1) setFinished(true);
      else setPhase((value) => value + 1);
    }, remaining.current.millis);
    return () => {
      clearTimeout(timer);
      remaining.current.millis = Math.max(0, remaining.current.millis - (Date.now() - started));
    };
  }, [phase, running]);
  const moment = EXERCISE_CELEBRATION[reduced ? EXERCISE_CELEBRATION.length - 1 : phase];
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.topRow}>
      <Text style={styles.saved}>✓ PROGRESS SAVED</Text>
      <Pressable accessibilityRole="switch" accessibilityLabel="Celebration sound" accessibilityState={{ checked: soundEnabled }} onPress={() => onSoundChange(!soundEnabled)} style={styles.soundButton}>
        <Text style={styles.soundText}>{soundEnabled ? '♪ Sound on' : '♪ Sound off'}</Text>
      </Pressable>
    </View>
    <View style={styles.middle}>
      <View style={styles.mascot}>
        <SproutMascot emotion={moment.emotion} size={Math.max(160, Math.min(300, width - 64))} active={running} muted={!soundEnabled} hapticsEnabled={hapticsEnabled} reducedMotion={reduced} />
      </View>
      <Text style={styles.eyebrow}>EXERCISE DAY {day} COMPLETE</Text>
      <Text style={styles.title} accessibilityRole="header" accessibilityLiveRegion="polite">Look at you grow!</Text>
      <Text style={styles.appreciation}>{moment.message}</Text>
      <View style={styles.badge}><Text style={styles.badgeText}>A little more present. A little more you.</Text></View>
    </View>
    <View style={styles.bottom}>
      <Pressable accessibilityRole="button" accessibilityLabel="Continue to Home" accessibilityHint="Your exercise is saved. You can leave without waiting for the animation." onPress={onContinue} style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}>
        <Text style={styles.continueText}>CONTINUE</Text>
      </Pressable>
      <Text style={styles.footer}>Your progress is safe. Take the next step at your own pace.</Text>
    </View>
  </ScrollView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF8F2' },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, alignItems: 'center' },
  topRow: { width: '100%', maxWidth: 500, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  saved: { color: '#668445', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  soundButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 22, borderWidth: 1, borderColor: '#E0E4D5' },
  soundText: { color: '#697952', fontSize: 12, fontWeight: '600' },
  middle: { flexGrow: 1, width: '100%', maxWidth: 480, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  mascot: { alignItems: 'center' },
  eyebrow: { color: '#779055', fontSize: 10, fontWeight: '800', letterSpacing: 1.6, textAlign: 'center', marginTop: 8 },
  title: { color: '#5C4033', fontSize: 32, fontWeight: '700', fontFamily: Platform.OS === 'web' ? 'Georgia' : 'Fraunces_700Bold', textAlign: 'center', marginTop: 12, marginBottom: 14 },
  appreciation: { color: '#756C5A', fontSize: 16, lineHeight: 25, textAlign: 'center', maxWidth: 315, minHeight: 54 },
  badge: { borderRadius: 14, paddingHorizontal: 15, paddingVertical: 12, marginTop: 18, backgroundColor: '#EEF2E3' },
  badgeText: { color: '#6D8051', fontSize: 11, fontWeight: '600', textAlign: 'center', lineHeight: 17 },
  bottom: { width: '100%', maxWidth: 430, paddingTop: 24 },
  continueButton: { minHeight: 55, backgroundColor: '#749B48', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 4, borderBottomColor: '#537832' },
  pressed: { backgroundColor: '#668B3F', borderBottomWidth: 1, transform: [{ translateY: 2 }] },
  continueText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', letterSpacing: 1.5 },
  footer: { color: '#958D7C', fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 14 },
});
