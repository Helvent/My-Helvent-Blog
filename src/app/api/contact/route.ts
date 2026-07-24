import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Simple in-memory rate limiter
interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const RATE_LIMIT_MAP = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    RATE_LIMIT_MAP.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional().default(""),
  message: z.string().min(1).max(2000),
});

export async function POST(request: Request) {
  // Extract IP for rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "请求过于频繁，请稍后再试" },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "请求数据无效", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // If Supabase not configured, simulate success
    const supUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supUrl) {
      return NextResponse.json(
        { success: true, message: "消息已保存（本地模式）" },
        { status: 200 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || "",
      message: parsed.data.message,
    });

    if (error) {
      console.error("Contact insert error:", error);
      return NextResponse.json(
        { error: "消息发送失败，请稍后重试" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "消息已发送！" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
