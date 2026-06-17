import * as React from "react";

import { cn } from "@/client/lib/utils";
import type { Color } from "./_shared/variants";

export type BadgeVariant = "solid" | "soft" | "outline";

/** Static (non-interactive) variant×color classes for badges. */
const BADGE_CLASSES: Record<BadgeVariant, Record<Color, string>> = {
  solid: {
    neutral: "bg-black text-white",
    primary: "bg-blue-600 text-white",
    destructive: "bg-red-600 text-white",
  },
  soft: {
    neutral: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800",
  },
  outline: {
    neutral: "border border-gray-300 text-gray-900",
    primary: "border border-blue-300 text-blue-700",
    destructive: "border border-red-300 text-red-700",
  },
};

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** @default "soft" */
  variant?: BadgeVariant;
  /** @default "neutral" */
  color?: Color;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "soft", color = "neutral", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        BADGE_CLASSES[variant][color],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
