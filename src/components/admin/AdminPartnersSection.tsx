"use client";

import { useState } from "react";
import { Handshake, Trash2, Save } from "lucide-react";
import { usePartners } from "@/context/PartnersContext";
import {
  createEmptyPartner,
  slugifyPartner,
  type Partner,
} from "@/lib/partners-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/context/LanguageContext";

interface AdminPartnersSectionProps {
  userEmail: string;
}

export function AdminPartnersSection({ userEmail }: AdminPartnersSectionProps) {
  const { t } = useTranslation();
  const { partners, upsertPartner, removePartner } = usePartners();
  const [draft, setDraft] = useState<Partner | null>(null);
  const [offersText, setOffersText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const startNew = () => {
    setDraft(createEmptyPartner(""));
    setOffersText("");
    setError("");
  };

  const loadForEdit = (p: Partner) => {
    setDraft({ ...p });
    setOffersText(p.offers.join("\n"));
    setError("");
  };

  const save = async () => {
    if (!draft?.name.trim()) {
      setError(t("admin.partnersNameRequired"));
      return;
    }
    setSaving(true);
    const payload: Partner = {
      ...draft,
      id: slugifyPartner(draft.id || draft.name),
      slug: slugifyPartner(draft.slug || draft.name),
      name: draft.name.trim(),
      offers: offersText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    };
    const result = await upsertPartner(payload, userEmail);
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? t("admin.partnersSaveError"));
      return;
    }
    setDraft(null);
    setOffersText("");
  };

  return (
    <section className="rounded-[32px] bg-phantom-surface border border-phantom-dark/5 p-6 md:p-8">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <Handshake className="h-6 w-6 text-phantom-purple" />
          <h2 className="text-xl font-semibold text-phantom-dark">{t("admin.partnersTitle")}</h2>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={startNew}>
          {t("admin.partnersAdd")}
        </Button>
      </div>
      <p className="text-sm text-phantom-gray mb-6">{t("admin.partnersHint")}</p>

      {draft && (
        <div className="space-y-3 rounded-[20px] bg-phantom-bg border border-phantom-dark/5 p-4 mb-6">
          <Input
            placeholder={t("admin.partnersNamePlaceholder")}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <Input
            placeholder={t("admin.partnersTaglinePlaceholder")}
            value={draft.tagline}
            onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
          />
          <textarea
            className="w-full p-3 rounded-[16px] border border-phantom-dark/10 bg-phantom-surface text-sm min-h-[80px]"
            placeholder={t("admin.partnersDescPlaceholder")}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
          <Input
            placeholder={t("admin.partnersWebsitePlaceholder")}
            value={draft.websiteUrl ?? ""}
            onChange={(e) => setDraft({ ...draft, websiteUrl: e.target.value })}
          />
          <Input
            placeholder={t("admin.partnersDiscordPlaceholder")}
            value={draft.discordUrl ?? ""}
            onChange={(e) => setDraft({ ...draft, discordUrl: e.target.value })}
          />
          <Input
            placeholder={t("admin.partnersLogoPlaceholder")}
            value={draft.logoUrl ?? ""}
            onChange={(e) => setDraft({ ...draft, logoUrl: e.target.value })}
          />
          <textarea
            className="w-full p-3 rounded-[16px] border border-phantom-dark/10 bg-phantom-surface text-sm min-h-[80px]"
            placeholder={t("admin.partnersOffersPlaceholder")}
            value={offersText}
            onChange={(e) => setOffersText(e.target.value)}
          />
          <textarea
            className="w-full p-3 rounded-[16px] border border-phantom-dark/10 bg-phantom-surface text-sm min-h-[60px]"
            placeholder={t("admin.partnersPromoPlaceholder")}
            value={draft.promoText ?? ""}
            onChange={(e) => setDraft({ ...draft, promoText: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
            />
            {t("admin.partnersFeatured")}
          </label>
          <Button type="button" onClick={save} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? t("admin.partnersSaving") : t("admin.partnersSave")}
          </Button>
        </div>
      )}

      {partners.length === 0 ? (
        <p className="text-sm text-phantom-gray text-center py-8">{t("admin.partnersEmpty")}</p>
      ) : (
        <div className="space-y-2">
          {partners.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 p-3 rounded-[16px] bg-phantom-bg border border-phantom-dark/5"
            >
              <div className="min-w-0">
                <p className="font-medium text-phantom-dark truncate">
                  {p.name}
                  {p.featured && (
                    <span className="ml-2 text-xs text-phantom-purple">★</span>
                  )}
                </p>
                <p className="text-xs text-phantom-gray truncate">{p.tagline || p.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button type="button" variant="outline" size="sm" onClick={() => loadForEdit(p)}>
                  {t("admin.partnersEdit")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                  onClick={() => removePartner(p.id, userEmail)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
    </section>
  );
}
