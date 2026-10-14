# Sky Voice IELTS Website Development Requirements

**Document type:** Primary implementation specification for Claude AI or another development agent  
**Status:** Requirements and planning complete; implementation must not begin until launch-blocking content inputs are resolved or explicitly approved as temporary omissions  
**Prepared:** 13 October 2026  
**Current scope:** Public marketing website and IELTS assessment conversion funnel  
**Future scope:** Backend services, student portal, admin portal, and React Native/Expo mobile application

---

## 1. How to use this specification

This document is the implementation authority for the first website phase. It is based on a review of the supplied client campaign documents, VSL landing-page diagram, brand color specification, logo assets, and the provided Duolingo design-system reference.

Requirements are classified as:

- **Confirmed:** explicitly present in the supplied client materials or user brief.
- **Recommended:** implementation direction derived from the confirmed requirements and current project needs.
- **Open:** missing, conflicting, time-sensitive, or awaiting client approval. Open facts must not be invented.

When sources conflict, use this priority order:

1. A later written client decision.
2. `Sky_Voice_IELTS_VSL_Landing_Page_Diagram.pdf`, dated 10 October 2026, version 2 with client inputs applied.
3. `IELTS_Meta_Ads_Funnel.pdf`, dated 8 October 2026.
4. Recommendations in this specification.

The version 2 landing-page document supersedes the earlier Meta funnel where they differ. In particular, the current offer includes both small-group and 1-on-1 formats; do not implement the earlier 1-on-1-only positioning.

## 2. Source audit and current codebase state

### 2.1 Reviewed project materials

- Campaign strategy and copy: `document/IELTS_Meta_Ads_Funnel.pdf` and Markdown companion.
- Updated client-applied landing-page blueprint: `document/Sky_Voice_IELTS_VSL_Landing_Page_Diagram.pdf` and Markdown companion.
- Brand colors: `document/COLOR_CODES.md` and the visual color-code PDF in the logo package.
- Brand assets: 74 supplied files across AI, EPS, JPG, PDF, PNG, SVG, and WebP formats.
- Design inspiration: supplied Refero page describing Duolingo's design system.
- Local adaptation: `SKYVOICE_DESIGN_SYSTEM.md`.

### 2.2 Existing codebase finding

**Confirmed:** There is no existing application code. The workspace contains the client documents and brand assets only. There is no `package.json`, Next.js application, source directory, dependency configuration, test suite, or Git repository.

Implications:

- This is a greenfield implementation.
- No legacy technical constraints need to be preserved.
- Project initialization, version control, linting, test setup, and environment handling are part of development.
- Original documents and brand source files must remain unchanged.

## 3. Project overview

### 3.1 Business objective

Build a premium, modern, SEO-ready website that converts IELTS candidates into bookings for a free IELTS assessment. The website must establish Sky Voice as a personalized, outcome-focused online IELTS coaching provider and provide a stable foundation for future student, admin, backend, and mobile products.

### 3.2 Primary campaign promise

Candidates who are stuck at a Band 5 or 6 should be able to discover where they are losing marks, understand their weak modules, and receive a clear preparation roadmap rather than continuing random practice.

### 3.3 Primary conversion action

**Book Your Free IELTS Assessment**

The assessment flow is described as:

1. Visitor submits five lead fields.
2. Sky Voice contacts the lead on WhatsApp within two hours to schedule a slot.
3. Candidate attends a 45-minute online assessment covering all four modules.
4. Candidate receives a written roadmap and recommendation for group or 1-on-1 training.
5. Candidate may enroll in the suitable program.

The two-hour response promise is a client-supplied requirement but must be operationally reconfirmed before launch.

### 3.4 Secondary conversion actions

- Open a direct WhatsApp conversation.
- Call Sky Voice on mobile devices.
- Watch the VSL.
- Navigate to Method, Fees, Results, or FAQ before returning to the assessment action.

All page-level CTAs must reinforce the same free-assessment action. Avoid competing primary goals.

## 4. Business and campaign requirements

### 4.1 Differentiators

The website must communicate:

- Diagnostic assessment before prescribing study.
- A personalized roadmap based on current level, target band, weak modules, and exam date.
- Training across Listening, Reading, Writing, and Speaking.
- Choice of small group with 3-5 students or 1-on-1 training.
- Online delivery for Academic and General Training candidates.
- Personal feedback and evaluation against IELTS band descriptors.
- An exam-format practice portal with 80 practice sets.
- Tutor support associated with portal/course access.
- Transparent published fees.

### 4.2 Campaign funnel

The expected funnel is:

`Meta ad/search -> campaign landing page -> VSL/proof/method/fees -> assessment form or WhatsApp -> WATI follow-up -> free assessment -> enrollment -> verified result/testimonial -> retargeting`

The page must continue the promise made in the advertisement. Ad-specific query/UTM data should be retained through form submission and analytics so landing copy and campaign performance can be evaluated.

### 4.3 Marketing stages supported

