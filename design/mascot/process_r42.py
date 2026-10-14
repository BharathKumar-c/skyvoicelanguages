"""Build and validate the Round 42 Signal Navigator production sheet."""

from __future__ import annotations

import process_r41 as production


production.ROUND = "r42"
production.SOURCE = (
    production.ROOT
    / "design/mascot/rounds/lead-mascot-sheet-r42-imagegen-white.png"
)
production.RAW = production.ROUNDS / "lead-mascot-sheet-r42-raw.png"
production.FINAL = production.ROUNDS / "lead-mascot-sheet-r42.png"
production.SOURCE_COLUMNS = ((0, 384), (384, 768), (768, 1152), (1152, 1536))


if __name__ == "__main__":
    production.main()
