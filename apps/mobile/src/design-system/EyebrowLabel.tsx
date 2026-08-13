import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { typography, spacing } from './tokens';

type Props = {
  label: string;
  color?: string;
};

export function EyebrowLabel({ label, color }: Props) {
  return (
    <Text style={[styles.label, color && { color }]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Nunito',
    fontSize: 10.5,
    fontWeight: '800',
    color: '#6B6560',
    letterSpacing: 3.5,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
});
