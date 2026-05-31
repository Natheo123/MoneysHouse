import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEarnings(min?: number, max?: number): string {
  if (min && max) return `${min}€ à ${max}€/mois`;
  if (min) return `À partir de ${min}€/mois`;
  if (max) return `Jusqu'à ${max}€/mois`;
  return "Variables";
}
