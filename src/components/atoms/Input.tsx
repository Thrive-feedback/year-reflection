import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const InputVariants = cva(
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

const InputFieldVariants = cva(
  "w-full rounded-[6px] border bg-white px-[8px] min-h-[40px] text-[16px] font-normal leading-[24px] text-[rgba(0,2,9,0.9)] placeholder:text-[rgba(0,2,9,0.32)] outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        outlined: "border-[rgba(0,0,0,0.12)] focus-visible:border-purple-600 focus-visible:ring-[3px] focus-visible:ring-purple-400/50",
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

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof InputVariants> {
  label?: string
  variant?: "outlined" | "filled"
  helperText?: string
  error?: boolean
  required?: boolean
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      label,
      variant = "outlined",
      helperText,
      error = false,
      required = false,
      startAdornment,
      endAdornment,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn(InputVariants({ size }))}>
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
        <div className="relative w-full">
          {startAdornment && (
            <div className="absolute left-[8px] top-1/2 -translate-y-1/2 flex items-center justify-center text-[rgba(0,0,0,0.32)]">
              {startAdornment}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              InputFieldVariants({ variant, hasError: error, className }),
              startAdornment && "pl-[40px]",
              endAdornment && "pr-[40px]"
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute right-[8px] top-1/2 -translate-y-1/2 flex items-center justify-center text-[rgba(0,0,0,0.32)]">
              {endAdornment}
            </div>
          )}
        </div>
        {helperText && (
          <div className={cn(HelperTextVariants({ hasError: error }))}>
            {helperText}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input, InputVariants, InputFieldVariants }
