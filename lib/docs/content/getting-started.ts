import type { DocSection } from "@/lib/docs/types";

export const gettingStarted: DocSection = {
  id: "getting-started",
  title: "Getting Started",
  pages: [
    {
      id: "introduction",
      title: "Introduction",
      description:
        "Understand what RCA Tracking System records, who it is for, and how the dashboard fits together.",
      keywords: ["overview", "root cause", "incident", "dashboard", "start"],
      blocks: [
        { type: "h2", id: "overview", text: "Overview" },
        {
          type: "p",
          text: "RCA Tracking System is a web app for recording incidents and the analysis that follows. Each record keeps the incident description, affected system, cause type, evidence, root cause, preventive action, who corrected it, and its current status together in one place.",
        },
        {
          type: "p",
          text: "The goal is simple: replace scattered notes and closed tickets with a defensible explanation of what happened and what changed because of it.",
        },
        {
          type: "table",
          headers: ["Project", "Details"],
          rows: [
            ["Name", "RCA Tracking System"],
            ["Type", "Web app"],
            ["Tech stack", "Next.js 16, React 19, Tailwind CSS 4"],
            ["Audience", "Incident-response teams and developers"],
          ],
        },
        {
          type: "callout",
          tone: "note",
          title: "Everything is in memory",
          text: "This version does not use a database, browser storage, or a backend. Refreshing the page clears the incident log. Treat the dashboard as a working prototype, not a system of record.",
        },
        { type: "h2", id: "what-you-can-do", text: "What you can do" },
        {
          type: "list",
          items: [
            "Record an incident with a unique ID, system, cause type, and sub-type.",
            "Capture evidence and a root-cause statement before closing the record.",
            "Mark an incident as Pending or Resolved.",
            "See totals, preventable incidents, the most common cause, and charts on the overview.",
            "Search and filter the incident log, then open a row for the full analysis.",
            "Browse causes, preventive actions, corrections, and resolved issues in focused views.",
          ],
        },
        { type: "h2", id: "who-it-is-for", text: "Who it is for" },
        {
          type: "p",
          text: "The app is built for support, operations, engineering, and quality teams that run incident reviews. It also works as a reference implementation for developers who want to see a complete client-side incident workflow built with Next.js and React.",
        },
        { type: "h2", id: "core-workflow", text: "The core workflow" },
        {
          type: "steps",
          items: [
            {
              title: "Log the incident",
              text: "Give it an ID, the affected system, and a short description of what went wrong.",
            },
            {
              title: "Classify the cause",
              text: "Choose Human error, System fault, Process gap, or External, then pick the closest sub-type.",
            },
            {
              title: "Record the evidence",
              text: "Write down what you observed. Evidence should support the root cause, not repeat the description.",
            },
            {
              title: "State the root cause",
              text: "Explain the underlying reason the incident happened, not just the visible symptom.",
            },
            {
              title: "Close the loop",
              text: "Add the preventive action, who corrected it, and whether the system could have prevented it. Set the status to Resolved when the work is complete.",
            },
          ],
        },
        { type: "h2", id: "what-is-included", text: "What is included" },
        {
          type: "list",
          items: [
            "A marketing landing page at `/`.",
            "The incident dashboard at `/dashboard`.",
            "Overview, Incidents, Resolved issues, Causes, Actions, and Corrections views.",
            "This documentation site at `/docs`.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Ready to try it?",
          text: "The Quick Start walks through a local install and your first incident in about five minutes.",
        },
      ],
    },
    {
      id: "features",
      title: "Features",
      description: "A complete feature list will be published with the first stable release.",
      keywords: ["features", "roadmap", "coming soon"],
      blocks: [
        {
          type: "message",
          title: "Feature list coming soon",
          text: "This page is reserved for the full feature matrix. The current prototype already covers incident capture, filtering, status tracking, cause analysis, preventive actions, and summary charts.",
        },
        {
          type: "callout",
          tone: "note",
          text: "For now, start with the Introduction and Quick Start pages. New capabilities will be documented here as they ship.",
        },
      ],
    },
    {
      id: "quick-start",
      title: "Quick Start",
      description:
        "Install the project, create an account, and record your first incident in a few minutes.",
      keywords: [
        "install",
        "run",
        "local",
        "npm",
        "first incident",
        "get started",
        "account",
        "sign up",
      ],
      blocks: [
        {
          type: "p",
          text: "This guide takes you from a fresh clone to a recorded incident. You will need Node.js 20 or newer and npm.",
        },
        {
          type: "callout",
          tone: "note",
          title: "No database setup",
          text: "There is nothing to migrate or seed. The dashboard starts empty and keeps records in React state for the current page session.",
        },
        { type: "h2", id: "install-dependencies", text: "1. Install dependencies" },
        { type: "code", lang: "bash", code: "npm install" },
        { type: "h2", id: "start-the-dev-server", text: "2. Start the dev server" },
        { type: "code", lang: "bash", code: "npm run dev" },
        {
          type: "p",
          text: "Open `http://localhost:3000`. The landing page links to both the dashboard and this documentation.",
        },
        { type: "h2", id: "create-an-account", text: "3. Create an account" },
        {
          type: "p",
          text: "Open `http://localhost:3000/auth`, or choose **Sign in** on the landing page. The page opens on the **Log in** tab; select **Sign up** to create your account.",
        },
        {
          type: "steps",
          items: [
            {
              title: "Enter your details",
              text: "Add your email, date of birth, and a username. Your age is calculated from the date of birth and you must be at least 13 to continue.",
            },
            {
              title: "Choose a password",
              text: "Use at least 8 characters, then repeat it in Confirm password. Select the eye icon to check what you typed.",
            },
            {
              title: "Read the terms and privacy policy",
              text: "Select the agreement checkbox. One dialog opens with separate Terms & Conditions and Privacy Policy tabs. Review both, then choose I have read both to accept them.",
            },
            {
              title: "Create the account",
              text: "Select Create account. The form switches to Log in with your email filled in. Enter your password and select Sign in to open the dashboard.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warning",
          title: "Prototype authentication",
          text: "Accounts are not stored and no password is checked against a backend. Any non-empty email or username and password will sign you in. Do not enter real credentials.",
        },
        { type: "h2", id: "open-the-dashboard", text: "4. Open the dashboard" },
        {
          type: "p",
          text: "After signing in you land on the dashboard. You can also go directly to `http://localhost:3000/dashboard`.",
        },
        { type: "h2", id: "record-an-incident", text: "5. Record an incident" },
        {
          type: "steps",
          items: [
            {
              title: "Choose Add Incident",
              text: "The form opens with INC-001 already suggested. The ID increments automatically as records are added.",
            },
            {
              title: "Describe what happened",
              text: "Enter a short description, the affected system, and choose a cause type and sub-type.",
            },
            {
              title: "Add the analysis",
              text: "Fill in the evidence and the root cause statement. These fields are required so a record is never just a ticket title.",
            },
            {
              title: "Set prevention and status",
              text: "Choose whether the system could have prevented it, add the preventive action, and select Pending or Resolved.",
            },
            {
              title: "Save the record",
              text: "Select Save incident. The table, summary cards, and charts update immediately.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Keyboard-friendly",
          text: "Every control is reachable with Tab. Press Enter on a table row to open the detail panel and Escape to close it.",
        },
        { type: "h2", id: "verify-the-build", text: "6. Verify the production build" },
        {
          type: "code",
          lang: "bash",
          code: "npm run build\nnpm start",
        },
        {
          type: "p",
          text: "The build should finish with the landing, auth, dashboard, and documentation routes. If the dev server is still running, stop it before starting the production server.",
        },
        { type: "h2", id: "next-steps", text: "Next steps" },
        {
          type: "list",
          items: [
            "Read How It Works to understand the data flow.",
            "Open Basic Usage for a guided dashboard tour.",
            "See Project Structure before making changes.",
          ],
        },
      ],
    },
    {
      id: "installation",
      title: "Installation",
      description: "Install dependencies and choose a local or production setup.",
      keywords: ["install", "npm", "build", "production"],
      blocks: [
        {
          type: "p",
          text: "The project is a standard Next.js app. Install once, then run the development server.",
        },
        { type: "code", lang: "bash", code: "npm install\nnpm run dev" },
        {
          type: "p",
          text: "To produce a production build, run `npm run build` and then `npm start`.",
        },
        {
          type: "callout",
          tone: "note",
          title: "Node version",
          text: "Use Node.js 20 or newer. Older releases are not supported by the current Next.js and React versions.",
        },
      ],
    },
    {
      id: "requirements",
      title: "Requirements",
      description: "The runtime, package manager, and browser versions supported by this project.",
      keywords: ["node", "npm", "browser", "requirements"],
      blocks: [
        {
          type: "table",
          headers: ["Requirement", "Version", "Why it matters"],
          rows: [
            ["Node.js", "20 or newer", "Required by Next.js 16"],
            ["npm", "10 or newer", "Installs the lockfile dependencies"],
            ["Modern browser", "Current Chrome, Edge, Firefox, or Safari", "Uses native dialogs and modern CSS"],
            ["Screen size", "360px and up", "The dashboard and docs adapt to mobile"],
          ],
        },
        {
          type: "p",
          text: "No database, external API, or environment file is required for the current in-memory prototype.",
        },
        {
          type: "callout",
          tone: "tip",
          text: "Run `node --version` and `npm --version` to check your local setup before installing.",
        },
      ],
    },
    {
      id: "configuration",
      title: "Configuration",
      description: "There is no server configuration yet. These are the project-level settings you can change.",
      keywords: ["config", "environment", "theme", "settings"],
      blocks: [
        {
          type: "p",
          text: "The prototype has no configuration file and no required environment variables. Most customization happens in the content and theme files.",
        },
        { type: "table", headers: ["Area", "File", "What to change"], rows: [
          ["Theme tokens", "app/globals.css", "Colours, radii, chart palette"],
          ["Cause types", "lib/incidents.ts", "Cause categories and sub-types"],
          ["Docs navigation", "lib/docs/content/index.ts", "Sections and page registry"],
          ["Landing copy", "components/sections/hero.tsx", "Hero text and calls to action"],
        ] },
        {
          type: "callout",
          tone: "note",
          text: "Do not put secrets in `NEXT_PUBLIC_*` variables. Anything exposed publicly is shipped to the browser.",
        },
      ],
    },
  ],
};
