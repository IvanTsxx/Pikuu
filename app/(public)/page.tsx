import { Features } from "@/app/(public)/_components/landing/features";
import { FinalCTA } from "@/app/(public)/_components/landing/final-cta";
import { Hero } from "@/app/(public)/_components/landing/hero";
import { HowItWorks } from "@/app/(public)/_components/landing/how-it-works";
import Pricing from "./_components/landing/pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <FinalCTA />
    </main>
  );
}
