import { cn } from "@/lib/utils";

/**
 * The brand mark: a radar scope caught mid-sweep.
 *
 * It is the same instrument as the page background, so the logo and the
 * texture behind it read as one thing. Drawn on a 32x32 grid with a 13-unit
 * radius so it stays crisp from a 16px favicon to a 32px tile.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full border border-white/12 bg-black text-white",
        className,
      )}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="size-[22px]"
      >
        {/* Scope rings. */}
        <circle
          cx="16"
          cy="16"
          r="13"
          stroke="currentColor"
          strokeOpacity="0.32"
          strokeWidth="1.4"
        />
        <circle
          cx="16"
          cy="16"
          r="6.5"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
        {/* The wake left behind the beam. */}
        <path
          d="M25.19 6.81 A13 13 0 0 0 16 3"
          stroke="currentColor"
          strokeOpacity="0.34"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* The beam itself. */}
        <path
          d="M16 16 L25.19 6.81"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* A contact, held at the beam. */}
        <circle cx="22.72" cy="9.28" r="2.5" fill="currentColor" />
        {/* The hub. */}
        <circle cx="16" cy="16" r="1.7" fill="currentColor" />
      </svg>
    </span>
  );
}

/**
 * The mark plus the wordmark. Rendered as a plain span so callers keep
 * control of the link, focus ring and hover behaviour around it.
 */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark className={markClassName} />
      <span
        className={cn(
          "font-heading text-[0.95rem] font-bold tracking-[-0.02em] text-foreground",
          wordmarkClassName,
        )}
      >
        Root Cause Analysis <span className="text-foreground/45">Tracker</span>
      </span>
    </span>
  );
}
