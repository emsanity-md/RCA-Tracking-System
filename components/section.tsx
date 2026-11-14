import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The one horizontal gutter and content frame used by every section, the
 * header, and the footer, so all content lines up on the same grid.
 */
export const gutter = "px-5 sm:px-8 lg:px-12 xl:px-16";
export const frame = "mx-auto w-full max-w-[1400px]";

type SectionProps = ComponentProps<"section"> & {
  tone?: "default" | "muted";
};

export function Section({
  className,
  children,
  tone = "default",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "w-full py-20 sm:py-24 lg:py-28 xl:py-32",
        tone === "muted" && "border-y border-border/70 bg-panel",
        className,
      )}
      {...props}
    >
      <div className={cn(frame, gutter)}>{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase",
        className,
      )}
    >
      <span aria-hidden className="h-px w-7 shrink-0 bg-primary" />
      {children}
    </p>
  );
}
