# Brief: Bring [BRAND NAME] to life with a unique illustrated character and motion system

## Goal

Audit our website against Duolingo's marketing site as the gold-standard reference. Then design and generate our own original graphic style, cast of characters, and looping animations, so every section feels playful, quirky, and flawless. The result should feel like the same level of craft as Duolingo but be unmistakably ours. It must not copy or resemble Duolingo's owl, characters, or artwork.

## Inputs

- Our site: [URL / repo path]
- Reference: https://duolingo.com (study the page as it renders in a browser)
- Style reference: https://styles.refero.design/style/7088d695-362b-4e09-b325-fa8136d4f350
- Our brand: [BRAND NAME], [one-line product description], audience [AUDIENCE], tone [e.g. witty, warm, slightly chaotic]
- Our color tokens: [paste hex values and token names]. These are the only UI colors. Do not introduce Duolingo's green or blue.
- Our fonts: [fonts, or "propose a rounded display face + readable sans"]

## Phase 1: Ruthless comparison (do this before creating anything)

Go through our site and Duolingo's section by section and produce a gap report:

1. Per section: what Duolingo does (layout, illustration role, motion, copy rhythm) vs. what we do, and the specific gap.
2. Cross-site patterns to learn from, such as:
   - Every section pairs one large character illustration with a single text block (headline, short paragraph, CTA).
   - Flat fills, bold outlines, and no gradients or glass effects.
   - The character palette is separate from the UI palette.
   - Thick 2px outlined buttons with 12px radius.
   - Looping idle animations that give the characters personality.
3. A priority-ranked list of sections to upgrade. For each, one sentence on the "wow" moment we want there.

Stop and show me the gap report before Phase 2.

## Phase 2: Our graphic style (a short style bible)

Define a style that is clearly not Duolingo's:

- **Shape language:** [e.g. squircles, blobs, or angular shapes. Pick one and commit.]
- **Line:** outline weight, corner treatment, and whether lines are consistent or hand-wobbled.
- **Color use:** map our brand colors to illustration roles (primary, accent, shadow tint, highlight). Add a character-only secondary palette of 4–5 colors that never appears in UI chrome.
- **Texture/finish:** flat or lightly textured, and how shading works (or does not).
- **Motion principles:** easing curves, squash and stretch amounts, loop length (3–6 seconds), idle behaviors, and timing offsets so no two characters move in sync.
- **Do/Don't list** for consistency.

## Phase 3: Original characters

Create a small cast of 3–5 characters that express our product and brand:

- A lead mascot plus supporting characters.
- For each one: name, personality (2–3 traits), signature quirk, silhouette notes, a color assignment, and a character sheet with front, 3/4, and expression variants.
- Each must be distinct at thumbnail size and clearly different from Duolingo's cast and from any existing mascot.

## Phase 4: Generate assets with the Higgsfield CLI

- **Stills:** character sheets, per-section hero illustrations, and spot icons.
- **Video:** use Seedance 2.5 for all video generation (confirm the exact model ID available in the CLI first and tell me if it differs).
- Keep a prompt file per asset in the repo, with the style-bible text prepended to each prompt, so results can be regenerated consistently.
- Loops must be seamless (first frame equals last frame), 3–6 seconds each, with the background removed or a solid brand-compatible background that blends into the page.
- Generate 2–3 candidates per asset, pick the strongest, and tell me why.
- Export web-ready formats: WebM (VP9, with alpha if possible) plus MP4 fallback, and a poster image for each video. Keep each video under [X] KB.

## Phase 5: Integrate into the website

- Place one hero character moment per section, matching Duolingo's alternating text and illustration rhythm.
- Cover every section: hero, features, social proof, pricing, FAQ, footer, empty states, and loading and error states.
- Add subtle micro-interactions: button hover and press, scroll-triggered entrances, and hover reactions on characters.
- Performance: lazy-load video, use `preload="none"`, use autoplay + muted + loop + playsinline, and keep Lighthouse performance from regressing.
- Accessibility: respect `prefers-reduced-motion` (show the poster still), add alt text, and keep contrast at WCAG AA.
- Responsive: verify at 375, 768, 1280, and 1920 px widths.

## Quality bar

Every section should look gorgeous and polished. Before you call anything done, do a section-by-section visual QA against Duolingo and flag anything that falls short. Check alignment, spacing, loop seams, color consistency, and character consistency across assets.

## Deliverables

1. Gap report (Phase 1)
2. Style bible and character sheets
3. All generated stills and videos, plus the prompt files
4. Updated site code with assets integrated
5. A short QA checklist and a list of open issues
