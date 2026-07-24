"use client";

import * as React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Post } from "@/types/blog";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  index?: number;
  className?: string;
}

export function PostCard({
  post,
  index = 0,
  className,
}: PostCardProps) {
  const router = useRouter();
  const delay = index * 0.08;

  const categories = post.categories?.map((pc) => pc.categories).filter(Boolean) as
    | import("@/types/blog").Category[]
    | undefined;

  const tags = post.tags?.map((pt) => pt.tags).filter(Boolean) as
    | import("@/types/blog").Tag[]
    | undefined;

  function handleClick() {
    router.push(`/blog/${post.slug}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Card
        onClick={handleClick}
        className={cn(
          "group cursor-pointer border-glass-border/60 !rounded-2xl",
          "transition-all duration-300",
          "hover:!border-neon-purple/30 hover:shadow-[0_0_30px_rgba(180,74,255,0.08)] hover:-translate-y-1",
          className
        )}
      >
        {/* Cover Image */}
        {post.cover_image && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void-dark/60 to-transparent" />
          </div>
        )}

        <CardContent className="flex flex-col gap-3 p-5 pt-4">
          {/* Title with neon glow on hover */}
          <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-neon-cyan transition-colors duration-300">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
            {categories?.slice(0, 1).map((cat) => (
              <Badge key={cat.id} variant="purple">
                {cat.name}
              </Badge>
            ))}
            {tags?.slice(0, 2).map((tag) => (
              <Badge key={tag.id} variant="cyan">
                #{tag.name}
              </Badge>
            ))}
          </div>

          {/* Date */}
          <time
            dateTime={post.published_at ?? post.created_at}
            className="text-xs text-text-secondary/70"
          >
            {formatDate(post.published_at ?? post.created_at)}
          </time>
        </CardContent>
      </Card>
    </motion.div>
  );
}
