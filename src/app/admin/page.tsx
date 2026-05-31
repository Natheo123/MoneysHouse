"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, UserPlus, Trash2, Gift, Crown, Plus } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useAdmin, OWNER_EMAIL } from "@/context/AdminContext";
import { apps } from "@/lib/data/apps";
import {
  getAllReferralData,
  getReferralBonus,
  addReferralCode,
  removeReferralCode,
  addReferralLink,
  removeReferralLink,
  setReferralBonus,
  type AppReferrals,
} from "@/lib/referrals";
import { GsapScrollReveal } from "@/components/shared/GsapScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const { user } = useUser();
  const {
    adminEmails,
    ready: adminReady,
    isAdmin,
    isOwner,
    addAdmin,
    removeAdmin,
  } = useAdmin();
  const router = useRouter();
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminError, setAdminError] = useState("");
  const [referralData, setReferralData] = useState<Record<string, AppReferrals>>({});
  const [bonusFields, setBonusFields] = useState<Record<string, { title: string; description: string }>>({});
  const [newCodes, setNewCodes] = useState<Record<string, string>>({});
  const [newLinks, setNewLinks] = useState<Record<string, string>>({});
  const [referralError, setReferralError] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/connexion");
      return;
    }
    if (adminReady && !isAdmin(user.email)) {
      router.push("/dashboard");
    }
  }, [user, router, adminReady, isAdmin]);

  useEffect(() => {
    if (user && isAdmin(user.email)) {
      setReferralData(getAllReferralData());
      const bonuses: Record<string, { title: string; description: string }> = {};
      for (const app of apps.filter((a) => a.hasReferral !== false)) {
        bonuses[app.id] = getReferralBonus(app.id) ?? { title: "", description: "" };
      }
      setBonusFields(bonuses);
    }
  }, [user, isAdmin]);

  if (!user || !adminReady || !isAdmin(user.email)) return null;

  const userIsOwner = isOwner(user.email);

  const handleAddAdmin = async () => {
    setAdminError("");
    setAddingAdmin(true);
    const result = await addAdmin(newAdminEmail, user.email);
    setAddingAdmin(false);
    if (result.ok) {
      setNewAdminEmail("");
    } else {
      setAdminError(result.error ?? "Erreur");
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    const result = await removeAdmin(email, user.email);
    if (!result.ok) setAdminError(result.error ?? "Erreur");
    else setAdminError("");
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddReferralCode = (appId: string) => {
    const code = newCodes[appId]?.trim() ?? "";
    if (!code) return;

    const added = addReferralCode(appId, code);
    if (!added) {
      setReferralError((prev) => ({
        ...prev,
        [`${appId}-code`]: "Code vide ou déjà enregistré.",
      }));
      return;
    }

    setReferralData(getAllReferralData());
    setNewCodes((prev) => ({ ...prev, [appId]: "" }));
    setReferralError((prev) => ({ ...prev, [`${appId}-code`]: "" }));
    flashSaved();
  };

  const handleRemoveReferralCode = (appId: string, code: string) => {
    removeReferralCode(appId, code);
    setReferralData(getAllReferralData());
    flashSaved();
  };

  const handleAddReferralLink = (appId: string) => {
    const link = newLinks[appId]?.trim() ?? "";
    if (!link) return;

    const added = addReferralLink(appId, link);
    if (!added) {
      setReferralError((prev) => ({
        ...prev,
        [`${appId}-link`]: "Lien invalide ou déjà enregistré.",
      }));
      return;
    }

    setReferralData(getAllReferralData());
    setNewLinks((prev) => ({ ...prev, [appId]: "" }));
    setReferralError((prev) => ({ ...prev, [`${appId}-link`]: "" }));
    flashSaved();
  };

  const handleRemoveReferralLink = (appId: string, link: string) => {
    removeReferralLink(appId, link);
    setReferralData(getAllReferralData());
    flashSaved();
  };

  const handleSaveBonus = (appId: string) => {
    const fields = bonusFields[appId];
    if (!fields?.title.trim()) {
      setReferralError((prev) => ({
        ...prev,
        [`${appId}-bonus`]: "Le titre du bonus est requis (ex. : 50 Gambz offerts).",
      }));
      return;
    }
    setReferralBonus(appId, fields);
    setReferralError((prev) => ({ ...prev, [`${appId}-bonus`]: "" }));
    flashSaved();
  };

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <GsapScrollReveal>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-phantom-purple" />
            <h1 className="text-3xl md:text-4xl font-normal text-phantom-dark tracking-tight">
              Administration
            </h1>
          </div>
          <p className="text-phantom-gray mb-10">
            Connecté en tant que <strong>{user.email}</strong>
            {userIsOwner && (
              <Badge className="ml-2 gap-1">
                <Crown className="h-3 w-3" /> Propriétaire
              </Badge>
            )}
          </p>
        </GsapScrollReveal>

        {userIsOwner && (
          <GsapScrollReveal>
            <section className="mb-12 p-8 rounded-[32px] bg-phantom-surface border border-phantom-dark/5">
              <h2 className="text-xl font-semibold text-phantom-dark mb-2 flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Gestion des administrateurs
              </h2>
              <p className="text-sm text-phantom-gray mb-6">
                Propriétaire : {OWNER_EMAIL}. Les admins ajoutés ici ont accès sur tous les
                appareils une fois connectés avec le même email. En production, configurez{" "}
                <code className="text-xs bg-phantom-bg px-1.5 py-0.5 rounded">GITHUB_TOKEN</code>{" "}
                sur Vercel pour enregistrer les changements.
              </p>

              <div className="flex gap-2 mb-6">
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddAdmin();
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddAdmin}
                  disabled={!newAdminEmail.trim() || addingAdmin}
                >
                  {addingAdmin ? "Ajout..." : "Ajouter"}
                </Button>
              </div>
              {adminError && <p className="text-red-500 text-sm mb-4">{adminError}</p>}

              <ul className="space-y-2">
                {adminEmails.map((email) => (
                  <li
                    key={email}
                    className="flex items-center justify-between p-4 rounded-[20px] bg-phantom-bg"
                  >
                    <span className="text-phantom-dark text-sm">{email}</span>
                    <div className="flex items-center gap-2">
                      {isOwner(email) && (
                        <Badge variant="secondary" className="text-xs">
                          Propriétaire
                        </Badge>
                      )}
                      {!isOwner(email) && userIsOwner && (
                        <button
                          onClick={() => handleRemoveAdmin(email)}
                          className="p-2 rounded-full hover:bg-red-100 text-phantom-gray hover:text-red-500 transition-colors"
                          title="Retirer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </GsapScrollReveal>
        )}

        <GsapScrollReveal>
          <section className="p-8 rounded-[32px] bg-phantom-surface border border-phantom-dark/5">
            <h2 className="text-xl font-semibold text-phantom-dark mb-2 flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Parrainage
            </h2>
            <p className="text-sm text-phantom-gray mb-6">
              Définissez le bonus marketing affiché (ex. « 50 Gambz offerts »), puis ajoutez codes et
              liens par application. Visible dans la popup, les listes et la FAQ.
            </p>

            {saved && (
              <p className="text-green-600 text-sm mb-4">Parrainage enregistré avec succès.</p>
            )}

            <div className="space-y-8">
              {apps
                .filter((a) => a.hasReferral !== false)
                .map((app) => {
                  const data = referralData[app.id] ?? { codes: [], links: [] };
                  return (
                    <div key={app.id} className="rounded-[20px] bg-phantom-bg p-5">
                      <p className="text-phantom-dark font-medium mb-4">{app.name}</p>

                      <p className="text-xs text-phantom-gray uppercase tracking-wide mb-2">
                        Message marketing (gain exact)
                      </p>
                      <div className="space-y-3 mb-6 p-4 rounded-[16px] bg-phantom-surface border border-phantom-purple/20">
                        <Input
                          value={bonusFields[app.id]?.title ?? ""}
                          onChange={(e) =>
                            setBonusFields((prev) => ({
                              ...prev,
                              [app.id]: {
                                title: e.target.value,
                                description: prev[app.id]?.description ?? "",
                              },
                            }))
                          }
                          placeholder="Ex. : 50 Gambz offerts"
                        />
                        <Input
                          value={bonusFields[app.id]?.description ?? ""}
                          onChange={(e) =>
                            setBonusFields((prev) => ({
                              ...prev,
                              [app.id]: {
                                title: prev[app.id]?.title ?? "",
                                description: e.target.value,
                              },
                            }))
                          }
                          placeholder="Ex. : Inscrivez-vous avec notre code et recevez 50 Gambz sur Gamby."
                        />
                        <Button size="sm" variant="outline" onClick={() => handleSaveBonus(app.id)}>
                          Enregistrer le bonus
                        </Button>
                        {referralError[`${app.id}-bonus`] && (
                          <p className="text-red-500 text-sm">{referralError[`${app.id}-bonus`]}</p>
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
                              <code className="text-sm font-semibold text-phantom-dark tracking-wide">
                                {code}
                              </code>
                              <button
                                onClick={() => handleRemoveReferralCode(app.id, code)}
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

                      <div className="flex gap-2 mb-6">
                        <Input
                          value={newCodes[app.id] ?? ""}
                          onChange={(e) =>
                            setNewCodes((prev) => ({
                              ...prev,
                              [app.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddReferralCode(app.id);
                          }}
                          placeholder="Nouveau code parrainage"
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddReferralCode(app.id)}
                          disabled={!(newCodes[app.id]?.trim())}
                          className="gap-1 shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter
                        </Button>
                      </div>
                      {referralError[`${app.id}-code`] && (
                        <p className="text-red-500 text-sm mb-4">{referralError[`${app.id}-code`]}</p>
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
                                onClick={() => handleRemoveReferralLink(app.id, link)}
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

                      <div className="flex gap-2">
                        <Input
                          value={newLinks[app.id] ?? ""}
                          onChange={(e) =>
                            setNewLinks((prev) => ({
                              ...prev,
                              [app.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddReferralLink(app.id);
                          }}
                          placeholder="https://exemple.com/parrainage"
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddReferralLink(app.id)}
                          disabled={!(newLinks[app.id]?.trim())}
                          className="gap-1 shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter
                        </Button>
                      </div>
                      {referralError[`${app.id}-link`] && (
                        <p className="text-red-500 text-sm mt-2">{referralError[`${app.id}-link`]}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        </GsapScrollReveal>

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-phantom-purple hover:underline text-sm">
            ← Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
