import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadow } from './tokens';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  tint?: string;
};

export function Card({ children, style, tint }: CardProps) {
  return (
    <View style={[styles.card, tint && { backgroundColor: tint }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    ...shadow.soft,
  },
});
