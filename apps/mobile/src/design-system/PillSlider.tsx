import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, type LayoutChangeEvent } from 'react-native';

import { colors, spacing } from './tokens';

type Props = {
  label?: string;
  accessibilityLabel?: string;
  value: number;
  onChange?: (value: number) => void;
  color?: string;
  max?: number;
};

export function PillSlider({ label, accessibilityLabel, value, onChange, color = colors.gold, max = 100 }: Props) {
  const safeMax = Math.max(1, max);
  const initialPct = Math.min(100, Math.max(0, (value / safeMax) * 100));
  const [localPct, setLocalPct] = useState(initialPct);
  const localPctRef = useRef(initialPct);
  const maxRef = useRef(safeMax);
  const onChangeRef = useRef(onChange);
  const trackRef = useRef<View>(null);
  const trackWidth = useRef(0);
  const trackLeft = useRef(0);

  maxRef.current = safeMax;
  onChangeRef.current = onChange;

  useEffect(() => {
    const nextPct = Math.min(100, Math.max(0, (value / safeMax) * 100));
    localPctRef.current = nextPct;
    setLocalPct(nextPct);
  }, [value, safeMax]);

  const applyPct = (percent: number) => {
    const nextPct = Math.min(100, Math.max(0, percent));
    localPctRef.current = nextPct;
    setLocalPct(nextPct);
  };

  const applyPageX = (pageX: number) => {
    if (!trackWidth.current) return;
    applyPct(((pageX - trackLeft.current) / trackWidth.current) * 100);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderGrant: (_event, gesture) => {
        trackRef.current?.measureInWindow((x, _y, width) => {
          trackLeft.current = x;
          if (width > 0) trackWidth.current = width;
          applyPageX(gesture.x0);
        });
      },
      onPanResponderMove: (_event, gesture) => applyPageX(gesture.moveX),
      onPanResponderRelease: () => {
        onChangeRef.current?.(Math.round((localPctRef.current / 100) * maxRef.current));
      },
      onPanResponderTerminate: () => {
        onChangeRef.current?.(Math.round((localPctRef.current / 100) * maxRef.current));
      },
    }),
  ).current;

  const onLayout = (event: LayoutChangeEvent) => {
    trackWidth.current = event.nativeEvent.layout.width;
  };

  const adjustBy = (amount: number) => {
    const next = Math.min(safeMax, Math.max(0, Math.round(value + amount)));
    const nextPct = (next / safeMax) * 100;
    localPctRef.current = nextPct;
    setLocalPct(nextPct);
    onChangeRef.current?.(next);
  };

  const currentValue = Math.min(safeMax, Math.max(0, Math.round(value)));

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        ref={trackRef}
        onLayout={onLayout}
        style={styles.track}
        {...panResponder.panHandlers}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel || label || 'Scale'}
        accessibilityHint="Swipe horizontally to adjust. Use the increment and decrement actions to change by 5."
        accessibilityValue={{ min: 0, max: safeMax, now: currentValue, text: `${currentValue} of ${safeMax}` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'increment') adjustBy(5);
          if (event.nativeEvent.actionName === 'decrement') adjustBy(-5);
        }}
      >
        <View style={styles.trackBase} />
        <View style={[styles.fill, { width: `${localPct}%`, backgroundColor: color }]} />
        <View style={[styles.thumb, { left: `${localPct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  track: {
    height: 44,
    borderRadius: 22,
    position: 'relative',
    justifyContent: 'center',
  },
  trackBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 13,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F0E8D8',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 13,
    bottom: 13,
    borderRadius: 9,
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    top: 8,
    marginLeft: -14,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#3A3A3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },
});
