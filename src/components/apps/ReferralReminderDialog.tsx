"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/config";
import { openDownloadUrl } from "@/lib/download-links";
import { useUser } from "@/context/UserContext";
import { logSiteEvent } from "@/lib/site-event-log-client";
import { useReferrals, hasReferralProgram } from "@/context/ReferralContext";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import type { App } from "@/types";

interface ReferralReminderDialogProps {
  app: App;
  linkLabel: string;
  linkUrl: string;
  linkPlatform?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReferralReminderDialog({
  app,
  linkLabel,
  linkUrl,
  linkPlatform,
  open,
  onOpenChange,
}: ReferralReminderDialogProps) {
  const { t } = useTranslation();
  const { user } = useUser();
  const { getLocalizedApp, locale } = useLanguage();
  const localizedApp = getLocalizedApp(app);
  const { ready, getReferralData, getReferralBonus, refreshReferrals } = useReferrals();
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  useEffect(() => {
    if (open) refreshReferrals();
  }, [open, refreshReferrals]);

  const referrals = getReferralData(app.id);
  const bonus = getReferralBonus(app.id);
  const hasContent = referrals.codes.length > 0 || referrals.links.length > 0;
  const showReferral = hasReferralProgram(app.id, app) && (hasContent || bonus);

  const bonusTitle =
    locale === "en" && localizedApp.referralBonusTitle
      ? localizedApp.referralBonusTitle
      : bonus?.title ?? localizedApp.referralBonusTitle ?? "";
  const bonusDescription =
    locale === "en" && localizedApp.referralBonusDescription
      ? localizedApp.referralBonusDescription
      : bonus?.description ?? localizedApp.referralBonusDescription ?? "";

  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const continueDownload = () => {
    logSiteEvent({
      type: "app-link",
      appId: app.id,
      appName: app.name,
      appSlug: app.slug,
      linkLabel,
      linkUrl,
      platform: linkPlatform,
      userName: user?.name,
      userEmail: user?.email,
    });
    openDownloadUrl(linkUrl);
    onOpenChange(false);
  };

  const copyAndContinue = async () => {
    if (referrals.codes[0]) await copyValue(referrals.codes[0]);
    continueDownload();
  };

  const primaryCode = referrals.codes[0];
  const primaryLink = referrals.links[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {!ready ? (
          <p className="text-sm text-phantom-gray py-4">{t("referralDialog.loading")}</p>
        ) : showReferral && bonus ? (
          <>
            <div
              className="rounded-[24px] p-5 mb-2 -mt-1 border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${app.color}55 0%, ${app.color}18 100%)`,
              }}
            >
              <Badge className="mb-3 bg-phantom-dark text-phantom-cream border-0 gap-1">
                <Sparkles className="h-3 w-3" />
                {t("referralDialog.exclusiveBadge")}
              </Badge>
              <DialogHeader className="text-left space-y-2 p-0">
                <DialogTitle className="text-2xl md:text-3xl font-bold text-phantom-dark leading-tight">
                  {bonusTitle}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-phantom-dark/80 mt-2 leading-relaxed">{bonusDescription}</p>
            </div>

            <p
              className="text-sm text-phantom-gray"
              dangerouslySetInnerHTML={{
                __html: t("referralDialog.installVia", { app: app.name, link: linkLabel })
                  .replace(app.name, `<strong class="text-phantom-dark">${app.name}</strong>`)
                  .replace(linkLabel, `<strong class="text-phantom-dark">${linkLabel}</strong>`),
              }}
            />

            {(primaryCode || primaryLink) && (
              <div className="rounded-[20px] bg-phantom-bg border-2 border-phantom-purple/40 p-4 space-y-4">
                <p className="text-xs font-semibold text-phantom-purple uppercase tracking-wide">
                  {t("referralDialog.bonusAccess")}
                </p>

                {primaryCode && (
                  <div>
                    <p className="text-xs text-phantom-gray mb-1">{t("referralDialog.referralCode")}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <code className="text-lg sm:text-2xl font-black text-phantom-dark tracking-wider break-all">
                        {primaryCode}
                      </code>
                      <Button
                        size="sm"
                        onClick={() => copyValue(primaryCode)}
                        className="gap-2 shrink-0"
                      >
                        {copiedValue === primaryCode ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copiedValue === primaryCode ? t("referral.copied") : t("referral.copy")}
                      </Button>
                    </div>
                  </div>
                )}

                {referrals.codes.length > 1 && (
                  <div className="space-y-2 pt-1 border-t border-phantom-dark/5">
                    <p className="text-xs text-phantom-gray">{t("referralDialog.otherCodes")}</p>
                    {referrals.codes.slice(1).map((code) => (
                      <div key={code} className="flex items-center justify-between gap-2">
                        <code className="text-sm font-bold text-phantom-dark">{code}</code>
                        <Button size="sm" variant="outline" onClick={() => copyValue(code)} className="h-8">
                          {copiedValue === code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {referrals.links.map((link) => (
                  <div key={link} className="pt-1 border-t border-phantom-dark/5">
                    <p className="text-xs text-phantom-gray mb-1">{t("referralDialog.directLink")}</p>
                    <div className="flex items-center gap-2">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-phantom-purple hover:underline break-all flex-1"
                      >
                        {link}
                      </a>
                      <Button size="sm" variant="outline" asChild className="h-8 shrink-0">
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <ol className="text-sm text-phantom-gray space-y-1.5 list-decimal list-inside">
              <li>{t("referralDialog.step1")}</li>
              <li>{t("referralDialog.step2", { app: app.name })}</li>
              <li>{t("referralDialog.step3", { bonus: bonusTitle.toLowerCase() })}</li>
            </ol>
          </>
        ) : showReferral && hasContent ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("referralDialog.titleDefault")}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-phantom-gray mb-4">
              {t("referralDialog.useBefore", { link: linkLabel })}
            </p>
            {referrals.codes.map((code) => (
              <div key={code} className="flex justify-between items-center p-3 rounded-[16px] bg-phantom-bg">
                <code className="font-bold">{code}</code>
                <Button size="sm" variant="outline" onClick={() => copyValue(code)}>
                  {t("referral.copy")}
                </Button>
              </div>
            ))}
          </>
        ) : hasReferralProgram(app.id, app) ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("referralDialog.soonTitle")}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-phantom-gray">
              {t("referralDialog.soonTextBefore")}
              <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" className="text-phantom-purple hover:underline">
                Discord
              </a>
              {t("referralDialog.soonTextAfter")}
            </p>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("referralDialog.continueTitle", { link: linkLabel })}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-phantom-gray">
              {t("referralDialog.noProgram", { app: app.name })}
            </p>
          </>
        )}

        <details className="text-sm">
          <summary className="cursor-pointer text-phantom-purple font-medium hover:underline">
            {t("referralDialog.howTo", { app: app.name })}
          </summary>
          <p className="mt-3 text-phantom-gray leading-relaxed whitespace-pre-line">
            {localizedApp.referralInstructions}
          </p>
        </details>

        <div className="flex flex-col gap-3">
          {ready && showReferral && primaryCode && (
            <Button onClick={copyAndContinue} className="w-full gap-2">
              <Copy className="h-4 w-4" />
              {t("referralDialog.copyAndContinue")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {ready && showReferral && !primaryCode && primaryLink && (
            <Button asChild className="w-full gap-2">
              <a href={primaryLink} target="_blank" rel="noopener noreferrer" onClick={() => onOpenChange(false)}>
                {t("referralDialog.useReferralLink")}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button
            onClick={continueDownload}
            variant={ready && showReferral && (primaryCode || primaryLink) ? "outline" : "default"}
            className="w-full"
          >
            {showReferral
              ? t("referralDialog.continueTo", { link: linkLabel })
              : t("referralDialog.openLink", { link: linkLabel })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
