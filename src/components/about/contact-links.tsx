"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { GitBranch, Mail } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface ContactLinksProps {
  githubUrl?: string;
  email?: string;
}

export function ContactLinks({
  githubUrl = "https://github.com/Helvent",
  email = "helvent_art@163.com",
}: ContactLinksProps) {
  const links = [
    {
      icon: GitBranch,
      label: "GitHub",
      href: githubUrl,
      description: "查看我的开源项目",
    },
    {
      icon: Mail,
      label: "邮箱",
      href: `mailto:${email}`,
      description: "发送邮件联系",
    },
  ];

  return (
    <Card hoverGlow className="!rounded-2xl max-w-md">
      <CardContent className="p-5">
        <div className="flex flex-col gap-3">
          {links.map((link, index) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
              >
                <div className="shrink-0 h-10 w-10 rounded-lg glass flex items-center justify-center group-hover:border-neon-purple/30 transition-colors">
                  <link.icon className="h-5 w-5 text-text-secondary/70 group-hover:text-neon-purple transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary group-hover:text-neon-cyan transition-colors">
                    {link.label}
                  </div>
                  <div className="text-xs text-text-secondary/60 truncate">
                    {link.description}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
