import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

interface LegalPageLayoutProps {
  title: string;
  description: string;
  updatedAt: string;
  updatedAtLabel: string;
  sections: LegalSection[];
  children?: ReactNode;
}

export function LegalPageLayout({
  title,
  description,
  updatedAt,
  updatedAtLabel,
  sections,
  children,
}: LegalPageLayoutProps) {
  return (
    <PageShell maxWidth="3xl">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-phantom-dark tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-phantom-gray text-base sm:text-lg max-w-2xl mx-auto">{description}</p>
        <p className="text-sm text-phantom-gray/70 mt-3">
          {updatedAtLabel} {updatedAt}
        </p>
      </div>

      <div className="rounded-[24px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5 p-6 sm:p-10 space-y-8 sm:space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl sm:text-2xl font-semibold text-phantom-dark mb-3 sm:mb-4">
              {section.title}
            </h2>
            <div className="space-y-3 text-phantom-gray text-base leading-relaxed">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
        {children}
      </div>
    </PageShell>
  );
}
