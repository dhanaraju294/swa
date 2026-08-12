import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  value: number;
  max?: number;
};

export function SleepDots({ value, max = 5 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }).map((_, i) => (
        <Svg key={i} width="18" height="18" viewBox="0 0 18 18">
          <Path
            d="M15 10.5A7 7 0 1 1 8 2.5a6 6 0 0 0 7 8z"
            fill={i < value ? '#D8C8E8' : '#E9DDF1'}
          />
        </Svg>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 5,
  },
});