- **Awareness:** explain why practice alone does not reveal score gaps.
- **Consideration:** demonstrate the six-step method, personal feedback, portal, and format options.
- **Conversion:** answer objections, publish fees, show verified proof, and make the free assessment easy to book.
- **Retargeting:** support audiences such as video viewers, page visitors, social engagers, leads not enrolled, WhatsApp inquiries, and counseled prospects who did not join.

## 5. Target audiences

### 5.1 Confirmed audiences

- Study-abroad applicants who need approximately Band 6.5-7 for an upcoming intake.
- Scholarship applicants whose score affects eligibility or funding.
- Working professionals who need evening/weekend flexibility and focused preparation.
- Retakers who received the same band more than once and do not know why.
- General Training candidates pursuing immigration or PR pathways.
- Nurses and healthcare professionals who need Academic IELTS and strong module-level scores.
- Candidates who are unsure whether Academic or General Training is appropriate.

### 5.2 Explicit non-fit statement

The VSL specification says the offer is not aimed at candidates already at 7.5+ who only want exam-day tips, or candidates seeking the lowest-cost 40-student lecture batch. Preserve this positioning in a tactful “Who this is for” section.

### 5.3 User needs

Visitors must be able to answer, quickly:

- Is this for Academic, General Training, or both?
- Can Sky Voice identify why my score is stuck?
- Is online coaching suitable for my schedule and speaking practice?
- What happens during the free assessment?
- Do I need group or 1-on-1 training?
- What is included?
- What does it cost?
- Who is the trainer?
- Are the results and reviews real?
- What happens after I submit the form?

## 6. Scope

### 6.1 Phase 1 required pages and system routes

| Route | Purpose | Indexing |
|---|---|---|
| `/free-ielts-assessment` | Primary campaign landing page and canonical paid-traffic destination | Indexable |
| `/thank-you` | Confirm submission, explain next steps, show approved follow-up video/WhatsApp fallback | `noindex` |
| `/privacy` | Explain personal-data and tracking practices | Indexable unless legal advice says otherwise |
| `/terms` | Website/course terms and IELTS trademark disclaimer | Indexable unless legal advice says otherwise |
| `/robots.txt` | Crawl directives | System |
| `/sitemap.xml` | Public indexable URLs | System |

### 6.2 Root URL decision

**Open:** The documents specify `skyvoice.in/free-ielts-assessment`, but they do not define a separate general homepage.

Recommended options, in order:

1. Build a distinct branded homepage only after the client supplies broader company content; keep the campaign page dedicated to conversion.
2. Until then, use a single permanent redirect from `/` to `/free-ielts-assessment`.

Do not publish identical content at both routes. If the same content must appear temporarily, use one canonical route and redirect the other to prevent duplication.

### 6.3 Future recommended content pages

Not required for the immediate campaign launch:

- `/ielts-academic`
- `/ielts-general-training`
- `/ielts-listening`
- `/ielts-reading`
- `/ielts-writing`
- `/ielts-speaking`
- `/results`
- `/about`
- `/contact`
- Educational resources/blog

Create these only when original, useful, client-approved content exists. Do not generate thin SEO pages.

### 6.4 Explicitly out of scope for Phase 1

- Student login and authenticated dashboard.
- Admin portal.
- Native mobile app.
- Full learning management system.
- Payment checkout.
- Exam booking.
- Automated band scoring.
- Tutor scheduling system beyond the confirmed WhatsApp follow-up flow.
- Custom backend beyond what is necessary to receive and route assessment leads safely.

## 7. Information architecture and navigation

### 7.1 Campaign-page navigation

Desktop navigation:

- Logo/home.
- Method.
- Modules.
- Portal.
- Fees.
- Results.
- FAQ.
- Primary CTA: Free Assessment.

These links should target semantic section anchors on the campaign page and update the URL without disrupting keyboard focus.

Mobile navigation:

- Compact horizontal logo.
- Accessible menu button.
- Drawer or sheet containing the same links.
- Persistent bottom conversion bar with Free Assessment, WhatsApp, and Call, only after phone/WhatsApp details are approved.

### 7.2 Page hierarchy

Use one H1 in the hero. Each major landing section uses H2, and card titles or nested groups use H3. Do not choose heading levels based on visual size.

## 8. Landing-page specification

### Section 1: Header and hero with VSL

**Purpose:** Continue the ad promise, name the pain, show the mechanism, and capture a lead above the fold.

Required content:

- Eyebrow: online IELTS coaching, Academic and General, 1-on-1 or small group.
- H1 based on: “Stuck at Band 5 or 6? Find Out Exactly What's Stopping Your IELTS Score.”
- Supporting statement explaining that coaching is built around current level, target band, weak modules, and exam date.
- Primary CTA: `Book Your Free IELTS Assessment`.
- Secondary CTA: `Prefer WhatsApp? Message us`.
- Promise summary: know current level, find weak areas, and get a preparation roadmap free whether or not the candidate joins.
- VSL area with trainer thumbnail/poster and a roughly three-minute video.
- Lead form visible beside the VSL on larger screens.
- Trust strip: 1-on-1 or group of 3-5, 80 practice sets, tutor support/access statement after clarification, Academic and General, fully online.
- Verified Google rating badge only when approved data is available.

