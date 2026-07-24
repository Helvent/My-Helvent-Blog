"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div
        className="text-8xl md:text-9xl font-bold leading-none mb-6 select-none"
        style={{
          background: "linear-gradient(135deg, #b44aff, #ff4444)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 30px rgba(180, 74, 255, 0.2))",
        }}
      >
        !
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
        出现了一些问题
      </h1>

      <p className="text-text-secondary mb-8 max-w-md">
        宇宙射线干扰了信号，页面未能正确加载。请稍后重试。
        {process.env.NODE_ENV === "development" && (
          <span className="block mt-2 text-xs text-red-400/60">
            {error.message}
          </span>
        )}
      </p>

      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-full glass-hover text-text-primary font-medium transition-all duration-300 hover:neon-glow-purple"
      >
        重新尝试
      </button>
    </div>
  );
}