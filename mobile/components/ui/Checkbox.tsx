import * as React from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Check, Minus } from 'lucide-react-native';
import { palette, radius } from './_shared/tokens';

export interface CheckboxProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Uncontrolled initial state. @default false */
  defaultChecked?: boolean;
  /** Renders the indeterminate (dash) state; overrides the check glyph. */
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Checkbox mirroring the web `Checkbox` (supports controlled/uncontrolled and an
 * indeterminate state). Toggling an indeterminate checkbox resolves it to checked,
 * matching the web control's behavior.
 */
export function Checkbox({
  checked,
  defaultChecked = false,
  indeterminate = false,
  onCheckedChange,
  disabled = false,
  style,
}: CheckboxProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const value = isControlled ? checked : internal;

  const active = indeterminate || value;

  const toggle = () => {
    const next = !value;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: indeterminate ? 'mixed' : value, disabled }}
      disabled={disabled}
      onPress={toggle}
      style={[
        styles.box,
        active && styles.boxActive,
        disabled && styles.disabled,
        style,
      ]}
    >
      {indeterminate ? (
        <Minus size={12} color={palette.white} />
      ) : value ? (
        <Check size={12} color={palette.white} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 18,
    width: 18,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.gray300,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: palette.black, backgroundColor: palette.black },
  disabled: { opacity: 0.5 },
});
