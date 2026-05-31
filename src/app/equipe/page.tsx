"use client";

import { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { PageShell } from "@/components/layout/PageShell";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { useTranslation } from "@/context/LanguageContext";
import type { TeamMemberPublic } from "@/lib/team-shared";
import { TEAM_ROLE_ORDER } from "@/lib/team-shared";

export default function TeamPage() {
  const { t } = useTranslation();
  const [members, setMembers] = useState<TeamMemberPublic[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { members?: TeamMemberPublic[] };
        const sorted = (data.members ?? []).sort(
          (a, b) =>
            TEAM_ROLE_ORDER[a.role] - TEAM_ROLE_ORDER[b.role] || a.order - b.order
        );
        setMembers(sorted);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const founders = members.filter((m) => m.role === "founder");
  const staff = members.filter((m) => m.role !== "founder");

  return (
    <PageShell>
      <ScrollReveal>
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-[20px] bg-phantom-purple/20 mb-4">
            <Users className="h-7 w-7 text-phantom-purple" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-phantom-dark tracking-tight mb-4">
            {t("team.title")}
          </h1>
          <p className="text-phantom-gray text-lg max-w-2xl mx-auto">{t("team.subtitle")}</p>
        </div>
      </ScrollReveal>

      {loading ? (
        <p className="text-center text-phantom-gray py-16">{t("common.loading")}</p>
      ) : members.length === 0 ? (
        <p className="text-center text-phantom-gray py-16">{t("team.empty")}</p>
      ) : (
        <div className="space-y-14">
          {founders.length > 0 && (
            <ScrollReveal>
              <section>
                <h2 className="text-xl font-semibold text-phantom-dark mb-6">{t("team.founders")}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {founders.map((member) => (
                    <TeamMemberCard key={member.discordId} member={member} />
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}

          {staff.length > 0 && (
            <ScrollReveal>
              <section>
                <h2 className="text-xl font-semibold text-phantom-dark mb-6">{t("team.staff")}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staff.map((member) => (
                    <TeamMemberCard key={member.discordId} member={member} />
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}
        </div>
      )}
    </PageShell>
  );
}
