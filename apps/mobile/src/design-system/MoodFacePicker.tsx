import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from './tokens';

type Props = {
  value: number;
  onChange: (value: number) => void;
  /** Optional names for each mood (1..5); the selected one is shown under the row. */
  labels?: string[];
  accessibilityLabel?: string;
};

const faces = [
  { bg: '#F3EEF9', stroke: '#8d7fae', mouth: 'M12 24 Q19 15 26 24' },
  { bg: '#EAF5F9', stroke: '#5f9cb3', mouth: 'M12 23 Q19 19 26 23' },
  { bg: '#F1F7EF', stroke: '#7fa384', mouth: 'M12 22 L26 22' },
  { bg: '#FBF1DE', stroke: '#c99a2c', mouth: 'M12 20 Q19 25 26 20' },
  { bg: '#FBEFEC', stroke: '#d4795f', mouth: 'M12 19 Q19 27 26 19' },
];

const DEFAULT_LABELS = ['Very low', 'Low', 'Neutral', 'Good', 'Very good'];

export function MoodFacePicker({ value, onChange, labels = DEFAULT_LABELS, accessibilityLabel = 'Mood' }: Props) {
  const selectedIndex = Math.min(faces.length - 1, Math.max(0, Math.round(value) - 1));

  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel}>
      <View style={styles.row}>
        {faces.map((face, index) => {
          const moodValue = index + 1;
          const selected = value === moodValue;
          const name = labels[index] || `Mood ${moodValue}`;
          return (
            <TouchableOpacity
              key={moodValue}
              onPress={() => onChange(moodValue)}
              style={styles.face}
              activeOpacity={0.75}
              accessibilityRole="radio"
              accessibilityLabel={name}
              accessibilityHint={`Select mood ${moodValue} of 5`}
              accessibilityState={{ checked: selected, selected }}
            >
              <View style={[styles.bubble, { backgroundColor: face.bg }, selected && styles.bubbleSelected]}>
                <Svg width="38" height="38" viewBox="0 0 38 38" accessible={false}>
                  <Circle cx="19" cy="19" r="17" fill={face.bg} />
                  <Path d={face.mouth} stroke={face.stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
                </Svg>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.labelWrap}>
        <Text style={styles.label} accessibilityLiveRegion="polite">
          {labels[selectedIndex] || `Mood ${selectedIndex + 1}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  face: {
    minWidth: 46,
    minHeight: 46,
    padding: 2,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bubbleSelected: {
    borderColor: colors.leafInk,
    borderWidth: 3,
    transform: [{ scale: 1.08 }],
  },
  labelWrap: {
    alignItems: 'center',
    marginTop: 10,
  },
  label: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
});
