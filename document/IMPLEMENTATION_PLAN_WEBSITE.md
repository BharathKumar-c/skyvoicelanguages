# Sky Voice Languages — Marketing Website Implementation Plan (Project 1)

**Prepared:** 20 Oct 2026. Based on the repository at commit `31a2e9f`.
**Scope:** the public marketing website (`apps/web`) only. The practice portal (Project 2) is out of scope for now. This plan only reserves a hidden "Student Login" link for it (§3.6).
**Status:** draft. Items marked **[BLOCKER]** can't go live until Sky Voice supplies them.

---

## 1. Summary

- **This plan extends the existing site rather than rebuilding it.** `apps/web` is already a production Next.js site. It has:
  - pages: the campaign page (`/free-ielts-assessment`), About, Contact, Privacy, Terms and Thank-you;
  - a password-protected admin with **Website Settings** (`/admin/settings`);
  - a trainer directory, testimonials gated on consent, and stats gated on verification;
  - form delivery by SMTP and webhook, with rate limiting and a honeypot;
  - SEO basics (metadata, sitemap, robots, OG image, JSON-LD);
  - unit, E2E and accessibility tests, and an IIS deployment guide.
- **Logo and colours are already available.** Logos are in `SKYVOICE - LOGO FILES/` and `apps/web/public/brand/*.svg`. Colours are in `document/COLOR_CODES.md` and already used as tokens: Blue `#1655d8`, Navy `#0e2d5e`, Orange `#eb9d13` and White.
- **The real gaps:**
  - The four new pages: Home, Our Expertise, IELTS & PTE, and Why Choose Us.
  - An Enquire Now page.
  - **PTE content.** The site currently mentions IELTS only.
  - **Chennai positioning.** The site is currently "Online" with no address.
  - Settings fields for the tagline, awards, countries and PTE.
  - The client-supplied content itself.
- **Content approach:** all new content goes into Website Settings. Sky Voice can then fill or update it without a code change. Anything not supplied stays hidden or shows an honest "being confirmed" note. Nothing is invented.

---

## 2. Gap analysis

| Requirement | Current state | Work needed | Blocking input |
|---|---|---|---|
| **Home** | `/` redirects to `/free-ielts-assessment` (`src/app/page.tsx`) | Build a real homepage at `/`. The campaign page stays as the paid-ads destination | Tagline |
| **About** (content pending) | `/about` exists. Mission, vision and goals can be edited in Settings | Add the new Settings fields and adjust the copy to cover IELTS **and** PTE | **[BLOCKER]** About copy, founding year, story |
| **Our Expertise** (tutor photos and qualifications pending) | `TrainerDirectory` and `team.trainers` (photo, qualifications, expertise, experience, achievements, bio, video, `published`) are shown on About | New `/our-expertise` page that reuses the directory and adds an "IELTS & PTE subjects we teach" block | **[BLOCKER]** Tutor names, photos, qualifications, years of experience, and score proof if a tutor's own score is quoted |
| **IELTS & PTE page** (differentiators, Chennai SEO, portal CTA) | IELTS differentiators exist on the campaign page. There is no PTE content anywhere | New `/ielts-pte-coaching-chennai` page, PTE course data in Settings, PTE trademark disclaimer, portal CTA | **[BLOCKER]** PTE products, formats and fees. Whether a physical Chennai centre exists |
| **Why Choose Us** (content pending) | Fragments exist on About ("Our approach") and the campaign page ("Why stuck", method) | New `/why-choose-us` page | **[BLOCKER]** The client's own reasons, plus award evidence |
| **Contact** (content pending) | `/contact` exists with an enquiry form, branches, map and FAQ. All contact fields are empty by design | Content only | **[BLOCKER]** Phone, WhatsApp, email, address, hours |
| **Enquire Now** (main landing page) | Two forms exist: the free-assessment form (5 fields, IELTS only) and the Contact enquiry form | New `/enquire-now` page with a short IELTS + PTE enquiry form. It becomes the primary CTA everywhere | Q1 (what "main landing page" means) |
| **Tagline** | The footer tagline is placeholder copy written by the developer | `company.tagline` field, used in the Home hero, the footer and OG metadata | **[BLOCKER]** Approved tagline |
| **Experienced tutors** | `experienceYears` field exists | Highlight tile on Home ("N+ years teaching") built only from published tutors | Tutor data |
| **Awards** | None | `results.awards[]` with `verified`, `published` and an evidence note. Hidden while empty | **[BLOCKER]** Name, issuer, year and proof for each award |
| **Gen Z learning** | The Aira mascot, the motion system and a mobile-first layout already exist | "How you'll learn" section on Home and Why Choose Us. The copy can't be written until the term is defined | Q5 |
| **Worldwide students** | `results.stats[]` with a `verified` flag | `results.countries` (list, `verified`, source). Tile: "Students from N countries". Hidden until verified | **[BLOCKER]** Country list or count and where it comes from |
| **Onboarding method** | Six-step method and "what happens next" (form → WhatsApp → 45-minute assessment → roadmap) | Reusable "How you join" section on Home and Enquire Now, editable in Settings | Confirm the steps and the 2-hour WhatsApp response promise |
| **Portal link and CTA** | The footer "Portal" link scrolls to `#portal` (a concept preview) | `company.portalUrl`. "Student Login" appears in the header and footer only once it's set. The IELTS & PTE page CTA goes to Enquire Now until then | Portal URL (later, Project 2) |
| **Chennai SEO** | Metadata, sitemap, robots and JSON-LD exist for the current pages | Per-page metadata, keyword plan, conditional `LocalBusiness` schema, sitemap and navigation updates | Q2 |
| **Logo and colours** | Present | None | — |

