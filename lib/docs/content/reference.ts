import type { DocSection } from "@/lib/docs/types";

export const reference: DocSection = {
  id: "reference",
  title: "API / Reference",
  pages: [
    {
      id: "functions",
      title: "Functions",
      description: "Useful helpers in lib/incidents.ts and the shared focus-trap hook.",
      keywords: ["functions", "api", "helpers", "incidents", "typescript"],
      blocks: [
        { type: "p", text: "There is no public HTTP API in this version. These are the internal functions other dashboard components use." },
        { type: "h2", id: "suggestnextincidentid", text: "suggestNextIncidentId" },
        { type: "code", lang: "ts", code: "suggestNextIncidentId(incidents: readonly Incident[]): string" },
        { type: "p", text: "Finds the highest existing `INC-###` number and returns the next one. If there are no records, it returns `INC-001`." },
        { type: "h2", id: "mostcommoncause", text: "mostCommonCause" },
        { type: "code", lang: "ts", code: "mostCommonCause(incidents: readonly Incident[]): {\n  cause: CauseType;\n  count: number;\n} | null" },
        { type: "p", text: "Returns the most frequent cause type, or `null` when the log is empty. Ties resolve to the cause seen first." },
        { type: "h2", id: "formatdatetime", text: "formatDateTime" },
        { type: "code", lang: "ts", code: "formatDateTime(value: string): string" },
        { type: "p", text: "Formats a stored local datetime for display. Invalid values return an em dash instead of throwing." },
        { type: "h2", id: "usefocustrap", text: "useFocusTrap" },
        { type: "code", lang: "ts", code: "useFocusTrap({\n  active: boolean,\n  containerRef: RefObject<HTMLElement | null>,\n  onEscape?: () => void,\n  initialFocusRef?: RefObject<HTMLElement | null>,\n}): void" },
        { type: "callout", tone: "note", text: "This hook is for custom overlays. Native <dialog> elements already trap focus and restore it when closed." },
      ],
    },
    {
      id: "request-response",
      title: "Request / Response Formats",
      description: "No public API yet — this is the record shape a future API would return.",
      keywords: ["request", "response", "json", "api", "format"],
      blocks: [
        { type: "callout", tone: "warning", title: "No endpoint exists yet", text: "Do not build an integration against the current app. The shape below documents the in-memory model so a future API can preserve it." },
        { type: "code", lang: "json", title: "Incident response", code: "{\n  \"incidentId\": \"INC-001\",\n  \"description\": \"Wrong data deleted\",\n  \"system\": \"Billing module\",\n  \"dateTime\": \"2026-11-14T09:42\",\n  \"causeType\": \"Human error\",\n  \"subType\": \"Wrong input\",\n  \"evidence\": \"Audit log shows the wrong account ID.\",\n  \"rootCause\": \"No confirmation step before deletion.\",\n  \"status\": \"Resolved\",\n  \"preventable\": true,\n  \"preventiveAction\": \"Add a confirmation step.\",\n  \"correctedBy\": \"Dev team\",\n  \"dateRecorded\": \"2026-11-14\"\n}" },
      ],
    },
    {
      id: "authentication",
      title: "Authentication",
      description: "Authentication is not implemented in the prototype.",
      keywords: ["auth", "login", "logout", "security"],
      blocks: [
        { type: "p", text: "The dashboard is open to anyone who can reach the page. The Logout button opens a confirmation and, when confirmed, returns to the landing page. It does not clear a server session because none exists." },
        { type: "callout", tone: "warning", title: "Do not store sensitive incidents yet", text: "Without authentication, persistence, or access control, this build is suitable for local demos and workshops only." },
        { type: "p", text: "A production version would need an auth provider, server-side authorization checks, and a durable store before handling real incident data." },
      ],
    },
    {
      id: "error-codes",
      title: "Error Codes",
      description: "Client-side validation messages and what to do about them.",
      keywords: ["errors", "validation", "messages", "debug"],
      blocks: [
        { type: "table", headers: ["Message", "Where it appears", "Fix"], rows: [
          ["Incident ID is required.", "Add Incident dialog", "Enter a unique ID."],
          ["That incident ID already exists.", "Add Incident dialog", "Use the suggested ID or choose another."],
          ["Describe what happened.", "Description field", "Add a short incident summary."],
          ["Select a cause type.", "Cause type", "Choose one of the four categories."],
          ["Select a sub-type.", "Sub-type", "Pick the closest specific cause."],
          ["Add the supporting evidence.", "Evidence", "Record what you observed."],
          ["State the root cause.", "Root cause", "Explain the underlying reason."],
          ["Choose whether the system could prevent it.", "Preventable", "Select Yes or No."],
        ] },
        { type: "p", text: "There is no server error catalog because there is no server API in this release." },
      ],
    },
    {
      id: "cli-commands",
      title: "CLI Commands",
      description: "The npm scripts available in this repository.",
      keywords: ["cli", "commands", "npm", "build", "lint"],
      blocks: [
        { type: "table", headers: ["Command", "Purpose"], rows: [
          ["npm install", "Install dependencies"],
          ["npm run dev", "Start the development server on port 3000"],
          ["npm run build", "Create a production build"],
          ["npm start", "Serve the production build"],
          ["npm run lint", "Run ESLint"],
        ] },
        { type: "code", lang: "bash", title: "Production check", code: "npm run lint\nnpm run build\nnpm start" },
      ],
    },
    {
      id: "environment-variables",
      title: "Environment Variables",
      description: "No variables are required. Here is what a future deployment may add.",
      keywords: ["environment", "env", "variables", "deployment"],
      blocks: [
        { type: "p", text: "The current app runs with no environment file. If you add a backend later, keep secrets server-side and expose only deliberately public values." },
        { type: "code", lang: "bash", title: ".env.local (optional example)", code: "# Not used by the current in-memory prototype.\n# Add future server-side values here.\nDATABASE_URL=postgresql://localhost/rca" },
        { type: "callout", tone: "warning", title: "Never prefix secrets", text: "Variables named NEXT_PUBLIC_* are embedded in the browser bundle. API keys and database URLs must not use that prefix." },
      ],
    },
  ],
};
