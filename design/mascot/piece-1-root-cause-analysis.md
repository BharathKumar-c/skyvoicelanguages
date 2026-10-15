# Piece 1 Root-Cause Analysis

**Project:** SKYVOICE  
**Character:** Aira Signal Navigator  
**Audit date:** 2026-10-15  
**Scope:** Piece 1 — style bible and lead mascot, Rounds 1–43  
**Audit state:** Creative generation stopped. Round 44 has not been started.

> **Post-audit outcome, 2026-10-15:** The recommended recovery was executed in order. A fixed official benchmark and checksummed validation pack were frozen; Round 43 revalidated as Brief PASS / System FAIL / Craft FAIL; Round 44 revision 2 achieved fresh-context PASS / PASS / PASS. See `design/mascot/validation/results/`, `design/mascot/rounds/lead-mascot-sheet-r44-notes.md`, and `design-loop-progress.md`.

## 1. Executive Summary

Piece 1 has not failed 43 times under one stable, reliable test. It has passed through at least seven substantially different character architectures while the brief, style bible, prompts, comparison evidence, and critic interpretations also changed. The recorded result is therefore not evidence that 43 controlled refinements failed. It is evidence that the experiment was not controlled.

The most important confirmed findings are:

1. **The Brief critic was given the wrong job.** The Design Loop requires this critic to judge function and ignore aesthetics. Historical verdicts repeatedly fail the work for being insufficiently “premium,” “sophisticated,” “ownable,” or polished. Brief recorded **0 PASS results in 42 validated rounds**, even when the System and Craft critics passed. This role drift made the gate partly duplicate Craft and made PASS dependent on unbounded taste.
2. **The Craft critic did not receive the required visual evidence.** The Design Loop requires a blind, side-by-side comparison of our render and the rendered reference. No retained Duolingo/Duo benchmark render or blind comparison artifact was found. The only filename containing `reference` is an internally generated Round 36 image. A critic without the reference cannot reliably decide whether our work beats it.
3. **The evaluation target moved.** The style bible was repeatedly revised to describe the latest output. It currently declares Round 42 authoritative although Round 43 assets exist. It also says both to preserve Round 42's rendering and to avoid gradients, while that source contains modeled tonal transitions. The output was influencing the rules that were supposed to constrain the output.
4. **The build target was too broad.** A canonical identity, eight poses, eight expressions, props, transparency, small-size behavior, animation readiness, brand semantics, and benchmark superiority were being solved and judged as one piece. The Design Loop explicitly calls for the smallest independently judgeable pieces.
5. **The iteration strategy repeatedly changed the character architecture.** The work moved among blob, logo, human, numeral, bird, abstract core, and glyph-head concepts. Improvements to one architecture could not accumulate because later rounds replaced it.
6. **Technical QA was conflated with design validation.** The processors reliably test dimensions, transparency, extraction, hashes, and produce viewing proofs. They do not objectively test landmark consistency, expression range, pose recognition, adult tone, originality, or benchmark superiority.
7. **Round 43 is not FAIL/FAIL/FAIL.** Its files exist, but no Round 43 critic verdicts are recorded. Its accurate state is **NOT RUN / NOT RUN / NOT RUN**. The prior status line inherited the Round 42 result and is a documentation error.

The correct next step is not Round 44. It is to repair and freeze the evaluation system, reconcile the flat-rendering decision, validate the existing Round 43 candidate with the corrected protocol, and only then make one bounded refinement if a measured gap remains.

## 2. Current Design Status

| Item | Audited status |
|---|---|
| Piece 1 completion | Not complete |
| Last fully evaluated round | Round 42 — FAIL / FAIL / FAIL |
| Round 43 | Asset produced; critic validation not run |
| Canonical website master | Still points to the Round 42-era master |
| Style-bible authority | Declares Round 42 |
| Round 43 prompt/notes | Not found |
| Fixed external benchmark render | Not found |
| Blind side-by-side comparison | Not found |
| Full retained critic reports | Not found; only condensed gap-history lines are available |
| Round 44 | Not started |

