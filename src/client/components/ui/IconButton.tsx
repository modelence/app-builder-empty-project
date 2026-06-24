"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "@/client/lib/utils";
import {
  CONTROL_BASE,
  variantColorClasses,
  DEFAULT_COLOR,
  type Variant,
  type Color,
} from "./_shared/variants";
import { ICON_SIZES, ICON_GLYPH, DEFAULT_SIZE, type ControlSize } from "./_shared/sizes";
import { useButtonGroup } from "./_shared/buttonGroup";
import { Spinner } from "./Spinner";

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** Style treatment. @default "ghost" */
  variant?: Variant;
  /** Intent color. @default "neutral" */
  color?: Color;
  /** @default "md" — shares the same heights as Button (sm/md/lg). */
  size?: ControlSize;
  /** Required for accessibility — icon-only buttons have no text label. */
  "aria-label": string;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
  /** Render as a different element. Replaces the old `asChild`. */
  render?: useRender.RenderProp;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant: variantProp,
      color: colorProp,
      size: sizeProp,
      loading = false,
      render,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Resolution order: explicit prop -> ButtonGroup context -> default.
    const group = useButtonGroup();
    const variant = variantProp ?? group?.variant ?? "ghost";
    const color = colorProp ?? group?.color ?? DEFAULT_COLOR;
    const size = sizeProp ?? group?.size ?? DEFAULT_SIZE;

    const classes = cn(
      CONTROL_BASE,
      ICON_SIZES[size],
      variantColorClasses(variant, color),
      className
    );

    const content = loading ? <Spinner className={ICON_GLYPH[size]} /> : children;

    return useRender({
      ref,
      defaultTagName: "button",
      render,
      props: mergeProps<"button">(
        {
          className: classes,
          type: "button",
          disabled: disabled || loading,
          "aria-busy": loading || undefined,
          children: content,
        },
        props
      ),
    });
  }
);
IconButton.displayName = "IconButton";

export { IconButton };
