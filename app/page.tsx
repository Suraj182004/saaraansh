import Image from "next/image";
import { Button } from "@/components/ui/button";

import HeroSection from "@/components/home/hero-section";
import DemoSection from "@/components/home/demo-section";
import FeaturesSection from "@/components/home/features-section";
import HowItWorksSection from "@/components/home/how-it-works-sec
tion";
import TestimonialsSection from "@/components/home/testimonials-section";
import PricingSection from "@/components/home/pricing-section";
import FaqSection from "@/components/home/faq-section";
import CTASection from "@/components/home/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <main>
        <HeroSection />
        <DemoSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CTASection />
      </main>
    </div>
  );
}
