"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { socialPlatforms, type SiteSettingsInput } from "@/lib/settings/schema";

import { CheckboxField, Field, LinesField, ListEditor, SelectField } from "./fields";

export type IntegrationStatus = {
  smtp: boolean;
  notifyToEnv: boolean;
  leadWebhook: boolean;
  enquiryWebhook: boolean;
  watiToken: boolean;
  adminUsesHash: boolean;
};

function Section({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="admin-section">
      <h3>{title}</h3>
      {intro ? <p className="admin-intro">{intro}</p> : null}
      <div className="admin-grid">{children}</div>
    </section>
  );
}

const imageHint = "Upload the file to /public (or a CDN) and paste its path, e.g. /brand/logo.svg. Leave empty for the built-in default.";

export function CompanyTab() {
  return (
    <>
      <Section title="Identity">
        <Field label="Company name" name="company.name" />
        <Field label="Website name (short)" name="company.websiteName" />
        <Field hint="Full origin, no trailing slash. Used for links, SEO, and the sitemap." label="Domain" name="company.domain" wide />
        <Field label="Business description" multiline name="company.description" hint="Used for search results and link previews." />
        <Field label="Service location" name="company.serviceArea" hint='e.g. "Online" or "Online and Kochi".' />
        <Field label="Tagline" name="company.tagline" hint="The approved brand line. Shown in the Home hero and footer; hidden while empty." wide />
        <Field
          hint="The practice-portal sign-in page. Student login links appear in the header and footer once set."
          label="Student portal link"
          name="company.portalUrl"
          placeholder="https://portal.skyvoicelanguages.com"
          wide
        />
      </Section>
      <Section title="Logo and favicon" intro={imageHint}>
        <Field label="Logo (light backgrounds)" name="company.logoUrl" placeholder="/assets/generated/brand/skyvoice-horizontal-cropped.svg" />
        <Field label="Logo (dark backgrounds)" name="company.logoWhiteUrl" placeholder="/assets/generated/brand/skyvoice-horizontal-white-transparent.svg" />
        <Field label="Favicon" name="company.faviconUrl" placeholder="/icon.svg" />
      </Section>
      <Section title="Registered business address">
        <LinesField label="Address" name="company.address" hint="Shown in structured data; the Contact page uses the contact address." />
      </Section>
      <Section title="Social media" intro="Official profiles only. Each appears on the Contact page and footer once added.">
        <ListEditor
          addLabel="Add profile"
          emptyItem={{ platform: "instagram", url: "" }}
          emptyText="No social profiles yet — the site shows a 'will be linked once confirmed' note."
          itemLabel="Profile"
          max={socialPlatforms.length}
          name="company.socialLinks"
        >
          {(index) => (
            <>
              <SelectField
                label="Platform"
                name={`company.socialLinks.${index}.platform`}
                options={socialPlatforms.map((value) => ({ label: value[0].toUpperCase() + value.slice(1), value }))}
              />
              <Field label="Profile link" name={`company.socialLinks.${index}.url`} placeholder="https://instagram.com/…" />
            </>
          )}
        </ListEditor>
      </Section>
    </>
  );
}

export function ContactTab() {
  return (
    <>
      <Section title="Direct contact" intro="Empty items stay hidden. Call, WhatsApp, and Email buttons appear as soon as a value is saved.">
        <LinesField label="Phone numbers" name="contact.phones" hint="Display format with country code, e.g. +91 98765 43210." rows={2} />
        <Field label="WhatsApp number" name="contact.whatsapp" placeholder="+91 98765 43210" type="tel" />
        <Field label="Contact email" name="contact.email" placeholder="hello@skyvoicelanguages.com" type="email" />
        <LinesField label="Office address" name="contact.address" />
        <LinesField label="Business hours" name="contact.hours" hint='e.g. "Mon–Fri · 9:00–19:00".' />
        <Field label="Weekly holiday" name="contact.weeklyHoliday" placeholder="Sunday and public holidays" />
      </Section>
      <Section title="Contact page">
        <Field label="Heading" name="contact.pageTitle" wide />
        <Field label="Introduction" multiline name="contact.pageIntro" />
      </Section>
      <Section title="Branches" intro="Each branch gets a card, a map, and a directions link. No API key is needed.">
        <ListEditor
          addLabel="Add branch"
          emptyItem={{ address: [], hours: "", id: "", mapQuery: "", name: "", phone: "" }}
          emptyText="No branches — the Contact page explains that coaching is fully online."
          itemLabel="Branch"
          max={20}
          name="contact.branches"
        >
          {(index) => (
            <>
              <Field label="Branch name" name={`contact.branches.${index}.name`} />
              <Field hint="Lowercase, hyphens, e.g. kochi-main." label="Id" name={`contact.branches.${index}.id`} />
              <LinesField label="Address" name={`contact.branches.${index}.address`} />
              <Field label="Phone" name={`contact.branches.${index}.phone`} type="tel" />
              <Field label="Hours" name={`contact.branches.${index}.hours`} />
              <Field hint="Usually the full address." label="Map search text" name={`contact.branches.${index}.mapQuery`} wide />
            </>
          )}
        </ListEditor>
      </Section>
    </>
  );
}

