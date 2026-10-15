# Piece 2 Round 1 — Critic Evidence

## Candidate

- Critic-facing state board: `qa/skill-signal-system-r1-labeled-qa.png`
- Lead/support hierarchy proof: `qa/skill-signal-system-r1-hierarchy-qa.png`
- 96 px and 48 px proof: `qa/skill-signal-system-r1-small-size-qa.png`
- Transparency proofs: `qa/skill-signal-system-r1-checker-qa.png` and `qa/skill-signal-system-r1-black-qa.png`
- Transparent production master: `renders/skill-signal-system-r1.png`
- Web master: `apps/web/public/mascot/skill-signals/skill-signal-system.png`
- Twelve web-ready state assets: `{listening,reading,writing,speaking}-{idle,active,success}.png`

## Reproducibility

- Built-in image generation created the original transparent source from the saved prompt and the approved Round 44 Aira master as a visual-language reference.
- `process_piece2.py` converts every visible source pixel to the nearest locked brand color, removes crop-boundary specks, slices the 4 × 3 grid, and writes deterministic QA boards and web assets.
- Rebuild command: `python design/mascot/piece-2/process_piece2.py`
- Production master SHA-256: `F1465838F461BF08C018BB73CF1A187ABA1410288531115EC35688758FD66C3F`

## Objective evidence

- Every production PNG is RGBA and contains exactly four non-transparent RGB values: `#0E2D5E`, `#1655D8`, `#EB9D13`, and `#FFF4D6`.
- No signal has a face, limb, body, animal cue, or humanoid anatomy.
- The hierarchy proof uses the approved Aira artwork unchanged and shows each idle signal at supporting scale.
- Listening, Reading, Writing, and Speaking have four different idle silhouettes.
- Each column preserves one identity across Idle, Active, and Success.
- Active uses tilt and restrained orange action ticks; Success uses the shared four-point orange spark.
- The 48 px proof preserves the distinguishing receiver, page fold, writing strokes, and speech tail.
- Labels are drawn only by the deterministic processor and are absent from production assets.

## Critic routing

- Brief critic: inspect the labeled board, hierarchy proof, and small-size proof against `piece-2-brief.md`.
- System critic: inspect all QA proofs against `SKYVOICE_DESIGN_SYSTEM.md` and `design/mascot/style-bible.md`.
- Craft critic: inspect the rendered QA output only against `design/mascot/bar.md` and the frozen benchmark image. Do not inspect source or implementation.

## Known Round 1 judgment point

Listening and Speaking deliberately share the broken-orbit family so the set reads as one system. Their centers remain objectively distinct: Listening is circular, while Speaking has a downward speech tail. Critics should fail the round if that distinction does not survive the supplied 48 px proof.

