"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Crown, Users } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useAdmin, ADMIN_ROLE_LABELS } from "@/context/AdminContext";
import { GsapScrollReveal } from "@/components/shared/GsapScrollReveal";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/layout/PageShell";
import { AdminProofsSection } from "@/components/admin/AdminProofsSection";
import { AdminReferralsSection } from "@/components/admin/AdminReferralsSection";
import { AdminManageSection } from "@/components/admin/AdminManageSection";

export default function AdminPage() {
  const { user } = useUser();
  const { ready: adminReady, isAdmin, getRole } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/connexion");
      return;
    }
    if (adminReady && !isAdmin(user.email)) {
      router.push("/dashboard");
    }
  }, [user, router, adminReady, isAdmin]);

  if (!user || !adminReady || !isAdmin(user.email)) return null;

  const role = getRole(user.email);

  return (
    <PageShell maxWidth="3xl">
        <GsapScrollReveal>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-phantom-purple" />
            <h1 className="text-3xl md:text-4xl font-normal text-phantom-dark tracking-tight">
              Administration
            </h1>
          </div>
          <p className="text-phantom-gray mb-10">
            Connecté en tant que <strong>{user.email}</strong>
            {role === "owner" && (
              <Badge className="ml-2 gap-1">
                <Crown className="h-3 w-3" /> Propriétaire
              </Badge>
            )}
            {role === "manager" && (
              <Badge className="ml-2 gap-1">
                <Users className="h-3 w-3" /> {ADMIN_ROLE_LABELS.manager}
              </Badge>
            )}
            {role === "member" && (
              <Badge variant="outline" className="ml-2">
                {ADMIN_ROLE_LABELS.member}
              </Badge>
            )}
          </p>
        </GsapScrollReveal>

        <GsapScrollReveal>
          <AdminManageSection userEmail={user.email} />
        </GsapScrollReveal>

        <GsapScrollReveal>
          <div className="mb-12">
            <AdminReferralsSection userEmail={user.email} />
          </div>
        </GsapScrollReveal>

        <GsapScrollReveal>
          <div className="mb-12">
            <AdminProofsSection userEmail={user.email} />
          </div>
        </GsapScrollReveal>

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-phantom-purple hover:underline text-sm">
            ← Retour au dashboard
          </Link>
        </div>
    </PageShell>
  );
}
