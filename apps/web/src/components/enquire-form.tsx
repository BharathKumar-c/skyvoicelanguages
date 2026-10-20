"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useI18n } from "@/i18n/client";
import { useLocalizedSchema, useRevalidateOnLocaleChange } from "@/i18n/forms";
import { enquireSchemaFor, examOptions, formatOptions, type Enquiry, type EnquiryInput } from "@/lib/enquire/schema";
import { postForm } from "@/lib/forms/post-form";

type FormState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

/** Enquire Now: a short IELTS/PTE enquiry. Required: name, WhatsApp, city, exam. */
export function EnquireForm({ idPrefix = "enquire" }: { idPrefix?: string }) {
  const { m } = useI18n();
  const t = m.enquireForm;
  const schema = useLocalizedSchema(enquireSchemaFor);
  const [formState, setFormState] = useState<FormState>({ type: "idle" });
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    trigger,
  } = useForm<EnquiryInput, unknown, Enquiry>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", exam: "not-sure", format: "not-sure", message: "", target: "", website: "" },
  });
  useRevalidateOnLocaleChange(trigger, Object.keys(errors));

  const onSubmit = handleSubmit(async (values) => {
    setFormState({ type: "idle" });
    const params = new URLSearchParams(window.location.search);

    try {
      const result = await postForm(
        "/api/enquire",
        {
          ...values,
          sourcePage: window.location.pathname,
          utmSource: params.get("utm_source") ?? undefined,
          utmMedium: params.get("utm_medium") ?? undefined,
          utmCampaign: params.get("utm_campaign") ?? undefined,
        },
        t.errorFallback,
        m.common.networkError,
      );
      // Clearing the form after a confirmed send prevents accidental repeats.
      reset();
      setFormState({
        type: "success",
        message: result.mode === "preview" ? (result.message ?? m.common.previewValidated) : t.success,
      });
    } catch (error) {
      setFormState({ type: "error", message: error instanceof Error ? error.message : t.errorFallback });
    }
  });

  const id = (field: string) => `${idPrefix}-${field}`;
  const describedBy = (field: keyof EnquiryInput) => (errors[field] ? `${id(field)}-error` : undefined);
  const error = (field: keyof EnquiryInput) =>
    errors[field] ? (
      <span className="field-error" id={`${id(field)}-error`}>
        {errors[field]?.message}
      </span>
    ) : null;

  return (
    <form className="lead-form enquire-form" id={`${idPrefix}-form`} noValidate onSubmit={onSubmit}>
      <div className="form-heading">
        <span className="form-badge">{t.badge}</span>
        <h2>{t.heading}</h2>
        <p>{t.intro}</p>
      </div>

      <div className="form-grid">
        <div className="field field-wide">
          <label htmlFor={id("name")}>{t.fullName}</label>
          <input
            aria-describedby={describedBy("name")}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            id={id("name")}
            placeholder={t.namePlaceholder}
            {...register("name")}
          />
          {error("name")}
        </div>

        <div className="field">
          <label htmlFor={id("phone")}>{t.whatsapp}</label>
          <input
            aria-describedby={describedBy("phone")}
            aria-invalid={Boolean(errors.phone)}
            autoComplete="tel"
            id={id("phone")}
            inputMode="tel"
            placeholder="+91 98765 43210"
            {...register("phone")}
          />
          {error("phone")}
        </div>

        <div className="field">
          <label htmlFor={id("city")}>{t.city}</label>
          <input
            aria-describedby={describedBy("city")}
            aria-invalid={Boolean(errors.city)}
            autoComplete="address-level2"
            id={id("city")}
            placeholder={t.cityPlaceholder}
            {...register("city")}
          />
          {error("city")}
        </div>

        <div className="field">
          <label htmlFor={id("exam")}>{t.exam}</label>
          <select aria-describedby={describedBy("exam")} id={id("exam")} {...register("exam")}>
            {examOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t.examOptions[option.value]}
              </option>
            ))}
          </select>
          {error("exam")}
        </div>

        <div className="field">
          <label htmlFor={id("format")}>{t.format}</label>
          <select id={id("format")} {...register("format")}>
            {formatOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t.formatOptions[option.value]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor={id("email")}>{t.email}</label>
          <input
            aria-describedby={describedBy("email")}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            id={id("email")}
            inputMode="email"
            placeholder={t.emailPlaceholder}
            type="email"
            {...register("email")}
          />
          {error("email")}
        </div>

        <div className="field">
          <label htmlFor={id("target")}>{t.target}</label>
          <input
            aria-describedby={describedBy("target")}
            aria-invalid={Boolean(errors.target)}
            id={id("target")}
            placeholder={t.targetPlaceholder}
            {...register("target")}
          />
          {error("target")}
        </div>

        <div className="field field-wide">
          <label htmlFor={id("message")}>{t.message}</label>
          <textarea
            aria-describedby={describedBy("message")}
            aria-invalid={Boolean(errors.message)}
            id={id("message")}
            maxLength={1000}
            placeholder={t.messagePlaceholder}
            rows={3}
            {...register("message")}
          />
          {error("message")}
        </div>
      </div>

      <div aria-hidden="true" className="honeypot">
        <label htmlFor={id("website")}>{m.common.honeypot}</label>
        <input autoComplete="off" id={id("website")} tabIndex={-1} {...register("website")} />
      </div>

      {formState.type !== "idle" ? (
        <div
          aria-live="polite"
          className={`form-notice ${formState.type === "error" ? "is-error" : "is-preview"}`}
          role={formState.type === "error" ? "alert" : "status"}
        >
          {formState.type === "success" ? <Check aria-hidden="true" /> : null}
          <span>{formState.message}</span>
        </div>
      ) : null}

      <button className="button button-accent form-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="spin" />
            {m.common.sendingSecurely}
          </>
        ) : (
          <>
            {t.submit}
            <Send aria-hidden="true" />
          </>
        )}
      </button>

      <p className="form-privacy">
        <ShieldCheck aria-hidden="true" />
        <span>
          {t.privacy} {m.common.readOur} <Link href="/privacy">{m.common.privacyNotice}</Link>.
        </span>
      </p>
    </form>
  );
}
