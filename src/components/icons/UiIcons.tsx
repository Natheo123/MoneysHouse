import type { BlogIconId } from "@/types";
import { Coins, Zap, BadgeCheck, TrendingUp, Trophy, GitCompareArrows } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionIconId = "passive" | "easy" | "trusted";

const sectionIcons: Record<SectionIconId, typeof Coins> = {
  passive: Coins,
  easy: Zap,
  trusted: BadgeCheck,
};

const blogIcons: Record<BlogIconId, typeof TrendingUp> = {
  chart: TrendingUp,
  trophy: Trophy,
  compare: GitCompareArrows,
};

interface IconWrapProps {
  size?: number;
  className?: string;
}

export function SectionIcon({
  id,
  size = 40,
  className,
}: { id: SectionIconId } & IconWrapProps) {
  const Icon = sectionIcons[id];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-phantom-purple/25 text-phantom-dark",
        className
      )}
      style={{ width: size + 16, height: size + 16 }}
    >
      <Icon size={size} strokeWidth={1.75} aria-hidden />
    </span>
  );
}

export function BlogIcon({
  id,
  size = 40,
  className,
}: { id: BlogIconId } & IconWrapProps) {
  const Icon = blogIcons[id];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[20px] bg-phantom-purple/20 text-phantom-dark",
        className
      )}
      style={{ width: size + 24, height: size + 24 }}
    >
      <Icon size={size} strokeWidth={1.75} aria-hidden />
    </span>
  );
}
