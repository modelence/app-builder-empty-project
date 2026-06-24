import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/client/lib/utils";

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {}

/**
 * Small inline spinner for use inside controls (e.g. a loading Button).
 * For full-page loading use `components/LoadingSpinner` instead.
 */
const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, ...props }, ref) => (
    <Loader2
      ref={ref}
      className={cn("animate-spin", className)}
      aria-hidden="true"
      {...props}
    />
  )
);
Spinner.displayName = "Spinner";

export { Spinner };
