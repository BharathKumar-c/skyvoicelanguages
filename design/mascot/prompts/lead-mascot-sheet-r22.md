# Aira Lead Mascot Sheet — Round 22 Vector Rig Record

Use case: authored reusable SVG component system

Round 22 intentionally used no image-generation tool. The accepted asset was authored as `apps/web/public/mascot/lead-mascot-sheet.svg` at 1536 × 1024 and rendered deterministically with `design/mascot/render_r22.py`.

## Structural changes

- Replaced raster-only anatomy with shared `<symbol>` components referenced through `<use>`.
- Reused one `logo-head`, one `torso`, one upper arm, one forearm, one mitten hand, one thigh, one calf, one wedge foot, one four-tile module group, one label pill, one passage card, and one feedback card.
- Built all pose differences using transforms, reflection, expression overlays, and layer order without changing component geometry or widths.
- Replaced the blazer/lapel outfit with one navy tapered signal-navigator torso, cobalt diagonal side panel, four cream tiles, cream V-neck, white sleeves, navy legs, brown mitten hands, and cobalt wedges.
- Preserved the logo-derived broken orbit, navy waveform frame, cream speech window, orange head spark, and eight expression roles.
- Set pose labels in the SVG using `Arial Rounded MT Bold` as the first requested font and clean centered uppercase text.
- Rebuilt the feedback card with large navy `BAND 7.5`, a small orange underline, cobalt progress, and one navy correction line.

## Validation contract

- `logo-head`, `torso`, `module-tiles`, and `label-pill`: 8 uses each.
- `upper-arm`, `forearm`, `mitten-hand`, `thigh`, `calf`, and `wedge-foot`: 16 uses each.
- `passage-card`: 2 uses.
- `feedback-card`: 1 use.
- No missing symbol references, raster embeds, gradients, filters, masks, opacity declarations, shadows, or external assets.
- Rendered PNG and Round 22 archive are byte-identical 1536 × 1024 RGBA files with four transparent corners and smooth native antialiasing.
