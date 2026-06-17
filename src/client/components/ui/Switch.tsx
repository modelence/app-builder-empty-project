"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "@/client/lib/utils";

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof BaseSwitch.Root> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof BaseSwitch.Root>,
  SwitchProps
>(({ className, ...props }, ref) => (
  <BaseSwitch.Root
    ref={ref}
    className={cn(
      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-gray-200 outline-none transition-colors",
      "focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
      "data-[checked]:bg-black",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <BaseSwitch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[checked]:translate-x-[18px]" />
  </BaseSwitch.Root>
));
Switch.displayName = "Switch";

export { Switch };
