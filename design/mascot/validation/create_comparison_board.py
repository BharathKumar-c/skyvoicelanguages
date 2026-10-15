"""Create a deterministic label-free side-by-side Craft comparison board."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[3]
BENCHMARK = ROOT / "design/mascot/benchmark/duo-official-widget-system-2023.png"


def contain(image: Image.Image, size: tuple[int, int], background: str) -> Image.Image:
    rgba = image.convert("RGBA")
    backdrop = Image.new("RGBA", size, background)
    fitted = ImageOps.contain(rgba, (size[0] - 64, size[1] - 64), Image.Resampling.LANCZOS)
    x = (size[0] - fitted.width) // 2
    y = (size[1] - fitted.height) // 2
    backdrop.alpha_composite(fitted, (x, y))
    return backdrop


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--candidate", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    candidate = Image.open(args.candidate)
    benchmark = Image.open(BENCHMARK)
    panel_size = (1200, 900)
    board = Image.new("RGB", (2400, 900), "#EEF3FA")
    # Stable placement prevents reviewers from receiving different evidence.
    board.paste(contain(candidate, panel_size, "#FFFFFF").convert("RGB"), (0, 0))
    board.paste(contain(benchmark, panel_size, "#FFFFFF").convert("RGB"), (1200, 0))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    board.save(args.output, optimize=True)
    print(args.output.resolve())


if __name__ == "__main__":
    main()