The current Aira identity is the glyph-headed Signal Navigator described in `design/mascot/style-bible.md`: broken-orbit head, external orange spark, tapered voice core, four module tiles, articulated arms, speech-tail fin, and floating base. This is the identity that the recovery plan preserves.

## 3. Evidence Reviewed

### Governing documents

- `design-loop-progress.md` — status table and recorded gap history.
- `design/mascot/style-bible.md` — current Round 42 character specification and acceptance checks.
- `SKYVOICE_DESIGN_SYSTEM.md` — brand palette, adult audience, illustration language, originality rule, and open design decisions.
- `bar.md` — seven benchmark mechanisms used by the Craft critic.
- `C:/Users/hissupport/.codex/skills/design-loop/SKILL.md` — critic roles and required blind comparison procedure.

### Assets and production evidence

- All available files under `design/mascot`, including 43 Markdown files, 248 PNGs, 24 Python files, and 5 SVGs at audit time.
- Round 1–43 final images and their available white, black, checker, silhouette, and 96 px proofs.
- `design/mascot/audit-contact-sheet-r1-r43.png`, created from the existing round outputs for this audit only.
- Representative generation instructions and notes from early, middle, and late rounds.
- Representative processors, especially `design/mascot/process_r41.py` and the Round 42/43 variants.
- Website master `apps/web/public/mascot/lead-mascot-sheet.png`.

### Quantitative verdict audit

The progress log contains 42 complete three-critic verdict sets, or 126 verdicts:

| Critic | PASS | FAIL | Pass rate |
|---|---:|---:|---:|
| Brief | 0 | 42 | 0% |
| System | 10 | 32 | 23.8% |
| Craft | 1 | 41 | 2.4% |

System PASS occurred in Rounds 6, 7, 23, 24, 25, 26, 31, 32, 34, and 35. Craft PASS occurred only in Round 25. No round achieved PASS/PASS/PASS. There is no critic evidence for Round 43.

## 4. Historical Failure Analysis

This table reports the available evidence; it does not invent missing critic reasoning. “B/S/C” means Brief/System/Craft.

