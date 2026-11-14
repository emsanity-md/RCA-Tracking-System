import type { Metadata } from "next";

import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "IncidentTrack — RCA Dashboard",
  description:
    "Track incidents, their cause type, evidence, root cause, preventive actions, and corrections in one in-memory workspace.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
