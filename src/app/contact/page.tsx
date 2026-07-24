import { NeonHeading } from "@/components/effects/neon-heading";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";
import { GitBranch as Github, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export function generateMetadata(): { title: string; description: string } {
  return {
    title: "联系 — Helvent.赫尔文特",
    description: "有任何问题或合作意向？欢迎通过表单或直接联系。",
  };
}

const CONTACT_INFO = [
  {
    icon: Github,
    label: "GitHub",
    value: SITE.links.github,
    href: SITE.links.github,
    target: "_blank" as const,
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE.links.email,
    href: `mailto:${SITE.links.email}`,
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <ScrollReveal className="text-center mb-12">
        <NeonHeading variant="cyan" as="h1" className="text-3xl md:text-4xl mb-4">
          联系我
        </NeonHeading>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          有任何问题或合作意向？欢迎联系
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <ScrollReveal delay={0.1} className="md:col-span-3">
          <ContactForm />
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="md:col-span-2 space-y-4">
          {CONTACT_INFO.map((info) => (
            <a
              key={info.label}
              href={info.href}
              target={info.target}
              rel={info.target === "_blank" ? "noopener noreferrer" : undefined}
              className="glass-hover rounded-2xl p-5 flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center group-hover:bg-neon-purple/20 transition-colors">
                <info.icon
                  size={22}
                  className="text-neon-purple group-hover:text-neon-cyan transition-colors"
                />
              </div>
              <div>
                <p className="text-sm text-text-secondary">{info.label}</p>
                <p className="text-text-primary text-sm font-medium break-all">
                  {info.value}
                </p>
              </div>
            </a>
          ))}
        </ScrollReveal>
      </div>
    </div>
  );
}
