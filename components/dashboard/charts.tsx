"use client";

import { PieChart, TrendingUp } from "lucide-react";

import {
  CHART_COLOR_VARS,
  causeNames,
  formatShortDate,
  type CauseType,
  type Incident,
} from "@/lib/incidents";

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-soft">
      <header className="border-b border-border px-5 py-4">
        <h2 className="font-heading text-sm font-semibold text-foreground">
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function ChartPlaceholder({
  icon: Icon,
  message,
}: {
  icon: typeof PieChart;
  message: string;
}) {
  return (
    <div className="flex min-h-[228px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
      <span className="grid size-11 place-items-center rounded-xl border border-border bg-card text-muted-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

type DonutSlice = {
  key: string;
  label: string;
  count: number;
  color: string;
};

function DonutChart({
  total,
  slices,
  ariaLabel,
}: {
  total: number;
  slices: DonutSlice[];
  ariaLabel: string;
}) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const segments = slices.map((slice, index) => {
    const before = slices
      .slice(0, index)
      .reduce((sum, entry) => sum + entry.count, 0);
    return {
      ...slice,
      length: (slice.count / total) * circumference,
      dashOffset: -(before / total) * circumference,
    };
  });

  return (
    <div className="flex min-h-[228px] flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="relative size-[186px] shrink-0">
        <svg
          viewBox="0 0 200 200"
          role="img"
          aria-label={ariaLabel}
          className="size-full -rotate-90"
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="22"
          />
          {segments.map((slice) => (
            <circle
              key={slice.key}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth="22"
              strokeDasharray={`${slice.length} ${circumference - slice.length}`}
              strokeDashoffset={slice.dashOffset}
            >
              <title>
                {slice.label}: {slice.count}
              </title>
            </circle>
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-3xl leading-none font-semibold tracking-[-0.03em] text-foreground">
            {total}
          </span>
          <span className="mt-1 text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
            incidents
          </span>
        </div>
      </div>

      <ul className="w-full min-w-0 space-y-3">
        {slices.map((slice) => (
          <li key={slice.key} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="min-w-0 flex-1 truncate text-sm text-foreground">
              {slice.label}
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {slice.count} · {Math.round((slice.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CauseBreakdownChart({
  incidents,
}: {
  incidents: readonly Incident[];
}) {
  const total = incidents.length;
  const counts = new Map<CauseType, number>();
  for (const incident of incidents) {
    counts.set(incident.causeType, (counts.get(incident.causeType) ?? 0) + 1);
  }

  const slices = causeNames
    .map((cause, index) => ({
      key: cause,
      label: cause,
      count: counts.get(cause) ?? 0,
      color: CHART_COLOR_VARS[index % CHART_COLOR_VARS.length],
    }))
    .filter((slice) => slice.count > 0);

  return (
    <ChartCard
      title="Cause type breakdown"
      description="Where recorded incidents originate."
    >
      {total === 0 ? (
        <ChartPlaceholder
          icon={PieChart}
          message="No data yet. Add an incident to see this chart."
        />
      ) : (
        <DonutChart
          total={total}
          slices={slices}
          ariaLabel={`Cause type breakdown across ${total} incidents`}
        />
      )}
    </ChartCard>
  );
}

export function StatusBreakdownChart({
  incidents,
}: {
  incidents: readonly Incident[];
}) {
  const total = incidents.length;
  const resolved = incidents.filter(
    (incident) => incident.status === "Resolved",
  ).length;
  const pending = total - resolved;

  const slices = [
    {
      key: "Resolved",
      label: "Resolved",
      count: resolved,
      color: "var(--chart-1)",
    },
    {
      key: "Pending",
      label: "Pending",
      count: pending,
      color: "var(--chart-3)",
    },
  ].filter((slice) => slice.count > 0);

  return (
    <ChartCard
      title="Status breakdown"
      description="How incidents stand between pending and resolved."
    >
      {total === 0 ? (
        <ChartPlaceholder
          icon={PieChart}
          message="No data yet. Add an incident to see this chart."
        />
      ) : (
        <DonutChart
          total={total}
          slices={slices}
          ariaLabel={`${resolved} resolved and ${pending} pending out of ${total} incidents`}
        />
      )}
    </ChartCard>
  );
}


export function IncidentsOverTimeChart({
  incidents,
}: {
  incidents: readonly Incident[];
}) {
  const byDate = new Map<string, number>();
  for (const incident of incidents) {
    const day = incident.dateTime.slice(0, 10);
    if (!day) continue;
    byDate.set(day, (byDate.get(day) ?? 0) + 1);
  }

  const allDays = [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, count]) => ({ day, count }));
  const days = allDays.slice(-10);
  const total = incidents.length;

  const maxCount = Math.max(1, ...days.map((day) => day.count));
  const niceMax = maxCount <= 4 ? 4 : Math.ceil(maxCount / 4) * 4;
  const ticks = 4;
  const barSlot = 100 / Math.max(days.length, 1);
  const barWidth = Math.min(8, barSlot * 0.56);

  return (
    <ChartCard
      title="Incidents over time"
      description={
        allDays.length > 10
          ? "Latest 10 days with incidents."
          : "Incidents grouped by the day they occurred."
      }
    >
      {days.length === 0 ? (
        <ChartPlaceholder
          icon={TrendingUp}
          message="No data yet. Add an incident to see this chart."
        />
      ) : (
        <div className="min-h-[228px]" role="img" aria-label={`Incidents over time across ${total} incidents`}>
          <div className="flex gap-2">
            <div className="relative h-[184px] w-6 shrink-0 text-right text-[0.6rem] tabular-nums text-muted-foreground">
              {Array.from({ length: ticks + 1 }, (_, index) => (
                <span
                  key={index}
                  className="absolute right-0 -translate-y-1/2"
                  style={{ top: `${(index / ticks) * 100}%` }}
                >
                  {Math.round((niceMax / ticks) * (ticks - index))}
                </span>
              ))}
            </div>

            <div className="relative h-[184px] min-w-0 flex-1">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-0 size-full overflow-visible"
              >
                {Array.from({ length: ticks + 1 }, (_, index) => {
                  const y = (100 / ticks) * index;
                  return (
                    <line
                      key={index}
                      x1="0"
                      x2="100"
                      y1={y}
                      y2={y}
                      stroke={index === ticks ? "var(--input)" : "var(--border)"}
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}

                {days.map((day, index) => {
                  const height = (day.count / niceMax) * 100;
                  const x = barSlot * index + (barSlot - barWidth) / 2;
                  return (
                    <rect
                      key={day.day}
                      x={x}
                      y={100 - height}
                      width={barWidth}
                      height={Math.max(height, 0.8)}
                      fill="var(--chart-1)"
                    >
                      <title>
                        {formatShortDate(day.day)}: {day.count}{" "}
                        {day.count === 1 ? "incident" : "incidents"}
                      </title>
                    </rect>
                  );
                })}
              </svg>

              {days.map((day, index) => {
                const height = (day.count / niceMax) * 100;
                return (
                  <span
                    key={day.day}
                    className="absolute -translate-x-1/2 text-[0.68rem] font-semibold tabular-nums text-foreground"
                    style={{
                      left: `${barSlot * index + barSlot / 2}%`,
                      bottom: `calc(${height}% + 0.25rem)`,
                    }}
                  >
                    {day.count}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-2 flex pl-8">
            {days.map((day) => (
              <span
                key={day.day}
                className="min-w-0 flex-1 truncate text-center text-[0.62rem] whitespace-nowrap text-muted-foreground"
                title={day.day}
              >
                {formatShortDate(day.day)}
              </span>
            ))}
          </div>
        </div>
      )}
    </ChartCard>
  );
}