export function CoursesTab() {
  return (
    <>
      <Section title="Packages and fees" intro="Fees are whole rupees, digits only (17499 shows as ₹17,499). Leave a fee empty to show 'Fee on request'.">
        <ListEditor
          addLabel="Add package"
          emptyItem={{ academicFee: "", description: "", duration: "", featured: false, generalFee: "", name: "", schedule: "", size: "" }}
          emptyText="At least one package is required."
          itemLabel="Package"
          max={6}
          name="courses.plans"
        >
          {(index) => (
            <>
              <Field label="Package name" name={`courses.plans.${index}.name`} />
              <Field label="Group size" name={`courses.plans.${index}.size`} />
              <Field label="Best for" name={`courses.plans.${index}.description`} wide />
              <Field label="Schedule" name={`courses.plans.${index}.schedule`} />
              <Field hint="Optional, e.g. 8 weeks." label="Course duration" name={`courses.plans.${index}.duration`} />
              <Field label="IELTS Academic fee (₹)" name={`courses.plans.${index}.academicFee`} placeholder="17499" />
              <Field label="IELTS General Training fee (₹)" name={`courses.plans.${index}.generalFee`} placeholder="16499" />
              <CheckboxField label="Highlight as 'Most focused'" name={`courses.plans.${index}.featured`} />
            </>
          )}
        </ListEditor>
      </Section>
      <Section title="Fee details">
        <Field label="Note under the fees heading" name="courses.feeNote" wide />
        <Field
          hint="Leave empty until instalment/EMI terms are confirmed; the line is hidden while empty."
          label="Instalment / EMI information"
          multiline
          name="courses.installmentInfo"
        />
      </Section>
      <Section title="PTE coaching" intro="Shown on the Home and IELTS & PTE pages. With no packages, the site says PTE packages and fees are being confirmed.">
        <CheckboxField label="We coach PTE Academic" name="courses.pte.offersAcademic" />
        <CheckboxField label="We coach PTE Core" name="courses.pte.offersCore" />
        <Field label="PTE summary" multiline name="courses.pte.summary" />
        <Field label="Note under the PTE fees" name="courses.pte.feeNote" wide />
        <ListEditor
          addLabel="Add PTE package"
          emptyItem={{ description: "", duration: "", featured: false, fee: "", name: "", schedule: "", size: "" }}
          emptyText="No PTE packages yet."
          itemLabel="PTE package"
          max={6}
          name="courses.pte.plans"
        >
          {(index) => (
            <>
              <Field label="Package name" name={`courses.pte.plans.${index}.name`} />
              <Field label="Group size" name={`courses.pte.plans.${index}.size`} />
              <Field label="Best for" name={`courses.pte.plans.${index}.description`} wide />
              <Field label="Schedule" name={`courses.pte.plans.${index}.schedule`} />
              <Field hint="Optional, e.g. 6 weeks." label="Course duration" name={`courses.pte.plans.${index}.duration`} />
              <Field label="Fee (₹)" name={`courses.pte.plans.${index}.fee`} placeholder="15999" />
              <CheckboxField label="Highlight as 'Most focused'" name={`courses.pte.plans.${index}.featured`} />
            </>
          )}
        </ListEditor>
      </Section>
      <Section title="Free assessment and practice portal">
        <Field hint='Shown as "Free · 45-minute online assessment".' label="Assessment length" name="courses.assessmentDuration" />
        <Field label="Practice sets in the portal" name="courses.portalPracticeSets" />
        <Field label="Assessment description" multiline name="courses.assessmentDescription" />
        <Field
          hint="Leave empty until confirmed; the site then says the duration will be displayed after confirmation."
          label="Portal access duration"
          name="courses.portalAccessDuration"
          placeholder="e.g. 6 months"
        />
      </Section>
    </>
  );
}

