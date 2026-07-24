"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      {/* Neon Ring Loader */}
      <div className="relative w-20 h-20 mb-8">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "#b44aff",
            borderRightColor: "#00f0ff",
            animation: "spin 1s linear infinite",
            boxShadow:
              "0 0 15px rgba(180, 74, 255, 0.3), 0 0 30px rgba(0, 240, 255, 0.1)",
          }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{
            borderBottomColor: "#00f0ff",
            borderLeftColor: "#b44aff",
            animation: "spin 0.8s linear infinite reverse",
          }}
        />
      </div>

      <p className="text-text-secondary text-sm animate-pulse">
        加载中...
      </p>

      </div>
  );
}