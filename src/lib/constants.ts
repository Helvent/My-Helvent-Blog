export const SITE = {
  name: "Helvent.赫尔文特",
  title: "Helvent.赫尔文特 — 科技与艺术的交汇点",
  description: "探索科技与艺术的无限可能。一个关于前端开发、全栈架构、设计美学的个人博客。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://helvent.vercel.app",
  locale: "zh-CN",
  author: "Helvent",
  ogImage: "/images/og.jpg",
  links: {
    github: "https://github.com/Helvent",
    email: "helvent_art@163.com",
  },
  nav: [
    { label: "首页", href: "/" },
    { label: "博客", href: "/blog" },
    { label: "关于", href: "/about" },
    { label: "联系", href: "/contact" },
  ] as const,
} as const;

export const BLOG = {
  postsPerPage: 9,
  featuredLimit: 1,
  relatedLimit: 3,
} as const;

export const COLORS = {
  neonPurple: "#b44aff",
  neonCyan: "#00f0ff",
  voidDark: "#0a0a0f",
  voidElevated: "#12121a",
} as const;