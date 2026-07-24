import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, body_markdown, excerpt, status } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "标题和 slug 不能为空" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title,
        slug,
        body_markdown: body_markdown || "",
        excerpt: excerpt || "",
        status: status || "draft",
        author_id: user.id,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, post: data });
  } catch (err) {
    console.error("Create post error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "创建文章失败" },
      { status: 500 }
    );
  }
}