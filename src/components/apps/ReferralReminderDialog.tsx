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
import { getReferralData, getReferralBonus, hasReferralProgram } from "@/lib/referrals";
import type { App } from "@/types";

interface ReferralReminderDialogProps {
  app: App;
  linkLabel: string;
  linkUrl: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReferralReminderDialog({
  app,
  linkLabel,
  linkUrl,
  open,
  onOpenChange,
}: ReferralReminderDialogProps) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [referrals, setReferrals] = useState({ codes: [] as string[], links: [] as string[] });
  const [bonus, setBonus] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    if (open) {
      setReferrals(getReferralData(app.id));
      setBonus(getReferralBonus(app.id));
    }
  }, [open, app.id]);

  const hasContent = referrals.codes.length > 0 || referrals.links.length > 0;
  const showReferral = hasReferralProgram(app.id) && (hasContent || bonus);

  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const continueDownload = () => {
    window.open(linkUrl, "_blank", "noopener,noreferrer");
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
        {showReferral && bonus ? (
          <>
            <div
              className="rounded-[24px] p-5 mb-2 -mt-1 border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${app.color}55 0%, ${app.color}18 100%)`,
              }}
            >
              <Badge className="mb-3 bg-phantom-dark text-phantom-cream border-0 gap-1">
                <Sparkles className="h-3 w-3" />
                Bonus exclusif Money&apos;s House
              </Badge>
              <DialogHeader className="text-left space-y-2 p-0">
                <DialogTitle className="text-2xl md:text-3xl font-bold text-phantom-dark leading-tight">
                  {bonus.title}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-phantom-dark/80 mt-2 leading-relaxed">{bonus.description}</p>
            </div>

            <p className="text-sm text-phantom-gray">
              Installez <strong className="text-phantom-dark">{app.name}</strong> via{" "}
              <strong className="text-phantom-dark">{linkLabel}</strong> et récupérez votre bonus
              en utilisant notre parrainage ci-dessous.
            </p>

            {(primaryCode || primaryLink) && (
              <div className="rounded-[20px] bg-phantom-bg border-2 border-phantom-purple/40 p-4 space-y-4">
                <p className="text-xs font-semibold text-phantom-purple uppercase tracking-wide">
                  Votre accès au bonus
                </p>

                {primaryCode && (
                  <div>
                    <p className="text-xs text-phantom-gray mb-1">Code parrain</p>
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-2xl font-black text-phantom-dark tracking-wider">
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
                        {copiedValue === primaryCode ? "Copié !" : "Copier"}
                      </Button>
                    </div>
                  </div>
                )}

                {referrals.codes.length > 1 && (
                  <div className="space-y-2 pt-1 border-t border-phantom-dark/5">
                    <p className="text-xs text-phantom-gray">Autres codes</p>
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
                    <p className="text-xs text-phantom-gray mb-1">Lien parrain direct</p>
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
              <li>Copiez le code ou ouvrez le lien parrain</li>
              <li>Inscrivez-vous sur {app.name}</li>
              <li>Recevez <strong className="text-phantom-dark">{bonus.title.toLowerCase()}</strong></li>
            </ol>
          </>
        ) : showReferral && hasContent ? (
          <>
            <DialogHeader>
              <DialogTitle>Profitez du parrainage Money&apos;s House</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-phantom-gray mb-4">
              Utilisez notre parrainage avant de continuer vers {linkLabel}.
            </p>
            {/* fallback minimal if no bonus configured */}
            {referrals.codes.map((code) => (
              <div key={code} className="flex justify-between items-center p-3 rounded-[16px] bg-phantom-bg">
                <code className="font-bold">{code}</code>
                <Button size="sm" variant="outline" onClick={() => copyValue(code)}>Copier</Button>
              </div>
            ))}
          </>
        ) : hasReferralProgram(app.id) ? (
          <>
            <DialogHeader>
              <DialogTitle>Bonus bientôt disponible</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-phantom-gray">
              Rejoignez notre{" "}
              <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" className="text-phantom-purple hover:underline">
                Discord
              </a>{" "}
              pour obtenir le code parrain et le bonus associé.
            </p>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Continuer vers {linkLabel}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-phantom-gray">
              {app.name} ne propose pas de programme de parrainage.
            </p>
          </>
        )}

        <details className="text-sm">
          <summary className="cursor-pointer text-phantom-purple font-medium hover:underline">
            Comment activer le bonus sur {app.name} ?
          </summary>
          <p className="mt-3 text-phantom-gray leading-relaxed whitespace-pre-line">
            {app.referralInstructions}
          </p>
        </details>

        <div className="flex flex-col gap-3">
          {showReferral && primaryCode && (
            <Button onClick={copyAndContinue} className="w-full gap-2">
              <Copy className="h-4 w-4" />
              Copier le code &amp; continuer
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {showReferral && !primaryCode && primaryLink && (
            <Button asChild className="w-full gap-2">
              <a href={primaryLink} target="_blank" rel="noopener noreferrer" onClick={() => onOpenChange(false)}>
                Utiliser le lien parrain
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button
            onClick={continueDownload}
            variant={showReferral && (primaryCode || primaryLink) ? "outline" : "default"}
            className="w-full"
          >
            {showReferral ? `Continuer vers ${linkLabel}` : `Ouvrir ${linkLabel}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
