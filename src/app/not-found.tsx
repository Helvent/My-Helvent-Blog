import Link from "next/link";
import { StarField } from "@/components/effects/star-field";

export default function NotFound() {
  return (
    <>
      <StarField />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div
          className="text-[12rem] md:text-[16rem] font-bold leading-none select-none"
          style={{
            background: "linear-gradient(135deg, #b44aff, #00f0ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 40px rgba(180, 74, 255, 0.3))",
            animation: "float 6s ease-in-out infinite",
          }}
        >
          404
        </div>

        <p
          className="text-xl md:text-2xl text-text-secondary mt-8 mb-2"
          style={{ animation: "fade-in-up 0.6s ease-out 0.3s both" }}
        >
          你在虚空中迷航了
        </p>

        <p
          className="text-sm text-text-secondary/50 mb-12 max-w-md"
          style={{ animation: "fade-in-up 0.6s ease-out 0.5s both" }}
        >
          星辰在闪烁，但页面已消失在宇宙深处
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full glass-hover text-text-primary font-medium transition-all duration-300"
          style={{ animation: "fade-in-up 0.6s ease-out 0.7s both" }}
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* Decorative stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 3 === 0 ? "#b44aff" : i % 3 === 1 ? "#00f0ff" : "#fff",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.3,
                animation: `star-twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}