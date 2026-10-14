import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { MASCOT_EMOTIONS, MASCOT_LABELS, SproutMascot } from '../../components/SproutMascot';
import type { MascotEmotion } from '../../components/SproutMascot';

/** Isolated review screen. No existing streak-to-mascot mapping is changed. */
export default function MascotDemoScreen() {
  const focused = useIsFocused();
  const [emotion, setEmotion] = useState<MascotEmotion>('idle');
  const [muted, setMuted] = useState(true);
  const [haptics, setHaptics] = useState(false);
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(0);
  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.eyebrow}>SWA / MASCOT STUDIO</Text>
    <Text style={styles.title}>A little sprout. A lot of joy.</Text>
    <SproutMascot emotion={emotion} size={300} muted={muted} hapticsEnabled={haptics} active={focused && !paused} replayKey={replay} />
    <Text accessibilityLiveRegion="polite" style={styles.label}>{MASCOT_LABELS[emotion]}</Text>
    <View style={styles.grid}>{MASCOT_EMOTIONS.map((state) => <Pressable key={state} accessibilityRole="button" accessibilityState={{ selected: state === emotion }} onPress={() => { setEmotion(state); setReplay((n) => n + 1); }} style={[styles.button, emotion === state && styles.selected]}>
      <Text style={[styles.buttonText, emotion === state && styles.selectedText]}>{MASCOT_LABELS[state]}</Text>
    </Pressable>)}</View>
    <View style={styles.settings}>
      <View style={styles.row}><Text style={styles.buttonText}>Sound</Text><Switch accessibilityLabel="Sound" value={!muted} onValueChange={(value) => setMuted(!value)} trackColor={{ true: '#8FB359' }} /></View>
      <View style={styles.row}><Text style={styles.buttonText}>Haptics{Platform.OS === 'web' ? ' (native device only)' : ''}</Text><Switch accessibilityLabel="Haptics" disabled={Platform.OS === 'web'} value={haptics} onValueChange={setHaptics} trackColor={{ true: '#8FB359' }} /></View>
      <View style={styles.row}><Text style={styles.buttonText}>Pause animation</Text><Switch accessibilityLabel="Pause animation" value={paused} onValueChange={setPaused} trackColor={{ true: '#8FB359' }} /></View>
    </View>
    <Pressable accessibilityRole="button" onPress={() => { setPaused(false); setReplay((n) => n + 1); }} style={styles.button}><Text style={styles.buttonText}>Replay this emotion</Text></Pressable>
    <Text style={styles.note}>Sound and haptics are opt-in. System Reduce Motion is respected. Feedback pauses when this screen loses focus or the app backgrounds. Audio respects the device’s silent-mode policy.</Text>
  </ScrollView>;
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#FAF8F2' },
  eyebrow: { fontSize: 11, letterSpacing: 2, color: '#748359', fontWeight: '700', marginBottom: 16 },
  title: { fontSize: 28, color: '#5C4033', fontWeight: '700', textAlign: 'center' },
  label: { fontSize: 19, fontWeight: '700', color: '#5C4033', marginVertical: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, maxWidth: 480 },
  button: { paddingVertical: 13, paddingHorizontal: 18, borderRadius: 22, backgroundColor: '#EBEDDF', minHeight: 44 },
  selected: { backgroundColor: '#607A3E' },
  buttonText: { color: '#5C4033', fontWeight: '600', fontSize: 14 },
  selectedText: { color: '#FFFFFF' },
  settings: { alignSelf: 'stretch', maxWidth: 480, width: '100%', marginVertical: 24, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  note: { maxWidth: 430, color: '#81786B', textAlign: 'center', fontSize: 12, lineHeight: 19, marginTop: 24 },
});
