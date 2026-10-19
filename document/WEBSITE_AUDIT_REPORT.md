# Sky Voice Website — Audit, Fixes & Test Report

Date: 19 October 2026 · Branch: `feat/visual-assets-integration` · Status: Phases 1–2 complete, Phase 3 waiting on owner input, Phase 4 to follow.

Legend: ✅ fixed / passed · ⏳ blocked on a dependency · ⚠️ identified, not changed (needs a decision) · ❌ failed

---

## 1. Audit report — codebase and structure

**Stack:** Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript, Tailwind 4 + a large hand-written `globals.css`, react-hook-form + zod, motion. pnpm monorepo; the only app is `apps/web`. Unit tests use Vitest and e2e tests use Playwright (desktop Chrome + Pixel 7) with axe accessibility checks.

**Routes**

| Route | Purpose | Notes |
|---|---|---|
| `/` | Home | Redirects (307) to `/free-ielts-assessment` |
| `/free-ielts-assessment` | Main campaign page: hero + assessment form, video, method, modules, portal, audience, **fees**, proof, **FAQ**, closing form | Holds the "Book My Free Assessment" forms (`#assessment-form`, `#final-assessment-form`) |
| `/about` | About Us | Team directory, mission, CTAs |
| `/contact` | Contact Us | Enquiry form, contact details (all pending), locations, FAQ |
| `/privacy`, `/terms` | Legal | Utility layout (logo + back button, no site header) |
| `/thank-you` | After a successful assessment booking | `noindex` |
| `/mascot-demo` | Internal mascot reference | Now 404 in production (see C-04) |
| `/api/leads` | Assessment form endpoint | zod validation, honeypot, rate limit (5 per 10 min per IP) |
| `/api/enquiries` | Contact form endpoint | Same protections |
| `sitemap.xml`, `robots.txt`, `opengraph-image`, `icon.svg` | SEO | All return 200 |

**How the forms work.** Both forms validate in the browser and again on the server. Delivery used to work **only through a webhook URL**. No webhook is configured in `.env.local`, so:
- in development, both forms show *"Preview validated successfully…"* and nothing is delivered;
- in production, both forms return **503 "temporarily unavailable"**. This is deliberate (no fake success), but it means **no submission reaches you yet**.

---

## 2. Issue tracker

| ID | Sev | Issue | Where | Impact | Status |
|---|---|---|---|---|---|
| C-01 | High | Contact Us and Book My Free Assessment submissions are not delivered anywhere: no email path existed and no webhook is configured | `api/leads`, `api/enquiries`, env | Every enquiry and lead is lost (production shows 503) | ✅ Email delivery built · ⏳ needs SMTP credentials (D-1) |
| C-02 | High | Nav showed Method and Modules; there was no Home item | `config/site.ts`, `site-footer.tsx` | Required change | ✅ Fixed |
| C-03 | Med | Honeypot field was rejected by the *client-side* schema. If a browser or password manager autofilled the hidden "Website" field, the form refused to submit and showed no error. It also made the server's silent-drop branch dead code. | `lib/leads/schema.ts`, `lib/enquiries/schema.ts`, both forms | A real visitor could be unable to submit, with no explanation | ✅ Fixed |
| C-04 | Med | `/mascot-demo` (a dev-only page) was public and indexable in production | `app/mascot-demo` | Unfinished internal page exposed | ✅ 404 in production + `noindex` |
| C-05 | Med | Forms called `response.json()` unguarded. A proxy, timeout, or HTML error page showed *"Unexpected token '<'…"*, and a network drop showed *"Failed to fetch"* | `lead-form.tsx`, `contact-form.tsx` | Confusing errors at the moment of conversion | ✅ Shared `postForm` helper with readable messages |
| C-06 | Med | Accessibility (WCAG 2.5.3): the video-preview button's accessible name did not contain its visible text, and the kicker and title ran together ("coming soonHow…") | `service-video.tsx` | Voice-control users can't activate it; axe failed on the campaign page | ✅ Fixed |
| C-07 | Low | On pages without a hero (About, Contact), the header "Free assessment" button was hidden until JavaScript loaded, then faded in. This also made the About-page axe test flaky. | `globals.css` | Late or flickering CTA; no CTA without JS | ✅ Hide rule scoped to pages with a hero |
| C-08 | Low | Mobile menu could not be closed with Escape, and stayed open in state after resizing to desktop | `site-header.tsx` | Keyboard accessibility | ✅ Fixed |
| C-09 | Low | Rate-limiter map never pruned expired entries | `lib/rate-limit.ts` | Slow memory growth on a long-running server | ✅ Fixed |
| C-10 | Low | Privacy notice described only the assessment form, not the contact form's email, phone, and message | `privacy/page.tsx` | Incomplete disclosure | ✅ Sentence added (wording still needs owner/legal review — D-4) |
| C-11 | Info | The rate limiter trusts `x-forwarded-for`, which is spoofable unless the host overwrites it (Vercel, Netlify and Cloudflare do). It is also per-instance memory. | `lib/rate-limit.ts` | Bypassable on some hosts | ⚠️ Depends on hosting (D-3) |
| C-12 | Info | Privacy and Terms pages have no site header or footer; the only way out is the logo or a "Back" button | `privacy`, `terms` | Weaker navigation, but it is an existing design choice | ⚠️ Needs your approval to change |
| C-13 | Info | Contact details, branches, social links, videos, and the portal access duration are intentionally empty and show "being confirmed" notes | `content/contact.ts`, env | Content gaps | ⏳ D-5, D-6 |
| C-14 | Info | `/thank-you` can be opened directly without submitting | `thank-you/page.tsx` | Harmless (`noindex`); matters only if it later fires ad conversions | ⚠️ Note before adding a Meta pixel |

