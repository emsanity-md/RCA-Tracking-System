"use client";

import { Menu, Plus } from "lucide-react";

import { VIEW_TITLES, type ViewId } from "@/lib/incidents";

export function Topbar({
  view,
  menuOpen,
  onAdd,
  onOpenMenu,
}: {
  view: ViewId;
  menuOpen: boolean;
  onAdd: () => void;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none md:hidden"
          >
            <Menu aria-hidden="true" className="size-4.5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-heading text-lg font-semibold tracking-[-0.02em] text-foreground sm:text-xl">
              {VIEW_TITLES[view]}
            </h1>
            <p className="hidden text-[0.7rem] text-muted-foreground sm:block">
              Incident and root cause tracking
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-soft transition-[background-color,box-shadow,transform] hover:bg-primary/90 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:translate-y-px sm:px-4"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add Incident
        </button>
      </div>
    </header>
  );
}
