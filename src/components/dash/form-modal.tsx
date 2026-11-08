"use client";

import { useId, useState, type FormEvent } from "react";
import { ApiError } from "@/lib/vowly/client";
import { cn } from "@/lib/utils";
import { Modal } from "./modal";
import { btn } from "./primitives";

type Option = { value: string; label: string };

type Base = { name: string; label: string; required?: boolean; hint?: string; span?: 1 | 2 };
export type FieldDef =
  | (Base & { kind: "text" | "email" | "tel" | "url" | "date" | "time"; placeholder?: string; maxLength?: number })
  | (Base & { kind: "textarea"; placeholder?: string; maxLength?: number; rows?: number })
  | (Base & { kind: "number"; min?: number; max?: number; placeholder?: string })
  | (Base & { kind: "money"; placeholder?: string })
  | (Base & { kind: "select"; options: Option[]; emptyLabel?: string })
  | (Base & { kind: "multi"; options: Option[] })
  | (Base & { kind: "checkbox" });

/** Text for inputs, string[] for multi-selects, boolean for checkboxes. */
export type FormValues = Record<string, string | string[] | boolean>;

const inputClass =
  "h-10 w-full rounded-lg border border-gold/70 bg-white px-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-muted";

function FieldInput({ field, value, error, onChange }: { field: FieldDef; value: FormValues[string] | undefined; error?: string; onChange: (value: FormValues[string]) => void }) {
  const id = useId();
  const describedBy = error ? `${id}-error` : field.hint ? `${id}-hint` : undefined;
  const common = { id, name: field.name, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy } as const;

  let control: React.ReactNode;
  switch (field.kind) {
    case "textarea":
      control = (
        <textarea
          {...common}
          rows={field.rows ?? 3}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          className={cn(inputClass, "h-auto py-2 leading-6")}
        />
      );
      break;
    case "select":
      control = (
        <select {...common} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={inputClass}>
          {field.emptyLabel !== undefined ? <option value="">{field.emptyLabel}</option> : null}
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;
    case "multi":
      control = (
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby={`${id}-label`}>
          {field.options.length === 0 ? <p className="text-xs text-ink-soft">Belum ada pilihan.</p> : null}
          {field.options.map((option) => {
            const selected = Array.isArray(value) && value.includes(option.value);
            return (
              <label
                key={option.value}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-gold/70 bg-white text-ink hover:bg-cream",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selected}
                  onChange={() => {
                    const current = Array.isArray(value) ? value : [];
                    onChange(selected ? current.filter((item) => item !== option.value) : [...current, option.value]);
                  }}
                />
                {option.label}
              </label>
            );
          })}
        </div>
      );
      break;
    case "checkbox":
      control = (
        <label className="inline-flex items-center gap-2 text-sm text-ink">
          <input
            {...common}
            type="checkbox"
            checked={value === true}
            onChange={(event) => onChange(event.target.checked)}
            className="size-4 rounded border-gold accent-primary"
          />
          {field.label}
        </label>
      );
      break;
    case "money":
      control = (
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-ink-soft">Rp</span>
          <input
            {...common}
            type="text"
            inputMode="numeric"
            placeholder={field.placeholder ?? "0"}
            value={String(value ?? "")}
            onChange={(event) => onChange(event.target.value)}
            className={cn(inputClass, "pl-9")}
          />
        </div>
      );
      break;
    case "number":
      control = (
        <input
          {...common}
          type="number"
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      );
      break;
    default:
      control = (
        <input
          {...common}
          type={field.kind}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      );
  }

  return (
    <div className={cn(field.span === 2 && "sm:col-span-2")}>
      {field.kind === "checkbox" ? null : (
        <label id={`${id}-label`} htmlFor={id} className="mb-1.5 block text-xs font-semibold text-ink">
          {field.label}
          {field.required ? <span className="text-red-600"> *</span> : null}
        </label>
      )}
      {control}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      ) : field.hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-ink-soft">
          {field.hint}
        </p>
      ) : null}
    </div>
  );
}

/** Which required text fields are empty. Exported for tests. */
export function missingRequired(fields: FieldDef[], values: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (!field.required) continue;
    const value = values[field.name];
    const empty = Array.isArray(value) ? value.length === 0 : typeof value === "boolean" ? !value : String(value ?? "").trim() === "";
    if (empty) errors[field.name] = `${field.label} wajib diisi`;
  }
  return errors;
}

function FormBody({
  fields,
  initial,
  submitLabel,
  onClose,
  onSubmit,
}: {
  fields: FieldDef[];
  initial: FormValues;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<FormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    const local = missingRequired(fields, values);
    setErrors(local);
    setFormError(undefined);
    if (Object.keys(local).length > 0) return;

    setPending(true);
    try {
      await onSubmit(values);
    } catch (cause) {
      if (cause instanceof ApiError) {
        setErrors(cause.fields);
        setFormError(Object.keys(cause.fields).length > 0 ? "Periksa kembali isian yang bertanda merah." : cause.message);
      } else {
        setFormError("Terjadi kesalahan. Coba lagi.");
      }
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            onChange={(next) => setValues((current) => ({ ...current, [field.name]: next }))}
          />
        ))}
      </div>
      {formError ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      ) : null}
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" className={btn.secondary} onClick={onClose} disabled={pending}>
          Batal
        </button>
        <button type="submit" className={btn.primary} disabled={pending}>
          {pending ? "Menyimpan…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

/**
 * Create/edit dialog described by a field list. `onSubmit` should throw an ApiError (as `api` does) so server-side
 * validation messages land under the matching field; resolve to close the dialog.
 */
export function FormModal({
  open,
  title,
  description,
  fields,
  initial,
  submitLabel = "Simpan",
  onClose,
  onSubmit,
  wide,
}: {
  open: boolean;
  title: string;
  description?: string;
  fields: FieldDef[];
  initial: FormValues;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  wide?: boolean;
}) {
  return (
    <Modal open={open} title={title} description={description} onClose={onClose} wide={wide}>
      {open ? <FormBody fields={fields} initial={initial} submitLabel={submitLabel} onClose={onClose} onSubmit={onSubmit} /> : null}
    </Modal>
  );
}
