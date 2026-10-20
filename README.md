# Sky Voice Languages

Public IELTS and PTE coaching website for `skyvoicelanguages.com`, implemented from the project requirements and Sky Voice design-system documents.

## Project structure

```text
apps/web/                         Next.js public website
document/                         Client campaign source documents
SKYVOICE - LOGO FILES/            Original brand assets
SKYVOICE_DESIGN_SYSTEM.md         Visual-system specification
WEBSITE_DEVELOPMENT_REQUIREMENTS.md  Implementation requirements
```

The original client documents and logo source files are preserved. Web-ready copies of the approved SVG variants live in `apps/web/public/brand`.

## Requirements

- Node.js 22+
- pnpm 11+

## Local development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`; the root route redirects to the homepage at `/free-ielts-assessment`. Site pages:

| Route | Page |
|---|---|
| `/free-ielts-assessment` | Home: the campaign page with the free-assessment form, Where IELTS Can Take You, and Student Success Stories |
| `/about` | About Us |
| `/our-expertise` | Our Expertise (subjects and tutors) |
| `/ielts-pte-coaching-chennai` | IELTS & PTE (fees, comparison, FAQ, Chennai SEO) |
| `/why-choose-us` | Why Choose Us |
| `/contact` | Contact Us |
| `/enquire-now` | Enquire Now (IELTS and PTE enquiry form, `POST /api/enquire`) |
| `/disclaimer`, `/privacy`, `/terms` | Legal pages, linked from the footer |

### Languages (English / தமிழ்)

A globe button in the header (and on the legal, thank-you, and 404 pages) switches the whole site between English (the default) and Tamil. The choice is stored in the `sv_lang` cookie, mirrored in localStorage, and kept across pages and refreshes; the visitor stays on the same page, typed form text is kept, and `<html lang>` follows the language. Because the server reads the cookie, pages render per request rather than being prerendered.

| Where | What |
|---|---|
| `apps/web/src/i18n/config.ts` | The supported languages (drives the switcher and `<html lang>`) |
| `apps/web/src/i18n/messages/en.ts` | All interface text in English: the source of every key |
| `apps/web/src/i18n/messages/ta.ts` | Tamil interface text (same keys; anything missing falls back to English) |
| `apps/web/src/i18n/settings/ta.ts` | Tamil versions of the built-in Website Settings copy |
| `apps/web/src/i18n/settings/localize.ts` | Shows built-in settings copy in the visitor's language |

To add a language (e.g. Hindi):

1. Add `{ code: "hi", label: "Hindi", nativeName: "हिन्दी", htmlLang: "hi" }` to `locales` in `i18n/config.ts`.
2. Create `i18n/messages/hi.ts` typed as `DeepPartial<Messages>` (copy `ta.ts` as a template) and register it in `i18n/messages/index.ts`.
3. Optionally create `i18n/settings/hi.ts` for the built-in Website Settings copy and register it in `i18n/settings/localize.ts`.
4. If the script needs a font that Nunito lacks, add it in `app/layout.tsx` the way Noto Sans Tamil is added, and append its CSS variable to the font stacks.
5. Run `pnpm test`: the dictionary tests check for unknown keys, list lengths, and placeholders.

No component changes are needed. Text an administrator changes in Website Settings is shown exactly as saved in every language, because Website Settings has no per-language fields yet.

### Previewing with sample content

Many sections wait on details from Sky Voice (tagline, tutors, awards, countries, PTE fees, contact details, learning style). To review layouts with placeholder data, start the dev server with `SAMPLE_CONTENT=on` (for example, add it to `apps/web/.env.local`). Empty Website Settings fields are then filled from `apps/web/src/lib/settings/sample.ts`, every page shows a "Sample content preview" banner, and every page is marked noindex. Saved settings always win over samples. On a server, set it in the server environment and restart the Node service. Never enable it on the public site.

## Environment variables

Copy `apps/web/.env.example` to **`apps/web/.env.local`**. Next.js reads env files only from `apps/web`, so a `.env.local` at the repository root is ignored. Every variable is documented in `.env.example`. The main groups are:

- **Admin (`/admin`):** `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET`, both generated with `pnpm --filter @skyvoice/web admin:hash-password`.
- **Website Settings storage:** `SETTINGS_FILE`.
- **Form email:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL_TO`.
- **Optional webhooks:** `ASSESSMENT_LEAD_WEBHOOK_URL` and `CONTACT_ENQUIRY_WEBHOOK_URL`.

When no delivery method is configured, development mode validates the forms and shows an explicit preview result. A production build returns a service-unavailable response instead, so a lead can never look captured when it wasn't delivered.

Deployment on Windows Server and IIS: see `document/WINDOWS_SERVER_DEPLOYMENT_GUIDE.md`.

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

## Where to add real content

Business details and site copy are managed in **Website Settings** at `/admin/settings`, with no code changes needed. That includes:

- company and contact details, branches and social links;
- courses and fees;
- trainers;
- verified results and testimonials;
- hero text, FAQs and footer;
- tagline, student-portal link, PTE packages, awards, and students' countries;
- Home, Our Expertise, Why Choose Us, IELTS & PTE, and Enquire Now page copy (**Pages** tab);
- videos and integrations.

Empty items stay hidden, or show an honest "being confirmed" note. See `document/WEBSITE_SETTINGS_REPORT.md`.

## Content that must be supplied before launch

- Verified business contact details and operating hours.
- Trainer identity, credentials, portrait, and approved VSL media.
- Real portal screenshots and confirmed access duration.
- Genuine student results/reviews with permission.
- WATI or equivalent lead-delivery credentials.
- Final legal/privacy approval and analytics consent strategy.

The site intentionally omits or labels these items rather than fabricating them.
