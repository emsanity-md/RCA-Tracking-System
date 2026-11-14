import type { DocSection } from "@/lib/docs/types";

export const help: DocSection = {
  id: "help",
  title: "Help & Support",
  pages: [
    {
      id: "faq",
      title: "FAQ",
      description: "Quick answers to common questions about the prototype.",
      keywords: ["faq", "questions", "help"],
      blocks: [
        { type: "h3", id: "where-is-data", text: "Where is my data stored?" },
        { type: "p", text: "Only in React state for the current dashboard page. There is no database or local storage." },
        { type: "h3", id: "why-empty", text: "Why did every incident disappear?" },
        { type: "p", text: "A refresh or navigating away unmounts the dashboard and clears the in-memory array. This is expected." },
        { type: "h3", id: "real-use", text: "Can I use this for real incidents?" },
        { type: "p", text: "Not yet. It has no authentication, persistence, audit trail, or access control." },
        { type: "h3", id: "add-cause", text: "How do I add a cause type?" },
        { type: "p", text: "Edit CAUSE_TYPES in lib/incidents.ts. The form, filters, badges, and charts update automatically." },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      description: "Fix the most common local setup and runtime issues.",
      keywords: ["troubleshoot", "errors", "fix", "port", "node"],
      blocks: [
        { type: "table", headers: ["Symptom", "Likely cause", "Fix"], rows: [
          ["Port 3000 already in use", "Another dev server is running", "Stop it, or start with a different port"],
          ["Build fails on Node 18", "Unsupported runtime", "Upgrade to Node.js 20 or newer"],
          ["Icons or fonts look wrong", "Dev cache after dependency changes", "Restart the dev server and hard-refresh"],
          ["No incidents after reload", "In-memory prototype", "Re-enter records; persistence is not implemented"],
        ] },
        { type: "code", lang: "bash", title: "Use another port", code: "npm run dev -- --port 3001" },
      ],
    },
    {
      id: "known-issues",
      title: "Known Issues",
      description: "Current limitations that are intentional or not yet scheduled.",
      keywords: ["known issues", "limitations", "bugs"],
      blocks: [
        { type: "list", items: [
          "Records are lost on refresh, route change, or logout.",
          "There is no edit or delete action for an incident.",
          "Status can be set when creating a record but not changed later.",
          "The incident table renders all matching rows without pagination.",
          "The version selector shows an unpublished legacy version as disabled.",
        ] },
        { type: "callout", tone: "note", text: "These are prototype boundaries, not deployment bugs. Check the Roadmap for planned work." },
      ],
    },
    {
      id: "getting-help",
      title: "Getting Help",
      description: "Where to ask questions and report documentation gaps.",
      keywords: ["support", "help", "issues", "github"],
      blocks: [
        { type: "p", text: "For a reproducible bug or a docs correction, open an issue in the project repository with the route, browser, and steps to reproduce." },
        { type: "callout", tone: "tip", title: "Include the basics", text: "Node version, npm version, the command you ran, and the full error text make the first reply much more useful." },
        { type: "p", text: "Repository: `https://github.com/emsanity-md/RCA-Tracking-System`." },
      ],
    },
  ],
};
