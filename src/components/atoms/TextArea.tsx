import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const TextAreaVariants = cva(
  "flex flex-col items-start w-full",
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
  "w-full rounded-[6px] border px-[8px] py-[10px] text-[16px] font-normal leading-[24px] text-[rgba(0,2,9,0.9)] placeholder:text-[rgba(0,2,9,0.32)] outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] field-sizing-content resize-y",
  {
    variants: {
      variant: {
        outlined: "bg-white border-[rgba(0,0,0,0.12)] visible:border-purple-600 focus-visible:ring-[3px] focus-visible:ring-purple-400/50",
        filled: "border-transparent bg-[rgba(0,0,0,0.06)] focus-visible:bg-[rgba(0,0,0,0.09)] focus-visible:ring-[3px] focus-visible:ring-purple-400/50",
      },
      hasError: {
        true: "border-[#ef476e] focus-visible:border-[#ef476e]",
      },
    },
    defaultVariants: {
      variant: "outlined",
    },
  }
)

const LabelVariants = cva(
  "font-semibold text-[14px] leading-[14px] tracking-[0px] pb-[8px]",
  {
    variants: {
      hasError: {
        true: "text-[rgba(0,2,9,0.9)]",
        false: "text-[rgba(0,2,9,0.9)]",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
)

const HelperTextVariants = cva(
  "font-normal text-[12px] leading-[20px] tracking-[0px] pt-[6px]",
  {
    variants: {
      hasError: {
        true: "text-[#ef476e]",
        false: "text-[rgba(0,2,9,0.6)]",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
)

export interface TextAreaProps
  extends React.ComponentProps<"textarea">,
    VariantProps<typeof TextAreaVariants> {
  label?: string
  variant?: "outlined" | "filled"
  helperText?: string
  error?: boolean
  required?: boolean
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      size,
      label,
      variant = "outlined",
      helperText,
      error = false,
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn(TextAreaVariants({ size }))}>
        {label && (
          <div className="flex gap-[4px] items-start">
            {required && (
              <span className="font-semibold text-[14px] leading-[14px] text-[#ef476e]">
                *
              </span>
            )}
            <label className={cn(LabelVariants({ hasError: error }))}>
              {label}
            </label>
          </div>
        )}
        <textarea
          ref={ref}
          className={cn(TextAreaInputVariants({ variant, hasError: error, className }))}
          {...props}
        />
        {helperText && (
          <div className={cn(HelperTextVariants({ hasError: error }))}>
            {helperText}
          </div>
        )}
      </div>
    )
  }
)

TextArea.displayName = "TextArea"

export { TextArea, TextAreaVariants, TextAreaInputVariants }
