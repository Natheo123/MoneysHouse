"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, UserPlus, Trash2, Gift, Crown } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { apps } from "@/lib/data/apps";
import {
  getAllAdminEmails,
  addAdmin,
  removeAdmin,
  isAdmin,
  isOwner,
  OWNER_EMAIL,
} from "@/lib/admin";
import { getAllReferralCodes, setReferralCode } from "@/lib/referrals";
import { GsapScrollReveal } from "@/components/shared/GsapScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/config";

export default function AdminPage() {
  const { user } = useUser();
  const router = useRouter();
  const [admins, setAdmins] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminError, setAdminError] = useState("");
  const [referralCodes, setReferralCodes] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/connexion");
      return;
    }
    if (!isAdmin(user.email)) {
      router.push("/dashboard");
      return;
    }
    setAdmins(getAllAdminEmails());
    setReferralCodes(getAllReferralCodes());
  }, [user, router]);

  if (!user || !isAdmin(user.email)) return null;

  const userIsOwner = isOwner(user.email);

  const handleAddAdmin = () => {
    setAdminError("");
    const result = addAdmin(newAdminEmail, user.email);
    if (result.ok) {
      setAdmins(getAllAdminEmails());
      setNewAdminEmail("");
    } else {
      setAdminError(result.error ?? "Erreur");
    }
  };

  const handleRemoveAdmin = (email: string) => {
    const result = removeAdmin(email, user.email);
    if (result.ok) setAdmins(getAllAdminEmails());
    else setAdminError(result.error ?? "Erreur");
  };

  const handleSaveReferral = (appId: string, code: string) => {
    setReferralCode(appId, code);
    setReferralCodes(getAllReferralCodes());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
                Propriétaire : {OWNER_EMAIL}. Ajoutez des admins par email — ils auront accès à
                ce panneau et pourront gérer les codes parrainage.
              </p>

              <div className="flex gap-2 mb-6">
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddAdmin} disabled={!newAdminEmail.trim()}>
                  Ajouter
                </Button>
              </div>
              {adminError && <p className="text-red-500 text-sm mb-4">{adminError}</p>}

              <ul className="space-y-2">
                {admins.map((email) => (
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
              Ces codes s&apos;affichent dans la popup avant chaque téléchargement.
            </p>

            {saved && (
              <p className="text-green-600 text-sm mb-4">Codes enregistrés avec succès.</p>
            )}

            <div className="space-y-6">
              {apps
                .filter((a) => a.hasReferral !== false)
                .map((app) => (
                  <div key={app.id} className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-phantom-dark font-medium w-40 shrink-0">
                      {app.name}
                    </span>
                    <Input
                      value={referralCodes[app.id] ?? ""}
                      onChange={(e) =>
                        setReferralCodes((prev) => ({
                          ...prev,
                          [app.id]: e.target.value,
                        }))
                      }
                      placeholder="Code parrainage"
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveReferral(app.id, referralCodes[app.id] ?? "")}
                    >
                      Enregistrer
                    </Button>
                  </div>
                ))}
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
