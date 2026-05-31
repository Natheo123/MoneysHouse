"use client";

import { useEffect, useMemo, useState } from "react";
import { Gift, Plus, Trash2 } from "lucide-react";
import { apps } from "@/lib/data/apps";
import { useReferrals, type AppReferrals } from "@/context/ReferralContext";
import { AdminAppSearchSelect } from "@/components/admin/AdminAppSearchSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const referralApps = apps.filter((a) => a.hasReferral !== false);

interface AdminReferralsSectionProps {
  userEmail: string;
}

export function AdminReferralsSection({ userEmail }: AdminReferralsSectionProps) {
  const {
    ready: referralsReady,
    referrals,
    getReferralBonus,
    addReferralCode,
    removeReferralCode,
    addReferralLink,
    removeReferralLink,
    setReferralBonus,
    refreshReferrals,
  } = useReferrals();

  const [selectedAppId, setSelectedAppId] = useState(referralApps[0]?.id ?? "");
  const [bonusFields, setBonusFields] = useState<Record<string, { title: string; description: string }>>({});
  const [newCode, setNewCode] = useState("");
  const [newLink, setNewLink] = useState("");
  const [referralError, setReferralError] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [savingReferral, setSavingReferral] = useState<string | null>(null);

  useEffect(() => {
    if (!referralsReady) return;
    const bonuses: Record<string, { title: string; description: string }> = {};
    for (const app of referralApps) {
      bonuses[app.id] = getReferralBonus(app.id) ?? { title: "", description: "" };
    }
    setBonusFields(bonuses);
  }, [referralsReady, referrals, getReferralBonus]);

  const appOptions = useMemo(
    () =>
      referralApps.map((app) => {
        const data = referrals[app.id] ?? { codes: [], links: [] };
        const parts: string[] = [];
        if (data.codes.length > 0) {
          parts.push(`${data.codes.length} code${data.codes.length > 1 ? "s" : ""}`);
        }
        if (data.links.length > 0) {
          parts.push(`${data.links.length} lien${data.links.length > 1 ? "s" : ""}`);
        }
        return {
          id: app.id,
          name: app.name,
          subtitle: parts.length > 0 ? parts.join(" · ") : "Aucun parrainage configuré",
        };
      }),
    [referrals]
  );

  const selectedApp = referralApps.find((a) => a.id === selectedAppId);
  const data: AppReferrals = referrals[selectedAppId] ?? { codes: [], links: [] };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddReferralCode = async () => {
    const code = newCode.trim();
    if (!code || !selectedAppId) return;

    setSavingReferral(`${selectedAppId}-code`);
    const result = await addReferralCode(selectedAppId, code, userEmail);
    setSavingReferral(null);

    if (!result.ok) {
      setReferralError((prev) => ({
        ...prev,
        [`${selectedAppId}-code`]: result.error ?? "Code vide ou déjà enregistré.",
      }));
      return;
    }

    setNewCode("");
    setReferralError((prev) => ({ ...prev, [`${selectedAppId}-code`]: "" }));
    flashSaved();
  };

  const handleRemoveReferralCode = async (code: string) => {
    setSavingReferral(`${selectedAppId}-code`);
    await removeReferralCode(selectedAppId, code, userEmail);
    setSavingReferral(null);
    flashSaved();
  };

  const handleAddReferralLink = async () => {
    const link = newLink.trim();
    if (!link || !selectedAppId) return;

    setSavingReferral(`${selectedAppId}-link`);
    const result = await addReferralLink(selectedAppId, link, userEmail);
    setSavingReferral(null);

    if (!result.ok) {
      setReferralError((prev) => ({
        ...prev,
        [`${selectedAppId}-link`]: result.error ?? "Lien invalide ou déjà enregistré.",
      }));
      return;
    }

    setNewLink("");
    setReferralError((prev) => ({ ...prev, [`${selectedAppId}-link`]: "" }));
    flashSaved();
  };

  const handleRemoveReferralLink = async (link: string) => {
    setSavingReferral(`${selectedAppId}-link`);
    await removeReferralLink(selectedAppId, link, userEmail);
    setSavingReferral(null);
    flashSaved();
  };

  const handleSaveBonus = async () => {
    const fields = bonusFields[selectedAppId];
    if (!fields?.title.trim()) {
      setReferralError((prev) => ({
        ...prev,
        [`${selectedAppId}-bonus`]: "Le titre du bonus est requis (ex. : 50 Gambz offerts).",
      }));
      return;
    }

    setSavingReferral(`${selectedAppId}-bonus`);
    const result = await setReferralBonus(selectedAppId, fields, userEmail);
    setSavingReferral(null);

    if (!result.ok) {
      setReferralError((prev) => ({
        ...prev,
        [`${selectedAppId}-bonus`]: result.error ?? "Erreur lors de l'enregistrement.",
      }));
      return;
    }

    setReferralError((prev) => ({ ...prev, [`${selectedAppId}-bonus`]: "" }));
    flashSaved();
  };

  return (
    <section className="p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5">
      <h2 className="text-xl font-semibold text-phantom-dark mb-2 flex items-center gap-2">
        <Gift className="h-5 w-5" />
        Parrainage
      </h2>
      <p className="text-sm text-phantom-gray mb-6">
        Choisissez une application, puis définissez le bonus marketing, les codes et les liens.
        Visible pour tous les visiteurs. Les modifications sont enregistrées automatiquement.
      </p>

      {!referralsReady && (
        <p className="text-sm text-phantom-gray mb-4">Chargement des parrainages…</p>
      )}

      {saved && (
        <p className="text-green-600 text-sm mb-4">Parrainage enregistré avec succès.</p>
      )}

      <div className="mb-6">
        <AdminAppSearchSelect
          apps={appOptions}
          value={selectedAppId}
          onChange={(appId) => {
            setSelectedAppId(appId);
            setNewCode("");
            setNewLink("");
            setReferralError({});
          }}
        />
      </div>

      {selectedApp && (
        <div className="rounded-[20px] bg-phantom-bg p-5">
          <p className="text-phantom-dark font-medium mb-4">{selectedApp.name}</p>

          <p className="text-xs text-phantom-gray uppercase tracking-wide mb-2">
            Message marketing (gain exact)
          </p>
          <div className="space-y-3 mb-6 p-4 rounded-[16px] bg-phantom-surface border border-phantom-purple/20">
            <Input
              value={bonusFields[selectedAppId]?.title ?? ""}
              onChange={(e) =>
                setBonusFields((prev) => ({
                  ...prev,
                  [selectedAppId]: {
                    title: e.target.value,
                    description: prev[selectedAppId]?.description ?? "",
                  },
                }))
              }
              placeholder="Ex. : 50 Gambz offerts"
            />
            <Input
              value={bonusFields[selectedAppId]?.description ?? ""}
              onChange={(e) =>
                setBonusFields((prev) => ({
                  ...prev,
                  [selectedAppId]: {
                    title: prev[selectedAppId]?.title ?? "",
                    description: e.target.value,
                  },
                }))
              }
              placeholder="Ex. : Inscrivez-vous avec notre code et recevez 50 Gambz sur Gamby."
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveBonus}
              disabled={savingReferral === `${selectedAppId}-bonus`}
            >
              {savingReferral === `${selectedAppId}-bonus` ? "Enregistrement…" : "Enregistrer le bonus"}
            </Button>
            {referralError[`${selectedAppId}-bonus`] && (
              <p className="text-red-500 text-sm">{referralError[`${selectedAppId}-bonus`]}</p>
            )}
          </div>

          <p className="text-xs text-phantom-gray uppercase tracking-wide mb-2">Codes</p>
          {data.codes.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {data.codes.map((code) => (
                <li
                  key={code}
                  className="flex items-center justify-between gap-3 p-3 rounded-[16px] bg-phantom-surface border border-phantom-dark/5"
                >
                  <code className="text-sm font-semibold text-phantom-dark tracking-wide">{code}</code>
                  <button
                    onClick={() => handleRemoveReferralCode(code)}
                    disabled={savingReferral === `${selectedAppId}-code`}
                    className="p-2 rounded-full hover:bg-red-100 text-phantom-gray hover:text-red-500 transition-colors shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-phantom-gray mb-4">Aucun code enregistré.</p>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <Input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleAddReferralCode();
              }}
              placeholder="Nouveau code parrainage"
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={() => void handleAddReferralCode()}
              disabled={!newCode.trim() || savingReferral === `${selectedAppId}-code`}
              className="gap-1 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
          {referralError[`${selectedAppId}-code`] && (
            <p className="text-red-500 text-sm mb-4">{referralError[`${selectedAppId}-code`]}</p>
          )}

          <p className="text-xs text-phantom-gray uppercase tracking-wide mb-2">Liens</p>
          {data.links.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {data.links.map((link) => (
                <li
                  key={link}
                  className="flex items-center justify-between gap-3 p-3 rounded-[16px] bg-phantom-surface border border-phantom-dark/5"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-phantom-purple hover:underline break-all"
                  >
                    {link}
                  </a>
                  <button
                    onClick={() => handleRemoveReferralLink(link)}
                    disabled={savingReferral === `${selectedAppId}-link`}
                    className="p-2 rounded-full hover:bg-red-100 text-phantom-gray hover:text-red-500 transition-colors shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-phantom-gray mb-4">Aucun lien enregistré.</p>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleAddReferralLink();
              }}
              placeholder="https://exemple.com/parrainage"
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={() => void handleAddReferralLink()}
              disabled={!newLink.trim() || savingReferral === `${selectedAppId}-link`}
              className="gap-1 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
          {referralError[`${selectedAppId}-link`] && (
            <p className="text-red-500 text-sm mt-2">{referralError[`${selectedAppId}-link`]}</p>
          )}
        </div>
      )}

      <Button variant="outline" size="sm" className="mt-6" onClick={() => refreshReferrals()}>
        Actualiser depuis le serveur
      </Button>
    </section>
  );
}
