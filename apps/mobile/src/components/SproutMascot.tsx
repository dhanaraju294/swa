import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, AppState, Platform, View } from 'react-native';
import Svg, { Ellipse, G, Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import Animated, {
  cancelAnimation, createAnimatedPropAdapter, Easing, runOnJS,
  useAnimatedProps, useAnimatedReaction, useSharedValue,
  withRepeat, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

/** Self-contained artwork, rig, synthesizer and feedback. No image/audio assets. */
export type MascotEmotion = 'idle' | 'happy_jump' | 'clapping' | 'thumbs_up' | 'celebration';
export interface SproutMascotProps {
  emotion?: MascotEmotion;
  size?: number;
  muted?: boolean;
  hapticsEnabled?: boolean;
  /** Pass screen focus here. Backgrounding is also handled automatically. */
  active?: boolean;
  /** System Reduce Motion always wins; true additionally disables motion. */
  reducedMotion?: boolean;
  /** Increment to replay the same emotion without remounting. */
  replayKey?: number;
}
export const MASCOT_EMOTIONS: readonly MascotEmotion[] = ['idle', 'happy_jump', 'clapping', 'thumbs_up', 'celebration'];
export const MASCOT_LABELS: Record<MascotEmotion, string> = {
  idle: 'Idle', happy_jump: 'Happy jump', clapping: 'Clapping', thumbs_up: 'Thumbs up', celebration: 'Celebration',
};
const INK = '#5C4033';
const CREAM = '#FFFDF2';
const SHADE = '#F3E5AB';
const WEB = Platform.OS === 'web';
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

// Native SVG groups consume a 2D matrix, not a React Native View transform.
// On web use the corresponding SVG matrix attribute. All positions stay in
// viewBox units so a 35-unit hop scales correctly at every requested size.
const matrixAdapter = createAnimatedPropAdapter((props) => {
  'worklet';
  if ('transform' in props) {
    props.matrix = props.transform;
    delete props.transform;
  }
}, ['matrix']);
const adapter = WEB ? undefined : matrixAdapter;
function transform(x: number, y: number, degrees = 0, sx = 1, sy = 1) {
  'worklet';
  const r = degrees * Math.PI / 180;
  const a = Math.cos(r) * sx;
  const b = Math.sin(r) * sx;
  const c = -Math.sin(r) * sy;
  const d = Math.cos(r) * sy;
  return WEB ? `matrix(${a} ${b} ${c} ${d} ${x} ${y})` : [a, b, c, d, x, y] as [number, number, number, number, number, number];
}

// ---------------------------------------------------------------------------
// Small, lazy, deterministic 16-bit mono PCM synthesizer (22,050 Hz).
// ---------------------------------------------------------------------------
export type SproutSound = 'jump' | 'clap' | 'thumbs_up' | 'celebration';
export const SAMPLE_RATE = 22050;
export function encodeBase64(bytes: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0);
    out += alphabet[(n >>> 18) & 63] + alphabet[(n >>> 12) & 63]
      + (i + 1 < bytes.length ? alphabet[(n >>> 6) & 63] : '=')
      + (i + 2 < bytes.length ? alphabet[n & 63] : '=');
  }
  return out;
}
export function generateSproutSound(kind: SproutSound): string {
  const notes = kind === 'thumbs_up' ? [523.25, 659.25] : [523.25, 659.25, 783.99, 1046.5];
  const noteTime = kind === 'thumbs_up' ? 0.11 : 0.095;
  const duration = kind === 'jump' ? 0.16 : kind === 'clap' ? 0.07 : notes.length * noteTime;
  const length = Math.round(SAMPLE_RATE * duration);
  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);
  const text = (at: number, value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(at + i, value.charCodeAt(i));
  };
  text(0, 'RIFF'); view.setUint32(4, 36 + length * 2, true); text(8, 'WAVE');
  text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, 1, true); view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true); view.setUint16(32, 2, true);
  view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, length * 2, true);
  let phase = 0;
  let seed = 1729;
  for (let i = 0; i < length; i++) {
    const seconds = i / SAMPLE_RATE;
    const t = i / Math.max(1, length - 1);
    let value: number;
    if (kind === 'jump' || kind === 'clap') {
      const freq = kind === 'jump' ? 320 + 360 * t : 500 - 320 * t;
      phase += 2 * Math.PI * freq / SAMPLE_RATE;
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed / 0xffffffff * 2 - 1;
      const envelope = kind === 'jump' ? Math.sin(Math.PI * t) : Math.min(1, seconds / 0.002) * Math.exp(-9 * t) * (1 - t);
      value = (kind === 'jump' ? Math.sin(phase) : 0.55 * noise + 0.45 * Math.sin(phase)) * envelope * 0.4;
    } else {
      const note = Math.min(notes.length - 1, Math.floor(seconds / noteTime));
      const local = seconds - note * noteTime;
      const u = local / noteTime;
      phase += 2 * Math.PI * notes[note] / SAMPLE_RATE;
      const triangle = 2 / Math.PI * Math.asin(Math.sin(phase));
      // Short attack/release prevents clicks at note boundaries.
      const envelope = Math.min(1, local / 0.005) * Math.min(1, Math.max(0, (noteTime - local - 1 / SAMPLE_RATE) / 0.012)) * Math.exp(-3 * u);
      value = (0.8 * Math.sin(phase) + 0.2 * triangle) * envelope * 0.4;
    }
    view.setInt16(44 + i * 2, Math.round(Math.max(-1, Math.min(1, value)) * 32767), true);
  }
  return `data:audio/wav;base64,${encodeBase64(new Uint8Array(buffer))}`;
}
const soundUris = new Map<SproutSound, string>();
const nativeFiles = new Map<SproutSound, Promise<string>>();
async function soundSource(kind: SproutSound): Promise<string> {
  let uri = soundUris.get(kind);
  if (!uri) { uri = generateSproutSound(kind); soundUris.set(kind, uri); }
  if (WEB) return uri;
  // AVURLAsset/ExoPlayer data-URI support varies. Materialize our generated WAV
  // in disposable cache on native, without bundling or downloading any assets.
  let file = nativeFiles.get(kind);
  if (!file) {
    const base64 = uri.split(',')[1];
    file = (async () => {
      if (!FileSystem.cacheDirectory) throw new Error('Audio cache is unavailable');
      const path = `${FileSystem.cacheDirectory}sprout-sfx-v1-${kind}.wav`;
      await FileSystem.writeAsStringAsync(path, base64, { encoding: FileSystem.EncodingType.Base64 });
      return path;
    })();
    nativeFiles.set(kind, file);
    file.catch(() => nativeFiles.delete(kind));
  }
  return file;
}

