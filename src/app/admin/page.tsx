"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, UserPlus, Trash2, Gift, Crown, Plus } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useAdmin, OWNER_EMAIL } from "@/context/AdminContext";
import { apps } from "@/lib/data/apps";
import {
  getAllReferralCodes,
  addReferralCode,
  removeReferralCode,
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
  const [referralCodes, setReferralCodes] = useState<Record<string, string[]>>({});
  const [newCodes, setNewCodes] = useState<Record<string, string>>({});
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
      setReferralCodes(getAllReferralCodes());
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

  const handleAddReferral = (appId: string) => {
    const code = newCodes[appId]?.trim() ?? "";
    if (!code) return;

    const added = addReferralCode(appId, code);
    if (!added) {
      setReferralError((prev) => ({
        ...prev,
        [appId]: "Code vide ou déjà enregistré.",
      }));
      return;
    }

    setReferralCodes(getAllReferralCodes());
    setNewCodes((prev) => ({ ...prev, [appId]: "" }));
    setReferralError((prev) => ({ ...prev, [appId]: "" }));
    flashSaved();
  };

  const handleRemoveReferral = (appId: string, code: string) => {
    removeReferralCode(appId, code);
    setReferralCodes(getAllReferralCodes());
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
              Codes de parrainage
            </h2>
            <p className="text-sm text-phantom-gray mb-6">
              Ajoutez plusieurs codes par application. Ils s&apos;affichent tous dans la popup avant
              chaque téléchargement.
            </p>

            {saved && (
              <p className="text-green-600 text-sm mb-4">Codes enregistrés avec succès.</p>
            )}

            <div className="space-y-8">
              {apps
                .filter((a) => a.hasReferral !== false)
                .map((app) => {
                  const codes = referralCodes[app.id] ?? [];
                  return (
                    <div key={app.id} className="rounded-[20px] bg-phantom-bg p-5">
                      <p className="text-phantom-dark font-medium mb-4">{app.name}</p>

                      {codes.length > 0 ? (
                        <ul className="space-y-2 mb-4">
                          {codes.map((code) => (
                            <li
                              key={code}
                              className="flex items-center justify-between gap-3 p-3 rounded-[16px] bg-phantom-surface border border-phantom-dark/5"
                            >
                              <code className="text-sm font-semibold text-phantom-dark tracking-wide">
                                {code}
                              </code>
                              <button
                                onClick={() => handleRemoveReferral(app.id, code)}
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

                      <div className="flex gap-2">
                        <Input
                          value={newCodes[app.id] ?? ""}
                          onChange={(e) =>
                            setNewCodes((prev) => ({
                              ...prev,
                              [app.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddReferral(app.id);
                          }}
                          placeholder="Nouveau code parrainage"
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddReferral(app.id)}
                          disabled={!(newCodes[app.id]?.trim())}
                          className="gap-1 shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter
                        </Button>
                      </div>
                      {referralError[app.id] && (
                        <p className="text-red-500 text-sm mt-2">{referralError[app.id]}</p>
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
