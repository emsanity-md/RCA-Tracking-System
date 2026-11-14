"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

const KEYWORDS: Record<string, Set<string>> = {
  ts: new Set([
    "import",
    "from",
    "export",
    "const",
    "let",
    "var",
    "function",
    "return",
    "if",
    "else",
    "for",
    "of",
    "in",
    "as",
    "type",
    "interface",
    "extends",
    "new",
    "await",
    "async",
    "true",
    "false",
    "null",
    "undefined",
  ]),
  bash: new Set([
    "npm",
    "npx",
    "node",
    "git",
    "cd",
    "run",
    "install",
    "build",
    "start",
  ]),
  json: new Set(["true", "false", "null"]),
  yaml: new Set(["true", "false", "null", "on"]),
  css: new Set(["root", "var", "color", "background"]),
  http: new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]),
};

const STRING_PATTERN = String.raw`"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\`(?:\\.|[^\`\\])*\``;
const IDENTIFIER_PATTERN = String.raw`\b[A-Za-z_$][\w$-]*\b`;

function commentPattern(lang: string): string | null {
  if (lang === "ts" || lang === "js") return String.raw`\/\/[^\n]*`;
  if (lang === "bash" || lang === "yaml" || lang === "env") {
    return String.raw`#[^\n]*`;
  }
  if (lang === "css") return String.raw`\/\*[\s\S]*?\*\/`;
  return null;
}

function highlightLine(line: string, lang: string): ReactNode[] {
  if (!line) return [];

  const keywords = KEYWORDS[lang] ?? new Set<string>();
  const comment = commentPattern(lang);
  const tokenPattern = [
    comment,
    STRING_PATTERN,
    String.raw`\b\d+(?:\.\d+)?\b`,
    IDENTIFIER_PATTERN,
  ]
    .filter(Boolean)
    .join("|");
  const regex = new RegExp(`(${tokenPattern})`, "g");

  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > cursor) {
      nodes.push(line.slice(cursor, match.index));
    }

    const token = match[0];
    const tokenEnd = match.index + token.length;
    const rest = line.slice(tokenEnd);
    let className = "";

    if (comment && token.match(new RegExp(`^(?:${comment})$`))) {
      className = "text-muted-foreground/70 italic";
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
      className = "text-foreground/80";
    } else if (/^\d/.test(token)) {
      className = "text-foreground/65";
    } else if (keywords.has(token)) {
      className = "font-medium text-foreground";
    } else if (line[tokenEnd] === "(") {
      className = "text-foreground/90";
    } else if ((lang === "json" || lang === "yaml") && /^\s*:/.test(rest)) {
      className = "text-foreground/90";
    }

    nodes.push(
      className ? (
        <span key={`${match.index}-${token}`} className={className}>
          {token}
        </span>
      ) : (
        token
      ),
    );
    cursor = tokenEnd;
  }

  if (cursor < line.length) nodes.push(line.slice(cursor));
  return nodes;
}

export function CodeBlock({
  code,
  lang,
  title,
}: {
  code: string;
  lang: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  const lines = code.split("\n");

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  async function copyCode() {
    let success = false;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        success = true;
      }
    } catch {
      success = false;
    }

    if (!success) {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      success = document.execCommand("copy");
      textarea.remove();
    }

    if (success) {
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-muted/35 px-3.5 py-2">
        <span className="truncate font-mono text-[0.68rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          {title ?? lang}
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 text-[0.7rem] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          aria-label={`Copy ${title ?? `${lang} code`}`}
        >
          {copied ? (
            <Check aria-hidden="true" className="size-3.5" />
          ) : (
            <Copy aria-hidden="true" className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className="dashboard-scroll overflow-x-auto p-4 font-mono text-[0.79rem] leading-6 text-foreground/90">
        <code>
          {lines.map((line, index) => (
            <span key={index}>
              {highlightLine(line, lang)}
              {index < lines.length - 1 ? "\n" : null}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
