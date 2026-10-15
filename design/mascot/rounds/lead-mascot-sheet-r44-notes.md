# Round 44 Production Notes

## Baseline and bounded changes

- Round 43's Signal Navigator architecture was frozen.
- Round 2 was reviewed and rejected as an architecture baseline; only its stronger whole-body acting and emotion spread informed the correction.
- Revision 1 restored flat planes, navy contours, clearer 3/4 depth, normalized joints/hands, and stronger action lines.
- Revision 2 corrected the remaining Craft gap: controlled whole-character acting before props.
- No Duo asset was supplied to image generation. The official Duo file was used only for post-generation Craft comparison.

## Production files

- Generated source: `lead-mascot-sheet-r44-imagegen-white.png`
- Transparent archive: `lead-mascot-sheet-r44.png`
- Processor: `design/mascot/process_r44.py`
- QA: white, black, checker, silhouette, and 96 px proofs with the `lead-mascot-sheet-r44-*` prefix
- Canonical web PNG: `apps/web/public/mascot/lead-mascot-sheet.png`
- Canonical/archive SHA-256: `B136C4B028581DA512D655DB69D3FE5F38909F90B7F2EA2C8067AA3AC791412B`

Round 44 is raster artwork. The legacy `apps/web/public/mascot/lead-mascot-sheet.svg` is an older unrelated human rig and is not a valid editable vector version of Round 44.

## Validation

- Deterministic technical gate: PASS
- Opaque approved-palette coverage: 100%
- Brief critic: PASS
- System critic: PASS
- Craft critic: PASS
- Overall: PASS / PASS / PASS
