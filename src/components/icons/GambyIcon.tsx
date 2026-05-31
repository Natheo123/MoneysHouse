import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

export function GambyIcon({ className, size = 32 }: IconProps) {
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
      <rect x="4" y="4" width="40" height="40" rx="12" fill="#0F172A" />
      <circle cx="24" cy="24" r="11" fill="#22C55E" fillOpacity="0.15" stroke="#22C55E" strokeWidth="2" />
      <path
        d="M24 14C19.5 14 16 17.5 16 22C16 26.5 19.5 30 24 30C28.5 30 32 26.5 32 22"
        stroke="#22C55E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 14V30M16 22H32"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      <path
        d="M18 34L24 38L30 34"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="38" r="1.5" fill="#FACC15" />
    </svg>
  );
}