No broken links, missing anchors, missing images or assets, or console errors were found on any page (crawl results in §5).

---

## 3. Completed fixes (files)

- **Navigation (C-02):** `src/config/site.ts` now lists **Home · Fees · FAQ · About Us · Contact Us**. In `src/components/site-footer.tsx`, Method/Modules are replaced by Home. The Method and Modules **sections are still on the page**, and "See how it works" still scrolls to Method. In `src/components/site-header.tsx`, Home is marked current except while a section link is active, and the Escape/resize handling (C-08) was added.
  - The label stays plural ("Fees") to match the section heading. Changing it to "Fee" is a one-word edit in `site.ts`.
- **Email delivery (C-01):** new file `src/lib/delivery/deliver.ts`, which uses the `nodemailer` dependency.
  - It sends by SMTP email and/or webhook, whichever is configured. A submission succeeds if at least one channel accepts it.
  - The email contains an escaped HTML table and a single-line subject (guards against header injection). Contact emails set Reply-To to the visitor's address.
  - Failures are logged without any form data.
  - `src/app/api/leads/route.ts` and `src/app/api/enquiries/route.ts` were rewritten to use it.
  - The new variables are documented in `.env.example` (root and `apps/web`).
- **Forms (C-03, C-05):** new file `src/lib/forms/post-form.ts`. Also changed: `lead-form.tsx`, `contact-form.tsx` (honeypot gets `autoComplete="off"`), and both `schema.ts` files.
- **Others:** `src/app/mascot-demo/layout.tsx` (new, C-04), `service-video.tsx` (C-06), `globals.css` (C-07), `rate-limit.ts` (C-09), `privacy/page.tsx` (C-10).
- **Tests:**
  - new `tests/e2e/navigation.spec.ts` and `tests/e2e/forms.spec.ts`; new unit test `src/lib/delivery/deliver.test.ts`;
  - updated honeypot unit tests and nav labels in `pages.spec.ts`;
  - e2e form tests now send a unique client IP so repeated runs don't trip the rate limiter.
- **Dependency side effect:** `pnpm add nodemailer` also moved several `"latest"`-pinned packages up by a patch version (Next 16.4.0→16.4.2, React 19.3.0→19.3.1, Playwright 1.64.0→1.64.1, axe-core 4.13→4.14, Vitest 5.0.4→5.0.5). The full regression suite passes on the new versions.

---

## 4. Dependency checklist (Phase 3 — needs you)

### D-1 · Email inbox for Contact Us + assessment bookings — **priority 1**
- **Unblocks:** C-01. Without it, production forms return 503 and no submission reaches you.
- **Recommended:** Gmail SMTP with a **Google App Password**. It is already built in, free, and enough for a coaching site (Gmail allows roughly 500 messages a day).
  - Alternatives: Zoho/Brevo SMTP (same variables).
  - Or Resend/SendGrid for better deliverability on your own domain. That needs DNS records and a small code change.
