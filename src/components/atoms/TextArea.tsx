import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const TextAreaVariants = cva(
  "flex flex-col items-start gap-2 w-full",
  {
    variants: {
      size: {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
)

const TextAreaInputVariants = cva(
  "w-full rounded-[6px] border border-[rgba(0,0,0,0.12)] bg-transparent px-[8px] py-[10px] text-[16px] font-normal leading-[24px] text-[rgba(0,2,9,0.9)] placeholder:text-[rgba(0,2,9,0.6)] outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-purple-400/50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] field-sizing-content",
  {
    variants: {
      variant: {
        outlined: "border border-[rgba(0,0,0,0.12)] focus-visible:border-purple-600",
      },
    },
    defaultVariants: {
      variant: "outlined",
    },
  }
)

export interface TextAreaProps
  extends React.ComponentProps<"textarea">,
    VariantProps<typeof TextAreaVariants> {
  label?: string
  variant?: "outlined"
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, size, label, variant = "outlined", ...props }, ref) => {
    return (
      <div className={cn(TextAreaVariants({ size }))}>
        {label && (
          <label className="font-semibold text-[14px] font-[600] leading-[14px] text-[rgba(0,2,9,0.6)] tracking-[0px]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(TextAreaInputVariants({ variant, className }))}
          {...props}
        />
      </div>
    )
  }
)

TextArea.displayName = "TextArea"

export { TextArea, TextAreaVariants, TextAreaInputVariants }
