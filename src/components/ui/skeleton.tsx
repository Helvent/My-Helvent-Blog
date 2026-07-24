import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/[0.04]",
        "relative overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        style={{
          animation: "shimmer 2s infinite",
        }}
      />
    </div>
  );
}
