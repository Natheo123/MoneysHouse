"use client";

import { useEffect, useState } from "react";
import { Heart, Save, ExternalLink } from "lucide-react";
import { useTips } from "@/context/TipsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/context/LanguageContext";

interface AdminTipsSectionProps {
  userEmail: string;
}

export function AdminTipsSection({ userEmail }: AdminTipsSectionProps) {
  const { t } = useTranslation();
  const { settings, updateTips } = useTips();
  const [enabled, setEnabled] = useState(settings.enabled);
  const [paypalUrl, setPaypalUrl] = useState(settings.paypalUrl);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEnabled(settings.enabled);
    setPaypalUrl(settings.paypalUrl);
  }, [settings]);

  const save = async () => {
    setSaving(true);
    setError("");
    const result = await updateTips({ enabled, paypalUrl }, userEmail);
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? t("admin.tipsSaveError"));
    }
  };

  return (
    <section className="rounded-[32px] bg-phantom-surface border border-phantom-dark/5 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Heart className="h-6 w-6 text-phantom-purple" />
        <h2 className="text-xl font-semibold text-phantom-dark">{t("admin.tipsTitle")}</h2>
      </div>
      <p className="text-sm text-phantom-gray mb-6">{t("admin.tipsHint")}</p>

      <div className="space-y-4 rounded-[20px] bg-phantom-bg border border-phantom-dark/5 p-4">
        <Input
          placeholder={t("admin.tipsPaypalPlaceholder")}
          value={paypalUrl}
          onChange={(e) => setPaypalUrl(e.target.value)}
        />
        <p className="text-xs text-phantom-gray">{t("admin.tipsPaypalHelp")}</p>

        <label className="flex items-center gap-2 text-sm text-phantom-dark">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          {t("admin.tipsEnabled")}
        </label>

        {paypalUrl.trim() && (
          <a
            href={paypalUrl.startsWith("http") ? paypalUrl : `https://${paypalUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-phantom-purple hover:underline"
          >
            {t("admin.tipsPreview")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}

        <Button type="button" onClick={save} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? t("admin.tipsSaving") : t("admin.tipsSave")}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
    </section>
  );
}
