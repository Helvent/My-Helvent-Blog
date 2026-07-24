"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Zod validation schema — using Zod v4 API
const contactSchema = z.object({
  name: z.string().min(1, "请输入您的姓名"),
  email: z.string().email("请输入有效的邮箱地址"),
  subject: z.string().min(1, "请输入主题"),
  message: z.string().min(10, "消息内容至少需要10个字符"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [formData, setFormData] = React.useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submitting, setSubmitting] = React.useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof ContactFormData];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof ContactFormData] = issue.message;
        }
      }
      setErrors(fieldErrors);
      toast.error("请检查表单填写");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) throw new Error("发送失败");

      toast.success("消息已发送，我会尽快回复！", { duration: 4000 });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch {
      toast.error("消息发送失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses = (field: keyof ContactFormData) =>
    errors[field]
      ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
      : "";

  return (
    <Card hoverGlow className="!rounded-2xl max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-bold">发送消息</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Input
              name="name"
              placeholder="您的姓名"
              value={formData.name}
              onChange={handleChange}
              className={inputClasses("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              name="email"
              type="email"
              placeholder="邮箱地址"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Input
              name="subject"
              placeholder="主题"
              value={formData.subject}
              onChange={handleChange}
              className={inputClasses("subject")}
            />
            {errors.subject && (
              <p className="text-xs text-red-400 mt-1">{errors.subject}</p>
            )}
          </div>

          <div>
            <Textarea
              name="message"
              placeholder="写下您的消息..."
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={inputClasses("message")}
            />
            {errors.message && (
              <p className="text-xs text-red-400 mt-1">{errors.message}</p>
            )}
          </div>

          <Button type="submit" variant="neon" disabled={submitting}>
            {submitting ? "发送中..." : "发送消息"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
