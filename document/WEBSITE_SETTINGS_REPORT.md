# Sky Voice Languages — Website Settings & Content Management Report

Date: 19 October 2026 · Branch: `feat/visual-assets-integration` · Builds on `document/WEBSITE_AUDIT_REPORT.md`
Company: **Sky Voice Languages** · Domain: **https://skyvoicelanguages.com**

---

## 1. Existing project and relevant architecture

- **Stack:** Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript, zod + react-hook-form, Vitest + Playwright. One app, `apps/web`, inside a pnpm monorepo.
- **Before this work:**
  - There was **no database, no authentication, and no admin area**.
  - All business data and copy was hard-coded in `src/content/*.ts` and `src/config/*.ts`, or inline in the page files.
  - Public pages are **statically prerendered**.
  - Forms post to `/api/leads` and `/api/enquiries`, which deliver by SMTP email and/or webhook (added in the audit).
- **Constraints that shaped the design:**
  - No existing auth system to follow, so a minimal, secure single-admin login was added.
  - No database, so a server-side file store sits behind a swappable interface (see §8 for hosting implications).
  - Static pages needed a way to update after a save without redeploying. Saves call `revalidatePath("/", "layout")`, which regenerates the pages on the next visit. **This was verified in a production build.**

## 2. Features implemented or modified

**New**

| Feature | Files |
|---|---|
| Settings data model and validation, with 7 sections and meaningful error messages | `src/lib/settings/schema.ts` |
| Defaults: today's approved copy, with unknown business facts left empty | `src/lib/settings/defaults.ts` |
| Persistence (atomic write, `.bak` of the previous version, per-section fallback, corrupt-file tolerance, auto-fill of newly added fields) | `src/lib/settings/store.ts` |
| Formatting helpers (₹ fees in Indian grouping, `tel:` and WhatsApp links, logo fallbacks) | `src/lib/settings/format.ts` |
| Admin authentication: scrypt password hash, HMAC-signed HttpOnly/SameSite=Strict session cookie (8 h), timing-safe checks, login rate limit (5 per 15 min) | `src/lib/admin/auth.ts`, `src/app/admin/actions.ts` |
| Admin pages: `/admin` → `/admin/login` → `/admin/settings`, `noindex`, blocked in `robots.txt` | `src/app/admin/**` |
| Website Settings editor: 7 tabs; repeatable lists with add/remove/reorder; inline validation; tab error badges; loading state; duplicate-submit guard; unsaved-changes warning; "items still waiting" checklist | `src/app/admin/settings/*` |
| Password-hash generator (hidden prompt; also prints a session secret) | `scripts/hash-admin-password.mjs` (`pnpm --filter @skyvoice/web admin:hash-password`) |
| Analytics (GA4 and Meta Pixel), opt-in: loads only when enabled **and** an ID is set | `src/components/analytics.tsx` |
| Settings-aware logo and header wrappers | `src/components/site-logo.tsx`, `src/components/site-header.tsx` (the old client header is now `site-header-client.tsx`) |

**Modified to read settings**
- Root layout: metadata, domain, configurable favicon, analytics.
- Campaign page: hero copy and CTAs, videos, assessment length, portal practice sets and access duration, packages/fees/schedule/duration, fee note, instalments, FAQ, structured data.
- About page: heading, intro, mission, vision and goals; only **published** trainers; only **verified** statistics; only **consented and published** testimonials.
- Contact page: heading, intro, phones, WhatsApp, email, address, hours, holiday, branches and maps, social links, FAQ.
- Footer: tagline, disclaimer, company name, white logo, phone/WhatsApp/email, social links.
- Header: logo, CTA label and destination.
- Other surfaces: privacy, terms, thank-you and 404 logos; `sitemap.xml` and `robots.txt` domain; contact-form branch list; form-notification recipient.
- Trainer directory now shows trainer achievements.

**Small fixes found while testing**
- Added Next's `data-scroll-behavior="smooth"` opt-in. Without it, every route change logged a framework warning.
- Bundler tracing of the settings file was silenced. Previously the whole project was being copied into the server output.

## 3. How to use Website Settings

