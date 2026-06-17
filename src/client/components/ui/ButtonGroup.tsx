"use client";

import * as React from "react";
import { cn } from "@/client/lib/utils";
import { ButtonGroupContext } from "./_shared/buttonGroup";
import type { Variant, Color } from "./_shared/variants";
import type { ControlSize } from "./_shared/sizes";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Shared size applied to child Button/IconButton (each child can override). */
  size?: ControlSize;
  /** Shared variant applied to children (each child can override). */
  variant?: Variant;
  /** Shared color applied to children (each child can override). */
  color?: Color;
}

/**
 * Joins controls into a connected segmented unit: inner radii are collapsed and
 * borders overlap so the children read as one control. Holds Button / IconButton
 * and also form controls — Input, Textarea, Select trigger — alongside them
 * (their shared `sm/md/lg` heights keep everything aligned). Matches shadcn's
 * `ButtonGroup`, named for the primary action-button use case.
 *
 * Propagates size/variant/color to child Button/IconButton via context
 * (a child's own explicit prop always wins).
 */
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    { className, orientation = "horizontal", size, variant, color, children, ...props },
    ref
  ) => {
    const contextValue = React.useMemo(
      () => ({ size, variant, color }),
      [size, variant, color]
    );

    return (
      <ButtonGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          data-orientation={orientation}
          className={cn(
            "inline-flex",
            orientation === "horizontal" ? "flex-row" : "flex-col",
            // Collapse adjacent borders by overlapping them.
            orientation === "horizontal"
              ? "[&>*:not(:first-child)]:-ml-px"
              : "[&>*:not(:first-child)]:-mt-px",
            // Flatten the inner corners so the group reads as one control.
            orientation === "horizontal"
              ? "[&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none"
              : "[&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none",
            // Raise the hovered/focused item so its full border/ring shows above
            // neighbors. focus-within covers inputs (ring is on the wrapper).
            "[&>*]:relative [&>*:hover]:z-10 [&>*:focus-visible]:z-10 [&>*:focus-within]:z-10",
            // Let inputs flex to fill the group (buttons keep their intrinsic size).
            "[&>input]:flex-1",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ButtonGroupContext.Provider>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
