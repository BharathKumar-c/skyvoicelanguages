# Sky Voice — Visual Assets Integration Guide

**Prepared:** 15 October 2026
**Scope:** Codebase analysis, visual asset plan, generated asset pack, and exact integration instructions for the next coding AI.
**Status of the application code:** **Integrated (15 Oct 2026).** All P1/P2 items and the P3 motion items (§14.5, §14.7–§14.10) are live. P3 OG image and `AiraSprite` optimisation remain open.

> **Deviations from this guide made during integration (code is the source of truth):**
> - Animated SVGs ship through a shared `apps/web/src/components/animated-art.tsx` (`<picture>` + reduced-motion `<source>`). `aria-hidden` sits on the `<img>`, because jsx-a11y forbids it on `<picture>`.
> - Aira and her shadow are wrapped in `.aira-figure`, so they scale together. The floor ellipse was removed from the orbit-stage SVG; the shadow is the separate breathing asset.
> - The hero field's waveform (which collided with `.trust-strip`) and the modules field's eyebrow spark and lower pulse were removed in the generator.
> - Line draws use `apps/web/src/components/draw-line.tsx`, which observes the **parent**. A fully clip-path-ed element never reports as intersecting, so `whileInView` on the line itself never fired.
> - Card hover lifts use the CSS `translate` property. `Reveal` (Motion) writes an inline `transform` that silently overrode the existing `.gap-card` and `.audience-card` hover transforms.
> - All integration CSS is one block at the end of `apps/web/src/app/globals.css` ("GENERATED VISUAL ASSETS — integration").
>
> **Landing page upgrade (later pass):**
> - **Service video:** `#video` section directly below the hero, using `apps/web/src/components/service-video.tsx`. The source is configured in `apps/web/src/config/media.ts` through `NEXT_PUBLIC_SERVICE_VIDEO_SRC` (plus optional `_TYPE` and `_CAPTIONS`), documented in `.env.example`. The poster `public/assets/generated/images/service-video-poster.webp` is rendered from `design/visual-assets/poster/`. Until a source is set, the play control opens the written assessment overview. `components/vsl-preview.tsx` was removed, and `motion-graphics/vsl-signal-backdrop*.svg` is now unused.
> - **Hero layout:** the hero now fits the first viewport on desktop and laptop. It uses `min-height: calc(100dvh - var(--header-h))` with `clamp()` and `vh`-aware type, and a scaled Aira column (`--aira-scale-w/-h`). `.hero-right` holds a compact `ServiceVideo` (`variant="compact"`, config `heroVideo` / `NEXT_PUBLIC_HERO_VIDEO_SRC`) above a CSS-compacted `LeadForm`. `--shell` is now 1360px with a `clamp(24px, 2.6vw, 40px)` gutter.
> - **Interactive waves:** `apps/web/src/components/interactive-waves.tsx` (Canvas 2D), mounted only in the landing hero and final CTA. The final-CTA SVG no longer carries static sine lines.

---

## 1. Project Overview

Sky Voice Languages is a single-campaign marketing site for online IELTS coaching. Its job is to get a visitor to book a **free IELTS assessment** through a lead form. The site is a pnpm monorepo with one Next.js app in `apps/web/`.

| Route | Source file | Purpose |
|---|---|---|
| `/` | `apps/web/src/app/page.tsx` | `redirect("/free-ielts-assessment")` only |
| `/free-ielts-assessment` | `apps/web/src/app/free-ielts-assessment/page.tsx` | The landing page (all marketing sections) |
| `/thank-you` | `apps/web/src/app/thank-you/page.tsx` | Post-submission confirmation (noindex) |
| `/privacy`, `/terms` | `apps/web/src/app/privacy/page.tsx`, `apps/web/src/app/terms/page.tsx` | Legal text pages |
| 404 | `apps/web/src/app/not-found.tsx` | Not-found utility page |
| Error boundary | `apps/web/src/app/error.tsx` | Client error utility page |
| `/mascot-demo` | `apps/web/src/app/mascot-demo/page.tsx` | Internal mascot QA page (**publicly reachable**; see §4.4) |
| `/api/leads` | `apps/web/src/app/api/leads/route.ts` | Lead webhook proxy. **Do not touch.** |
| OG image | `apps/web/src/app/opengraph-image.tsx` | `next/og` `ImageResponse` (1200×630) |

The visual identity comes from `SKYVOICE_DESIGN_SYSTEM.md`, the mascot style bible `design/mascot/style-bible.md`, and the design-loop log `design-loop-progress.md`.

---

## 2. Codebase Analysis Summary

**What is already strong (preserve it):**
- A tight token system in `apps/web/src/app/globals.css` (lines 4–30), used consistently.
- An original, fully validated mascot, **Aira** (8 canonical poses, transparent PNG, 384×456), plus 12 validated **Skill Signal** icons (4 modules × 3 states, 420×420). See `design-loop-progress.md` (Pieces 1–2 are marked PASS/PASS/PASS).
- `Reveal` (`apps/web/src/components/reveal.tsx`): one shared Motion scroll-reveal that already respects reduced motion.
- Accessible patterns: skip link, a dialog with focus return (`vsl-preview.tsx`), labelled forms, `aria-hidden` decorative art, and an axe e2e test.
- Honest content rules: no fabricated testimonials or claims. **Generated art must not imply real results.** The new illustrations deliberately contain no numbers or text.

**Where visuals are weakest (highest impact for new assets):**

| Area | Observation (verified via full-page screenshots at 1440 px and 390 px) |
|---|---|
| Hero (`.hero`) | The background is two blurred blobs plus a dot grid (`.hero-ambient-*`, `.hero::before`). It is generic. Aira's stage is only a radial gradient (`.hero-aira-stage::before`). |
| Modules (`.modules-section`) | A flat navy-deep slab with one radial glow. Aira in `.module-tableau-aira` is **clipped at the bottom** (`height: 350px; overflow: hidden`). |
| Proof (`.proof-visual`) | A plain dashed circle and a pale ring. It is the emptiest visual on the page. |
| VSL card (`.vsl-card`) | Static CSS orbits. The card is the main video affordance but has no motion cue. |
| Final CTA (`.final-cta`) | Gradient plus dot grid plus two hairline circles. The atmosphere is flat. |
| Section transitions | Every section boundary is a hard horizontal edge. The jump from white to `--brand-navy-deep` at Modules is abrupt. |
| Thank-you | Aira celebrates with no celebratory moment around her. |
| 404 / Error | Text only (error uses a generic `AlertTriangle` badge). No brand illustration. |
| Footer logo | `BrandLogo variant="white"` renders a visible **`#0e2d5e` box** on the `#071d3f` footer. The source SVG `apps/web/public/brand/skyvoice-horizontal-white.svg` has a full-artboard navy `<rect>`. |

---

## 3. Existing Technology Stack

Versions below are the **installed** versions (resolved from `node_modules`), not the `latest` ranges in `apps/web/package.json`.

| Concern | Technology | Installed version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.4.0 | `apps/web/AGENTS.md` warns that this Next differs from training data. Read `node_modules/next/dist/docs/` before using new APIs. |
| UI | React / React DOM | 19.3.0 | Server components by default; `"use client"` where needed |
| Language | TypeScript | ^6.0.2 | `pnpm typecheck` |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss` | 4.3.3 | **Almost all styling is hand-written global CSS** in `apps/web/src/app/globals.css` (3,413 lines) plus one CSS module (`aira-mascot.module.css`). Utility classes are barely used. **Follow the global-CSS convention.** |
| Animation | `motion` (Motion for React; import from `"motion/react"`) | 14.2.0 | Used in `reveal.tsx` and `aira-mascot.tsx`. **This is the only animation library. Do not add GSAP, Lottie or Framer as a separate package.** |
| Icons | `lucide-react` | 1.57.0 | The design system mandates a single icon library |
| Forms | react-hook-form + zod + @hookform/resolvers | — | `lead-form.tsx`, `lib/leads/schema.ts` |
| Fonts | `next/font/google` Nunito Sans → `--font-nunito` | — | `layout.tsx` |
| Images | `next/image` | — | `AiraSprite` uses `unoptimized`; `SkillSignal` is optimized |
| Tests | Vitest + Testing Library; Playwright + @axe-core/playwright | Playwright 1.64.0 | `apps/web/tests/e2e/landing.spec.ts`: 5 tests, including an axe scan and **mobile no-overflow** |
| Not present | GSAP, Lottie runtime, Three.js/WebGL, canvas libs | — | Not needed. See §18. |

---

## 4. Existing Design System

### 4.1 Tokens (source of truth: `globals.css` `:root`)
`--brand-navy #0e2d5e`, `--brand-navy-deep #071d3f`, `--brand-blue #1655d8`, `--brand-blue-dark #0f3ea8`, `--brand-blue-light #edf3ff`, `--brand-orange #eb9d13`, `--brand-orange-dark #b87305`, `--brand-orange-light #fff6e5`, `--surface-soft #f6f9ff`, `--border #d7e1ef`, `--text-muted #52657a`, `--success #147a52`. Radii are 12/16/22/30. Shadows are navy-tinted.
Mascot-only palette (`AIRA_PALETTE` in `components/mascot/types.ts`) adds **cream `#FFF4D6`**.

