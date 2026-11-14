"use client";

import { useMemo, useState } from "react";
import { Inbox, MoveHorizontal, Search, SearchX, X } from "lucide-react";

import {
  causeNames,
  formatDate,
  formatDateTime,
  type Incident,
} from "@/lib/incidents";
import {
  CauseBadge,
  PreventableBadge,
  StatusBadge,
} from "@/components/dashboard/badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  SelectControl,
  TextInput,
} from "@/components/dashboard/form-controls";

export function IncidentTable({
  incidents,
  onAdd,
  onSelect,
  emptyIcon = Inbox,
  emptyTitle = "No incidents recorded yet",
  emptyMessage = "Log the first incident to start tracking cause, evidence, prevention and correction in one place.",
  emptyActionLabel = "Add your first incident",
}: {
  incidents: readonly Incident[];
  onAdd: () => void;
  onSelect: (incident: Incident) => void;
  emptyIcon?: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean;
  }>;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionLabel?: string;
}) {
  const [search, setSearch] = useState("");
  const [system, setSystem] = useState("all");
  const [cause, setCause] = useState("all");

  const systems = useMemo(
    () =>
      [...new Set(incidents.map((incident) => incident.system.trim()))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [incidents],
  );

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return incidents.filter((incident) => {
      if (system !== "all" && incident.system !== system) return false;
      if (cause !== "all" && incident.causeType !== cause) return false;
      if (!needle) return true;

      const haystack = [
        incident.incidentId,
        incident.description,
        incident.system,
        incident.dateTime,
        incident.causeType,
        incident.subType,
        incident.evidence,
        incident.rootCause,
        incident.preventiveAction,
        incident.correctedBy,
        incident.dateRecorded,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [incidents, search, system, cause]);

  const hasFilters =
    search.trim().length > 0 || system !== "all" || cause !== "all";

  function clearFilters() {
    setSearch("");
    setSystem("all");
    setCause("all");
  }

  if (incidents.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          message={emptyMessage}
          actionLabel={emptyActionLabel}
          onAction={onAdd}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <TextInput
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search incidents, systems, root causes…"
            aria-label="Search incidents"
            className="pr-9 pl-9"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <SelectControl
            value={system}
            onChange={(event) => setSystem(event.target.value)}
            aria-label="Filter by system"
            className="h-10 w-full sm:w-44"
          >
            <option value="all">All systems</option>
            {systems.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </SelectControl>

          <SelectControl
            value={cause}
            onChange={(event) => setCause(event.target.value)}
            aria-label="Filter by cause type"
            className="h-10 w-full sm:w-44"
          >
            <option value="all">All cause types</option>
            {causeNames.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </SelectControl>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length === 1 ? "incident" : "incidents"}
          {hasFilters ? ` of ${incidents.length}` : ""}
        </p>
        <div className="flex items-center gap-3">
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              Clear filters
            </button>
          ) : null}
          <span className="flex items-center gap-1 text-[0.65rem] tracking-[0.04em] text-muted-foreground uppercase lg:hidden">
            <MoveHorizontal aria-hidden="true" className="size-3.5" />
            Swipe
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No incidents match those filters"
          message="Nothing here matches the current search and filters. Try different terms or clear them to see every incident."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="dashboard-scroll overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th
                  scope="col"
                  className="px-4 py-2.5 text-[0.66rem] font-semibold tracking-[0.11em] whitespace-nowrap text-muted-foreground uppercase"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-[0.66rem] font-semibold tracking-[0.11em] text-muted-foreground uppercase"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-[0.66rem] font-semibold tracking-[0.11em] whitespace-nowrap text-muted-foreground uppercase"
                >
                  System
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-[0.66rem] font-semibold tracking-[0.11em] whitespace-nowrap text-muted-foreground uppercase"
                >
                  Date / time
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-[0.66rem] font-semibold tracking-[0.11em] whitespace-nowrap text-muted-foreground uppercase"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-[0.66rem] font-semibold tracking-[0.11em] whitespace-nowrap text-muted-foreground uppercase"
                >
                  Cause type
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-[0.66rem] font-semibold tracking-[0.11em] whitespace-nowrap text-muted-foreground uppercase"
                >
                  Preventable
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-[0.66rem] font-semibold tracking-[0.11em] whitespace-nowrap text-muted-foreground uppercase"
                >
                  Corrected by / recorded
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((incident) => (
                <tr
                  key={incident.incidentId}
                  tabIndex={0}
                  onClick={() => onSelect(incident)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(incident);
                    }
                  }}
                  aria-label={`Open ${incident.incidentId}: ${incident.description}`}
                  className="cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-foreground/[0.035] focus-visible:bg-foreground/[0.05] focus-visible:outline-none"
                >
                  <td className="px-4 py-3 font-mono text-[0.72rem] font-medium whitespace-nowrap text-foreground">
                    {incident.incidentId}
                  </td>
                  <td className="max-w-[280px] px-4 py-3">
                    <span className="block truncate text-foreground">
                      {incident.description || "—"}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {incident.subType}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    <span className="block max-w-[160px] truncate text-foreground">
                      {incident.system || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap text-muted-foreground">
                    {formatDateTime(incident.dateTime)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={incident.status} />
                  </td>
                  <td className="px-4 py-3">
                    <CauseBadge cause={incident.causeType} />
                  </td>
                  <td className="px-4 py-3">
                    <PreventableBadge preventable={incident.preventable} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="block max-w-[160px] truncate text-foreground">
                      {incident.correctedBy || "—"}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {formatDate(incident.dateRecorded)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
