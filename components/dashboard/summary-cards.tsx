"use client";

import {
  CalendarDays,
  ClipboardList,
  GitBranch,
  ShieldCheck,
} from "lucide-react";

import {
  mostCommonCause,
  type Incident,
} from "@/lib/incidents";
import { cn } from "@/lib/utils";

function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof ClipboardList;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-foreground/15">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.72rem] font-medium tracking-[0.09em] text-muted-foreground uppercase">
          {label}
        </p>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-colors group-hover:text-foreground">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </div>
      <p
        className={cn(
          "mt-4 font-heading text-3xl leading-none font-semibold tracking-[-0.03em] text-foreground",
          value === "—" && "text-muted-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

export function SummaryCards({
  incidents,
  monthKey,
}: {
  incidents: readonly Incident[];
  monthKey: string;
}) {
  const preventable = incidents.filter((incident) => incident.preventable);
  const thisMonth = incidents.filter(
    (incident) => monthKey !== "" && incident.dateRecorded.slice(0, 7) === monthKey,
  );
  const cause = mostCommonCause(incidents);

  const preventableShare =
    incidents.length === 0
      ? 0
      : Math.round((preventable.length / incidents.length) * 100);

  return (
    <section aria-label="Incident summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Total incidents"
        value={String(incidents.length)}
        detail={incidents.length === 0 ? "No incidents recorded yet" : "All time"}
        icon={ClipboardList}
      />
      <SummaryCard
        label="Preventable"
        value={String(preventable.length)}
        detail={
          incidents.length === 0
            ? "System could prevent"
            : `${preventableShare}% of recorded incidents`
        }
        icon={ShieldCheck}
      />
      <SummaryCard
        label="Recorded this month"
        value={String(thisMonth.length)}
        detail="Based on date recorded"
        icon={CalendarDays}
      />
      <SummaryCard
        label="Most common cause"
        value={cause ? cause.cause : "—"}
        detail={
          cause
            ? `${cause.count} ${cause.count === 1 ? "incident" : "incidents"}`
            : "Add an incident to see this"
        }
        icon={GitBranch}
      />
    </section>
  );
}
