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

## Content that must be supplied before launch

- Verified business contact details and operating hours.
- Trainer identity, credentials, portrait, and approved VSL media.
- Real portal screenshots and confirmed access duration.
- Genuine student results/reviews with permission.
- WATI or equivalent lead-delivery credentials.
- Final legal/privacy approval and analytics consent strategy.

The site intentionally omits or labels these items rather than fabricating them.