| Round | Architecture or change | Recorded result | Dominant recorded failure |
|---:|---|---|---|
| 1 | Generic audio-wave form | F/F/F | No adult IELTS cue; childlike body; static actions |
| 2 | Purple fantasy mentor | F/F/F | Children's fantasy semantics; cluttered anatomy |
| 3 | Abstract waveform blob | F/F/F | Weak coach identity; off-palette; arm drift |
| 4 | Blue waveform blob | F/F/F | Generic identity; poor contrast; merged limbs |
| 5 | Personified brand glyph | F/F/F | Logo-with-props; dark glow; repeated body action |
| 6 | Adult human coach | F/P/F | System fit improved; proprietary silhouette absent |
| 7 | Human with orbit signature | F/P/F | Customer-support reading; thumbnail dependence on detail |
| 8 | Personified Band 9 | F/F/F | Juvenile edtech; glow/gradients; unstable limbs |
| 9 | Simplified Band 9 form | F/F/F | Magnifying-glass/lollipop reading; label/prop dependence |
| 10 | Orbit-scarf mentor | F/F/F | Rough anatomy; generic mentor; cluttered action lines |
| 11 | Polished human mentor | F/F/F | Stock styling; smoky glow; muddy layered silhouette |
| 12 | Signal creature / sky ray | F/F/F | Read as childlike elephant; changing wings |
| 13 | Lyrebird | F/F/F | Generic bird; large eyes; excessive feather parts |
| 14 | Modular lyrebird | F/F/F | Sports mascot; promotional badge; brittle silhouette |
| 15 | Waveform-haired mentor | F/F/F | Superhero reading; transparency; complex anatomy |
| 16 | Academic coach | F/F/F | Clock/timekeeping cue; costume; intricate rig |
| 17 | Coach with result card | F/F/F | Repeated expressions; chibi proportions; prop reliance |
| 18 | Mature corporate coach | F/F/F | Adult function but generic identity and weak brand structure |
| 19 | Speech/equalizer hair | F/F/F | Stock vector; tiny detail; generic silhouette |
| 20 | Logo-mask coach | F/F/F | Opaque mask blocks emotion; distressed labels |
| 21 | Open-face logo head | F/F/F | Generic corporate finish; unreadable small text; body drift |
| 22 | Reusable SVG rig | F/F/F | Draft-quality anatomy; youthful proportions; unresolved turn |
| 23 | Raster logo-head coach | F/P/F | On-system; generic overall silhouette; limb-width drift |
| 24 | Signal-tail logo-head | F/P/F | On-system; stock-edtech reading; stiff acting |
| 25 | Signal-shell character | F/P/P | System and Craft pass; Brief still fails on polish/ownership |
| 26 | Polish pass on R25 | F/P/F | Generic human construction; loose rig; disputed ownership |
| 27 | Signal myna | F/F/F | Generic cartoon bird; juvenile tone; geometry drift |
| 28 | Floating Signal Core | F/F/F | Brand-native but cute/anime; undefined tube-limb rig |
| 29 | Geometric Signal Core | F/F/F | Circular/chibi form; mitten hands; action tangencies |
| 30 | Tall Signal Navigator | F/F/F | Stern expression set; inconsistent hands and joints |
| 31 | Warm expression library | F/P/F | System pass; heavy clip-art rendering; assembly-like anatomy |
| 32 | Outline-light Navigator | F/P/F | System pass; critic still cites childlike finish and joins |
| 33 | Orbit-plate articulation | F/F/F | Architecture change did not resolve readable, natural acting |
| 34 | Simplified plate rig | F/P/F | System pass; craft/brief ownership and articulation gap remains |
| 35 | Refined abstract Navigator | F/P/F | System pass; insufficient emotional/character authority |
| 36 | Starling/bird reset | F/F/F | New architecture; Duolingo adjacency and lost flat-system fit |
| 37 | Refined bird | F/F/F | Generic bird identity; rendering/anatomy instability |
| 38 | Mature bird variation | F/F/F | Visual polish did not remove benchmark/category similarity |
| 39 | Bird system refinement | F/F/F | Persistent anatomy drift and wrong rendering language |
| 40 | Adult human reset | F/F/F | Credible adult but generic, losing brand-native ownership |
| 41 | Glyph-head Navigator | F/F/F | Stronger identity; youthful/game-like finish, gradients, joints |
| 42 | Refined glyph-head Navigator | F/F/F | Identity retained; tonal/gradient conflict and rig consistency remain |
| 43 | Glyph-head candidate with revised skill rail | **Not run** | Asset exists, but no critic prompts, reports, or verdicts were found |

### Phase-level interpretation

- **Rounds 1–5:** The process searched for meaning and ownership, changing the body concept almost every round.
- **Rounds 6–11:** Adult human forms improved brand-system fit but could not satisfy the open-ended ownership test.
- **Rounds 12–14:** Animal experiments introduced juvenile tone and animation complexity.
- **Rounds 15–26:** Human/logo-head concepts accumulated the best System results. Round 25 also achieved the only Craft PASS, but the next round abandoned that local stability after a subjective Brief failure.
- **Rounds 27–35:** Abstract signal forms improved originality but repeatedly traded emotional warmth for geometric novelty.
- **Rounds 36–39:** Bird concepts reintroduced direct category resemblance to Duolingo and discarded previously learned architecture.
- **Rounds 40–43:** The process returned to human and then glyph-headed concepts. R41–R43 are the clearest preservation of a brand-native architecture, but evaluation and source-of-truth control broke down.

## 5. Recurring Failure Patterns

### 5.1 Architecture churn

The contact sheet shows seven broad architecture families: blob/wave, logo-form, human coach, Band 9/numeral, bird, abstract signal core, and glyph-head navigator. This prevented cumulative refinement of a stable rig. Feedback about a hand joint in one architecture cannot improve a bird or an armless orbit-plate architecture in the next.

### 5.2 A three-way tension left unresolved

