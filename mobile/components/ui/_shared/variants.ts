import type { TextStyle, ViewStyle } from 'react-native';
import { palette } from './tokens';

/** Mirrors the web `Variant` / `Color` unions. */
export type Variant = 'solid' | 'outline' | 'ghost' | 'link' | 'soft';
export type Color = 'neutral' | 'primary' | 'destructive';

export const DEFAULT_VARIANT: Variant = 'solid';
export const DEFAULT_COLOR: Color = 'neutral';

export interface VariantStyle {
  /** Container style at rest. */
  container: ViewStyle;
  /** Container style overlay while pressed (RN has no CSS `:active`). */
  containerPressed: ViewStyle;
  /** Text/icon color for the control. */
  text: TextStyle;
}

/**
 * variant (style treatment) × color (intent) → RN styles.
 * `solid` + `neutral` is the default black control, matching the web system.
 * Because React Native has no hover, only rest + pressed states are modeled.
 */
export const VARIANT_COLOR: Record<Variant, Record<Color, VariantStyle>> = {
  solid: {
    neutral: {
      container: { backgroundColor: palette.black },
      containerPressed: { backgroundColor: palette.gray900 },
      text: { color: palette.white },
    },
    primary: {
      container: { backgroundColor: palette.blue600 },
      containerPressed: { backgroundColor: palette.blue800 },
      text: { color: palette.white },
    },
    destructive: {
      container: { backgroundColor: palette.red600 },
      containerPressed: { backgroundColor: palette.red800 },
      text: { color: palette.white },
    },
  },
  outline: {
    neutral: {
      container: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.gray300 },
      containerPressed: { backgroundColor: palette.gray100 },
      text: { color: palette.gray900 },
    },
    primary: {
      container: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.blue300 },
      containerPressed: { backgroundColor: palette.blue100 },
      text: { color: palette.blue700 },
    },
    destructive: {
      container: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.red300 },
      containerPressed: { backgroundColor: palette.red100 },
      text: { color: palette.red700 },
    },
  },
  ghost: {
    neutral: {
      container: { backgroundColor: 'transparent' },
      containerPressed: { backgroundColor: palette.gray200 },
      text: { color: palette.gray900 },
    },
    primary: {
      container: { backgroundColor: 'transparent' },
      containerPressed: { backgroundColor: palette.blue100 },
      text: { color: palette.blue700 },
    },
    destructive: {
      container: { backgroundColor: 'transparent' },
      containerPressed: { backgroundColor: palette.red100 },
      text: { color: palette.red700 },
    },
  },
  link: {
    neutral: {
      container: { backgroundColor: 'transparent' },
      containerPressed: { backgroundColor: 'transparent' },
      text: { color: palette.gray900, textDecorationLine: 'underline' },
    },
    primary: {
      container: { backgroundColor: 'transparent' },
      containerPressed: { backgroundColor: 'transparent' },
      text: { color: palette.blue600, textDecorationLine: 'underline' },
    },
    destructive: {
      container: { backgroundColor: 'transparent' },
      containerPressed: { backgroundColor: 'transparent' },
      text: { color: palette.red600, textDecorationLine: 'underline' },
    },
  },
  soft: {
    neutral: {
      container: { backgroundColor: palette.gray100 },
      containerPressed: { backgroundColor: palette.gray300 },
      text: { color: palette.gray900 },
    },
    primary: {
      container: { backgroundColor: palette.blue100 },
      containerPressed: { backgroundColor: palette.blue300 },
      text: { color: palette.blue800 },
    },
    destructive: {
      container: { backgroundColor: palette.red100 },
      containerPressed: { backgroundColor: palette.red300 },
      text: { color: palette.red800 },
    },
  },
};

export function variantColorStyle(variant: Variant, color: Color): VariantStyle {
  return VARIANT_COLOR[variant][color];
}
