"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";

import type { DocNavSection } from "@/lib/docs/types";
import { cn } from "@/lib/utils";

export function DocsSidebar({
  sections,
  showClose = false,
  onClose,
  onNavigate,
}: {
  sections: DocNavSection[];
  showClose?: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeSection =
    sections.find((section) =>
      section.pages.some((page) => page.href === pathname),
    )?.id ?? sections[0]?.id;
  const [openSections, setOpenSections] = useState<string[]>(() =>
    activeSection ? [activeSection] : [],
  );

  function toggleSection(id: string) {
    setOpenSections((current) =>
      current.includes(id)
        ? current.filter((sectionId) => sectionId !== id)
        : [...current, id],
    );
  }

  return (
    <div className="flex h-full flex-col">
      {showClose ? (
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <span className="font-heading text-sm font-semibold text-foreground">
            Documentation
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close documentation navigation"
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : null}

      <nav
        aria-label="Documentation"
        className="dashboard-scroll min-h-0 flex-1 overflow-y-auto px-3 py-4"
      >
        <div className="space-y-1">
          {sections.map((section) => {
            const isOpen = openSections.includes(section.id);
            const hasActive = section.pages.some(
              (page) => page.href === pathname,
            );
            const panelId = `docs-section-${section.id}`;

            return (
              <div key={section.id}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[0.8rem] font-semibold tracking-[-0.01em] transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
                    hasActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <span className="truncate">{section.title}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                <div id={panelId} hidden={!isOpen}>
                  <ul className="mt-0.5 mb-1 space-y-0.5 border-l border-border pl-2.5">
                    {section.pages.map((page) => {
                      const isActive = page.href === pathname;
                      return (
                        <li key={page.href}>
                          <Link
                            href={page.href}
                            onClick={onNavigate}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "block rounded-md px-2.5 py-1.5 text-[0.8rem] leading-5 transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
                              isActive
                                ? "bg-foreground/[0.08] font-medium text-foreground"
                                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                            )}
                          >
                            {page.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