1. **One-time setup** (for production; local development is already configured — see §8):
   - Run `pnpm --filter @skyvoice/web admin:hash-password`.
   - Put the printed `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` lines into the server environment.
   - Restart the server.
2. Open **`https://skyvoicelanguages.com/admin`** and sign in. The username is `ADMIN_USERNAME`, default `admin`.
3. Pick a tab and edit:
   - **Company**, **Contact**, **Courses & fees**, **Trainers**, **Results & reviews**, **Website content**, **Integrations**.
   - Lists (FAQs, packages, trainers, branches, statistics, testimonials, social profiles) have **Add**, ↑, ↓ and 🗑 buttons.
   - Fields that take one item per line say so; blank lines are ignored.
4. Click **Save settings**.
   - Problems are shown in red next to the field, with an error count on each tab, and **nothing is saved** until they're fixed.
   - A successful save says *"Settings saved. The website now shows the new details."* The change is live on the next page load; no deployment is needed.
5. The orange **"items still waiting for real information"** panel lists what is still empty. Click an item to jump to its tab.
6. **Images and videos:** upload the file to `apps/web/public/…` or a CDN, then paste its path (`/trainers/priya.webp`) or `https://` URL. Direct upload is a next step (§9).
7. **Sign out** from the top-right. Sessions expire after 8 hours.

## 4. What can now be managed without code changes

| Category | Settings |
|---|---|
| **A. Company** | Company name, website name, domain, logo (light and dark backgrounds), favicon, business description, service location, registered address, social profiles (Facebook, Instagram, YouTube, LinkedIn, WhatsApp, Google) |
| **B. Contact** | Phone numbers, WhatsApp number, email, office address, business hours, weekly holiday, Contact page heading and intro, branches (name, address, phone, hours, map search text) |
| **C. Courses & pricing** | Packages (name, group size, best-for, schedule, duration, Academic fee, General fee, highlight), fee note, instalment/EMI text, free-assessment length and description, portal practice-set count and access duration |
| **D. Trainers** | Name, id, designation, years of experience, photo, qualifications, expertise, achievements, biography, intro video, **Published** switch |
| **E. Results** | Statistics (value, label, **Verified** switch), testimonials (name, band before and after, module, quote, photo, **Consent**, **Published**). Publishing without consent is blocked. |
| **F. Content & branding** | Hero eyebrow, two-line headline, underlined words, description, both hero buttons (label, and destination for the second), reassurance line, header button label and destination, About heading/intro/mission/vision/goals, coaching FAQ, Contact FAQ, footer tagline and disclaimer, hero and service videos |
| **G. Integrations** | Form-notification recipients; WhatsApp mode (off / click-to-chat / WATI) plus WATI endpoint and template; analytics on/off plus GA4 and Meta Pixel IDs. There is also a **read-only status** of server secrets (SMTP, webhooks, WATI token, admin hash), which shows only whether each is configured. |

**Still in code by design:**
- Navigation items (fixed by the earlier requirement).
- Section structure, icons and mascot artwork.
- The Method/Modules/Audience/"Why stuck" explanatory copy.
- Enquiry-type options (tied to API validation).
- Privacy and Terms text (legal review pending).

These can be moved into settings later (§9).

## 5. Placeholder values and where they are used

There is **no invented business data anywhere**. Missing facts are left empty and either hidden or replaced with an honest note.

| Item | Current value | What the public site shows |
|---|---|---|
| Phone, WhatsApp, email, address, hours, holiday | empty | Contact page note *"…will be published once Sky Voice confirms them"*; no Call/WhatsApp/Email buttons; footer contact row hidden |
| Branches | empty | *"Coaching is fully online"* card |
| Social profiles | empty | *"Official social profiles will be linked here once confirmed"*; footer icons hidden |
| Trainers | empty | *"Trainer profiles are being finalised"* card |
| Statistics / testimonials | empty | *"Verified results are on their way"* card. Unverified or unconsented entries are **never** shown. |
| Portal access duration | empty | *"Access duration will be displayed after final client confirmation."* |
| Instalment / EMI | empty | Line hidden |
| Course duration per package | empty | Line hidden |
| Videos | empty | Blurred preview that opens the written overview |
| Logo / favicon | empty | Built-in Sky Voice brand files |
| Fees ₹17,499 / ₹16,499 (group) and ₹19,499 / ₹18,499 (1-on-1) | Carried over from the existing published page | Shown. **Please confirm these are final (D-3).** |
| Mission, vision, goals; About copy; FAQs | Carried over from the existing site (drafted earlier from campaign positioning) | Shown. **Please approve (D-7).** |

