"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GitFork, Menu } from "lucide-react";

import { Logo, LogoMark } from "@/components/logo";
import { DocsSearch } from "@/components/docs/docs-search";
import type { DocSearchItem } from "@/lib/docs/types";
import { cn } from "@/lib/utils";

const TOP_LINKS = [
  { label: "Docs", href: "/docs/getting-started/introduction", match: "docs" },
  { label: "API", href: "/docs/reference/functions", match: "api" },
  { label: "Examples", href: "/docs/guides/examples", match: "examples" },
  { label: "Changelog", href: "/docs/project-info/changelog", match: "changelog" },
] as const;

export function DocsNavbar({
  searchItems,
  menuOpen,
  onOpenMenu,
}: {
  searchItems: DocSearchItem[];
  menuOpen: boolean;
  onOpenMenu: () => void;
}) {
  const pathname = usePathname();

  function isActive(match: (typeof TOP_LINKS)[number]["match"]) {
    if (match === "docs") {
      return (
        pathname.startsWith("/docs") &&
        !pathname.startsWith("/docs/reference") &&
        pathname !== "/docs/guides/examples" &&
        pathname !== "/docs/project-info/changelog"
      );
    }
    if (match === "api") return pathname.startsWith("/docs/reference");
    if (match === "examples") return pathname === "/docs/guides/examples";
    return pathname === "/docs/project-info/changelog";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open documentation navigation"
            aria-expanded={menuOpen}
            aria-controls="docs-mobile-navigation"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none lg:hidden"
          >
            <Menu aria-hidden="true" className="size-4.5" />
          </button>

          <Link
            href="/"
            aria-label="RCA Tracking System home"
            className="shrink-0 rounded-lg focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <Logo
              className="hidden gap-2.5 sm:flex"
              markClassName="size-8"
              wordmarkClassName="text-[0.88rem]"
            />
            <LogoMark className="size-8 sm:hidden" />
          </Link>

          <span className="hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-[0.62rem] tracking-[0.08em] text-muted-foreground uppercase md:inline">
            Docs
          </span>

          <nav aria-label="Documentation sections" className="hidden items-center gap-0.5 md:flex">
            {TOP_LINKS.map((link) => {
              const active = isActive(link.match);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-[0.8rem] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <DocsSearch
              items={searchItems}
              idPrefix="docs-search-desktop"
              className="hidden w-56 md:block xl:w-64"
            />

            <div className="relative hidden sm:block">
              <select
                defaultValue="1.0.0"
                aria-label="Documentation version"
                className="h-9 appearance-none rounded-lg border border-border bg-muted/30 pr-7 pl-2.5 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                <option value="1.0.0">v1.0.0</option>
                <option value="0.9.0" disabled>
                  v0.9.0 (unpublished)
                </option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            <a
              href="https://github.com/emsanity-md/RCA-Tracking-System"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <GitFork aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-3 md:hidden">
          <DocsSearch
            items={searchItems}
            idPrefix="docs-search-mobile"
            className="min-w-0 flex-1"
          />
          <div className="relative shrink-0 sm:hidden">
            <select
              defaultValue="1.0.0"
              aria-label="Documentation version"
              className="h-9 w-[6.6rem] appearance-none rounded-lg border border-border bg-muted/30 pr-6 pl-2 font-mono text-[0.68rem] text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <option value="1.0.0">v1.0.0</option>
              <option value="0.9.0" disabled>
                v0.9.0
              </option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-1.5 size-3 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
