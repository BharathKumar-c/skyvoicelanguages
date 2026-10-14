# Round 40 — Aira, Adult Human Signal Mentor

Use `design/mascot/rounds/lead-mascot-sheet-r40-imagegen-white.png` as the exact visual source. Preserve the generated character's premium anatomy, warm brown skin, mature adult proportions, expressive face, sculptural cobalt/navy signal hair, long speech-tail scarf, cream/navy coaching outfit, orange signal pin, hands, trousers, and navy shoes. Do not redraw, posterize, vectorize, or flatten the artwork.

## Locked identity

- Adult human mentor with approximately seven-head proportions and a confident professional stance.
- Hair silhouette consists of two permanent crescent masses: a large swept navy crescent on the character's left and a compact cobalt crescent on the right.
- One narrow vertical signal crest rises between the two hair crescents.
- One long cobalt speech-tail scarf always exits the same right shoulder and ends in a pointed speech-tail tip.
- Warm brown skin, almond-shaped dark eyes, restrained adult facial proportions, and a compact expression library.
- Cream cropped coaching jacket, navy inset top, cobalt diagonal lapel/sash, navy ankle trousers, consistent hands, and navy low-heeled shoes.
- One small orange circular signal pin remains on the upper jacket.

## Eight states

FRONT is calm and welcoming. 3/4 is confident and attentive. LISTENING leans and cups one ear with curious eyes. SPEAKING smiles with one hand to the chest and one open presenting hand. READING sits with one large cream page. WRITING kneels with one cream writing surface. FEEDBACK presents one large cream result card. CELEBRATION closes the eyes joyfully, raises one fist, and lifts one foot.

Expression changes are visible but remain mature: neutral welcome, knowing confidence, raised curious attention, open speaking smile, focused reading, concentrated writing, reassuring feedback, and joyful closed eyes.

## Production

- Extract only the uniform white background; preserve cream garments, cards, the white crest interior, and antialiased character edges.
- Remove white matte contamination from partial edge pixels and normalize fully transparent RGB to black.
- Keep the existing 4 × 2 pose order. Scale each isolated cell only as needed to reserve a clean label band.
- Add deterministic FRONT, 3/4, LISTENING, SPEAKING, READING, WRITING, FEEDBACK, and CELEBRATION label chips beneath the cells.
- Output 1536 × 1024 RGBA.

## Guardrails

No headset, customer-support cues, superhero costume, generic corporate-stock hairstyle, generic blazer-only silhouette, childlike proportions, giant eyes, copied Duolingo pose, owl anatomy, bird anatomy, green, detached hands, or detached shoes. The hair crescents, signal crest, and same-shoulder speech-tail scarf must remain visible in every state.

## Authority

- Image-generation source: `design/mascot/rounds/lead-mascot-sheet-r40-imagegen-white.png`
- Master: `apps/web/public/mascot/lead-mascot-sheet.png`
- Archive/QA: `design/mascot/rounds/lead-mascot-sheet-r40*`
- Processor: `design/mascot/process_r40.py`
