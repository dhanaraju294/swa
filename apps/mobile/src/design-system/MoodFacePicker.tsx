import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, spacing } from './tokens';

type Props = {
  value: number;
  onChange: (val: number) => void;
};

const faces = [
  { bg: '#F3EEF9', stroke: '#8d7fae', mouth: 'M12 24 Q19 15 26 24' },
  { bg: '#EAF5F9', stroke: '#5f9cb3', mouth: 'M12 23 Q19 19 26 23' },
  { bg: '#F1F7EF', stroke: '#7fa384', mouth: 'M12 22 L26 22' },
  { bg: '#FBF1DE', stroke: '#c99a2c', mouth: 'M12 20 Q19 25 26 20' },
  { bg: '#FBEFEC', stroke: '#d4795f', mouth: 'M12 19 Q19 27 26 19' },
];

export function MoodFacePicker({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {faces.map((f, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onChange(i + 1)}
          style={[styles.face, value === i + 1 && styles.selected]}
          activeOpacity={0.7}
        >
          <Svg width="38" height="38" viewBox="0 0 38 38">
            <Circle cx="19" cy="19" r="17" fill={f.bg} />
            <Path d={f.mouth} stroke={f.stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 220,
  },
  face: {
    padding: 2,
    borderRadius: 20,
  },
  selected: {
    transform: [{ scale: 1.15 }],
  },
});
