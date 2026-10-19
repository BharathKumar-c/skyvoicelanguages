# Sky Voice Languages

Public IELTS assessment and coaching website for `skyvoicelanguages.com`, implemented from the project requirements and Sky Voice design-system documents.

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

Open `http://localhost:3000`; the root route redirects to `/free-ielts-assessment`.

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
