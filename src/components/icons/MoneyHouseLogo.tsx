import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

export function MoneyHouseLogo({ className, size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="40" height="40" rx="20" fill="#AB9FF2" />
      <path d="M20 8L26 14L20 20L14 14L20 8Z" fill="#3C315B" />
      <path
        d="M12 22L20 30L28 22"
        stroke="#FFFDF8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="18" r="2" fill="#FFFDF8" />
    </svg>
  );
}

/** @deprecated Use MoneyHouseLogo */
export const MoneyHubLogo = MoneyHouseLogo;
