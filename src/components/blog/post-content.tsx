import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { type Components } from "react-markdown";

export function PostContent({ markdown }: { markdown: string }) {
  return (
    <article className="space-y-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          rehypeHighlight,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "prepend",
              content: {
                type: "element",
                tagName: "span",
                properties: { className: ["heading-anchor"] },
                children: [],
              },
            },
          ],
        ]}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}

const markdownComponents: Partial<Components> = {
  h1: ({ node, ...props }) => (
    <h1 style={{ scrollMarginTop: "5rem" }} className="text-3xl font-bold text-text-primary group mt-8 mb-4" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 style={{ scrollMarginTop: "5rem" }} className="text-2xl font-bold text-text-primary group mt-8 mb-4 flex items-center gap-2" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 style={{ scrollMarginTop: "5rem" }} className="text-xl font-semibold text-text-primary group mt-6 mb-3" {...props} />
  ),
  h4: ({ node, ...props }) => (
    <h4 style={{ scrollMarginTop: "5rem" }} className="text-lg font-semibold text-text-primary group mt-6 mb-3" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="text-base text-text-secondary/80 leading-relaxed mb-4" {...props} />
  ),
  a: ({ node, href, ...props }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-neon-cyan hover:text-neon-purple underline underline-offset-[3px] decoration-neon-cyan/30 hover:decoration-neon-purple/60 transition-colors"
      {...props}
    />
  ),
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const codeValue = String(children).replace(/\n$/, "");
    if (!inline && match) {
      return (
        <pre className="my-6 overflow-x-auto rounded-2xl bg-void-elevated/80 border border-glass-border backdrop-blur-sm">
          <code className={className} {...props}>
            {codeValue}
          </code>
        </pre>
      );
    }
    return (
      <code className="bg-void-elevated/60 text-neon-cyan/90 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-[3px] border-neon-purple/50 pl-5 italic text-text-secondary/70 my-6 bg-neon-purple/[0.03] rounded-r-xl py-2 pr-4" {...props} />
  ),
  pre: ({ node, ...props }) => (
    <pre className="my-6 overflow-x-auto rounded-2xl bg-void-elevated/80 border border-glass-border backdrop-blur-sm" {...props} />
  ),
  img: ({ node, ...props }) => (
    <img className="rounded-2xl my-4 max-w-full h-auto" {...props} />
  ),
  hr: ({ node, ...props }) => (
    <hr className="border-none border-t border-glass-border my-8" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc list-inside space-y-2 my-4 text-text-secondary/80" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal list-inside space-y-2 my-4 text-text-secondary/80" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="pl-1 text-text-secondary/80" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-glass-border">
      <table className="min-w-full divide-y divide-glass-border" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold bg-white/[0.03] text-text-primary" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="px-4 py-3 text-sm text-text-secondary/80 border-t border-glass-border/50" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong className="font-semibold text-text-primary" {...props} />
  ),
  em: ({ node, ...props }) => (
    <em className="italic" {...props} />
  ),
};
