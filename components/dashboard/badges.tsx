import type { CauseType, IncidentStatus } from "@/lib/incidents";
import {
  causeBadgeClass,
  preventableBadgeClass,
  statusBadgeClass,
} from "@/lib/incidents";
import { cn } from "@/lib/utils";

export function CauseBadge({
  cause,
  className,
}: {
  cause: CauseType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full border px-2 py-0.5 text-[0.7rem] font-medium whitespace-nowrap",
        causeBadgeClass(cause),
        className,
      )}
    >
      {cause}
    </span>
  );
}

export function PreventableBadge({
  preventable,
  className,
}: {
  preventable: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium whitespace-nowrap",
        preventableBadgeClass(preventable),
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          preventable ? "bg-emerald-500" : "bg-orange-500",
        )}
      />
      {preventable ? "Yes" : "No"}
    </span>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: IncidentStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium whitespace-nowrap",
        statusBadgeClass(status),
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          status === "Resolved" ? "bg-emerald-500" : "bg-amber-500",
        )}
      />
      {status}
    </span>
  );
}
