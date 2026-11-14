import SplitText from "@/components/SplitText";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { LegalLinks } from "@/components/sections/legal-links";
import { Section } from "@/components/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <Section
      id="top"
      className="relative flex min-h-0 flex-1 items-center overflow-hidden pt-5 pb-4 sm:pt-8 sm:pb-8 lg:pt-12 lg:pb-10 xl:pt-12 xl:pb-10"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <Logo
          className="flex-col gap-3 sm:flex-row sm:gap-3.5"
          markClassName="size-9 sm:size-10 lg:size-11"
          wordmarkClassName="text-[1.05rem] sm:text-[1.1rem]"
        />

        <SplitText
          tag="h1"
          text="Every incident, explained and closed."
          splitType="words"
          effect="rise"
          mask
          duration={0.9}
          delay={45}
          threshold={0.05}
          textAlign="center"
          staggerFrom="center"
          className="mt-4 max-w-[18ch] text-[2.35rem] leading-[1.03] font-bold tracking-[-0.035em] text-foreground sm:mt-6 sm:text-[3.4rem] lg:mt-7 lg:text-[3.85rem] xl:text-[4.2rem]"
        />

        <p className="mt-4 max-w-[58ch] text-[0.95rem] leading-6 text-muted-foreground sm:mt-5 sm:text-[1.05rem] sm:leading-[1.7]">
          RCA Tracking System holds the incident, the cause type, the supporting
          evidence, the root cause statement, and the corrective and preventive
          actions in one record — so a close-out is something you can defend,
          not something you promise.
        </p>

        <div className="mt-6 flex w-full flex-col items-center justify-center gap-2.5 sm:mt-8 sm:w-auto sm:flex-row sm:gap-3">
          <Link
            href="/docs/getting-started/quick-start"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 w-full px-6 text-[0.9rem] sm:w-auto",
            )}
          >
            Get Started
          </Link>
          <Link
            href="/docs/getting-started/introduction"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 w-full px-6 text-[0.9rem] sm:w-auto",
            )}
          >
            Documentation
          </Link>
        </div>

        <p className="mt-3 text-[0.78rem] text-muted-foreground sm:mt-4">
          Already have an account?{" "}
          <Link
            href="/auth"
            className="font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            Sign in
          </Link>
        </p>

        <div className="mt-6 hidden items-center justify-center gap-2.5 text-[0.78rem] text-muted-foreground sm:mt-7 sm:flex">
          <span>Human or system. Evidenced, not assumed.</span>
        </div>

        <LegalLinks
          className="mt-2 justify-center text-[0.78rem] sm:mt-3"
          linkClassName="text-foreground/70"
          label="Terms and privacy"
        />
      </div>
    </Section>
  );
}
