import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "purple" | "cyan" | "default";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-neon-purple/10 text-neon-purple border-neon-purple/20",
    purple:
      "bg-neon-purple/10 text-neon-purple border-neon-purple/20",
    cyan:
      "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
