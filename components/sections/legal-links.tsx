"use client";

import { useState } from "react";

import { LegalDialog } from "@/components/auth/legal-dialog";
import { cn } from "@/lib/utils";

type LegalSection = "terms" | "privacy";

const LINK_CLASS =
  "rounded-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none";

export function LegalLinks({
  className,
  linkClassName,
  label = "Legal",
}: {
  className?: string;
  linkClassName?: string;
  label?: string;
}) {
  const [openSection, setOpenSection] = useState<LegalSection | null>(null);

  return (
    <>
      <nav
        aria-label={label}
        className={cn("flex items-center gap-3 text-xs", className)}
      >
        <button
          type="button"
          onClick={() => setOpenSection("terms")}
          aria-haspopup="dialog"
          className={cn(LINK_CLASS, linkClassName)}
        >
          Terms &amp; Conditions
        </button>
        <span aria-hidden="true" className="h-3 w-px bg-border" />
        <button
          type="button"
          onClick={() => setOpenSection("privacy")}
          aria-haspopup="dialog"
          className={cn(LINK_CLASS, linkClassName)}
        >
          Privacy Policy
        </button>
      </nav>

      {openSection ? (
        <LegalDialog
          description="The terms that apply to this prototype and how it handles your information."
          initialSection={openSection}
          onClose={() => setOpenSection(null)}
        />
      ) : null}
    </>
  );
}
