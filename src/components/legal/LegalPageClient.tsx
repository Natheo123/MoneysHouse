"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/context/LanguageContext";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getLegalPage, type LegalPageId } from "@/lib/i18n/legal-pages";

export function LegalPageClient({ pageId }: { pageId: LegalPageId }) {
  const { locale, t } = useLanguage();
  const page = getLegalPage(locale, pageId);

  return (
    <LegalPageLayout
      title={page.title}
      description={page.description}
      updatedAt={page.updatedAt}
      updatedAtLabel={t("common.updatedAt")}
      sections={page.sections}
    >
      {pageId === "about" && (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-phantom-purple px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            {page.discordButton}
          </a>
          <Link
            href="/apps"
            className="inline-flex items-center justify-center rounded-full border border-phantom-dark/10 px-6 py-3 text-sm font-medium text-phantom-dark hover:bg-phantom-lavender/50 transition-colors"
          >
            {page.viewAppsButton}
          </Link>
        </div>
      )}
      {pageId === "terms" && page.seeAlsoPrivacy && (
        <p className="text-sm text-phantom-gray">
          {page.seeAlsoPrivacy}{" "}
          <Link href="/confidentialite" className="text-phantom-purple hover:underline">
            {page.privacyLinkLabel}
          </Link>
          .
        </p>
      )}
    </LegalPageLayout>
  );
}
