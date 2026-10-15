# Piece 2 Round 3 — Critic Evidence

## Candidate renders

- Full state board: `qa/skill-signal-system-r3-labeled-qa.png`
- Fixed-registration carrier comparison: `qa/skill-signal-system-r3-state-mechanics-qa.png`
- 48 px identity and state proof: `qa/skill-signal-system-r3-48px-qa.png`
- Lead/support hierarchy: `qa/skill-signal-system-r3-hierarchy-qa.png`
- Transparency proofs: `qa/skill-signal-system-r3-checker-qa.png` and `qa/skill-signal-system-r3-black-qa.png`
- Transparent master: `renders/skill-signal-system-r3.png`
- Twelve versioned production assets: `renders/{listening,reading,writing,speaking}-{idle,active,success}-r3.png`
- Published web assets: `apps/web/public/mascot/skill-signals/`

## Governing-gap evidence

- Outer silhouette now distinguishes roles before center inspection: Listening is a right-opening receiver, Reading a broad book/shield, Writing a diagonal nib/diamond, and Speaking a long-tailed speech orbit.
- The set still shares three thick navy/cobalt carrier plates, three economical gaps, cream centers, and one contour language.
- Active widens the carrier along the role direction. Detached orange action marks were removed during production cleanup so the carrier must carry the state.
- Success opens a materially larger top release channel while retaining each role silhouette; the spark and dot trajectory are secondary reinforcement.
- All twelve production assets share a 420 × 420 transparent canvas. This preserves relative state scale and prevents implementation from normalizing away compression/expansion.
- The final labeled and 48 px boards contain four complete, unclipped symbols in every row.
- Aira remains unchanged and visibly dominant in the hierarchy proof.

## Production verification

- The production and published masters are fixed-registration 1680 × 1260 RGBA contact sheets assembled from the twelve final 420 × 420 assets; they contain exactly four visible RGB values: `#0E2D5E`, `#1655D8`, `#EB9D13`, and `#FFF4D6`.
- Alpha range is 0–255.
- All twelve published files exactly match their versioned Round 3 renders and are 420 × 420 RGBA.
- Production/published master SHA-256: `6727A09D77333F71B6D78154347AA1D5F50DEE6B1D1F052FB7DFD7AA0FC39D2C`.
- Rebuild command: `python design/mascot/piece-2/process_piece2_r3.py`.
- Final generation prompt: `prompts/skill-signals-r3.md`.

## Critic routing

- Brief critic: judge the labeled board, hierarchy proof, and 48 px proof against `piece-2-brief.md` plus the Round 3 revision brief.
- System critic: judge rendered QA only against `SKYVOICE_DESIGN_SYSTEM.md` and `design/mascot/style-bible.md`.
- Craft critic: judge the rendered Round 3 output against `design/mascot/bar.md` and the frozen benchmark without reading implementation.

