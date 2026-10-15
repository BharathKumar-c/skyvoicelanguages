# Piece 2 Round 2 — Critic Evidence

## Candidate renders

- Full state board: `qa/skill-signal-system-r2-labeled-qa.png`
- Carrier-only comparison: `qa/skill-signal-system-r2-state-mechanics-qa.png`
- Lead/support hierarchy: `qa/skill-signal-system-r2-hierarchy-qa.png`
- 48 px identity and state proof: `qa/skill-signal-system-r2-48px-qa.png`
- Transparency proofs: `qa/skill-signal-system-r2-checker-qa.png` and `qa/skill-signal-system-r2-black-qa.png`
- Transparent production master: `renders/skill-signal-system-r2.png`
- Twelve versioned transparent assets: `renders/{listening,reading,writing,speaking}-{idle,active,success}-r2.png`
- Published web assets: `apps/web/public/mascot/skill-signals/`

## Governing-gap evidence

- All four Idle states now share the same enclosing three-plate broken-orbit carrier.
- Reading and Writing no longer float as standalone page/application icons; their center modules sit inside the same carrier as Listening and Speaking.
- Active changes the carrier: plates spread, the directional opening widens, and the lower-right plate advances toward the action direction.
- Success is a distinct open-upward carrier configuration. The upper plates separate around a large release gap while the four-point orange spark and two-dot trajectory rise out of the carrier.
- Listening and Speaking are distinguished at 48 px by inward receiver notch versus long downward speech tail and orange voice dot.
- The hierarchy proof reuses approved Aira unchanged and keeps all signals at supporting scale.

## Production verification

- `process_piece2_r2.py` builds the versioned Round 2 master and all QA evidence before replacing web outputs.
- Production master and published master are both 1448 × 1086 RGBA.
- Both contain exactly four visible RGB values: `#0E2D5E`, `#1655D8`, `#EB9D13`, and `#FFF4D6`.
- Alpha range is 0–255, confirming genuine transparent and opaque pixels.
- Production and published master SHA-256: `9220C35AA38727B19713C2314C41ACBA1AEB01B414B8850C5A916EDF2F209FDD`.
- Rebuild command: `python design/mascot/piece-2/process_piece2_r2.py`.
- Final generation prompt: `prompts/skill-signals-r2.md`.

## Critic routing

- Brief critic: judge the labeled board, hierarchy proof, and 48 px proof against `piece-2-brief.md` plus `round-2-revision-brief.md`.
- System critic: judge rendered QA only against `SKYVOICE_DESIGN_SYSTEM.md` and `design/mascot/style-bible.md`.
- Craft critic: compare the rendered Round 2 system against `design/mascot/bar.md` and the frozen benchmark render without inspecting implementation.

