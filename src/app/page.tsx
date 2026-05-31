import { HeroSection } from "@/components/home/HeroSection";
import { PhantomStackSection } from "@/components/home/PhantomStackSection";
import { FeaturedApps } from "@/components/home/FeatureCards";
import { CtaSection } from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PhantomStackSection />
      <FeaturedApps />
      <CtaSection />
    </>
  );
}
