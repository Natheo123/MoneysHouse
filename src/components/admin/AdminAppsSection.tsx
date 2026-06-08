"use client";

import { useState } from "react";
import { Sparkles, Trash2, Save, Search } from "lucide-react";
import { useApps } from "@/context/AppsContext";
import { slugifyAppName, type StoredCustomApp } from "@/lib/custom-apps-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useTranslation } from "@/context/LanguageContext";

interface AdminAppsSectionProps {
  userEmail: string;
}

export function AdminAppsSection({ userEmail }: AdminAppsSectionProps) {
  const { t } = useTranslation();
  const { customApps, researchApp, upsertCustomApp, removeCustomApp } = useApps();
  const [sourceUrl, setSourceUrl] = useState("");
  const [nameHint, setNameHint] = useState("");
  const [draft, setDraft] = useState<StoredCustomApp | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const runResearch = async () => {
    setError("");
    setLoading(true);
    const result = await researchApp(sourceUrl, nameHint, userEmail);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? t("admin.appsResearchError"));
      return;
    }
    setDraft(result.draft);
    setHints(result.hints);
  };

  const saveDraft = async () => {
    if (!draft) return;
    setSaving(true);
    setError("");
    const payload = {
      ...draft,
      id: slugifyAppName(draft.id || draft.name),
      slug: slugifyAppName(draft.slug || draft.name),
    };
    const result = await upsertCustomApp(payload, userEmail);
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? t("admin.appsSaveError"));
      return;
    }
    setDraft(null);
    setSourceUrl("");
    setNameHint("");
    setHints([]);
  };

  const loadForEdit = (app: StoredCustomApp) => {
    setDraft({ ...app });
    setSourceUrl(app.sourceUrl ?? "");
    setNameHint(app.name);
    setHints([]);
    setError("");
  };

  return (
    <section className="rounded-[32px] bg-phantom-surface border border-phantom-dark/5 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="h-6 w-6 text-phantom-purple" />
        <h2 className="text-xl font-semibold text-phantom-dark">{t("admin.appsTitle")}</h2>
      </div>
      <p className="text-sm text-phantom-gray mb-6">{t("admin.appsHint")}</p>

      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <Input
          placeholder={t("admin.appsUrlPlaceholder")}
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />
        <Input
          placeholder={t("admin.appsNamePlaceholder")}
          value={nameHint}
          onChange={(e) => setNameHint(e.target.value)}
        />
      </div>
      <Button type="button" onClick={runResearch} disabled={loading || !sourceUrl.trim()}>
        <Search className="h-4 w-4 mr-2" />
        {loading ? t("admin.appsResearching") : t("admin.appsResearchBtn")}
      </Button>

      {hints.length > 0 && (
        <ul className="mt-4 text-sm text-phantom-gray list-disc pl-5 space-y-1">
          {hints.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}

      {draft && (
        <div className="mt-6 space-y-3 rounded-[20px] bg-phantom-bg border border-phantom-dark/5 p-4">
          <Input
            placeholder="Nom"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <Input
            placeholder="Slug (URL)"
            value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: e.target.value, id: e.target.value })}
          />
          <textarea
            className="w-full p-3 rounded-[16px] border border-phantom-dark/10 bg-phantom-surface text-sm min-h-[100px]"
            placeholder="Description"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
          <textarea
            className="w-full p-3 rounded-[16px] border border-phantom-dark/10 bg-phantom-surface text-sm min-h-[60px]"
            placeholder="Description courte"
            value={draft.shortDescription}
            onChange={(e) => setDraft({ ...draft, shortDescription: e.target.value })}
          />
          <ImageUploadField
            kind="app"
            userEmail={userEmail}
            value={draft.logoUrl}
            nameHint={draft.slug || draft.name}
            onChange={(url) => setDraft({ ...draft, logoUrl: url || undefined })}
            hint={t("admin.appsLogoHint")}
            placeholder={t("admin.appsLogoPlaceholder")}
            fallbackLabel={t("admin.uploadOrUrl")}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="Couleur (#AB9FF2)"
              value={draft.color}
              onChange={(e) => setDraft({ ...draft, color: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Revenus min"
              value={draft.earningsMin ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, earningsMin: e.target.value ? Number(e.target.value) : undefined })
              }
            />
            <Input
              type="number"
              placeholder="Revenus max"
              value={draft.earningsMax ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, earningsMax: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-phantom-dark">
            <input
              type="checkbox"
              checked={Boolean(draft.featured)}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
            />
            {t("admin.appsFeatured")}
          </label>
          <Button type="button" onClick={saveDraft} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? t("admin.appsSaving") : t("admin.appsPublish")}
          </Button>
        </div>
      )}

      {customApps.length > 0 && (
        <div className="mt-8">
          <h3 className="font-medium text-phantom-dark mb-3">{t("admin.appsCustomList")}</h3>
          <div className="space-y-2">
            {customApps.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between gap-3 p-3 rounded-[16px] bg-phantom-bg border border-phantom-dark/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {app.logoUrl ? (
                    <img
                      src={app.logoUrl}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-phantom-dark/10 bg-white shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-phantom-lavender/50 flex items-center justify-center text-sm font-bold text-phantom-purple shrink-0">
                      {app.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-phantom-dark truncate">{app.name}</p>
                    <p className="text-xs text-phantom-gray">/apps/{app.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button type="button" variant="outline" size="sm" onClick={() => loadForEdit(app)}>
                    {t("admin.appsEdit")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    onClick={() => removeCustomApp(app.id, userEmail)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
    </section>
  );
}
