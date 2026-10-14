# Round 39 production notes

## Design response

Round 39 restores the sophisticated adult anatomy, proportions, gesture, and contour polish of Round 37. It deliberately does not use the crude Round 38 SVG bird as the visual base.

One identical three-segment broken orbit is rendered behind the upper torso of every pose before the premium bird is composited. The orbit uses a cobalt upper-left segment, navy upper-right segment, and orange lower-right segment. All eight copies share the same radii, 22 px stroke, 67-degree segment lengths, round caps, and gap pattern. The larger collar visibly extends beyond the bird silhouette without crossing the eye or beak.

The layered composite is flattened to twelve fixed brand-adjacent color planes. A restrained 3 px mode cleanup removes isolated glossy remnants from the character planes while the original label bands are restored untouched. The original antialiased alpha is retained.

## Files

- Anatomy source: `lead-mascot-sheet-r37.png`
- Processor: `design/mascot/process_r39.py`
- Layered pre-flattening composite: `lead-mascot-sheet-r39-raw.png`
- Final/archive: `lead-mascot-sheet-r39.png`
- Master: `apps/web/public/mascot/lead-mascot-sheet.png`
- QA: `lead-mascot-sheet-r39-white-qa.png`, `-black-qa.png`, `-checker-qa.png`, `-silhouette-qa.png`, and `-96px-qa.png`

## Validation

- Dimensions/mode: 1536 × 1024 RGBA
- Palette: twelve deterministic solid brand-adjacent planes; no adaptive palette or dithering
- Alpha levels: 238 retained antialias values, range 0–255
- Transparent canvas corners: 0 alpha at all four corners
- Nontransparent bounds: `(19, 22, 1523, 1023)`
- Opaque RGB colors: exactly 12, matching the fixed palette
- Master/archive SHA-256: `6636FE74D5D9E9ABBCFF8917EB389D2615ED71C633A367862CA7C53E4191B8D6`

## Preservation

All Round 37 and Round 38 assets remain preserved. Round 37 remains the anatomy source; Round 38 remains available as the deterministic-vector exploration.
