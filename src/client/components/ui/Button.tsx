"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "@/client/lib/utils";
import {
  CONTROL_BASE,
  variantColorClasses,
  DEFAULT_VARIANT,
  DEFAULT_COLOR,
  type Variant,
  type Color,
} from "./_shared/variants";
import { SIZES, ICON_GLYPH, DEFAULT_SIZE, type ControlSize } from "./_shared/sizes";
import { useButtonGroup } from "./_shared/buttonGroup";
import { Spinner } from "./Spinner";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** Style treatment. @default "solid" */
  variant?: Variant;
  /** Intent color. @default "neutral" */
  color?: Color;
  /** @default "md" */
  size?: ControlSize;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
  /** Icon rendered before the label (hidden while loading). */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode;
  /** Render as a different element (e.g. an anchor). Replaces the old `asChild`. */
  render?: useRender.RenderProp;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant: variantProp,
      color: colorProp,
      size: sizeProp,
      loading = false,
      leftIcon,
      rightIcon,
      render,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Resolution order: explicit prop -> ButtonGroup context -> module default.
    const group = useButtonGroup();
    const variant = variantProp ?? group?.variant ?? DEFAULT_VARIANT;
    const color = colorProp ?? group?.color ?? DEFAULT_COLOR;
    const size = sizeProp ?? group?.size ?? DEFAULT_SIZE;

    const classes = cn(
      CONTROL_BASE,
      SIZES[size],
      variantColorClasses(variant, color),
      className
    );

    const content = (
      <>
        {loading ? (
          <Spinner className={ICON_GLYPH[size]} />
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </>
    );

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
Button.displayName = "Button";

export { Button };
