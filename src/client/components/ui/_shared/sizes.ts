export type ControlSize = "sm" | "md" | "lg";

export const DEFAULT_SIZE: ControlSize = "md";

/**
 * Size classes for text controls: Button, Input, Textarea, Select trigger.
 *
 * Keep the `h-*` value in sync with `ICON_SIZES` below — a control of a given
 * size must have the same height across every component, so an `sm` Button
 * lines up with an `sm` Input and an `sm` IconButton.
 *
 * Edit these strings freely per project (e.g. change padding, radius, text).
 */
export const SIZES: Record<ControlSize, string> = {
  sm: "h-8 gap-1.5 rounded-md px-3 text-xs",
  md: "h-9 gap-2 rounded-md px-4 text-sm",
  lg: "h-10 gap-2 rounded-md px-6 text-sm",
};

/**
 * Size classes for square, icon-only controls: IconButton.
 * Same height as `SIZES` (keep `h-*` in sync) but square (`w == h`) and no padding.
 */
export const ICON_SIZES: Record<ControlSize, string> = {
  sm: "h-8 w-8 rounded-md",
  md: "h-9 w-9 rounded-md",
  lg: "h-10 w-10 rounded-md",
};

/** Inline icon / spinner glyph sizing (lucide) per control size. */
export const ICON_GLYPH: Record<ControlSize, string> = {
  sm: "size-4",
  md: "size-4",
  lg: "size-5",
};
