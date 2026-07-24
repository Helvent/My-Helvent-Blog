"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

export interface TimelineSkill {
  year: string;
  title: string;
  description: string;
  technologies?: string[];
}

interface SkillsTimelineProps {
  skills: TimelineSkill[];
  direction?: "vertical" | "horizontal";
  className?: string;
}

export function SkillsTimeline({
  skills,
  direction = "vertical",
  className,
}: SkillsTimelineProps) {
  if (skills.length === 0) return null;

  return (
    <section className={cn("relative", className)}>
      {/* Connector line */}
      <div
        className={cn(
          "absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple via-neon-cyan to-transparent",
          direction === "horizontal" && "left-0 right-0 top-4 md:top-1/2 h-px bg-gradient-to-r from-neon-purple via-neon-cyan to-transparent"
        )}
      />

      <div
        className={cn(
          "flex flex-col gap-6",
          direction === "horizontal" && "flex-row overflow-x-auto pb-4 gap-6"
        )}
      >
        {skills.map((skill, index) => (
          <TimelineItem key={`${skill.title}-${index}`} skill={skill} index={index} direction={direction} />
        ))}
      </div>
    </section>
  );
}

function TimelineItem({
  skill,
  index,
  direction,
}: {
  skill: TimelineSkill;
  index: number;
  direction: "vertical" | "horizontal";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "vertical" ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative pl-12 md:pl-0 md:w-1/2",
        direction === "vertical" && "md:[&:nth-child(odd)]:pr-12 md:[&:nth-child(odd)]:text-right md:[&:nth-child(even)]:ml-auto md:[&:nth-child(even)]:pl-12"
      )}
    >
      {/* Dot on the timeline */}
      <div
        className={cn(
          "absolute left-3 md:left-auto top-5 w-2.5 h-2.5 rounded-full",
          "bg-neon-purple shadow-[0_0_10px_rgba(180,74,255,0.5)]",
          direction === "horizontal" && "top-3 left-0"
        )}
      />

      <Card className="!rounded-xl !p-4 !border-glass-border/60 hover:!border-neon-purple/20 hover:!shadow-[0_0_15px_rgba(180,74,255,0.06)] transition-all duration-300">
        <div className="text-xs font-mono text-neon-cyan/80 mb-1">{skill.year}</div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">{skill.title}</h3>
        <p className="text-xs text-text-secondary/70 leading-relaxed mb-3">{skill.description}</p>
        {skill.technologies && skill.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skill.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple/80 border border-neon-purple/15"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
