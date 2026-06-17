"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/client/lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root> {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof BaseCheckbox.Root>,
  CheckboxProps
>(({ className, indeterminate, ...props }, ref) => (
  <BaseCheckbox.Root
    ref={ref}
    indeterminate={indeterminate}
    className={cn(
      "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white text-white shadow-sm outline-none transition-colors",
      "focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
      "data-[checked]:border-black data-[checked]:bg-black",
      "data-[indeterminate]:border-black data-[indeterminate]:bg-black",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <BaseCheckbox.Indicator className="flex items-center justify-center text-current data-[unchecked]:hidden">
      {indeterminate ? (
        <Minus className="size-3" aria-hidden="true" />
      ) : (
        <Check className="size-3" aria-hidden="true" />
      )}
    </BaseCheckbox.Indicator>
  </BaseCheckbox.Root>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
