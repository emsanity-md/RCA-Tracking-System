"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ShieldCheck, X } from "lucide-react";

import { PrivacyContent, TermsContent } from "@/components/auth/legal-content";
import { cn } from "@/lib/utils";

type LegalSection = "terms" | "privacy";

export function LegalDialog({
  onClose,
  onAgree,
  description = "Read both tabs before creating an account.",
  agreeLabel = "I have read both",
  initialSection = "terms",
}: {
  onClose: () => void;
  onAgree?: () => void;
  description?: string;
  agreeLabel?: string;
  initialSection?: LegalSection;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const termsTabRef = useRef<HTMLButtonElement>(null);
  const privacyTabRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const capturedFocusRef = useRef(false);
  const [activeTab, setActiveTab] = useState<LegalSection>(initialSection);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!capturedFocusRef.current) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      capturedFocusRef.current = true;
    }

    if (!dialog.open) dialog.showModal();
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      const previous = previousFocusRef.current;
      if (!previous) return;
      window.requestAnimationFrame(() => {
        if (document.contains(previous)) {
          previous.focus({ preventScroll: true });
        }
      });
    };
  }, []);

  function activateTab(tab: LegalSection) {
    setActiveTab(tab);
    bodyRef.current?.scrollTo({ top: 0 });
    if (tab === "terms") termsTabRef.current?.focus();
    else privacyTabRef.current?.focus();
  }

  function handleTabKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      activateTab(activeTab === "terms" ? "privacy" : "terms");
    } else if (event.key === "Home") {
      event.preventDefault();
      activateTab("terms");
    } else if (event.key === "End") {
      event.preventDefault();
      activateTab("privacy");
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="legal-dialog-title"
      aria-describedby="legal-dialog-description"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="animate-dialog-in m-auto w-[calc(100vw-1.5rem)] max-w-2xl overflow-hidden rounded-2xl border border-border bg-card p-0 text-left text-card-foreground shadow-2xl outline-none"
    >
      <div className="flex max-h-[90dvh] flex-col">
        <header className="flex items-start justify-between gap-4 px-5 pt-4">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-muted/50 text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="size-4" />
            </span>
            <div>
              <h2
                id="legal-dialog-title"
                className="font-heading text-lg font-semibold tracking-[-0.02em] text-foreground"
              >
                Terms & Privacy
              </h2>
              <p
                id="legal-dialog-description"
                className="mt-0.5 text-xs leading-5 text-muted-foreground"
              >
                {description}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close terms and privacy"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </header>

        <div
          role="tablist"
          aria-label="Legal documents"
          onKeyDown={handleTabKeys}
          className="mx-5 mt-4 grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/35 p-1"
        >
          <button
            ref={termsTabRef}
            id="legal-terms-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "terms"}
            aria-controls="legal-terms-panel"
            tabIndex={activeTab === "terms" ? 0 : -1}
            onClick={() => activateTab("terms")}
            className={cn(
              "h-8 rounded-md text-[0.8rem] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
              activeTab === "terms"
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Terms &amp; Conditions
          </button>
          <button
            ref={privacyTabRef}
            id="legal-privacy-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "privacy"}
            aria-controls="legal-privacy-panel"
            tabIndex={activeTab === "privacy" ? 0 : -1}
            onClick={() => activateTab("privacy")}
            className={cn(
              "h-8 rounded-md text-[0.8rem] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
              activeTab === "privacy"
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Privacy Policy
          </button>
        </div>

        <div
          ref={bodyRef}
          className="dashboard-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5"
        >
          <div
            id="legal-terms-panel"
            role="tabpanel"
            aria-labelledby="legal-terms-tab"
            hidden={activeTab !== "terms"}
          >
            <TermsContent />
          </div>
          <div
            id="legal-privacy-panel"
            role="tabpanel"
            aria-labelledby="legal-privacy-tab"
            hidden={activeTab !== "privacy"}
          >
            <PrivacyContent />
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            Close
          </button>
          {onAgree ? (
            <button
              type="button"
              onClick={onAgree}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
            >
              <ShieldCheck aria-hidden="true" className="size-4" />
              {agreeLabel}
            </button>
          ) : null}
        </footer>
      </div>
    </dialog>
  );
}
