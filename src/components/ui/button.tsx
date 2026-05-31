import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phantom-purple disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-phantom-purple text-phantom-dark hover:bg-phantom-purple/90 hover:scale-[1.02] active:scale-[0.98] rounded-[32px] px-8 py-4 text-base",
        secondary:
          "bg-phantom-cream text-phantom-dark hover:bg-white hover:scale-[1.02] active:scale-[0.98] rounded-[32px] px-8 py-4 text-base",
        outline:
          "border border-phantom-dark/20 bg-transparent text-phantom-dark hover:bg-phantom-lavender/50 rounded-[32px] px-8 py-4 text-base",
        ghost:
          "text-phantom-dark hover:bg-phantom-lavender/50 rounded-[32px] px-6 py-3 text-base",
        dark:
          "bg-phantom-dark text-phantom-cream hover:bg-phantom-dark/90 hover:scale-[1.02] rounded-[32px] px-8 py-4 text-base",
      },
      size: {
        default: "h-auto",
        sm: "px-4 py-2 text-sm rounded-[24px]",
        lg: "px-10 py-5 text-lg rounded-[32px]",
        icon: "h-12 w-12 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
