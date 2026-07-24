"use client";

import { useEffect, useState } from "react";

export function AmbientBlobs() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      <div
        className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.08]"
        style={{
          background:
            "radial-gradient(circle, rgba(180, 74, 255, 0.6) 0%, transparent 70%)",
          animation: prefersReducedMotion
            ? "none"
            : "float 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 240, 255, 0.5) 0%, transparent 70%)",
          animation: prefersReducedMotion
            ? "none"
            : "float 10s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(circle, rgba(180, 74, 255, 0.4) 0%, transparent 70%)",
          animation: prefersReducedMotion
            ? "none"
            : "float 12s ease-in-out infinite 2s",
        }}
      />
    </div>
  );
}