**Contrast rules that constrain assets:** never put white text on orange, never use blue on navy for meaning, and orange is never small text on white.

### 4.2 Visual direction
The direction is a flat, sticker-like, rounded "storybook" look (inspired by Duolingo's system discipline, **never** its owl, green or shapes). The recurring brand motifs, all derived from the logo, are:
1. **Broken orbit**: arc segments with open gaps (blue / navy / one orange segment).
2. **Four-point spark**: orange, outside the orbit, upper-right.
3. **Speech-signal pulse**: a flat line with one tall peak and a deep valley (the logo's waveform).

All generated assets use only these three motifs plus the palette above.

### 4.3 Mascot system (`apps/web/src/components/mascot/`)
| File | Role |
|---|---|
| `index.ts` | Public API: `AiraMascot`, `AiraSprite`, `AiraContext`, `AiraModule`, `SkillSignal`, `useAiraAnimation`, types, `AIRA_PALETTE`, `resolveSize` |
| `aira-mascot.tsx` | Motion wrapper: idle `float` (y 0→-5→0, 2.6 s) / `breathe` (scale 1→1.015, 3.2 s), pose cross-fade, "spark pulse" overlay |
| `aira-sprite.tsx` | Renders `/mascot/canonical/aira-<pose>.png` via `next/image` (`unoptimized`) |
| `aira-context.tsx` | Presets: `hero`, `hero-speaking`, `method`, `listening`, `speaking`, `reading`, `writing`, `feedback`, `celebration`, `thank-you`, `loading`, `nav-accent` |
| `skill-signal.tsx` | `/mascot/skill-signals/<module>-<state>.png` via `next/image` |
| `use-aira-animation.ts` | Pose state machine (celebrate, thinking, answer reaction) |
| `aira-mascot.module.css` | Root/pose layer styles and CSS keyframe fallbacks |

**Size presets:** xs 48, sm 96, md 160, lg 240, xl 360, full 480 (width in px). Display height = width × 456/384.

### 4.4 Inconsistencies discovered (do not assume the system is fully correct)
1. **The spark pulse is invisible.** `aira-mascot.tsx` animates `.sparkOverlay`, but that div has no background or content. Its fixed position (`top 2%; right 18%`) also does not match the spark, which moves per pose. **Fix with the generated `aira-spark.svg` and `aira-spark-anchors.json`** (§12.3).
2. **The extended poses are off-model.** `public/mascot/aira-{thinking,waving,surprised,pointing}.png` are 1024×1024 **RGB with a white background (no alpha)** at about 500 KB each. They use a different orange and a different torso module design, and have no navy outline, which breaks the style bible's locked anatomy. They are used by `AiraMascot` for non-canonical poses and by `useAiraAnimation().startThinking()`. **Do not use them on public pages.** They need regeneration (§19).
3. **Comments disagree with the code.** `aira-sprite.tsx` says it crops a sprite sheet with `background-position`, but it actually loads individual PNGs. This is harmless; fix the comment only.
4. **The `/mascot-demo` route is public** despite the "development only" comment. Consider `robots: { index: false }` or a `notFound()` guard in production. This is outside asset scope; just report it.
5. **Wrong icons in the test-type banner.** In `free-ielts-assessment/page.tsx` (lines 735–741), `GraduationCapIcon` returns `BookOpenCheck` and `PlaneIcon` returns `PlayCircle`. Use Lucide `GraduationCap` and `Plane` (already used in `content/landing.ts`). No custom asset is needed.
6. **The white logo has a background box** (see §2). Fixed by `brand/skyvoice-horizontal-white-transparent.svg`.
7. **The module tableau clips Aira.** `.module-tableau-aira { height: 350px; overflow: hidden }`, but `xl` Aira is 360×427.5 px.
8. **Mobile hero:** at 390 px, Aira's stage is cropped and the fixed `.mobile-cta-bar` overlaps it. Piece 3 Round 2 in `design-loop-progress.md` already records this as a craft FAIL (message → Aira → form handoff).
9. Piece 3 (website integration) is **FAIL** and Piece 4 (motion) is **blocked** in `design-loop-progress.md`. This guide's work feeds both. Update that log after integrating.

---

## 5. Visual Improvement Strategy

1. **Brand-native atmosphere, not decoration.** Each section gets **one** backdrop built from the orbit/spark/signal motifs, sitting behind content at low opacity. Copy, form and CTA keep full contrast.
2. **Aira gets a stage, not more poses.** Animated orbits, a ground shadow and a working spark pulse make the existing validated art feel alive without changing it.
3. **Fill the two empty storytelling moments**: Proof (evidence chain illustration) and Thank-you (one-shot celebration burst).
4. **Organic section transitions** using a single wave mask, applied in at most 2–3 places.
5. **Motion stays inside Motion + CSS.** Animated assets are self-contained SVG files with a static twin for reduced motion. There is no new runtime dependency.
6. **Utility pages get personality** (404 and error illustrations).
7. **Duolingo-inspired principles applied:** one dominant character action per section, rounded thick-outline shapes, playful-but-calm micro-motion, and a tactile button depth that already exists. **Nothing is copied.**

---

## 6. Asset Generation Summary

| Capability | Available? | What was used |
|---|---|---|
| AI raster image generation | **No.** The only media MCP (Higgsfield) states it "cannot generate media". | — |
| AI video generation | **No** | — |
| Lottie authoring / runtime | No runtime installed; not needed | Animated SVG + Motion instead |
| Vector authoring | **Yes** | Hand-authored SVG geometry via `design/visual-assets/generate_assets.py` (Python 3, reproducible) |
| Raster analysis | Yes (Pillow 11.3, NumPy 2.3) | Measured Aira spark anchors from the canonical PNGs |
| Rendering / QA | Yes (Playwright 1.64 Chromium) | Contact sheets in `design/visual-assets/previews/` |

**Result:** **18 asset files were generated, and all exist on disk.** They comprise 4 backgrounds, 3 illustrations, 6 motion-graphic files (3 animated + 3 static twins), 3 mascot-support files, and 2 brand derivatives. 3 QA preview images are stored separately. The generator script can regenerate everything:

```bash
python design/visual-assets/generate_assets.py
```

Because AI image generation was unavailable, **no new Aira poses, photographic imagery, or raster illustrations were created.** These are listed as pending in §19.

---

## 7. Asset Directory Structure

The brief asked for `public/assets/generated/` at the project root. This is a monorepo, and Next.js serves static files **only** from `apps/web/public/`. The assets were therefore placed in the app's public folder, so they are served at `/assets/generated/...`.

```text
apps/web/public/assets/generated/          → served at /assets/generated/
├── backgrounds/
│   ├── hero-signal-field.svg
│   ├── modules-orbit-field.svg
│   ├── section-wave-edge.svg
│   └── final-cta-signal-waves.svg
├── illustrations/
│   ├── proof-evidence-chain.svg
│   ├── route-lost-404.svg
│   └── signal-interrupted-error.svg
├── motion-graphics/
│   ├── hero-aira-orbit-stage.svg            (animated)
│   ├── hero-aira-orbit-stage-static.svg
│   ├── celebration-spark-burst.svg          (animated, one-shot)
│   ├── celebration-spark-burst-static.svg
│   ├── vsl-signal-backdrop.svg              (animated loop)
│   └── vsl-signal-backdrop-static.svg
├── mascots/
│   ├── aira-ground-shadow.svg
│   ├── aira-spark.svg
│   └── aira-spark-anchors.json
└── brand/
    ├── skyvoice-horizontal-cropped.svg
    └── skyvoice-horizontal-white-transparent.svg

design/visual-assets/                       (not shipped)
├── generate_assets.py
└── previews/
    ├── contact-sheet.webp                  (animations settled, t≈2.5 s)
    ├── contact-sheet-t0400ms.webp          (mid-animation)
    └── contact-sheet-reduced-motion.webp
```

Existing assets **were not moved or duplicated**: `apps/web/public/brand/*`, `apps/web/public/mascot/**`.

---

## 8. Complete Asset Inventory

**Status key:** ✅ completed (file exists, rendered and checked) · ⏳ pending (not created).
All generated SVGs are decorative (`aria-hidden="true"` inside the file). Use `alt=""` when rendering them with `<img>`.

### 8.1 Generated assets

| # | Asset | Path (relative to repo root) | Category | Format | ViewBox / size | Type | Intended page → component | Runtime deps | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Hero signal field | `apps/web/public/assets/generated/backgrounds/hero-signal-field.svg` | Background | SVG, 9.2 KB | 1440×760, `slice` | Static | `/free-ielts-assessment` → `section.hero` | none | ✅ |
| 2 | Modules orbit field | `apps/web/public/assets/generated/backgrounds/modules-orbit-field.svg` | Background (dark) | SVG, 3.3 KB | 1440×1400, `xMidYMin slice` | Static | `/free-ielts-assessment` → `section.modules-section` | none | ✅ |
| 3 | Section wave edge | `apps/web/public/assets/generated/backgrounds/section-wave-edge.svg` | Transition mask | SVG, 0.3 KB | 1440×80, `none` | Static (CSS mask) | `.modules-section` top/bottom edges (optional: `.final-cta`) | CSS `mask-image` | ✅ |
| 4 | Final CTA signal waves | `apps/web/public/assets/generated/backgrounds/final-cta-signal-waves.svg` | Background (on gradient) | SVG, 7.1 KB | 1440×720, `slice` | Static | `/free-ielts-assessment` → `section.final-cta` | none | ✅ |
| 5 | Proof evidence chain | `apps/web/public/assets/generated/illustrations/proof-evidence-chain.svg` | Illustration | SVG, 3.1 KB | 500×460 (≈1.087:1) | Static (can be animated in place, §14.6) | `/free-ielts-assessment` → `.proof-visual` | none | ✅ |
| 6 | Route lost (404) | `apps/web/public/assets/generated/illustrations/route-lost-404.svg` | Empty-state illustration | SVG, 1.9 KB | 560×360 (14:9) | Static | 404 → `not-found.tsx` `.utility-shell` | none | ✅ |
| 7 | Signal interrupted | `apps/web/public/assets/generated/illustrations/signal-interrupted-error.svg` | Error illustration | SVG, 1.1 KB | 320×220 | Static | Error → `error.tsx` `.utility-shell` | none | ✅ |
| 8 | Hero Aira orbit stage | `apps/web/public/assets/generated/motion-graphics/hero-aira-orbit-stage.svg` | Motion graphic | SVG + internal CSS, 2.9 KB | 480×560 | **Animated loop** (rings 60 s / 90 s rotation, sparks twinkle 4.8 s, halo 6 s) | `/free-ielts-assessment` → `.hero-aira-stage` | none | ✅ |
| 9 | Hero Aira orbit stage (static) | `…/motion-graphics/hero-aira-orbit-stage-static.svg` | Reduced-motion twin | SVG, 2.1 KB | 480×560 | Static | same | none | ✅ |
| 10 | Celebration spark burst | `…/motion-graphics/celebration-spark-burst.svg` | Motion graphic | SVG + internal CSS, 3.8 KB | 600×600 | **Animated one-shot** (~1.3 s burst, then slow spark twinkle) | `/thank-you` → `.thank-you-mascot` | none | ✅ |
| 11 | Celebration spark burst (static) | `…/motion-graphics/celebration-spark-burst-static.svg` | Reduced-motion twin | SVG, 2.2 KB | 600×600 | Static (final frame) | same | none | ✅ |
| 12 | VSL signal backdrop | `…/motion-graphics/vsl-signal-backdrop.svg` | Motion graphic | SVG + internal CSS, 2.2 KB | 900×240, `xMaxYMid slice` | **Animated loop** (3 rings emit from the score badge, 4.5 s, staggered 1.5 s) | `/free-ielts-assessment` → `VslPreview` `.vsl-card` | none | ✅ |
| 13 | VSL signal backdrop (static) | `…/motion-graphics/vsl-signal-backdrop-static.svg` | Reduced-motion twin | SVG, 1.8 KB | 900×240 | Static | same | none | ✅ |
| 14 | Aira ground shadow | `apps/web/public/assets/generated/mascots/aira-ground-shadow.svg` | Mascot support | SVG (blur filter), 0.4 KB | 240×48 | Static (animate with Motion) | Under every floating Aira (hero, thank-you, modules) | none | ✅ |
| 15 | Aira spark | `apps/web/public/assets/generated/mascots/aira-spark.svg` | Mascot support | SVG, 0.5 KB | 64×64 (spark + glow) | Static (animated by existing `SPARK_PULSE`) | `aira-mascot.tsx` `.sparkOverlay` | none | ✅ |
| 16 | Aira spark anchors | `apps/web/public/assets/generated/mascots/aira-spark-anchors.json` | Data | JSON, 0.9 KB | — | Data | `aira-mascot.tsx` (import the values into code) | none | ✅ |
| 17 | Horizontal logo, cropped | `apps/web/public/assets/generated/brand/skyvoice-horizontal-cropped.svg` | Brand derivative | SVG, 7.1 KB | viewBox `135 430 810 220` (≈3.68:1) | Static | `BrandLogo` default variant | none | ✅ |
| 18 | Horizontal logo, white, transparent | `apps/web/public/assets/generated/brand/skyvoice-horizontal-white-transparent.svg` | Brand derivative | SVG, 7.2 KB | viewBox `135 430 810 220` | Static | `BrandLogo variant="white"` (footer) | none | ✅ |

**Spark anchors** (from #16; % of the 384×456 canonical art box, measured by connected-component detection and visually verified):

| Pose | x % | y % | spark width % of 384 |
|---|---:|---:|---:|
| front | 68.17 | 6.46 | 10.68 |
| three-quarter | 66.09 | 6.53 | 10.68 |
| listening | 75.20 | 7.65 | 10.16 |
| speaking | 60.50 | 6.28 | 10.16 |
| reading | 67.88 | 6.75 | 9.38 |
| writing | 64.12 | 6.73 | 8.59 |
| feedback | 51.76 | 6.93 | 9.38 |
| celebration | 69.50 | 6.67 | 10.68 |

**Visual descriptions** (also see `design/visual-assets/previews/contact-sheet.webp`):
- **#1** Very pale blue/orange glows, a large broken orbit (blue/orange/navy at 7–22% opacity) on the right two-thirds, a dot-grid patch top-right, a faint signal pulse along the bottom edge, and four small orange sparks. The left ~40% is kept quiet for the H1.
- **#2** Navy-deep friendly: a 24 px white dot grid at 5%, two big broken orbits (blue 22–35%, orange 35–45%), a blue glow top-left, a warm glow top-right, a blue signal pulse near the bottom, and five sparks.
- **#3** An organic wave silhouette (black fill, used only as a mask).
- **#4** Three soft white sine waves near the bottom, a faint white signal pulse near the top, a broken-orbit cluster and a large orange spark top-right.
- **#5** A tilted essay sheet with grey text lines, one orange highlighted line plus an orange annotation stroke, and a blue check badge. A dashed "correction route" with an orange waypoint leads to a card with three rising bars (grey → light blue → blue) and an outlined orange spark. Everything sits on a blue-light disc inside a broken orbit. **There are no numbers or claims.**
- **#6** A blue route with two milestone dots that becomes dotted, then breaks. A signal beacon (white circle, broken orbit, signal pulse, post) stands in the gap. The route resumes faint grey to a grey target.
- **#7** A navy signal pulse that breaks at an orange spark and continues as faint dashes, inside an orange-light disc with a broken orbit.
- **#8/#9** A halo, a white inner disc, a 176 px-radius broken orbit (blue/orange/navy) and a thin outer orbit, with three twinkling sparks and a floor ellipse at y≈528.
- **#10/#11** A warm/blue radial glow, a broken orbit ring, and 12 particles (sparks, dots, short rays) in orange/blue/navy that fly outward from the centre into a ring.
- **#12/#13** Three concentric broken orbits (white and orange) centred at x=790/900 (behind `.vsl-score`), plus a faint signal pulse and a small orange spark.

### 8.2 Existing assets selected for reuse (no regeneration needed)

| Asset | Path | Size | Reuse decision |
|---|---|---|---|
| Aira canonical poses ×8 | `apps/web/public/mascot/canonical/aira-{front,three-quarter,listening,speaking,reading,writing,feedback,celebration}.png` | 384×456 RGBA, 31–42 KB | ✅ **Reuse everywhere.** Never upscale beyond 384 px wide (`xl` = 360 is the max crisp size; `full` 480 softens edges). |
| Skill Signals ×12 | `apps/web/public/mascot/skill-signals/{listening,reading,writing,speaking}-{idle,active,success}.png` | 420×420 RGBA | ✅ Reuse. The `success` states are currently unused; see §14.7. |
| Brand logos | `apps/web/public/brand/skyvoice-{horizontal,horizontal-white,icon,icon-white}.svg` | 1080 artboard | ✅ Keep as originals. The new derivatives (#17, #18) are for production rendering. |
| Lead mascot sheet | `apps/web/public/mascot/lead-mascot-sheet.png`, `apps/web/public/mascot/lead-mascot-sheet.svg` | 1536×1024 | QA reference only. It contains pose-name text labels; **never use it in UI.** |
| Skill signal system sheet | `apps/web/public/mascot/skill-signals/skill-signal-system.png` | 1680×1260 | QA reference only. |
| Extended poses ×4 | `apps/web/public/mascot/aira-{thinking,waving,surprised,pointing}.png` | 1024² RGB | ❌ **Do not use publicly** (off-model, no alpha). See §4.4.2. |

---

## 9. Page-by-Page Asset Mapping

### `/free-ielts-assessment`. Source: `apps/web/src/app/free-ielts-assessment/page.tsx`

| Order | Section (JSX) | Line(s) | Asset(s) | Priority |
|---|---|---|---|---|
| 1 | `<section className="hero section" id="top">` | 110–182 | #1 hero-signal-field; #8/#9 hero-aira-orbit-stage; #14 shadow; #15/#16 spark | **P1** |
| 2 | `<section className="assessment-preview-section">` → `<VslPreview />` | 184–190 | #12/#13 vsl-signal-backdrop (inside `apps/web/src/components/vsl-preview.tsx`) | P2 |
| 3 | `#results` `.transformation` (score journey) | 192–244 | No file; animated route (CSS/Motion), §14.5 | P3 |
| 4 | `#why-stuck` `.section-soft` | 246–267 | None; keep the existing Lucide cards + `Reveal` stagger | — |
| 5 | `#method` `.method-section` | 269–297 | None; progressive method-line draw (CSS/Motion), §14.8 | P3 |
| 6 | `#modules` `.modules-section` | 299–390 | #2 modules-orbit-field; #3 wave edge (top + bottom); #14 shadow under the tableau Aira; Skill Signal hover state swap (existing files) | **P1** |
| 7 | `#portal` `.portal-section` | 392–474 | None; animate the existing `.audio-wave` bars (CSS), §14.9 | P3 |
| 8 | `#audience`, `#fees` | 476–567 | None (cards already well composed) | — |
| 9 | `.proof-section` `.proof-visual` | 569–625 | #5 proof-evidence-chain | **P1** |
| 10 | `#faq` | 627–646 | None | — |
| 11 | `#final-assessment` `.final-cta` | 648–687 | #4 final-cta-signal-waves | P2 |
| 12 | `<footer className="site-footer">` | 690–723 | #18 white transparent logo (via `BrandLogo`) | **P1 (bug fix)** |

### `/thank-you`. Source: `apps/web/src/app/thank-you/page.tsx`
| Section | Asset | Priority |
|---|---|---|
| `.thank-you-mascot` wrapper around `<AiraContext context="thank-you" />` | #10/#11 celebration burst + #14 shadow | **P1** |

### 404. Source: `apps/web/src/app/not-found.tsx`
| Section | Asset | Priority |
|---|---|---|
| `.utility-shell`, between `<BrandLogo />` and the eyebrow | #6 route-lost-404 | P2 |

### Error. Source: `apps/web/src/app/error.tsx`
| Section | Asset | Priority |
|---|---|---|
| Replace `<span className="success-icon error-icon">…AlertTriangle…</span>` | #7 signal-interrupted-error | P2 |

### Shared. Source: `apps/web/src/components/brand-logo.tsx`
| Variant | Asset | Priority |
|---|---|---|
| `white` | #18 | **P1** |
| `default` | #17 (optional; the current crop already works visually) | P3 |

---

## 10. Exact Component and Source File References

All of these paths were verified to exist (§21).

| Component / selector | File |
|---|---|
| `FreeIeltsAssessmentPage` | `apps/web/src/app/free-ielts-assessment/page.tsx` |
| `ThankYouPage` | `apps/web/src/app/thank-you/page.tsx` |
| `NotFound` | `apps/web/src/app/not-found.tsx` |
| `ErrorPage` | `apps/web/src/app/error.tsx` |
| `OpenGraphImage` | `apps/web/src/app/opengraph-image.tsx` |
| `Reveal` | `apps/web/src/components/reveal.tsx` |
| `VslPreview` | `apps/web/src/components/vsl-preview.tsx` |
| `BrandLogo` | `apps/web/src/components/brand-logo.tsx` |
| `SiteHeader` | `apps/web/src/components/site-header.tsx` |
| `LeadForm` (**do not change behaviour**) | `apps/web/src/components/lead-form.tsx` |
| `AiraMascot` | `apps/web/src/components/mascot/aira-mascot.tsx` |
| Mascot CSS module | `apps/web/src/components/mascot/aira-mascot.module.css` |
| `AiraContext`, `AiraModule` | `apps/web/src/components/mascot/aira-context.tsx` |
| `SkillSignal` | `apps/web/src/components/mascot/skill-signal.tsx` |
| Mascot types / sizes | `apps/web/src/components/mascot/types.ts` |
| Global styles | `apps/web/src/app/globals.css`: `.hero` ~374, `.hero-ambient*` ~394–415, `.vsl-*` ~532–650, `.route-line` ~1111, `.method-line` ~1234, `.modules-section` ~1306, `.audio-wave` ~1669, `.proof-visual` ~1978, `.final-cta` ~2194, `.site-footer` ~2297, `.success-icon` ~2412, reduced-motion block ~3070, `.hero-aira-stage` ~3217, `.module-tableau-aira` ~3279, `.thank-you-mascot` ~3329 |
| Content data | `apps/web/src/content/landing.ts` |
| E2E tests | `apps/web/tests/e2e/landing.spec.ts` |

Line numbers are approximate anchors as of this analysis. Search by selector name.

---

## 11. Image and Illustration Integration Instructions

### General rules for every generated SVG
- Render with a plain `<img>`, **not** `next/image`. SVGs gain nothing from the optimizer, and Next blocks SVG optimization by default (`dangerouslyAllowSVG` is off; keep it off).
  ESLint (`eslint-config-next`) flags `<img>` with `@next/next/no-img-element`. Because the repo lints with `--max-warnings=0`, add `{/* eslint-disable-next-line @next/next/no-img-element */}` directly above each decorative `<img>`, **or** use CSS `background-image` where noted. **Prefer CSS `background-image` for full-section backgrounds** (no lint issue, no DOM node).
- Decorative: `alt=""` and `aria-hidden="true"`; never focusable.
- Always give an explicit `width`/`height` or an `aspect-ratio` to prevent CLS.
- Below-the-fold `<img>`: `loading="lazy" decoding="async"`. Hero assets: eager (default).
- Place decorative layers under content: `position:absolute; inset:0; z-index:0; pointer-events:none`. Content is already `position:relative; z-index:1` in `.hero-grid` and `.final-grid`.

### 11.1 Hero background (#1)
**Where:** `section.hero` (`page.tsx` lines 110–112).
**How:** CSS only, in `globals.css`:

```css
.hero {
  background:
    url("/assets/generated/backgrounds/hero-signal-field.svg") center top / cover no-repeat,
    linear-gradient(180deg, #f8fbff 0%, #ffffff 82%),
    var(--white);
}
/* Replace the generic blobs + dot grid; the SVG now carries both. */
.hero::before { display: none; }
```

Remove the two `<div aria-hidden className="hero-ambient …" />` lines (111–112) **or** set `.hero-ambient { display:none }`. Keep the `.hero-ambient*` rules if you prefer a reversible change.
**Preserve:** H1, lede, both CTAs, the reassurance line, `LeadForm idPrefix="assessment"`, and `.trust-strip`.
**Responsive:** `cover` + `slice` crops the sides on mobile, and the orbit stays centred-right. At ≤680 px, consider `background-position: 70% top`.

### 11.2 Modules backdrop (#2) and wave edges (#3)
**Where:** `section.modules-section` (`page.tsx` line 299).

```css
.modules-section {
  background:
    url("/assets/generated/backgrounds/modules-orbit-field.svg") center top / cover no-repeat,
    var(--brand-navy-deep);
  overflow: visible;            /* was hidden – needed for the wave edges */
}
.modules-section::before { display: none; }   /* glow now in the SVG */

/* Organic top edge: navy wave rising out of the white method section. */
.modules-section > .site-shell::before,
.modules-section::after {
  /* see snippet below */
}
```

Recommended edge implementation (no markup change). Add two pseudo-elements on the section itself. Because `::before` is freed above, use it for the top edge and `::after` for the bottom edge:

```css
.modules-section::before,
.modules-section::after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  height: clamp(36px, 5.5vw, 80px);
  background: var(--brand-navy-deep);
  -webkit-mask: url("/assets/generated/backgrounds/section-wave-edge.svg") center / 100% 100% no-repeat;
          mask: url("/assets/generated/backgrounds/section-wave-edge.svg") center / 100% 100% no-repeat;
  pointer-events: none;
}
.modules-section::before { top: calc(-1 * clamp(36px, 5.5vw, 80px) + 1px); }
.modules-section::after  { bottom: calc(-1 * clamp(36px, 5.5vw, 80px) + 1px); transform: scaleY(-1); }
```

(Override the existing `.modules-section::before` rule completely: reset `width`, `top`, and `left`.) Ensure the following section (`.portal-section`) has `position: relative` (inherited from `.section`) and **no** top content within 80 px, which is already true because of the 104 px padding. Check that the horizontal overflow test (`tests/e2e/landing.spec.ts` "does not overflow a mobile viewport") still passes. The edges use `left:0; right:0`, not `100vw`, so they cannot overflow.

### 11.3 Proof illustration (#5)
**Where:** `<Reveal className="proof-visual">` (`page.tsx` lines 571–591).
**Change:** Replace the inner `.proof-ring` block with the illustration and keep its text as an HTML caption (do not lose the copy). Keep all three `.proof-float` chips.

```tsx
<Reveal className="proof-visual">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    alt=""
    aria-hidden="true"
    className="proof-illustration"
    decoding="async"
    height={460}
    loading="lazy"
    src="/assets/generated/illustrations/proof-evidence-chain.svg"
    width={500}
  />
  <p className="proof-caption">
    <strong>Progress you can explain</strong>
    Not a mystery score. A visible chain from feedback to correction.
  </p>
  {/* existing .proof-float-one/two/three unchanged */}
</Reveal>
```

```css
.proof-visual { flex-direction: column; }
.proof-visual::before { display: none; }           /* dashed ring is now in the SVG */
.proof-illustration { width: min(100%, 460px); height: auto; aspect-ratio: 500 / 460; }
.proof-caption { margin: 8px 0 0; max-width: 300px; text-align: center; font-size: .9rem; color: var(--text-muted); }
.proof-caption strong { display: block; color: var(--brand-navy); font-size: 1.2rem; }
```

Re-tune `.proof-float-*` positions so the chips sit on the orbit edge (about `top: 40px` / `bottom: 120px` / `top: 120px`) and do not cover the sheet or chart. **Mobile (≤680 px):** the illustration goes to `width: 100%`. Keep only one floating chip visible or convert them into a wrapped row below the caption to avoid overlap. The existing mobile rules for `.proof-float-*` are at about lines 2973–2987.

### 11.4 Final CTA waves (#4)
**Where:** `section.final-cta` (`page.tsx` line 648).

```css
.final-cta {
  background:
    url("/assets/generated/backgrounds/final-cta-signal-waves.svg") center / cover no-repeat,
    linear-gradient(135deg, var(--brand-navy-deep), var(--brand-blue));
}
```

Keep `.final-cta::before` (dot grid) and the `.final-orbit-*` divs; they layer well. **Contrast:** white lines are ≤12% opacity, so the white H2 and body text stay well above AA.

### 11.5 404 illustration (#6)
**Where:** `apps/web/src/app/not-found.tsx`, inside `.utility-shell`, between `<BrandLogo />` and `<span className="eyebrow">`.

```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img alt="" aria-hidden="true" className="utility-illustration" height={360}
     src="/assets/generated/illustrations/route-lost-404.svg" width={560} />
```

```css
.utility-illustration { display:block; width:min(100%, 420px); height:auto; margin: 24px auto 8px; }
```

### 11.6 Error illustration (#7)
**Where:** `apps/web/src/app/error.tsx`. Replace the `<span className="success-icon error-icon">` and `AlertTriangle` block with the same `<img>` pattern (`width={320} height={220}`, class `utility-illustration`, CSS `width:min(100%,260px)`). Remove the unused `AlertTriangle` import. The H1 "That step did not load correctly." already conveys the meaning, so the image stays decorative. **Keep the `reset` button and its behaviour unchanged.**

### 11.7 Footer logo (#18) and BrandLogo (#17)
**Where:** `apps/web/src/components/brand-logo.tsx`. The derivatives are already cropped to `viewBox="135 430 810 220"`, which is the same box the component currently emulates. Simplest correct change:

```tsx
const source = variant === "white"
  ? "/assets/generated/brand/skyvoice-horizontal-white-transparent.svg"
  : "/assets/generated/brand/skyvoice-horizontal-cropped.svg";

return (
  // eslint-disable-next-line @next/next/no-img-element
  <img alt="Sky Voice Languages" className={`brand-logo ${className}`} height={220} src={source} width={810} />
);
```

Check that `.brand-logo` CSS sizes by `height` or `width` with `auto` for the other dimension. Today it targets an `<svg>`, so confirm that the rendered size is unchanged in the header, the footer, and the portal-preview sidebar (`page.tsx` line 436). **Minimum alternative:** keep the `<svg><image/>` approach and only change the `white` href to #18. Either option removes the navy box. `structuredData.logo` in `page.tsx` still points to `/brand/skyvoice-icon.svg`; leave it.

---

## 12. Mascot Integration Instructions

**Hard rules (from `design/mascot/style-bible.md`):** never recolour, redraw, trace, flip or upscale Aira past 384 px wide. Never place Aira over busy texture. Use only the 8 canonical poses publicly. One dominant Aira action per section.

### 12.1 Hero stage (#8/#9 + #14)
**Where:** `page.tsx` lines 148–156, `<div className="hero-aira-stage">`, which wraps `<AiraContext context="hero-speaking" size="xl" … />`.

```tsx
<div className="hero-aira-stage">
  <picture className="hero-aira-orbit" aria-hidden="true">
    <source media="(prefers-reduced-motion: reduce)"
            srcSet="/assets/generated/motion-graphics/hero-aira-orbit-stage-static.svg" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="" height={560} src="/assets/generated/motion-graphics/hero-aira-orbit-stage.svg" width={480} />
  </picture>
  <AiraContext context="hero-speaking" size="xl" aria-label="…unchanged…" />
  <AiraGroundShadow />   {/* §12.2 */}
</div>
```

```css
.hero-aira-stage::before { display: none; }   /* radial replaced by the stage SVG */
.hero-aira-orbit { position:absolute; inset:50% auto auto 50%; width:min(118%, 480px);
  aspect-ratio: 480/560; transform: translate(-50%, -50%); z-index:0; }
.hero-aira-orbit img { width:100%; height:100%; }
```

The stage's orbit centre is at (240, 250) of 480×560, which is about 45% from the top. Align it with Aira's chest. With `xl` (360×427.5) centred in a 470 px-tall stage, nudge the picture with `translate(-50%, -54%)` if needed and verify visually.
**Why `<picture>`:** the SVG contains an internal `prefers-reduced-motion` rule, but **QA showed that the rule inside an SVG loaded as `<img>` is not reliable** (the media query did not react to Playwright's reduced-motion emulation). The `<source media>` swap is the dependable mechanism. **Always ship animated SVGs through `<picture>` with the `-static` twin.**
**Mobile (≤680 px):** the design-loop log flags the mobile hero as failing. Shrink Aira to `size="lg"` (240) at ≤680 px. `AiraContext` takes `size`, so render through a CSS-controlled wrapper scale or two instances with `display` toggles. Keep the stage at most 300 px tall so the form (`#assessment-form`) begins within the first two viewport heights, and add `padding-bottom` so `.mobile-cta-bar` never covers Aira.

### 12.2 Ground shadow (#14), synced to the float
Create a small client component, either `apps/web/src/components/mascot/aira-ground-shadow.tsx` (new) or inline. The shadow should shrink while Aira rises (Aira float = y 0→-5→0 over 2.6 s):

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function AiraGroundShadow({ width = 200 }: { width?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.img
      alt="" aria-hidden="true" className="aira-ground-shadow"
      height={(width * 48) / 240} width={width}
      src="/assets/generated/mascots/aira-ground-shadow.svg"
      animate={reduce ? undefined : { scaleX: [1, 0.88, 1], opacity: [1, 0.7, 1] }}
      transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
    />
  );
}
```

```css
.aira-ground-shadow { position:absolute; left:50%; bottom:2%; translate:-50% 0; z-index:0; pointer-events:none; }
```

Export it from `components/mascot/index.ts`. Use it in the hero stage, `.module-tableau-aira`, and `.thank-you-mascot`. **Match the timing to `FLOAT_KEYFRAMES` in `aira-mascot.tsx`** (2.6 s, easeInOut); if one changes, change both.

### 12.3 Make the spark pulse real (#15 + #16)
**Where:** `apps/web/src/components/mascot/aira-mascot.tsx`, the `{sparkPulse && (<motion.div className={styles.sparkOverlay} …/>)}` block. Today the overlay is an empty div.

1. Copy the `anchors` table from `apps/web/public/assets/generated/mascots/aira-spark-anchors.json` into a typed constant in `types.ts` (e.g. `SPARK_ANCHORS: Record<CanonicalPose, {x_pct; y_pct; size_pct}>`). Importing JSON from `public/` also works, but a typed constant is cleaner.
2. Coordinates are percentages of the **384×456 art box**, which equals the `.mascotRoot` box because display height = px × 456/384.
3. Render:

```tsx
{sparkPulse && isCanonical && (
  <motion.img
    alt="" aria-hidden="true"
    src="/assets/generated/mascots/aira-spark.svg"
    className={styles.sparkOverlay}
    style={{
      left: `${SPARK_ANCHORS[pose].x_pct}%`,
      top: `${SPARK_ANCHORS[pose].y_pct * (456 / 384) * (384 / 456)}%`, // = y_pct (kept explicit)
      width: `${SPARK_ANCHORS[pose].size_pct * 1.9}%`,                 // glow ≈1.9× spark width
      translate: "-50% -50%",
    }}
    animate={prefersReducedMotion ? {} : { opacity: [0.9, 0.35, 0.9], scale: [1, 1.18, 1] }}
    transition={{ duration: 1.9, ease: "easeInOut", repeat: Infinity }}
  />
)}
```

Then remove `top/right/width/height` from `.sparkOverlay` in `aira-mascot.module.css` (keep `position:absolute; pointer-events:none`).
The SVG is a **glow + spark**, so it sits on top of the raster spark and adds a soft pulse. Because it has the same colour and shape, it reads as the spark "breathing". During pose cross-fades the overlay should cross-fade too: key it by `pose`.
Use 1.9× width so the glow (64 px box, 17 px spark radius) matches the raster spark. **Verify against `/mascot-demo`, where all 8 poses are rendered.**

### 12.4 Thank-you celebration (#10/#11 + #14)
**Where:** `apps/web/src/app/thank-you/page.tsx`, `<div className="thank-you-mascot">`.

```tsx
<div className="thank-you-mascot">
  <picture className="thank-you-burst" aria-hidden="true">
    <source media="(prefers-reduced-motion: reduce)"
            srcSet="/assets/generated/motion-graphics/celebration-spark-burst-static.svg" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="" height={600} src="/assets/generated/motion-graphics/celebration-spark-burst.svg" width={600} />
  </picture>
  <AiraContext context="thank-you" size="xl" aria-label="Aira celebrates your assessment booking!" />
  <AiraGroundShadow width={180} />
</div>
```

```css
.thank-you-mascot { position: relative; }
.thank-you-burst { position:absolute; left:50%; top:46%; width:min(150%, 560px); aspect-ratio:1;
  transform:translate(-50%,-50%); z-index:0; pointer-events:none; }
.thank-you-burst img { width:100%; height:100%; }
.thank-you-mascot > :not(.thank-you-burst) { position:relative; z-index:1; }
```

The burst plays **once** on page load (the CSS animations use `forwards`) and then only the sparks twinkle slowly. `.utility-shell` must not clip the burst: check that `overflow` is visible, or keep `width ≤ 100%` of the shell on mobile. The existing ≤480 px rule scales Aira to 0.8; scale the burst equally.

### 12.5 Module tableau
**Where:** `.module-tableau-aira` (`page.tsx` lines 311–317). Fix the clipping: set `height: auto; min-height: 360px; overflow: visible;`. Add `<AiraGroundShadow />` inside it. The navy background makes the default 16% navy shadow nearly invisible, so pass a class that sets `filter: brightness(0) invert(1); opacity: .12` for a light shadow on dark.

### 12.6 Not recommended
- Do **not** add Aira to every section. The current placements (hero, modules, thank-you) already satisfy "one dominant character action per section".
- Do **not** use the extended poses (§4.4.2).
- Optional: the OG image (`opengraph-image.tsx`) could include `aira-front.png`. `ImageResponse` accepts `<img src>` with an absolute URL or an `ArrayBuffer` read via `fs` in a Node runtime. Read the Next 16 `next/og` docs in `node_modules/next/dist/docs/` first. P3.

---

## 13. Motion Graphics Integration Instructions

| Asset | Load as | Loop | Reduced motion | Pause off-screen? |
|---|---|---|---|---|
| #8 hero-aira-orbit-stage | `<picture>` + `<img>`, eager | Yes (60 s / 90 s / 4.8 s / 6 s) | `<source media>` → #9 | Not needed (cheap transforms) |
| #10 celebration-spark-burst | `<picture>` + `<img>`, eager | One-shot plus a slow twinkle | → #11 | No |
| #12 vsl-signal-backdrop | `<picture>` + `<img>`, `loading="lazy"` | Yes (4.5 s, staggered) | → #13 | Optional |

**VSL backdrop placement.** In `apps/web/src/components/vsl-preview.tsx`, inside the `<button className="vsl-card">`, replace the two orbit spans:

```tsx
<span className="vsl-grid" aria-hidden="true" />
<picture className="vsl-signal" aria-hidden="true">
  <source media="(prefers-reduced-motion: reduce)"
          srcSet="/assets/generated/motion-graphics/vsl-signal-backdrop-static.svg" />
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img alt="" height={240} loading="lazy" src="/assets/generated/motion-graphics/vsl-signal-backdrop.svg" width={900} />
</picture>
```

```css
.vsl-signal { position:absolute; inset:0; pointer-events:none; }
.vsl-signal img { width:100%; height:100%; object-fit:cover; object-position:right center; }
```

(Delete `.vsl-orbit*` usage, but you may keep the CSS rules.) The ring centre (x=790 of 900, `xMaxYMid slice`) lands behind `.vsl-score` (160 px column, right). At ≤680 px, `.vsl-score` moves (see the mobile rules at about lines 2763–2780). Set `object-position: right bottom` there so the rings stay behind the badge. The `<picture>` must stay **inside** the `<button>` as non-interactive content, which is valid because `<picture>` is phrasing content. Keep `aria-hidden`.

**Why SVG and not Lottie or video:** every effect here uses vector transforms and opacity, and an SVG costs 2–4 KB with zero JS. Lottie would need a new runtime (`lottie-web` ≈ 250 KB, or `@lottiefiles/dotlottie-react`). Transparent WebM needs VP9-alpha encoding, which Safari renders inconsistently. Neither is justified.

---

## 14. Animation Implementation Specifications

Global conventions (from the design system and the existing code):
- **Easing:** `[0.22, 1, 0.36, 1]` (as in `Reveal`). **Section entrance:** 0.35–0.55 s, stagger ≤ 0.06 s. **Hover/focus:** 160–220 ms. **Press:** 100–160 ms.
- **Only `transform` and `opacity`.** Never animate width, height or top.
- **Reduced motion:** `useReducedMotion()` in Motion components. CSS is already globally neutralised by the `@media (prefers-reduced-motion: reduce)` block at about `globals.css:3070`, which sets all animation/transition durations to 0.01 ms. Animated SVG files use `<picture>` twins.
- **Mobile:** nothing depends on hover. Hover effects are wrapped in `@media (hover: hover)`.

### 14.1 Hero entrance sequence
- **Target:** `section.hero` children (`page.tsx` lines 116–165). **Library:** existing `Reveal`.
- **Trigger:** on mount / in view (once).
- **Spec:** copy `Reveal delay 0` → Aira stage `delay 0.1` (exists) → form `delay 0.12` (exists). Add the orbit stage fade: `<motion.div initial={{opacity:0, scale:.94}} animate={{opacity:1, scale:1}} transition={{duration:.6, delay:.15, ease:[0.22,1,0.36,1]}}>` around the `<picture>`.
- **Reduced:** duration 0. **Performance:** the SVG loops are compositor-only (rotate/opacity).

### 14.2 Aira idle + shadow + spark
- **Target:** `AiraMascot` (`aira-mascot.tsx`). **Library:** Motion.
- **Spec:** float y `[0,-5,0]` over 2.6 s easeInOut, infinite (exists). Shadow scaleX `[1,.88,1]`, opacity `[1,.7,1]`, 2.6 s, in phase. Spark opacity `[.9,.35,.9]`, scale `[1,1.18,1]` over 1.9 s (offset from the float so they never sync, per `bar.md` mechanism 7).
- **Reduced:** all static (`effectiveIdle` is already `none`; gate shadow and spark too).

### 14.3 Thank-you burst
- **Target:** `.thank-you-burst` (§12.4). **Technique:** SVG-internal CSS.
- **Spec:** ring scale .55→1 and opacity 0→1 over 1.1 s with a 0.05 s delay. Particles fly from 75% toward the centre to their final position, scale .2→1 over 0.9 s, delays 0.08–0.33 s, `cubic-bezier(.22,1,.36,1)`, `forwards`. Sparks then twinkle opacity 1↔.45 every 4 s with staggered starts.
- **Optional pairing:** trigger Aira's celebrate bounce once using the existing global utility `.aira-celebrate` (`globals.css`, 0.45 s × 3) on the wrapper.
- **Reduced:** the static twin shows the final frame.

### 14.4 VSL card signal
- **Spec:** rings scale .55→1.25 and opacity 0→1→0 over 4.5 s, staggered 0/1.5/3 s, infinite. Card hover (exists): translateY(-3px). Add `.vsl-card:hover .vsl-play { transform: scale(1.08) }` with a 180 ms transition inside `@media (hover:hover)`.

### 14.5 Score route draw (transformation section)
- **Target:** `.score-route .route-line` (`page.tsx` line 231). **Technique:** CSS keyframes, triggered when the parent `Reveal` becomes visible.
- **Implementation:** give `.route-line` `transform-origin: left center; transform: scaleX(0)` and animate it to `scaleX(1)` over 0.8 s with a 0.3 s delay, ease `cubic-bezier(.22,1,.36,1)`. The mobile layout (≤680 px) uses a vertical `border-left` line, so use `transform-origin: top; scaleY` there. Start it through a class toggled by Motion's `onViewportEnter`, or wrap the line in a `motion.div` with `initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true, amount:.6}}`.
- **Then:** the `.score-route span` icon pops in (scale .6→1, 0.3 s, delay 1.0 s). The `.score-card-after` gets a one-time orange ring glow (`box-shadow` via an opacity-animated pseudo-element, 0.6 s).
- **Reduced:** the line is shown immediately.

### 14.6 Proof illustration reveal
- **Target:** `.proof-illustration` (§11.3). **Library:** Motion through the existing `Reveal` (fade/translate). Optional extra: wrap the `<img>` in `motion.div` with `initial={{rotate:-2, scale:.96}} whileInView={{rotate:0, scale:1}}`, 0.6 s. The three `.proof-float` chips get staggered `Reveal` delays 0.2/0.28/0.36 s plus a gentle CSS float (`translateY 0↔-4px`, 5 s, with different `animation-delay`s so they never move in sync).
- **Reduced:** static.

### 14.7 Skill Signal state swap (modules)
- **Target:** `.module-card` (`page.tsx` lines 338–365) with `<SkillSignal state="active" />`.
- **Interaction:** on card hover/focus-within, show the `success` state (existing files). Render both the `active` and `success` images stacked in `.module-signal` (same 420 registration, so there is no shift) and cross-fade with opacity over 200 ms. Add `transform: translateY(-4px)` to the card over 180 ms.
- **Mobile:** none (no hover). **Reduced:** an instant swap is fine (no motion, only opacity).
- **Accessibility:** both images stay `decorative` (heading names the module).

### 14.8 Method path progress
- **Target:** `.method-line` (`globals.css` ~1234) and `.method-step` markers.
- **Spec:** the line draws left→right with `scaleX 0→1` over 1.2 s when `.method-path` enters view. Markers pop with `scale .8→1` over 0.35 s, stagger 0.06 s (`Reveal` already staggers 0.04; keep it). Free markers (steps 1–2) keep the orange "Free" chip. Optional: a one-time orange spark (`aira-spark.svg`, 20 px) travels along the line to step 2 and fades out, with a 1.2 s Motion `x` animation.
- **Mobile:** the line is vertical (see the ≤680 px rules), so swap to `scaleY`. **Reduced:** static.

### 14.9 Portal audio-wave
- **Target:** `.audio-wave span` (`page.tsx` lines 456–460; CSS ~1669). **Technique:** CSS only.

```css
@keyframes wave-bar { 0%,100% { transform: scaleY(.55) } 50% { transform: scaleY(1) } }
.audio-wave span { transform-origin: center; animation: wave-bar 1.4s ease-in-out infinite; }
.audio-wave span:nth-child(3n) { animation-delay: .2s } .audio-wave span:nth-child(3n+1) { animation-delay: .45s }
```

This preserves inline `height` values. It is neutralised by the global reduced-motion block. Pause when off-screen is unnecessary because the cost is negligible.

### 14.10 Buttons and cards (micro-interactions)
These already exist for `.button` and `.vsl-card`. Do not duplicate them. Add only the following, each inside `@media (hover:hover)` at 160–200 ms: `.gap-card` and `.audience-card` lift `translateY(-3px)` and strengthen the border to `--border-strong`. `.pricing-card.is-featured` keeps its badge static (no pulsing; avoid false urgency per the design system §8).

### 14.11 Section wave edges
Static. Do not animate.

---

## 15. Responsive Design Requirements

| Asset | Desktop ≥1081 | Tablet 681–1080 | Mobile ≤680 |
|---|---|---|---|
| #1 hero field | `cover`, top | `cover` | `cover`, `background-position: 70% top` |
| #8 orbit stage | `min(118%, 480px)` behind `xl` Aira | same; stage width follows `.hero-left` (stacks at ≤920) | ≤300 px tall stage, Aira `lg`; must not push the form below about 2 viewports; clear `.mobile-cta-bar` |
| #2 modules field | `cover`, top | same | same (orbit sits top-left) |
| #3 wave edges | 80 px | `clamp(36px, 5.5vw, 80px)` | 36 px |
| #5 proof | 460 px max | 420 px | 100% width; chips reflow to a row below |
| #4 final waves | `cover` | `cover` | `cover` (waves at bottom stay below the form card) |
| #12 VSL signal | right-anchored | right-anchored | `object-position: right bottom` |
| #10 burst | 560 px | 560 px | `min(150%, 100vw - 32px)`; no horizontal overflow |
| #6/#7 utility | 420 / 260 px | same | 100% (max) |
| Logo #17/#18 | existing `.brand-logo` sizing | same | same |

Rules: there must be no horizontal scroll at 320 px. The e2e test checks 390 px; also check 320 px manually. Never use `100vw` for decorative layers (scrollbar overflow). Use `inset:0` or `left:0;right:0`.

---

## 16. Accessibility Requirements
- Every generated SVG is decorative: `alt=""`, `aria-hidden="true"` on the `<img>` or `<picture>`. The SVG files themselves also carry `aria-hidden="true"`. The only meaningful image is the logo: `alt="Sky Voice Languages"`.
- Moving the proof-ring text into `.proof-caption` keeps it as real text. **Do not delete that copy.**
- Reduced motion: `<picture><source media="(prefers-reduced-motion: reduce)">` for every animated SVG; `useReducedMotion()` for Motion; the global CSS block covers keyframes.
- No animation may flash more than 3 times per second. All loops here are ≥1.4 s.
- Text contrast is unaffected: background art is ≤12% (white) or ≤35% (brand) opacity, behind text that already passes AA.
- Do not add `tabIndex` to decorative layers. Keep `.vsl-card` a single button. Keep the dialog focus management.
- Re-run the axe test: `pnpm test:e2e` ("has no automatically detectable accessibility violations").

## 17. Performance and Optimization Guidelines
- Total new payload is about **51 KB uncompressed SVG/JSON** (much smaller gzipped). The hero adds about 12 KB (#1 + #8).
- SVGs are already minified-style (1-decimal coordinates). Optionally run SVGO; **do not** strip `<style>`, `class`, `aria-hidden` or `preserveAspectRatio`.
- CSS-background SVGs are not render-blocking; the hero ones are small enough to load eagerly.
- **Remove `unoptimized` from `AiraSprite`** (`aira-sprite.tsx`) so `next/image` serves WebP/AVIF of the canonical PNGs (currently 31–42 KB each). Add `sizes` matching the preset width and `priority` for the hero instance only. This is P2 and low risk; check that there is no visual change at `xl`.
- Animated SVG loops use rotate/scale/opacity on a handful of nodes, which is compositor-friendly. If profiling shows cost on low-end Android, use the static twin under `@media (max-width: 680px)` by adding a second `<source media="(max-width: 680px)" srcSet="…-static.svg">`.
- Set `width`/`height` on every `<img>` (CLS).
- Do not add Lottie, GSAP, Three.js or video.

## 18. Required Dependencies and Compatibility Notes
- **No new dependencies.** Everything uses `motion@14.2.0` (`import { motion, useReducedMotion } from "motion/react"`), plain CSS, `<picture>`, and `<img>`.
- CSS `mask` on the wave edges: supported in all evergreen browsers. Keep the `-webkit-mask` prefix for older Safari.
- CSS animations inside SVG-as-image: supported in Chromium, Firefox and Safari. Verified in Chromium (Playwright) over http. **Note:** loading the files over `file://` showed blank animated or masked tiles. This is a local-file security artifact; always test via `pnpm dev`.
- `transform-box: fill-box` (used for spark twinkles) is supported in evergreen browsers.
- `next/image` is **not** used for the generated SVGs (see §11). Do not enable `dangerouslyAllowSVG`.
- ESLint `@next/next/no-img-element` must be disabled per line for decorative `<img>`, because lint runs with `--max-warnings=0`.
- Next 16: read `node_modules/next/dist/docs/` before touching `next/og`, `next/image` props, or metadata APIs (per `apps/web/AGENTS.md`).

## 19. Pending Assets and Unavailable Tools

| Pending asset | Why pending | Intended appearance / spec | Format & size | Exact integration point |
|---|---|---|---|---|
| On-model Aira extended poses: **thinking, waving, pointing, encouraging** | No AI image generation in this environment; must follow the locked anatomy (navy outline, cream face, 4 module tiles, orange rings, spark, tail fin, base dot) | Same rig as the canonical sheet. Waving: right hand raised, open palm. Pointing: right arm extended toward the viewer's right (use beside the form). Thinking: hand to chin, eyes up-left. Encouraging: thumbs-up-free open-palm gesture, warm smile. | Transparent PNG **384×456** (same art box as canonical), < 45 KB each; ideally also vector | Replace `apps/web/public/mascot/aira-{thinking,waving,surprised,pointing}.png` (same filenames so `AiraMascot`'s extended path works); add new names to `ExtendedPose` |
| Aira spark-anchor entries for new poses | Depends on the above | Re-run the measurement from `generate_assets.py`'s method | JSON | `mascots/aira-spark-anchors.json` |
| Vector (SVG) master of Aira | Not available; the PNGs show "raster edge roughness" at large size (Piece 3 R2 note) | Exact trace of the canonical 8 poses by an illustrator | SVG | Would enable `full` (480 px) size and crisp retina |
| Trainer portrait, real portal screenshots, VSL video + captions, student scorecards | Must be **real**, client-supplied (README "Content that must be supplied") | — | WebP/AVIF; MP4/WebM + VTT | `.portal-preview` (replace the concept mock), `VslPreview` dialog, `#results` |
| Lottie / transparent video | Not needed; no runtime and no tool | Covered by animated SVG + Motion | — | — |
| OG image with Aira | Code change, not an asset | Add `aira-front.png` to the right side of `opengraph-image.tsx` | 1200×630 | `apps/web/src/app/opengraph-image.tsx` |

**Unavailable capabilities:** AI image generation, AI video generation, Lottie authoring tools, and SVG rasterisation via Cairo (`libcairo` missing; Playwright was used instead).

## 20. Implementation Order and Priorities

1. **P1 – Bug fixes with assets:** footer logo (#18 via `BrandLogo`); module tableau clipping (§12.5); invisible spark pulse (§12.3).
2. **P1 – Hero:** #1 background, #8/#9 orbit stage, #14 shadow, plus the mobile hero handoff fix (§12.1).
3. **P1 – Proof section:** #5 (§11.3).
4. **P1 – Thank-you:** #10/#11 + shadow (§12.4).
5. **P1 – Modules atmosphere:** #2 + #3 wave edges (§11.2).
6. **P2:** VSL signal (#12/#13), final CTA (#4), 404 (#6), error (#7), `AiraSprite` optimization, test-type banner icon fix (§4.4.5).
7. **P3:** score-route draw, method path draw, audio-wave loop, Skill Signal hover swap, card lifts, OG image.
8. Update `design-loop-progress.md` (Piece 3 / Piece 4 status) after QA.

## 21. Validation and Testing Checklist

**Already verified while preparing this guide:**
- [x] All 18 generated files exist at the paths in §8 (`ls` verified, see §22 note).
- [x] Every source file and selector referenced in §9–§12 exists (grep verified).
- [x] Assets rendered in Chromium over `http://localhost:3000/assets/generated/...`: animated burst, VSL rings, orbit stage and wave mask all render. Previews are in `design/visual-assets/previews/`.
- [x] Spark anchors visually verified on all 8 canonical poses.
- [x] Application code untouched (`git status` shows only new files plus pre-existing changes).

**For the implementer:**
- [ ] `pnpm typecheck`, `pnpm lint` (zero warnings), `pnpm test`, `pnpm build`, `pnpm test:e2e` all pass.
- [ ] No 404s for `/assets/generated/**` in the browser network panel.
- [ ] Visual check at 1440, 1024, 768, 390 and 320 px on `/free-ielts-assessment`, `/thank-you`, a 404 URL, and `/mascot-demo` (spark overlay on all poses).
- [ ] No horizontal scroll at 320 px or 390 px (the e2e test plus manual check).
- [ ] Reduced motion (DevTools → Rendering → emulate `prefers-reduced-motion: reduce`): static twins load (check the Network tab for `-static.svg`), Aira is still, and no loops run.
- [ ] Footer logo has no visible box; header logo size is unchanged.
- [ ] Module tableau Aira is no longer cropped; the mobile hero shows message → Aira → form without the CTA bar covering Aira.
- [ ] Lighthouse: CLS < 0.1, no new long tasks from animations; axe has no new violations.
- [ ] Lead form still submits (dev preview mode) and redirects to `/thank-you`.

## 22. Final Instructions for the Next Coding AI

**Path verification performed:** every asset path in §8 and every source path in §10 was checked with `ls`/`grep` against the repository on 15 Oct 2026 after generation (see the summary in the task report).

### Instructions for the Next Coding AI

1. **Read this entire file** (`visual-assets-integration-guide.md`) before modifying any code. Also read `apps/web/AGENTS.md` (Next 16 differs from your training data), `SKYVOICE_DESIGN_SYSTEM.md`, and `design/mascot/style-bible.md`.
2. **Inspect every referenced source file** (§10) and confirm that the components, selectors and line anchors exist. Line numbers are approximate; search by selector or JSX.
3. **Review `apps/web/public/assets/generated/`** and use only the files that actually exist there (18 files, §8). Look at `design/visual-assets/previews/contact-sheet.webp` to see them.
4. **Follow the existing design system.** Use tokens from `globals.css :root` and keep the flat, rounded, navy-outline style. Do not introduce new colours, fonts, icon libraries or illustration styles.
5. **Integrate each asset exactly where documented** (§9, §11, §12, §13), in the priority order of §20.
6. **Implement the animations** in §14 using only `motion@14.2.0` (`motion/react`) and CSS. Ship every animated SVG through `<picture>` with its `-static` twin for `prefers-reduced-motion`.
7. **Preserve business logic:** do not change `LeadForm`, `lib/leads/*`, `/api/leads`, routes, metadata/structured data, navigation anchors, or legal copy. Keep the honest "pending/verified" content notes.
8. **Keep it responsive** at 320–1440+ px (§15) with no horizontal overflow and no mobile reliance on hover.
9. **Validate** image paths (no 404s), animation playback (normal and reduced motion), lazy/eager loading, and layouts (§21).
10. **Do not generate duplicate assets.** Reuse the canonical Aira PNGs, Skill Signals and brand SVGs. If a tweak is needed, edit `design/visual-assets/generate_assets.py` and re-run it rather than hand-editing the output files.
11. **Do not invent** assets, paths, components or dependencies. Do not use the off-model extended poses publicly, and do not add Lottie, GSAP, Three.js or video.
12. **If this guide conflicts with the code**, the code is the source of truth. Inspect it, adapt the integration, and note the deviation in your report.
13. **Test the completed implementation** with `pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm test:e2e` and fix any regressions you introduce.
14. **Report** what you integrated, what you deferred, any remaining issues (e.g. pending on-model poses, §19), and update `design-loop-progress.md` for Piece 3 and Piece 4.