## 6. Pending dependencies (need your input)

Development continues without any of these. Each one appears on the site as soon as it is entered.

| # | What's needed | Why / what depends on it | Blocks development? | What happens once provided |
|---|---|---|---|---|
| D-1 | **Admin credentials for production:** run the hash script and set `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` on the server | Without them `/admin` stays locked in production (by design) | No | Sign in on the live site and save once |
| D-2 | **Hosting choice** | File storage needs a persistent disk: a VPS or Node host (Render/Railway with a volume, DigitalOcean, etc.) works as-is. Vercel/Netlify serverless **will not keep** saved settings. | No, but it decides D-2a | Set `SETTINGS_FILE` to a persistent path and back it up |
| D-2a | *(only if serverless)* a database or KV store (e.g. Vercel Postgres/Neon, Upstash Redis, Supabase), plus its connection secret in env | Persistent storage on serverless hosts | No | I add a database adapter behind `SettingsStore` (about 1 small file) and re-test |
| D-3 | **Final fees, packages, course durations, instalment/EMI terms** | Courses & fees tab and the public Fees section | No | Enter in the admin, then check the Fees section |
| D-4 | **Contact details:** phone, WhatsApp, public email, address, hours, holiday, branches | Contact page, footer, structured data, WhatsApp links | No | Enter in the admin, then test the `tel:`, `wa.me` and `mailto:` links |
| D-5 | **Email delivery:** Gmail App Password or other SMTP credentials as env vars (`SMTP_HOST`/`USER`/`PASS`), plus recipient(s) entered in **Integrations** | Assessment and Contact forms reach your inbox (from the audit, D-1) | No | Live test submission from both forms |
| D-6 | **Trainer profiles:** names, designations, qualifications, experience, bios, photos (4:5), optional videos, each trainer's approval | About → Trainers | No | Enter, tick Published, then review the profile dialog |
| D-7 | **Approval of the About copy, mission/vision/goals, FAQs** | Content already live | No | Edit in the admin if anything changes |
| D-8 | **Verified statistics and consented testimonials** (with written consent kept on file) | About → Results | No | Enter, tick Verified / Consent + Published |
| D-9 | **Social profile URLs and logo/favicon files** if different from the current brand files | Footer, Contact page, SEO | No | Paste the URLs/paths |
| D-10 | **Analytics:** GA4 measurement ID and/or Meta Pixel ID, **plus a cookie-consent decision** (India DPDP Act) | Tracking; it is off until enabled | No | Enable, then confirm events in GA/Meta debug tools |
| D-11 | **WATI:** account, tenant endpoint, approved template name, `WATI_API_TOKEN` (env) | Automated WhatsApp confirmations. Only the configuration structure exists; no message sending is built yet. | No | I implement the send call and test it against your sandbox |
| D-12 | **Service videos** (MP4 + captions) | Hero and "Meet Sky Voice" players | No | Paste the paths, then test playback |

