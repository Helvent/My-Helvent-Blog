"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import type { Post } from "@/types/blog";
import { Badge } from "../ui/badge";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PostHeroProps {
  post: Post;
  className?: string;
}

export function PostHero({ post, className }: PostHeroProps) {
  const categories = post.categories?.map((pc) => pc.categories).filter(Boolean) as
    | import("@/types/blog").Category[]
    | undefined;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-3xl glass glass-hover",
        "transition-all duration-500",
        className
      )}
    >
      {/* Gradient overlay on top */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/[0.06] via-transparent to-neon-cyan/[0.04] pointer-events-none" />

      <Link href={`/blog/${post.slug}`} className="block relative z-10">
        {/* Cover image area */}
        {post.cover_image && (
          <div className="relative aspect-[21/9] overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void-dark via-void-dark/40 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className={cn("p-6 md:p-8 lg:p-10", !post.cover_image && "py-8 md:py-10")}>
          {/* Category */}
          {categories?.length && (
            <div className="mb-3 flex gap-2">
              {categories.slice(0, 2).map((cat) => (
                <Badge key={cat.id} variant="purple">
                  {cat.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Title with gradient hover */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight mb-3 group-hover:text-gradient transition-all duration-300">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-base text-text-secondary/90 leading-relaxed max-w-2xl line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Date & meta */}
          <div className="mt-4 flex items-center gap-3 text-sm text-text-secondary/70">
            <time dateTime={post.published_at ?? post.created_at}>
              {formatDate(post.published_at ?? post.created_at)}
            </time>
            {post.author && (
              <>
                <span className="w-1 h-1 rounded-full bg-text-secondary/40" />
                <span>{post.author.full_name ?? post.author.email}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
