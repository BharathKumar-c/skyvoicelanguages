"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, LoaderCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useI18n } from "@/i18n/client";
import { useLocalizedSchema, useRevalidateOnLocaleChange } from "@/i18n/forms";
import { format } from "@/i18n/merge";
import { postForm } from "@/lib/forms/post-form";
import { assessmentLeadSchemaFor, type AssessmentLead } from "@/lib/leads/schema";

type LeadFormProps = {
  idPrefix: string;
  compact?: boolean;
  /** From Website Settings, e.g. "45-minute"; empty shows "Free · online assessment". */
  assessmentDuration?: string;
};

type FormState =
  | { type: "idle" }
  | { type: "preview"; message: string }
  | { type: "error"; message: string };

export function LeadForm({ idPrefix, compact = false, assessmentDuration = "" }: LeadFormProps) {
  const router = useRouter();
  const { m } = useI18n();
  const t = m.leadForm;
  const schema = useLocalizedSchema(assessmentLeadSchemaFor);
  const [formState, setFormState] = useState<FormState>({ type: "idle" });
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    trigger,
  } = useForm<AssessmentLead>({
    resolver: zodResolver(schema),
    defaultValues: {
      ieltsType: "not-sure",
      targetBand: "7.0",
      website: "",
    },
  });
  useRevalidateOnLocaleChange(trigger, Object.keys(errors));

  const onSubmit = handleSubmit(async (values) => {
    setFormState({ type: "idle" });
    const params = new URLSearchParams(window.location.search);

    try {
      const result = await postForm(
        "/api/leads",
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

      if (result.mode === "preview") {
        setFormState({ type: "preview", message: result.message ?? t.previewFallback });
        return;
      }

      router.push("/thank-you?submitted=1");
    } catch (error) {
      setFormState({
        type: "error",
        message: error instanceof Error ? error.message : t.errorFallback,
      });
    }
  });

  return (
    <form
      className={`lead-form ${compact ? "lead-form-compact" : ""}`}
      id={`${idPrefix}-form`}
      noValidate
      onSubmit={onSubmit}
    >
      {!compact ? (
        <div className="form-heading">
          <span className="form-badge">
            {format(t.badge, { duration: assessmentDuration ? `${assessmentDuration} ` : "" })}
          </span>
          <h2>{t.heading}</h2>
          <p>{t.intro}</p>
        </div>
      ) : null}

      <div className="form-grid">
        <div className="field field-wide">
          <label htmlFor={`${idPrefix}-name`}>{t.fullName}</label>
          <input
            aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            id={`${idPrefix}-name`}
            placeholder={t.namePlaceholder}
            {...register("name")}
          />
          {errors.name ? (
            <span className="field-error" id={`${idPrefix}-name-error`}>
              {errors.name.message}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor={`${idPrefix}-phone`}>{t.whatsapp}</label>
          <input
            aria-describedby={errors.phone ? `${idPrefix}-phone-error` : undefined}
            aria-invalid={Boolean(errors.phone)}
            autoComplete="tel"
            id={`${idPrefix}-phone`}
            inputMode="tel"
            placeholder="+91 98765 43210"
            {...register("phone")}
          />
          {errors.phone ? (
            <span className="field-error" id={`${idPrefix}-phone-error`}>
              {errors.phone.message}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor={`${idPrefix}-city`}>{t.city}</label>
          <input
            aria-describedby={errors.city ? `${idPrefix}-city-error` : undefined}
            aria-invalid={Boolean(errors.city)}
            autoComplete="address-level2"
            id={`${idPrefix}-city`}
            placeholder={t.cityPlaceholder}
            {...register("city")}
          />
          {errors.city ? (
            <span className="field-error" id={`${idPrefix}-city-error`}>
              {errors.city.message}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor={`${idPrefix}-type`}>{t.ieltsType}</label>
          <select id={`${idPrefix}-type`} {...register("ieltsType")}>
            <option value="academic">{t.academic}</option>
            <option value="general">{t.general}</option>
            <option value="not-sure">{t.notSure}</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor={`${idPrefix}-band`}>{t.targetBand}</label>
          <select id={`${idPrefix}-band`} {...register("targetBand")}>
            <option value="6.0">6.0</option>
            <option value="6.5">6.5</option>
            <option value="7.0">7.0</option>
            <option value="7.5">7.5</option>
            <option value="8.0+">8.0+</option>
          </select>
        </div>
      </div>

      <div aria-hidden="true" className="honeypot">
        <label htmlFor={`${idPrefix}-website`}>{m.common.honeypot}</label>
        <input autoComplete="off" id={`${idPrefix}-website`} tabIndex={-1} {...register("website")} />
      </div>

      {formState.type !== "idle" ? (
        <div
          aria-live="polite"
          className={`form-notice ${formState.type === "error" ? "is-error" : "is-preview"}`}
          role={formState.type === "error" ? "alert" : "status"}
        >
          {formState.type === "preview" ? <Check aria-hidden="true" /> : null}
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
            <ArrowRight aria-hidden="true" />
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
