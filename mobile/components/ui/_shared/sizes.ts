import type { TextStyle, ViewStyle } from 'react-native';
import { radius, fontSize } from './tokens';

/** Mirrors the web `ControlSize` union. */
export type ControlSize = 'sm' | 'md' | 'lg';

export const DEFAULT_SIZE: ControlSize = 'md';

/**
 * Height / padding / text sizing for text controls: Button, Input, Textarea,
 * Select trigger. Heights are kept in sync with `ICON_SIZES` so an `sm` Button
 * lines up with an `sm` Input and an `sm` IconButton — the same contract as the
 * web `SIZES` map.
 */
export const SIZES: Record<ControlSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { height: 32, paddingHorizontal: 12, borderRadius: radius.md, columnGap: 6 },
    text: { fontSize: fontSize.xs },
  },
  md: {
    container: { height: 36, paddingHorizontal: 16, borderRadius: radius.md, columnGap: 8 },
    text: { fontSize: fontSize.sm },
  },
  lg: {
    container: { height: 40, paddingHorizontal: 24, borderRadius: radius.md, columnGap: 8 },
    text: { fontSize: fontSize.sm },
  },
};

/** Square, icon-only control sizing (IconButton). Same heights as `SIZES`. */
export const ICON_SIZES: Record<ControlSize, ViewStyle> = {
  sm: { height: 32, width: 32, borderRadius: radius.md },
  md: { height: 36, width: 36, borderRadius: radius.md },
  lg: { height: 40, width: 40, borderRadius: radius.md },
};

/** Inline icon / spinner glyph pixel size per control size (lucide `size` prop). */
export const ICON_GLYPH: Record<ControlSize, number> = {
  sm: 16,
  md: 16,
  lg: 20,
};
