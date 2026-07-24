"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hue: number;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationId: number;
    let stars: Star[] = [];
    let lastTime = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx!.scale(dpr, dpr);
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
    }

    function createStars() {
      const count = prefersReducedMotion
        ? 30
        : Math.min(Math.floor(window.innerWidth * 0.15), 150);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: prefersReducedMotion ? 0 : Math.random() * 0.15 + 0.02,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.7
          ? 280 // purple
          : Math.random() > 0.5
            ? 190 // cyan
            : 0, // white
      }));
    }

    function draw(time: number) {
      if (!ctx || !canvas) return;
      const delta = lastTime ? time - lastTime : 16;
      lastTime = time;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const star of stars) {
        const twinkle =
          Math.sin(star.twinklePhase + time * star.twinkleSpeed) * 0.4 + 0.6;
        const alpha = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        if (star.hue === 280) {
          ctx.fillStyle = `hsla(280, 100%, 65%, ${alpha})`;
        } else if (star.hue === 190) {
          ctx.fillStyle = `hsla(190, 100%, 50%, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        }
        ctx.fill();

        // Glow for larger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle =
            star.hue === 280
              ? `hsla(280, 100%, 65%, ${alpha * 0.1})`
              : star.hue === 190
                ? `hsla(190, 100%, 50%, ${alpha * 0.1})`
                : `rgba(255, 255, 255, ${alpha * 0.05})`;
          ctx.fill();
        }

        if (!prefersReducedMotion) {
          star.y -= star.speed * (delta / 16);
          if (star.y < -5) {
            star.y = window.innerHeight + 5;
            star.x = Math.random() * window.innerWidth;
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createStars();
    animationId = requestAnimationFrame(draw);

    window.addEventListener("resize", () => {
      resize();
      createStars();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}