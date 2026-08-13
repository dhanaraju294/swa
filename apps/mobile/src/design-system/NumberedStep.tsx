import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from './tokens';

const stepColors = [colors.sky, colors.sage, colors.gold, colors.peach];

type Props = {
  number: number;
  text: string;
};

export function NumberedStep({ number, text }: Props) {
  const bgColor = stepColors[(number - 1) % stepColors.length];
  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: bgColor }]}>
        <Text style={styles.number}>{number}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  number: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  text: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: colors.ink,
    flex: 1,
  },
});
