# Aira Lead Mascot Sheet — Round 24 Silhouette and Rig Lock

Use case: precise reference-guided character edit

Inputs:

1. `apps/web/public/mascot/lead-mascot-sheet.png` at the start of the round (preserved as `lead-mascot-sheet-r23-pre-r24-preserved.png`) is the visual target.
2. `SKYVOICE - LOGO FILES/PNG/SKYVOICE ICON@300x-8.png` is the structural reference for the broken arcs, voice path, lower-left orange segment, and spark.

## Goal

Keep Round 23's mature professional tone, eight IELTS actions, props, palette, and composition. Correct only the two critic gaps: make Aira identifiable in solid silhouette and make every limb/hand/foot visibly belong to one reusable rig.

## Owned outer silhouette

- The outer apparatus is never a circle: one cobalt upper-left arc and one separate cobalt right/lower arc retain a clear top air gap and a second lower-left air gap, each about 10–12% of head diameter.
- A short orange arc occupies the lower-left region without closing its gap.
- The navy voice path protrudes above the face as a small crest and below it as a short pointed waveform neck entering the collar.
- The orange four-point spark sits outside the upper-right arc and remains readable in the 320 × 213 proof.
- The compact cream face window remains expressive and unobstructed.
- Aira's neutral face uses one gently raised brow and a controlled asymmetric half-smile.

## Owned body silhouette

- The cobalt asymmetric side panel ends in one short right-hip speech-tail wedge, projecting 20–25% of torso width in every state.
- The wedge is a compact permanent contour landmark, never a cape, armor plate, skirt, or coat tail.

## Reusable articulation rig

- Use one upper-arm capsule width and one narrower forearm capsule width in all states.
- Use one brown mitten mass with a single thumb notch; no fingers.
- Reuse one thigh width, calf width, and cobalt low-wedge foot scale.
- Preserve coherent shoulder, elbow, wrist, hip, knee, and ankle attachment points under rotation, overlap, and modest foreshortening.
- The `3/4` figure rotates head, torso, and pelvis together and partially occludes far limbs.

## Preserved system

- Mature sturdy approximately 5.75-head proportions.
- Navy tapered navigator vest, cobalt panel, exactly four cream tiles, cream V-neck, white sleeves, navy trousers, cobalt shoes, medium-brown hands.
- Eight complete actions in the existing four-column by two-row layout: FRONT, 3/4, LISTENING, SPEAKING, READING, WRITING, FEEDBACK, CELEBRATION.
- Reading/writing passage card, exactly three speaking bars, and the cream feedback card.
- Exact locked six-color palette, rounded navy linework, flat fills, transparent background, no glow/haze/shadow/texture.

## Deterministic finishing

Generated label pills and feedback title area remain blank. `design/mascot/process_r24.py` overlays the eight exact labels in Arial Rounded MT Bold and `BAND 7.5` in navy Arial Bold, quantizes opaque interiors to the locked palette, creates shape-coloured alpha bands at 192 and 96, clears all other pixels to transparent black, and exports the full QA set.

## Output

- Master: `apps/web/public/mascot/lead-mascot-sheet.png`
- Raw: `design/mascot/rounds/lead-mascot-sheet-r24-raw.png`
- Archive: `design/mascot/rounds/lead-mascot-sheet-r24.png`
- QA: `design/mascot/rounds/lead-mascot-sheet-r24-*qa.png`

