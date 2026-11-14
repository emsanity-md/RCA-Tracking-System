"use client";

import {
  Activity,
  CheckCircle2,
  ClipboardList,
  GitBranch,
  LayoutDashboard,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  UserCheck,
  X,
} from "lucide-react";

import type { ViewId } from "@/lib/incidents";
import { cn } from "@/lib/utils";

const NAV_ITEMS: {
  id: ViewId;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "incidents", label: "Incidents", icon: ClipboardList },
  { id: "resolved", label: "Resolved issues", icon: CheckCircle2 },
  { id: "causes", label: "Causes", icon: GitBranch },
  { id: "actions", label: "Actions", icon: ShieldCheck },
  { id: "corrections", label: "Corrections", icon: UserCheck },
];

function Brand() {
  return (
    <div className="flex items-center gap-3 px-1">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-foreground text-background">
        <Activity aria-hidden="true" className="size-4.5" strokeWidth={2.2} />
      </span>
      <span className="min-w-0">
        <span className="block font-heading text-[0.98rem] font-bold tracking-[-0.02em] text-foreground">
          IncidentTrack
        </span>
        <span className="block text-[0.68rem] tracking-[0.08em] text-muted-foreground uppercase">
          RCA workspace
        </span>
      </span>
    </div>
  );
}

function SidebarBody({
  active,
  theme,
  onNavigate,
  onToggleTheme,
  onLogout,
  onClose,
  showClose,
}: {
  active: ViewId;
  theme: "light" | "dark";
  onNavigate: (view: ViewId) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
  onClose?: () => void;
  showClose?: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 pt-5 pb-6">
        <Brand />
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <X aria-hidden="true" className="size-4.5" />
          </button>
        ) : null}
      </div>

      <nav aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
                    isActive
                      ? "bg-foreground/[0.07] text-foreground"
                      : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-foreground transition-opacity",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "size-4.5 shrink-0",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-border px-3 py-3">
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          {theme === "dark" ? (
            <Sun aria-hidden="true" className="size-4.5" />
          ) : (
            <Moon aria-hidden="true" className="size-4.5" />
          )}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          <LogOut aria-hidden="true" className="size-4.5" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function Sidebar({
  active,
  theme,
  mobileOpen,
  onNavigate,
  onToggleTheme,
  onLogout,
  onCloseMobile,
}: {
  active: ViewId;
  theme: "light" | "dark";
  mobileOpen: boolean;
  onNavigate: (view: ViewId) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border bg-card md:block">
        <SidebarBody
          active={active}
          theme={theme}
          onNavigate={onNavigate}
          onToggleTheme={onToggleTheme}
          onLogout={onLogout}
        />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="animate-overlay-in absolute inset-0 bg-black/60"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="animate-drawer-left-in absolute inset-y-0 left-0 w-[17rem] max-w-[86vw] border-r border-border bg-card shadow-2xl"
          >
            <SidebarBody
              active={active}
              theme={theme}
              showClose
              onClose={onCloseMobile}
              onNavigate={onNavigate}
              onToggleTheme={onToggleTheme}
              onLogout={onLogout}
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}
