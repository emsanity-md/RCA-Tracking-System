import type { DocSection } from "@/lib/docs/types";

export const guides: DocSection = {
  id: "guides",
  title: "Guides",
  pages: [
    {
      id: "basic-usage",
      title: "Basic Usage",
      description: "A guided tour of recording, filtering, and reviewing incidents.",
      keywords: ["guide", "usage", "filter", "search", "review"],
      blocks: [
        { type: "h2", id: "record", text: "Record an incident" },
        { type: "p", text: "Open **Add Incident**, fill in the three sections, and save. Required fields show an inline error if they are empty. IDs are unique and suggested automatically." },
        { type: "h2", id: "find", text: "Find a record" },
        { type: "p", text: "Use the incident log search for an ID, description, system, or person. The System filter is built from the systems already entered, and the Cause type filter narrows the list further." },
        { type: "h2", id: "review", text: "Review the analysis" },
        { type: "p", text: "Select a row to open the detail panel. It contains every field, including the full description, evidence, root cause, and preventive action." },
        {
          type: "callout",
          tone: "tip",
          title: "Clear filters",
          text: "When a search returns no results, use Clear filters rather than reloading the page. Reloading clears all in-memory incidents.",
        },
      ],
    },
    {
      id: "tutorials",
      title: "Tutorials",
      description: "Short walkthroughs for common incident-review tasks.",
      keywords: ["tutorial", "walkthrough", "examples"],
      blocks: [
        { type: "h2", id: "tutorial-log", text: "Tutorial: log a preventable human error" },
        { type: "steps", items: [
          { title: "Add the basics", text: "Use the billing module as the system and describe the wrong record deletion." },
          { title: "Classify", text: "Choose Human error, then Wrong input." },
          { title: "Explain", text: "Record the audit log as evidence and state that the selector lacked a confirmation step as the root cause." },
          { title: "Prevent", text: "Mark it preventable, add a confirmation step as the action, and resolve it." },
        ] },
        { type: "h2", id: "tutorial-resolved", text: "Tutorial: review unresolved work" },
        { type: "p", text: "Open **Resolved issues** to see only closed records. For outstanding work, use the Incidents view and filter by cause type." },
      ],
    },
    {
      id: "common-use-cases",
      title: "Common Use Cases",
      description: "How different teams can use the same incident record.",
      keywords: ["use cases", "support", "operations", "engineering"],
      blocks: [
        { type: "list", items: [
          "**Support:** record customer-impacting incidents and the evidence behind the resolution.",
          "**Operations:** track recurring process gaps and the actions that close them.",
          "**Engineering:** keep post-incident root causes next to the preventive fix.",
          "**Quality:** review preventable incidents and spot the most common cause.",
        ] },
        { type: "callout", tone: "note", text: "Because records are session-only, this version is best for demos, workshops, and design reviews." },
      ],
    },
    {
      id: "best-practices",
      title: "Best Practices",
      description: "Write records that stay useful after the incident is closed.",
      keywords: ["best practices", "writing", "evidence", "root cause"],
      blocks: [
        { type: "list", items: [
          "Write the description in plain language: what happened, where, and who was affected.",
          "Keep evidence specific. Link a log line, timestamp, or artifact rather than saying “checked logs”.",
          "State one root cause. If there are several, split the incident or treat the others as contributing factors.",
          "Make the preventive action testable. “Be more careful” is not a control.",
          "Resolve only when the correction is complete and the action has an owner.",
        ] },
        { type: "callout", tone: "tip", title: "A useful test", text: "A new teammate should understand the incident, the cause, and the fix without asking you a follow-up question." },
      ],
    },
    {
      id: "examples",
      title: "Examples",
      description: "A complete sample record and a small formatting helper call.",
      keywords: ["example", "sample", "json", "incident"],
      blocks: [
        { type: "code", lang: "json", title: "Sample incident", code: "{\n  \"incidentId\": \"INC-001\",\n  \"description\": \"Wrong data deleted\",\n  \"system\": \"Billing module\",\n  \"causeType\": \"Human error\",\n  \"subType\": \"Wrong input\",\n  \"evidence\": \"Audit log shows the wrong account ID at 09:42.\",\n  \"rootCause\": \"The selector had no confirmation step.\",\n  \"status\": \"Resolved\",\n  \"preventable\": true,\n  \"preventiveAction\": \"Add a confirmation step before deletion.\",\n  \"correctedBy\": \"Dev team\",\n  \"dateRecorded\": \"2026-11-14\"\n}" },
        { type: "code", lang: "ts", title: "Formatting a date", code: "import { formatDateTime } from \"@/lib/incidents\";\n\nformatDateTime(\"2026-11-14T09:42\");\n// \"Nov 14, 2026, 9:42 AM\"" },
      ],
    },
  ],
};