export function TeamTab() {
  const { control } = useFormContext<SiteSettingsInput>();
  const trainers = useWatch({ control, name: "team.trainers" }) ?? [];
  return (
    <Section
      title="Trainers"
      intro="Only trainers marked Published appear on the About page. Enter real, approved details only — never placeholder qualifications."
    >
      <ListEditor
        addLabel="Add trainer"
        emptyItem={{
          achievements: [],
          bio: "",
          designation: "",
          experienceYears: "",
          expertise: [],
          id: "",
          name: "",
          photoUrl: "",
          published: false,
          qualifications: [],
          videoUrl: "",
        }}
        emptyText="No trainers yet — the About page shows 'Trainer profiles are being finalised'."
        itemLabel="Trainer"
        max={30}
        name="team.trainers"
        titleOf={(index) => trainers[index]?.name || `Trainer ${index + 1}`}
      >
        {(index) => (
          <>
            <Field label="Full name" name={`team.trainers.${index}.name`} />
            <Field hint="Lowercase, hyphens, e.g. priya-menon." label="Id" name={`team.trainers.${index}.id`} />
            <Field label="Designation" name={`team.trainers.${index}.designation`} placeholder="Lead IELTS Trainer" />
            <Field label="Years of experience" name={`team.trainers.${index}.experienceYears`} />
            <Field hint={imageHint} label="Photo (4:5 portrait)" name={`team.trainers.${index}.photoUrl`} wide />
            <LinesField label="Qualifications" name={`team.trainers.${index}.qualifications`} />
            <LinesField label="Areas of expertise" name={`team.trainers.${index}.expertise`} />
            <LinesField label="Achievements" name={`team.trainers.${index}.achievements`} />
            <Field label="Biography" multiline name={`team.trainers.${index}.bio`} rows={4} />
            <Field label="Introduction video (MP4)" name={`team.trainers.${index}.videoUrl`} wide />
            <CheckboxField hint="Tick only after the trainer has approved this profile." label="Published" name={`team.trainers.${index}.published`} />
          </>
        )}
      </ListEditor>
    </Section>
  );
}

