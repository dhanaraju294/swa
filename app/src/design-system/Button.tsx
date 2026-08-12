import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, radius, spacing } from './tokens';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  color = colors.gold,
  disabled = false,
  loading = false,
  style,
}: Props) {
  const bgStyle =
    variant === 'primary'
      ? { backgroundColor: color }
      : variant === 'secondary'
      ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: color }
      : { backgroundColor: 'transparent' };

  const textStyle =
    variant === 'primary'
      ? { color: '#fff' }
      : variant === 'secondary'
      ? { color }
      : { color: colors.ink };

  return (
    <TouchableOpacity
      style={[styles.btn, bgStyle, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : color} size="small" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
