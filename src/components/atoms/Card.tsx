import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "backdrop-blur-xl backdrop-filter rounded-[24px]",
          "bg-white/40",
          "shadow-[0px_6px_12px_-6px_rgba(157,94,185,0.2),0px_8px_24px_-4px_rgba(157,94,185,0.16)]",
          "border border-white border-opacity-25",
          // Inner glow effect (glossy effect)
          "shadow-[inset_-1px_-1px_1px_0px_rgba(255,255,255,1),inset_1px_1px_1px_0px_rgba(255,255,255,1),inset_-4px_-4px_16px_0px_rgba(255,255,255,0.4),inset_4px_4px_16px_0px_rgba(0,0,0,0.06)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export { Card }