export function ResultsTab() {
  return (
    <>
      <Section
        title="Student statistics"
        intro="Only figures ticked Verified are shown publicly. Never enter estimates or targets as achievements."
      >
        <ListEditor
          addLabel="Add statistic"
          emptyItem={{ label: "", value: "", verified: false }}
          emptyText="No statistics yet — the About page says verified results are on their way."
          itemLabel="Statistic"
          max={8}
          name="results.stats"
        >
          {(index) => (
            <>
              <Field label="Value" name={`results.stats.${index}.value`} placeholder="e.g. 120+" />
              <Field label="Label" name={`results.stats.${index}.label`} placeholder="e.g. students coached" />
              <CheckboxField hint="Backed by records you can show on request." label="Verified" name={`results.stats.${index}.verified`} />
            </>
          )}
        </ListEditor>
      </Section>
      <Section
        title="Awards and recognition"
        intro="Only awards ticked Verified and Published appear. Verify each against its certificate or letter; the evidence note is internal and never shown."
      >
        <ListEditor
          addLabel="Add award"
          emptyItem={{ evidenceNote: "", issuer: "", published: false, title: "", verified: false, year: "" }}
          emptyText="No awards yet — award sections stay hidden."
          itemLabel="Award"
          max={12}
          name="results.awards"
        >
          {(index) => (
            <>
              <Field label="Award" name={`results.awards.${index}.title`} />
              <Field label="Awarded by" name={`results.awards.${index}.issuer`} />
              <Field label="Year" name={`results.awards.${index}.year`} placeholder="2025" />
              <Field label="Evidence (internal)" name={`results.awards.${index}.evidenceNote`} placeholder="Certificate in shared drive" />
              <CheckboxField label="Verified against the certificate" name={`results.awards.${index}.verified`} />
              <CheckboxField label="Published" name={`results.awards.${index}.published`} />
            </>
          )}
        </ListEditor>
      </Section>
      <Section title="Students worldwide" intro="Countries your students have joined from. Shown only when Verified is ticked.">
        <LinesField label="Countries" name="results.countries.list" rows={5} />
        <Field label="Source (internal)" name="results.countries.source" placeholder="Enrolment records, 2023–2026" wide />
        <CheckboxField hint="Every country is backed by an enrolment record." label="Verified" name="results.countries.verified" />
      </Section>
      <Section title="Testimonials and band results" intro="A testimonial can only be published once the student's written consent is recorded.">
        <ListEditor
          addLabel="Add testimonial"
          emptyItem={{ consent: false, detail: "", from: "", journey: [], module: "", name: "", outcome: "", photoUrl: "", published: false, quote: "", to: "" }}
          emptyText="No testimonials yet."
          itemLabel="Testimonial"
          max={30}
          name="results.testimonials"
        >
          {(index) => (
            <>
              <Field label="Student name" name={`results.testimonials.${index}.name`} />
              <Field label="Module or test" name={`results.testimonials.${index}.module`} placeholder="Overall · Academic" />
              <Field label="Band before" name={`results.testimonials.${index}.from`} placeholder="6.0" />
              <Field label="Band after" name={`results.testimonials.${index}.to`} placeholder="7.5" />
              <Field label="Course, job, or city" name={`results.testimonials.${index}.detail`} placeholder="MSc applicant · Chennai" />
              <Field label="Outcome" name={`results.testimonials.${index}.outcome`} placeholder="University offer, UK" />
              <Field hint="Shown when the student has no question-and-answer journey below." label="Quote" multiline name={`results.testimonials.${index}.quote`} />
              <ListEditor
                addLabel="Add question and answer"
                emptyItem={{ answer: "", question: "" }}
                emptyText="No journey answers — the card shows the quote."
                itemLabel="Answer"
                max={6}
                name={`results.testimonials.${index}.journey` as const}
              >
                {(answerIndex) => (
                  <>
                    <Field label="Question" name={`results.testimonials.${index}.journey.${answerIndex}.question`} wide />
                    <Field label="Student's answer" multiline name={`results.testimonials.${index}.journey.${answerIndex}.answer`} rows={2} />
                  </>
                )}
              </ListEditor>
              <Field label="Photo (optional, with consent)" name={`results.testimonials.${index}.photoUrl`} wide />
              <CheckboxField label="Written consent received" name={`results.testimonials.${index}.consent`} />
              <CheckboxField label="Published" name={`results.testimonials.${index}.published`} />
            </>
          )}
        </ListEditor>
      </Section>
    </>
  );
}

export function ContentTab() {
  return (
    <>
      <Section title="Homepage hero">
        <Field label="Eyebrow" name="content.hero.eyebrow" />
        <Field label="Headline, first line" name="content.hero.titleLine1" />
        <Field label="Headline, second line" name="content.hero.titleLine2" />
        <Field hint="Words at the end of the second line to underline." label="Underlined words" name="content.hero.titleUnderline" />
        <Field label="Description" multiline name="content.hero.lede" />
        <Field label="Primary button label" name="content.hero.primaryCtaLabel" hint="Scrolls to the assessment form." />
        <Field label="Secondary button label" name="content.hero.secondaryCtaLabel" />
        <Field label="Secondary button destination" name="content.hero.secondaryCtaHref" hint="#method, /about, or an https link." />
        <Field label="Reassurance line" name="content.hero.reassurance" />
      </Section>
      <Section title="Header button">
        <Field label="Label" name="content.headerCtaLabel" />
        <Field label="Destination" name="content.headerCtaHref" />
      </Section>
      <Section title="About Us">
        <Field label="Heading" name="content.about.title" wide />
        <Field label="Introduction" multiline name="content.about.lede" />
        <Field label="Mission" multiline name="content.about.mission" />
        <Field label="Vision" multiline name="content.about.vision" />
        <Field label="Goals" multiline name="content.about.goals" />
      </Section>
      <Section title="FAQ (coaching page)">
        <ListEditor
          addLabel="Add question"
          emptyItem={{ answer: "", question: "" }}
          emptyText="No FAQs — the FAQ section will be empty."
          itemLabel="Question"
          max={20}
          name="content.faqs"
        >
          {(index) => (
            <>
              <Field label="Question" name={`content.faqs.${index}.question`} wide />
              <Field label="Answer" multiline name={`content.faqs.${index}.answer`} rows={4} />
            </>
          )}
        </ListEditor>
      </Section>
      <Section title="FAQ (Contact page)">
        <ListEditor
          addLabel="Add question"
          emptyItem={{ answer: "", question: "" }}
          emptyText="No Contact-page FAQs."
          itemLabel="Question"
          max={12}
          name="content.contactFaqs"
        >
          {(index) => (
            <>
              <Field label="Question" name={`content.contactFaqs.${index}.question`} wide />
              <Field label="Answer" multiline name={`content.contactFaqs.${index}.answer`} rows={3} />
            </>
          )}
        </ListEditor>
      </Section>
      <Section title="Footer">
        <Field label="Tagline" multiline name="content.footer.tagline" />
        <Field label="Disclaimer" multiline name="content.footer.disclaimer" />
        <Field label="PTE disclaimer" name="content.footer.pteDisclaimer" wide />
      </Section>
      <Section title="Videos" intro="MP4 path or https URL. While empty, the player shows its preview and opens the written overview.">
        <Field label="Hero teaser video" name="content.heroVideoUrl" />
        <Field label="Service introduction video" name="content.serviceVideoUrl" />
      </Section>
    </>
  );
}

