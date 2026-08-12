/**
 * Design tokens shared across the mobile UI components.
 *
 * These mirror the web design system (`src/client/components/ui/_shared`) but are
 * expressed as plain values instead of Tailwind classes, since the mobile app
 * uses React Native `StyleSheet` rather than Tailwind/NativeWind. Keep the color
 * values in sync with the web palette (default Tailwind palette) so the two
 * platforms read as one product.
 */

/** Default Tailwind palette values used by the web components. */
export const palette = {
  white: '#ffffff',
  black: '#000000',

  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue300: '#93c5fd',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  blue800: '#1e40af',

  red50: '#fef2f2',
  red100: '#fee2e2',
  red300: '#fca5a5',
  red500: '#ef4444',
  red600: '#dc2626',
  red700: '#b91c1c',
  red800: '#991b1b',

  violet500: '#8b5cf6',
} as const;

/** Semantic radii (px). */
export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
} as const;

/** Shared font sizes (px), aligned with the web `text-xs/sm/lg` scale. */
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 15,
  lg: 18,
} as const;
