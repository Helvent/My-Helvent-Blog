import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { NeonHeading } from "@/components/effects/neon-heading";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { PostCard } from "@/components/blog/post-card";
import { SearchBar, FilterChips, Pagination } from "@/components/blog/client-ui";
import { createClient } from "@/lib/supabase/server";
import type { Post, Category, Tag } from "@/types/blog";
import { BLOG } from "@/lib/constants";

/* ───────── Supabase fetchers ───────── */

async function getPosts(
  page: number,
  perPage: number,
  categorySlug?: string,
  tagSlug?: string,
  q?: string
): Promise<{ data: Post[]; total: number }> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (categorySlug) {
      // Fetch posts that have a category with this slug via post_categories → categories
      // We use a sub-select approach
      const { data: catIds } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug);

      if (catIds?.length) {
        const catIdList = catIds.map((c) => c.id);
        const { data: pcData } = await supabase
          .from("post_categories")
          .select("post_id")
          .in("category_id", catIdList);
        const postIds = pcData?.map((p) => p.post_id);
        if (postIds?.length) {
          query = query.in("id", postIds);
        } else {
          return { data: [], total: 0 };
        }
      } else {
        return { data: [], total: 0 };
      }
    }

    if (tagSlug) {
      const { data: tagIds } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", tagSlug);

      if (tagIds?.length) {
        const tagIdList = tagIds.map((t) => t.id);
        const { data: ptData } = await supabase
          .from("post_tags")
          .select("post_id")
          .in("tag_id", tagIdList);
        const postIds = ptData?.map((p) => p.post_id);
        if (postIds?.length) {
          query = query.in("id", postIds);
        } else {
          return { data: [], total: 0 };
        }
      } else {
        return { data: [], total: 0 };
      }
    }

    if (q) {
      query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    // Fetch full details including author, categories, tags
    let posts: Post[] = [];
    if (data && data.length > 0) {
      const ids = data.map((p) => p.id);
      const { data: detailData } = await supabase
        .from("posts")
        .select("*, author:profiles(full_name), categories:post_categories(category_id, categories:categories(*)), tags:post_tags(tag_id, tags:tags(*))")
        .in("id", ids);
      posts = detailData as unknown as Post[] || [];
    }

    return { data: posts, total: count ?? 0 };
  } catch {
    return { data: [], total: 0 };
  }
}

async function getCategories(): Promise<Category[] | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    return data ?? null;
  } catch {
    return null;
  }
}

async function getTags(): Promise<Tag[] | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("tags").select("*").order("name");
    return data ?? null;
  } catch {
    return null;
  }
}

/* ───────── Metadata ───────── */

export function generateMetadata(): { title: string; description: string } {
  return {
    title: "博客 — Helvent.赫尔文特",
    description: "探索科技与艺术的无限可能。",
  };
}

/* ───────── Blog Page ───────── */

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string }> }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const categorySlug = params.category || undefined;
  const tagSlug = params.tag || undefined;
  const q = params.q || undefined;

  const [postsResult, categories, tags] = await Promise.all([
    getPosts(currentPage, BLOG.postsPerPage, categorySlug, tagSlug, q),
    getCategories(),
    getTags(),
  ]);

  const totalPages = Math.max(1, Math.ceil(postsResult.total / BLOG.postsPerPage));
  if (currentPage > totalPages && totalPages > 0) redirect(`/blog?page=1`);

  const categoryItems = categories?.map((c) => ({ label: c.name, value: c.slug })) || [];
  const tagItems = tags?.map((t) => ({ label: t.name, value: t.slug })) || [];

  return (
    <section className="pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-6 space-y-12">
        {/* Page heading */}
        <ScrollReveal>
          <div className="text-center space-y-3 mb-4">
            <NeonHeading variant="cyan" as="h1">博客</NeonHeading>
            <p className="text-text-secondary text-lg">
              {q ? `搜索 "${q}" 的结果` : `共 ${postsResult.total} 篇文章`}
            </p>
          </div>
        </ScrollReveal>

        {/* Search */}
        <ScrollReveal delay={0.1}>
          <SearchBar defaultValue={q || ""} />
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={0.15}>
          <div className="flex flex-col gap-6">
            {categoryItems.length > 0 && (
              <FilterChips
                items={categoryItems}
                selected={categorySlug || ""}
                paramKey="category"
                title="分类"
              />
            )}
            {tagItems.length > 0 && (
              <FilterChips
                items={tagItems}
                selected={tagSlug || ""}
                paramKey="tag"
                title="标签"
              />
            )}
          </div>
        </ScrollReveal>

        {/* Posts */}
        <ScrollReveal delay={0.2}>
          {postsResult.total === 0 && !q ? (
            <div className="glass rounded-2xl p-16 text-center text-text-secondary space-y-4">
              <p className="text-xl">🌌 宇宙的尽头是沉默</p>
              <p className="text-sm">还没有文章发布，请稍后再来。</p>
            </div>
          ) : (
            <>
              {postsResult.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {postsResult.data.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-text-secondary">
                  <p>未找到匹配的文章</p>
                </div>
              )}
            </>
          )}
        </ScrollReveal>

        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/blog"
          />
        )}
      </div>
    </section>
  );
}