The work was repeatedly pushed toward all three of the following without objective boundary conditions:

- expressive and friendly enough to be a mascot;
- serious and adult enough for IELTS candidates;
- simple and proprietary enough to remain recognizable in silhouette.

Cute facial features satisfied expression but failed adult credibility. Abstract forms satisfied originality but failed emotion and coaching semantics. Human coaches satisfied adult credibility but failed ownership. The issue is not that these goals are impossible; it is that no measurable adult-expression specification was frozen before generation.

### 5.3 Feedback caused collateral regressions

Builders often fixed the latest “single biggest gap” by changing the entire concept. That introduced new failures in palette, anatomy, meaning, or system fit. R25 to R26 is the clearest warning: a Craft PASS became a Craft FAIL after a nominal polish pass.

### 5.4 Prompt growth and contradiction

Late prompts attempted to lock anatomy, palette, props, labels, rendering, action, emotion, production extraction, and benchmark position simultaneously. The Design Loop names over-specification as a failure mode because it removes useful builder judgment. More constraints did not create more consistency; they created conflicting priorities and brittle outputs.

### 5.5 Labels and props substituted for acting

Across multiple families, critics reported that listening, reading, writing, and feedback were identifiable because of a prop or label rather than the whole-body action line. The pose sheet layout made it possible to mistake semantic annotation for character performance.

### 5.6 Subjective terms operated as hidden criteria

“Premium,” “ownable,” “sophisticated,” and “professional” appear throughout verdicts, but they were never converted into observable mechanisms. A binary gate cannot be repeatable when its decisive terms are undefined.

## 6. Confirmed Root Causes

### RC1 — Brief critic role contamination

**Evidence:** The governing skill says, “Judge only against the stated goal… Ignore aesthetics.” Historical Brief verdicts repeatedly cite generic clip art, polish, sophistication, premium quality, and visual ownership. Brief returned no PASS in 42 complete rounds.

**Effect:** The Brief critic duplicated Craft, applied an undefined taste bar, and could veto functionally complete work indefinitely.

### RC2 — Missing Craft benchmark evidence

**Evidence:** The governing skill requires the rendered output and rendered reference side by side with identifying labels removed. No retained external benchmark screenshot or blind comparison artifact exists in the audited files.

**Effect:** Craft verdicts were not independently reproducible. A critic could compare against memory or an invented ideal.

### RC3 — Unfrozen and internally inconsistent source of truth

**Evidence:** `style-bible.md` identifies Round 42 as canonical while Round 43 files exist. It says to preserve the Round 42 generated source, not repaint it, and also not use gradients. The design-system illustration language requires flat 2D art with navy outlines, while some iteration prompts moved toward outline-light/modelled rendering.

**Effect:** Builders could not satisfy every instruction at once. Critics could select different authorities and all be textually defensible.

### RC4 — Piece decomposition failure

**Evidence:** Piece 1 combines the style bible, canonical identity, eight poses, expression library, prop system, rendering finish, transparent production assets, thumbnail behavior, and animation readiness. This is not the smallest independently judgeable unit required by the Design Loop.

**Effect:** A failure in one pose or extraction detail invalidated an entire character system, while broad redesigns destabilized already-correct areas.

### RC5 — Concept replacement instead of controlled correction

**Evidence:** The 43-round contact sheet and gap history document repeated transitions between unrelated architectures.

**Effect:** The loop did not preserve wins. It behaved as repeated concept generation rather than iterative improvement.

### RC6 — Technical QA mislabeled as design validation

**Evidence:** The processors verify image mode, dimensions, alpha behavior, hashes, extraction, and output proofs. They do not measure pose recognition, component geometry, expression distinction, adult credibility, brand ownership, or benchmark superiority.

**Effect:** “Validation successful” in production notes could mean only that a valid PNG was created, while the design critics still had no objective evidence.

### RC7 — Scope-inappropriate Craft mechanisms

**Evidence:** `bar.md` includes a website-section composition mechanism and a motion mechanism. Piece 1 is a static mascot sheet, so neither can be verified from its rendered PNG.

