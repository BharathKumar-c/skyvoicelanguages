"""Deterministic Round 33 Kinetic Emblem cleanup and QA exports."""

from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "design/mascot/rounds/lead-mascot-sheet-r33-raw.png"
MASTER = ROOT / "apps/web/public/mascot/lead-mascot-sheet.png"
ARCHIVE = ROOT / "design/mascot/rounds/lead-mascot-sheet-r33.png"
ROUNDS = ROOT / "design/mascot/rounds"
FONT_PATH = Path(r"C:\Windows\Fonts\ARLRDBD.TTF")
CARD_FONT_PATH = Path(r"C:\Windows\Fonts\ARIALBD.TTF")

COBALT = (22, 85, 216)
NAVY = (14, 45, 94)
ORANGE = (235, 157, 19)
CREAM = (255, 244, 214)
WHITE = (255, 255, 255)
PALETTE = np.array([COBALT, NAVY, ORANGE, CREAM, WHITE], dtype=np.int32)

# Inset text areas preserve the generated pill silhouettes and their antialiased rim.
LABELS = [
    ((62, 438, 352, 493), "FRONT"),
    ((452, 438, 731, 493), "3/4"),
    ((811, 438, 1092, 493), "LISTENING"),
    ((1188, 438, 1467, 493), "SPEAKING"),
    ((62, 915, 352, 973), "READING"),
    ((445, 915, 730, 973), "WRITING"),
    ((812, 915, 1101, 973), "FEEDBACK"),
    ((1190, 915, 1473, 973), "CELEBRATION"),
]


def nearest_palette(rgb: np.ndarray) -> np.ndarray:
    values = rgb.astype(np.int32)
    distances = ((values[:, None, :] - PALETTE[None, :, :]) ** 2).sum(axis=2)
    return PALETTE[distances.argmin(axis=1)].astype(np.uint8)


def extend_nearest(rgb: np.ndarray, known: np.ndarray, target: np.ndarray) -> np.ndarray:
    """Fill a one-pixel target ring from an adjacent known shape colour."""
    result = rgb.copy()
    remaining = target.copy()
    height, width = known.shape
    for dy, dx in ((0, -1), (0, 1), (-1, 0), (1, 0), (-1, -1), (-1, 1), (1, -1), (1, 1)):
        source_known = np.zeros_like(known)
        source_rgb = np.zeros_like(result)
        y_src = slice(max(0, -dy), min(height, height - dy))
        x_src = slice(max(0, -dx), min(width, width - dx))
        y_dst = slice(max(0, dy), min(height, height + dy))
        x_dst = slice(max(0, dx), min(width, width + dx))
        source_known[y_dst, x_dst] = known[y_src, x_src]
        source_rgb[y_dst, x_dst] = result[y_src, x_src]
        take = remaining & source_known
        result[take] = source_rgb[take]
        remaining[take] = False
    if remaining.any():
        raise RuntimeError("Could not extend edge colour into complete one-pixel ring")
    return result


def centered_text(draw: ImageDraw.ImageDraw, box, text: str, font, fill):
    x0, y0, x1, y1 = box
    bounds = draw.textbbox((0, 0), text, font=font)
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    x = x0 + ((x1 - x0) - width) / 2 - bounds[0]
    y = y0 + ((y1 - y0) - height) / 2 - bounds[1]
    draw.text((round(x), round(y)), text, font=font, fill=fill)


