import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl font-medium transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/50",
    "disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "glass hover:border-neon-purple/30 hover:shadow-[0_0_20px_rgba(180,74,255,0.1)] text-text-primary",
        ghost: "hover:bg-white/5 hover:text-neon-cyan rounded-lg",
        outline: "border border-glass-border bg-transparent hover:border-neon-purple/40 hover:bg-white/[0.03] text-text-secondary hover:text-text-primary",
        neon: "bg-gradient-to-r from-neon-purple to-neon-cyan text-void-dark hover:shadow-neon-glow-purple font-semibold text-void-dark",
        destructive: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "variant" | "size">, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileTap={{ scale: 0.96 }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion/v12 typing compatibility
        {...(props as any)}
      />
    );
  }
);
Button.displayName = "Button";
