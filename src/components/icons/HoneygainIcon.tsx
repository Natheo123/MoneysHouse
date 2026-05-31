import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

export function HoneygainIcon({ className, size = 32 }: IconProps) {
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
      <path
        d="M24 6L28.5 8.5L30 13.5L28.5 18.5L24 21L19.5 18.5L18 13.5L19.5 8.5L24 6Z"
        fill="#F5A623"
        fillOpacity="0.3"
        stroke="#F5A623"
        strokeWidth="1.5"
      />
      <path
        d="M14 20L17 22L17.5 26L15 29L11 29L8.5 26L9 22L14 20Z"
        fill="#4878D8"
        fillOpacity="0.2"
        stroke="#4878D8"
        strokeWidth="1.5"
      />
      <path
        d="M34 20L37 22L37.5 26L35 29L31 29L28.5 26L29 22L34 20Z"
        fill="#4878D8"
        fillOpacity="0.2"
        stroke="#4878D8"
        strokeWidth="1.5"
      />
      <path
        d="M18 32C18 28 20.5 26 24 26C27.5 26 30 28 30 32V38H18V32Z"
        fill="#F5A623"
        stroke="#3C315B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <ellipse cx="24" cy="26" rx="8" ry="3" fill="#FFD966" stroke="#3C315B" strokeWidth="1.5" />
      <path d="M22 34H26" stroke="#3C315B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