def build_master():
    source = Image.open(RAW).convert("RGBA")
    arr = np.asarray(source)
    source_alpha = arr[:, :, 3]
    core = source_alpha >= 240

    # Quantize every opaque semantic pixel to the locked flat brand palette.
    rgb = np.zeros(arr[:, :, :3].shape, dtype=np.uint8)
    rgb[core] = nearest_palette(arr[:, :, :3][core])
    flat = Image.fromarray(rgb)
    draw = ImageDraw.Draw(flat)

    # Erase model-rendered label contents inside the existing opaque pills.
    for (x0, y0, x1, y1), _ in LABELS:
        draw.rounded_rectangle((x0 + 11, y0 + 10, x1 - 11, y1 - 9), radius=12, fill=WHITE)

    # Find one shared maximum label size for a coherent eight-state system.
    font_size = 30
    while font_size > 16:
        font = ImageFont.truetype(str(FONT_PATH), font_size)
        if all(
            draw.textbbox((0, 0), label, font=font)[2] <= (box[2] - box[0] - 30)
            for box, label in LABELS
        ):
            break
        font_size -= 1
    font = ImageFont.truetype(str(FONT_PATH), font_size)
    for box, label in LABELS:
        centered_text(draw, box, label, font, NAVY)

    # Replace the model's small card title with deterministic typography.
    card_title = (895, 739, 1032, 780)
    draw.rectangle(card_title, fill=CREAM)
    band_font = ImageFont.truetype(str(CARD_FONT_PATH), 20)
    value_font = ImageFont.truetype(str(CARD_FONT_PATH), 35)
    draw.text((900, 745), "BAND", font=band_font, fill=NAVY)
    draw.text((966, 736), "7.5", font=value_font, fill=NAVY)
    draw.rounded_rectangle((900, 784, 1026, 790), radius=3, fill=ORANGE)
    draw.rounded_rectangle((900, 798, 1026, 816), radius=8, fill=WHITE, outline=NAVY, width=4)
    draw.rounded_rectangle((906, 803, 1002, 811), radius=4, fill=COBALT)

    rgb = np.asarray(flat).copy()

    # Two-pixel, shape-coloured antialias edge: 255 core, 192 inner edge, 96 outer edge.
    core_img = Image.fromarray((core * 255).astype(np.uint8))
    dilate_1 = np.asarray(core_img.filter(ImageFilter.MaxFilter(3))) > 0
    dilate_2 = np.asarray(core_img.filter(ImageFilter.MaxFilter(5))) > 0
    ring_1 = dilate_1 & ~core
    ring_2 = dilate_2 & ~dilate_1
    alpha = np.zeros(core.shape, dtype=np.uint8)
    alpha[core] = 255
    alpha[ring_1] = 192
    alpha[ring_2] = 96

    # Copy edge RGB from adjacent shape pixels to prevent dark/white fringes.
    rgb = extend_nearest(rgb, core, ring_1)
    rgb = extend_nearest(rgb, dilate_1, ring_2)
    rgb[alpha == 0] = 0

    out = Image.fromarray(np.dstack((rgb, alpha)))
    MASTER.parent.mkdir(parents=True, exist_ok=True)
    out.save(MASTER, optimize=True)
    out.save(ARCHIVE, optimize=True)
    return out, font_size


def composite_rgba(foreground: Image.Image, background: Image.Image) -> Image.Image:
    return Image.alpha_composite(background.convert("RGBA"), foreground).convert("RGB")


def export_qa(master: Image.Image):
    size = master.size
    white = Image.new("RGB", size, WHITE)
    black = Image.new("RGB", size, (0, 0, 0))

    tile = 32
    checker = Image.new("RGB", size)
    pixels = checker.load()
    for y in range(size[1]):
        for x in range(size[0]):
            pixels[x, y] = (232, 236, 243) if ((x // tile + y // tile) % 2 == 0) else (177, 186, 201)

    composite_rgba(master, white).save(ROUNDS / "lead-mascot-sheet-r33-white-qa.png", optimize=True)
    composite_rgba(master, black).save(ROUNDS / "lead-mascot-sheet-r33-black-qa.png", optimize=True)
    composite_rgba(master, checker).save(ROUNDS / "lead-mascot-sheet-r33-checker-qa.png", optimize=True)

    alpha = master.getchannel("A")
    silhouette = Image.new("RGBA", size, NAVY + (0,))
    silhouette.putalpha(alpha)
    silhouette = composite_rgba(silhouette, Image.new("RGB", size, WHITE))
    silhouette.resize((576, 384), Image.Resampling.LANCZOS).save(
        ROUNDS / "lead-mascot-sheet-r33-silhouette-qa.png", optimize=True
    )

    composite_rgba(master, white).resize((320, 213), Image.Resampling.LANCZOS).save(
        ROUNDS / "lead-mascot-sheet-r33-96px-qa.png", optimize=True
    )


def validate(master: Image.Image, font_size: int):
    arr = np.asarray(master)
    alpha_hist = Counter(arr[:, :, 3].ravel())
    corners = [int(arr[y, x, 3]) for x, y in ((0, 0), (1535, 0), (0, 1023), (1535, 1023))]
    print(f"master={MASTER}")
    print(f"size={master.size} mode={master.mode}")
    print(f"label_font={FONT_PATH} size={font_size}px")
    print(f"alpha_histogram={dict(sorted(alpha_hist.items()))}")
    print(f"corner_alpha={corners}")
    print(f"archive_byte_match={MASTER.read_bytes() == ARCHIVE.read_bytes()}")


if __name__ == "__main__":
    result, label_font_size = build_master()
    export_qa(result)
    validate(result, label_font_size)
