"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Clock, Bell, LogOut, Shield } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { isAdmin } from "@/lib/admin";
import { apps } from "@/lib/data/apps";
import { AppCard } from "@/components/apps/AppCard";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export default function DashboardPage() {
  const { user, favorites, history, notifications, logout, markNotificationRead } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/connexion");
  }, [user, router]);

  if (!user) return null;

  const favoriteApps = apps.filter((a) => favorites.includes(a.id));
  const historyApps = history
    .map((id) => apps.find((a) => a.id === id))
    .filter(Boolean) as typeof apps;

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-normal text-phantom-dark tracking-tight mb-2">
                Bonjour, {user.name}
              </h1>
              <p className="text-phantom-gray">Votre tableau de bord Money&apos;s House</p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin(user.email) && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
            </div>
          </div>
        </ScrollReveal>

        {notifications.filter((n) => !n.read).length > 0 && (
          <ScrollReveal>
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-phantom-dark mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </h2>
              <div className="space-y-3">
                {notifications
                  .filter((n) => !n.read)
                  .map((n) => (
                    <div
                      key={n.id}
                      className="p-4 rounded-[20px] bg-phantom-purple/10 border border-phantom-purple/20 flex items-center justify-between"
                    >
                      <p className="text-phantom-dark text-sm">{n.message}</p>
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        className="text-xs text-phantom-purple hover:underline"
                      >
                        Marquer lu
                      </button>
                    </div>
                  ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-phantom-dark mb-6 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Mes favoris ({favoriteApps.length})
            </h2>
            {favoriteApps.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-[32px] bg-phantom-surface border border-phantom-dark/5">
                <p className="text-phantom-gray mb-4">Aucun favori pour le moment</p>
                <Link href="/apps">
                  <Button>Découvrir les applications</Button>
                </Link>
              </div>
            )}
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section>
            <h2 className="text-xl font-semibold text-phantom-dark mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Historique récent
            </h2>
            {historyApps.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            ) : (
              <p className="text-phantom-gray text-center py-8">
                Consultez des applications pour les voir ici
              </p>
            )}
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
