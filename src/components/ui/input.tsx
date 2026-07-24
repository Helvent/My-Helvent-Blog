import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          [
            "flex h-10 w-full rounded-xl border bg-glass-bg/60 backdrop-blur-md",
            "px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary",
            "border-glass-border focus:border-neon-purple/50 focus:outline-none focus:ring-2 focus:ring-neon-purple/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
          ]
            .filter(Boolean)
            .join(" ")
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
