import {
  Info,
  Lightbulb,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { RichText } from "@/components/docs/rich-text";
import type { CalloutTone } from "@/lib/docs/types";

const TONES: Record<
  CalloutTone,
  { icon: LucideIcon; label: string; className: string; iconClassName: string }
> = {
  note: {
    icon: Info,
    label: "Note",
    className: "border-border bg-muted/35",
    iconClassName: "text-muted-foreground",
  },
  tip: {
    icon: Lightbulb,
    label: "Tip",
    className: "border-border bg-muted/25",
    iconClassName: "text-foreground",
  },
  warning: {
    icon: TriangleAlert,
    label: "Warning",
    className: "border-destructive/35 bg-destructive/[0.06]",
    iconClassName: "text-destructive",
  },
};

export function Callout({
  tone,
  title,
  text,
}: {
  tone: CalloutTone;
  title?: string;
  text: string;
}) {
  const config = TONES[tone];
  const Icon = config.icon;

  return (
    <aside
      aria-label={title ?? config.label}
      className={`my-6 flex gap-3 rounded-xl border px-4 py-3.5 ${config.className}`}
    >
      <Icon
        aria-hidden="true"
        className={`mt-0.5 size-4 shrink-0 ${config.iconClassName}`}
      />
      <div className="min-w-0">
        <p className="text-[0.82rem] font-semibold tracking-[-0.01em] text-foreground">
          {title ?? config.label}
        </p>
        <p className="mt-1 text-[0.9rem] leading-relaxed text-muted-foreground">
          <RichText text={text} />
        </p>
      </div>
    </aside>
  );
}
