"use client";

import * as React from "react";
import { X } from "lucide-react";
import type { Category, Tag } from "@/types/blog";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface FilterChipsProps {
  categories: Category[];
  tags: Tag[];
  selectedCategory: string | null;
  selectedTag: string | null;
  onCategoryChange: (slug: string | null) => void;
  onTagChange: (slug: string | null) => void;
}

export function FilterChips({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange,
}: FilterChipsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-xs font-medium text-text-secondary shrink-0">分类</span>
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
              selectedCategory === null
                ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/30 shadow-[0_0_12px_rgba(180,74,255,0.2)]"
                : "text-text-secondary/60 hover:text-text-primary hover:bg-white/5"
            )}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                onCategoryChange(selectedCategory === cat.slug ? null : cat.slug)
              }
              className={cn(
                "shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                selectedCategory === cat.slug
                  ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/30 shadow-[0_0_12px_rgba(180,74,255,0.2)]"
                  : "text-text-secondary/60 hover:text-text-primary hover:bg-white/5"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-text-secondary shrink-0">标签</span>
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTag === tag.slug ? "purple" : "cyan"}
              className={cn(
                "cursor-pointer transition-all duration-200",
                selectedTag === tag.slug &&
                  "shadow-[0_0_10px_rgba(180,74,255,0.25)]",
                "hover:bg-neon-purple/15 hover:text-neon-purple hover:border-neon-purple/30"
              )}
              onClick={() =>
                onTagChange(selectedTag === tag.slug ? null : tag.slug)
              }
            >
              #{tag.name}
              {selectedTag === tag.slug && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}


