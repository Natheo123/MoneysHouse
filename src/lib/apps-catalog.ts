import type { App } from "@/types";

export function getFeaturedAppsFromList(list: App[]): App[] {
  return list.filter((a) => a.featured);
}

export function getTopByEarningsFromList(list: App[]): App[] {
  return [...list].sort((a, b) => (b.earningsMax ?? 0) - (a.earningsMax ?? 0));
}

export function getEasiestAppsFromList(list: App[]): App[] {
  const order = { "very-easy": 0, easy: 1, medium: 2, hard: 3 };
  return [...list].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
}
