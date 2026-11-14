export type CalloutTone = "note" | "tip" | "warning";

export type DocBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; lang: string; code: string; title?: string }
  | {
      type: "callout";
      tone: CalloutTone;
      title?: string;
      text: string;
    }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "message"; title: string; text: string };

export type DocPageInput = {
  /** Last URL segment. The section id becomes the first segment. */
  id: string;
  title: string;
  description: string;
  keywords?: string[];
  blocks: DocBlock[];
};

export type DocSection = {
  id: string;
  title: string;
  pages: DocPageInput[];
};

export type DocPage = DocPageInput & {
  sectionId: string;
  sectionTitle: string;
  slug: string[];
  href: string;
};

export type DocNavPage = {
  id: string;
  title: string;
  href: string;
};

export type DocNavSection = {
  id: string;
  title: string;
  pages: DocNavPage[];
};

export type DocSearchItem = {
  title: string;
  sectionTitle: string;
  description: string;
  href: string;
  keywords: string[];
};

export type TocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};