type Feedback = 'takeoff' | 'landing' | 'clap' | 'success' | 'bounce' | 'light';
function useFeedback(emotion: MascotEmotion, running: boolean, muted: boolean, hapticsEnabled: boolean, replayKey: number) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const latest = useRef({ emotion, running, muted, hapticsEnabled });
  latest.current = { emotion, running, muted, hapticsEnabled };
  const busySound = useRef<Audio.Sound | null>(null);
  const play = useCallback((sound: Audio.Sound) => {
    if (soundRef.current !== sound || busySound.current === sound || !latest.current.running || latest.current.muted) return;
    busySound.current = sound;
    void sound.replayAsync().catch(() => undefined).finally(() => {
      if (busySound.current === sound) busySound.current = null;
    });
  }, []);
  useEffect(() => {
    if (!running || muted || emotion === 'idle') return;
    let disposed = false;
    let owned: Audio.Sound | null = null;
    const kind: SproutSound = emotion === 'happy_jump' ? 'jump' : emotion === 'clapping' ? 'clap' : emotion;
    void (async () => {
      try {
        const uri = await soundSource(kind);
        if (disposed) return;
        const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: false, volume: 0.55 }, undefined, false);
        if (disposed) { await sound.unloadAsync().catch(() => undefined); return; }
        owned = sound;
        soundRef.current = sound;
        // One-shot feedback must not disappear if loading took longer than mount.
        if (kind === 'thumbs_up' || kind === 'celebration') play(sound);
      } catch { /* Audio unavailable: visuals and haptics still work. */ }
    })();
    return () => {
      disposed = true;
      if (soundRef.current === owned) soundRef.current = null;
      if (owned) {
        const sound = owned;
        void sound.setStatusAsync({ shouldPlay: false, positionMillis: 0 }).catch(() => undefined).then(() => sound.unloadAsync()).catch(() => undefined);
      }
    };
  }, [emotion, running, muted, replayKey, play]);
  return useCallback((event: Feedback, expectedEmotion: MascotEmotion) => {
    const options = latest.current;
    if (!options.running || options.emotion !== expectedEmotion) return;
    if ((event === 'takeoff' || event === 'clap') && soundRef.current && !options.muted) play(soundRef.current);
    if (!options.hapticsEnabled || WEB) return;
    const feedback = event === 'success'
      ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      : Haptics.impactAsync(event === 'takeoff' || event === 'bounce' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
    void feedback.catch(() => undefined);
  }, [play]);
}