function PointsEditor({
  name,
  itemLabel,
  max,
  emptyText,
}: {
  name:
    | "pages.home.onboardingSteps"
    | "pages.home.learningPoints"
    | "pages.expertise.subjects"
    | "pages.whyChooseUs.points";
  itemLabel: string;
  max: number;
  emptyText: string;
}) {
  return (
    <ListEditor
      addLabel={`Add ${itemLabel.toLowerCase()}`}
      emptyItem={{ body: "", title: "" }}
      emptyText={emptyText}
      itemLabel={itemLabel}
      max={max}
      name={name}
    >
      {(index) => (
        <>
          <Field label="Title" name={`${name}.${index}.title`} wide />
          <Field label="Text" multiline name={`${name}.${index}.body`} rows={2} />
        </>
      )}
    </ListEditor>
  );
}

export function PagesTab() {
  return (
    <>
      <Section title="How you join (onboarding steps)" intro="Shown on Why Choose Us and Enquire Now.">
        <Field label="Heading" name="pages.home.onboardingTitle" wide />
        <PointsEditor emptyText="No steps — the section is hidden." itemLabel="Step" max={7} name="pages.home.onboardingSteps" />
      </Section>
      <Section title="How you'll learn" intro="The learning-style section on Why Choose Us. Hidden until at least one point is added.">
        <Field label="Heading" name="pages.home.learningTitle" wide />
        <Field label="Introduction" multiline name="pages.home.learningIntro" />
        <PointsEditor emptyText="No points — the section is hidden." itemLabel="Point" max={6} name="pages.home.learningPoints" />
      </Section>
      <Section title="Our Expertise page">
        <Field label="Heading" name="pages.expertise.title" wide />
        <Field label="Introduction" multiline name="pages.expertise.lede" />
        <PointsEditor emptyText="No subjects — the section is hidden." itemLabel="Subject" max={10} name="pages.expertise.subjects" />
      </Section>
      <Section title="Why Choose Us page" intro="Points are also shown on the IELTS & PTE page.">
        <Field label="Heading" name="pages.whyChooseUs.title" wide />
        <Field label="Introduction" multiline name="pages.whyChooseUs.lede" />
        <PointsEditor emptyText="No reasons — the section is hidden." itemLabel="Reason" max={8} name="pages.whyChooseUs.points" />
      </Section>
      <Section title="IELTS & PTE page">
        <Field hint="Search-result title; keep it under 60 characters." label="Search title" name="pages.ieltsPte.seoTitle" wide />
        <Field hint="Search-result description, about 150 characters." label="Search description" multiline name="pages.ieltsPte.seoDescription" />
        <Field label="Heading" name="pages.ieltsPte.title" wide />
        <Field label="Introduction" multiline name="pages.ieltsPte.lede" />
        <ListEditor
          addLabel="Add row"
          emptyItem={{ ielts: "", label: "", pte: "" }}
          emptyText="No comparison rows — the IELTS vs PTE table is hidden."
          itemLabel="Comparison row"
          max={10}
          name="pages.ieltsPte.comparison"
        >
          {(index) => (
            <>
              <Field label="Row" name={`pages.ieltsPte.comparison.${index}.label`} wide />
              <Field label="IELTS" name={`pages.ieltsPte.comparison.${index}.ielts`} />
              <Field label="PTE" name={`pages.ieltsPte.comparison.${index}.pte`} />
            </>
          )}
        </ListEditor>
        <ListEditor
          addLabel="Add question"
          emptyItem={{ answer: "", question: "" }}
          emptyText="No FAQs — the FAQ section is hidden."
          itemLabel="Question"
          max={15}
          name="pages.ieltsPte.faqs"
        >
          {(index) => (
            <>
              <Field label="Question" name={`pages.ieltsPte.faqs.${index}.question`} wide />
              <Field label="Answer" multiline name={`pages.ieltsPte.faqs.${index}.answer`} rows={3} />
            </>
          )}
        </ListEditor>
      </Section>
      <Section title="Enquire Now page">
        <Field label="Heading" name="pages.enquire.title" wide />
        <Field label="Introduction" multiline name="pages.enquire.lede" />
      </Section>
    </>
  );
}

