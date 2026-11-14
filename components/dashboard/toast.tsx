"use client";

import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "info" | "warning";

export type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

const iconByVariant = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
};

const colorByVariant = {
  success: "text-emerald-600 dark:text-emerald-300",
  info: "text-muted-foreground",
  warning: "text-amber-600 dark:text-amber-300",
};

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: readonly ToastItem[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[22rem]"
    >
      {toasts.map((toast) => {
        const Icon = iconByVariant[toast.variant];
        return (
          <div
            key={toast.id}
            role="status"
            className="animate-overlay-in pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-lift"
          >
            <Icon
              aria-hidden="true"
              className={cn("mt-0.5 size-4.5 shrink-0", colorByVariant[toast.variant])}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {toast.title}
              </p>
              {toast.description ? (
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