const CONFETTI = Array.from({ length: 14 }, (_, i) => ({
  angle: -Math.PI + i / 13 * Math.PI,
  distance: 85 + i % 3 * 18,
  delay: i % 4 * 0.07,
  color: ['#E99679', '#8FB359', '#66BCCA', '#EBC85A', '#BD8ABA'][i % 5],
}));
function Confetti({ index, clock, moving }: { index: number; clock: SharedValue<number>; moving: boolean }) {
  const particle = CONFETTI[index];
  const props = useAnimatedProps(() => {
    const p = moving ? (clock.value + particle.delay) % 1 : 0.55;
    const radius = 30 + particle.distance * p;
    const x = 130 + Math.cos(particle.angle) * radius;
    const y = 150 + Math.sin(particle.angle) * radius - 34 * Math.sin(p * Math.PI) + 35 * p * p;
    return { transform: transform(x, y, p * 290 + index * 30), opacity: moving ? Math.min(1, p * 8, (1 - p) * 5) : 0.8 };
  }, [moving, clock], adapter);
  return <AnimatedG animatedProps={props}><Path d={index % 3 === 0 ? 'M0 -5 L2 -2 L5 0 L2 2 L0 5 L-2 2 L-5 0 L-2 -2 Z' : 'M-3 -5 Q0 -3 3 -5 L3 3 Q0 6 -3 3 Z'} fill={particle.color} /></AnimatedG>;
}

