import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NeonHeading } from "@/components/effects/neon-heading";
import { PenSquare, MessageSquare, FileText, ExternalLink, Database } from "lucide-react";

export default async function AdminPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return <SupabaseSetup />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-10">
        <NeonHeading variant="cyan" as="h1" className="text-3xl mb-2">
          管理后台
        </NeonHeading>
        <p className="text-text-secondary">
          欢迎回来，{profile?.full_name || user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/blog"
          className="glass-hover rounded-2xl p-6 space-y-4 group"
        >
          <FileText
            size={32}
            className="text-neon-cyan group-hover:scale-110 transition-transform"
          />
          <div>
            <h3 className="text-lg font-medium text-text-primary">博客</h3>
            <p className="text-sm text-text-secondary">查看文章列表</p>
          </div>
          <ExternalLink
            size={16}
            className="text-text-secondary group-hover:text-neon-cyan transition-colors"
          />
        </Link>

        <Link
          href="/admin/posts"
          className="glass-hover rounded-2xl p-6 space-y-4 group"
        >
          <PenSquare
            size={32}
            className="text-neon-purple group-hover:scale-110 transition-transform"
          />
          <div>
            <h3 className="text-lg font-medium text-text-primary">写文章</h3>
            <p className="text-sm text-text-secondary">创建新的博客文章</p>
          </div>
          <ExternalLink
            size={16}
            className="text-text-secondary group-hover:text-neon-purple transition-colors"
          />
        </Link>

        <Link
          href="/admin/comments"
          className="glass-hover rounded-2xl p-6 space-y-4 group"
        >
          <MessageSquare
            size={32}
            className="text-neon-cyan group-hover:scale-110 transition-transform"
          />
          <div>
            <h3 className="text-lg font-medium text-text-primary">评论管理</h3>
            <p className="text-text-secondary">审核和管理评论</p>
          </div>
          <ExternalLink
            size={16}
            className="text-text-secondary group-hover:text-neon-cyan transition-colors"
          />
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 glass rounded-2xl p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">快速统计</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="文章" value="-" />
          <StatCard label="评论" value="-" />
          <StatCard label="分类" value="-" />
          <StatCard label="标签" value="-" />
        </div>
      </div>
    </div>
  );
}

function SupabaseSetup() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="glass rounded-2xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 flex items-center justify-center">
            <Database size={32} className="text-neon-purple" />
          </div>
        </div>
        <NeonHeading variant="purple" as="h1" className="text-2xl">
          需要配置 Supabase
        </NeonHeading>
        <p className="text-text-secondary max-w-md mx-auto">
          管理后台需要连接 Supabase 数据库。请在项目根目录创建
          <code className="inline-code">.env.local</code> 文件，并填入你的 Supabase 项目信息：
        </p>
        <div className="text-left max-w-lg mx-auto glass rounded-xl p-4 space-y-2 font-mono text-sm">
          <div className="text-neon-cyan">NEXT_PUBLIC_SUPABASE_URL</div>
          <div className="text-text-secondary pl-4">= https://your-project.supabase.co</div>
          <div className="text-neon-cyan mt-2">NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
          <div className="text-text-secondary pl-4">= your-anon-key</div>
          <div className="text-neon-purple mt-2">SUPABASE_SERVICE_ROLE_KEY</div>
          <div className="text-text-secondary pl-4">= your-service-role-key</div>
        </div>
        <p className="text-text-secondary text-sm">
          在 Supabase Dashboard 的 Settings → API 页面可以找到这些值。
        </p>
        <Link
          href="https://supabase.com/dashboard/project/_/settings/api"
          target="_blank"
          className="inline-flex items-center gap-2 text-neon-cyan hover:underline text-sm"
        >
          <ExternalLink size={14} />
          前往 Supabase Dashboard
        </Link>
      </div>
    </div>
  );
}
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-neon-purple">{value}</div>
      <div className="text-sm text-text-secondary">{label}</div>
    </div>
  );
}