import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { EarnAppIcon } from "./EarnAppIcon";
import { HoneygainIcon } from "./HoneygainIcon";
import { McMoneyIcon } from "./McMoneyIcon";
import { MoneySmsIcon } from "./MoneySmsIcon";
import { GoogleOpinionIcon } from "./GoogleOpinionIcon";

interface AppLogoProps {
  appId: string;
  size?: number;
  className?: string;
}

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  earnapp: EarnAppIcon,
  honeygain: HoneygainIcon,
  mcmoney: McMoneyIcon,
  "money-sms": MoneySmsIcon,
  "google-opinion-rewards": GoogleOpinionIcon,
};

export function AppLogo({ appId, size = 32, className }: AppLogoProps) {
  const Icon = iconMap[appId];
  if (!Icon) {
    return (
      <div
        className={cn("rounded-full bg-phantom-purple/30 flex items-center justify-center font-bold text-phantom-dark", className)}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        ?
      </div>
    );
  }
  return <Icon size={size} className={className} />;
}
