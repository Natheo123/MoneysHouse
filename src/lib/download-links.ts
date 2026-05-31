/** Liens officiels vérifiés — éviter les fiches Play Store retirées. */

export const OFFICIAL_DOWNLOADS = {
  earnapp: {
    signup: "https://earnapp.com/",
    download: "https://earnapp.com/download/",
    androidPlay: "https://play.google.com/store/apps/details?id=com.brd.earnrewards",
  },
  honeygain: {
    signup: "https://dashboard.honeygain.com/sign-up",
    dashboard: "https://dashboard.honeygain.com/",
    download: "https://www.honeygain.com/download/",
  },
  mcmoney: {
    site: "https://www.cm.com/mcmoney/",
  },
  moneySms: {
    siteFr: "https://moneysmsapp.com/fr/",
    installGuide: "https://moneysmsapp.com/security-center",
  },
  gamby: {
    site: "https://www.gamby.app/",
    androidPlay: "https://play.google.com/store/apps/details?id=com.gamby.app&hl=fr",
    iosAppStore: "https://apps.apple.com/fr/app/gamby-sports-prediction-game/id6477860898",
  },
  googleOpinionRewards: {
    androidPlay:
      "https://play.google.com/store/apps/details?id=com.google.android.apps.paidtasks&hl=fr",
    iosAppStore: "https://apps.apple.com/fr/app/google-opinion-rewards/id1227019728",
  },
  attapoll: {
    siteFrBe: "https://attapoll.com/fr-be/",
    androidPlay:
      "https://play.google.com/store/apps/details?id=com.requapp.requ&hl=fr",
    iosAppStore: "https://apps.apple.com/fr/app/attapoll-sondages-remuneres/id1107631390",
  },
  eureka: {
    site: "https://eurekasurveys.com/",
    androidPlay:
      "https://play.google.com/store/apps/details?id=com.eureka.android&hl=fr",
    iosAppStore:
      "https://apps.apple.com/fr/app/eureka-earn-money-for-surveys/id1466346433",
  },
} as const;

export function isNativeStoreUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return (
      host.includes("play.google.com") ||
      host.includes("apps.apple.com") ||
      host.includes("itunes.apple.com")
    );
  } catch {
    return false;
  }
}

/** Ouvre un lien de téléchargement (stores = même onglet, plus fiable sur mobile). */
export function openDownloadUrl(url: string): void {
  if (isNativeStoreUrl(url)) {
    window.location.assign(url);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
