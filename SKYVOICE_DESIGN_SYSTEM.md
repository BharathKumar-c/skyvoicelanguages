# Sky Voice IELTS Design System

**Status:** Proposed design direction for client review  
**Prepared:** 13 October 2026  
**Primary inspiration:** Duolingo's friendly, progress-led, storybook-like product language, as summarized by the supplied Refero style reference  
**Brand source of truth:** Sky Voice logo assets and the supplied Sky Voice color specification

## 1. Design intent

Sky Voice should feel like the approachable, motivating learning product for serious IELTS outcomes: friendly enough to reduce exam anxiety, structured enough to communicate credibility, and distinctive enough to be remembered.

The system borrows general interaction and composition principles from the reference, but it must remain an original Sky Voice identity. Do not copy Duolingo's owl, green palette, proprietary typefaces, illustrations, exact page compositions, trade dress, badges, or product terminology.

### Product personality

- Encouraging, not childish.
- Energetic, not noisy.
- Expert, not institutional.
- Clear, not simplistic.
- Progress-oriented, not pressure-driven.
- Friendly enough for first-time candidates and credible enough for working professionals, nurses, university applicants, and retakers.

### Core experience principles

1. **Show progress visually.** Every important flow should make the learner's current position, next step, and target visible.
2. **One primary action at a time.** Pages and states should make the next action unmistakable.
3. **Make difficult ideas feel manageable.** Break IELTS preparation into short steps, modules, and milestones.
4. **Use friendly physicality.** Controls should feel pressable through rounded forms, strong borders, and a restrained pressed-state depth.
5. **Keep the page calm.** White space, concise copy, and a limited palette should give illustrations and primary actions room to work.
6. **Protect trust.** Results, ratings, scarcity, trainer credentials, and outcome claims must be real, current, and approved.

## 2. Reference adaptation rules

| Reference characteristic | Sky Voice adaptation |
|---|---|
| Saturated green communicates progress | Sky Voice blue communicates progress and action; orange marks a milestone or high-priority action |
| Rounded display typography | Use an openly licensed rounded variable font with heavier display weights |
| White storybook canvas | Use white as the dominant canvas, with very light brand-derived blue/navy tints for section rhythm |
| Thick sticker-like controls | Use 2px borders, 14-16px radii, and a 3-4px lower edge on primary interactive controls |
| Mascot-led illustration | Develop an original Sky Voice guide derived from the brand's speech-wave and star motifs, or use original rounded educational illustrations |
| Flat UI rather than glass effects | Keep controls and cards primarily flat; reserve restrained gradients for decorative brand moments only |
| Friendly learning progress | Express the six-step Sky Voice method and four IELTS modules as a clear path with visible completion states |

## 3. Brand color system

The supplied colors must account for approximately 70-80% of the visible interface. Tints and shades may be derived from them. Unrelated colors are permitted only for essential semantic states such as destructive errors or verified success feedback.

### Core tokens

| Token | Value | Primary role |
|---|---:|---|
| `brand.navy` | `#0E2D5E` | Primary text, dark sections, borders, footer, trust and expertise |
| `brand.blue` | `#1655D8` | Primary interaction, progress, links, active states |
| `brand.orange` | `#EB9D13` | Milestones, high-priority emphasis, selected accents |
| `brand.white` | `#FFFFFF` | Main canvas, card surfaces, reversed text |

### Derived interface tokens

| Token | Suggested value | Role |
|---|---:|---|
| `surface.canvas` | `#FFFFFF` | Default page background |
| `surface.blue-soft` | `#EDF3FF` | Alternate section and selected-state background |
| `surface.navy-soft` | `#EEF2F7` | Neutral card or explanatory surface |
| `surface.orange-soft` | `#FFF6E5` | Milestone, fee comparison, or important note |
| `text.primary` | `#0E2D5E` | Headings and primary body text |
| `text.secondary` | `#52657A` | Supporting copy |
| `text.on-dark` | `#FFFFFF` | Text on navy or blue surfaces |
| `border.default` | `#D7E1EF` | Default card and input border |
| `border.strong` | `#0E2D5E` | Emphasized control and sticker border |
| `action.primary` | `#1655D8` | Primary CTA background |
| `action.primary-edge` | `#0E3EA8` | Lower edge / pressed depth |
| `action.accent` | `#EB9D13` | Optional milestone CTA background |
| `action.accent-text` | `#0E2D5E` | Required text color on orange |
| `focus.ring` | `#EB9D13` | High-visibility keyboard focus ring |

