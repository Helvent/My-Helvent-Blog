"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { NeonHeading } from "@/components/effects/neon-heading";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      router.push("/auth/sign-in?message=注册成功，请查看邮箱确认");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-6">
      <div className="w-full max-w-md glass rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <NeonHeading variant="purple" as="h1" className="text-2xl">
            注册
          </NeonHeading>
          <p className="text-sm text-text-secondary">
            加入 Helvent 社区
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm text-text-secondary">
              昵称
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Helvent"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-void-elevated border border-glass-border text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/30 transition-all"
              />
            </div>
          </div>

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
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-void-elevated border border-glass-border text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/30 transition-all"
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
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-void-elevated border border-glass-border text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/30 transition-all"
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
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full glass-hover text-text-primary font-medium transition-all disabled:opacity-50 neon-glow-purple"
          >
            {loading ? "注册中..." : "注册"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          已有账号？{" "}
          <Link
            href="/auth/sign-in"
            className="text-neon-cyan hover:underline"
          >
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}