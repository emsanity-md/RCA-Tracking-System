import { RadarField } from "@/components/background/radar-field";
import { Hero } from "@/components/sections/hero";
import { LandingFooter } from "@/components/sections/landing-footer";

export default function Home() {
  return (
    <>
      <RadarField />
      <main id="main" tabIndex={-1} className="flex w-full flex-1 flex-col">
        <Hero />
      </main>
      <LandingFooter />
    </>
  );
}
