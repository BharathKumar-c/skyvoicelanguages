"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle, Save, TriangleAlert } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { FormProvider, useForm, useWatch, type FieldErrors, type Path } from "react-hook-form";

import {
  settingsSchema,
  type SettingsSection,
  type SiteSettings,
  type SiteSettingsInput,
} from "@/lib/settings/schema";

import { saveSettingsAction } from "../actions";
import {
  CompanyTab,
  ContactTab,
  ContentTab,
  CoursesTab,
  IntegrationsTab,
  PagesTab,
  ResultsTab,
  TeamTab,
  type IntegrationStatus,
} from "./sections";

const tabs: { id: SettingsSection; label: string }[] = [
  { id: "company", label: "Company" },
  { id: "contact", label: "Contact" },
  { id: "courses", label: "Courses & fees" },
  { id: "team", label: "Trainers" },
  { id: "results", label: "Results & reviews" },
  { id: "content", label: "Website content" },
  { id: "pages", label: "Pages" },
  { id: "integrations", label: "Integrations" },
];

type Notice = { type: "success" | "error"; message: string } | null;

/** Items still waiting for real information, derived from the current values. */
function pendingItems(values: SiteSettingsInput, status: IntegrationStatus) {
  const items: { section: SettingsSection; text: string }[] = [];
  const add = (condition: boolean, section: SettingsSection, text: string) => {
    if (condition) items.push({ section, text });
  };
  const { contact, company, courses, team, results, integrations, pages } = values;
  add(!contact.phones.some(Boolean), "contact", "Phone number");
  add(!contact.whatsapp, "contact", "WhatsApp number");
  add(!contact.email, "contact", "Contact email");
  add(!contact.address.some(Boolean), "contact", "Office address");
  add(!contact.hours.some(Boolean), "contact", "Business hours");
  add(!company.socialLinks.length, "company", "Social media profiles");
  add(!team.trainers.some((trainer) => trainer.published), "team", "Published trainer profiles");
  add(!results.stats.some((stat) => stat.verified), "results", "Verified student statistics");
  add(!results.testimonials.some((item) => item.published), "results", "Consented testimonials");
  add(!company.tagline, "company", "Approved tagline");
  add(!courses.pte.offersAcademic && !courses.pte.offersCore, "courses", "PTE products offered (Academic / Core)");
  add(!courses.pte.plans.length, "courses", "PTE packages and fees");
  add(!contact.branches.length, "contact", "Chennai centre address (or confirm online-only)");
  add(!results.awards.some((award) => award.verified && award.published), "results", "Verified awards");
  add(!results.countries.verified, "results", "Verified list of students' countries");
  add(!pages.home.learningPoints.length, "pages", "How you'll learn (learning style) copy");
  add(!courses.portalAccessDuration, "courses", "Portal access duration");
  add(!courses.installmentInfo, "courses", "Instalment / EMI terms");
  add(!(integrations.email.notifyTo || status.notifyToEnv) || !status.smtp, "integrations", "Email delivery for forms");
  add(!values.content.heroVideoUrl && !values.content.serviceVideoUrl, "content", "Service videos");
  return items;
}

function errorCount(errors: FieldErrors<SiteSettingsInput>, section: SettingsSection) {
  const count = (value: unknown): number => {
    if (!value || typeof value !== "object") return 0;
    if ("message" in value && typeof (value as { message?: unknown }).message === "string") return 1;
    return Object.values(value).reduce<number>((total, child) => total + count(child), 0);
  };
  return count(errors[section]);
}

