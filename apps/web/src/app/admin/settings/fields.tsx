"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useId } from "react";
import {
  Controller,
  get,
  useFieldArray,
  useFormContext,
  type ArrayPath,
  type FieldArray,
  type Path,
} from "react-hook-form";

import type { SiteSettingsInput } from "@/lib/settings/schema";

type Name = Path<SiteSettingsInput>;

function useFieldError(name: string) {
  const {
    formState: { errors },
  } = useFormContext<SiteSettingsInput>();
  const error = get(errors, name) as { message?: string } | undefined;
  return error?.message;
}

type FieldProps = {
  name: Name;
  label: string;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: "text" | "email" | "tel" | "url";
  wide?: boolean;
};

export function Field({ name, label, hint, placeholder, multiline, rows = 3, type = "text", wide }: FieldProps) {
  const { register } = useFormContext<SiteSettingsInput>();
  const id = useId();
  const error = useFieldError(name);
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  const common = {
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(error),
    id,
    placeholder,
    ...register(name),
  };

  return (
    <div className={`admin-field ${wide || multiline ? "is-wide" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {multiline ? <textarea rows={rows} {...common} /> : <input type={type} {...common} />}
      {hint ? (
        <small className="admin-hint" id={`${id}-hint`}>
          {hint}
        </small>
      ) : null}
      {error ? (
        <span className="admin-error" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

/** A string[] edited as one item per line. */
export function LinesField({ name, label, hint, rows = 3 }: Omit<FieldProps, "multiline" | "type">) {
  const { control } = useFormContext<SiteSettingsInput>();
  const id = useId();
  const error = useFieldError(name);
  // Errors on individual lines (e.g. one bad phone number) surface here too.
  const itemErrors = useLineErrors(name);
  const message = error ?? itemErrors;

  return (
    <div className="admin-field is-wide">
      <label htmlFor={id}>{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <textarea
            aria-describedby={`${id}-hint${message ? ` ${id}-error` : ""}`}
            aria-invalid={Boolean(message)}
            id={id}
            name={field.name}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.value.split("\n"))}
            ref={field.ref}
            rows={rows}
            value={Array.isArray(field.value) ? (field.value as string[]).join("\n") : ""}
          />
        )}
      />
      <small className="admin-hint" id={`${id}-hint`}>
        {hint ? `${hint} ` : ""}One per line.
      </small>
      {message ? (
        <span className="admin-error" id={`${id}-error`}>
          {message}
        </span>
      ) : null}
    </div>
  );
}

function useLineErrors(name: string) {
  const {
    formState: { errors },
  } = useFormContext<SiteSettingsInput>();
  const value = get(errors, name) as Record<string, { message?: string }> | undefined;
  if (!value || typeof value !== "object") return undefined;
  const lines = Object.entries(value)
    .filter(([key, item]) => /^\d+$/.test(key) && item?.message)
    .map(([key, item]) => `Line ${Number(key) + 1}: ${item.message}`);
  return lines.length ? lines.join(" ") : undefined;
}

export function CheckboxField({ name, label, hint }: { name: Name; label: string; hint?: string }) {
  const { register } = useFormContext<SiteSettingsInput>();
  const id = useId();
  const error = useFieldError(name);
  return (
    <div className="admin-check is-wide">
      <input id={id} type="checkbox" {...register(name)} aria-describedby={error ? `${id}-error` : undefined} />
      <label htmlFor={id}>
        {label}
        {hint ? <small className="admin-hint">{hint}</small> : null}
      </label>
      {error ? (
        <span className="admin-error" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function SelectField({
  name,
  label,
  options,
  hint,
}: {
  name: Name;
  label: string;
  options: readonly { value: string; label: string }[];
  hint?: string;
}) {
  const { register } = useFormContext<SiteSettingsInput>();
  const id = useId();
  const error = useFieldError(name);
  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} {...register(name)} aria-invalid={Boolean(error)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <small className="admin-hint">{hint}</small> : null}
      {error ? <span className="admin-error">{error}</span> : null}
    </div>
  );
}

type ListName = ArrayPath<SiteSettingsInput>;

/** Repeating group (FAQs, packages, trainers…) with add, remove, and reorder. */
export function ListEditor<N extends ListName>({
  name,
  itemLabel,
  addLabel,
  emptyItem,
  emptyText,
  max,
  titleOf,
  children,
}: {
  name: N;
  itemLabel: string;
  addLabel: string;
  emptyItem: FieldArray<SiteSettingsInput, N>;
  emptyText: string;
  max: number;
  titleOf?: (index: number) => string;
  children: (index: number) => React.ReactNode;
}) {
  const { control } = useFormContext<SiteSettingsInput>();
  const { append, fields, move, remove } = useFieldArray({ control, name });
  const rootError = useFieldError(`${name}.root`);
  const arrayError = useFieldError(name);
  const listError = rootError ?? arrayError;

  return (
    <div className="admin-list">
      {fields.length === 0 ? <p className="admin-empty">{emptyText}</p> : null}
      {fields.map((field, index) => (
        <fieldset className="admin-list-item" key={field.id}>
          <legend>{titleOf?.(index) || `${itemLabel} ${index + 1}`}</legend>
          <div className="admin-list-tools">
            <button
              aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`}
              disabled={index === 0}
              onClick={() => move(index, index - 1)}
              type="button"
            >
              <ArrowUp aria-hidden="true" />
            </button>
            <button
              aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`}
              disabled={index === fields.length - 1}
              onClick={() => move(index, index + 1)}
              type="button"
            >
              <ArrowDown aria-hidden="true" />
            </button>
            <button
              aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
              className="is-danger"
              onClick={() => remove(index)}
              type="button"
            >
              <Trash2 aria-hidden="true" />
            </button>
          </div>
          <div className="admin-grid">{children(index)}</div>
        </fieldset>
      ))}
      {listError ? <span className="admin-error">{listError}</span> : null}
      <button
        className="button button-secondary admin-add"
        disabled={fields.length >= max}
        onClick={() => append(emptyItem)}
        type="button"
      >
        <Plus aria-hidden="true" />
        {addLabel}
      </button>
    </div>
  );
}
