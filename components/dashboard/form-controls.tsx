"use client";

import type { ComponentProps, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export const controlClass =
  "w-full rounded-lg border border-input bg-background/60 px-3 text-sm text-foreground shadow-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export function Field({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-[0.78rem] font-medium text-foreground"
      >
        {label}
        {required ? (
          <span className="text-muted-foreground" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  className,
  invalid,
  ...props
}: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        controlClass,
        "h-10",
        invalid && "border-destructive focus-visible:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function TextArea({
  className,
  invalid,
  ...props
}: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        controlClass,
        "min-h-24 resize-y py-2.5 leading-relaxed",
        invalid && "border-destructive focus-visible:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

/** A textarea that grows with its content, up to a readable maximum. */
export function AutoGrowTextArea({
  className,
  invalid,
  value,
  ...props
}: ComponentProps<"textarea"> & { invalid?: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 200)}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={2}
      value={value}
      aria-invalid={invalid || undefined}
      className={cn(
        controlClass,
        "min-h-[4.5rem] resize-y overflow-y-auto py-2.5 leading-relaxed",
        invalid && "border-destructive focus-visible:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function SelectControl({
  className,
  invalid,
  children,
  ...props
}: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          controlClass,
          "h-10 cursor-pointer appearance-none pr-9",
          invalid && "border-destructive focus-visible:border-destructive",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}
