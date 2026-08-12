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
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      ) : (
        <TextInput
          style={[styles.input, focused && styles.focused]}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
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
