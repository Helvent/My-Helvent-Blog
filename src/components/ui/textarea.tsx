import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          [
            "flex min-h-[120px] w-full rounded-xl border bg-glass-bg/60 backdrop-blur-md",
            "px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary",
            "border-glass-border focus:border-neon-purple/50 focus:outline-none focus:ring-2 focus:ring-neon-purple/20",
            "resize-y disabled:cursor-not-allowed disabled:opacity-50",
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
Textarea.displayName = "Textarea";