**Effect:** The Craft critic was asked, explicitly or implicitly, to judge evidence that the piece could not contain.

### RC8 — Design-system decision debt

**Evidence:** `SKYVOICE_DESIGN_SYSTEM.md` specifies flat, rounded 2D illustration with confident navy outlines and a waveform/star-derived guide, but its “Open design inputs” section still says to decide between commissioning a mascot and launching with abstract illustration.

**Effect:** A mandatory mascot loop was run against a design system that still represented the mascot itself as unresolved. The user's later approval of Aira should have been recorded as a formal decision and the open item closed.

### RC9 — Inadequate evidence retention and status integrity

**Evidence:** Full critic prompts and responses were not retained for most rounds; Round 43 assets have no recorded validation; the progress table nevertheless labels R43 FAIL/FAIL/FAIL.

**Effect:** Results cannot be audited or replayed reliably, and the status table overstates negative evidence.

## 7. Validation System Findings

### 7.1 Brief critic

**Correct purpose:** Determine whether the artifact functionally fulfills the approved Piece 1 brief. Ignore aesthetics.

**Previous effective criterion:** A mixture of function, originality, polish, premium feel, adult tone, and long-term brand ownership.

**Why it repeatedly failed:** It used aesthetic and market-positioning judgments that belong to Craft, with no observable pass threshold.

**Required correction:** Restrict the critic to visible functional requirements: one consistent character, eight required states, required emotion coverage, adult IELTS coaching cues, cross-platform legibility, and no Duolingo copying. Do not ask whether it looks premium.

**Independent verification:** Give a fresh critic only the approved functional brief and rendered proofs. Require a requirement-by-requirement evidence table followed by one binary verdict.

### 7.2 System critic

**Correct purpose:** Determine objective compliance with `SKYVOICE_DESIGN_SYSTEM.md` only.

**Previous effective criterion:** Mostly palette, adult tone, flatness, outline treatment, clarity, and brand compatibility, but with interpretation changes across rounds.

**Why it failed:** The governing document contains an unresolved mascot decision and does not quantify mascot-specific geometry, flatness, or adult proportions. Prompts and the style bible sometimes contradicted the design system's outlined flat illustration rule.

**Required correction:** Record the approved mascot decision in the design system; choose the design system's flat, navy-outlined rendering as authority; define an allowed color list, outline rule, forbidden effects, and adult-expression constraints.

**Independent verification:** Use the rendered white, dark, checker, silhouette, and 96 px proofs plus a machine-produced palette/effect report. The System critic must not use Duolingo or `bar.md`.

### 7.3 Craft critic

**Correct purpose:** Compare our rendered result against the observable, applicable mechanisms in `bar.md` and an actual rendered reference, blind and side by side.

**Previous effective criterion:** Frequently a memory-based or prose-based ideal of Duolingo quality, plus subjective premium/ownership judgments.

**Why it failed:** The reference render and blind comparison were absent; static Piece 1 was exposed to non-static or page-layout mechanisms; “better” was not operationalized.

**Required correction:** Store a legal, fixed benchmark render; build a label-free comparison board at matched scale; use only static character mechanisms for Piece 1; require evidence for silhouette landmarks, shape economy, emotion, pose readability, consistency, and small-size clarity.

**Independent verification:** Archive the exact comparison board and the full critic report. A different fresh critic should be able to reach the same result from the same evidence pack.

### 7.4 Reliability conclusion

The historical validation system was **not sufficiently reliable or repeatable** to support the claim that 43 controlled attempts genuinely failed. The recorded visual problems are real and useful, but the aggregate FAIL count is not a calibrated quality measurement. Correcting the method is not weakening or bypassing the bar; it restores the bar described by the Design Loop.

## 8. Missing Evidence and Uncertainties

The following evidence was not found:

- The exact Duo/reference image used by each Craft critic.
- A stored blind, side-by-side comparison for any round.
- Complete critic prompts and complete critic responses for most rounds.
- A Round 43 builder prompt, change note, or critic report.
- A frozen geometry manifest with landmark coordinates and tolerances.
- Formal records of why large architecture changes were approved.
- Objective user-test evidence for adult tone, pose recognition, or brand recall.
- Consistent QA proof sets for every early round.

