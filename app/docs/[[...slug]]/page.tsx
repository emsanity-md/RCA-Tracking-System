import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsChrome } from "@/components/docs/docs-chrome";
import { DocContent } from "@/components/docs/doc-content";
import { defaultDocPage, docPages } from "@/lib/docs/content";
import {
  findDocPage,
  getAdjacentPages,
  getNavSections,
  getSearchItems,
  getToc,
} from "@/lib/docs/navigation";

export const instant = false;

export function generateStaticParams() {
  return [{ slug: [] }, ...docPages.map((page) => ({ slug: page.slug }))];
}

function resolvePage(slug: string[] | undefined) {
  return findDocPage(slug) ?? (slug && slug.length > 0 ? undefined : defaultDocPage);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = resolvePage(slug);

  if (!page) {
    return { title: "Documentation not found — RCA Tracking System" };
  }

  return {
    title: `${page.title} — RCA Tracking System Docs`,
    description: page.description,
    alternates: { canonical: page.href },
  };
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = resolvePage(slug);

  if (!page) notFound();

  const { previous, next } = getAdjacentPages(page);
  const toc = getToc(page);

  return (
    <DocsChrome
      key={page.href}
      page={page}
      sections={getNavSections()}
      searchItems={getSearchItems()}
      toc={toc}
      previous={previous}
      next={next}
    >
      <DocContent blocks={page.blocks} />
    </DocsChrome>
  );
}
