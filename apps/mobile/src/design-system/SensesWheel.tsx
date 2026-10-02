import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';

import { WritingLineInput } from './WritingLineInput';
import { colors, spacing } from './tokens';

type Props = {
  values: Record<string, string>;
  onChange: (sense: string, text: string) => void;
};

const senses = [
  { key: 'see', label: 'SEE', sub: 'sight', color: colors.sky, text: '#2c5a68', cx: 110, cy: 35, emoji: '👁' },
  { key: 'hear', label: 'HEAR', sub: 'sound', color: colors.sage, text: '#3c5b40', cx: 181, cy: 87, emoji: '👂' },
  { key: 'touch', label: 'TOUCH', sub: 'feel', color: colors.gold, text: '#7a5410', cx: 154, cy: 171, emoji: '✋' },
  { key: 'smell', label: 'SMELL', sub: 'scent', color: colors.peach, text: '#7c3f2c', cx: 66, cy: 171, emoji: '👃' },
  { key: 'taste', label: 'TASTE', sub: 'flavor', color: colors.lavender, text: '#5a3d70', cx: 39, cy: 87, emoji: '👅' },
];

export function SensesWheel({ values, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        style={styles.wheel}
        accessible
        accessibilityRole="image"
        accessibilityLabel="Five-senses grounding wheel: sight, sound, touch, scent, and flavor surround the present moment."
      >
        {senses.map((s, i) => (
          <Line
            key={`l${i}`}
            x1="110"
            y1="110"
            x2={String(s.cx)}
            y2={String(s.cy)}
            stroke="#e3dccb"
            strokeWidth="1.4"
          />
        ))}
        <Circle cx="110" cy="110" r="26" fill="#fff" stroke="#e3dccb" strokeWidth="1.4" />
        <SvgText
          x="110"
          y="114"
          textAnchor="middle"
          fontFamily="Fraunces_600SemiBold"
          fontSize="12"
          fontWeight="600"
          fill={colors.ink}
        >
          NOW
        </SvgText>
        {senses.map((s) => (
          <React.Fragment key={s.key}>
            <Circle cx={String(s.cx)} cy={String(s.cy)} r="27" fill={s.color} opacity={0.85} />
            <SvgText
              x={String(s.cx)}
              y={String(s.cy - 4)}
              textAnchor="middle"
              fontFamily="Nunito_800ExtraBold"
              fontSize="9"
              fontWeight="800"
              fill={s.text}
            >
              {s.label}
            </SvgText>
            <SvgText
              x={String(s.cx)}
              y={String(s.cy + 7)}
              textAnchor="middle"
              fontFamily="Nunito_600SemiBold"
              fontSize="8"
              fontWeight="600"
              fill={s.text}
            >
              {s.sub}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>

      <View style={styles.inputs}>
        {senses.map((s) => (
          <View key={s.key} style={styles.inputRow}>
            <Text style={styles.inputLabel}>
              {s.emoji} I {s.sub}
            </Text>
            <WritingLineInput
              value={values[s.key] || ''}
              onChangeText={(text) => onChange(s.key, text)}
              placeholder="One thing…"
              multiline={false}
              accessibilityLabel={`What do you notice with your ${s.sub}?`}
              style={styles.input}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wheel: {
    marginBottom: spacing.lg,
  },
  inputs: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    gap: spacing.xs,
  },
  inputLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.ink,
  },
  input: {
    flex: 1,
  },
});