### Contrast rules

Measured contrast ratios for the supplied brand colors:

| Foreground / background | Ratio | Rule |
|---|---:|---|
| Navy on white | 13.50:1 | Approved for all text sizes |
| Blue on white | 6.32:1 | Approved for all text sizes |
| White on navy | 13.50:1 | Approved for all text sizes |
| White on blue | 6.32:1 | Approved for all text sizes |
| Navy on orange | 6.02:1 | Approved for all text sizes |
| White on orange | 2.24:1 | Do not use for normal text |
| Blue on navy | 2.14:1 | Do not use for text or meaningful icons |
| Blue on orange | 2.82:1 | Do not use for text or meaningful icons |

Orange buttons must use navy text. Orange must not be used for small text on white. Focus and status styling must never depend on color alone.

### Gradient policy

The earlier brief requests gradients; the new reference favors flat, sticker-like surfaces. Reconcile them as follows:

- Keep buttons, inputs, cards, and most learning controls flat.
- Permit a subtle navy-to-blue gradient in the hero, final CTA, or large decorative background.
- Permit small blue-to-orange ambient glows at 8-12% opacity behind illustrations.
- Never use gradients behind dense copy, inside input fields, or on every card.
- A gradient may not reduce text contrast or become the only distinction between states.

## 4. Typography

### Recommended family

Use **Nunito Sans Variable** through `next/font` as the initial system font. It is open, rounded, highly legible, and supports both friendly display weights and practical interface copy without requiring two font families.

Fallback: `ui-rounded`, `Inter`, `system-ui`, `sans-serif`.

Do not use or redistribute Duolingo's proprietary Feather or Din-style brand fonts.

### Weight roles

- 900: hero display and major campaign statements.
- 800: section headings, key score/progress numbers.
- 700: buttons, navigation, card titles, form labels.
- 600: emphasized body copy and data labels.
- 400-500: paragraphs, descriptions, helper text.

### Fluid type scale

| Role | Mobile | Desktop | Line height | Notes |
|---|---:|---:|---:|---|
| Display | 40px | 68px | 1.02-1.08 | Use only for the hero or one major statement |
| H1 | 36px | 60px | 1.05-1.12 | Maximum comfortable line length: 14-18 words |
| H2 | 30px | 48px | 1.10-1.18 | Major section title |
| H3 | 23px | 30px | 1.20 | Card group or subsection |
| Body large | 18px | 20px | 1.55 | Lead text and important explanations |
| Body | 16px | 18px | 1.55-1.65 | Default reading text |
| Label | 14px | 15px | 1.30 | Inputs and metadata; never below 14px |
| Caption | 13px | 14px | 1.40 | Legal or secondary support only |

Use modest negative tracking only on large display text. Uppercase is limited to short eyebrow labels and compact navigation labels; never uppercase paragraphs.

## 5. Spacing, grid, and shape

### Spacing scale

