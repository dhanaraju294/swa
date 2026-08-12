import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, spacing } from './tokens';

type Props = {
  total: number;
  current: number;
  completed?: number[];
};

export function ProgressPetals({ total, current, completed = [] }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = completed.includes(i + 1);
        const isCurrent = i + 1 === current;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              isCompleted && styles.completed,
              isCurrent && styles.current,
            ]}
          >
            <Svg width="14" height="14" viewBox="0 0 14 14">
              <Defs>
                <LinearGradient id={`petalG${i}`} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={isCompleted ? colors.gold : isCurrent ? colors.sky : '#E0DAD0'} />
                  <Stop offset="100%" stopColor={isCompleted ? colors.peach : isCurrent ? colors.sage : '#E0DAD0'} />
                </LinearGradient>
              </Defs>
              <Rect x="2" y="1" width="4" height="12" rx="2" fill={`url(#petalG${i})`} transform="rotate(-8 4 7)" />
              <Rect x="8" y="1" width="4" height="12" rx="2" fill={`url(#petalG${i})`} transform="rotate(8 10 7)" opacity={0.7} />
            </Svg>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  dot: {
    opacity: 0.4,
  },
  completed: {
    opacity: 0.8,
  },
  current: {
    opacity: 1,
    transform: [{ scale: 1.3 }],
  },
});
