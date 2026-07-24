import Link from "next/link";
import { NeonHeading } from "@/components/effects/neon-heading";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { PostCard } from "@/components/blog/post-card";
import { PostHero } from "@/components/blog/post-hero";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types/blog";
import { BLOG } from "@/lib/constants";
import {
  BookOpen, Sparkles, Database, Palette, Rocket,
} from "lucide-react";

/* ───────── Supabase fetchers ───────── */

async function getFeaturedPost(): Promise<Post[] | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*, author:profiles(full_name), categories:post_categories(category_id, categories:categories(*)), tags:post_tags(tag_id, tags:tags(*))")
      .eq("featured", true)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(BLOG.featuredLimit);
    return data as unknown as Post[] ?? null;
  } catch {
    return null;
  }
}

async function getLatestPosts(): Promise<Post[] | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*, author:profiles(full_name), categories:post_categories(category_id, categories:categories(*)), tags:post_tags(tag_id, tags:tags(*))")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3);
    return data as unknown as Post[] ?? null;
  } catch {
    return null;
  }
}

/* ───────── Sample data (Supabase fallback) ───────── */

const SAMPLE_POSTS: Post[] = [
  {
    id: "sample-1",
    title: "Next.js 16 App Router 完全指南：从入门到生产部署",
    slug: "nextjs-16-app-router-guide",
    excerpt: "深入探讨 Next.js 16 App Router 的核心概念，包括服务端组件、流式渲染和数据获取的最佳实践。",
    body_markdown: "# Next.js 16 App Router\n\n## 简介\n\nNext.js 16 带来了全新的 App Router 体验...",
    cover_image: "/images/cover-nextjs.svg",
    status: "published",
    featured: false,
    published_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    author_id: null,
    meta_title: null,
    meta_description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    author: { id: "1", email: "test@test.com", full_name: "Helvent", headline: null, bio: null, avatar_url: null, created_at: new Date().toISOString() },
    categories: [{ category_id: "1", categories: { id: "1", name: "前端开发", slug: "frontend", description: null, sort_order: 1 } }],
    tags: [{ tag_id: "1", tags: { id: "1", name: "Next.js", slug: "nextjs" } }],
  },
  {
    id: "sample-2",
    title: "构建现代化的 UI 设计系统：从 Token 到组件",
    slug: "design-system-tokens-to-components",
    excerpt: "从零开始构建一个完整的设计系统，涵盖色彩 Token、排版比例、间距网格到可复用组件库。",
    body_markdown: "# 设计系统\n\n## 色彩 Token\n\n设计系统的核心是...",
    cover_image: "/images/cover-design.svg",
    status: "published",
    featured: false,
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    author_id: null,
    meta_title: null,
    meta_description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    author: { id: "1", email: "test@test.com", full_name: "Helvent", headline: null, bio: null, avatar_url: null, created_at: new Date().toISOString() },
    categories: [{ category_id: "2", categories: { id: "2", name: "设计美学", slug: "design", description: null, sort_order: 2 } }],
    tags: [{ tag_id: "2", tags: { id: "2", name: "UI/UX", slug: "ui-ux" } }],
  },
  {
    id: "sample-3",
    title: "Supabase 全栈开发：从零搭建博客后端",
    slug: "supabase-blog-backend",
    excerpt: "使用 Supabase + Next.js 搭建全栈博客，涵盖数据库设计、Row Level Security 和 API 层实现。",
    body_markdown: "# Supabase 全栈\n\n## 数据库设计\n\nBlog 项目需要以下几个表...",
    cover_image: "/images/cover-supabase.svg",
    status: "published",
    featured: false,
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    author_id: null,
    meta_title: null,
    meta_description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    author: { id: "1", email: "test@test.com", full_name: "Helvent", headline: null, bio: null, avatar_url: null, created_at: new Date().toISOString() },
    categories: [{ category_id: "3", categories: { id: "3", name: "全栈架构", slug: "fullstack", description: null, sort_order: 3 } }],
    tags: [{ tag_id: "3", tags: { id: "3", name: "Supabase", slug: "supabase" } }],
  },
];

/* ───────── Tech Stack Data ───────── */

const TECH_STACK = [
  {
    icon: BookOpen,
    name: "Next.js 16",
    description: "React 全栈框架，App Router 与服务端组件的完美结合",
  },
  {
    icon: Sparkles,
    name: "React 19",
    description: "声明式 UI 库，Server Components & Actions 驱动新一代前端开发",
  },
  {
    icon: Database,
    name: "Supabase",
    description: "开源 Firebase 替代方案，PostgreSQL + Auth + Realtime 一站式服务",
  },
  {
    icon: Palette,
    name: "Tailwind CSS v4",
    description: "原子化 CSS 框架，Rust 引擎加速，全新设计系统语法",
  },
  {
    icon: Rocket,
    name: "Motion v12",
    description: "声明式动画库，GPU 合成高性能交互效果",
  },
];

/* ───────── Homepage ───────── */

export default async function HomePage() {
  const [featuredPosts, latestPosts] = await Promise.all([
    getFeaturedPost(),
    getLatestPosts(),
  ]);

  const featured = featuredPosts?.length ? featuredPosts : [];
  const latest = latestPosts?.length ? latestPosts : SAMPLE_POSTS;

  return (
    <>
      {/* ───── Hero Section ───── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.07]"
            style={{
              background: "radial-gradient(circle, rgba(180,74,255,0.8) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.06]"
            style={{
              background: "radial-gradient(circle, rgba(0,240,255,0.7) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center py-32">
          <ScrollReveal direction="up" delay={0}>
            <NeonHeading variant="cyan" as="h1" className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Helvent.赫尔文特
            </NeonHeading>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.15}>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up">
              探索科技与艺术的无限可能
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full glass text-neon-cyan font-medium border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300 neon-glow-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]"
            >
              浏览文章
              <Rocket size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ───── Featured Post ───── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 space-y-8">
          <ScrollReveal>
            <NeonHeading variant="purple">精选文章</NeonHeading>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            {featured.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featured.map((post) => (
                  <PostHero key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 text-center text-text-secondary">
                <p className="text-lg">暂无精选文章</p>
                <p className="text-sm mt-2">待配置 Supabase 数据库后显示</p>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* ───── Latest Posts ───── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 space-y-8">
          <ScrollReveal>
            <NeonHeading variant="cyan">最新文章</NeonHeading>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            {latest.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">还没有文章，等待内容填充 ✨</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latest.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex justify-end">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-neon-purple hover:text-neon-cyan transition-colors text-sm font-medium group"
              >
                查看全部
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ───── Tech Stack Showcase ───── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 space-y-10">
          <ScrollReveal>
            <NeonHeading variant="purple">技术栈</NeonHeading>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {TECH_STACK.map((tech, i) => (
              <ScrollReveal key={tech.name} delay={0.08 * i} direction="up" distance={20}>
                <div className="group glass rounded-2xl p-6 h-full flex flex-col items-center text-center hover:border-neon-cyan/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)]">
                  <div className="w-14 h-14 rounded-xl bg-neon-cyan/10 flex items-center justify-center mb-4 group-hover:bg-neon-cyan/20 transition-colors">
                    <tech.icon size={24} className="text-neon-cyan" />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">{tech.name}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{tech.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
