import { LegalLinks } from "@/components/sections/legal-links";
import { frame, gutter } from "@/components/section";
import { cn } from "@/lib/utils";

export function LandingFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/40">
      <div
        className={cn(
          frame,
          gutter,
          "flex flex-col gap-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:py-5",
        )}
      >
        <p className="text-xs text-muted-foreground">
          © 2026 RCA Tracking System
        </p>
        <LegalLinks
          className="hidden text-[0.8rem] sm:flex"
          linkClassName="text-foreground/75"
          label="Legal"
        />
      </div>
    </footer>
  );
}
