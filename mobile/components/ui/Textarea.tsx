import * as React from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { palette, radius, fontSize } from './_shared/tokens';

export interface TextareaProps extends Omit<TextInputProps, 'style' | 'multiline'> {
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
}

/**
 * Multi-line text field mirroring the web `Textarea`. Always `multiline`, with a
 * min height matching the web `min-h-16`.
 */
export const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ disabled = false, onFocus, onBlur, style, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);

    return (
      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        editable={!disabled}
        placeholderTextColor={palette.gray500}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.base, focused && styles.focused, disabled && styles.disabled, style]}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 64,
    borderWidth: 1,
    borderColor: palette.gray300,
    borderRadius: radius.md,
    backgroundColor: palette.white,
    color: palette.gray900,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: fontSize.sm,
  },
  focused: { borderColor: palette.blue500 },
  disabled: { opacity: 0.5, backgroundColor: palette.gray50 },
});
