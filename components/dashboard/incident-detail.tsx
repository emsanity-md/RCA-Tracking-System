"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import {
  formatDate,
  formatDateTime,
  type Incident,
} from "@/lib/incidents";
import {
  CauseBadge,
  PreventableBadge,
  StatusBadge,
} from "@/components/dashboard/badges";
import { useFocusTrap } from "@/lib/use-focus-trap";

function DetailItem({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[0.66rem] font-semibold tracking-[0.11em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-relaxed break-words text-foreground">
        {children || "—"}
      </dd>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border px-5 py-5 first:border-t-0">
      <h3 className="font-heading text-[0.72rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
        {title}
      </h3>
      <dl className="mt-3.5 grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

export function IncidentDetail({
  incident,
  onClose,
}: {
  incident: Incident | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useFocusTrap({
    active: Boolean(incident),
    containerRef: panelRef,
    onEscape: onClose,
    initialFocusRef: closeButtonRef,
  });

  useEffect(() => {
    if (!incident) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [incident]);

  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="animate-overlay-in absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="incident-detail-title"
        tabIndex={-1}
        className="animate-panel-in dashboard-scroll absolute inset-y-0 right-0 flex w-full max-w-[30rem] flex-col overflow-y-auto border-l border-border bg-card shadow-2xl outline-none"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-card/95 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-[0.7rem] font-medium text-foreground">
                {incident.incidentId}
              </span>
              <StatusBadge status={incident.status} />
              <PreventableBadge preventable={incident.preventable} />
            </div>
            <h2
              id="incident-detail-title"
              className="mt-2.5 font-heading text-lg leading-snug font-semibold tracking-[-0.02em] text-foreground"
            >
              {incident.description || "Incident detail"}
            </h2>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {incident.system} · {formatDateTime(incident.dateTime)}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close detail panel"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </header>

        <DetailSection title="Incident">
          <DetailItem label="System">{incident.system}</DetailItem>
          <DetailItem label="Date / time">
            {formatDateTime(incident.dateTime)}
          </DetailItem>
          <DetailItem label="Cause type">
            <CauseBadge cause={incident.causeType} />
          </DetailItem>
          <DetailItem label="Sub-type">{incident.subType}</DetailItem>
          <DetailItem label="Status">
            <StatusBadge status={incident.status} />
          </DetailItem>
          <DetailItem label="Corrected by">{incident.correctedBy}</DetailItem>
          <DetailItem label="Date recorded">
            {formatDate(incident.dateRecorded)}
          </DetailItem>
          <DetailItem label="System could prevent?" className="sm:col-span-2">
            <PreventableBadge preventable={incident.preventable} />
          </DetailItem>
        </DetailSection>

        <DetailSection title="Root cause analysis">
          <DetailItem label="Evidence" className="sm:col-span-2">
            <span className="whitespace-pre-wrap">{incident.evidence}</span>
          </DetailItem>
          <DetailItem label="Root cause" className="sm:col-span-2">
            <span className="whitespace-pre-wrap">{incident.rootCause}</span>
          </DetailItem>
        </DetailSection>

        <DetailSection title="Prevention and correction">
          <DetailItem label="Preventive action" className="sm:col-span-2">
            <span className="whitespace-pre-wrap">
              {incident.preventiveAction ||
                (incident.preventable ? "—" : "Not applicable")}
            </span>
          </DetailItem>
          <DetailItem label="Corrected by">{incident.correctedBy}</DetailItem>
          <DetailItem label="Date recorded">
            {formatDate(incident.dateRecorded)}
          </DetailItem>
        </DetailSection>
      </aside>
    </div>
  );
}
