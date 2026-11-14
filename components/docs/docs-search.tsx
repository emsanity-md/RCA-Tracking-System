"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import type { DocSearchItem } from "@/lib/docs/types";

export function DocsSearch({
  items,
  idPrefix,
  className,
}: {
  items: DocSearchItem[];
  idPrefix: string;
  className?: string;
}) {
  const router = useRouter();
  const generatedId = useId().replace(/:/g, "");
  const prefix = idPrefix || generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];

    return items
      .filter((item) =>
        [
          item.title,
          item.sectionTitle,
          item.description,
          ...item.keywords,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
      .slice(0, 7);
  }, [items, query]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function choose(index: number) {
    const result = results[index];
    if (!result) return;
    setOpen(false);
    setQuery("");
    router.push(result.href);
  }

  const listboxId = `${prefix}-listbox`;
  const showResults = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <label htmlFor={`${prefix}-input`} className="sr-only">
        Search documentation
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        ref={inputRef}
        id={`${prefix}-input`}
        type="search"
        role="combobox"
        aria-expanded={showResults && results.length > 0}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          showResults && results[activeIndex]
            ? `${prefix}-option-${activeIndex}`
            : undefined
        }
        autoComplete="off"
        spellCheck={false}
        value={query}
        placeholder="Search docs..."
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim()) setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!results.length) return;
            setOpen(true);
            setActiveIndex((index) => (index + 1) % results.length);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!results.length) return;
            setOpen(true);
            setActiveIndex(
              (index) => (index - 1 + results.length) % results.length,
            );
          } else if (event.key === "Enter") {
            if (showResults && results[activeIndex]) {
              event.preventDefault();
              choose(activeIndex);
            }
          } else if (event.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
          }
        }}
        className="h-9 w-full rounded-lg border border-border bg-muted/30 pr-3 pl-9 text-[0.82rem] text-foreground placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
      />

      {showResults ? (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lift">
          {results.length > 0 ? (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Documentation results"
              className="dashboard-scroll max-h-80 overflow-y-auto py-1"
              onMouseDown={(event) => event.preventDefault()}
            >
              {results.map((result, index) => (
                <li
                  key={result.href}
                  id={`${prefix}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(index)}
                  className={`cursor-pointer px-3 py-2.5 transition-colors ${
                    index === activeIndex ? "bg-muted" : "hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[0.82rem] font-medium text-foreground">
                      {result.title}
                    </span>
                    <span className="shrink-0 font-mono text-[0.62rem] tracking-[0.06em] text-muted-foreground uppercase">
                      {result.sectionTitle}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[0.74rem] text-muted-foreground">
                    {result.description}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p
              role="status"
              className="px-3 py-6 text-center text-[0.8rem] text-muted-foreground"
            >
              No matching pages. Try “install”, “status”, or “deployment”.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
