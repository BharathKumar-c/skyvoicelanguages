from pathlib import Path

from process_piece2_r2 import PIECE, build_round


SOURCE = PIECE / "source" / "skill-signals-r3-imagegen.png"


if __name__ == "__main__":
    build_round("r3", SOURCE, clean_active_marks=True)