- **Your normal Gmail password will not work and must never be shared.** Steps:
  1. Turn on 2-Step Verification for the Google account.
  2. Open <https://myaccount.google.com/apppasswords>, create one named "Sky Voice website", and copy the 16-character code.
  3. Put these in `apps/web/.env.local` (git-ignored) for local testing, and in your hosting dashboard's environment variables for production. **Do not paste them into chat or commit them.**
     ```
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=465
     SMTP_USER=<the Gmail address>
     SMTP_PASS=<16-character app password>
     NOTIFY_EMAIL_TO=<inbox that should receive enquiries>
     ```
  4. Restart the server, then tell me it's set. I'll send a live test submission from each form and confirm it arrives.
- **Already done:** code, tests, and docs. The only remaining step is a live send.

### D-2 · (Optional) CRM / Google Sheet webhook
- **Unblocks:** storing leads somewhere other than email (for example, a WhatsApp follow-up queue).
- **Needed:** an HTTPS endpoint (Zapier/Make/Apps Script/CRM) → `ASSESSMENT_LEAD_WEBHOOK_URL` and an optional `…_TOKEN`. Contact enquiries can use a separate `CONTACT_ENQUIRY_WEBHOOK_URL`. It works alongside email.

### D-3 · Hosting platform
- **Why:** it decides where the environment variables go and whether C-11 needs work. Vercel or Netlify: nothing extra needed. A self-hosted Node server behind nginx must overwrite `X-Forwarded-For`. Several instances would need a shared rate-limit store such as Upstash Redis.

### D-4 · Privacy notice and Terms review
- **Needed:** the final provider list, data-retention period, and a privacy contact email. Both pages currently say these will be published before launch.

### D-5 · Contact details
- **Needed:** phone, WhatsApp, public email, address, hours, weekly holiday, branches, and official social profiles.
- **Where they go:** `src/content/contact.ts`. Each one appears on the Contact page as soon as it is filled.

### D-6 · Videos and portal access duration
- **Needed:** video files or URLs and captions for `NEXT_PUBLIC_SERVICE_VIDEO_SRC` and `NEXT_PUBLIC_HERO_VIDEO_SRC`, plus the portal access duration text.

### D-7 · Approvals
- C-12: add the site header and footer to Privacy and Terms?
- "Fee" vs "Fees" label wording.

---

## 5. Testing report

**Automated (all run on 19 Oct 2026 against the dev server and/or a production build)**

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | ✅ pass |
| ESLint (`--max-warnings=0`) | ✅ pass |
| Unit tests (Vitest) | ✅ 49/49 |
| e2e (Playwright, desktop Chrome + Pixel 7) | ✅ 76 tests, run twice in a row: **144 passed, 0 failed**, 8 skipped (desktop-only or mobile-only cases on the other device) |
| Production build (`next build`) | ✅ all 16 routes compile |
| Production smoke (`next start`) | ✅ all pages 200; `/` → 307 to campaign; `/mascot-demo` and unknown routes → 404; both APIs → 503 while delivery is unconfigured; security headers present |

**What the e2e suite covers**
- **Navigation:** the exact menu items; no Method/Modules in header or footer; Home, Fees, FAQ, About Us and Contact Us reach the right page or section; `/` redirect; mobile menu open, navigate and Escape-close; hero and plan CTAs scroll to the form and to Method; 404 page "Return" link.
- **Assessment form:** every validation message and `aria-invalid`; the hero and closing forms both submit; payload includes UTM attribution; a live success goes to `/thank-you`; a non-JSON 502 and a network drop both show readable errors.
- **Contact form:** every validation message; preview submission resets the form; a network failure keeps the typed data and shows a readable error.
- **APIs (both):** malformed JSON → 400; invalid fields → 400; filled honeypot → silent 200; 6th attempt → 429.
- **Responsive:** no horizontal overflow at 390px (campaign, About, Contact) or 768px (all 6 public pages); no console errors on any page.
- **Accessibility:** axe finds zero violations on campaign, About and Contact pages, desktop and mobile.

**Manual / visual:** a link-and-asset crawl of every page found 0 broken links, 0 missing `#anchors`, and 0 failed images or videos. The header was checked in screenshots at 1440, 1024, 768 and 390px, including the open mobile menu.

**Could not be completed (dependency):** a live email or webhook delivery from both forms (D-1/D-2). Only mocked channels are tested so far.

---

## 6. Remaining work

1. **D-1** — add the SMTP variables, then I run a live delivery test from both forms (Phase 3).
2. Decide C-12 and the Fee/Fees label (D-7).
3. Supply content for D-4, D-5 and D-6.
4. Confirm hosting (D-3) and set the same environment variables there.
5. **Phase 4:** repeat the full run (unit + e2e + production smoke + live form delivery) once the above lands.
