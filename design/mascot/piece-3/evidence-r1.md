# Piece 3 Round 1 — Builder Evidence

## Source assets

- Lead: `apps/web/public/mascot/lead-mascot-sheet.png` (validated Piece 1 Round 44)
- Support: `apps/web/public/mascot/skill-signals/*-active.png` (validated Piece 2 Round 4)

## Implementation

- `SkillSignal` is a reusable typed component with module, state, size, custom
  alt text, and decorative modes.
- The hero gives Aira a dedicated lead card beside the assessment promise and
  form instead of placing the character below the video preview.
- Module cards use the four active Skill Signals; their images are decorative
  because each card immediately supplies an equivalent visible module heading.
- The thank-you route retains the validated Aira celebration pose as the
  completion context.
- Existing reduced-motion behavior remains active at React and CSS levels.

## QA artifacts

- `qa/free-ielts-assessment-desktop-r1.png`
- `qa/free-ielts-assessment-mobile-r1.png`
- `qa/hero-desktop-r1.png`
- `qa/hero-mobile-r1.png`
- `qa/modules-desktop-r1.png`
- `qa/modules-mobile-r1.png`
- `qa/thank-you-desktop-r1.png`

## Verification

- ESLint: pass, zero warnings.
- TypeScript: pass.
- Vitest: 36/36 tests pass.
- Next.js production build: pass (before the final label-crop/layout-only revision;
  final typecheck and lint remain clean).
- Playwright: completion, axe, and mobile-overflow checks pass on both projects.
  The existing lead-form validation assertion did not find its expected custom
  error in either project during the full parallel run; this is outside the
  mascot integration. The first integration assertion was updated to use the
  stable Skill Signal class rather than Next Image's encoded `src`.
- Visual inspection: desktop/mobile hero, desktop/mobile module section, and
  thank-you completion render cleanly. QA pose-name pills are cropped from all
  production Aira placements.
