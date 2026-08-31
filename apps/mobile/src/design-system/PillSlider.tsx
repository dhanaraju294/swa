import React, { useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { colors, spacing } from './tokens';

type Props = {
  label?: string;
  value: number;
  onChange?: (val: number) => void;
  color?: string;
  max?: number;
};

export function PillSlider({ label, value, onChange, color = colors.gold, max = 100 }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const [localPct, setLocalPct] = useState(pct);
  const animatedPct = new Animated.Value(localPct);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      const trackWidth = 300;
      const newPct = Math.min(100, Math.max(0, (gesture.moveX / trackWidth) * 100));
      setLocalPct(newPct);
      animatedPct.setValue(newPct);
    },
    onPanResponderRelease: () => {
      const newVal = Math.round((localPct / 100) * max);
      onChange?.(newVal);
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: `${localPct}%`, backgroundColor: color }]} />
        <Animated.View style={[styles.thumb, { left: `${localPct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  track: {
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F0E8D8',
    position: 'relative',
    justifyContent: 'center',
    width: '100%',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 9,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    top: -3,
    marginLeft: -12,
    shadowColor: '#3A3A3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
});