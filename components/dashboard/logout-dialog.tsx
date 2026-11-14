"use client";

import { useEffect, useRef } from "react";
import { LogOut } from "lucide-react";

export function LogoutDialog({
  onStay,
  onConfirm,
}: {
  onStay: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stayRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const capturedFocusRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!capturedFocusRef.current) {
      previouslyFocusedRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      capturedFocusRef.current = true;
    }

    if (!dialog.open) dialog.showModal();
    const frame = window.requestAnimationFrame(() => stayRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      const previous = previouslyFocusedRef.current;
      if (!previous) return;
      window.requestAnimationFrame(() => {
        if (document.contains(previous)) {
          previous.focus({ preventScroll: true });
        }
      });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      onClose={onStay}
      onClick={(event) => {
        if (event.target === dialogRef.current) onStay();
      }}
      className="animate-dialog-in m-auto w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl outline-none"
    >
      <div className="flex items-start gap-3.5 p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-muted/60 text-muted-foreground">
          <LogOut aria-hidden="true" className="size-4.5" />
        </span>
        <div className="min-w-0">
          <h2
            id="logout-dialog-title"
            className="font-heading text-lg font-semibold tracking-[-0.02em] text-foreground"
          >
            Log out?
          </h2>
          <p
            id="logout-dialog-description"
            className="mt-1.5 text-sm leading-relaxed text-muted-foreground"
          >
            You will return to the landing page. This workspace is kept in
            memory, so the incidents recorded here will not be saved.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border bg-card px-5 py-3.5">
        <button
          ref={stayRef}
          type="button"
          onClick={onStay}
          className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
        >
          Stay
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Log out
        </button>
      </div>
    </dialog>
  );
}