function Status({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={ok ? "is-ok" : "is-missing"}>
      <span>{ok ? "Configured" : "Not configured"}</span>
      {children}
    </li>
  );
}

export function IntegrationsTab({ status }: { status: IntegrationStatus }) {
  return (
    <>
      <Section
        title="Server credentials"
        intro="Secrets are never stored here or sent to the browser. Set them as server environment variables (see .env.example); this list only shows whether each is present."
      >
        <ul className="admin-status is-wide">
          <Status ok={status.smtp}>SMTP email delivery (SMTP_HOST, SMTP_USER, SMTP_PASS)</Status>
          <Status ok={status.leadWebhook}>Assessment lead webhook (ASSESSMENT_LEAD_WEBHOOK_URL)</Status>
          <Status ok={status.enquiryWebhook}>Contact enquiry webhook (CONTACT_ENQUIRY_WEBHOOK_URL, optional)</Status>
          <Status ok={status.watiToken}>WATI WhatsApp API token (WATI_API_TOKEN)</Status>
          <Status ok={status.adminUsesHash}>Admin password stored as a hash (ADMIN_PASSWORD_HASH)</Status>
        </ul>
      </Section>
      <Section title="Form notifications">
        <Field
          hint={`Assessment bookings and Contact enquiries are emailed here (comma-separate several). ${
            status.notifyToEnv ? "Falls back to NOTIFY_EMAIL_TO when empty." : "Requires the SMTP credentials above."
          }`}
          label="Send submissions to"
          name="integrations.email.notifyTo"
          placeholder="team@skyvoicelanguages.com"
          wide
        />
      </Section>
      <Section title="WhatsApp">
        <SelectField
          hint="Click-to-chat uses the WhatsApp number from the Contact tab."
          label="Mode"
          name="integrations.whatsapp.provider"
          options={[
            { label: "Off — hide WhatsApp buttons", value: "none" },
            { label: "Click-to-chat link", value: "link" },
            { label: "WATI (prepared, not yet active)", value: "wati" },
          ]}
        />
        <Field hint="Your WATI tenant API URL, e.g. https://live-server-12345.wati.io" label="WATI API endpoint" name="integrations.whatsapp.watiEndpoint" />
        <Field hint="Approved template for automatic assessment confirmations." label="WATI template name" name="integrations.whatsapp.watiTemplateName" />
      </Section>
      <Section
        title="Analytics and tracking"
        intro="Scripts load only when enabled and an ID is set. Form contents are never sent. Confirm your cookie-consent approach before enabling."
      >
        <CheckboxField label="Enable analytics" name="integrations.analytics.enabled" />
        <Field label="Google Analytics 4 measurement ID" name="integrations.analytics.ga4MeasurementId" placeholder="G-XXXXXXXXXX" />
        <Field label="Meta Pixel ID" name="integrations.analytics.metaPixelId" placeholder="123456789012345" />
      </Section>
    </>
  );
}
