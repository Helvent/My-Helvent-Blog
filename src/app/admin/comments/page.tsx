import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NeonHeading } from "@/components/effects/neon-heading";
import { formatDate } from "@/lib/utils";

export default async function AdminCommentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/sign-in");

  const { data: comments } = await supabase
    .from("comments")
    .select("*, posts(title, slug)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <NeonHeading variant="cyan" as="h1" className="text-2xl mb-8">
        评论管理
      </NeonHeading>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left px-6 py-4 text-text-secondary font-medium">
                  内容
                </th>
                <th className="text-left px-6 py-4 text-text-secondary font-medium hidden md:table-cell">
                  作者
                </th>
                <th className="text-left px-6 py-4 text-text-secondary font-medium hidden md:table-cell">
                  文章
                </th>
                <th className="text-left px-6 py-4 text-text-secondary font-medium">
                  状态
                </th>
                <th className="text-left px-6 py-4 text-text-secondary font-medium hidden lg:table-cell">
                  日期
                </th>
              </tr>
            </thead>
            <tbody>
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <tr
                    key={comment.id}
                    className="border-b border-glass-border/50 hover:bg-void-elevated/50 transition-colors"
                  >
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-text-primary truncate">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-text-secondary hidden md:table-cell">
                      {comment.author_name}
                    </td>
                    <td className="px-6 py-4 text-text-secondary hidden md:table-cell max-w-[150px] truncate">
                      {comment.posts?.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                          comment.is_approved
                            ? "bg-green-400/10 text-green-400"
                            : "bg-yellow-400/10 text-yellow-400"
                        }`}
                      >
                        {comment.is_approved ? "已通过" : "待审核"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary hidden lg:table-cell">
                      {formatDate(comment.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-text-secondary"
                  >
                    还没有评论
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