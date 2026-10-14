"""Build and validate the Round 43 Signal Navigator production sheet."""

from __future__ import annotations

import process_r41 as production


production.ROUND = "r43"
production.SOURCE = (
    production.ROOT
    / "design/mascot/rounds/lead-mascot-sheet-r43-imagegen-white.png"
)
production.RAW = production.ROUNDS / "lead-mascot-sheet-r43-raw.png"
production.FINAL = production.ROUNDS / "lead-mascot-sheet-r43.png"
production.SOURCE_COLUMNS = ((0, 384), (384, 768), (768, 1152), (1152, 1536))
production.SEMANTIC_BLUE_PALETTE = (
    (6, 26, 74),
    (8, 36, 93),
    (14, 45, 94),
    (10, 52, 122),
    (7, 59, 150),
    (8, 69, 178),
    (11, 76, 196),
    (22, 85, 216),
    (14, 95, 229),
    (8, 104, 242),
    (20, 113, 245),
    (35, 122, 245),
    (58, 131, 243),
    (90, 149, 245),
)


if __name__ == "__main__":
    production.main()
