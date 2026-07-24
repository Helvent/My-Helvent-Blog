import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NeonHeading } from "@/components/effects/neon-heading";
import { Plus, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/sign-in");

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <NeonHeading variant="cyan" as="h1" className="text-2xl">
          文章管理
        </NeonHeading>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-hover text-sm text-text-primary hover:neon-glow-cyan transition-all"
        >
          <Plus size={16} />
          新建文章
        </Link>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left px-6 py-4 text-text-secondary font-medium">
                  标题
                </th>
                <th className="text-left px-6 py-4 text-text-secondary font-medium hidden md:table-cell">
                  状态
                </th>
                <th className="text-left px-6 py-4 text-text-secondary font-medium hidden md:table-cell">
                  日期
                </th>
                <th className="text-right px-6 py-4 text-text-secondary font-medium">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-glass-border/50 hover:bg-void-elevated/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-text-primary font-medium">
                          {post.title}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">
                          /blog/{post.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                          post.status === "published"
                            ? "bg-green-400/10 text-green-400"
                            : post.status === "draft"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : "bg-gray-400/10 text-gray-400"
                        }`}
                      >
                        {post.status === "published"
                          ? "已发布"
                          : post.status === "draft"
                            ? "草稿"
                            : "已归档"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary hidden md:table-cell">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-neon-cyan hover:text-neon-purple transition-colors text-xs"
                        >
                          编辑
                        </Link>
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-text-secondary hover:text-neon-cyan transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-text-secondary"
                  >
                    还没有文章，开始写第一篇吧
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}