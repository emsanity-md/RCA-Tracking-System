"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import type { Incident, ViewId } from "@/lib/incidents";
import { currentMonthKey } from "@/lib/incidents";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import {
  CauseBreakdownChart,
  IncidentsOverTimeChart,
  StatusBreakdownChart,
} from "@/components/dashboard/charts";
import { IncidentTable } from "@/components/dashboard/incident-table";
import { IncidentDialog } from "@/components/dashboard/incident-dialog";
import { IncidentDetail } from "@/components/dashboard/incident-detail";
import { LogoutDialog } from "@/components/dashboard/logout-dialog";
import {
  ActionsView,
  CausesView,
  CorrectionsView,
} from "@/components/dashboard/grouped-views";
import {
  ToastViewport,
  type ToastItem,
  type ToastVariant,
} from "@/components/dashboard/toast";

type Theme = "light" | "dark";

const subscribeToClock = () => () => {};
const getMonthSnapshot = () => currentMonthKey();
const getServerMonthSnapshot = () => "";

export function Dashboard() {
  const router = useRouter();

  // The only source of truth for records. No storage, no seed data.
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [view, setView] = useState<ViewId>("overview");
  const [theme, setTheme] = useState<Theme>("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const monthKey = useSyncExternalStore(
    subscribeToClock,
    getMonthSnapshot,
    getServerMonthSnapshot,
  );

  const toastSequence = useRef(0);
  const toastTimers = useRef<number[]>([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // Current time is read through an external-store snapshot so prerendering
  // stays deterministic and the value is recomputed on the client.

  useEffect(() => {
    const timers = toastTimers.current;
    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: { title: string; description?: string; variant: ToastVariant }) => {
      const id = ++toastSequence.current;
      setToasts((previous) => [...previous.slice(-2), { ...toast, id }]);
      const timer = window.setTimeout(() => dismissToast(id), 4500);
      toastTimers.current.push(timer);
    },
    [dismissToast],
  );

  const closeDetail = useCallback(() => setSelectedIncident(null), []);
  const closeDialog = useCallback(() => setDialogOpen(false), []);
  const openDialog = useCallback(() => setDialogOpen(true), []);
  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const resolvedIncidents = incidents.filter(
    (incident) => incident.status === "Resolved",
  );

  const handleNavigate = useCallback((next: ViewId) => {
    setView(next);
    setMobileMenuOpen(false);
  }, []);

  const handleSave = useCallback(
    (incident: Incident) => {
      setIncidents((previous) => {
        if (
          previous.some(
            (entry) =>
              entry.incidentId.toLowerCase() ===
              incident.incidentId.toLowerCase(),
          )
        ) {
          return previous;
        }
        return [incident, ...previous];
      });
      setDialogOpen(false);
      pushToast({
        variant: "success",
        title: "Incident added",
        description: `${incident.incidentId} is now in the incident log.`,
      });
    },
    [pushToast],
  );

  const openLogout = useCallback(() => setLogoutOpen(true), []);
  const stayLogout = useCallback(() => setLogoutOpen(false), []);
  const confirmLogout = useCallback(() => {
    setLogoutOpen(false);
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Sidebar
        active={view}
        theme={theme}
        mobileOpen={mobileMenuOpen}
        onNavigate={handleNavigate}
        onToggleTheme={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
        onLogout={openLogout}
        onCloseMobile={closeMobileMenu}
      />

      <div
        className="flex min-h-dvh flex-col md:pl-60"
        inert={
          mobileMenuOpen || selectedIncident !== null || dialogOpen || logoutOpen
            ? true
            : undefined
        }
      >
        <Topbar
          view={view}
          menuOpen={mobileMenuOpen}
          onAdd={openDialog}
          onOpenMenu={openMobileMenu}
        />

        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-6 pb-12 sm:px-6 lg:px-8 lg:py-8 lg:pb-14"
        >
          {view === "overview" ? (
            <div className="space-y-5">
              <SummaryCards incidents={incidents} monthKey={monthKey} />

              <div className="grid gap-4 lg:grid-cols-2">
                <CauseBreakdownChart incidents={incidents} />
                <StatusBreakdownChart incidents={incidents} />
              </div>

              <IncidentsOverTimeChart incidents={incidents} />

              <section aria-label="Incident log">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-sm font-semibold text-foreground">
                      Incident log
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Search, filter and open a record for the full analysis.
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {incidents.length}{" "}
                    {incidents.length === 1 ? "record" : "records"}
                  </span>
                </div>
                <IncidentTable
                  incidents={incidents}
                  onAdd={() => setDialogOpen(true)}
                  onSelect={setSelectedIncident}
                />
              </section>
            </div>
          ) : null}

          {view === "incidents" ? (
            <div>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-heading text-sm font-semibold text-foreground">
                    All incidents
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Every record currently held in memory.
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {incidents.length}{" "}
                  {incidents.length === 1 ? "record" : "records"}
                </span>
              </div>
              <IncidentTable
                incidents={incidents}
                onAdd={() => setDialogOpen(true)}
                onSelect={setSelectedIncident}
              />
            </div>
          ) : null}

          {view === "resolved" ? (
            <div>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-heading text-sm font-semibold text-foreground">
                    Resolved issues
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Incidents marked Resolved, with their full record intact.
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {resolvedIncidents.length}{" "}
                  {resolvedIncidents.length === 1 ? "record" : "records"}
                </span>
              </div>
              <IncidentTable
                incidents={resolvedIncidents}
                onAdd={() => setDialogOpen(true)}
                onSelect={setSelectedIncident}
                emptyIcon={CheckCircle2}
                emptyTitle="No resolved incidents yet"
                emptyMessage="Incidents marked as Resolved will appear here with their cause, action and correction history."
                emptyActionLabel={
                  incidents.length === 0 ? "Add your first incident" : ""
                }
              />
            </div>
          ) : null}

          {view === "causes" ? (
            <CausesView
              incidents={incidents}
              onAdd={() => setDialogOpen(true)}
              onSelect={setSelectedIncident}
            />
          ) : null}

          {view === "actions" ? (
            <ActionsView
              incidents={incidents}
              onAdd={() => setDialogOpen(true)}
              onSelect={setSelectedIncident}
            />
          ) : null}

          {view === "corrections" ? (
            <CorrectionsView
              incidents={incidents}
              onAdd={() => setDialogOpen(true)}
              onSelect={setSelectedIncident}
            />
          ) : null}
        </main>
      </div>

      {dialogOpen ? (
        <IncidentDialog
          incidents={incidents}
          onCancel={closeDialog}
          onSave={handleSave}
        />
      ) : null}

      {logoutOpen ? (
        <LogoutDialog onStay={stayLogout} onConfirm={confirmLogout} />
      ) : null}

      <IncidentDetail incident={selectedIncident} onClose={closeDetail} />

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