Consequently:

- It is **confirmed** that the process and evidence pack were inconsistent.
- It is **confirmed** that many rounds have visible design defects recorded in the log.
- It is an **inference**, not a proved fact, that Round 43 is closer to a final solution; it has not been validly evaluated.
- It cannot be proved from the retained evidence that every historical critic saw the same inputs.
- It cannot be proved that the only Craft PASS in Round 25 was more correct than the subsequent Craft FAIL in Round 26.

## 9. Recommended Corrective Actions

Prioritized in the order required:

1. **Repair the record.** Mark Round 43 as unvalidated. Separate technical QA status from the three design verdicts.
2. **Freeze the identity.** Preserve the current Aira Signal Navigator architecture. No return to birds, humans, blobs, or new species without explicit user approval.
3. **Resolve authority conflicts.** Make `SKYVOICE_DESIGN_SYSTEM.md` authoritative for flat, navy-outlined rendering; record that the mascot direction is approved; revise the style bible once, before another build.
4. **Split Piece 1 into internal gates.** Use 1A Identity Lock, 1B Acting/Rig, and 1C Production Package. Piece 1 itself remains incomplete until the combined sheet passes all critics.
5. **Create a fixed validation pack.** It must contain the approved brief, frozen style bible, applicable bar mechanisms, exact benchmark render, label-free comparison board, and standardized proofs.
6. **Correct critic prompts.** Brief ignores aesthetics; System sees only the design system and proofs; Craft sees only the blind comparison, reference, and applicable `bar.md` mechanisms.
7. **Add objective checks.** Record landmark geometry, component scale tolerances, palette usage, effect detection, silhouette recognition, expression distinction, and 96 px readability.
8. **Validate Round 43 before generating anything.** This establishes a truthful baseline under the repaired method.
9. **If a critic fails, make one bounded change.** Do not alter architecture. Change only the measured failing property, rerender, and rerun all three fresh critics.
10. **Retain full evidence.** Archive every prompt, critic response, verdict, comparison board, proof, hashes, and change note.

## 10. Step-by-Step Recovery Plan

### Stage 0 — Governance repair

1. Correct `design-loop-progress.md` so Round 43 is NOT RUN / NOT RUN / NOT RUN.
2. Add a decision record confirming Aira as the approved mascot direction.
3. Reconcile the rendering conflict in the design system and style bible in favor of the existing design-system rule: rounded flat 2D, confident navy outlines, approved solid fills, no glow/haze/texture.
4. Freeze the revised inputs with dated hashes. Builders may not edit acceptance rules during a round.

**Exit:** One non-contradictory source-of-truth package exists.

### Stage 1 — Identity Lock (internal gate 1A)

1. Use only FRONT, 3/4, and solid silhouette views.
2. Lock orbit plate count and location, face-window ratio, spark location, shoulder roots, core proportions, tail root, module column, and base gap.
3. Define numeric tolerances for repeated components and verify them with an overlay/landmark report.

**Exit:** The same character is objectively present in all canonical views and remains identifiable without color, props, text, or facial detail.

### Stage 2 — Acting and rig (internal gate 1B)

1. Apply the locked rig to the six action states without changing identity geometry.
2. Run a label-free pose-recognition test at full size and 96 px.
3. Verify all required expressions are visibly distinct using brows, lids, gaze, and mouth only.
4. Fix only the state that misses recognition or consistency.

**Exit:** At least 7 of 8 states are identified correctly without labels or props, and all 8 are correct when the secondary prop is visible; all expressions meet their defined emotional cue.

### Stage 3 — Production package (internal gate 1C)

1. Produce transparent master plus white, black, checker, silhouette, and 96 px proofs.
2. Run technical QA for dimensions, alpha, matte contamination, cropping, source hash, and required outputs.
3. Run design QA separately for palette, outline, forbidden effects, landmarks, and component tolerances.

