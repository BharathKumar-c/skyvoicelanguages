# Piece 2 Round 4 — Critic Evidence

## Candidate renders

- Full state board: `qa/skill-signal-system-r4-labeled-qa.png`
- Fixed-registration mechanics: `qa/skill-signal-system-r4-state-mechanics-qa.png`
- Normal 48 px proof: `qa/skill-signal-system-r4-48px-qa.png`
- Monochrome 48 px silhouette proof: `qa/skill-signal-system-r4-48px-monochrome-silhouette-qa.png`
- Lead/support hierarchy: `qa/skill-signal-system-r4-hierarchy-qa.png`
- Transparency proofs: `qa/skill-signal-system-r4-checker-qa.png` and `qa/skill-signal-system-r4-black-qa.png`
- Transparent master: `renders/skill-signal-system-r4.png`
- Twelve versioned production assets: `renders/{listening,reading,writing,speaking}-{idle,active,success}-r4.png`
- Published web assets: `apps/web/public/mascot/skill-signals/`

## Governing-gap evidence

- Idle is the smallest, most balanced carrier state in every role.
- Active changes large carrier masses: Listening projects a heavy right-facing receiver plate, Reading becomes a low wide wing/book stance, Writing extends its diagonal nib terminal, and Speaking stretches into a horizontal forward body with a swept rear tail.
- Success changes the vertical structure: both upper plates rise and rotate outward, the lower plate compresses beneath the body, and the center sits visibly higher within the release channel.
- The monochrome proof removes detached orange accents and converts all remaining visible artwork to one navy silhouette. At 48 px it still separates compact Idle, lateral/thrust Active, and vertically released Success.
- All four frozen role silhouettes remain distinct in each state.
- Aira remains unchanged and dominant in the hierarchy proof.

## Production verification

- All twelve production and published state files are 420 × 420 RGBA.
- Minimum transparent edge clearance is 42 px, exactly 10% of the production canvas and above the 8% requirement.
- The production/published master is a fixed-registration 1680 × 1260 RGBA contact sheet assembled only from final state assets.
- Every visible master pixel is exactly one of: `#0E2D5E`, `#1655D8`, `#EB9D13`, or `#FFF4D6`.
- Alpha range is 0–255.
- Production and published state hashes match for all twelve assets.
- Production/published master SHA-256: `552B261F03A5CD49062B5AF613C143ABF8BEFE975F280BCBC10B20C45D05A9F9`.
- Rebuild command: `python design/mascot/piece-2/process_piece2_r4.py`.
- Final generation prompt: `prompts/skill-signals-r4.md`.

## Critic routing

- Brief critic: judge the labeled board, hierarchy proof, and normal 48 px proof against the Piece 2 brief and Round 4 revision brief.
- System critic: judge the rendered QA against `SKYVOICE_DESIGN_SYSTEM.md` and `design/mascot/style-bible.md`.
- Craft critic: prioritize the 48 px monochrome silhouette proof, then compare the rendered system to `design/mascot/bar.md` and the frozen benchmark.

