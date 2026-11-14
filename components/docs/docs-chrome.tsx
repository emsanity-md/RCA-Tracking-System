"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { DocsNavbar } from "@/components/docs/docs-navbar";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocPager } from "@/components/docs/doc-pager";
import { OnThisPage } from "@/components/docs/on-this-page";
import { useFocusTrap } from "@/lib/use-focus-trap";
import type {
  DocNavSection,
  DocPage,
  DocSearchItem,
  TocItem,
} from "@/lib/docs/types";

export function DocsChrome({
  page,
  sections,
  searchItems,
  toc,
  previous,
  next,
  children,
}: {
  page: DocPage;
  sections: DocNavSection[];
  searchItems: DocSearchItem[];
  toc: TocItem[];
  previous?: DocPage;
  next?: DocPage;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);

  useFocusTrap({
    active: mobileOpen,
    containerRef: drawerRef,
    onEscape: closeMobile,
  });

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div inert={mobileOpen ? true : undefined}>
        <DocsNavbar
          searchItems={searchItems}
          menuOpen={mobileOpen}
          onOpenMenu={openMobile}
        />

        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13.5rem]">
          <aside className="hidden border-r border-border lg:block">
            <div className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-hidden">
              <DocsSidebar sections={sections} />
            </div>
          </aside>

          <main
            id="main"
            tabIndex={-1}
            className="min-w-0 px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
          >
            <article className="mx-auto max-w-3xl">
              <header className="border-b border-border pb-7">
                <p className="text-[0.68rem] font-semibold tracking-[0.13em] text-muted-foreground uppercase">
                  {page.sectionTitle}
                </p>
                <h1 className="mt-2.5 font-heading text-[2rem] leading-[1.1] font-bold tracking-[-0.035em] text-foreground sm:text-[2.5rem]">
                  {page.title}
                </h1>
                <p className="mt-3 max-w-2xl text-[0.95rem] leading-7 text-muted-foreground">
                  {page.description}
                </p>
              </header>

              {toc.length > 0 ? (
                <details className="mt-5 rounded-xl border border-border bg-muted/20 px-4 py-3 xl:hidden">
                  <summary className="cursor-pointer text-[0.78rem] font-semibold text-foreground">
                    On this page
                  </summary>
                  <div className="mt-3 border-t border-border pt-3">
                    <OnThisPage toc={toc} />
                  </div>
                </details>
              ) : null}

              <div className="mt-6">
                {children}
              </div>

              <DocPager previous={previous} next={next} />
            </article>
          </main>

          <aside className="hidden border-l border-border xl:block">
            <div className="dashboard-scroll sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto px-5 py-8">
              <OnThisPage toc={toc} />
            </div>
          </aside>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="animate-overlay-in absolute inset-0 bg-black/65"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <aside
            ref={drawerRef}
            id="docs-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Documentation navigation"
            tabIndex={-1}
            className="animate-drawer-left-in absolute inset-y-0 left-0 w-[18rem] max-w-[88vw] border-r border-border bg-card shadow-2xl outline-none"
          >
            <DocsSidebar
              sections={sections}
              showClose
              onClose={closeMobile}
              onNavigate={closeMobile}
            />
          </aside>
        </div>
      ) : null}
    </div>
  );
}
