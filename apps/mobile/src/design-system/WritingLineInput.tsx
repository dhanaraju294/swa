import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing } from './tokens';

type Props = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
} & TextInputProps;

export function WritingLineInput({
  placeholder,
  value,
  onChangeText,
  multiline = true,
  numberOfLines = 2,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  // Compose rather than let a caller's handler replace ours: spreading
  // {...props} after onFocus/onBlur would silently disable the focus underline
  // for any caller that passes its own handler.
  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur: TextInputProps['onBlur'] = (e) => {
    setFocused(false);
    onBlur?.(e);
  };
  return (
    <View style={styles.container}>
      {placeholder ? (
        <TextInput
          style={[styles.input, focused && styles.focused]}
          placeholder={placeholder}
          placeholderTextColor={colors.ghost}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ) : (
        <TextInput
          style={[styles.input, focused && styles.focused]}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.writingLine,
    paddingVertical: spacing.xs,
  },
  input: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: colors.ink,
    padding: 0,
    margin: 0,
    lineHeight: 21,
    minHeight: 42,
  },
  focused: {
    borderBottomColor: colors.gold,
  },
});
