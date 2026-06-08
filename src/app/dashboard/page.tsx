"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Clock, Bell, LogOut, Shield } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useAdmin } from "@/context/AdminContext";
import { apps } from "@/lib/data/apps";
import { AppCard } from "@/components/apps/AppCard";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PageShell } from "@/components/layout/PageShell";
import { useLanguage, useTranslation } from "@/context/LanguageContext";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { localizedApps } = useLanguage();
  const { user, favorites, history, notifications, logout, markNotificationRead } = useUser();
  const { isAdmin, ready: adminReady } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/connexion");
  }, [user, router]);

  if (!user) return null;

  const favoriteApps = localizedApps.filter((a) => favorites.includes(a.id));
  const historyApps = history
    .map((id) => localizedApps.find((a) => a.id === id))
    .filter(Boolean) as typeof localizedApps;

  return (
    <PageShell>
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-normal text-phantom-dark tracking-tight mb-2 truncate">
                {t("dashboard.hello", { name: user.name })}
              </h1>
              <p className="text-phantom-gray">{t("dashboard.subtitle")}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              {adminReady && isAdmin(user.email) && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                    <Shield className="h-4 w-4" />
                    {t("nav.admin")}
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={logout} className="gap-2 w-full sm:w-auto">
              <LogOut className="h-4 w-4" />
              {t("dashboard.logout")}
            </Button>
            </div>
          </div>
        </ScrollReveal>

        {notifications.filter((n) => !n.read).length > 0 && (
          <ScrollReveal>
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-phantom-dark mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("nav.notifications")}
              </h2>
              <div className="space-y-3">
                {notifications
                  .filter((n) => !n.read)
                  .map((n) => (
                    <div
                      key={n.id}
                      className="p-4 rounded-[20px] bg-phantom-purple/10 border border-phantom-purple/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <p className="text-phantom-dark text-sm flex-1 min-w-0">
                        {n.message}
                      </p>
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        className="text-xs text-phantom-purple hover:underline shrink-0 self-start sm:self-center"
                      >
                        {t("dashboard.markRead")}
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
              {t("dashboard.favorites")} ({favoriteApps.length})
            </h2>
            {favoriteApps.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteApps.map((app) => (
                  <AppCard key={app.id} app={apps.find((a) => a.id === app.id) ?? app} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-[32px] bg-phantom-surface border border-phantom-dark/5">
                <p className="text-phantom-gray mb-4">{t("dashboard.favoritesEmpty")}</p>
                <Link href="/apps">
                  <Button>{t("dashboard.discoverApps")}</Button>
                </Link>
              </div>
            )}
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section>
            <h2 className="text-xl font-semibold text-phantom-dark mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("dashboard.recentHistory")}
            </h2>
            {historyApps.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyApps.map((app) => (
                  <AppCard key={app.id} app={apps.find((a) => a.id === app.id) ?? app} />
                ))}
              </div>
            ) : (
              <p className="text-phantom-gray text-center py-8">
                {t("dashboard.historyEmpty")}
              </p>
            )}
          </section>
        </ScrollReveal>
    </PageShell>
  );
}
