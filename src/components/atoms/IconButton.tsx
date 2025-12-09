import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const IconButtonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
  {
    variants: {
      variant: {
        outline: "border border-purple-600/50 text-purple-600 hover:bg-purple-50 rounded-full",
        ghost: "text-neutral-600 hover:bg-neutral-100 rounded-lg",
      },
      size: {
        small: "w-8 h-8",
        medium: "w-10 h-10",
        large: "w-12 h-12",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "small",
    },
  }
);

export interface IconButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof IconButtonVariants> {
  asChild?: boolean;
  icon: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(IconButtonVariants({ variant, size, className }))}
        {...props}
      >
        {icon}
      </Comp>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton, IconButtonVariants };
