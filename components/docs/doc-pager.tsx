import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { DocPage } from "@/lib/docs/types";

export function DocPager({
  previous,
  next,
}: {
  previous?: DocPage;
  next?: DocPage;
}) {
  return (
    <nav
      aria-label="Documentation pagination"
      className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={previous.href}
          className="group flex items-center gap-3 rounded-xl border border-border bg-card/40 px-4 py-3.5 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5"
          />
          <span className="min-w-0">
            <span className="block text-[0.66rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Previous
            </span>
            <span className="mt-0.5 block truncate text-[0.85rem] font-medium text-foreground">
              {previous.title}
            </span>
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card/40 px-4 py-3.5 text-right transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none sm:col-start-2"
        >
          <span className="min-w-0">
            <span className="block text-[0.66rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Next
            </span>
            <span className="mt-0.5 block truncate text-[0.85rem] font-medium text-foreground">
              {next.title}
            </span>
          </span>
          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </nav>
  );
}
