"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    const elements = document.querySelectorAll("h2[id], h3[id], h4[id]");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block sticky top-24 w-56 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="text-xs text-text-secondary uppercase tracking-wider mb-3">目录</p>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
          }}
          className={cn(
            "block text-sm py-1 truncate transition-colors border-l-2",
            activeId === h.id
              ? "text-neon-cyan border-neon-cyan"
              : "text-text-secondary border-transparent hover:text-text-primary hover:border-glass-border"
          )}
          style={{ paddingLeft: `${(h.level - 2) * 12 + 8}px` }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