Desktop layout: VSL and value proposition on the left, form card on the right, with the CTA still visible in the content column.

Mobile order: headline -> VSL -> primary action -> form -> condensed 2-by-2 trust strip.

Video behavior:

- Use a lightweight poster and reserve dimensions to avoid layout shift.
- Autoplay only if muted and allowed by browser policy.
- Provide visible controls, captions, and transcript.
- Sound must require user action.
- Do not preload the full video before it is needed.
- Track 25%, 50%, 75%, and 100% milestones only with consent where required.

### Section 2: Transformation

**Purpose:** Show the shift from uncertainty to a known improvement plan.

Headline direction: “From ‘I don't know why I'm losing marks’ to ‘I know exactly what to improve.’”

Required visual:

- Before score/problem.
- Personalized training period.
- After score/result.
- The exact weakness that was corrected.

Launch rule: show the neutral band/progress visualization only until a genuine student result, score report, quote, name, location, and permission are supplied. Do not publish placeholder identities or fabricated transformations.

### Section 3: Why the score is stuck

Explain that repeated mocks, videos, vocabulary lists, and daily practice reveal that marks are being lost but not necessarily where or why.

Required four-part explanation:

1. Where marks are being lost.
2. What the examiner expects.
3. How to correct each mistake.
4. How to apply the correction under exam pressure.

Optional visual: short looping clip of an annotated essay, provided it is real, readable, optimized, silent by default, and approved.

### Section 4: The Sky Voice method

This is a signature visual and must remain legible and memorable.

| Step | Label | Confirmed meaning |
|---:|---|---|
| 1 | Assess | Understand English level on a CEFR scale |
| 2 | Identify | Test Listening, Reading, Writing, and Speaking separately and find precise weaknesses |
| 3 | Plan | Create a written roadmap around target band, priorities, and exam date |
| 4 | Train | Live online training in 1-on-1 or groups of 3-5, focused on weak modules |
| 5 | Evaluate | Personal corrections against band descriptors |
| 6 | Improve | Repeat until practice scores reach target, then make the exam decision |

Steps 1-2 must be visually marked as the free starting stage. Desktop may use a horizontal path; mobile must use a vertical or horizontally scroll-safe path with visible labels and no hidden content.

### Section 5: Four modules and test types

Present Listening, Reading, Writing, and Speaking in a friendly, progress-led format using consistent icons and concise descriptions.

- Listening: question types, distractors, spelling/plural errors, and one-play accuracy.
- Reading: skimming/scanning, question-type strategies, T/F/NG logic, paragraph matching, and timing.
- Writing: Task 1 and Task 2 structure, coherence, grammar range, and line-by-line feedback.
- Speaking: fluency, fillers, Part 2 structure, Part 3 depth, pronunciation, recording, scoring, and replay.

Also distinguish:

- Academic: university admission and professional registration.
- General Training: work visa and immigration pathways.

Use a “Not sure?” prompt that explains the free assessment helps identify the appropriate test type.

### Section 6: Practice portal

Position the portal as a major differentiator.

Confirmed material includes:

- 80 practice sets.
- Four modules.
- Academic and General Training.
- Exam-like computer-delivered format.
- Question screen, timer, score breakdown, and tutor chat/support concepts.
- Course and revision use.
- Tutor-provided material/personal assessment for paper preference.

**Open conflict:** One part of the updated document says “3 months access,” while another says access runs for the course duration with a paid three-month extension. Resolve this before publishing any duration or extension pricing.

Portal screenshots have not been supplied. Do not invent a fake product interface and present it as real. A clearly labeled conceptual illustration may be used temporarily, but the launch target should use genuine approved screenshots.

### Section 7: Who this is for

Represent the six confirmed audience groups and the explicit non-fit statement. On desktop, use a compact grid or learning-path row; on mobile, use vertically stacked cards with clear, non-repetitive copy.

### Section 8: Formats and fees

Both formats must be visible simultaneously; do not hide them behind a toggle.

| Attribute | Group batch | 1-on-1 training |
|---|---|---|
| Class size | 3-5 students | One student, one tutor |
| Best for | 2-3 months to prepare; peer speaking practice | Candidate stuck in one module or with under six weeks to exam |
| Assessment and roadmap | Included | Included |
| Portal and tutor support | Included, final duration pending | Included, final duration pending |
| Writing and Speaking feedback | Included | Every session, per supplied diagram |
| Schedule | Fixed morning/evening/weekend batch | Flexible, agreed with tutor |
| IELTS Academic | INR 17,499 | INR 19,499 |
| IELTS General Training | INR 16,499 | INR 18,499 |

Add the approved “cost of retake” comparison only after reconfirming the stated INR 17,000 exam-attempt amount at launch. This value is time-sensitive.

EMI or installment availability is open and must not be displayed until confirmed.

### Section 9: Trainer authority

Required when data is supplied:

- Approved trainer portrait matching the VSL presenter.
- Full name.
- Qualifications.
- Years of IELTS teaching.
- Personal IELTS band, if verifiable and approved.
- Number of students taught, if verifiable and approved.
- Trainer statement about diagnosis and marking criteria.

