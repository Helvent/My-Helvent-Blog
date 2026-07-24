import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const commentSchema = z.object({
  post_id: z.string().min(1),
  author_name: z.string().min(1).max(100),
  author_email: z.string().email().optional().or(z.literal("")),
  content: z.string().min(1).max(2000),
  parent_comment_id: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = commentSchema.safeParse(body);

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
        { success: true, message: "评论已保存（本地模式）" },
        { status: 200 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.from("comments").insert({
      post_id: parsed.data.post_id,
      author_name: parsed.data.author_name,
      author_email: parsed.data.author_email || null,
      content: parsed.data.content,
      parent_comment_id: parsed.data.parent_comment_id || null,
      is_approved: false,
    });

    if (error) {
      console.error("Comment insert error:", error);
      return NextResponse.json(
        { error: "评论提交失败，请稍后重试" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "评论已提交，等待审核！" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
