import * as React from "react";

import { cn } from "@/client/lib/utils";
import { SIZES, DEFAULT_SIZE, type ControlSize } from "./_shared/sizes";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** @default "md" — shares heights with Button/Select so controls line up. */
  size?: ControlSize;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size = DEFAULT_SIZE, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full border border-gray-300 bg-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          SIZES[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
