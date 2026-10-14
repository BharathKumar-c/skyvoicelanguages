# Round 34 — Builder Notes

## Result

Round 34 matures Aira from a face-bearing emblem into a signal instrument. The core now contains one large navy vertical almond aperture and no conventional facial features. Three color-locked rigid orbit vanes carry every action around a shared rear-collar anchor.

## Production

- Final master: 1536 × 1024 RGBA.
- Generated with the built-in image-generation workflow using Round 33 as the edit reference.
- Deterministic label and feedback-card typography applied by `design/mascot/process_r34.py`.
- Palette quantized to navy, cobalt, orange, cream, and white.
- Alpha limited to 0, 96, 192, and 255; transparent RGB cleared to black.

## Validation

- Master SHA-256: `67D8BA19FB31D581FE8D4B32D468BC172EC3CD67949329128E2CDE13B347EB21`.
- Archive SHA-256: `67D8BA19FB31D581FE8D4B32D468BC172EC3CD67949329128E2CDE13B347EB21`.
- Alpha histogram: 0 = 911280; 96 = 27788; 192 = 28182; 255 = 605614.
- Corner alpha: 0, 0, 0, 0.
- Master/archive byte match: true.
- White, black, checkerboard, silhouette, and 96 px QA proofs exported.

## Rationale

The aperture remains legible when facial micro-details would vanish, and its single continuous shape avoids cute or cartoon coding. The longer orbit geometry gives the states larger action lines, while the page and score props stay simple enough to read in the 96 px proof.
