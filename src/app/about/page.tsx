import Link from "next/link";
import { NeonHeading } from "@/components/effects/neon-heading";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { SITE } from "@/lib/constants";
import { GitBranch as Github, Mail, MapPin, Code2, Palette, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

/* ───────── About Page ───────── */

export const metadata = {
  title: "关于 — Helvent.赫尔文特",
  description: "全栈开发者 / 设计爱好者 / 技术艺术家。探索科技与艺术的交汇点。",
};

const SKILLS = [
  { icon: Code2, label: "前端", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion"] },
  { icon: Rocket, label: "后端", items: ["Node.js", "Supabase", "PostgreSQL", "API Design", "Serverless"] },
  { icon: Palette, label: "设计", items: ["UI/UX", "Figma", "Design Systems", "Motion Design", "Brand Identity"] },
];

const TIMELINE = [
  { year: "2019", title: "启程", desc: "开始接触 Web 开发，用 HTML/CSS/JS 搭建第一个个人网站" },
  { year: "2020", title: "深入框架", desc: "学习 React 生态系统，构建第一个复杂的单页应用" },
  { year: "2022", title: "全栈转型", desc: "学习 Node.js 与数据库，开始独立开发全栈产品" },
  { year: "2023", title: "设计美学", desc: "将设计思维融入开发，追求技术与美学的平衡" },
  { year: "2024", title: "AI & 创新", desc: "探索 AI 辅助开发，尝试创作型编程与生成艺术" },
  { year: "2025", title: "Helvent", desc: "创立 Helvent 品牌，发布首个完整技术博客平台" },
];

export default function AboutPage() {
  return (
    <section className="pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-6 space-y-20">
        {/* Hero */}
        <ScrollReveal>
          <div className="text-center space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple bg-clip-text text-transparent">
                Helvent
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary font-light tracking-wide">
              全栈开发者 / 设计爱好者 / 技术艺术家
            </p>
          </div>
        </ScrollReveal>

        {/* Bio */}
        <ScrollReveal delay={0.15}>
          <div className="glass rounded-2xl p-8 md:p-12 space-y-6 max-w-3xl mx-auto">
            <NeonHeading variant="purple" as="h2" className="text-2xl">关于我</NeonHeading>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                你好！我是 <span className="text-text-primary font-medium">Helvent</span>，一个热爱技术与设计的中国开发者。
                我相信代码不仅是工具，更是一种艺术表达的形式——好的软件应该像好的设计一样，
                既实用又令人愉悦。
              </p>
              <p>
                我的核心专长是前端架构与全栈开发，擅长使用 Next.js、React 和 Supabase 构建高性能、可维护的应用。
                同时，我对 UI/UX 设计有着深厚热情，始终追求在功能与美学之间找到最佳平衡点。
              </p>
              <p>
                这个博客是我的知识仓库和技术实验场。在这里，我会分享关于前端开发、全栈架构、
                设计系统的思考与实践，以及一些关于技术和创意的随笔。
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Skills */}
        <ScrollReveal delay={0.1}>
          <div className="space-y-8">
            <NeonHeading variant="cyan" className="text-center" as="h2">技能领域</NeonHeading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SKILLS.map((skill, i) => (
                <div
                  key={skill.label}
                  className="glass rounded-2xl p-6 space-y-4 hover:border-neon-purple/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                    <skill.icon size={22} className="text-neon-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">{skill.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg text-xs bg-void-elevated text-text-secondary border border-glass-border"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <ScrollReveal delay={0.1}>
          <div className="space-y-8">
            <NeonHeading variant="purple" className="text-center" as="h2">技术旅程</NeonHeading>
            <div className="max-w-2xl mx-auto relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple via-neon-cyan to-neon-purple opacity-30" />
              <div className="space-y-8">
                {TIMELINE.map((event, i) => (
                  <ScrollReveal key={event.year} delay={0.05 * i} direction="left" distance={20}>
                    <div className="relative pl-16">
                      {/* Dot */}
                      <div
                        className={cn(
                          "absolute left-[21px] top-2 w-4 h-4 rounded-full border-2 -translate-x-1/2",
                          i === TIMELINE.length - 1
                            ? "bg-neon-cyan border-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                            : "bg-void-dark border-neon-purple"
                        )}
                      />
                      <div className="glass rounded-xl p-5 hover:border-neon-cyan/20 transition-colors">
                        <span className="text-xs text-neon-purple font-mono">{event.year}</span>
                        <h3 className="text-base font-semibold text-text-primary mt-1">{event.title}</h3>
                        <p className="text-sm text-text-secondary mt-1 leading-relaxed">{event.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Contact links */}
        <ScrollReveal delay={0.1}>
          <div className="text-center space-y-6">
            <NeonHeading variant="cyan" as="h2">联系我</NeonHeading>
            <div className="flex justify-center gap-4">
              <Link
                href={SITE.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 text-text-secondary hover:text-neon-purple hover:border-neon-purple/30 transition-all"
              >
                <Github size={18} />
                GitHub
              </Link>
              <Link
                href={`mailto:${SITE.links.email}`}
                className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
              >
                <Mail size={18} />
                Email
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 text-text-secondary hover:text-neon-purple hover:border-neon-purple/30 transition-all"
              >
                <MapPin size={18} />
                联系表单
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
