import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/client/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(
          // Base classes
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          // Variant classes
          {
            "bg-black text-white shadow hover:bg-gray-800": variant === "default",
            "bg-red-600 text-white shadow-sm hover:bg-red-700": variant === "destructive",
            "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900": variant === "outline",
            "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200": variant === "secondary",
            "hover:bg-gray-100 hover:text-gray-900": variant === "ghost",
            "text-gray-900 underline-offset-4 hover:underline": variant === "link",
          },
          // Size classes
          {
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-8": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
