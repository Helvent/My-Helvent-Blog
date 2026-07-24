"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NeonHeading } from "@/components/effects/neon-heading";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.body_markdown);
        setExcerpt(data.excerpt || "");
        setStatus(data.status as "draft" | "published");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(value));
    }
  }

  async function handleSave(publish: boolean) {
    if (!id) return;
    setSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("posts")
        .update({
          title,
          slug,
          body_markdown: content,
          excerpt,
          status: publish ? "published" : status,
          published_at:
            publish && status !== "published"
              ? new Date().toISOString()
              : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-text-secondary">加载中...</p>
      </div>
    );
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

      <NeonHeading variant="purple" as="h1" className="text-2xl mb-8">
        编辑文章
      </NeonHeading>

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-text-secondary">标题</label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-void-elevated border border-glass-border text-text-primary text-lg placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-void-elevated border border-glass-border text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/30 transition-all font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">摘要</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg bg-void-elevated border border-glass-border text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-4 py-3 rounded-lg bg-void-elevated border border-glass-border text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/30 transition-all font-mono text-sm leading-relaxed resize-y"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full glass-hover text-text-primary text-sm transition-all disabled:opacity-50"
          >
            <Save size={16} />
            保存
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
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