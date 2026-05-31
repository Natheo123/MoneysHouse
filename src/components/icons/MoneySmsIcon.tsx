import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

export function MoneySmsIcon({ className, size = 32 }: IconProps) {
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
        d="M8 10C8 7.79 9.79 6 12 6H36C38.21 6 40 7.79 40 10V30C40 32.21 38.21 34 36 34H18L10 42V34H12C9.79 34 8 32.21 8 30V10Z"
        fill="#3C315B"
        fillOpacity="0.08"
        stroke="#3C315B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 16H34M14 22H28M14 28H22"
        stroke="#3C315B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="36" cy="36" r="10" fill="#AB9FF2" stroke="#3C315B" strokeWidth="1.5" />
      <path
        d="M36 32V40M32.5 34.5C32.5 34.5 33.5 32 36 32C38.5 32 39.5 34.5 39.5 34.5M32.5 37.5C32.5 37.5 33.5 40 36 40C38.5 40 39.5 37.5 39.5 37.5"
        stroke="#3C315B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
