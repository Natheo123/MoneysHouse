import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards, FeaturedApps } from "@/components/home/FeatureCards";
import { CtaSection } from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <FeaturedApps />
      <CtaSection />
    </>
  );
}
