"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { NeonHeading } from "@/components/effects/neon-heading";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-6">
      <div className="w-full max-w-md glass rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <NeonHeading variant="cyan" as="h1" className="text-2xl">
            登录
          </NeonHeading>
          <p className="text-sm text-text-secondary">
            欢迎回到 Helvent 管理后台
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-text-secondary">
              邮箱
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-void-elevated border border-glass-border text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-text-secondary">
              密码
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-void-elevated border border-glass-border text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full glass-hover text-text-primary font-medium transition-all disabled:opacity-50 neon-glow-cyan"
          >
            {loading ? "登录中..." : "登录"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          还没有账号？{" "}
          <Link
            href="/auth/sign-up"
            className="text-neon-cyan hover:underline"
          >
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}