Use a 4px base: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120`.

### Layout

- Maximum marketing content width: 1200px.
- Maximum reading width: 680px.
- Desktop page gutters: 32-48px.
- Tablet page gutters: 24-32px.
- Mobile page gutters: 16-20px.
- Landing-page section spacing: 72-120px desktop, 56-80px tablet, 48-64px mobile.
- Minimum touch target: 44 by 44px; preferred primary CTA height: 52-56px.

### Radius and borders

| Component | Radius | Border |
|---|---:|---:|
| Primary/secondary button | 14px | 2px plus 3-4px lower edge where appropriate |
| Input/select | 14px | 2px |
| Standard card | 20px | 2px |
| Feature/illustration panel | 28px | 2px or no border |
| Pill/tag | 999px | 1-2px |
| Modal/drawer | 24px | 1-2px |

Avoid sharp corners. Avoid excessive shadows. If elevation is necessary, use a small navy-tinted shadow with low opacity and no blur-heavy glass effect.

## 6. Core components

### Buttons

**Primary**

- Blue fill, white text, darker blue lower edge.
- Bold label, sentence case or short title case.
- Default height 52px; 56px for hero CTA.
- Hover: translate upward 1px and strengthen lower edge.
- Active: translate downward 2-3px and reduce lower edge.
- Focus-visible: 3px orange ring with 2px white offset.
- Disabled: no depth, reduced contrast, `not-allowed` cursor.

**Milestone / accent**

- Orange fill with navy text and a darker orange edge.
- Use sparingly for one emphasized action, fee milestone, or completion state.

**Secondary**

- White or transparent fill, 2px blue or navy border, matching text.
- Equal height and radius to the primary button.

**Text link**

- Blue text, underline on hover/focus, minimum 44px interaction area when used as a standalone action.

### Inputs and forms

- Visible label above every input; placeholders never replace labels.
- 52px minimum field height.
- Navy text, white background, 2px default border.
- Blue focus border plus orange focus ring.
- Errors appear beneath the field in text and icon form; do not rely on red alone.
- Phone input must support country code and normalize to E.164.
- Select controls must retain native keyboard behavior or implement it accessibly.
- Submission state must prevent accidental duplicates and retain entered values on recoverable failure.

### Cards

- Use cards only when content is meaningfully grouped; do not turn every section into a grid.
- Standard cards use white or a light brand tint, 2px border, 20px radius, and 20-28px padding.
- Interactive cards receive clear hover, focus, selected, complete, and locked states.
- Feature sections should often use one illustration plus one text block instead of six equal cards.

### Progress components

- Progress bar: blue track/fill, rounded ends, explicit numeric or text label.
- Step path: use the six Sky Voice method steps—Assess, Identify, Plan, Train, Evaluate, Improve.
- The current step must be identified in text, not color alone.
- Completion may use a check icon and a brand-derived filled state.
- Locked content must explain what unlocks it.

### Navigation

- Marketing desktop header: horizontal logo, Method, Modules, Portal, Fees, Results, FAQ, and a primary assessment CTA.
- Mobile header: logo, accessible menu button, concise drawer, and persistent bottom conversion bar where approved.
- Future learner product: separate app shell with Today, Learn, Practice, Progress, and Profile; do not force marketing navigation into the learning app.

### Icons

Use one consistent rounded outline library such as Lucide React. Default stroke width: 2-2.25px. Use filled icons only for selected or completed states. Do not mix icon libraries or use emoji as production interface icons.

## 7. Illustration and imagery

### Original visual language

- Rounded, flat 2D illustrations with confident navy outlines.
- Core fills come from Sky Voice blue, navy, orange, white, and their tints.
- Use IELTS-specific scenes: listening with headphones, reading passages, marked essays, speaking practice, band-score progress, working professionals, nurses, and study-abroad preparation.
- Illustrations should float on open backgrounds or simple soft-tint shapes; avoid stock-photo collage layouts.
- If a guide character is created, derive it from the Sky Voice waveform and star identity. It must not resemble an owl or any recognizable Duolingo character.
- Photography is reserved for verified trainer portraits, real student media, and portal/product screenshots.

### Logo usage

| Context | Preferred source asset |
|---|---|
| Light header | `SKYVOICE H.svg` |
| Navy/dark header or footer | `SKYVOICE H W.svg` |
| Favicon, app icon, compact mobile mark | `SKYVOICE ICON.svg` / white counterpart |
| Square social or onboarding placement | `SKYVOICE V.svg` / white full-lockup counterpart |
| Text-only treatment | Wordmark variants, only when the icon is already present nearby |

The supplied SVG and raster files use large square artboards. Create web-production derivatives with tightly cropped view boxes and optimized paths. Preserve the original assets unchanged. Prefer SVG for interface use; use WebP/PNG only when SVG is unsuitable.

Minimum requirements:

- Maintain aspect ratio and exclusion space.
- Never recolor individual logo parts outside approved source variants.
- Do not place the standard navy wordmark on a dark background.
- Provide an accessible text alternative such as `Sky Voice Languages`.

## 8. Learning-product patterns for future phases

These patterns establish a consistent future path without putting student-portal work into the current website scope.

### IELTS journey map

- Four main skill territories: Listening, Reading, Writing, Speaking.
- Each territory contains short lessons, practice sets, feedback tasks, mock checkpoints, and a mastery review.
- The learner always sees target band, current estimated band, focus area, and next recommended action.
- Academic and General Training share the shell but branch where tasks differ.

### Dashboard primitives

- Daily focus card.
- Target-band progress ring.
- Weekly practice streak.
- Four-module skill summary.
- Tutor feedback inbox.
- Upcoming assessment or session.
- Continue-learning CTA.

### Motivation without manipulation

- Celebrate completed practice and measurable improvement.
- Do not use false scarcity, shame, aggressive streak-loss language, or misleading guarantees.
- Reward consistency, feedback completion, and skill mastery—not merely time spent in the app.
- Avoid implying that a game score is an official IELTS band score.

## 9. Motion

- Use CSS transitions for simple hover, press, focus, and reveal states.
- Use Motion for React only for coordinated section entrances, progress transitions, and a small number of hero/learning-path moments.
- Button press: 100-160ms.
- Hover/focus transition: 160-220ms.
- Section entrance: 350-550ms with no more than 60ms stagger between related items.
- Use transforms and opacity; avoid animating layout-heavy properties.
- Respect `prefers-reduced-motion`; reduce or remove parallax, autoplay movement, counters, and large transforms.
- Mobile interactions must not depend on hover.

## 10. Content voice

### Voice attributes

- Plain English.
- Short sentences.
- Active voice.
- Specific, supportive guidance.
- Outcome-aware without guarantees.

### Preferred patterns

- “Know where you stand.”
- “Find the exact skills holding back your score.”
- “Your next IELTS step, made clear.”
- “Practise with a plan.”
- “Get feedback. Fix the gap. Try again.”

### Avoid

- “Guaranteed Band 8.”
- Artificial urgency or unverified limited-slot claims.
- Childish copy for adult professionals.
- Dense academic jargon.
- Claims that a practice estimate is an official exam result.

## 11. Responsive behavior

- **Mobile first:** 320-767px. One clear column, full-width primary CTA, 16-20px gutters, concise sticky conversion bar.
- **Tablet:** 768-1023px. One or two columns based on content; forms remain comfortably wide; no compressed desktop grids.
- **Desktop:** 1024-1439px. Alternating text/illustration sections, maximum 1200px content width.
- **Large desktop:** 1440px and above. Increase outer whitespace, not content density or paragraph width.

No content may require horizontal scrolling at 320px. Illustration order may change to keep headline, explanation, and action together. Tables must become cards or horizontally contained, labeled comparisons on small screens.

## 12. Accessibility baseline

- Conform to WCAG 2.2 AA.
- Fully operable by keyboard.
- Visible focus styles on every interactive control.
- Correct landmarks and semantic heading order.
- One page-level H1.
- Programmatic labels, descriptions, and errors for every form field.
- Alt text for meaningful images; decorative art uses empty alt text.
- Captions and transcript for the VSL and all instructional video.
- No essential information conveyed only by color, animation, position, or sound.
- Minimum 44px touch targets.
- Test at 200% browser zoom and with reflow at 320 CSS pixels.

## 13. Design-system acceptance criteria

- The interface is recognizably Sky Voice without relying on Duolingo green, mascots, names, or proprietary assets.
- Brand navy, blue, orange, and white account for at least 70% of visible UI color usage.
- The design feels friendly and progress-led while remaining credible for adult IELTS candidates.
- Core components have documented default, hover, focus, active, disabled, error, selected, and loading states.
- All approved text/background combinations meet WCAG 2.2 AA contrast.
- The mobile layout is intentionally composed, not a compressed desktop layout.
- Reduced-motion behavior is defined and tested.
- The same tokens can support the public website now and a learner portal/mobile app later.
- No proprietary or confusingly similar Duolingo assets are included.

## 14. Open design inputs

- A second design-system reference was mentioned but not included; incorporate it only after the client supplies the link.
- Decide whether to commission an original Sky Voice guide/mascot or launch with abstract waveform-led illustrations.
- Approve the proposed font after testing actual IELTS content and Indian/international names.
- Approve the degree of button depth; the preferred direction is tactile but not cartoonish.
- Confirm whether dark mode is required. It is not recommended for the first marketing release unless the client explicitly requests it.

