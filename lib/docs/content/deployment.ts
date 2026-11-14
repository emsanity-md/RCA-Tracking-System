import type { DocSection } from "@/lib/docs/types";

export const deployment: DocSection = {
  id: "deployment",
  title: "Deployment",
  pages: [
    {
      id: "deployment-guide",
      title: "Deployment Guide",
      description: "Build and deploy the static app to any Next.js-compatible host.",
      keywords: ["deploy", "build", "host", "vercel", "production"],
      blocks: [
        { type: "steps", items: [
          { title: "Install with the lockfile", text: "Run npm ci so the deployment matches the committed dependency versions." },
          { title: "Build", text: "Run npm run build. The landing page, dashboard shell, and docs pages are prerendered." },
          { title: "Serve", text: "Run npm start, or let your host serve the generated Next.js output." },
        ] },
        { type: "code", lang: "bash", code: "npm ci\nnpm run build\nnpm start" },
        { type: "callout", tone: "note", title: "No server state", text: "Horizontal scaling is trivial because incidents are not persisted. That also means redeploying or refreshing loses the records." },
      ],
    },
    {
      id: "environments",
      title: "Environments",
      description: "Local, preview, and production expectations.",
      keywords: ["environments", "local", "preview", "production"],
      blocks: [
        { type: "table", headers: ["Environment", "Purpose", "Data"], rows: [
          ["Local", "Development and demos", "In-memory only"],
          ["Preview", "Review a pull request", "In-memory only"],
          ["Production", "Public prototype", "In-memory only"],
        ] },
        { type: "p", text: "No environment variables are required today. When persistence is added, introduce a separate database per environment and keep credentials server-side." },
      ],
    },
    {
      id: "ci-cd",
      title: "CI/CD",
      description: "A minimal pipeline for type checks, lint, build, and browser checks.",
      keywords: ["ci", "cd", "github actions", "pipeline"],
      blocks: [
        { type: "code", lang: "yaml", title: ".github/workflows/ci.yml (draft)", code: "name: ci\non: [push, pull_request]\njobs:\n  verify:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: npm\n      - run: npm ci\n      - run: npx tsc --noEmit\n      - run: npm run lint\n      - run: npm run build" },
        { type: "callout", tone: "note", text: "This workflow is a starting point and is not committed. Browser smoke tests need a running server and a headless Chrome setup." },
      ],
    },
  ],
};
