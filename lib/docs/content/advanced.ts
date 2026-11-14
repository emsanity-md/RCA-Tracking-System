import type { DocSection } from "@/lib/docs/types";

export const advanced: DocSection = {
  id: "advanced",
  title: "Advanced",
  pages: [
    {
      id: "customization",
      title: "Customization / Plugins",
      description: "Change the theme, add a cause type, or extend the dashboard views.",
      keywords: ["customize", "theme", "plugins", "extend"],
      blocks: [
        { type: "h2", id: "theme", text: "Theme tokens" },
        { type: "p", text: "All surfaces and text colours come from tokens in `app/globals.css`. Change the token values rather than individual components to keep the monochrome system consistent." },
        { type: "code", lang: "css", code: ":root {\n  --background: #000000;\n  --foreground: #f2f2f2;\n  --border: #1f1f1f;\n  --ring: #ffffff;\n}" },
        { type: "h2", id: "cause-types", text: "Add a cause type" },
        { type: "p", text: "Edit `CAUSE_TYPES` in `lib/incidents.ts`. The form, filters, charts, and badges derive their options from that array." },
        { type: "code", lang: "ts", code: "export const CAUSE_TYPES = [\n  {\n    name: \"Human error\",\n    subTypes: [\"Wrong input\", \"Missed step\", \"Misconfiguration\"],\n  },\n];" },
        { type: "callout", tone: "tip", text: "There is no plugin runtime. Extensions are source-level changes in this version." },
      ],
    },
    {
      id: "performance",
      title: "Performance",
      description: "Why the current build is fast and where that changes with scale.",
      keywords: ["performance", "speed", "render", "charts"],
      blocks: [
        { type: "list", items: [
          "All charts are inline SVG, so there is no charting library or client bundle for visualisation.",
          "Derived metrics are computed from a small in-memory array on each render.",
          "Docs pages are statically generated from a local registry.",
          "A production build prerenders the landing page, dashboard shell, and every docs page.",
        ] },
        { type: "callout", tone: "note", text: "A real incident volume in the thousands will need pagination or virtualization for the table. The current table renders every matching row." },
      ],
    },
    {
      id: "security",
      title: "Security",
      description: "Current security boundaries and what a production build must add.",
      keywords: ["security", "auth", "data", "xss"],
      blocks: [
        { type: "list", items: [
          "React escapes rendered text by default; the app does not use dangerouslySetInnerHTML for incident content.",
          "There is no authentication, authorization, or server-side persistence.",
          "Records disappear when the dashboard unmounts and are never transmitted.",
          "The Logout action is a navigation back to the landing page, not a session invalidation.",
        ] },
        { type: "callout", tone: "warning", title: "Prototype boundary", text: "Do not enter customer data, credentials, or regulated information. A production deployment needs auth, audit logging, encrypted storage, and a retention policy." },
      ],
    },
    {
      id: "integrations",
      title: "Integrations",
      description: "Connecting incident capture to ticketing, monitoring, or a database later.",
      keywords: ["integrations", "api", "webhooks", "ticketing"],
      blocks: [
        { type: "p", text: "The prototype has no external integrations. The clean path is to keep the `Incident` type stable, add server actions or route handlers, and persist through a repository layer." },
        { type: "list", items: [
          "Ticketing: create or link a ticket from a saved incident.",
          "Monitoring: prefill evidence from an alert or log query.",
          "Notifications: post resolved incidents to a team channel.",
          "Data warehouse: export closed incidents for trend analysis.",
        ] },
        { type: "callout", tone: "note", text: "Any integration that receives incident data should be authenticated and should not assume the current in-memory lifecycle." },
      ],
    },
    {
      id: "testing",
      title: "Testing",
      description: "The checks used while building the app and how to repeat them.",
      keywords: ["testing", "puppeteer", "lint", "build", "smoke test"],
      blocks: [
        { type: "code", lang: "bash", title: "Static checks", code: "npx tsc --noEmit\nnpm run lint\nnpm run build" },
        { type: "p", text: "Browser smoke tests use Puppeteer against the local dev server. The screenshot and script folders are gitignored so verification artifacts do not enter the repository." },
        { type: "callout", tone: "tip", text: "Before a release, check the empty state, add an incident, open the detail panel, switch the mobile drawer, and confirm keyboard focus returns to the trigger after closing each overlay." },
      ],
    },
  ],
};
