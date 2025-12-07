import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const ButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold text-[15px] leading-5 transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-purple-400 relative overflow-hidden",
  {
    variants: {
      variant: {
        contained: [
          "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800",
          // Inner glow effect from Figma
          "shadow-[inset_2px_0px_16px_0px_rgba(255,255,255,0.2),inset_0px_2px_16px_0px_rgba(255,255,255,0.2),inset_-2px_0px_16px_0px_rgba(255,255,255,0.2),inset_0px_-2px_16px_0px_rgba(255,255,255,0.2)]",
        ],
        outlined: [
          "border-2 border-purple-600 text-purple-600 bg-transparent hover:bg-purple-50",
        ],
        text: [
          "text-purple-600 hover:bg-purple-50",
        ],
      },
      size: {
        small: "h-9 px-4 py-2 text-sm",
        medium: "h-10 px-5 py-2.5",
        large: "h-11 px-[22px] py-3",
      },
    },
    defaultVariants: {
      variant: "contained",
      size: "large",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof ButtonVariants> {
  asChild?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    iconLeft,
    iconRight,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(ButtonVariants({ variant, size, className }))}
        {...props}
      >
        {iconLeft && (
          <span className="flex items-center justify-center w-[18px] h-5 shrink-0">
            {iconLeft}
          </span>
        )}
        {children}
        {iconRight && (
          <span className="flex items-center justify-center w-[18px] h-5 shrink-0">
            {iconRight}
          </span>
        )}
      </Comp>
    )
  }
)

Button.displayName = "PrimaryButton"

export { Button, ButtonVariants }