Until this material is available, the section may be omitted or use a neutral “Meet your assessment team” treatment with no invented credentials.

### Section 10: Student results

Required target state:

- Real score-report cards.
- Before/after bands.
- The module or technique that was fixed.
- Student name/city only with consent.
- One short student video where available.
- Verified Google review/rating integration.

Launch rule: a verified live review source may ship before individual result tiles. Never publish fake score reports, placeholder reviews, or an unverified aggregate rating.

### Section 11: FAQ

Cover these confirmed objections:

- I am weak in English. Can I still improve?
- I do not have much time. Will this work?
- I already took IELTS and did not get my band. Can you help?
- Does online coaching work for Speaking?
- Should I choose group or 1-on-1?
- What does portal access include and how long does it last?
- What are the fees?
- Is the assessment really free?
- Does Sky Voice book the IELTS exam?
- Are installments available?

Answers must follow verified policies. If a policy remains open, omit the FAQ or state that the visitor should ask the assessment team; do not invent an answer.

### Section 12: Final CTA and lead form

Headline direction: “Don't Prepare Blindly. Know Where You Stand.”

Repeat the free-assessment value and three-step next-action explanation. The form should be reusable from the hero and final CTA, with a single validation schema and lead service.

### Section 13: Sticky mobile conversion bar

Required actions after contact data is confirmed:

- Free Assessment.
- WhatsApp.
- Call.

It must respect safe-area insets, not cover focused form fields, not trap keyboard users, and collapse or hide appropriately when the main form CTA is visible.

### Section 14: Footer

Include:

- Sky Voice identity and approved contact details.
- City/service-area statement.
- Phone/WhatsApp and email.
- Operating hours.
- Links to Method, Fees, Results, FAQ, Privacy, and Terms.
- Approved social and Google Business links.
- IELTS trademark/independence disclaimer.
- Results-vary statement.

## 9. Lead form and conversion behavior

### 9.1 Confirmed fields

1. Name.
2. WhatsApp number.
3. City.
4. IELTS type: Academic, General Training, Not sure.
5. Target band: 6.0, 6.5, 7.0, 7.5, 8.0+.

### 9.2 Recommended captured metadata

- E.164-normalized phone number and selected country code.
- Source page.
- Initial landing page.
- UTM source, medium, campaign, content, and term.
- Referrer.
- Timestamp in UTC.
- Consent state and policy version.
- Anonymous analytics/click identifiers only when lawfully available.

### 9.3 Validation and states

- Validate client-side for immediacy and server-side for trust.
- Preserve user entries on recoverable errors.
- Disable duplicate submissions while the request is pending.
- Provide visible loading, success, error, and retry states.
- Associate every error with its field and announce the summary accessibly.
- Add rate limiting, spam protection, and server-side sanitization without requiring a difficult CAPTCHA by default.
- Do not expose WATI or other service credentials in browser code.

### 9.4 Lead service architecture

Create a provider-neutral interface such as `submitAssessmentLead(payload)`. The UI must not know WATI-specific details. A server route or server action should validate the payload, call the configured provider, log a safe result, and return a normalized success/error response.

If WATI is unavailable, the team must define a safe fallback before launch. A prefilled WhatsApp deep link alone is not a durable lead store and should not silently replace a failed form submission.

### 9.5 Success handling

- Fire conversion events only after confirmed successful submission.
- Prevent repeat conversion firing on reload.
- Redirect to `/thank-you` or render an equivalent success state with a stable server-confirmed lead token.
- Explain the two-hour WhatsApp follow-up and 45-minute assessment, once approved operationally.
- Link an approved two-minute follow-up video if supplied.

## 10. Visual and interaction design

Use `SKYVOICE_DESIGN_SYSTEM.md` as the component and token authority.

### 10.1 Direction

The website should express “the Duolingo of IELTS” through general qualities:

- Approachable rounded typography.
- Progress-led storytelling.
- Tactile bordered controls.
- Friendly original illustrations.
- One obvious next action.
- Calm white space.
- Small moments of celebration and feedback.

It must not copy Duolingo's green palette, owl, proprietary fonts, illustrations, badges, page composition, or branded vocabulary.

### 10.2 Brand palette

Primary colors:

- White `#FFFFFF`.
- Blue `#1655D8`.
- Navy `#0E2D5E`.
- Orange `#EB9D13`.

Use these and their derived tints/shades for at least 70-80% of visible UI color. Orange backgrounds require navy text; white text on orange does not meet normal-text contrast.

### 10.3 Typography and icons

- Recommended font: Nunito Sans Variable via `next/font`.
- Use one family with multiple weights to reduce requests and maintain consistency.
- Use Lucide React for rounded outline icons.
- Do not mix icon libraries or use decorative icons where text is clearer.

### 10.4 Logo asset selection

- Header on light background: optimized/cropped derivative of `SKYVOICE H.svg`.
- Footer/dark background: optimized/cropped derivative of `SKYVOICE H W.svg`.
- Favicon/app/compact mark: optimized `SKYVOICE ICON.svg` and white variant.
- Square/social placement: vertical lockup as appropriate.

