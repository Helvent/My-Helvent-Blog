"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NeonHeading } from "@/components/effects/neon-heading";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(value));
    }
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setStatus(publish ? "published" : "draft");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          body_markdown: content,
          excerpt,
          status: publish ? "published" : "draft",
        }),
      });

      if (!res.ok) throw new Error("保存失败");
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link
        href="/admin/posts"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} />
        返回文章列表
      </Link>

      <NeonHeading variant="cyan" as="h1" className="text-2xl mb-8">
        新建文章
      </NeonHeading>

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-text-secondary">标题</label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="文章标题"
              className="w-full px-4 py-3 rounded-lg bg-void-elevated border border-glass-border text-text-primary text-lg placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-slug"
              className="w-full px-4 py-2.5 rounded-lg bg-void-elevated border border-glass-border text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/30 transition-all font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">摘要</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="文章摘要..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg bg-void-elevated border border-glass-border text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">
              内容 (Markdown)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="使用 Markdown 语法写作..."
              rows={20}
              className="w-full px-4 py-3 rounded-lg bg-void-elevated border border-glass-border text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/30 transition-all font-mono text-sm leading-relaxed resize-y"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            onClick={() => handleSave(false)}
            disabled={saving || !title}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full glass-hover text-text-primary text-sm transition-all disabled:opacity-50"
          >
            <Save size={16} />
            保存草稿
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || !title || !content}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full glass-hover text-text-primary text-sm transition-all disabled:opacity-50 neon-glow-cyan"
          >
            <Send size={16} />
            发布
          </button>
        </div>
      </div>
    </div>
  );
}