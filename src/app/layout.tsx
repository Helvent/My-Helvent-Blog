import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout/site-shell";
import { Toaster } from "sonner";
import { SITE } from "@/lib/constants";

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className={`${notoSansSC.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void-dark text-text-primary">
        <SiteShell>
          <main className="flex-1">{children}</main>
        </SiteShell>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(10, 10, 15, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#f0f0f5",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </body>
    </html>
  );
}
