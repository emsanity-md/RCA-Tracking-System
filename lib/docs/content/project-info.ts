import type { DocSection } from "@/lib/docs/types";

export const projectInfo: DocSection = {
  id: "project-info",
  title: "Project Info",
  pages: [
    {
      id: "contributing",
      title: "Contributing",
      description: "Contribute a fix, a docs improvement, or a focused feature.",
      keywords: ["contributing", "pull request", "development"],
      blocks: [
        { type: "steps", items: [
          { title: "Fork and branch", text: "Create a branch with a short, descriptive name." },
          { title: "Make a focused change", text: "Keep unrelated refactors out of the same pull request." },
          { title: "Run the checks", text: "Type-check, lint, and build before opening the PR." },
          { title: "Describe the why", text: "Explain the problem and the approach, not only the files changed." },
        ] },
        { type: "code", lang: "bash", code: "npx tsc --noEmit\nnpm run lint\nnpm run build" },
      ],
    },
    {
      id: "code-of-conduct",
      title: "Code of Conduct",
      description: "Keep collaboration respectful, specific, and useful.",
      keywords: ["conduct", "community", "respect"],
      blocks: [
        { type: "p", text: "Assume good intent, critique the work rather than the person, and make space for people with different levels of experience. Harassment and discriminatory language are not welcome." },
        { type: "p", text: "Report conduct concerns privately to the repository maintainers." },
      ],
    },
    {
      id: "changelog",
      title: "Changelog",
      description: "Notable changes to the project and this documentation.",
      keywords: ["changelog", "releases", "version", "changes"],
      blocks: [
        { type: "h2", id: "v0-1-0", text: "v0.1.0 — Current" },
        { type: "list", items: [
          "Incident dashboard with overview, incident log, resolved issues, causes, actions, and corrections.",
          "Add Incident dialog with validation, ID suggestion, and Pending/Resolved status.",
          "Summary cards and inline SVG charts with empty states.",
          "Keyboard-accessible drawers and detail panels with focus return.",
          "Documentation site with search, collapsible navigation, and previous/next links.",
        ] },
        { type: "h2", id: "unreleased", text: "Unreleased" },
        { type: "list", items: [
          "Persistent storage and edit/delete actions.",
          "Status changes after creation.",
          "Server-side authentication and audit history.",
        ] },
      ],
    },
    {
      id: "roadmap",
      title: "Roadmap",
      description: "Where the prototype goes next.",
      keywords: ["roadmap", "future", "planned"],
      blocks: [
        { type: "list", ordered: true, items: [
          "Add durable storage and an explicit save lifecycle.",
          "Add edit, reopen, and delete actions with confirmation.",
          "Introduce authenticated workspaces and role-based access.",
          "Add pagination and saved filter views for larger logs.",
          "Publish a versioned REST API and webhook integrations.",
        ] },
        { type: "callout", tone: "note", text: "The roadmap is directional. Priorities can change as the prototype is tested with real incident-review workflows." },
      ],
    },
    {
      id: "migration-guide",
      title: "Migration Guide",
      description: "Moving from the in-memory prototype to a persistent build.",
      keywords: ["migration", "upgrade", "storage", "database"],
      blocks: [
        { type: "p", text: "There are no previous releases to migrate from. When persistence lands, keep the `Incident` field names stable and add a schema version to the stored record." },
        { type: "code", lang: "ts", title: "Suggested future wrapper", code: "type StoredIncident = {\n  schemaVersion: 1;\n  incident: Incident;\n  createdAt: string;\n  updatedAt: string;\n};" },
        { type: "callout", tone: "warning", text: "Do not rely on refresh to preserve prototype data. Export or re-enter records before changing builds." },
      ],
    },
    {
      id: "license",
      title: "License",
      description: "The repository does not currently include a license file.",
      keywords: ["license", "legal", "usage"],
      blocks: [
        { type: "callout", tone: "warning", title: "No license file detected", text: "This repository does not contain a LICENSE file. Add one before distributing or accepting external contributions." },
        { type: "p", text: "Once a license is chosen, add it at the repository root and update this page with the license name and a link to the full text." },
      ],
    },
  ],
};
