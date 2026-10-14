# Round 40 production notes

## Provenance

The visual source `lead-mascot-sheet-r40-imagegen-white.png` was produced with the built-in image-generation system for this design-loop round. Round 40 is a deliberate category pivot from the Signal-Starling to Aira, an original adult human Signal Mentor. No Round 39 bird pixels or Round 38 vector character geometry are used in the Round 40 artwork.

## Design response

The source supplies the premium anatomy, warm brown skin, mature proportions, paired cobalt/navy crescent hair, vertical signal crest, same-shoulder speech-tail scarf, cream/navy outfit, orange signal pin, hand construction, shoe construction, visible expression range, props, and eight pose order. Processing is intentionally minimal: white-background extraction, edge unmatting, per-cell fitting, deterministic labels, and QA generation. The artwork is not posterized, vectorized, or repainted.

## Background extraction

The extractor identifies only neutral near-white pixels connected to the outer canvas. Enclosed cream/white forms—including the jacket, pages, feedback card, chair block, and signal crest—remain foreground. Border-connected transition pixels receive recovered antialiased alpha and are unmatted from white. Fully transparent RGB is normalized to black.

## Files

- Built-in image-generation source: `lead-mascot-sheet-r40-imagegen-white.png`
- Processor: `design/mascot/process_r40.py`
- Extracted raw: `lead-mascot-sheet-r40-raw.png`
- Final/archive: `lead-mascot-sheet-r40.png`
- Master: `apps/web/public/mascot/lead-mascot-sheet.png`
- QA: `lead-mascot-sheet-r40-white-qa.png`, `-black-qa.png`, `-checker-qa.png`, `-silhouette-qa.png`, and `-96px-qa.png`

## Validation

- Dimensions/mode: 1536 × 1024 RGBA
- Alpha: 256 retained antialias levels, range 0–255
- Nontransparent bounds: `(52, 8, 1485, 1013)`
- Transparent canvas corners: 0 alpha at all four corners
- Fully transparent pixels with nonblack RGB: 0
- Master/archive SHA-256: `C44F0952C7D8A339B161A788C5A28637B3C57D18353FE35650C0C87C470C5D81`

## Preservation

All Round 37, Round 38, and Round 39 source, archive, and QA assets remain preserved. No website integration is included in this round.