export function SettingsEditor({
  initial,
  status,
  updatedAt,
  updatedBy,
  fallbackSections,
}: {
  initial: SiteSettings;
  status: IntegrationStatus;
  updatedAt: string | null;
  updatedBy: string | null;
  fallbackSections: SettingsSection[];
}) {
  const methods = useForm<SiteSettingsInput, unknown, SiteSettings>({
    defaultValues: initial,
    mode: "onBlur",
    resolver: zodResolver(settingsSchema),
  });
  const {
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    setError,
  } = methods;
  const [active, setActive] = useState<SettingsSection>("company");
  const [notice, setNotice] = useState<Notice>(null);
  const [saving, startSaving] = useTransition();
  const [lastSaved, setLastSaved] = useState(updatedAt);
  const values = useWatch({ control: methods.control }) as SiteSettingsInput;
  const pending = pendingItems(values, status);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const onValid = (data: SiteSettings) => {
    setNotice(null);
    startSaving(async () => {
      try {
        const result = await saveSettingsAction(data);
        if (result.ok) {
          // The saved, normalised values become the new baseline.
          reset(data);
          setLastSaved(result.updatedAt);
          setNotice({ message: result.message, type: "success" });
          return;
        }
        result.issues?.forEach((issue) =>
          setError(issue.path as Path<SiteSettingsInput>, { message: issue.message, type: "server" }),
        );
        setNotice({ message: result.message, type: "error" });
      } catch {
        setNotice({ message: "Could not reach the server. Check your connection and try again.", type: "error" });
      }
    });
  };

  const onInvalid = (invalid: FieldErrors<SiteSettingsInput>) => {
    const first = tabs.find((tab) => errorCount(invalid, tab.id) > 0);
    if (first) setActive(first.id);
    setNotice({ message: "Some fields need attention (marked in red). Nothing was saved.", type: "error" });
  };

  return (
    <FormProvider {...methods}>
      <form className="admin-editor" noValidate onSubmit={handleSubmit(onValid, onInvalid)}>
        <div className="admin-savebar">
          <div>
            <strong>{isDirty ? "Unsaved changes" : "All changes saved"}</strong>
            <small>
              {lastSaved
                ? `Last saved ${new Date(lastSaved).toLocaleString("en-IN")}${updatedBy ? ` by ${updatedBy}` : ""}`
                : "Showing built-in defaults — nothing saved yet."}
            </small>
          </div>
          <button className="button button-primary" disabled={saving || !isDirty} type="submit">
            {saving ? <LoaderCircle aria-hidden="true" className="spin" /> : <Save aria-hidden="true" />}
            {saving ? "Saving" : "Save settings"}
          </button>
        </div>

        {notice ? (
          <div
            aria-live="polite"
            className={`admin-notice ${notice.type === "error" ? "is-error" : "is-success"}`}
            role={notice.type === "error" ? "alert" : "status"}
          >
            {notice.type === "success" ? <Check aria-hidden="true" /> : <TriangleAlert aria-hidden="true" />}
            {notice.message}
          </div>
        ) : null}

        {fallbackSections.length ? (
          <div className="admin-notice is-error" role="alert">
            <TriangleAlert aria-hidden="true" />
            Stored values for {fallbackSections.join(", ")} were invalid, so the site is using built-in
            defaults for them. Review and save to fix.
          </div>
        ) : null}

        {pending.length ? (
          <details className="admin-pending">
            <summary>
              {pending.length} item{pending.length === 1 ? "" : "s"} still waiting for real information
              (hidden on the website until filled)
            </summary>
            <ul>
              {pending.map((item) => (
                <li key={item.text}>
                  <button onClick={() => setActive(item.section)} type="button">
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        ) : null}

        <div aria-label="Settings sections" className="admin-tabs" role="tablist">
          {tabs.map((tab) => {
            const count = errorCount(errors, tab.id);
            return (
              <button
                aria-controls={`panel-${tab.id}`}
                aria-selected={active === tab.id}
                id={`tab-${tab.id}`}
                key={tab.id}
                onClick={() => setActive(tab.id)}
                role="tab"
                type="button"
              >
                {tab.label}
                {count ? <span className="admin-badge" aria-label={`${count} errors`}>{count}</span> : null}
              </button>
            );
          })}
        </div>

        {/* All panels stay mounted so validation covers every tab. */}
        {tabs.map((tab) => (
          <div
            aria-labelledby={`tab-${tab.id}`}
            className="admin-panel"
            hidden={active !== tab.id}
            id={`panel-${tab.id}`}
            key={tab.id}
            role="tabpanel"
          >
            {tab.id === "company" ? <CompanyTab /> : null}
            {tab.id === "contact" ? <ContactTab /> : null}
            {tab.id === "courses" ? <CoursesTab /> : null}
            {tab.id === "team" ? <TeamTab /> : null}
            {tab.id === "results" ? <ResultsTab /> : null}
            {tab.id === "content" ? <ContentTab /> : null}
            {tab.id === "pages" ? <PagesTab /> : null}
            {tab.id === "integrations" ? <IntegrationsTab status={status} /> : null}
          </div>
        ))}
      </form>
    </FormProvider>
  );
}
