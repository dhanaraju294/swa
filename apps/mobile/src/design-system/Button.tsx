import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

import { colors, radius } from './tokens';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

function luminance(hex: string): number {
  const normalized = hex.replace('#', '');
  if (!/^[\da-f]{6}$/i.test(normalized)) return 1;
  const channels = [0, 2, 4].map((offset) => parseInt(normalized.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground: string, background: string): number {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

function darken(hex: string, amount: number): string {
  const normalized = hex.replace('#', '');
  if (!/^[\da-f]{6}$/i.test(normalized)) return colors.ink;
  const channels = [0, 2, 4].map((offset) =>
    Math.round(parseInt(normalized.slice(offset, offset + 2), 16) * (1 - amount)),
  );
  return `#${channels.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function accessibleOutline(color: string): string {
  let outline = color;
  let amount = 0;
  while (contrastRatio(outline, colors.white) < 3 && amount < 0.7) {
    amount += 0.08;
    outline = darken(color, amount);
  }
  return outline;
}

function foregroundFor(color: string): string {
  return contrastRatio(colors.ink, color) >= contrastRatio(colors.white, color) ? colors.ink : colors.white;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  color = colors.gold,
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
  accessibilityHint,
}: Props) {
  const primaryText = foregroundFor(color);
  const bgStyle =
    variant === 'primary'
      ? { backgroundColor: color }
      : variant === 'secondary'
        ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: accessibleOutline(color) }
        : { backgroundColor: 'transparent' };

  const textColor = variant === 'primary' ? primaryText : colors.ink;

  return (
    <TouchableOpacity
      style={[styles.btn, bgStyle, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
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
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.58,
  },
});
