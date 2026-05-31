import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

export function GoogleOpinionIcon({ className, size = 32 }: IconProps) {
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
      <rect x="10" y="6" width="28" height="36" rx="4" fill="#FDFCFE" stroke="#3C315B" strokeWidth="2" />
      <path d="M16 14H32M16 20H32M16 26H26" stroke="#86848D" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="32" r="2" fill="#AB9FF2" />
      <circle cx="24" cy="32" r="2" fill="#AB9FF2" />
      <circle cx="18" cy="32" r="2" fill="#E2DFFE" stroke="#3C315B" strokeWidth="1" />
      <path
        d="M34 8L38 4L42 8"
        stroke="#4878D8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 4V12"
        stroke="#4878D8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M36 14L38 10L40 14"
        fill="#F5A623"
        stroke="#F5A623"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