Supplied assets sit on large square artboards. Tighten the SVG view box for web derivatives without modifying originals. Do not use a 4500px raster in the navigation.

### 10.5 Gradients

The initial brief requests gradients, while the design reference favors flat surfaces. Use flat components and restrained decorative gradients only in the hero, final CTA, or ambient illustration backgrounds. Avoid glassmorphism and repetitive gradient cards.

## 11. Animation and transitions

### 11.1 Libraries

- Use CSS transitions for button, link, input, accordion, and simple card states.
- Use Motion for React for coordinated hero, progress-path, score, and scroll entrance sequences that cannot be expressed cleanly with CSS alone.
- Keep Motion usage inside small client-component islands; the page should remain server-rendered by default.

### 11.2 Motion rules

- Button press: 100-160ms.
- Standard hover/focus transition: 160-220ms.
- Section entrance: 350-550ms.
- Stagger related items by no more than 60ms.
- Prefer transform and opacity.
- Trigger scroll entrances once unless replay has a clear purpose.
- Avoid parallax, continuous decorative loops, and number-counting effects on low-power/mobile devices.
- Respect `prefers-reduced-motion` and present all content without dependency on animation.
- Do not animate layout in ways that increase CLS.

## 12. Responsive requirements

### 12.1 Target widths

Test at minimum:

- 320px and 360px mobile.
- 390px/430px modern phones.
- 768px tablet portrait.
- 1024px tablet landscape/small laptop.
- 1280px and 1440px desktop.
- 1920px large display.

### 12.2 Required behavior

- No horizontal page overflow at 320px.
- Text must not become smaller than defined accessible tokens.
- Primary buttons should be full width where helpful on mobile, not awkwardly narrow.
- CTA and input touch targets must be at least 44px.
- The hero must be intentionally reordered on mobile.
- Fee comparison must become readable labeled cards or a contained comparison, not a squeezed desktop table.
- The six-step method must be fully visible and navigable on touch devices.
- Sticky UI must not hide content, keyboards, errors, or browser controls.
- Large screens should gain whitespace, not overlong text lines or excessive multi-column density.

## 13. Technology stack and architecture

### 13.1 Required stack

- Next.js current stable release at implementation time.
- TypeScript in strict mode.
- App Router.
- React Server Components by default.
- pnpm workspace.
- Tailwind CSS for token-driven utility styling, with global CSS variables as the canonical design tokens.
- Motion for React for selected motion.
- Lucide React for icons.
- React Hook Form and Zod for complex form state and shared validation.
- Playwright for end-to-end testing.
- Vitest and React Testing Library for unit/component tests where valuable.
- `@axe-core/playwright` or equivalent automated accessibility checks.

Use current stable package versions at initialization; do not pin versions from this document without checking compatibility.

### 13.2 Repository layout

Because multiple applications are explicitly planned, start with a lightweight pnpm workspace but do not add a heavy build orchestrator until needed.

```text
apps/
  web/
    src/
      app/
      components/
        ui/
        layout/
        sections/
        forms/
      content/
      lib/
        analytics/
        leads/
        seo/
      config/
      types/
    public/
      brand/
      images/
packages/
  config/          # create only when more than one app needs it
  contracts/       # future shared API schemas
pnpm-workspace.yaml
```

Do not create empty mobile, portal, or API applications in Phase 1. Reserve the structure and add packages only when real shared code exists.

### 13.3 Suggested web route organization

```text
src/app/
  (marketing)/
    free-ielts-assessment/page.tsx
    privacy/page.tsx
    terms/page.tsx
  thank-you/page.tsx
  api/leads/route.ts          # only if not using a server action
  layout.tsx
  not-found.tsx
  error.tsx
  robots.ts
  sitemap.ts
```

### 13.4 Content architecture

- Store approved copy, fees, FAQ, contact details, and campaign settings in typed content/config modules rather than scattering literal strings across components.
- Include status fields such as `approved`, `draft`, or `hidden` for claims and proof content.
- Keep lead-provider and analytics integration behind adapters.
- Do not add a CMS for the first release unless the client confirms a real editorial workflow.

### 13.5 Client component policy

Use client components only for:

- Form state and validation interactions.
- Video controls/tracking.
- Mobile navigation.
- FAQ accordion if needed.
- Scroll-triggered animation.
- Analytics event dispatch.

Keep headings, copy, pricing, method, and other indexable content in server-rendered HTML.

## 14. SEO requirements

### 14.1 Metadata

- Unique title and description for every public page.
- Recommended campaign title direction: `Online IELTS Coaching & Free Assessment | Sky Voice`.
- Description should state personalized online IELTS coaching, Academic/General availability, and the free assessment without making score guarantees.
- Canonical URL for the campaign route.
- Open Graph and X/Twitter metadata with a branded 1200-by-630 image.
- Approved logo and business identity in organization metadata.

### 14.2 Technical SEO

