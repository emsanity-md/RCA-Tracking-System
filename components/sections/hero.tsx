import SplitText from "@/components/SplitText";
import { Logo } from "@/components/logo";
import { Section } from "@/components/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <Section
      id="top"
      className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <Logo
          className="flex-col gap-3 sm:flex-row sm:gap-3.5"
          markClassName="size-11"
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
          className="mt-7 max-w-[18ch] text-[2.65rem] leading-[1.03] font-bold tracking-[-0.035em] text-foreground sm:text-[3.4rem] lg:text-[3.85rem] xl:text-[4.2rem]"
        />

        <p className="mt-6 max-w-[58ch] text-[1.02rem] leading-[1.75] text-muted-foreground sm:text-[1.1rem]">
          RCA Tracking System holds the incident, the cause type, the supporting
          evidence, the root cause statement, and the corrective and preventive
          actions in one record — so a close-out is something you can defend,
          not something you promise.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/get-started"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 w-full px-6 text-[0.9rem] sm:w-auto",
            )}
          >
            Get Started
          </a>
          <a
            href="/docs"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 w-full px-6 text-[0.9rem] sm:w-auto",
            )}
          >
            Documentation
          </a>
        </div>

        <div className="mt-7 flex items-center justify-center gap-2.5 text-[0.78rem] text-muted-foreground">
          <span>Human or system. Evidenced, not assumed.</span>
        </div>
      </div>
    </Section>
  );
}
