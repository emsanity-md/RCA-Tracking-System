import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { RichText } from "@/components/docs/rich-text";
import type { DocBlock } from "@/lib/docs/types";

function Heading({
  id,
  level,
  text,
}: {
  id: string;
  level: 2 | 3;
  text: string;
}) {
  const className =
    level === 2
      ? "mt-10 mb-3 scroll-mt-28 font-heading text-[1.45rem] font-semibold tracking-[-0.025em] text-foreground"
      : "mt-7 mb-2 scroll-mt-28 font-heading text-[1.1rem] font-semibold tracking-[-0.015em] text-foreground";

  if (level === 2) {
    return (
      <h2 id={id} className={`group ${className}`}>
        <a href={`#${id}`} className="hover:underline hover:underline-offset-4">
          {text}
        </a>
      </h2>
    );
  }

  return (
    <h3 id={id} className={`group ${className}`}>
      <a href={`#${id}`} className="hover:underline hover:underline-offset-4">
        {text}
      </a>
    </h3>
  );
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "h2":
      return <Heading id={block.id} level={2} text={block.text} />;
    case "h3":
      return <Heading id={block.id} level={3} text={block.text} />;
    case "p":
      return (
        <p className="my-4 text-[0.95rem] leading-7 text-muted-foreground">
          <RichText text={block.text} />
        </p>
      );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          className={`my-4 space-y-2 pl-5 text-[0.93rem] leading-6 text-muted-foreground ${
            block.ordered ? "list-decimal" : "list-disc"
          } marker:text-muted-foreground/60`}
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              <RichText text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "code":
      return <CodeBlock code={block.code} lang={block.lang} title={block.title} />;
    case "callout":
      return (
        <Callout tone={block.tone} title={block.title} text={block.text} />
      );
    case "table":
      return (
        <div className="dashboard-scroll my-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-left text-[0.85rem]">
            <thead className="bg-muted/45">
              <tr>
                {block.headers.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="border-b border-border px-3.5 py-2.5 font-semibold text-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border/70 last:border-0">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-3.5 py-2.5 align-top leading-6 text-muted-foreground"
                    >
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "steps":
      return (
        <ol className="my-6 space-y-4">
          {block.items.map((item, index) => (
            <li key={item.title} className="flex gap-3.5">
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center rounded-full border border-border bg-muted/40 font-mono text-[0.7rem] font-medium text-foreground"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[0.93rem] font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-1 text-[0.9rem] leading-6 text-muted-foreground">
                  <RichText text={item.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "message":
      return (
        <div className="my-6 rounded-xl border border-dashed border-border bg-muted/20 px-5 py-8 text-center">
          <p className="font-heading text-lg font-semibold text-foreground">
            {block.title}
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            <RichText text={block.text} />
          </p>
        </div>
      );
    default:
      return null;
  }
}

export function DocContent({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div>
      {blocks.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}