- Use semantic server-rendered content.
- Generate `sitemap.ts` and `robots.ts`.
- Mark thank-you and any internal utility routes `noindex`.
- Do not expose admin/student routes to indexing in future phases.
- Maintain one canonical route per content set.
- Use descriptive anchors and meaningful internal links.
- Provide meaningful image alt text and explicit dimensions.
- Use `next/image` for responsive raster delivery; do not wrap SVG logos unnecessarily in raster optimization.
- Avoid rendering important marketing copy only after client-side JavaScript runs.

### 14.3 Structured data

Implement only structures supported by real visible content:

- `Organization` or appropriate educational organization identity.
- `Service` or `Course` for the coaching offer when provider and offer details are confirmed.
- `VideoObject` after the VSL title, description, thumbnail, duration, upload date, and URL are known.
- `FAQPage` only for visible, approved FAQ content and without promising search-result eligibility.
- Review/rating markup only when it is genuine, policy-compliant, and directly supported by visible data.

Validate with Schema.org/Google tools before launch. Do not create fabricated aggregate ratings.

### 14.4 Content SEO

- Target visitor intent rather than keyword repetition.
- Build content around the problem/solution journey: stuck band, diagnostic assessment, personalized IELTS coaching, module feedback, Academic vs General, and online preparation.
- Use descriptive section IDs and internal links.
- When future module pages are added, give each genuinely distinct content and cross-link them contextually.

## 15. Performance requirements

### 15.1 Core Web Vitals targets

On representative production traffic at the 75th percentile:

- LCP: 2.5 seconds or better.
- INP: 200 milliseconds or better.
- CLS: 0.10 or better.

### 15.2 Implementation constraints

- Reserve dimensions for video, logos, screenshots, review widgets, and illustration assets.
- Use a poster-first VSL strategy.
- Load third-party scripts after consent and/or interaction where possible.
- Keep the initial route primarily server-rendered.
- Avoid large animation runtimes and unnecessary component libraries.
- Self-host/subset fonts through Next.js font tooling and use only required weights.
- Use AVIF/WebP for photographic imagery and optimized SVG for illustration/logo work.
- Lazy-load below-the-fold media.
- Avoid autoplaying multiple media elements.
- Measure the production build with actual analytics/review widgets enabled.

Recommended Lighthouse acceptance target: 90+ in Performance, Accessibility, Best Practices, and SEO on representative mobile and desktop audits, while treating field Core Web Vitals as the stronger long-term measure.

## 16. Accessibility requirements

- Meet WCAG 2.2 AA.
- Correct landmarks: header, navigation, main, sections, and footer.
- Logical heading hierarchy with one H1.
- Full keyboard navigation, including mobile menu, VSL controls, FAQ, and form.
- Visible focus indication with sufficient contrast.
- Form labels, instructions, descriptions, required state, and errors must be programmatically associated.
- Error summary should receive focus after unsuccessful submission.
- Captions and transcript for all speech video.
- Alt text for meaningful images; empty alt for decorative illustrations.
- Do not encode module, state, score, or progress through color alone.
- Minimum touch target 44 by 44px.
- Support browser zoom to 200% and content reflow at 320 CSS pixels.
- Respect reduced-motion and reduced-data preferences where practical.
- Test with at least one screen reader on desktop and one on mobile before launch.

## 17. Privacy, security, and compliance

### 17.1 Personal data

The form collects identifiable data. Before launch:

- Publish an approved privacy policy.
- Define data controller/contact details.
- Define data retention and deletion rules.
- Identify all processors, including WATI, analytics, hosting, and spam-protection services.
- Capture consent where required and store the policy/version associated with submission.
- Do not collect more data than necessary.

### 17.2 Analytics and advertising consent

Meta Pixel, Google Analytics, Google Ads conversion tracking, and similar tools must follow the applicable consent/legal strategy. Geography is not sufficiently defined in the source materials, so the client must confirm target jurisdictions and obtain appropriate legal guidance.

### 17.3 Security

- Store secrets only in server-side environment variables.
- Validate and sanitize every server input.
- Rate-limit lead endpoints.
- Use CSRF-safe framework defaults and same-site cookies where applicable.
- Avoid logging full phone numbers or sensitive payloads.
- Prevent open redirects and untrusted URL injection.
- Add appropriate security headers and a content security policy compatible with required third parties.
- Return generic user-facing errors while retaining safe server diagnostics.

## 18. Analytics and event plan

Recommended normalized events:

- `landing_view`
- `primary_cta_click`
- `whatsapp_click`
- `call_click`
- `form_start`
- `form_validation_error`
- `lead_submit_attempt`
- `lead_submit_success`
- `lead_submit_failure`
- `vsl_start`
- `vsl_progress_25`
- `vsl_progress_50`
- `vsl_progress_75`
- `vsl_complete`
- `faq_open`
- `fee_view`

Event payloads should use controlled enums and campaign metadata, not free-form personal data. Never send names, phone numbers, or city values to analytics platforms.

Fire Meta Lead and Google conversion events only after successful lead acceptance, once per lead, and in accordance with consent requirements.

## 19. Future platform integration

### 19.1 Backend boundary

