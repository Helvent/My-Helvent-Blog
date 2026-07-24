"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface BioSectionProps {
  avatarUrl?: string | null;
  name: string;
  headline?: string | null;
  bio: string;
  className?: string;
}

export function BioSection({
  avatarUrl,
  name,
  headline,
  bio,
  className,
}: BioSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "glass rounded-3xl p-6 md:p-10 max-w-3xl mx-auto",
        "border-glass-border/60",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        {/* Avatar */}
        <motion.div
          className="relative shrink-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-neon-purple/30 shadow-[0_0_20px_rgba(180,74,255,0.15)]"
            />
          ) : (
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 border-2 border-glass-border flex items-center justify-center">
              <span className="text-2xl font-bold text-neon-purple">{name[0]}</span>
            </div>
          )}
        </motion.div>

        {/* Name & Headline */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-1">{name}</h2>
          {headline && (
            <p className="text-sm text-text-secondary/80">{headline}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="prose prose-invert prose-sm leading-relaxed text-text-secondary/80"
        dangerouslySetInnerHTML={{ __html: bio }}
      />
    </motion.section>
  );
}
