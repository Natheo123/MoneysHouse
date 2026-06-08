"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoneyHouseLogo } from "@/components/icons/MoneyHouseLogo";
import { useTranslation } from "@/context/LanguageContext";
import { useTips } from "@/context/TipsContext";

export function Footer() {
  const { t } = useTranslation();
  const { settings: tipsSettings } = useTips();

  const footerSections = [
    {
      title: t("footer.product"),
      links: [
        { href: "/apps", label: t("nav.apps") },
        { href: "/classement", label: t("nav.ranking") },
        { href: "/comparateur", label: t("nav.compare") },
        { href: "/dashboard", label: "Dashboard" },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { href: "/blog", label: t("nav.blog") },
        { href: "/faq", label: t("nav.faq") },
        { href: "/apps/earnapp", label: "EarnApp" },
        { href: "/apps/honeygain", label: "Honeygain" },
        { href: "/apps/gamby", label: "Gamby" },
        { href: "/apps/attapoll", label: "AttaPoll" },
        { href: "/apps/eureka", label: "Eureka Surveys" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { href: "/a-propos", label: t("footer.about") },
        { href: "/equipe", label: t("footer.team") },
        { href: siteConfig.links.discord, label: t("nav.contact"), external: true },
        { href: "/confidentialite", label: t("footer.privacy") },
        { href: "/conditions", label: t("footer.terms") },
      ],
    },
  ];

  return (
    <footer className="bg-phantom-surface border-t border-phantom-dark/5 pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto section-x">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 mb-12 sm:mb-16">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <MoneyHouseLogo size={40} />
              <span className="text-lg sm:text-xl font-semibold text-phantom-dark">
                {siteConfig.name}
              </span>
            </Link>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder={t("footer.emailPlaceholder")} className="flex-1 min-w-0" />
              <Button className="w-full sm:w-auto shrink-0">{t("nav.signup")}</Button>
            </div>
            <p className="text-sm text-phantom-gray mt-3">
              {t("footer.newsletter", { name: siteConfig.name })}
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-phantom-dark mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-phantom-gray hover:text-phantom-purple transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-phantom-gray hover:text-phantom-purple transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-phantom-dark/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-phantom-gray">
            © 2026 {siteConfig.name}. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-sm text-phantom-gray">
            <Link href="/conditions" className="hover:text-phantom-purple transition-colors">
              {t("footer.terms")}
            </Link>
            <Link href="/confidentialite" className="hover:text-phantom-purple transition-colors">
              {t("footer.privacy")}
            </Link>
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-phantom-purple transition-colors"
            >
              Discord
            </a>
            {tipsSettings.enabled && tipsSettings.paypalUrl && (
              <a
                href={tipsSettings.paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-phantom-purple transition-colors"
              >
                {t("tips.cta")}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
