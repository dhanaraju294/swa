import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Rect, Circle, Text as SvgText } from 'react-native-svg';
import { colors, spacing } from './tokens';

type Props = {
  isActive: boolean;
  onComplete?: () => void;
};

const PHASES = ['INHALE', 'HOLD', 'EXHALE', 'HOLD'] as const;
const PHASE_DURATION = 4000;
const TOTAL_CYCLES = 4;

export function BreathingSquare({ isActive, onComplete }: Props) {
  const [phase, setPhase] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [count, setCount] = useState(4);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isActive) return;
    if (cycles >= TOTAL_CYCLES) {
      onComplete?.();
      return;
    }

    setCount(4);
    setPhase(0);
    let step = 4;
    let currentPhase = 0;
    let currentCycles = cycles;

    const interval = setInterval(() => {
      step--;
      if (step <= 0) {
        currentPhase = (currentPhase + 1) % 4;
        if (currentPhase === 0) {
          currentCycles++;
          if (currentCycles >= TOTAL_CYCLES) {
            clearInterval(interval);
            onComplete?.();
            return;
          }
        }
        step = 4;
      }
      setCount(step);
      setPhase(currentPhase);
      setCycles(currentCycles);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, cycles, onComplete]);

  if (!isActive) return null;

  const phaseColor = [colors.sky, colors.sage, colors.gold, colors.peach][phase];
  const sideOffset = phase * 35;

  return (
    <View style={styles.container}>
      <View style={styles.squareContainer}>
        <Svg width="200" height="200" viewBox="0 0 200 200">
          <Rect x="30" y="30" width="140" height="140" rx="24" fill="none" stroke="#A8D8EA" strokeWidth="3" />
          <Circle cx={100 + (phase === 1 ? 70 : phase === 3 ? -70 : 0)} cy={phase === 0 ? 30 : phase === 2 ? 170 : 100} r="6" fill={colors.gold} />
          <SvgText x="100" y="18" textAnchor="middle" fontFamily="Nunito" fontSize="10" fontWeight="700" fill={colors.ink}>INHALE · 4</SvgText>
          <SvgText x="185" y="104" textAnchor="middle" fontFamily="Nunito" fontSize="10" fontWeight="700" fill={colors.ink} transform="rotate(90 185 104)">HOLD · 4</SvgText>
          <SvgText x="100" y="196" textAnchor="middle" fontFamily="Nunito" fontSize="10" fontWeight="700" fill={colors.ink}>EXHALE · 4</SvgText>
          <SvgText x="15" y="104" textAnchor="middle" fontFamily="Nunito" fontSize="10" fontWeight="700" fill={colors.ink} transform="rotate(-90 15 104)">HOLD · 4</SvgText>
        </Svg>
      </View>
      <Text style={[styles.phaseText, { color: phaseColor }]}>{PHASES[phase]}</Text>
      <Text style={styles.countText}>{count}</Text>
      <Text style={styles.cycleText}>Cycle {cycles + 1} of {TOTAL_CYCLES}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  squareContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  phaseText: {
    fontFamily: 'Nunito',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  countText: {
    fontFamily: 'Fraunces',
    fontSize: 48,
    fontWeight: '600',
    color: colors.ink,
  },
  cycleText: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: spacing.sm,
  },
});
