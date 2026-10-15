"""
Process new extended poses (thinking, waving, surprised, pointing)
for the Aira Signal Navigator mascot.

Each source image is a single character on a white background.
This script:
  1. Extracts the white matte to produce RGBA
  2. Resizes to 512 × 640 (matching the per-cell aspect ratio: 3:4 ≈ 384:512)
  3. Saves to design/mascot/rounds/ with the naming convention
  4. Copies the final file to apps/web/public/mascot/

Usage:
    python design/mascot/process_extended_poses.py
"""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent
ROUNDS = ROOT / "design/mascot/rounds"
PUBLIC = ROOT / "apps/web/public/mascot"

# Cell output size — matches the height of one sprite-sheet cell
CELL_W = 384
CELL_H = 512

# White extraction threshold (0–255): pixels this close to white are made transparent
WHITE_THRESHOLD = 14

POSES: list[tuple[str, str]] = [
    ("aira-pose-thinking.png", "aira-thinking.png"),
    ("aira-pose-waving.png", "aira-waving.png"),
    ("aira-pose-surprised.png", "aira-surprised.png"),
    ("aira-pose-pointing.png", "aira-pointing.png"),
]


def unmatte_white(img: Image.Image, threshold: int = WHITE_THRESHOLD) -> Image.Image:
    """Remove near-white background, returning an RGBA image."""
    img = img.convert("RGBA")
    data = img.load()
    assert data is not None
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = data[x, y]
            if r >= 255 - threshold and g >= 255 - threshold and b >= 255 - threshold:
                data[x, y] = (r, g, b, 0)
    return img


def fit_to_cell(img: Image.Image, cell_w: int, cell_h: int) -> Image.Image:
    """
    Scale the image proportionally to fit inside cell_w × cell_h,
    then place it on a transparent canvas of exactly cell_w × cell_h.
    """
    img.thumbnail((cell_w, cell_h), Image.LANCZOS)
    canvas = Image.new("RGBA", (cell_w, cell_h), (0, 0, 0, 0))
    x_off = (cell_w - img.width) // 2
    y_off = (cell_h - img.height) // 2
    canvas.paste(img, (x_off, y_off), img)
    return canvas


def process_pose(src_name: str, dst_name: str) -> None:
    src = ROUNDS / src_name
    if not src.exists():
        print(f"  SKIP  {src_name} — source not found")
        return

    img = Image.open(src)
    img = unmatte_white(img)
    img = fit_to_cell(img, CELL_W, CELL_H)

    # Save to rounds
    out_rounds = ROUNDS / dst_name
    img.save(out_rounds, "PNG", optimize=True)
    print(f"  OK    {dst_name} saved to rounds/")

    # Copy to public/mascot
    PUBLIC.mkdir(parents=True, exist_ok=True)
    shutil.copy2(out_rounds, PUBLIC / dst_name)
    print(f"  OK    {dst_name} deployed to public/mascot/")


def main() -> None:
    print("Processing extended Aira poses…")
    for src_name, dst_name in POSES:
        process_pose(src_name, dst_name)
    print("Done.")


if __name__ == "__main__":
    main()
