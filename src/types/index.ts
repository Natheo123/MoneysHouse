export type Platform = "android" | "ios" | "windows" | "linux" | "web";
export type Category = "passive" | "surveys" | "sms" | "bandwidth";
export type Difficulty = "very-easy" | "easy" | "medium" | "hard";

export interface AppLink {
  platform: Platform | "signup" | "web";
  label: string;
  url: string;
}

export interface App {
  id: string;
  slug: string;
  name: string;
  color: string;
  description: string;
  shortDescription: string;
  earningsMin?: number;
  earningsMax?: number;
  earningsLabel?: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  platforms: Platform[];
  categories: Category[];
  downloadLinks: AppLink[];
  referralCode?: string;
  referralInstructions: string;
  hasReferral?: boolean;
  howItWorks: string;
  advantages: string[];
  disadvantages: string[];
  tutorial: { step: number; title: string; description: string }[];
  faq: { question: string; answer: string }[];
  featured?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export interface Review {
  id: string;
  appId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AppRatingStats {
  average: number;
  count: number;
}
