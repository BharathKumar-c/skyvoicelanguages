# Round 38 production notes

## Design response

Round 38 replaces the over-rendered Round 37 bird with a deterministic flat SVG rig while retaining its mature long-legged attitude. Aira's permanent silhouette signature is now the three-segment broken orbit around the upper torso: cobalt at upper left, navy at upper right, orange at lower right. Its geometry and gaps are identical in all eight states and each segment extends beyond the torso.

The anatomy is constructed from registered reusable groups: teardrop torso, side/front head keys, three-lobe wing, two-peak speech-notch tail, connected leg/three-toe foot, chest spark, orbit, page, result card, and signal arcs. The same wing, tail, orbit, torso, leg, and prop groups are reused with SVG transforms rather than redrawn per pose.

## Rendering

- Vector authority: `design/mascot/source/lead-mascot-r38.svg`
- Renderer: `design/mascot/process_r38.py`
- Master: `apps/web/public/mascot/lead-mascot-sheet.png`
- Archive: `design/mascot/rounds/lead-mascot-sheet-r38.png`
- Raw Cairo render: `design/mascot/rounds/lead-mascot-sheet-r38-raw.png`
- QA: white, black, checker, silhouette, and 96 px proofs beside this file

## Validation

- Master and archive: 1536 × 1024 RGBA
- Transparent canvas corners: 0 alpha at all four corners
- Fully transparent pixels normalized to black RGB
- SVG gradient/filter/glow/shadow definitions: 0
- Solid source palette: navy `#0E2D5E`, cobalt `#1655D8`, orange `#EB9D13`, cream `#FFF4D6`, white `#FFFFFF`
- Alpha range: 0–255 with antialiasing retained
- Nontransparent bounds: `(26, 16, 1510, 1009)`
- SHA-256, archive and master: `A024BACC372A4C22563812A22CC4DC359909FD92E37B7352EB7F97436732108F`

## Preservation

All Round 37 source, generated reference, archive, and QA files remain unchanged under `design/mascot/rounds/`.