---

## 3. Website design

### 3.1 Routes and navigation

```
/                              Home                      NEW (replaces the redirect)
/about                         About                     exists; copy update
/our-expertise                 Our Expertise             NEW
/ielts-pte-coaching-chennai    IELTS & PTE               NEW
/why-choose-us                 Why Choose Us             NEW
/contact                       Contact                   exists; content only
/enquire-now                   Enquire Now               NEW (see Q1)
/free-ielts-assessment         Paid-ads campaign page    exists; unchanged
/privacy /terms /thank-you     exist (thank-you stays noindex)
```

- **Header:** Home · About · Our Expertise · IELTS & PTE · Why Choose Us · Contact · **[Enquire Now]** (the button replaces today's "Book free assessment" header CTA). Student Login is a text link, shown only when `company.portalUrl` is set.
- **Mobile:** the same items in the existing drawer (`site-header-client.tsx`). The sticky mobile bar's main action becomes Enquire Now.
- **Single place to change:** `src/config/site.ts → navigation`. The header CTA label and target already come from Settings (`content.headerCtaLabel` / `headerCtaHref`), so they become "Enquire Now" and `/enquire-now`.
- **Campaign page:** `/free-ielts-assessment` keeps its own focused layout and form. The paid ads, UTM tracking and conversion events already point there. It stays indexable with its own canonical, and its content doesn't overlap enough with Home to count as duplication.

### 3.2 Page specifications

Each page:
- is a server component that reads `getSettings()`;
- reuses the existing `SiteHeader`, `SiteFooter`, `Reveal`, `FaqList`, `TrainerDirectory`, `AiraContext` and the design tokens in `globals.css`;
- hides every section whose data is empty.

#### Home (`/`)
1. **Hero:**
   - Content: tagline, a one-line value statement (`content.home.heroLede`), **Enquire Now** as the primary button and "Book a free IELTS assessment" as the secondary.
   - Visual: the Aira mascot.
2. **Highlights strip.** Up to four tiles, each shown only when its data is verified or published:
   - experienced tutors (from published trainers);
   - awards (verified and published);
   - students from N countries (verified);
   - verified results stats.

   If none are available yet, the strip shows facts Sky Voice already states: IELTS Academic & General Training · PTE (once Q3 is answered) · 1-on-1 or groups of 3–5 · fully online · 80 practice sets.
3. **IELTS and PTE cards:** two cards with a short summary and a starting fee (or "Fee on request"), linking to the IELTS & PTE page.
4. **How you join** (onboarding). Steps come from `content.home.onboardingSteps`. Default: Enquire → WhatsApp call → free assessment → written roadmap → choose a format and enrol.
5. **How you'll learn** ("Gen Z learning"): `content.home.learningStyle` (title, body, points). Hidden until the copy is approved.
6. **Tutors teaser:** the first three published trainers, with a "Meet the team" link to `/our-expertise`. Hidden if no trainer is published.
7. **Proof:** consented testimonials and verified stats, reusing the campaign page markup. Hidden while empty.
8. **Final CTA:** the embedded Enquire Now form.

#### Our Expertise (`/our-expertise`)
1. **Intro:** `content.expertise.title` and `content.expertise.intro`.
2. **Subjects we teach:**
   - IELTS Academic, IELTS General Training, and PTE Academic/Core (as confirmed);
   - Listening, Reading, Writing and Speaking;
   - Spoken English or other languages only if Sky Voice offers them (the brand name is "Sky Voice *Languages*"; see Q3).
3. **Tutor directory:** `TrainerDirectory` with published trainers. While none are published: "Tutor profiles are being added", with an Enquire CTA.
4. **Teaching method:** reuse `methodSteps` from `content/landing.ts`.
5. **CTA.**

Move `publishedTrainers()` out of `about/page.tsx` into `src/lib/settings/trainers.ts` so About, Home and Our Expertise share it.

#### IELTS & PTE (`/ielts-pte-coaching-chennai`)
1. H1: "IELTS & PTE Coaching in Chennai", or the online-only wording (§3.4).
2. **IELTS block:** Academic vs General Training, the four modules, the method, packages and fees from `courses.plans`.
3. **PTE block:** the PTE Academic/Core summary and skills, with packages and fees from `courses.pte.plans`.
4. **IELTS vs PTE comparison table:** `content.ieltsPte.comparisonRows`.
   - It sticks to factual exam differences (format, delivery, scoring scale, result timing) and is reviewed by the client.
   - It makes no claim that one exam is "easier".
5. **Why Sky Voice for IELTS/PTE.** These differentiators are already backed by the site:
   - diagnosis first;
   - 1-on-1 or 3–5 groups;
   - published fees;
   - exam-format practice portal;
   - personal Writing/Speaking feedback.
6. **Practice portal block:** the existing concept preview, labelled as a concept until real screenshots arrive. Its CTA is Student Login if `portalUrl` is set, otherwise "Enquire about portal access".
7. **FAQ:** `content.ieltsPte.faqs`, plus FAQPage JSON-LD.
8. **Enquire Now form:** exam preset from the section the visitor came from.

**Split option:** create `/ielts-coaching-chennai` and `/pte-coaching-chennai` only once each has enough original content to stand alone (Requirements §6.3: no thin SEO pages). Start with one strong hub page.

#### Why Choose Us (`/why-choose-us`)
1. Intro: `content.whyChooseUs.title` and `intro`.
2. Reason cards (`content.whyChooseUs.points`, up to 8). The defaults use only facts the site already states: diagnosis first, small groups, both exams, published fees, portal, personal feedback.
3. Awards (verified and published only), with issuer and year.
4. Worldwide students, if verified. A simple country list; a map is optional later.
5. How you'll learn (shared with Home).
6. Testimonials (consented only).
7. CTA.

#### Contact (`/contact`)
No structural change. Add PTE to the enquiry types in `content/contact.ts` (`enquiryTypes`). The rest is filled in Settings.

#### Enquire Now (`/enquire-now`)
1. Short headline and reassurance ("We'll reply on WhatsApp…", using the client-confirmed response time).
2. **Form** (new `EnquireForm`):

   | Field | Required? |
   |---|---|
   | Name | Required |
   | WhatsApp number | Required |
   | Email | Optional |
   | City | Required |
   | Exam: IELTS Academic / IELTS General Training / PTE Academic / PTE Core / Not sure | Required |
   | Target score | Optional free text, validated loosely (IELTS bands and PTE scores use different scales) |
   | Preferred format: Group / 1-on-1 / Not sure | Optional |
   | Message | Optional |
   | Honeypot, source page, UTM fields | Hidden, same as today |

3. How you join (onboarding steps).
4. Contact alternatives (WhatsApp, phone) once supplied.
5. Mini FAQ.

**Back end:**
- New `src/lib/enquire/schema.ts` and `src/app/api/enquire/route.ts`.
- Mirror `api/leads/route.ts`: same rate limiter, honeypot, `deliverSubmission()` (email and/or webhook) and production "service unavailable" rule.
- Redirect to `/thank-you?type=enquiry`. Fire the analytics `generate_lead` / Meta Lead event once, consent-aware (existing `components/analytics.tsx`).

### 3.3 Settings schema changes

These go in `src/lib/settings/schema.ts` and are purely additive. `withDefaults()` in `store.ts` already fills missing keys with defaults, so the existing `site-settings.json` on the server needs **no migration**.

```ts
company.tagline: text(120)                 // "" → hero falls back to company.description
company.portalUrl: httpsUrl                 // "" → Student Login hidden

courses.pte: z.object({
  offered: z.boolean(),                     // false → every PTE block hidden
  products: z.array(z.enum(["academic", "core"])).max(2),
  summary: text(400),
  plans: z.array(ptePlanSchema).max(6),     // name, size, description, schedule, duration, fee
  feeNote: text(240),
})

results.awards: z.array(z.object({
  title: required(120, "Award"), issuer: required(120, "Issuer"), year: text(4),
  evidenceNote: text(200),                  // internal only: where the proof is kept; never rendered
  verified: z.boolean(), published: z.boolean(),
}).refine(a => !a.published || a.verified, { message: "Verify the award before publishing.", path: ["published"] }))
  .max(12)

results.countries: z.object({
  list: lines(100, 60), verified: z.boolean(), source: text(200), // source is internal only
})

content.home: z.object({
  heroLede: text(300),
  onboardingSteps: z.array(z.object({ title: required(60, "Step"), body: text(200) })).max(7),
  learningStyle: z.object({ title: text(120), body: text(600), points: lines(6, 120) }),
})
content.whyChooseUs: z.object({ title: required(120, "Heading"), intro: text(400),
  points: z.array(z.object({ title: required(80, "Title"), body: required(300, "Text") })).max(8) })
content.expertise: z.object({ title: required(120, "Heading"), intro: text(400),
  subjects: z.array(z.object({ name: required(60, "Subject"), body: text(300) })).max(10) })
content.ieltsPte: z.object({ title: required(120, "Heading"), intro: text(600),
  comparisonRows: z.array(z.object({ label: required(60, "Row"), ielts: required(160, "IELTS"), pte: required(160, "PTE") })).max(10),
  faqs: z.array(faqSchema).max(15) })
content.footer.pteDisclaimer: text(300)     // default: "PTE is a trademark of Pearson."
```

**Defaults** (`defaults.ts`):
- New copy fields get neutral defaults built only from facts the site already publishes.
- Tagline, awards, countries, PTE plans and portal URL default to **empty** or `offered: false`.

**Admin** (`admin/settings/sections.tsx`):
- New sections: Home page, Why Choose Us, Our Expertise, IELTS & PTE page, PTE packages, Awards, Students' countries.
- Add tagline and portal URL to Identity.

**Missing-items list** (`settings-editor.tsx → pendingItems`). Add:
- Tagline;
- PTE offering/fees (when `offered`);
- verified awards;
- verified countries;
- the learning-style copy;
- Chennai branch/address.

### 3.4 SEO plan (Chennai)

| Page | `<title>` (draft) | Primary keywords | Schema |
|---|---|---|---|
| `/` | Sky Voice Languages — IELTS & PTE Coaching in Chennai and Online | IELTS coaching Chennai, PTE coaching Chennai | `EducationalOrganization`. Add `LocalBusiness` if an address exists |
| `/ielts-pte-coaching-chennai` | IELTS & PTE Coaching in Chennai — Academic, General & PTE | IELTS coaching in Chennai, PTE coaching in Chennai, IELTS classes Chennai, PTE Academic coaching Chennai, online IELTS coaching Chennai, IELTS vs PTE | `Service` × 2 with `Offer` (fees), `FAQPage` |
| `/our-expertise` | IELTS & PTE Tutors — Our Expertise | IELTS trainers Chennai, PTE tutors | `Person` only for published trainers, using only supplied facts |
| `/why-choose-us` | Why Choose Sky Voice for IELTS & PTE | best IELTS coaching Chennai (in body copy only, never as a claim of being "best") | `WebPage` |
| `/enquire-now` | Enquire Now — IELTS & PTE Coaching | IELTS coaching enquiry, PTE classes enquiry | `ContactPage` |
| `/about`, `/contact` | Existing; add PTE wording | — | Existing |

- **Keyword placement:** title, H1, first paragraph, one or two H2s, FAQ questions and image alt text, where each reads naturally. No keyword stuffing, hidden text or doorway pages per area ("IELTS Anna Nagar", "IELTS T. Nagar") unless real branches exist there.
- **Local SEO depends on Q2.**
  - **If there is a Chennai centre:**
    - add the address to `contact.branches` (the map embed already works without an API key);
    - add `LocalBusiness` JSON-LD with that address;
    - link the Google Business Profile in `socialLinks` (`google` is already a supported platform).
  - **If Sky Voice is online-only:**
    - use wording such as "Online IELTS & PTE coaching for students in Chennai and worldwide";
    - **don't** add a LocalBusiness address, because a virtual or fake address breaks Google's guidelines.
- **Technical:**
  - add the new routes to `sitemap.ts`;
  - unique canonical on every page (`siteUrl()` helper);
  - extend the OG image to accept a per-page title;
  - keep `/thank-you` noindex.
- **Copy guardrails:**
  - no "best", "No. 1", "guaranteed band" or success-rate claims;
  - no "official" or "authorised" wording without proof (Q4).
- **Footer disclaimer.** Append to the existing IELTS disclaimer: "PTE is a trademark of Pearson. Sky Voice is an independent coaching provider."

### 3.5 Placeholder policy (missing inputs)

| Missing input | Behaviour on the live site | Shown in admin "missing items" |
|---|---|---|
| Tagline | Hero uses `company.description` | Yes |
| About / Why Choose Us copy | Neutral defaults built from facts already on the site. No lorem ipsum | — |
| Tutor photos/qualifications | Unpublished tutors hidden. "Profiles being added" note. In development only, initials avatar (already in `TrainerDirectory`) | Yes (existing) |
| Awards | Section hidden | Yes |
| Worldwide students | Tile hidden | Yes |
| Learning-style ("Gen Z") copy | Section hidden | Yes |
| PTE details | All PTE blocks hidden while `courses.pte.offered = false`. Fees show "Fee on request" | Yes |
| Contact details | Existing "being confirmed" notes | Yes (existing) |
| Chennai address | Online-only wording, no LocalBusiness schema | Yes |
| Portal URL | Student Login hidden. Portal CTA becomes "Enquire about portal access" | — |
| Portal screenshots | Existing concept preview, labelled as a concept | — |

**Development previews:**
- Add a `?preview=placeholders` flag, available only when `NODE_ENV !== "production"` or for a logged-in admin.
- It renders clearly marked dummy blocks (striped background, "PLACEHOLDER" label), so layouts can be reviewed before content arrives.
- Production visitors can never see it.

### 3.6 File-level change list

**New files**
```
src/app/(home)/page.tsx                       or replace src/app/page.tsx (remove redirect)
src/app/our-expertise/page.tsx
src/app/ielts-pte-coaching-chennai/page.tsx
src/app/why-choose-us/page.tsx
src/app/enquire-now/page.tsx
src/app/api/enquire/route.ts
src/components/enquire-form.tsx
src/components/sections/highlights-strip.tsx
src/components/sections/onboarding-steps.tsx
src/components/sections/learning-style.tsx
src/components/sections/awards-list.tsx
src/components/sections/course-cards.tsx       (IELTS + PTE packages; generalises the campaign fee cards)
src/components/sections/ielts-pte-comparison.tsx
src/lib/enquire/schema.ts (+ schema.test.ts)
src/lib/settings/trainers.ts                   (publishedTrainers, moved from about/page.tsx)
src/lib/seo/json-ld.ts                         (shared builders; LocalBusiness only with address)
```

**Changed files**
```
src/config/site.ts                     navigation, primary CTA
src/lib/settings/schema.ts             new fields (3.3)
src/lib/settings/defaults.ts           defaults for new fields
src/lib/settings/settings.test.ts      validation and back-fill tests
src/app/admin/settings/sections.tsx    new admin sections
src/app/admin/settings/settings-editor.tsx  pendingItems additions
src/components/site-header*.tsx        Enquire Now button, conditional Student Login
src/components/site-footer.tsx         new links, PTE disclaimer, portal link from settings
src/content/contact.ts                 PTE enquiry types
src/app/about/page.tsx                 use shared trainers helper; IELTS + PTE wording
src/app/sitemap.ts                     new routes
src/app/opengraph-image.tsx            per-page title support
src/app/thank-you/page.tsx             enquiry variant copy
```

**Unchanged:** `/free-ielts-assessment`, its lead form and `/api/leads`. Paid-ads tracking stays stable.

---

## 4. Testing and acceptance

**Automated** (existing toolchain: Vitest, Playwright, axe):
- **Unit:**
  - the new settings fields (awards can't be published unless verified; `withDefaults` back-fills an old settings file);
  - the enquire schema;
  - the JSON-LD builders (no LocalBusiness without an address).
- **E2E** (`pages.spec.ts`, `navigation.spec.ts`, `forms.spec.ts`):
  - every new route renders and has a single H1;
  - navigation links work on desktop and mobile;
  - the Enquire Now form handles validation, success, server error and retry;
  - with empty settings, no awards, countries, PTE or Student Login appear;
  - with seeded settings, they appear.
- **Accessibility:** axe scan on every new page, with no serious or critical issues.
- `pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm test:e2e` all pass.

**Manual:**
- 320 px with no horizontal scroll;
- reduced motion;
- keyboard-only enquiry flow;
- Lighthouse ≥ 90 on Home and IELTS & PTE;
- structured data validated in Google's Rich Results Test;
- a real test submission reaches the configured inbox or webhook.

**Content QA before launch:**
- no placeholder text public;
- every award, stat, country count and testimonial has its `verified`/`consent` flag set and evidence on file;
- fees match what the client approved;
- IELTS and PTE disclaimers present.

---

## 5. Delivery plan

| Step | Work | Done when | Size |
|---|---|---|---|
| **0. Decisions** | Answer Q1–Q5 (§6). Send Sky Voice the content checklist (§6.2) | Q1–Q3 answered | S |
| **1. Settings foundation** | Schema, defaults, admin sections, missing-items list, tests | Admin can enter all new content. The old settings file loads unchanged | M |
| **2. Shared sections** | Highlights strip, onboarding steps, learning style, awards, course cards, comparison table, trainers helper, JSON-LD builders | Components render correctly empty and filled (unit tests) | M |
| **3. Pages** | Home, Our Expertise, IELTS & PTE, Why Choose Us, Enquire Now (+ API), About/Contact wording updates | All pages pass E2E and axe with empty settings | M |
| **4. Navigation & SEO** | Header/footer/mobile nav, sitemap, metadata, OG titles, conditional LocalBusiness, PTE disclaimer | Sitemap, canonicals and Rich Results checks pass | S |
| **5. Content entry** | Sky Voice (or the team on their behalf) enters approved content in `/admin/settings`. No redeploy needed | Admin missing-items list is empty or every remaining item is accepted | S (client-driven) |
| **6. Launch** | Deploy using `WINDOWS_SERVER_DEPLOYMENT_GUIDE.md` (same NSSM service and IIS site). Back up `site-settings.json` first | Production smoke test and test enquiry received | S |

Steps 1–4 can be built and deployed **before** content arrives, because empty data hides cleanly. Step 5 can then go live gradually without code changes.

---

## 6. Inputs needed

### 6.1 Questions that change the build
1. **Q1 — Enquire Now:** "the main landing page" can mean several things. Which one?
   - **(a)** `/enquire-now` replaces `/free-ielts-assessment` as the destination for paid ads.
   - **(b)** Enquire Now is the main button on every page, and the free-assessment page stays for ads.
   - **(c)** The homepage `/` *is* the Enquire Now page.

   This plan assumes **(b)**. Also: should the free assessment offer extend to PTE?
2. **Q2 — Chennai:** does Sky Voice have a physical centre in Chennai that students can visit?
   - If yes, we need the exact address(es) and the Google Business Profile link.
   - If no, we use honest "online, for students in Chennai and worldwide" wording.
3. **Q3 — PTE and other courses:**
   - Which PTE products (Academic, Core)? What formats, fees and duration?
   - Do the same tutors teach both exams?
   - Do you offer anything beyond IELTS/PTE (e.g. Spoken English) that "Languages" should cover?
4. **Q4 — Affiliations and awards:**
   - Is Sky Voice an official partner, registered agent or test centre for IDP, British Council or Pearson?
   - For each award: name, issuer, year and proof.
5. **Q5 — "Gen Z learning":** what does it mean in your classes today? For example: short mobile sessions, gamified streaks, social-media-style content, live interactive classes.

### 6.2 Content checklist (needed for launch, not for the build)
- Approved tagline
- About copy (story, founding year, mission/vision confirmation)
- Why Choose Us points in your own words
- Tutor names, photos (square, ≥ 800 px), qualifications, years of experience, and proof of any quoted scores
- Award evidence (Q4)
- List or count of students' countries, and the source (e.g. enrolment records)
- Onboarding steps confirmed, plus a WhatsApp response time you can always meet
- Phone, WhatsApp, email, address(es), hours, social links
- PTE fees and packages
- Testimonials with written consent (optional for launch)
- Real portal screenshots and portal URL (when Project 2 starts)

---

## 7. Guardrails

- Never invent tutors, credentials, awards, student counts, countries, success rates, ratings, testimonials or affiliations. The schema's `verified`/`consent`/`published` flags enforce this.
- No "guaranteed band/score", "best" or "No. 1" claims.
- Show IELTS and PTE trademark disclaimers on every page (footer).
- All new copy is server-rendered and indexable. Client components only for forms, navigation and motion (Requirements §13.5).
- Leave the `/free-ielts-assessment` campaign page and its tracking unchanged.

---

## 8. Implementation status (20 Oct 2026)

Steps 1–4 of §5 are built:
- Settings schema and admin: new fields, plus a **Pages** tab.
- Shared sections.
- Five pages: Home, Our Expertise, IELTS & PTE, Why Choose Us, Enquire Now, with `POST /api/enquire`.
- Navigation, footer, sitemap and structured data.

This follows option (b) for Q1: Enquire Now is the main call to action, and `/free-ielts-assessment` is unchanged.

**Sample content mode (`SAMPLE_CONTENT=on`)** fills every still-empty field so the layouts can be reviewed before the client answers. The sample data lives in `apps/web/src/lib/settings/sample.ts`. In this mode:
- every page shows a "Sample content preview" banner;
- every page is marked noindex;
- anything saved in Website Settings replaces the sample value.

With the mode off, which is the default, missing items stay hidden or show "being confirmed" notes. Step 5 (content entry) is waiting on the answers to §6.
