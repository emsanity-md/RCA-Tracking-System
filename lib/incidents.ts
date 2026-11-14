/**
 * Domain model for the incident tracker.
 *
 * Everything here is pure data and formatting. Records live in React state
 * only for the lifetime of the page; nothing is written to storage.
 */

export const CAUSE_TYPES = [
  {
    name: "Human error",
    subTypes: ["Wrong input", "Missed step", "Misconfiguration"],
  },
  {
    name: "System fault",
    subTypes: ["Software bug", "Hardware failure", "Integration failure"],
  },
  {
    name: "Process gap",
    subTypes: ["Missing control", "Unclear procedure", "Lack of training"],
  },
  {
    name: "External",
    subTypes: ["Third-party outage", "Security attack"],
  },
] as const;

export type CauseType = (typeof CAUSE_TYPES)[number]["name"];

export const INCIDENT_STATUSES = ["Pending", "Resolved"] as const;

export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export type Incident = {
  incidentId: string;
  description: string;
  system: string;
  dateTime: string;
  causeType: CauseType;
  subType: string;
  evidence: string;
  rootCause: string;
  status: IncidentStatus;
  preventable: boolean;
  preventiveAction: string;
  correctedBy: string;
  dateRecorded: string;
};

export type ViewId =
  | "overview"
  | "incidents"
  | "resolved"
  | "causes"
  | "actions"
  | "corrections";

export const CHART_COLOR_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export const causeNames = CAUSE_TYPES.map((cause) => cause.name) as CauseType[];

export function subTypesFor(cause: string): readonly string[] {
  return CAUSE_TYPES.find((entry) => entry.name === cause)?.subTypes ?? [];
}

/** Suggest the next free ID, starting at INC-001. */
export function suggestNextIncidentId(incidents: readonly Incident[]): string {
  let highest = 0;

  for (const incident of incidents) {
    const match = incident.incidentId.match(/^INC-(\d+)$/i);
    if (match) highest = Math.max(highest, Number(match[1]));
  }

  return `INC-${String(highest + 1).padStart(3, "0")}`;
}

/** Local calendar date, not the UTC date, so "today" matches the user's clock. */
export function todayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function currentMonthKey(): string {
  return todayISODate().slice(0, 7);
}

/** Local `datetime-local` value captured at save time. */
export function nowLocalDateTime(): string {
  const now = new Date();
  const date = todayISODate();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${date}T${hours}:${minutes}`;
}

export function isRecordedThisMonth(incident: Incident): boolean {
  return incident.dateRecorded.slice(0, 7) === currentMonthKey();
}

export function mostCommonCause(
  incidents: readonly Incident[],
): { cause: CauseType; count: number } | null {
  if (incidents.length === 0) return null;

  const counts = new Map<CauseType, number>();
  for (const incident of incidents) {
    counts.set(incident.causeType, (counts.get(incident.causeType) ?? 0) + 1);
  }

  let leader: CauseType = incidents[0].causeType;
  let leaderCount = 0;
  // Iterate the canonical order so ties resolve deterministically.
  for (const cause of causeNames) {
    const count = counts.get(cause) ?? 0;
    if (count > leaderCount) {
      leader = cause;
      leaderCount = count;
    }
  }

  return { cause: leader, count: leaderCount };
}

function parseLocalDate(value: string): Date | null {
  const dateTime = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/,
  );

  if (!dateTime) return null;

  const [, year, month, day, hour = "0", minute = "0"] = dateTime;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
}

export function formatDate(value: string): string {
  const date = parseLocalDate(value);
  if (!date) return value || "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: string): string {
  const date = parseLocalDate(value);
  if (!date) return value || "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatShortDate(value: string): string {
  const date = parseLocalDate(value);
  if (!date) return value || "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function causeBadgeClass(cause: CauseType): string {
  switch (cause) {
    case "Human error":
      return "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300";
    case "System fault":
      return "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300";
    case "Process gap":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    case "External":
      return "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300";
  }
}

export function preventableBadgeClass(preventable: boolean): string {
  return preventable
    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    : "border-orange-500/25 bg-orange-500/10 text-orange-700 dark:text-orange-300";
}

export function statusBadgeClass(status: IncidentStatus): string {
  return status === "Resolved"
    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
}

export const VIEW_TITLES: Record<ViewId, string> = {
  overview: "Overview",
  incidents: "Incidents",
  resolved: "Resolved issues",
  causes: "Causes",
  actions: "Actions",
  corrections: "Corrections",
};
