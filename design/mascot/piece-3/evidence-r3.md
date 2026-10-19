# Piece 3 Round 3 — Builder Evidence

## Composition

- Desktop hero is two columns: integrated offer/Aira field plus booking form.
- Speaking Aira renders at 360 px inside a 384 px native crop and occupies the
  intended share of the left field.
- Mobile uses a compact 0.62-scale Aira beat with the form immediately below.
- Module introduction is unboxed: native-crop feedback Aira owns the left
  column; short copy and four idle Skill Signals form the right column.

## Asset delivery

- Eight exact 384 × 456 canonical crops were exported to
  `apps/web/public/mascot/canonical/` from the validated Round 44 sheet.
- `AiraSprite` now uses these individual lossless PNG files without Next image
  recompression and never requests display width above the native 384 px.

## Critic renders

- `qa/hero-desktop-r3.png`
- `qa/hero-mobile-r3.png`
- `qa/hero-mobile-form-handoff-r3.png`
- `qa/modules-desktop-r3.png`
- `qa/modules-mobile-r3.png`
- `qa/thank-you-desktop-r3.png`

## Verification

- ESLint: pass, zero warnings.
- TypeScript: pass.
- Vitest: 36/36 tests pass.
- Next.js production build: pass.
- Focused Playwright: 8/8 pass across desktop and mobile (integration,
  completion context, axe scan, and viewport overflow).
- All six Round 3 production renders were inspected; the mobile handoff capture
  includes Aira, the form heading, and the first two fields without dead space.
