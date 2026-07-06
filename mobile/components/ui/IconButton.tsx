import * as React from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import {
  variantColorStyle,
  DEFAULT_COLOR,
  type Variant,
  type Color,
} from './_shared/variants';
import { ICON_SIZES, ICON_GLYPH, DEFAULT_SIZE, type ControlSize } from './_shared/sizes';
import { useButtonGroup } from './_shared/buttonGroup';
import { Spinner } from './Spinner';

export interface IconButtonProps {
  /** The icon element (e.g. a lucide icon). Hidden while loading. */
  children?: React.ReactNode;
  /** Required for accessibility — icon-only buttons have no text label. */
  accessibilityLabel: string;
  /** Style treatment. @default "ghost" */
  variant?: Variant;
  /** Intent color. @default "neutral" */
  color?: Color;
  /** @default "md" — shares the same heights as Button (sm/md/lg). */
  size?: ControlSize;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Square, icon-only pressable mirroring the web `IconButton`. Defaults to the
 * `ghost` variant. Resolution order: explicit prop -> ButtonGroup context -> default.
 */
export function IconButton({
  children,
  accessibilityLabel,
  variant: variantProp,
  color: colorProp,
  size: sizeProp,
  loading = false,
  disabled = false,
  onPress,
  style,
}: IconButtonProps) {
  const group = useButtonGroup();
  const variant = variantProp ?? group?.variant ?? 'ghost';
  const color = colorProp ?? group?.color ?? DEFAULT_COLOR;
  const size = sizeProp ?? group?.size ?? DEFAULT_SIZE;

  const v = variantColorStyle(variant, color);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        ICON_SIZES[size],
        v.container,
        pressed && !isDisabled && v.containerPressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? <Spinner size={ICON_GLYPH[size]} color={v.text.color as string} /> : children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
});
