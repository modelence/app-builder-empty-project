export type Variant = "solid" | "outline" | "ghost" | "link" | "soft";
export type Color = "neutral" | "primary" | "destructive";

export const DEFAULT_VARIANT: Variant = "solid";
export const DEFAULT_COLOR: Color = "neutral";

/**
 * Base classes shared by Button and IconButton.
 * Ring width/offset live here; ring *color* lives per variant×color cell below
 * so tailwind-merge resolves to a single ring color.
 */
export const CONTROL_BASE =
  "inline-flex items-center justify-center whitespace-nowrap font-medium cursor-pointer " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0";

/**
 * variant (style treatment) × color (intent) → Tailwind classes.
 * `solid` + `neutral` is the default black button.
 * Uses the default Tailwind palette — edit freely per project.
 */
export const VARIANT_COLOR: Record<Variant, Record<Color, string>> = {
  solid: {
    neutral:
      "bg-black text-white shadow hover:bg-gray-800 active:bg-gray-900 focus-visible:ring-gray-500",
    primary:
      "bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500",
    destructive:
      "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500",
  },
  outline: {
    neutral:
      "border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-500",
    primary:
      "border border-blue-300 bg-white text-blue-700 shadow-sm hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-blue-500",
    destructive:
      "border border-red-300 bg-white text-red-700 shadow-sm hover:bg-red-50 active:bg-red-100 focus-visible:ring-red-500",
  },
  ghost: {
    neutral:
      "text-gray-900 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-500",
    primary:
      "text-blue-700 hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-blue-500",
    destructive:
      "text-red-700 hover:bg-red-50 active:bg-red-100 focus-visible:ring-red-500",
  },
  link: {
    neutral:
      "text-gray-900 underline-offset-4 hover:underline focus-visible:ring-gray-500",
    primary:
      "text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500",
    destructive:
      "text-red-600 underline-offset-4 hover:underline focus-visible:ring-red-500",
  },
  soft: {
    neutral:
      "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-500",
    primary:
      "bg-blue-100 text-blue-800 shadow-sm hover:bg-blue-200 active:bg-blue-300 focus-visible:ring-blue-500",
    destructive:
      "bg-red-100 text-red-800 shadow-sm hover:bg-red-200 active:bg-red-300 focus-visible:ring-red-500",
  },
};

export function variantColorClasses(variant: Variant, color: Color): string {
  return VARIANT_COLOR[variant][color];
}
