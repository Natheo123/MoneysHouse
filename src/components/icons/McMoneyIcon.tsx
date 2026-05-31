import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

export function McMoneyIcon({ className, size = 32 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect x="12" y="6" width="24" height="36" rx="4" fill="#E2DFFE" stroke="#3C315B" strokeWidth="2" />
      <rect x="16" y="10" width="16" height="22" rx="2" fill="#FDFCFE" stroke="#3C315B" strokeWidth="1.5" />
      <circle cx="24" cy="36" r="2" fill="#3C315B" />
      <rect x="18" y="14" width="12" height="3" rx="1.5" fill="#AB9FF2" />
      <rect x="18" y="20" width="8" height="2" rx="1" fill="#86848D" opacity="0.5" />
      <rect x="18" y="24" width="10" height="2" rx="1" fill="#86848D" opacity="0.5" />
      <circle cx="34" cy="14" r="8" fill="#AB9FF2" stroke="#3C315B" strokeWidth="1.5" />
      <path
        d="M34 11V17M31.5 13.5H36.5"
        stroke="#3C315B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
