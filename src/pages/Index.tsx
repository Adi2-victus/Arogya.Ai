
import { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  useEffect(() => {
    // Set page title
    document.title = "ArogyaAI+ | AI-Powered Healthcare Platform";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeatureSection />
      <StatsSection />
      <TestimonialSection />
      <CTASection />
    </div>
  );
};

export default Index;
