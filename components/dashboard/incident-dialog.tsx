"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

import {
  CAUSE_TYPES,
  INCIDENT_STATUSES,
  nowLocalDateTime,
  suggestNextIncidentId,
  subTypesFor,
  todayISODate,
  type CauseType,
  type Incident,
  type IncidentStatus,
} from "@/lib/incidents";
import {
  AutoGrowTextArea,
  Field,
  SelectControl,
  TextArea,
  TextInput,
} from "@/components/dashboard/form-controls";
import { cn } from "@/lib/utils";

type Draft = {
  incidentId: string;
  description: string;
  system: string;
  causeType: CauseType | "";
  subType: string;
  evidence: string;
  rootCause: string;
  status: IncidentStatus;
  preventable: "" | "Yes" | "No";
  preventiveAction: string;
  correctedBy: string;
  dateRecorded: string;
};

type DraftErrors = Partial<Record<keyof Draft, string>>;

const FIELD_ORDER: (keyof Draft)[] = [
  "incidentId",
  "description",
  "system",
  "causeType",
  "subType",
  "evidence",
  "rootCause",
  "preventable",
  "preventiveAction",
  "correctedBy",
  "dateRecorded",
];

const FIELD_IDS: Record<keyof Draft, string> = {
  incidentId: "incident-id",
  description: "incident-description",
  system: "incident-system",
  causeType: "incident-cause",
  subType: "incident-subtype",
  evidence: "incident-evidence",
  rootCause: "incident-root-cause",
  status: "incident-status-pending",
  preventable: "preventable-yes",
  preventiveAction: "incident-action",
  correctedBy: "incident-corrected-by",
  dateRecorded: "incident-recorded",
};

function createDraft(incidents: readonly Incident[]): Draft {
  return {
    incidentId: suggestNextIncidentId(incidents),
    description: "",
    system: "",
    causeType: "",
    subType: "",
    evidence: "",
    rootCause: "",
    status: "Pending",
    preventable: "",
    preventiveAction: "",
    correctedBy: "",
    dateRecorded: "",
  };
}

