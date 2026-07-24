import Link from "next/link";
import { GitBranch as Github, Mail, Heart } from "lucide-react";
import { SITE } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-glass-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="text-lg font-bold">
              <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                Helvent
              </span>
              <span className="text-text-secondary ml-1">.赫尔文特</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              探索科技与艺术的无限可能。
              一个关于前端、全栈、设计的个人博客。
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-primary">导航</h3>
            <nav className="flex flex-col gap-2">
              {SITE.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-text-secondary hover:text-neon-cyan transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-primary">联系</h3>
            <div className="flex flex-col gap-3">
              <a
                href={SITE.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-neon-purple transition-colors"
              >
                <Github size={16} />
                GitHub
              </a>
              <a
                href={`mailto:${SITE.links.email}`}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-neon-cyan transition-colors"
              >
                <Mail size={16} />
                {SITE.links.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            © {currentYear} {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-text-secondary flex items-center gap-1">
            Built with <Heart size={12} className="text-neon-purple" /> using
            Next.js, Supabase & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}