import * as React from 'react';
import { StyleSheet, Text, type TextProps, type StyleProp, type TextStyle } from 'react-native';
import { palette, fontSize } from './_shared/tokens';

export interface LabelProps extends TextProps {
  /** Dims the label to signal the associated control is disabled. */
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
}

/**
 * Form field label mirroring the web `Label`. On mobile there is no `htmlFor`
 * association — place it next to the control and, when useful, make it pressable
 * by wrapping it in the control's Pressable.
 */
export const Label = React.forwardRef<Text, LabelProps>(
  ({ disabled = false, style, ...props }, ref) => (
    <Text ref={ref} style={[styles.base, disabled && styles.disabled, style]} {...props} />
  )
);
Label.displayName = 'Label';

const styles = StyleSheet.create({
  base: { fontSize: fontSize.sm, fontWeight: '500', color: palette.gray900 },
  disabled: { opacity: 0.7 },
});
