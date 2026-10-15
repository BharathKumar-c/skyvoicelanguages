# Piece 3 Round 2 — Builder Evidence

## Composition changes

- Desktop hero now uses a single three-part composition: concise offer, large
  unboxed speaking Aira, and the booking form.
- The assessment-preview card moved into its own section immediately below the
  hero and trust strip.
- Mobile orders the message, compact unboxed Aira beat, and form before the
  separate preview.
- The module section introduces Aira in the feedback pose with four small idle
  Skill Signals, then retains active signals in the individual module cards.

## Critic renders

- `qa/hero-desktop-r2.png`
- `qa/hero-mobile-r2.png`
- `qa/modules-desktop-r2.png`
- `qa/modules-mobile-r2.png`
- `qa/thank-you-desktop-r2.png`

## Verification

- ESLint: pass, zero warnings.
- TypeScript: pass.
- Vitest: 36/36 tests pass.
- Next.js production build: pass.
- Relevant Playwright checks: 8/8 pass across desktop and mobile (integration,
  completion context, axe scan, and viewport overflow).
- Production renders inspected at 1440 px desktop and 390 px mobile; no source
  pose labels, legacy artwork, development overlay, or horizontal overflow is
  visible.
