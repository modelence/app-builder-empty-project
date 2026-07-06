import * as React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  variantColorStyle,
  DEFAULT_VARIANT,
  DEFAULT_COLOR,
  type Variant,
  type Color,
} from './_shared/variants';
import { SIZES, ICON_GLYPH, DEFAULT_SIZE, type ControlSize } from './_shared/sizes';
import { useButtonGroup } from './_shared/buttonGroup';
import { Spinner } from './Spinner';

export interface ButtonProps {
  /** Button label (text, or any node). */
  children?: React.ReactNode;
  /** Style treatment. @default "solid" */
  variant?: Variant;
  /** Intent color. @default "neutral" */
  color?: Color;
  /** @default "md" */
  size?: ControlSize;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
  disabled?: boolean;
  /** Icon rendered before the label (hidden while loading). */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  /** Extra style merged onto the container. */
  style?: StyleProp<ViewStyle>;
  /** Extra style merged onto the label text. */
  textStyle?: StyleProp<TextStyle>;
  /** Accessibility label (defaults to string children). */
  accessibilityLabel?: string;
}

/**
 * Pressable button mirroring the web `Button` API (variant/color/size, loading,
 * left/right icons). Resolution order for variant/color/size:
 * explicit prop -> ButtonGroup context -> module default.
 */
export function Button({
  children,
  variant: variantProp,
  color: colorProp,
  size: sizeProp,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onPress,
  style,
  textStyle,
  accessibilityLabel,
}: ButtonProps) {
  const group = useButtonGroup();
  const variant = variantProp ?? group?.variant ?? DEFAULT_VARIANT;
  const color = colorProp ?? group?.color ?? DEFAULT_COLOR;
  const size = sizeProp ?? group?.size ?? DEFAULT_SIZE;

  const v = variantColorStyle(variant, color);
  const sizing = SIZES[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={
        accessibilityLabel ?? (typeof children === 'string' ? children : undefined)
      }
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        sizing.container,
        v.container,
        pressed && !isDisabled && v.containerPressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <Spinner size={ICON_GLYPH[size]} color={v.text.color as string} />
      ) : (
        leftIcon
      )}
      {typeof children === 'string' ? (
        <Text style={[styles.label, sizing.text, v.text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
      {rightIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontWeight: '500' },
  disabled: { opacity: 0.5 },
});

/** Re-exported so consumers can compose left/right icon layouts if needed. */
export const ButtonIconSlot = View;
