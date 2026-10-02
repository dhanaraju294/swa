import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, TextStyle, StyleProp } from 'react-native';

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
  accessibilityLabel,
  accessibilityHint,
  style: inputStyle,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    setFocused(true);
    onFocus?.(event);
  };
  const handleBlur: TextInputProps['onBlur'] = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <TextInput
        style={[styles.input, inputStyle as StyleProp<TextStyle>]}
        placeholder={placeholder}
        placeholderTextColor={colors.ghost}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        accessibilityLabel={accessibilityLabel || placeholder || 'Text input'}
        accessibilityHint={accessibilityHint}
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.writingLine,
    paddingVertical: spacing.xs,
  },
  containerFocused: {
    borderBottomColor: colors.leafInk,
  },
  input: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.ink,
    padding: 0,
    margin: 0,
    lineHeight: 22,
    minHeight: 42,
  },
});
