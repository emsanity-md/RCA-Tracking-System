import type { TocItem } from "@/lib/docs/types";

export function OnThisPage({ toc }: { toc: TocItem[] }) {
  if (toc.length === 0) return null;

  return (
    <nav aria-label="On this page">
      <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        On this page
      </p>
      <ul className="mt-3 space-y-1.5 border-l border-border">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block border-l border-transparent py-0.5 text-[0.78rem] leading-5 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none ${
                item.level === 3 ? "pl-5" : "pl-3"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
      <a
        href="#main"
        className="mt-4 inline-block text-[0.72rem] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
      >
        Back to top
      </a>
    </nav>
  );
}
