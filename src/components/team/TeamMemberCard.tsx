"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TeamMemberPublic } from "@/lib/team-shared";
import { useTranslation } from "@/context/LanguageContext";

const roleBadgeClass: Record<string, string> = {
  founder: "bg-phantom-purple text-white border-0",
  admin: "bg-phantom-dark text-phantom-cream border-0",
  moderator: "bg-blue-600 text-white border-0",
  member: "bg-phantom-bg text-phantom-dark border border-phantom-dark/10",
};

export function TeamMemberCard({ member }: { member: TeamMemberPublic }) {
  const { t } = useTranslation();
  const profile = member.profile;
  const displayName = profile?.globalName || profile?.username || `User ${member.discordId.slice(-4)}`;
  const username = profile?.username ? `@${profile.username}` : member.discordId;
  const banner = profile?.bannerUrl;
  const accent = profile?.accentColor ? `#${profile.accentColor.toString(16).padStart(6, "0")}` : "#AB9FF2";

  return (
    <article className="rounded-[24px] overflow-hidden border border-phantom-dark/10 bg-phantom-surface shadow-sm hover:shadow-md transition-shadow">
      <div
        className="h-24 sm:h-28 relative"
        style={{
          background: banner
            ? `url(${banner}) center/cover no-repeat`
            : `linear-gradient(135deg, ${accent} 0%, #5865F2 100%)`,
        }}
      />

      <div className="px-5 pb-5 -mt-10 relative">
        <div className="flex items-end gap-4">
          <img
            src={profile?.avatarUrl ?? `https://cdn.discordapp.com/embed/avatars/0.png`}
            alt={displayName}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full border-4 border-phantom-surface bg-phantom-charcoal object-cover shrink-0"
          />
          <div className="pb-1 min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-phantom-dark truncate">{displayName}</h3>
            <p className="text-sm text-phantom-gray truncate">{username}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge className={roleBadgeClass[member.role] ?? roleBadgeClass.member}>
            {t(`team.roles.${member.role}`)}
          </Badge>
          <span className="text-xs text-phantom-gray font-mono">ID: {member.discordId}</span>
        </div>

        {profile?.profileUrl && (
          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#5865F2] hover:underline"
          >
            {t("team.viewDiscord")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
