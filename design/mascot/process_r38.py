"""Render and validate Round 38 Aira production assets from the canonical SVG."""

from __future__ import annotations

import hashlib
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "design/mascot/source/lead-mascot-r38.svg"
ROUNDS = ROOT / "design/mascot/rounds"
MASTER = ROOT / "apps/web/public/mascot/lead-mascot-sheet.png"
RAW = ROUNDS / "lead-mascot-sheet-r38-raw.png"
FINAL = ROUNDS / "lead-mascot-sheet-r38.png"


def composite_on(image: Image.Image, background: tuple[int, int, int, int]) -> Image.Image:
    base = Image.new("RGBA", image.size, background)
    base.alpha_composite(image)
    return base.convert("RGB")


def main() -> None:
    ROUNDS.mkdir(parents=True, exist_ok=True)
    MASTER.parent.mkdir(parents=True, exist_ok=True)
    cairosvg.svg2png(
        url=str(SOURCE),
        write_to=str(RAW),
        output_width=1536,
        output_height=1024,
    )

    image = Image.open(RAW).convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                pixels[x, y] = (0, 0, 0, 0)
    image.save(FINAL, optimize=True)
    image.save(MASTER, optimize=True)

    composite_on(image, (255, 255, 255, 255)).save(
        ROUNDS / "lead-mascot-sheet-r38-white-qa.png", optimize=True
    )
    composite_on(image, (7, 13, 24, 255)).save(
        ROUNDS / "lead-mascot-sheet-r38-black-qa.png", optimize=True
    )

    checker = Image.new("RGBA", image.size, (255, 255, 255, 255))
    draw = ImageDraw.Draw(checker)
    tile = 32
    for y in range(0, image.height, tile):
        for x in range(0, image.width, tile):
            if (x // tile + y // tile) % 2:
                draw.rectangle((x, y, x + tile - 1, y + tile - 1), fill=(220, 226, 234, 255))
    checker.alpha_composite(image)
    checker.convert("RGB").save(
        ROUNDS / "lead-mascot-sheet-r38-checker-qa.png", optimize=True
    )

    alpha = image.getchannel("A")
    silhouette = Image.new("RGBA", image.size, (0, 0, 0, 0))
    silhouette.paste((14, 45, 94, 255), mask=alpha)
    composite_on(silhouette, (255, 255, 255, 255)).save(
        ROUNDS / "lead-mascot-sheet-r38-silhouette-qa.png", optimize=True
    )

    thumb = composite_on(image, (255, 255, 255, 255)).resize(
        (384, 256), Image.Resampling.LANCZOS
    )
    thumb.save(ROUNDS / "lead-mascot-sheet-r38-96px-qa.png", optimize=True)

    digest = hashlib.sha256(FINAL.read_bytes()).hexdigest().upper()
    alpha_values = sorted(set(alpha.getdata()))
    bbox = alpha.getbbox()
    print(f"source={SOURCE.relative_to(ROOT)}")
    print(f"master={MASTER.relative_to(ROOT)}")
    print(f"size={image.size[0]}x{image.size[1]} mode={image.mode}")
    print(f"alpha_levels={len(alpha_values)} min={alpha_values[0]} max={alpha_values[-1]}")
    print(f"alpha_bbox={bbox}")
    print(f"corners={[image.getpixel(p)[3] for p in [(0,0),(1535,0),(0,1023),(1535,1023)]]}")
    print(f"sha256={digest}")


if __name__ == "__main__":
    main()
