# Round 29 Builder Notes

## Intent

Keep the distinctive Round 28 Signal Core while correcting the remaining cute face language and loose tentacle-like articulation.

## Changes

- Replaced illustrated eyes and smile with small lozenge eyes, geometric brows, and compact mouth marks.
- Replaced free curls with exactly two readable shoulder–elbow–forearm paths.
- Standardized both endpoints as compact three-lobed signal hands.
- Preserved the broken orbit, orange spark, speech-tail, eight actions, palette, and transparent delivery.
- Kept props secondary and ensured elbows remain visible around cards.

## Deterministic finish

`design/mascot/process_r29.py` quantizes the five-color palette, replaces all label and score text, builds two shape-colored antialias bands, clears RGB under fully transparent pixels, and exports the white, black, checker, silhouette, and 96 px proofs.

## Visual QA result

At 96 px the small signal face remains adult and readable; elbows and three-lobed hands survive reduction; listening, speaking, reading, writing, feedback, and celebration remain distinct in the silhouette proof.
