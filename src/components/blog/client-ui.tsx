"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "搜索文章...",
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    startTransition(() => {
      router.replace(`/blog?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-12 pr-12 glass"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            const params = new URLSearchParams(window.location.search);
            params.delete("q");
            params.set("page", "1");
            startTransition(() => {
              router.replace(`/blog?${params.toString()}`);
            });
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="清除搜索"
        >
          <X size={16} />
        </button>
      )}
      {isPending && (
        <span className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
      )}
    </form>
  );
}

interface FilterChipGroupProps {
  items: { label: string; value: string }[];
  selected: string;
  paramKey: "category" | "tag";
  title: string;
}

export function FilterChips({ items, selected, paramKey, title }: FilterChipGroupProps) {
  const router = useRouter();

  function handleSelect(value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }
    params.set("page", "1");
    router.replace(`/blog?${params.toString()}`);
  }

  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-text-secondary uppercase tracking-wider">{title}</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleSelect("")}
          className={cn(
            "px-3 py-1 rounded-full text-sm transition-colors border",
            !selected
              ? "bg-neon-purple/20 border-neon-purple/40 text-neon-purple"
              : "glass text-text-secondary border-glass-border hover:text-text-primary hover:border-neon-purple/30"
          )}
        >
          全部
        </button>
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => handleSelect(item.value)}
            className={cn(
              "px-3 py-1 rounded-full text-sm transition-colors border",
              selected === item.value
                ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan"
                : "glass text-text-secondary border-glass-border hover:text-text-primary hover:border-neon-cyan/30"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-10">
      {currentPage > 1 && (
        <a
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="px-4 py-2 glass rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-neon-purple/30 transition-colors"
        >
          &larr; 上一页
        </a>
      )}
      <div className="flex gap-1">
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-text-secondary">
              …
            </span>
          ) : (
            <a
              key={page}
              href={`${baseUrl}?page=${page}`}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-colors",
                page === currentPage
                  ? "bg-neon-purple/20 border border-neon-purple/40 text-neon-purple"
                  : "glass text-text-secondary hover:text-text-primary hover:border-neon-purple/30"
              )}
            >
              {page}
            </a>
          )
        )}
      </div>
      {currentPage < totalPages && (
        <a
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="px-4 py-2 glass rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-neon-cyan/30 transition-colors"
        >
          下一页 &rarr;
        </a>
      )}
    </nav>
  );
}
