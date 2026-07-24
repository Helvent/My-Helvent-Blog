import { cn } from "@/lib/utils";

interface NeonHeadingProps {
  children: React.ReactNode;
  variant?: "purple" | "cyan";
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  flicker?: boolean;
}

const glowStyles = {
  purple: {
    textShadow: `
      0 0 10px rgba(180, 74, 255, 0.5),
      0 0 20px rgba(180, 74, 255, 0.3),
      0 0 40px rgba(180, 74, 255, 0.15)
    `,
  },
  cyan: {
    textShadow: `
      0 0 10px rgba(0, 240, 255, 0.5),
      0 0 20px rgba(0, 240, 255, 0.3),
      0 0 40px rgba(0, 240, 255, 0.15)
    `,
  },
};

const variants = {
  purple: "text-neon-purple",
  cyan: "text-neon-cyan",
};

export function NeonHeading({
  children,
  variant = "purple",
  as: Tag = "h2",
  className,
  flicker = false,
}: NeonHeadingProps) {
  return (
    <Tag
      className={cn(variants[variant], flicker && "animate-glow-pulse", className)}
      style={glowStyles[variant]}
    >
      {children}
    </Tag>
  );
}