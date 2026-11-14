import type { DocSection } from "@/lib/docs/types";

export const coreConcepts: DocSection = {
  id: "core-concepts",
  title: "Core Concepts",
  pages: [
    {
      id: "architecture",
      title: "Architecture Overview",
      description: "How the landing page, dashboard, docs, and in-memory incident state fit together.",
      keywords: ["architecture", "next.js", "react", "state", "app router"],
      blocks: [
        { type: "h2", id: "high-level-shape", text: "High-level shape" },
        {
          type: "p",
          text: "The app uses the Next.js App Router with three top-level experiences: a landing page, a client-side dashboard, and this static documentation site.",
        },
        {
          type: "code",
          lang: "text",
          title: "Route map",
          code: "/                 landing page\n/dashboard        in-memory incident workspace\n/docs/...         documentation\n/api              no public API in this version",
        },
        { type: "h2", id: "rendering-path", text: "Rendering path" },
        {
          type: "list",
          items: [
            "The root layout loads fonts, the skip link, and the radar background.",
            "The landing page renders static hero content.",
            "The dashboard is a client component because records, filters, theme, and dialogs are interactive.",
            "Documentation pages are generated from a typed content registry and share one docs shell.",
          ],
        },
        { type: "h2", id: "state-ownership", text: "State ownership" },
        {
          type: "p",
          text: "Incident records live in `components/dashboard/dashboard.tsx` with `useState`. Child views receive records and callbacks as props. There is no global store and no persistence layer.",
        },
        {
          type: "callout",
          tone: "warning",
          title: "State is session-only",
          text: "A refresh, a route change away from the dashboard, or a logout unmounts the dashboard and clears the log.",
        },
      ],
    },
    {
      id: "glossary",
      title: "Glossary",
      description: "The terms used across the incident model and dashboard.",
      keywords: ["glossary", "definitions", "incident", "cause", "root cause"],
      blocks: [
        { type: "table", headers: ["Term", "Meaning"], rows: [
          ["Incident", "An event that caused or could have caused harm to a system or process."],
          ["Cause type", "The broad category: Human error, System fault, Process gap, or External."],
          ["Sub-type", "The specific cause inside a category, such as Wrong input or Software bug."],
          ["Evidence", "The observation, log, or artifact that supports the analysis."],
          ["Root cause", "The underlying reason the incident happened, not the visible symptom."],
          ["Preventable", "Whether the system could have stopped the incident with a control."],
          ["Corrected by", "The person or team that completed the correction."],
          ["Resolved", "The incident has an accepted root cause and a completed corrective action."],
        ] },
      ],
    },
    {
      id: "how-it-works",
      title: "How It Works",
      description: "Follow a record from the Add Incident form to the charts and detail panel.",
      keywords: ["data flow", "form", "table", "charts", "how it works"],
      blocks: [
        { type: "steps", items: [
          { title: "Capture", text: "The Add Incident dialog validates the draft and creates an Incident object." },
          { title: "Store", text: "Dashboard state prepends the record so the newest incident appears first." },
          { title: "Derive", text: "Summary cards, charts, and grouped views compute their values from the same array on every render." },
          { title: "Inspect", text: "A row opens the detail panel with every stored field, including the full description." },
        ] },
        { type: "code", lang: "ts", title: "The record shape", code: "type Incident = {\n  incidentId: string;\n  description: string;\n  system: string;\n  dateTime: string;\n  causeType: CauseType;\n  subType: string;\n  evidence: string;\n  rootCause: string;\n  status: \"Pending\" | \"Resolved\";\n  preventable: boolean;\n  preventiveAction: string;\n  correctedBy: string;\n  dateRecorded: string;\n};" },
        { type: "callout", tone: "note", text: "Nothing is sent to a server. Every derived view is a pure transformation of the current in-memory array." },
      ],
    },
    {
      id: "project-structure",
      title: "Project Structure",
      description: "Where routes, dashboard components, docs content, and shared helpers live.",
      keywords: ["folders", "files", "structure", "components", "lib"],
      blocks: [
        { type: "code", lang: "text", title: "Key paths", code: "app/\n  page.tsx                    landing page\n  dashboard/page.tsx          dashboard route\n  docs/[[...slug]]/page.tsx   documentation route\ncomponents/\n  dashboard/                  dashboard UI\n  docs/                      documentation shell and renderers\n  sections/hero.tsx           landing hero\nlib/\n  incidents.ts                incident model and helpers\n  docs/                       docs registry and content\n  use-focus-trap.ts           accessible overlay focus trap" },
        { type: "p", text: "Dashboard views are split by responsibility: tables, charts, dialogs, detail panels, badges, and grouped views each have their own file." },
      ],
    },
  ],
};
