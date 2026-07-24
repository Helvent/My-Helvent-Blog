import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NeonHeading } from "@/components/effects/neon-heading";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { PostContent } from "@/components/blog/post-content";
import { CommentSection } from "@/components/blog/comment-section";
import { ShareSection } from "@/components/blog/share-section";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { createClient } from "@/lib/supabase/server";
import { slugify, truncate } from "@/lib/utils";
import { BLOG, SITE } from "@/lib/constants";
import type { Post, Category, Tag as TagType } from "@/types/blog";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";

/* ───────── helpers ───────── */

async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*, author:profiles(full_name, avatar_url, bio), categories:post_categories(category_id, categories:categories(*)), tags:post_tags(tag_id, tags:tags(*))")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    return (data as unknown as Post) ?? null;
  } catch {
    return null;
  }
}

async function getRelatedPosts(postId: string, categorySlug?: string): Promise<Post[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("posts")
      .select("*, author:profiles(full_name), categories:post_categories(category_id, categories:categories(*)), tags:post_tags(tag_id, tags:tags(*))")
      .neq("id", postId)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(BLOG.relatedLimit);

    if (categorySlug) {
      const { data: catIds } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug);
      if (catIds?.length) {
        const { data: pcData } = await supabase
          .from("post_categories")
          .select("post_id")
          .in("category_id", catIds.map((c) => c.id));
        const ids = pcData?.map((p) => p.post_id).filter((id) => id !== postId);
        if (ids?.length) {
          const { data } = await supabase
            .from("posts")
            .select("*, author:profiles(full_name), categories:post_categories(category_id, categories:categories(*)), tags:post_tags(tag_id, tags:tags(*))")
            .in("id", ids)
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(BLOG.relatedLimit);
          return (data as unknown as Post[]) || [];
        }
      }
    }

    const { data } = await query;
    return (data as unknown as Post[]) || [];
  } catch {
    return [];
  }
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(markdown: string): HeadingItem[] {
  const lines = markdown.split("\n");
  const headings: HeadingItem[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      headings.push({
        id: slugify(match[2].trim()),
        text: match[2].trim(),
        level: match[1].length,
      });
    }
  }
  return headings;
}

/* ───────── Metadata ───────── */

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "文章不存在" };

  return {
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? truncate(post.excerpt || "", 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      publishedTime: post.published_at ?? new Date().toISOString(),
      ...(post.cover_image ? { images: [post.cover_image] } : {}),
    },
  };
}

/* ───────── PostDetail Page ───────── */

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(post.id, post.categories?.[0]?.categories?.slug);
  const headings = extractHeadings(post.body_markdown);
  const mainCategory = post.categories?.[0]?.categories;
  const readingTime = Math.max(1, Math.ceil(post.body_markdown.split(/\s+/).length / 200));

  return (
    <section className="pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Back link */}
        <ScrollReveal>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-neon-cyan transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            返回博客列表
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_224px] gap-12">
          {/* Main content */}
          <div className="space-y-0">
            {/* Hero */}
            <ScrollReveal>
              <header className="mb-10 space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {mainCategory && (
                    <Link
                      href={`/blog?category=${encodeURIComponent(mainCategory.slug)}`}
                      className="px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/30 transition-colors"
                    >
                      {mainCategory.name}
                    </Link>
                  )}
                  <span className="flex items-center gap-1.5 text-text-secondary">
                    <Calendar size={14} />
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }) : ""}
                  </span>
                  <span className="flex items-center gap-1.5 text-text-secondary">
                    <Clock size={14} />
                    {readingTime} min 阅读
                  </span>
                </div>

                <NeonHeading variant="cyan" as="h1" className="text-3xl md:text-4xl lg:text-5xl leading-tight">
                  {post.title}
                </NeonHeading>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((pt) => pt.tags && (
                      <span
                        key={pt.tag_id}
                        className="px-2.5 py-0.5 rounded-full text-xs bg-void-elevated text-text-secondary border border-glass-border"
                      >
                        #{pt.tags.name}
                      </span>
                    ))}
                  </div>
                )}
              </header>
            </ScrollReveal>

            {/* Content */}
            <ScrollReveal delay={0.1}>
              <PostContent markdown={post.body_markdown} />
            </ScrollReveal>

            {/* Author card */}
            {post.author && (
              <ScrollReveal delay={0.1}>
                <div className="mt-12 glass rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5">
                  {post.author.avatar_url && (
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.full_name || "作者"}
                      className="w-16 h-16 rounded-full object-cover border-2 border-neon-purple/30"
                    />
                  )}
                  <div className="space-y-2">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">作者</p>
                    <h3 className="text-lg font-semibold text-text-primary">{post.author.full_name || "Helvent"}</h3>
                    {post.author.bio && (
                      <p className="text-sm text-text-secondary leading-relaxed">{truncate(post.author.bio, 200)}</p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Related posts */}
            {related.length > 0 && (
              <ScrollReveal delay={0.15}>
                <div className="mt-12 pt-8 border-t border-glass-border space-y-6">
                  <NeonHeading variant="purple" as="h3" className="text-xl">相关文章</NeonHeading>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        href={`/blog/${r.slug}`}
                        className="group glass rounded-xl p-4 hover:border-neon-cyan/30 transition-all duration-300"
                      >
                        <h4 className="text-sm font-medium leading-snug group-hover:text-neon-cyan transition-colors line-clamp-2">
                          {r.title}
                        </h4>
                        <p className="text-xs text-text-secondary mt-2">
                          {r.published_at ? new Date(r.published_at).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }) : ""}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Comments */}
            <CommentSection postId={post.id} />
          </div>

          {/* Sidebar: TOC + Share */}
          <aside className="space-y-10">
            <TableOfContents headings={headings} />
            <ShareSection slug={post.slug} />
          </aside>
        </div>
      </div>
    </section>
  );
}
