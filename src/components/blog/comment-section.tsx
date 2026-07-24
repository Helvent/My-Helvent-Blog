"use client";

import * as React from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import type { Comment } from "@/types/blog";
import { formatDate } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
}

export function CommentSection({ postId, initialComments = [] }: CommentSectionProps) {
  const [comments, setComments] = React.useState<Comment[]>(initialComments);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [content, setContent] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error("请填写姓名和评论内容");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/comments?postId=${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_name: name, author_email: email || null, content }),
      });

      if (!res.ok) throw new Error("提交失败");

      const data = await res.json();
      setComments((prev) => [...prev, data]);
      setName("");
      setEmail("");
      setContent("");
      toast.success("评论已发布，等待审核后显示", { duration: 3000 });
    } catch {
      toast.error("评论提交失败，请重试");
    } finally {
      setSubmitting(false);
    }
  }

  function renderCommentList(commentsToRender: Comment[], depth = 0) {
    return commentsToRender.map((comment) => (
      <React.Fragment key={comment.id}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`glass rounded-xl p-4 my-2 ${depth > 0 ? "ml-8 border-l-2 border-neon-purple/20" : ""}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-neon-purple/60 flex-shrink-0" />
            <span className="text-sm font-medium text-text-primary">
              {comment.author_name}
            </span>
            <time className="text-xs text-text-secondary ml-auto">
              {formatDate(comment.created_at)}
            </time>
          </div>
          <p className="text-sm text-text-secondary/80 leading-relaxed">{comment.content}</p>
        </motion.div>
        {comment.replies && comment.replies.length > 0
          ? renderCommentList(comment.replies, depth + 1)
          : null}
      </React.Fragment>
    ));
  }

  return (
    <section className="space-y-6 mt-10">
      <CardTitle className="text-xl font-bold">评论</CardTitle>

      {/* Form */}
      <Card hoverGlow className="!rounded-2xl">
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="您的姓名 *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="邮箱（可选，不会公开）"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Textarea
              placeholder="写下您的想法... *"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
            <Button type="submit" disabled={submitting} variant="neon">
              {submitting ? "发布中..." : "发表评论"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comment List */}
      <div className="space-y-1">
        {comments.filter((c) => !c.parent_comment_id).map((c) => renderCommentList([c]))}
      </div>
    </section>
  );
}
