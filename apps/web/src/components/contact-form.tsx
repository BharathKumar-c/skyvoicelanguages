"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { enquiryTypes, type Branch } from "@/content/contact";
import { useI18n } from "@/i18n/client";
import { useLocalizedSchema, useRevalidateOnLocaleChange } from "@/i18n/forms";
import { format } from "@/i18n/merge";
import { contactEnquirySchemaFor, type ContactEnquiry } from "@/lib/enquiries/schema";
import { postForm } from "@/lib/forms/post-form";

type FormState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const MESSAGE_MAX = 1000;

export function ContactForm({ branches }: { branches: readonly Pick<Branch, "id" | "name">[] }) {
  const { m } = useI18n();
  const t = m.contactForm;
  const schema = useLocalizedSchema(contactEnquirySchemaFor);
  const [formState, setFormState] = useState<FormState>({ type: "idle" });
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    trigger,
  } = useForm<ContactEnquiry>({
    resolver: zodResolver(schema),
    defaultValues: { enquiryType: "assessment", website: "" },
  });
  useRevalidateOnLocaleChange(trigger, Object.keys(errors));
  const messageLength = useWatch({ control, name: "message" })?.length ?? 0;

  const onSubmit = handleSubmit(async (values) => {
    setFormState({ type: "idle" });

    try {
      const result = await postForm("/api/enquiries", values, t.errorFallback, m.common.networkError);

      // Clearing the form after a confirmed send prevents accidental repeats.
      reset();
      setFormState({
        type: "success",
        message:
          result.mode === "preview" ? (result.message ?? m.common.previewValidated) : t.success,
      });
    } catch (error) {
      setFormState({
        type: "error",
        message:
          error instanceof Error ? error.message : t.errorFallback,
      });
    }
  });

  const describedBy = (field: keyof ContactEnquiry, extra?: string) =>
    [errors[field] ? `enquiry-${field}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  return (
    <form className="lead-form contact-form" id="enquiry-form" noValidate onSubmit={onSubmit}>
      <div className="form-heading">
        <span className="form-badge">{t.badge}</span>
        <h2>{t.heading}</h2>
        <p>{t.intro}</p>
      </div>

      <div className="form-grid">
        <div className="field field-wide">
          <label htmlFor="enquiry-name">{t.fullName}</label>
          <input
            aria-describedby={describedBy("name")}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            id="enquiry-name"
            placeholder={t.namePlaceholder}
            {...register("name")}
          />
          {errors.name ? (
            <span className="field-error" id="enquiry-name-error">
              {errors.name.message}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="enquiry-email">{t.email}</label>
          <input
            aria-describedby={describedBy("email")}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            id="enquiry-email"
            inputMode="email"
            placeholder={t.emailPlaceholder}
            type="email"
            {...register("email")}
          />
          {errors.email ? (
            <span className="field-error" id="enquiry-email-error">
              {errors.email.message}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="enquiry-phone">{t.mobile}</label>
          <input
            aria-describedby={describedBy("phone")}
            aria-invalid={Boolean(errors.phone)}
            autoComplete="tel"
            id="enquiry-phone"
            inputMode="tel"
            placeholder="+91 98765 43210"
            {...register("phone")}
          />
          {errors.phone ? (
            <span className="field-error" id="enquiry-phone-error">
              {errors.phone.message}
            </span>
          ) : null}
        </div>

        <div className={`field ${branches.length ? "" : "field-wide"}`}>
          <label htmlFor="enquiry-type">{t.enquiryAbout}</label>
          <select id="enquiry-type" {...register("enquiryType")}>
            {enquiryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {t.enquiryTypes[type.value]}
              </option>
            ))}
          </select>
        </div>

        {branches.length ? (
          <div className="field">
            <label htmlFor="enquiry-branch">{t.branch}</label>
            <select id="enquiry-branch" {...register("branch")}>
              <option value="">{t.noPreference}</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="field field-wide">
          <label htmlFor="enquiry-message">{t.message}</label>
          <textarea
            aria-describedby={describedBy("message", "enquiry-message-count")}
            aria-invalid={Boolean(errors.message)}
            id="enquiry-message"
            maxLength={MESSAGE_MAX}
            placeholder={t.messagePlaceholder}
            rows={5}
            {...register("message")}
          />
          <span className="field-hint" id="enquiry-message-count">
            {format(t.characterCount, { count: messageLength, max: MESSAGE_MAX })}
          </span>
          {errors.message ? (
            <span className="field-error" id="enquiry-message-error">
              {errors.message.message}
            </span>
          ) : null}
        </div>
      </div>

      <div aria-hidden="true" className="honeypot">
        <label htmlFor="enquiry-website">{m.common.honeypot}</label>
        <input autoComplete="off" id="enquiry-website" tabIndex={-1} {...register("website")} />
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

      <button className="button button-primary form-submit" disabled={isSubmitting} type="submit">
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
