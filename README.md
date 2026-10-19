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

Copy `.env.example` to `.env.local` at the repository root or `apps/web/.env.local`, depending on the deployment provider.

- `ASSESSMENT_LEAD_WEBHOOK_URL`: server-only webhook that accepts validated assessment leads.
- `ASSESSMENT_LEAD_WEBHOOK_TOKEN`: optional bearer token sent to that webhook.

When no webhook is configured, development mode validates the form and returns an explicit preview result. A production build returns a service-unavailable response so a lead can never appear to be captured when it was not delivered.

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

## Where to add real content

The About and Contact pages are fully built and show an honest "being finalised"
note wherever approved content is missing. Fill these typed files and the pages
update automatically:

- `apps/web/src/content/about.ts`: `trainers` (name, designation, photo, qualifications, expertise, years, bio, video), `achievements`, `successStories`, and approval of the drafted mission/vision wording.
- `apps/web/src/content/contact.ts`: `contactDetails` (address, phones, WhatsApp, email, hours, weekly holiday), `branches` (each with a `mapQuery` for the embedded Google map and directions), and `socialLinks`.
- Trainer photos go in `apps/web/public/trainers/`; videos in `apps/web/public/video/` (or a hosted URL).
- Contact enquiries post to `/api/enquiries`. Set `CONTACT_ENQUIRY_WEBHOOK_URL` (optional; falls back to the assessment lead webhook).

## Content that must be supplied before launch

- Verified business contact details and operating hours.
- Trainer identity, credentials, portrait, and approved VSL media.
- Real portal screenshots and confirmed access duration.
- Genuine student results/reviews with permission.
- WATI or equivalent lead-delivery credentials.
- Final legal/privacy approval and analytics consent strategy.

The site intentionally omits or labels these items rather than fabricating them.
