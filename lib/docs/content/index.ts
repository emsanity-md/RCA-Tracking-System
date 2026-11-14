import { gettingStarted } from "@/lib/docs/content/getting-started";
import { coreConcepts } from "@/lib/docs/content/core-concepts";
import { guides } from "@/lib/docs/content/guides";
import { reference } from "@/lib/docs/content/reference";
import { advanced } from "@/lib/docs/content/advanced";
import { deployment } from "@/lib/docs/content/deployment";
import { help } from "@/lib/docs/content/help";
import { projectInfo } from "@/lib/docs/content/project-info";
import type { DocPage, DocSection } from "@/lib/docs/types";

export const docSections: DocSection[] = [
  gettingStarted,
  coreConcepts,
  guides,
  reference,
  advanced,
  deployment,
  help,
  projectInfo,
];

export const docPages: DocPage[] = docSections.flatMap((section) =>
  section.pages.map((page) => {
    const slug = [section.id, page.id];
    return {
      ...page,
      sectionId: section.id,
      sectionTitle: section.title,
      slug,
      href: `/docs/${slug.join("/")}`,
    };
  }),
);

export const defaultDocPage =
  docPages.find((page) => page.href === "/docs/getting-started/introduction") ??
  docPages[0];
