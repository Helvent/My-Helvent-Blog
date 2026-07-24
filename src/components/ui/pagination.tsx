"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 7,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = React.useMemo(() => {
    const delta = Math.floor(maxVisible / 2);
    const range: (number | string)[] = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    // Deduplicate dots
    const deduped: (number | string)[] = [];
    let last: string | number | undefined;
    for (const p of range) {
      if (p !== last) deduped.push(p);
      last = p;
    }

    // Remove leading/trailing dots
    if (deduped[0] === "...") deduped.shift();
    if (deduped[deduped.length - 1] === "...") deduped.pop();

    return deduped;
  }, [currentPage, totalPages, maxVisible]);

  return (
    <nav
      className={cn(
        "flex items-center justify-center gap-1.5",
        className
      )}
      aria-label="分页导航"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="第一页"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="上一页"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-text-secondary select-none"
              >
                …
              </span>
            );
          }

          const p = page as number;
          const isActive = p === currentPage;

          return (
            <motion.button
              key={p}
              onClick={() => onPageChange(p)}
              whileTap={{ scale: 0.92 }}
              className={cn(
                "min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/30"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {p}
            </motion.button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="下一页"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="最后一页"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
