# Piece 1 Frozen Validation Pack

**Frozen:** 2026-10-15  
**Scope:** Round 43 revalidation and Round 44 only  
**Rule:** These criteria may not be changed after viewing a Round 44 result.

## Authorities

1. Functional brief: `brief-critic.md`
2. Sky Voice system: `system-critic.md` and `SKYVOICE_DESIGN_SYSTEM.md`
3. Craft benchmark: `craft-critic.md`, `bar.md`, and the immutable official benchmark below
4. Technical inspection: `validate_candidate.py`

## Fixed benchmark

- File: `design/mascot/benchmark/duo-official-widget-system-2023.png`
- SHA-256: `0BD9B9FF8D8EF77C8BB7EFB9CBD1014531EF002398D6D673B532FB9C2FD95CE5`
- Source page: <https://blog.duolingo.com/widget-feature/>
- Direct official asset: <https://storage.ghost.io/c/7a/33/7a33d0f4-927d-4fe8-a6bf-96131b5e76d4/content/images/2023/08/widgets.png>
- Rights: Duolingo retains all rights. Local retention is for internal comparative evaluation only. Do not ship, trace, recolor, redistribute, or feed it to image generation as an identity reference.

An older official silhouette-development image is retained as supporting research at `design/mascot/benchmark/duo-official-reshaping-2020.png`, SHA-256 `F3F30885F247B57CF47C8ECE5549FD0154884BAF822B806A34992BFC744EF4BC`. It is not the scored benchmark.

## Fixed thresholds

### Technical gate

- Canvas: exactly 1536 × 1024.
- Mode: RGBA.
- Transparent pixels exist and occupy at least 25% of the canvas.
- RGB contamination under fully transparent pixels: no more than 0.10% of transparent pixels.
- No non-empty pixel touches the outer canvas edge.
- Required white, black, checker, silhouette, and 96 px proofs exist.

### System evidence gate

- At least 90% of fully opaque character pixels fall within RGB distance 18 of the approved solid palette: navy `#0E2D5E`, cobalt `#1655D8`, orange `#EB9D13`, cream `#FFF4D6`, white `#FFFFFF`, and dark facial detail `#2B160E`.
- The machine metric is supporting evidence, not a replacement for visual inspection of flatness, outline consistency, adult tone, or brand derivation.
- Gloss, glow, cast shadow, atmospheric haze, and visibly modeled gradients are prohibited.

### Geometry and readability gate

- Eight states must be present in the fixed order: FRONT, 3/4, LISTENING, SPEAKING, READING, WRITING, FEEDBACK, CELEBRATION.
- FRONT and 3/4 must be visibly different without labels.
- At least 7/8 states must be identifiable from the unlabeled 96 px proof; all 8 must be identifiable from the unlabeled full-color render.
- The broken-orbit head, orange spark, tapered voice core, same-side speech tail, and base dot remain stable landmarks.
- Props support the action; they may not be the only action cue.

## Tool record

Run `python design/mascot/validation/validate_candidate.py --candidate <png> --round <round>`. The resulting JSON and Markdown files are part of the audit trail. Record the Python, Pillow, and NumPy versions in each output.

## Critic isolation

- Brief sees the functional brief and rendered proofs only. It ignores aesthetics.
- System sees the project design system, System rubric, and rendered/technical proofs only.
- Craft sees the frozen benchmark, applicable `bar.md` mechanisms, and blind comparison board only.
- All verdicts are binary. No weighted score may override a failed mandatory criterion.

## Change control

Any later threshold change requires a dated decision record and applies only to a future round. It cannot retroactively convert a failure into a pass.
