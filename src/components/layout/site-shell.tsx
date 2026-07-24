import type { ReactNode } from "react";
import { StarField } from "@/components/effects/star-field";
import { AmbientBlobs } from "@/components/effects/ambient-blobs";
import { ReadingProgress } from "@/components/effects/reading-progress";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <StarField />
      <AmbientBlobs />
      <ReadingProgress />
      <Header />
      {children}
      <Footer />
    </>
  );
}