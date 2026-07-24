
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Helvent-⛦_赫尔文特-0a0a0f?style=for-the-badge&labelColor=0a0a0f&color=c084fc" />
    <img alt="Helvent.赫尔文特" src="https://img.shields.io/badge/Helvent-⛦_赫尔文特-0a0a0f?style=for-the-badge&labelColor=0a0a0f&color=c084fc" />
  </picture>
</p>

<p align="center">
  <i>在数字宇宙的褶皱中，思想以霓虹为墨，书写不可见的光。</i>
</p>

<br />

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
</p>

<br />

---

<div align="center">
  <pre style="font-family: 'JetBrains Mono', monospace; background: #0a0a0f; color: #c084fc; padding: 2em; border-radius: 12px; border: 1px solid rgba(192, 132, 252, 0.3);">
╔══════════════════════════════════════════╗
║    在代码与诗的交界处                    ║
║    我们建造了一座发光的塔                ║
║                                          ║
║    Helvent.赫尔文特                      ║
║    一个关于思想、代码与星辰的博客         ║
╚══════════════════════════════════════════╝
  </pre>
</div>

---

## ✦ 关于

**Helvent.赫尔文特** 是一个融合科技与艺术的个人博客——暗色霓虹的设计语言下，承载着技术文章、设计思考与生活随笔。

这不是一个普通的博客。每一行代码都是光。每一个页面都是一次在数字深渊中的呼吸。

> **设计与理念** — 以黑暗为背景，以霓虹为笔触，以玻璃质感为媒介。信息的层次在朦胧与清晰之间振荡，如同在深空中漂浮的星云。

---

## ✦ 技术栈

```
  ⚛  ﹒ React 19                  — 最新并发渲染
  ▲  ﹒ Next.js 16 (Turbopack)    — 应用路由 + RSC
  △  ﹒ Supabase                  — 数据库 + Auth + RLS
  ◇  ﹒ Tailwind CSS v4           — 暗色霓虹主题
  ◆  ﹒ TypeScript 5              — 严格类型
  ○  ﹒ Lucide Icons              — 图标系统
```

---

## ✦ 功能

### 博客前端
- **文章列表** — 分页浏览、分类筛选、标签过滤、全文搜索
- **文章详情** — Markdown 渲染、自动目录提取、阅读进度
- **相关文章** — 基于分类关联推荐
- **评论系统** — Supabase 实时评论，无需第三方
- **分享功能** — 链接分享与社交分享

### 管理后台
- **仪表盘** — 文章统计、评论概览、近期动态
- **文章管理** — 新建 / 编辑 / 删除，Markdown 编辑器
- **评论管理** — 审核、回复、删除

### 用户系统
- **Supabase Auth** — 邮箱注册登录、密码重置
- **权限控制** — RLS 策略保护数据安全
- **用户信息** — 个人资料与头像

### 特效组件
- **星空粒子** — Canvas 动态星场
- **霓虹标题** — 发光渐变文字
- **滚动动画** — 视差进入动画
- **玻璃卡片** — backdrop-blur 毛玻璃
- **环境光晕** — 动态模糊光球

---

## ✦ 快速开始

```bash
# 克隆项目
git clone https://github.com/Helvent/My-Helvent-Blog.git
cd My-Helvent-Blog

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的 Supabase 项目配置

# 初始化数据库
node seeds/run-schema.mjs
node seeds/seed.ts

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 环境变量

```env
# Supabase 项目配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## ✦ 项目结构

```
src/
├── app/                       # Next.js App Router
│   ├── blog/                  # 博客页面
│   │   ├── [slug]/            # 文章详情 (动态路由)
│   │   └── page.tsx           # 博客列表
│   ├── admin/                 # 管理后台
│   │   ├── posts/             # 文章 CRUD
│   │   ├── comments/          # 评论管理
│   │   └── page.tsx           # 仪表盘
│   ├── auth/                  # 认证页面
│   │   ├── sign-in/           # 登录
│   │   └── sign-up/           # 注册
│   ├── about/                 # 关于页面
│   ├── contact/               # 联系页面
│   └── api/                   # API 路由
├── components/
│   ├── blog/                  # 博客组件
│   ├── ui/                    # 基础 UI 组件
│   ├── effects/               # 特效组件
│   ├── layout/                # 布局组件
│   ├── about/                 # 关于组件
│   └── contact/               # 联系表单组件
├── lib/
│   ├── supabase/              # Supabase 客户端
│   ├── constants.ts           # 常量配置
│   └── utils.ts               # 工具函数
└── types/                     # TypeScript 类型
```

---

## ✦ 数据库 Schema

```
┌─────────────┐    ┌───────────────┐    ┌─────────────┐
│   posts     │───▶│ post_categories│◀───│ categories  │
├─────────────┤    ├───────────────┤    ├─────────────┤
│ id          │    │ post_id       │    │ id          │
│ title       │    │ category_id   │    │ name        │
│ slug        │    └───────────────┘    │ slug        │
│ body_markdown│                        └─────────────┘
│ status      │    ┌───────────────┐    ┌─────────────┐
│ author_id   │───▶│  post_tags    │◀───│    tags     │
│ published_at│    ├───────────────┤    ├─────────────┤
│ cover_image │    │ post_id       │    │ id          │
│ ...         │    │ tag_id        │    │ name        │
└──────┬──────┘    └───────────────┘    │ slug        │
       │                                └─────────────┘
       │         ┌──────────────┐
       └────────▶│  comments    │
                 ├──────────────┤
                 │ id           │
                 │ post_id      │
                 │ content      │
                 │ status       │
                 └──────────────┘
```

---

## ✦ 设计哲学

```
色彩系统
├── 背景  — #0a0a0f (虚空黑)
├── 表面  — rgba(255,255,255,0.03) (玻璃基底)
├── 霓虹  — #c084fc (紫), #22d3ee (青), #f472b6 (粉)
└── 文字  — #f1f5f9 → #64748b (白 → 灰)

视觉语言
├── 毛玻璃效果 — backdrop-blur + 半透明边框
├── 霓虹发光  — text-shadow + box-shadow 多层光晕
├── 渐变文字  — bg-clip-text + linear-gradient
├── 微动效    — hover 亮度偏移 + 边框呼吸
└── 空间层次  — z-index 分层 + 模糊景深
```

> *"好的设计不是被看到的——它是被感受到的。就像黑暗中的一束光，你不需要看见光源，只需要看见被照亮的事物。"*

---

## ✦ 部署

项目已配置 `vercel.json`，可直接部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Helvent/My-Helvent-Blog)

1. 在 Vercel 导入 GitHub 仓库
2. 添加环境变量（同上 `.env.local` 配置）
3. 部署完成 ✓

---

<p align="center">
  <br />
  <sub>⛦ 赫尔文特 · 在数字宇宙中建造一座灯塔</sub>
  <br />
  <sub>Built with ▲ Next.js · △ Supabase · ◇ Tailwind · ◆ TypeScript</sub>
</p>
