"use client";

import { PageShell } from "@/components/layout/PageShell";
import { GsapScrollReveal } from "@/components/shared/GsapScrollReveal";
import { PartnerCard } from "@/components/partners/PartnerCard";
import { usePartners } from "@/context/PartnersContext";
import { useTranslation } from "@/context/LanguageContext";
import { siteConfig } from "@/lib/config";

export default function PartenairesPage() {
  const { t } = useTranslation();
  const { ready, partners } = usePartners();

  const featured = partners.filter((p) => p.featured);
  const others = partners.filter((p) => !p.featured);

  return (
    <PageShell>
      <GsapScrollReveal>
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-phantom-dark tracking-tight mb-4">
            {t("partners.title")}
          </h1>
          <p className="text-phantom-gray text-base sm:text-lg max-w-2xl mx-auto">
            {t("partners.subtitle")}
          </p>
        </div>
      </GsapScrollReveal>

      {!ready ? (
        <p className="text-center text-phantom-gray">{t("common.loading")}</p>
      ) : partners.length === 0 ? (
        <div className="text-center py-16 rounded-[24px] bg-phantom-surface border border-phantom-dark/5">
          <p className="text-phantom-gray mb-4">{t("partners.empty")}</p>
          <a
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="text-phantom-purple hover:underline font-medium"
          >
            {t("partners.contactUs")}
          </a>
        </div>
      ) : (
        <div className="space-y-12">
          {featured.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-phantom-dark mb-6">
                {t("partners.featured")}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((p) => (
                  <GsapScrollReveal key={p.id}>
                    <PartnerCard partner={p} />
                  </GsapScrollReveal>
                ))}
              </div>
            </section>
          )}
          {others.length > 0 && (
            <section>
              {featured.length > 0 && (
                <h2 className="text-xl font-semibold text-phantom-dark mb-6">
                  {t("partners.all")}
                </h2>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((p) => (
                  <GsapScrollReveal key={p.id}>
                    <PartnerCard partner={p} />
                  </GsapScrollReveal>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PageShell>
  );
}
