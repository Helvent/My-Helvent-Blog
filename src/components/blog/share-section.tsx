"use client";

import { toast } from "sonner";
import { GitBranch as Github, Mail, Share2 } from "lucide-react";
import { SITE } from "@/lib/constants";

interface ShareSectionProps {
  slug: string;
}

export function ShareSection({ slug }: ShareSectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-text-secondary uppercase tracking-wider">分享</p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${SITE.url}/blog/${slug}`);
            toast.success("链接已复制！");
          }}
          className="p-2.5 glass rounded-lg hover:border-neon-purple/40 transition-colors text-text-secondary hover:text-neon-purple"
          aria-label="复制链接"
        >
          <Share2 size={16} />
        </button>
        <a
          href={SITE.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 glass rounded-lg hover:border-glass-border transition-colors text-text-secondary hover:text-text-primary"
          aria-label="GitHub"
        >
          <Github size={16} />
        </a>
        <a
          href={`mailto:?body=${encodeURIComponent(`${SITE.url}/blog/${slug}`)}`}
          className="p-2.5 glass rounded-lg hover:border-glass-border transition-colors text-text-secondary hover:text-text-primary"
          aria-label="邮件"
        >
          <Mail size={16} />
        </a>
      </div>
    </div>
  );
}