export function SproutMascot({ emotion = 'idle', size = 220, muted = true, hapticsEnabled = false, active = true, reducedMotion = false, replayKey = 0 }: SproutMascotProps) {
  const mood = MASCOT_EMOTIONS.includes(emotion) ? emotion : 'idle';
  const dimension = Number.isFinite(size) && size > 0 ? size : 220;
  const [systemReduced, setSystemReduced] = useState(true);
  const [foreground, setForeground] = useState(AppState.currentState !== 'background' && AppState.currentState !== 'inactive');
  useEffect(() => {
    let mounted = true;
    let receivedEvent = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => { if (mounted && !receivedEvent) setSystemReduced(value); }).catch(() => { if (mounted && !receivedEvent) setSystemReduced(false); });
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => { receivedEvent = true; setSystemReduced(value); });
    const app = AppState.addEventListener('change', (state) => setForeground(state === 'active'));
    return () => { mounted = false; motion.remove(); app.remove(); };
  }, []);
  const moving = active && foreground && !systemReduced && !reducedMotion;
  const clock = useSharedValue(0);
  const confettiClock = useSharedValue(0);
  const leftPose = useSharedValue(0);
  const rightPose = useSharedValue(0);
  const nod = useSharedValue(0);
  const generation = useSharedValue(0);
  const generationRef = useRef(0);
  const feedback = useFeedback(mood, moving, muted, hapticsEnabled, replayKey);
  const emit = useCallback((event: Feedback, expected: MascotEmotion, id: number) => {
    if (id === generationRef.current) feedback(event, expected);
  }, [feedback]);
  useEffect(() => {
    const id = ++generationRef.current;
    generation.value = id;
    [clock, confettiClock, leftPose, rightPose, nod].forEach(cancelAnimation);
    clock.value = 0;
    confettiClock.value = 0;
    nod.value = 0;
    const raised = mood === 'happy_jump' || mood === 'celebration';
    const left = raised ? 130 : 0;
    const right = raised ? -130 : 0;
    leftPose.value = moving ? withSpring(left, { damping: 15, stiffness: 160 }) : left;
    rightPose.value = moving ? withSpring(right, { damping: 15, stiffness: 160 }) : right;
    if (moving) {
      if (mood === 'thumbs_up') {
        nod.value = withSequence(withTiming(1, { duration: 140 }), withSpring(0, { damping: 10, stiffness: 150 }));
        emit('success', mood, id);
      } else {
        const duration = mood === 'idle' ? 2400 : mood === 'happy_jump' ? 700 : mood === 'clapping' ? 280 : 880;
        clock.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false);
        if (mood === 'happy_jump') emit('takeoff', mood, id);
        if (mood === 'celebration') {
          confettiClock.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.linear }), -1, false);
          emit('success', mood, id);
        }
      }
    }
    return () => {
      ++generationRef.current;
      [clock, confettiClock, leftPose, rightPose, nod].forEach(cancelAnimation);
    };
  }, [mood, moving, replayKey, clock, confettiClock, leftPose, rightPose, nod, generation, emit]);

  // Feedback is triggered by the visual clock crossing a contact boundary, not
  // by drifting JS intervals. Bridge/audio/haptic latency is still device-dependent.
  useAnimatedReaction(() => ({ phase: clock.value, id: generation.value }), (current, last) => {
    if (!moving || last === null || current.id !== last.id) return;
    const p = current.phase;
    const previous = last.phase;
    if (mood === 'happy_jump') {
      if (p < previous) runOnJS(emit)('takeoff', mood, generation.value);
      if (previous < 0.5 && p >= 0.5) runOnJS(emit)('landing', mood, generation.value);
    }
    if (mood === 'clapping' && previous < 0.5 && p >= 0.5) runOnJS(emit)('clap', mood, generation.value);
    if (mood === 'celebration') {
      if (p < previous) runOnJS(emit)('bounce', mood, generation.value);
      if (previous < 0.65 && p >= 0.65) runOnJS(emit)('light', mood, generation.value);
    }
  }, [mood, moving, emit, clock, generation]);

  const bodyProps = useAnimatedProps(() => {
    const p = clock.value;
    const wave = Math.sin(p * Math.PI * 2);
    let y = 0, sx = 1, sy = 1;
    if (moving) {
      if (mood === 'idle') sy = 1 + 0.015 * (1 - Math.cos(p * Math.PI * 2));
      if (mood === 'happy_jump') {
        const flight = Math.sin(Math.PI * Math.min(p * 2, 1));
        const squash = p >= 0.5 ? Math.sin((p - 0.5) * 2 * Math.PI) : 0;
        y = -35 * flight; sy = 1 + 0.055 * flight - 0.055 * squash; sx = 1 - 0.035 * flight + 0.05 * squash;
      }
      if (mood === 'clapping') sy = 1 + 0.012 * wave;
      if (mood === 'thumbs_up') { sy = 1 - 0.025 * nod.value; y = 2 * nod.value; }
      if (mood === 'celebration') {
        const lift = Math.sin(Math.PI * Math.min(p / 0.65, 1));
        const settle = p > 0.65 ? Math.sin((p - 0.65) / 0.35 * Math.PI) : 0;
        y = -18 * lift; sy = 1 + 0.035 * lift - 0.035 * settle; sx = 1 - 0.02 * lift + 0.03 * settle;
      }
    }
    // Scale about the feet, not the SVG canvas center.
    return { transform: transform(130 * (1 - sx), 279 * (1 - sy) + y, 0, sx, sy) };
  }, [mood, moving, clock, nod], adapter);
  const shadowProps = useAnimatedProps(() => {
    const hop = !moving ? 0 : mood === 'happy_jump' ? Math.sin(Math.PI * Math.min(clock.value * 2, 1)) : mood === 'celebration' ? Math.sin(Math.PI * Math.min(clock.value / 0.65, 1)) * 0.55 : 0;
    return { rx: 63 * (1 - 0.35 * hop), ry: 8 * (1 - 0.25 * hop), opacity: 0.75 - 0.2 * hop };
  }, [mood, moving, clock]);
  const leafProps = useAnimatedProps(() => ({ transform: transform(130, 77, moving ? Math.sin(clock.value * Math.PI * 2) * (mood === 'idle' ? 5 : 9) + nod.value * 8 : 0) }), [moving, mood, clock, nod], adapter);
  const leftProps = useAnimatedProps(() => {
    const clap = mood === 'clapping' ? (moving ? Math.sin(clock.value * Math.PI) : 1) * 16 : 0;
    const wave = moving && mood === 'celebration' ? 12 * Math.sin(clock.value * Math.PI * 2) : 0;
    return { transform: transform(60 + clap, mood === 'clapping' ? 218 : 170, leftPose.value + wave) };
  }, [mood, moving, clock, leftPose], adapter);
  const rightProps = useAnimatedProps(() => {
    const clap = mood === 'clapping' ? (moving ? Math.sin(clock.value * Math.PI) : 1) * 16 : 0;
    const wave = moving && mood === 'celebration' ? -12 * Math.sin(clock.value * Math.PI * 2 + Math.PI / 2) : 0;
    return { transform: transform(200 - clap, mood === 'clapping' ? 218 : 170, rightPose.value + wave) };
  }, [mood, moving, clock, rightPose], adapter);
  const leftFootProps = useAnimatedProps(() => ({ transform: transform(93, 252, moving && mood === 'happy_jump' ? Math.sin(Math.PI * Math.min(clock.value * 2, 1)) * 16 : 0) }), [mood, moving, clock], adapter);
  const rightFootProps = useAnimatedProps(() => ({ transform: transform(167, 252, moving && mood === 'happy_jump' ? -Math.sin(Math.PI * Math.min(clock.value * 2, 1)) * 16 : 0) }), [mood, moving, clock], adapter);
  const sparkleProps = useAnimatedProps(() => ({ opacity: moving ? Math.pow(Math.sin(clock.value * Math.PI), 6) : 1 }), [moving, clock]);
  const open = mood === 'happy_jump' || mood === 'clapping' || mood === 'celebration';
  const armPath = 'M0 0 C-16 10 -39 49 -24 53 C-10 59 -5 27 5 11';
  const clapPath = 'M0 0 C12 20 30 24 47 7 C59 -4 53 -22 44 -18 C35 -14 33 2 17 -3';
  const arms = <>
    <AnimatedG animatedProps={leftProps}><Path d={mood === 'clapping' ? clapPath : armPath} fill={CREAM} stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></AnimatedG>
    <AnimatedG animatedProps={rightProps}>
      {mood === 'thumbs_up' ? <G fill={CREAM} stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M-5 12 C9 8 22 -3 29 -17 C33 -23 28 -34 33 -36 C41 -39 43 -25 41 -20 C55 -20 59 -7 54 2 C47 15 31 22 6 27" />
        <Path d="M41 -19 C30 -17 32 -3 40 -3" fill="none" />
      </G> : <G transform="scale(-1 1)"><Path d={mood === 'clapping' ? clapPath : armPath} fill={CREAM} stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></G>}
    </AnimatedG>
  </>;
  return <View accessible accessibilityRole="image" accessibilityLabel={`Sprout mascot: ${MASCOT_LABELS[mood].toLowerCase()}`} style={{ width: dimension, height: dimension }}>
    <Svg width={dimension} height={dimension} viewBox="-12 -24 284 324" {...(WEB ? { 'aria-hidden': true } : { accessible: false })}>
      <AnimatedEllipse cx={130} cy={282} rx={63} ry={8} fill="#E6DEC8" animatedProps={shadowProps} />
      {mood === 'celebration' && CONFETTI.map((_, i) => <Confetti key={i} index={i} clock={confettiClock} moving={moving} />)}
      <AnimatedG animatedProps={bodyProps}>
        <AnimatedG animatedProps={leafProps}>
          <G stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M0 1 Q2 -11 0 -22" fill="none" />
            <Path d="M0 -18 C-22 -13 -34 -27 -33 -42 C-13 -46 1 -32 0 -18 Z" fill="#8FB359" />
            <Path d="M0 -20 C-2 -39 11 -47 28 -46 C32 -29 18 -17 0 -20 Z" fill="#8FB359" />
          </G>
        </AnimatedG>
        <G fill={CREAM} stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
          <AnimatedG animatedProps={leftFootProps}><Path d="M-19 -6 L-15 17 C-11 32 7 33 14 6 L16 -4" /></AnimatedG>
          <AnimatedG animatedProps={rightFootProps}><Path d="M-16 -4 L-14 6 C-7 33 11 32 15 17 L19 -6" /></AnimatedG>
        </G>
        {mood !== 'clapping' && mood !== 'thumbs_up' && arms}
        <Path d="M130 77 C90 77 66 104 61 144 C58 169 42 192 46 216 C50 247 81 263 130 263 C179 263 210 247 214 216 C218 192 202 169 199 144 C194 104 170 77 130 77 Z" fill={CREAM} />
        <Path d="M48 212 C59 241 91 247 130 247 C169 247 201 241 212 212 C210 244 179 261 130 261 C81 261 50 244 48 212 Z" fill={SHADE} opacity={0.65} />
        <Path d="M75 123 C84 95 106 84 130 84 C152 84 176 97 184 116" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
        <Path d="M130 77 C90 77 66 104 61 144 C58 169 42 192 46 216 C50 247 81 263 130 263 C179 263 210 247 214 216 C218 192 202 169 199 144 C194 104 170 77 130 77 Z" fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <Ellipse cx={84} cy={164} rx={11} ry={6} fill="#F4B8A4" />
        <Ellipse cx={176} cy={164} rx={11} ry={6} fill="#F4B8A4" />
        <G stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {mood === 'clapping' ? <><Path d="M93 140 L107 148 L93 151" /><Path d="M167 140 L153 148 L167 151" /></>
            : open ? <><Path d="M93 149 Q100 133 109 147" /><Path d="M151 147 Q160 133 167 149" /></>
              : <><Ellipse cx={100} cy={146} rx={5.5} ry={7.5} fill={INK} stroke="none" />{mood === 'thumbs_up' ? <Path d="M167 140 L154 148 L167 151" /> : <Ellipse cx={160} cy={146} rx={5.5} ry={7.5} fill={INK} stroke="none" />}</>}
        </G>
        {open ? <G>
          <Path d="M114 160 Q130 167 146 160 C149 191 113 195 114 160 Z" fill="#8C3B32" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <Path d="M119 177 Q130 170 141 178 C135 188 124 188 119 177 Z" fill="#E07A5F" />
        </G> : <Path d="M118 158 Q130 171 142 158" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />}
        {(mood === 'clapping' || mood === 'thumbs_up') && arms}
        {mood === 'clapping' && <AnimatedG animatedProps={sparkleProps}>
          <G stroke="#E9AD56" strokeWidth={4} strokeLinecap="round"><Path d="M130 187 L130 179 M115 189 L110 183 M145 189 L150 183 M108 200 L100 197 M152 200 L160 197" /></G>
          <Path d="M222 96 L226 105 L235 109 L226 113 L222 122 L218 113 L209 109 L218 105 Z" fill="#E9AD56" />
        </AnimatedG>}
      </AnimatedG>
    </Svg>
  </View>;
}

export default SproutMascot;