The website may initially use Next.js server functionality for lead submission, but business operations must sit behind typed service interfaces. Avoid importing provider SDK details into UI components.

### 19.2 Shared contracts

When a backend or mobile app is introduced, define shared schemas for:

- Users and roles.
- IELTS test type.
- Target and estimated bands.
- Listening/Reading/Writing/Speaking module states.
- Assessment bookings.
- Tutor feedback.
- Practice attempts and results.
- Course enrollment.
- Notifications.

Create `packages/contracts` only at that point. Do not prematurely share React web components with React Native; share tokens, types, validation, and domain logic instead.

### 19.3 Authentication and authorization

No authentication is required for the public site. Future planning must distinguish:

- Student role.
- Tutor role if introduced.
- Admin/support role.
- Fine-grained authorization for personal results, feedback, and business data.

Do not put protected portal content under client-only guards. Future authorization must be enforced server-side.

### 19.4 Mobile application

The future Expo app should reuse:

- Brand/design tokens.
- Domain models and validation.
- API contracts.
- Content taxonomy.
- Analytics naming.

It should not reuse browser-specific UI components directly.

## 20. Testing and quality assurance

### 20.1 Automated tests

- TypeScript strict check.
- ESLint and formatting checks.
- Unit tests for validation, content/config rules, analytics normalization, and lead adapter behavior.
- Component tests for form states, FAQ, navigation, and reduced-motion variants.
- Playwright tests for primary form flow, WhatsApp/call links, keyboard navigation, responsive navigation, thank-you routing, and duplicate conversion prevention.
- Automated axe scans on campaign, legal, thank-you, and error states.
- Structured-data validation in CI where practical.

### 20.2 Manual tests

- Current Chrome, Edge, Firefox, and Safari.
- iOS Safari and Android Chrome.
- Mobile, tablet, laptop, desktop, and large desktop widths.
- Keyboard-only journey.
- Screen-reader form and navigation pass.
- 200% zoom and text resizing.
- Slow network and JavaScript error scenarios.
- Reduced-motion preference.
- Video captions/transcript and no-autoplay-audio behavior.
- Form success, validation error, server failure, timeout, and retry.
- Real WATI sandbox or controlled test recipient.
- Analytics consent accepted/rejected states.

### 20.3 Content QA

- Fees match the approved source.
- Academic/General labels are consistent.
- No placeholder brackets remain.
- No fabricated rating, result, testimonial, trainer claim, or scarcity claim.
- Contact links use approved destinations.
- IELTS trademark disclaimer is present.
- Every image has approved usage rights and correct alt behavior.

## 21. Implementation priorities

### P0: Resolve launch inputs

- Contact details, city/service area, hours, social links.
- Trainer identity, qualifications, portrait, and VSL.
- Portal screenshots and exact access duration.
- Genuine results/reviews and consent.
- EMI/installation policy.
- WATI credentials, approved template, and failure process.
- Privacy/terms content and consent strategy.
- Root route decision.
- Current price and exam-retake comparison approval.

### P1: Foundation

- Initialize version control and pnpm workspace.
- Create Next.js app with strict TypeScript.
- Implement design tokens, font, layout, metadata baseline, and shared UI primitives.
- Optimize production logo derivatives.
- Add testing, linting, and CI scripts.

### P2: Campaign page

- Build semantic server-rendered sections.
- Implement responsive hero/VSL/form.
- Implement method, modules, portal, audience, fees, proof, FAQ, final CTA, mobile bar, and footer.
- Add motion with reduced-motion fallback.

### P3: Conversion and tracking

- Implement secure provider-neutral lead adapter.
- Connect WATI/test destination.
- Add thank-you flow.
- Add consent-aware analytics and conversion events.
- Preserve UTM attribution.

### P4: QA and optimization

- Complete automated and manual test matrix.
- Test production third parties.
- Resolve accessibility findings.
- Optimize Core Web Vitals.
- Validate metadata, robots, sitemap, canonical URLs, and structured data.
- Complete final client content/sign-off review.

## 22. Acceptance criteria

The Phase 1 website is acceptable only when all applicable criteria pass.

### Business and content

- [ ] The campaign page communicates the diagnostic free-assessment value within the first viewport.
- [ ] The primary CTA consistently reads `Book Your Free IELTS Assessment` or an approved equivalent.
- [ ] Both group and 1-on-1 formats are represented accurately.
- [ ] Academic and General Training are both represented.
- [ ] All four IELTS modules and all six method steps are present.
- [ ] Fees match approved values and remain visible without a toggle.
- [ ] No unapproved placeholders, fake proof, fabricated ratings, or unsupported guarantees are live.
- [ ] Portal-access duration and extension wording are client-approved.
- [ ] Contact and trainer details are verified.

### Design

- [ ] The visual system follows `SKYVOICE_DESIGN_SYSTEM.md`.
- [ ] Sky Voice's four brand colors or derived variants account for at least 70% of visible UI color.
- [ ] The experience is friendly, tactile, and progress-led without copying Duolingo's protected identity.
- [ ] Logo variants are appropriate to their backgrounds and use optimized, tightly cropped production files.
- [ ] Typography, spacing, radii, borders, and icon style are consistent throughout.
- [ ] Orange backgrounds use navy text; inaccessible brand-color combinations are absent.

