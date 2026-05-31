"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { getReferralCode, hasReferralProgram } from "@/lib/referrals";
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
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (open) setCode(getReferralCode(app.id));
  }, [open, app.id]);

  const showCode = hasReferralProgram(app.id) && code.length > 0;

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const continueDownload = () => {
    window.open(linkUrl, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-phantom-purple/30 flex items-center justify-center mb-3">
            <Gift className="h-6 w-6 text-phantom-dark" />
          </div>
          <DialogTitle>N&apos;oubliez pas le code de parrainage !</DialogTitle>
        </DialogHeader>

        <p className="text-phantom-gray text-sm mb-4">
          Avant de continuer vers <strong className="text-phantom-dark">{linkLabel}</strong> pour{" "}
          <strong className="text-phantom-dark">{app.name}</strong>, pensez à utiliser le code
          parrainage Money&apos;s House pour profiter des bonus.
        </p>

        {showCode ? (
          <div className="rounded-[20px] bg-phantom-bg border border-phantom-purple/30 p-4 mb-4">
            <p className="text-xs text-phantom-gray mb-2 uppercase tracking-wide">Code parrainage</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-2xl font-bold text-phantom-dark tracking-wider">{code}</code>
              <Button size="sm" variant="outline" onClick={copyCode} className="gap-2 shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copié" : "Copier"}
              </Button>
            </div>
          </div>
        ) : hasReferralProgram(app.id) ? (
          <div className="rounded-[20px] bg-phantom-bg border border-phantom-dark/10 p-4 mb-4">
            <p className="text-sm text-phantom-gray">
              Le code parrainage sera bientôt disponible. Rejoignez notre{" "}
              <a
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-phantom-purple hover:underline"
              >
                Discord
              </a>{" "}
              pour l&apos;obtenir.
            </p>
          </div>
        ) : (
          <p className="text-sm text-phantom-gray mb-4">
            {app.name} ne propose pas de programme de parrainage. Vous pouvez continuer directement.
          </p>
        )}

        <details className="mb-6 text-sm">
          <summary className="cursor-pointer text-phantom-purple font-medium hover:underline">
            Comment entrer le code sur {app.name} ?
          </summary>
          <p className="mt-3 text-phantom-gray leading-relaxed whitespace-pre-line">
            {app.referralInstructions}
          </p>
        </details>

        <div className="flex flex-col sm:flex-row gap-3">
          {showCode && (
            <Button variant="outline" onClick={copyCode} className="flex-1 gap-2">
              <Copy className="h-4 w-4" />
              Copier le code
            </Button>
          )}
          <Button onClick={continueDownload} className="flex-1">
            Continuer vers {linkLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
