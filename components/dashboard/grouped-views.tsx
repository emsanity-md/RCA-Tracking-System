"use client";

import {
  ChevronRight,
  GitBranch,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import {
  CAUSE_TYPES,
  formatDate,
  formatDateTime,
  type Incident,
} from "@/lib/incidents";
import { CauseBadge, PreventableBadge } from "@/components/dashboard/badges";
import { EmptyState } from "@/components/dashboard/empty-state";

function PageIntro({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

function IncidentRow({
  incident,
  onSelect,
  trailing,
}: {
  incident: Incident;
  onSelect: (incident: Incident) => void;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(incident)}
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="font-mono text-[0.7rem] font-medium text-muted-foreground">
            {incident.incidentId}
          </span>
          <span className="min-w-0 truncate text-sm font-medium text-foreground">
            {incident.description}
          </span>
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>{incident.system}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDateTime(incident.dateTime)}</span>
        </span>
      </span>
      {trailing}
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
      />
    </button>
  );
}

export function CausesView({
  incidents,
  onAdd,
  onSelect,
}: {
  incidents: readonly Incident[];
  onAdd: () => void;
  onSelect: (incident: Incident) => void;
}) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-soft">
        <EmptyState
          icon={GitBranch}
          title="No cause analysis yet"
          message="Once incidents are recorded, their cause types and sub-types will be grouped here so patterns are easy to spot."
          actionLabel="Add your first incident"
          onAction={onAdd}
        />
      </div>
    );
  }

  return (
    <div>
      <PageIntro>
        Incidents grouped by cause type and sub-type. Select any record to read
        the evidence and root cause.
      </PageIntro>

      <div className="space-y-4">
        {CAUSE_TYPES.map((cause, index) => {
          const causeIncidents = incidents.filter(
            (incident) => incident.causeType === cause.name,
          );
          if (causeIncidents.length === 0) return null;

          return (
            <section
              key={cause.name}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-soft"
            >
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/25 px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <CauseBadge cause={cause.name} />
                  <span className="text-xs text-muted-foreground">
                    {causeIncidents.length}{" "}
                    {causeIncidents.length === 1 ? "incident" : "incidents"}
                  </span>
                </div>
                <span className="text-[0.66rem] tracking-[0.1em] text-muted-foreground uppercase">
                  Cause {String(index + 1).padStart(2, "0")}
                </span>
              </header>

              <div className="grid gap-5 p-4 lg:grid-cols-2 xl:grid-cols-3">
                {cause.subTypes.map((subType) => {
                  const subTypeIncidents = causeIncidents.filter(
                    (incident) => incident.subType === subType,
                  );
                  if (subTypeIncidents.length === 0) return null;

                  return (
                    <div
                      key={subType}
                      className="rounded-lg border border-border bg-background/40"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
                        <h3 className="text-[0.72rem] font-semibold tracking-[0.06em] text-foreground uppercase">
                          {subType}
                        </h3>
                        <span className="rounded-full border border-border bg-card px-1.5 py-0.5 text-[0.65rem] tabular-nums text-muted-foreground">
                          {subTypeIncidents.length}
                        </span>
                      </div>
                      <div className="space-y-0.5 p-1">
                        {subTypeIncidents.map((incident) => (
                          <IncidentRow
                            key={incident.incidentId}
                            incident={incident}
                            onSelect={onSelect}
                            trailing={
                              <PreventableBadge
                                preventable={incident.preventable}
                              />
                            }
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function ActionsView({
  incidents,
  onAdd,
  onSelect,
}: {
  incidents: readonly Incident[];
  onAdd: () => void;
  onSelect: (incident: Incident) => void;
}) {
  const actions = incidents.filter(
    (incident) => incident.preventable && incident.preventiveAction.trim(),
  );

  if (actions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-soft">
        <EmptyState
          icon={ShieldCheck}
          title="No preventive actions yet"
          message="Preventive actions for incidents the system could have prevented will be listed here, each linked to its incident."
          actionLabel={incidents.length === 0 ? "Add your first incident" : undefined}
          onAction={incidents.length === 0 ? onAdd : undefined}
        />
      </div>
    );
  }

  return (
    <div>
      <PageIntro>
        Actions attached to incidents the system could have prevented. Each
        action stays linked to the record that justified it.
      </PageIntro>

      <div className="space-y-3">
        {actions.map((incident) => (
          <button
            key={incident.incidentId}
            type="button"
            onClick={() => onSelect(incident)}
            className="group block w-full rounded-xl border border-border bg-card p-4 text-left shadow-soft transition-colors hover:border-foreground/20 hover:bg-muted/20 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-muted/50 text-muted-foreground">
                <ShieldCheck aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed font-medium text-foreground">
                  {incident.preventiveAction}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[0.7rem] text-muted-foreground">
                    {incident.incidentId}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {incident.description}
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <CauseBadge cause={incident.causeType} />
                  <span className="text-[0.7rem] text-muted-foreground">
                    {incident.system}
                  </span>
                  <span className="text-[0.7rem] text-muted-foreground">
                    · Corrected by {incident.correctedBy}
                  </span>
                </div>
              </div>
              <ChevronRight
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function CorrectionsView({
  incidents,
  onAdd,
  onSelect,
}: {
  incidents: readonly Incident[];
  onAdd: () => void;
  onSelect: (incident: Incident) => void;
}) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-soft">
        <EmptyState
          icon={UserCheck}
          title="No corrections recorded yet"
          message="Incidents will be grouped here by who corrected them, together with the date each record was closed out."
          actionLabel="Add your first incident"
          onAction={onAdd}
        />
      </div>
    );
  }

  const groups = new Map<string, Incident[]>();
  for (const incident of incidents) {
    const owner = incident.correctedBy.trim() || "Unassigned";
    const group = groups.get(owner) ?? [];
    group.push(incident);
    groups.set(owner, group);
  }

  const sortedGroups = [...groups.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div>
      <PageIntro>
        Incidents grouped by who corrected them, with the date each record was
        logged.
      </PageIntro>

      <div className="grid gap-4 lg:grid-cols-2">
        {sortedGroups.map(([owner, ownerIncidents]) => (
          <section
            key={owner}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-soft"
          >
            <header className="flex items-center justify-between gap-3 border-b border-border bg-muted/25 px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-border bg-card text-muted-foreground">
                  <UserCheck aria-hidden="true" className="size-3.5" />
                </span>
                <h3 className="truncate text-sm font-semibold text-foreground">
                  {owner}
                </h3>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {ownerIncidents.length}{" "}
                {ownerIncidents.length === 1 ? "incident" : "incidents"}
              </span>
            </header>

            <div className="space-y-1 p-2">
              {ownerIncidents.map((incident) => (
                <button
                  key={incident.incidentId}
                  type="button"
                  onClick={() => onSelect(incident)}
                  className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="font-mono text-[0.7rem] text-muted-foreground">
                        {incident.incidentId}
                      </span>
                      <span className="min-w-0 truncate text-sm font-medium text-foreground">
                        {incident.description}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <CauseBadge cause={incident.causeType} />
                      <span className="text-xs text-muted-foreground">
                        <span className="text-[0.66rem] tracking-[0.08em] uppercase">
                          Recorded
                        </span>{" "}
                        {formatDate(incident.dateRecorded)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
