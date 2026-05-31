import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

export function EarnAppIcon({ className, size = 32 }: IconProps) {
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
      <circle cx="24" cy="24" r="22" fill="#AB9FF2" fillOpacity="0.25" />
      <circle cx="24" cy="24" r="14" stroke="#3C315B" strokeWidth="2" fill="#E2DFFE" />
      <path
        d="M24 14V34M19 19C19 16.79 21.24 15 24 15C26.76 15 29 16.79 29 19C29 21.21 26.76 23 24 23C21.24 23 19 24.79 19 27C19 29.21 21.24 31 24 31C26.76 31 29 29.21 29 27"
        stroke="#3C315B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M8 24C8 24 12 20 16 24C20 28 24 24 24 24"
        stroke="#4878D8"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M40 24C40 24 36 28 32 24C28 20 24 24 24 24"
        stroke="#4878D8"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