### Conversion

- [ ] Both lead forms use the same schema and submission service.
- [ ] Five required fields validate on client and server.
- [ ] Pending, success, error, and retry states work.
- [ ] Duplicate submission/conversion events are prevented.
- [ ] UTM attribution is retained.
- [ ] WATI or the approved lead destination receives test submissions reliably.
- [ ] The thank-you experience accurately explains next steps.

### Responsive behavior

- [ ] No horizontal page overflow at 320px.
- [ ] The hero uses the required mobile order.
- [ ] Tables and progress visuals remain usable on touch devices.
- [ ] Primary targets meet the minimum 44px size.
- [ ] Sticky mobile actions do not obscure forms or content.
- [ ] Layout quality is intentional at mobile, tablet, laptop, desktop, and large-desktop widths.

### Accessibility

- [ ] Automated scans report no serious or critical violations.
- [ ] Full page and conversion flow are keyboard operable.
- [ ] Focus is visible and logically ordered.
- [ ] Form labels/errors are announced correctly.
- [ ] Video has captions and transcript.
- [ ] Reduced-motion mode presents all content cleanly.
- [ ] Manual screen-reader checks pass.
- [ ] WCAG 2.2 AA contrast is met.

### SEO and performance

- [ ] Unique metadata and canonical URLs are present.
- [ ] `robots.txt` and sitemap are correct.
- [ ] Thank-you/internal routes are not indexed.
- [ ] Structured data matches visible verified content and validates.
- [ ] Images/media have explicit dimensions and appropriate lazy/eager behavior.
- [ ] Production field targets are LCP <= 2.5s, INP <= 200ms, and CLS <= 0.10 at p75.
- [ ] Representative Lighthouse audits score at least 90 in the four core categories or have documented third-party limitations approved by the project owner.

### Engineering

- [ ] TypeScript strict, lint, tests, and production build pass.
- [ ] Server components are the default and client islands are limited to real interactivity.
- [ ] No secrets or personal data are exposed in browser bundles, analytics, or logs.
- [ ] Lead integration is isolated behind a typed adapter.
- [ ] Source documents and original brand assets remain unchanged.
- [ ] README documents setup, environment variables, scripts, deployment, integrations, and content-update locations.

## 23. Open client decisions and missing assets

Development may use clearly labeled non-production placeholders, but launch is blocked by unresolved items that affect truth, legality, or conversion:

1. Confirm company legal/display name and whether the public brand should read “Sky Voice,” “Sky Voice Languages,” or “Sky Voice IELTS.”
2. Confirm canonical domain and the role of `/` versus `/free-ielts-assessment`.
3. Supply approved phone, WhatsApp number, email, city/service area, operating hours, social links, and Google Business URL.
4. Supply trainer name, credentials, years of experience, personal band proof, student count proof, portrait, and VSL media.
5. Supply genuine student score reports, names/locations if displayed, testimonials, videos, and written usage consent.
6. Confirm current Google rating/review count and approved integration method.
7. Supply real portal screenshots and resolve course-duration versus three-month access wording.
8. Confirm whether a paid three-month portal extension exists and its price.
9. Confirm installment/EMI availability.
10. Reconfirm all course fees and the IELTS exam-attempt comparison before launch.
11. Confirm that a two-hour WhatsApp response can be met consistently.
12. Supply WATI credentials, template approvals, routing rules, and fallback process.
13. Approve privacy policy, terms, retention policy, cookie/analytics consent strategy, and target jurisdictions.
14. Supply VSL captions, transcript, poster, duration, and follow-up video.
15. Decide whether to commission an original Sky Voice guide/mascot or launch with waveform-led educational illustrations.
16. Supply the mentioned secondary design-system reference; only the Duolingo/Refero link was provided.

## 24. Non-negotiable implementation guardrails

- Do not invent client facts to fill missing sections.
- Do not treat draft copy, sample scores, or bracketed values as verified proof.
- Do not publish “Band 5 to Band 8” as a guaranteed or general outcome.
- Do not use false scarcity.
- Do not copy Duolingo's mascot, proprietary fonts, green palette, illustrations, exact pages, or branded product language.
- Do not create duplicate campaign content at multiple indexable URLs.
- Do not expose provider secrets in client code.
- Do not make the entire landing page a client component.
- Do not add a CMS, microservices, or empty future applications without a present requirement.
- Do not ship inaccessible orange/white or blue/navy text combinations.
- Do not allow animation or third-party scripts to compromise usability or Core Web Vitals.

---

## Final instruction to the implementing AI

Build the website from confirmed content and approved assets, using the recommended architecture where it does not conflict with a later client decision. Preserve every open item as an explicit content dependency; never hide uncertainty by inventing content. The result should feel like a friendly, motivating IELTS learning product with the clarity and engagement of a leading language-learning platform, but it must be unmistakably Sky Voice in color, identity, copy, and visual assets.

