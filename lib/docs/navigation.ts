import { docPages, docSections } from "@/lib/docs/content";
import type {
  DocNavSection,
  DocPage,
  DocSearchItem,
  TocItem,
} from "@/lib/docs/types";

export function findDocPage(slug: string[] | undefined): DocPage | undefined {
  if (!slug || slug.length === 0) return undefined;
  return docPages.find(
    (page) =>
      page.slug.length === slug.length &&
      page.slug.every((segment, index) => segment === slug[index]),
  );
}

export function getAdjacentPages(page: DocPage): {
  previous?: DocPage;
  next?: DocPage;
} {
  const index = docPages.findIndex((entry) => entry.href === page.href);
  return {
    previous: index > 0 ? docPages[index - 1] : undefined,
    next: index >= 0 && index < docPages.length - 1 ? docPages[index + 1] : undefined,
  };
}

export function getToc(page: DocPage): TocItem[] {
  const toc: TocItem[] = [];

  for (const block of page.blocks) {
    if (block.type === "h2") {
      toc.push({ id: block.id, title: block.text, level: 2 });
    } else if (block.type === "h3") {
      toc.push({ id: block.id, title: block.text, level: 3 });
    }
  }

  return toc;
}

export function getNavSections(): DocNavSection[] {
  return docSections.map((section) => ({
    id: section.id,
    title: section.title,
    pages: section.pages.map((page) => ({
      id: page.id,
      title: page.title,
      href: `/docs/${section.id}/${page.id}`,
    })),
  }));
}

export function getSearchItems(): DocSearchItem[] {
  return docPages.map((page) => ({
    title: page.title,
    sectionTitle: page.sectionTitle,
    description: page.description,
    href: page.href,
    keywords: page.keywords ?? [],
  }));
}