**Never paste passwords, App Passwords or API tokens into chat or into the admin.** They belong only in the server environment (`.env.local` locally, the host's environment settings in production).

## 7. Tests performed and results

All tests were run on 19 Oct 2026.

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | ✅ pass |
| ESLint (`--max-warnings=0`) | ✅ pass |
| Unit tests (Vitest) | ✅ **72/72** — 23 new |
| End-to-end (Playwright: admin project, then desktop Chrome + Pixel 7) | ✅ **78 passed, 0 failed**, 4 skipped (device-specific cases) |
| Production build | ✅ 19 routes, no warnings |
| Production smoke (`next start`, hashed password, isolated settings file) | ✅ sign-in works; cookie is `HttpOnly` + `SameSite=Strict`; after **Save**, the static `/contact` and campaign pages served the new email and headline immediately (then served from cache) |
| Visual, desktop 1280 px and phone 390 px | ✅ admin editor and login render cleanly, no horizontal scroll, no console warnings |

**What the new tests cover**
- **Unit, schema and storage:**
  - defaults are valid;
  - 8 kinds of invalid input are rejected (email, WhatsApp, domain, fee format, `javascript:` logo, `//` protocol-relative links, GA4 ID, empty package list);
  - publishing a testimonial without consent is blocked;
  - blank lines are dropped;
  - per-section fallback on corrupt data; new fields auto-filled;
  - file round-trip, `.bak` backup, corrupt file → defaults.
- **Unit, auth:**
  - locked when unconfigured;
  - hash verification and username check;
  - plain-text password ignored in production;
  - tampered, forged, expired and wrong-secret tokens all rejected.
- **E2E, admin:**
  - unauthenticated and forged-cookie access redirects to login;
  - `noindex` is set;
  - wrong password shows an error;
  - invalid input shows field errors, switches to the failing tab, and saves nothing (confirmed after reload);
  - a valid save then a reload persists;
  - the Contact page shows the new `tel:`/`wa.me`/`mailto:` links and hours; the footer shows the phone; the campaign page shows the new headline, ₹21,000 fee and portal duration;
  - an **unverified statistic stays hidden**;
  - the phone-width editor has no overflow;
  - sign-out locks the area again;
  - no secret values appear in the admin page HTML.
- **Regression:** all earlier navigation, form, API, accessibility (axe), responsive (390/768 px) and console-error tests still pass.

**Not tested (needs your input):** live email, webhook or WATI delivery; live analytics; persistence on your real host (D-1, D-2, D-5, D-10, D-11).

**Outstanding issues:** none known.

## 8. Setup: environment variables, storage, migrations

- **No database migration.** Settings live in one JSON file. The default location is `apps/web/data/site-settings.json`, overridable with `SETTINGS_FILE`. That path is git-ignored.
  - The file is created on the first save. Until then the built-in defaults are used, so the site looks exactly as it does today.
  - Back the file up (a `.bak` copy of the previous version is kept automatically).
- **New environment variables** (documented in `.env.example`):

  | Variable | Purpose |
  |---|---|
  | `ADMIN_USERNAME` | Admin login name (default `admin`) |
  | `ADMIN_PASSWORD_HASH` | Admin password, as a scrypt hash |
  | `ADMIN_SESSION_SECRET` | Signs the session cookie |
  | `ADMIN_PASSWORD` | Local development only |
  | `SETTINGS_FILE` | Location of the settings file |
  | `WATI_API_TOKEN` | WATI access token |

  `NOTIFY_EMAIL_TO` is now a fallback; the Integrations tab takes precedence.
- **Local development:** I added a randomly generated development admin login to your git-ignored `apps/web/.env.local` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`). The password is in that file. These values are **ignored in production**.
- **Production checklist:**
  1. Set the admin hash and secret.
  2. Give `SETTINGS_FILE` a persistent disk (or do D-2a).
  3. Set the SMTP variables.
  4. `pnpm build && pnpm start`.
  5. Sign in, enter the details, save.

## 9. Recommended next steps (by priority)

1. **Choose hosting (D-2)** and set the admin credentials (D-1). If you choose serverless, I'll add the database adapter.
2. **Email delivery (D-5)**, then a live test of both forms.
3. **Enter contact details, fees and packages (D-3, D-4)** through the admin.
4. **Media uploads in the admin:** logo, trainer photos and videos, saved to persistent storage or object storage, instead of pasting paths.
5. **Trainers, verified results, testimonials (D-6, D-8)** as they become available.
6. **Analytics with a consent banner (D-10)**, so tracking starts lawfully.
7. **WATI automation (D-11):** an automatic WhatsApp confirmation after an assessment booking.
8. Move the remaining explanatory copy (Method, Modules, Audience, "Why stuck") and the Privacy/Terms text into settings, if the team wants to edit those too.
9. **Change history and multiple admin users:** keep a few versions with restore, and add per-user accounts once there is more than one editor.
