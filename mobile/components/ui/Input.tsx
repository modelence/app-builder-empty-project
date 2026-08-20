import * as React from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { SIZES, DEFAULT_SIZE, type ControlSize } from './_shared/sizes';
import { palette, radius } from './_shared/tokens';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** @default "md" — shares heights with Button/Select so controls line up. */
  size?: ControlSize;
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
}

/**
 * Single-line text field mirroring the web `Input`. Uses the shared `sm/md/lg`
 * heights so it aligns with Button/Select. `editable` is derived from `disabled`.
 */
export const Input = React.forwardRef<TextInput, InputProps>(
  ({ size = DEFAULT_SIZE, disabled = false, onFocus, onBlur, style, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const sizing = SIZES[size];

    return (
      <TextInput
        ref={ref}
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
        style={[
          styles.base,
          { height: sizing.container.height, borderRadius: radius.md },
          sizing.text,
          focused && styles.focused,
          disabled && styles.disabled,
          style,
        ]}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderWidth: 1,
    borderColor: palette.gray300,
    backgroundColor: palette.white,
    color: palette.gray900,
    paddingHorizontal: 12,
  },
  focused: { borderColor: palette.blue500 },
  disabled: { opacity: 0.5, backgroundColor: palette.gray50 },
});
