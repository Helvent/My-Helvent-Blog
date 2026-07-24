"use client";

import { useState } from "react";
import { toast } from "sonner";
import { User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/types/blog";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      toast.error("请填写姓名和评论内容");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          author_name: authorName.trim(),
          content: content.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "提交失败");
      toast.success("评论已提交，等待审核！");
      setContent("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 mt-12 pt-8 border-t border-glass-border">
      <h3 className="text-xl font-bold">评论 ({comments.length})</h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 glass rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="您的姓名"
            className="w-full px-4 py-3 rounded-lg bg-void-elevated/50 border border-glass-border text-text-primary placeholder:text-text-secondary outline-none focus:border-neon-purple/40 transition-colors"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下您的评论..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-void-elevated/50 border border-glass-border text-text-primary placeholder:text-text-secondary outline-none focus:border-neon-purple/40 transition-colors resize-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-lg bg-neon-purple/20 border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/30 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {submitting ? "提交中…" : "发表评论"}
        </button>
      </form>

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-xs text-text-secondary">
                <User size={14} />
                <span className="font-medium text-text-primary">{c.author_name}</span>
                <span>·</span>
                <span>{formatDate(c.created_at)}</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