**Exit:** Both reports pass. Technical success is never reported as a critic PASS.

### Stage 4 — Corrected three-critic validation

1. Build the fixed blind comparison board using the retained reference at matched scale.
2. Run three fresh critics with separated evidence and roles.
3. Archive complete reports and exact inputs.
4. Record actual verdicts. If one fails, name one observable gap and return only that gap to the builder.

**Exit:** Brief PASS, System PASS, and Craft PASS on the same rendered candidate.

### Stage 5 — Canonical promotion

1. Promote the passing candidate to `apps/web/public/mascot/lead-mascot-sheet.png`.
2. Update the style bible's canonical source and revision.
3. Record hashes, verdicts, proof paths, and promotion date in the progress log.
4. Only then start Piece 2.

## 11. PASS/PASS/PASS Acceptance Criteria

These criteria operationalize the existing requirements; they do not lower them.

### Validation 1 — Brief PASS

All must be true in rendered output:

- Exactly one recognizable Aira identity appears across FRONT, 3/4, LISTENING, SPEAKING, READING, WRITING, FEEDBACK, and CELEBRATION.
- The six requested emotional functions are visibly covered: happiness/celebration, excitement, curiosity, surprise or discovery, confidence, and a restrained concern/sadness state if it belongs in the final approved set.
- Adult IELTS coaching is legible through the four-skill system and the actions, without using the official IELTS logo or implying an official score.
- The character remains recognizable in the 96 px proof and in solid silhouette.
- No owl, Duo silhouette, green Duo palette, copied pose, or proprietary Duolingo asset appears.
- The critic's verdict is based on functional fulfillment only; aesthetic quality is excluded from this gate.

### Validation 2 — System PASS

All must be true in rendered output and machine-readable QA:

- The mascot uses the approved navy, cobalt, orange, cream, white, and approved facial-detail colors; no unapproved dominant hue is present.
- The rendering is rounded flat 2D with consistent confident navy outlines and solid color planes.
- No glow, haze, atmospheric background, texture overlay, cast shadow, glossy highlight, or uncontrolled gradient is present.
- The broken orbit, waveform/signal language, orange spark, and four-skill structure are visibly brand-derived.
- Adult tone is maintained by the frozen face-window ratio, restrained features, and non-chibi body proportions.
- White, black, and checker proofs show clean orbit gaps, no white matte, no transparent holes in cream forms, and no crop collisions.
- The final design complies with the design system's originality and adult-credibility rules.

### Validation 3 — Craft PASS

All must be true under the fixed blind comparison protocol:

- The exact retained benchmark render and our candidate appear at matched scale with brand labels removed.
- At least two of Aira's fixed silhouette landmarks—the broken orbit/spark and tapered voice core/tail—remain identifiable in every state.
- Repeated components remain within the frozen geometry tolerance; apparent hand, joint, head, and core drift is absent.
- At least 7 of 8 states are correctly identified from label-free 96 px silhouettes; all 8 are identifiable from the label-free full-color state.
- Expressions remain distinct at small size without changing the face-window geometry.
- Props support rather than create the action, with no harmful tangencies or overlaps.
- Only static, Piece-1-applicable mechanisms from `bar.md` are judged. Website-section layout and motion are deferred to the pieces that can render them.
- The fresh Craft critic chooses our candidate over the reference for this specific adult IELTS brand brief and identifies no remaining larger craft gap.

### Final result

Piece 1 is complete only when the same candidate receives:

- Brief critic: **PASS**
- System critic: **PASS**
- Craft critic: **PASS**

Until then, the status remains in progress. A generated file, successful extraction, or technical QA pass is not PASS/PASS/PASS.

## 12. Audit Conclusion

The iteration count is not the main problem. The main problem is that the project lacked a frozen candidate architecture, a role-correct and repeatable critic protocol, a retained visual benchmark, and a clean separation between technical QA and design judgment. The evidence supports preserving the current Aira Signal Navigator identity, repairing the validation system first, and testing Round 43 as the baseline before authorizing any new artwork.