function Section({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-background/45 p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid size-6 shrink-0 place-items-center rounded-md border border-border bg-card font-mono text-[0.68rem] font-semibold text-muted-foreground">
          {step}
        </span>
        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">
            {title}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function IncidentDialog({
  incidents,
  onCancel,
  onSave,
}: {
  incidents: readonly Incident[];
  onCancel: () => void;
  onSave: (incident: Incident) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<Draft>(() => ({
    ...createDraft(incidents),
    dateRecorded: todayISODate(),
  }));
  const [errors, setErrors] = useState<DraftErrors>({});

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();
    const frame = window.requestAnimationFrame(() =>
      idInputRef.current?.focus(),
    );

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: DraftErrors = {};

    if (!draft.incidentId.trim()) {
      nextErrors.incidentId = "Incident ID is required.";
    } else if (
      incidents.some(
        (incident) =>
          incident.incidentId.toLowerCase() ===
          draft.incidentId.trim().toLowerCase(),
      )
    ) {
      nextErrors.incidentId = "That incident ID already exists.";
    }

    if (!draft.description.trim()) {
      nextErrors.description = "Describe what happened.";
    }
    if (!draft.system.trim()) {
      nextErrors.system = "Enter the affected system.";
    }
    if (!draft.causeType) {
      nextErrors.causeType = "Select a cause type.";
    }
    if (!draft.subType) {
      nextErrors.subType = "Select a sub-type.";
    }
    if (!draft.evidence.trim()) {
      nextErrors.evidence = "Add the supporting evidence.";
    }
    if (!draft.rootCause.trim()) {
      nextErrors.rootCause = "State the root cause.";
    }
    if (!draft.preventable) {
      nextErrors.preventable = "Choose whether the system could prevent it.";
    }
    if (draft.preventable === "Yes" && !draft.preventiveAction.trim()) {
      nextErrors.preventiveAction = "Add the preventive action.";
    }
    if (!draft.correctedBy.trim()) {
      nextErrors.correctedBy = "Enter who corrected the incident.";
    }
    if (!draft.dateRecorded) {
      nextErrors.dateRecorded = "Choose the date recorded.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key]);
      if (firstInvalid) {
        window.requestAnimationFrame(() =>
          document.getElementById(FIELD_IDS[firstInvalid])?.focus(),
        );
      }
      return;
    }

    onSave({
      incidentId: draft.incidentId.trim().toUpperCase(),
      description: draft.description.trim(),
      system: draft.system.trim(),
      dateTime: nowLocalDateTime(),
      causeType: draft.causeType as CauseType,
      subType: draft.subType,
      evidence: draft.evidence.trim(),
      rootCause: draft.rootCause.trim(),
      status: draft.status,
      preventable: draft.preventable === "Yes",
      preventiveAction: draft.preventiveAction.trim(),
      correctedBy: draft.correctedBy.trim(),
      dateRecorded: draft.dateRecorded,
    });
  }

  const subTypes = subTypesFor(draft.causeType);
  const errorCount = Object.keys(errors).length;
  const describedBy = (key: keyof Draft) =>
    errors[key] ? `${FIELD_IDS[key]}-error` : undefined;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="incident-dialog-title"
      aria-describedby="incident-dialog-description"
      onClose={() => {
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onCancel();
      }}
      className="animate-dialog-in m-auto max-h-[92dvh] w-[calc(100vw-1.5rem)] max-w-3xl overflow-hidden rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl outline-none"
    >
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex max-h-[92dvh] flex-col"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2
              id="incident-dialog-title"
              className="font-heading text-lg font-semibold tracking-[-0.02em] text-foreground"
            >
              Add incident
            </h2>
            <p
              id="incident-dialog-description"
              className="mt-1 text-xs leading-relaxed text-muted-foreground"
            >
              Capture what happened, why it happened, and how it was closed out.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </header>

        <div className="dashboard-scroll min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {errorCount > 0 ? (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-destructive"
            >
              Please fix {errorCount}{" "}
              {errorCount === 1 ? "field" : "fields"} below before saving.
            </div>
          ) : null}

          <div className="space-y-4">
            <Section
              step="01"
              title="What happened"
              description="Identify the incident and the system it touched."
            >
              <Field
                id="incident-id"
                label="Incident ID"
                required
                error={errors.incidentId}
                hint="Suggested next ID. IDs must be unique."
              >
                <TextInput
                  ref={idInputRef}
                  id="incident-id"
                  value={draft.incidentId}
                  onChange={(event) =>
                    update("incidentId", event.target.value)
                  }
                  placeholder="INC-001"
                  invalid={Boolean(errors.incidentId)}
                  aria-describedby={describedBy("incidentId")}
                  className="font-mono"
                />
              </Field>

              <Field id="incident-system" label="System" required error={errors.system}>
                <TextInput
                  id="incident-system"
                  value={draft.system}
                  onChange={(event) => update("system", event.target.value)}
                  placeholder="Billing module"
                  invalid={Boolean(errors.system)}
                  aria-describedby={describedBy("system")}
                />
              </Field>

              <Field
                id="incident-description"
                label="Description"
                required
                error={errors.description}
                className="sm:col-span-2"
              >
                <AutoGrowTextArea
                  id="incident-description"
                  value={draft.description}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                  placeholder="Wrong data deleted"
                  invalid={Boolean(errors.description)}
                  aria-describedby={describedBy("description")}
                />
              </Field>
            </Section>

            <Section
              step="02"
              title="Why it happened"
              description="Classify the cause and record what the evidence shows."
            >
              <Field
                id="incident-cause"
                label="Cause type"
                required
                error={errors.causeType}
              >
                <SelectControl
                  id="incident-cause"
                  value={draft.causeType}
                  onChange={(event) => {
                    const cause = event.target.value as CauseType | "";
                    setDraft((previous) => ({
                      ...previous,
                      causeType: cause,
                      subType: "",
                    }));
                    setErrors((previous) => {
                      const next = { ...previous };
                      delete next.causeType;
                      delete next.subType;
                      return next;
                    });
                  }}
                  invalid={Boolean(errors.causeType)}
                  aria-describedby={describedBy("causeType")}
                >
                  <option value="">Select a cause type</option>
                  {CAUSE_TYPES.map((cause) => (
                    <option key={cause.name} value={cause.name}>
                      {cause.name}
                    </option>
                  ))}
                </SelectControl>
              </Field>

              <Field
                id="incident-subtype"
                label="Sub-type"
                required
                error={errors.subType}
                hint={
                  draft.causeType
                    ? "Options depend on the cause type."
                    : "Select a cause type first."
                }
              >
                <SelectControl
                  id="incident-subtype"
                  value={draft.subType}
                  onChange={(event) => update("subType", event.target.value)}
                  disabled={!draft.causeType}
                  invalid={Boolean(errors.subType)}
                  aria-describedby={describedBy("subType")}
                >
                  <option value="">Select a sub-type</option>
                  {subTypes.map((subType) => (
                    <option key={subType} value={subType}>
                      {subType}
                    </option>
                  ))}
                </SelectControl>
              </Field>

              <Field
                id="incident-evidence"
                label="Evidence"
                required
                error={errors.evidence}
                className="sm:col-span-2"
              >
                <TextArea
                  id="incident-evidence"
                  value={draft.evidence}
                  onChange={(event) => update("evidence", event.target.value)}
                  placeholder="Audit log shows user deleted record"
                  invalid={Boolean(errors.evidence)}
                  aria-describedby={describedBy("evidence")}
                />
              </Field>

              <Field
                id="incident-root-cause"
                label="Root cause"
                required
                error={errors.rootCause}
                className="sm:col-span-2"
              >
                <TextArea
                  id="incident-root-cause"
                  value={draft.rootCause}
                  onChange={(event) => update("rootCause", event.target.value)}
                  placeholder="No confirmation prompt"
                  invalid={Boolean(errors.rootCause)}
                  aria-describedby={describedBy("rootCause")}
                />
              </Field>
            </Section>

            <Section
              step="03"
              title="Prevention and correction"
              description="Decide whether it was preventable, then close the loop."
            >
              <div className="space-y-1.5 sm:col-span-2">
                <span
                  id="status-label"
                  className="flex items-center gap-1 text-[0.78rem] font-medium text-foreground"
                >
                  Status
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="status-label"
                  className="grid max-w-sm grid-cols-2 gap-2"
                >
                  {INCIDENT_STATUSES.map((value) => (
                    <label
                      key={value}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                        draft.status === value
                          ? "border-foreground/35 bg-foreground/[0.055] text-foreground"
                          : "border-input text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      <input
                        id={
                          value === "Pending"
                            ? "incident-status-pending"
                            : "incident-status-resolved"
                        }
                        type="radio"
                        name="status"
                        value={value}
                        checked={draft.status === value}
                        onChange={() => update("status", value)}
                        className="size-4 accent-foreground"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-1.5 rounded-full",
                          value === "Resolved" ? "bg-emerald-500" : "bg-amber-500",
                        )}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <span
                  id="preventable-label"
                  className="flex items-center gap-1 text-[0.78rem] font-medium text-foreground"
                >
                  System could prevent?
                  <span className="text-muted-foreground" aria-hidden="true">
                    *
                  </span>
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="preventable-label"
                  aria-describedby={
                    errors.preventable ? "preventable-error" : undefined
                  }
                  className="grid max-w-sm grid-cols-2 gap-2"
                >
                  {(["Yes", "No"] as const).map((value) => (
                    <label
                      key={value}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                        draft.preventable === value
                          ? "border-foreground/35 bg-foreground/[0.055] text-foreground"
                          : "border-input text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      <input
                        id={value === "Yes" ? "preventable-yes" : "preventable-no"}
                        type="radio"
                        name="preventable"
                        value={value}
                        checked={draft.preventable === value}
                        onChange={() => update("preventable", value)}
                        className="size-4 accent-foreground"
                      />
                      {value}
                    </label>
                  ))}
                </div>
                {errors.preventable ? (
                  <p
                    id="preventable-error"
                    role="alert"
                    className="text-xs text-destructive"
                  >
                    {errors.preventable}
                  </p>
                ) : null}
              </div>

              <Field
                id="incident-action"
                label="Preventive action"
                required={draft.preventable === "Yes"}
                error={errors.preventiveAction}
                hint={
                  draft.preventable === "No"
                    ? "Optional when the system could not prevent it."
                    : "Required when the system could have prevented it."
                }
                className="sm:col-span-2"
              >
                <TextArea
                  id="incident-action"
                  value={draft.preventiveAction}
                  onChange={(event) =>
                    update("preventiveAction", event.target.value)
                  }
                  placeholder="Add delete confirmation"
                  invalid={Boolean(errors.preventiveAction)}
                  aria-describedby={describedBy("preventiveAction")}
                />
              </Field>

              <Field
                id="incident-corrected-by"
                label="Corrected by"
                required
                error={errors.correctedBy}
              >
                <TextInput
                  id="incident-corrected-by"
                  value={draft.correctedBy}
                  onChange={(event) =>
                    update("correctedBy", event.target.value)
                  }
                  placeholder="Dev team"
                  invalid={Boolean(errors.correctedBy)}
                  aria-describedby={describedBy("correctedBy")}
                />
              </Field>

              <Field
                id="incident-recorded"
                label="Date recorded"
                required
                error={errors.dateRecorded}
              >
                <TextInput
                  id="incident-recorded"
                  type="date"
                  value={draft.dateRecorded}
                  onChange={(event) =>
                    update("dateRecorded", event.target.value)
                  }
                  invalid={Boolean(errors.dateRecorded)}
                  aria-describedby={describedBy("dateRecorded")}
                />
              </Field>
            </Section>
          </div>
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-border bg-card px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.7rem] text-muted-foreground">
            Kept in memory for this session only.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
            >
              <Check aria-hidden="true" className="size-4" />
              Save incident
            </button>
          </div>
        </footer>
      </form>
    </dialog>
  );
}
