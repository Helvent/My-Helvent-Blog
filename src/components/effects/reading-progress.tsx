"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #b44aff 0%, #00f0ff 50%, #b44aff 100%)",
        boxShadow:
          "0 0 10px rgba(180, 74, 255, 0.5), 0 0 20px rgba(180, 74, 255, 0.2)",
      }}
      aria-hidden="true"
    />
  );
}