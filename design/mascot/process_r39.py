"""Build Round 39 from the premium Round 37 render with controlled flat planes."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "design/mascot/rounds/lead-mascot-sheet-r37.png"
ROUNDS = ROOT / "design/mascot/rounds"
MASTER = ROOT / "apps/web/public/mascot/lead-mascot-sheet.png"
RAW = ROUNDS / "lead-mascot-sheet-r39-raw.png"
FINAL = ROUNDS / "lead-mascot-sheet-r39.png"

NAVY = (14, 45, 94, 255)
BLUE = (22, 85, 216, 255)
ORANGE = (235, 157, 19, 255)

# Twelve deliberate brand-adjacent planes. No generated/adaptive palette is used.
PALETTE = np.array(
    [
        (7, 25, 55),
        (14, 45, 94),
        (16, 58, 121),
        (22, 85, 216),
        (0, 113, 248),
        (69, 159, 255),
        (235, 157, 19),
        (255, 119, 0),
        (255, 244, 214),
        (247, 231, 191),
        (255, 255, 255),
        (215, 225, 239),
    ],
    dtype=np.int16,
)


def rounded_arc(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    start: float,
    end: float,
    fill: tuple[int, int, int, int],
    width: int,
) -> None:
    """Draw a thick elliptical arc with deterministic round end caps."""
    draw.arc(box, start=start, end=end, fill=fill, width=width)
    cx = (box[0] + box[2]) / 2
    cy = (box[1] + box[3]) / 2
    rx = (box[2] - box[0]) / 2
    ry = (box[3] - box[1]) / 2
    radius = width / 2
    for angle in (start, end):
        theta = math.radians(angle)
        x = cx + rx * math.cos(theta)
        y = cy + ry * math.sin(theta)
        draw.ellipse(
            (x - radius, y - radius, x + radius, y + radius),
            fill=fill,
        )


def make_orbits(size: tuple[int, int]) -> Image.Image:
    scale = 4
    layer = Image.new("RGBA", (size[0] * scale, size[1] * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    centers = [(192, 245), (576, 245), (960, 245), (1344, 245),
               (192, 757), (576, 757), (960, 757), (1344, 757)]
    rx, ry, stroke = 142, 114, 22
    for cx, cy in centers:
        box = tuple(int(v * scale) for v in (cx - rx, cy - ry, cx + rx, cy + ry))
        rounded_arc(draw, box, 190, 257, BLUE, stroke * scale)
        rounded_arc(draw, box, 282, 349, NAVY, stroke * scale)
        rounded_arc(draw, box, 14, 81, ORANGE, stroke * scale)
    return layer.resize(size, Image.Resampling.LANCZOS)


def flatten_to_brand_planes(image: Image.Image) -> Image.Image:
    rgba = np.asarray(image.convert("RGBA"), dtype=np.uint8).copy()
    rgb = rgba[..., :3].astype(np.float32)
    # Perceptual channel weighting keeps navy/cobalt separation stable.
    weights = np.array((0.24, 0.56, 0.20), dtype=np.float32)
    palette_float = PALETTE.astype(np.float32)
    distances = ((rgb[..., None, :] - palette_float[None, None, :, :]) ** 2 * weights).sum(axis=3)
    nearest = distances.argmin(axis=2)
    mask = rgba[..., 3] > 0
    rgba[..., :3][mask] = PALETTE[nearest][mask].astype(np.uint8)
    rgba[..., :3][~mask] = 0
    quantized = Image.fromarray(rgba)
    # Remove isolated one-pixel remnants from the original glossy rendering while
    # keeping edges, pupils, beak lines, and the antialiased alpha channel intact.
    cleaned_rgb = quantized.convert("RGB").filter(ImageFilter.ModeFilter(3))
    cleaned = cleaned_rgb.convert("RGBA")
    cleaned.putalpha(quantized.getchannel("A"))
    cleaned_array = np.asarray(cleaned, dtype=np.uint8).copy()
    # Preserve the deliberately typeset label chips; mode filtering is only for
    # the illustrated character planes, not small production lettering.
    cleaned_array[450:505, :, :] = rgba[450:505, :, :]
    cleaned_array[962:1024, :, :] = rgba[962:1024, :, :]
    cleaned_rgb_float = cleaned_array[..., :3].astype(np.float32)
    cleaned_distances = (
        (cleaned_rgb_float[..., None, :] - palette_float[None, None, :, :]) ** 2
        * weights
    ).sum(axis=3)
    cleaned_nearest = cleaned_distances.argmin(axis=2)
    cleaned_array[..., :3][mask] = PALETTE[cleaned_nearest][mask].astype(np.uint8)
    cleaned_array[..., :3][cleaned_array[..., 3] == 0] = 0
    return Image.fromarray(cleaned_array)


def composite_on(image: Image.Image, background: tuple[int, int, int, int]) -> Image.Image:
    base = Image.new("RGBA", image.size, background)
    base.alpha_composite(image)
    return base.convert("RGB")


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    if source.size != (1536, 1024):
        raise ValueError(f"Unexpected source size: {source.size}")

    orbit = make_orbits(source.size)
    raw = Image.new("RGBA", source.size, (0, 0, 0, 0))
    raw.alpha_composite(orbit)
    raw.alpha_composite(source)
    raw.save(RAW, optimize=True)

    final = flatten_to_brand_planes(raw)
    final.save(FINAL, optimize=True)
    final.save(MASTER, optimize=True)

    composite_on(final, (255, 255, 255, 255)).save(
        ROUNDS / "lead-mascot-sheet-r39-white-qa.png", optimize=True
    )
    composite_on(final, (7, 13, 24, 255)).save(
        ROUNDS / "lead-mascot-sheet-r39-black-qa.png", optimize=True
    )

    checker = Image.new("RGBA", final.size, (255, 255, 255, 255))
    draw = ImageDraw.Draw(checker)
    tile = 32
    for y in range(0, final.height, tile):
        for x in range(0, final.width, tile):
            if (x // tile + y // tile) % 2:
                draw.rectangle((x, y, x + tile - 1, y + tile - 1), fill=(220, 226, 234, 255))
    checker.alpha_composite(final)
    checker.convert("RGB").save(
        ROUNDS / "lead-mascot-sheet-r39-checker-qa.png", optimize=True
    )

    alpha = final.getchannel("A")
    silhouette = Image.new("RGBA", final.size, (0, 0, 0, 0))
    silhouette.paste(NAVY, mask=alpha)
    composite_on(silhouette, (255, 255, 255, 255)).save(
        ROUNDS / "lead-mascot-sheet-r39-silhouette-qa.png", optimize=True
    )

    thumb = composite_on(final, (255, 255, 255, 255)).resize(
        (384, 256), Image.Resampling.LANCZOS
    )
    thumb.save(ROUNDS / "lead-mascot-sheet-r39-96px-qa.png", optimize=True)

    digest = hashlib.sha256(FINAL.read_bytes()).hexdigest().upper()
    alpha_values = sorted(set(alpha.getdata()))
    print(f"source={SOURCE.relative_to(ROOT)}")
    print(f"master={MASTER.relative_to(ROOT)}")
    print(f"size={final.width}x{final.height} mode={final.mode}")
    print(f"palette_planes={len(PALETTE)}")
    print(f"alpha_levels={len(alpha_values)} min={alpha_values[0]} max={alpha_values[-1]}")
    print(f"alpha_bbox={alpha.getbbox()}")
    print(f"corners={[final.getpixel(p)[3] for p in [(0,0),(1535,0),(0,1023),(1535,1023)]]}")
    print(f"sha256={digest}")


if __name__ == "__main__":
    main()
