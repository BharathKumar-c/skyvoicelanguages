"""Extract, arrange, label, and validate the Round 40 human Signal Mentor."""

from __future__ import annotations

import hashlib
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "design/mascot/rounds/lead-mascot-sheet-r40-imagegen-white.png"
ROUNDS = ROOT / "design/mascot/rounds"
MASTER = ROOT / "apps/web/public/mascot/lead-mascot-sheet.png"
RAW = ROUNDS / "lead-mascot-sheet-r40-raw.png"
FINAL = ROUNDS / "lead-mascot-sheet-r40.png"

LABELS = ("FRONT", "3/4", "LISTENING", "SPEAKING", "READING", "WRITING", "FEEDBACK", "CELEBRATION")
NAVY = (14, 45, 94, 255)
BLUE = (22, 85, 216, 255)


def connected_white_background(rgb: np.ndarray) -> np.ndarray:
    """Return the border-connected neutral near-white background component."""
    from PIL import ImageDraw

    max_channel = rgb.max(axis=2).astype(np.int16)
    min_channel = rgb.min(axis=2).astype(np.int16)
    distance_from_white = 255 - min_channel
    chroma = max_channel - min_channel
    candidate = (distance_from_white < 40) & (chroma < 24)

    candidate_image = Image.fromarray(np.where(candidate, 255, 0).astype(np.uint8))
    padded = Image.new("L", (candidate_image.width + 2, candidate_image.height + 2), 255)
    padded.paste(candidate_image, (1, 1))
    ImageDraw.floodfill(padded, (0, 0), 128)
    flooded = np.asarray(padded, dtype=np.uint8)[1:-1, 1:-1]
    return flooded == 128


def extract_from_white(source: Image.Image) -> Image.Image:
    rgb = np.asarray(source.convert("RGB"), dtype=np.uint8)
    background = connected_white_background(rgb)
    min_channel = rgb.min(axis=2).astype(np.float32)
    distance = 255.0 - min_channel

    # Preserve enclosed white/cream forms completely. On the connected background,
    # recover only the original antialiased color transition.
    edge_alpha = np.clip((distance - 3.0) / 55.0 * 255.0, 0.0, 255.0)
    alpha = np.where(background, edge_alpha, 255.0).astype(np.uint8)
    alpha[alpha < 8] = 0

    rgba = np.dstack((rgb, alpha)).astype(np.uint8)
    partial = (alpha > 0) & (alpha < 255)
    if np.any(partial):
        a = alpha.astype(np.float32) / 255.0
        for channel in range(3):
            observed = rgb[..., channel].astype(np.float32)
            unmatted = (observed - 255.0 * (1.0 - a)) / np.maximum(a, 1e-6)
            rgba[..., channel][partial] = np.clip(unmatted[partial], 0, 255).astype(np.uint8)

    rgba[..., :3][alpha == 0] = 0
    return Image.fromarray(rgba)


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = (
        Path("C:/Windows/Fonts/arialbd.ttf"),
        Path("C:/Windows/Fonts/segoeuib.ttf"),
    )
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def arrange_and_label(extracted: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (1536, 1024), (0, 0, 0, 0))
    cell_w, cell_h = 384, 512
    character_top = (8, 520)
    character_bottom = (452, 964)

    for index, label in enumerate(LABELS):
        col, row = index % 4, index // 4
        source_top = 0 if row == 0 else 500
        source_bottom = 500 if row == 0 else 1024
        cell_box = (col * cell_w, source_top, (col + 1) * cell_w, source_bottom)
        cell = extracted.crop(cell_box)
        bbox = cell.getchannel("A").getbbox()
        if bbox is None:
            raise ValueError(f"No foreground detected in cell {index}: {label}")
        character = cell.crop(bbox)

        max_width = 346
        max_height = character_bottom[row] - character_top[row]
        scale = min(max_width / character.width, max_height / character.height, 1.0)
        new_size = (max(1, round(character.width * scale)), max(1, round(character.height * scale)))
        if new_size != character.size:
            character = character.resize(new_size, Image.Resampling.LANCZOS)

        x = col * cell_w + (cell_w - character.width) // 2
        y = character_bottom[row] - character.height
        canvas.alpha_composite(character, (x, y))

    draw = ImageDraw.Draw(canvas)
    typeface = font(18)
    label_centers = (482, 994)
    for index, label in enumerate(LABELS):
        col, row = index % 4, index // 4
        cx = col * cell_w + cell_w // 2
        cy = label_centers[row]
        box = (cx - 140, cy - 18, cx + 140, cy + 18)
        draw.rounded_rectangle(box, radius=18, fill=(255, 255, 255, 255), outline=NAVY, width=3)
        inner = (box[0] + 7, box[1] + 7, box[2] - 7, box[3] - 7)
        draw.rounded_rectangle(inner, radius=11, outline=BLUE, width=1)
        text_box = draw.textbbox((0, 0), label, font=typeface)
        text_width = text_box[2] - text_box[0]
        text_height = text_box[3] - text_box[1]
        draw.text(
            (cx - text_width / 2, cy - text_height / 2 - text_box[1]),
            label,
            font=typeface,
            fill=NAVY,
        )
    return canvas


def composite_on(image: Image.Image, background: tuple[int, int, int, int]) -> Image.Image:
    base = Image.new("RGBA", image.size, background)
    base.alpha_composite(image)
    return base.convert("RGB")


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")
    if source.size != (1536, 1024):
        raise ValueError(f"Unexpected source size: {source.size}")

    extracted = extract_from_white(source)
    extracted.save(RAW, optimize=True)
    final = arrange_and_label(extracted)

    pixels = np.asarray(final, dtype=np.uint8).copy()
    pixels[..., :3][pixels[..., 3] == 0] = 0
    final = Image.fromarray(pixels)
    final.save(FINAL, optimize=True)
    final.save(MASTER, optimize=True)

    composite_on(final, (255, 255, 255, 255)).save(
        ROUNDS / "lead-mascot-sheet-r40-white-qa.png", optimize=True
    )
    composite_on(final, (7, 13, 24, 255)).save(
        ROUNDS / "lead-mascot-sheet-r40-black-qa.png", optimize=True
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
        ROUNDS / "lead-mascot-sheet-r40-checker-qa.png", optimize=True
    )

    alpha = final.getchannel("A")
    silhouette = Image.new("RGBA", final.size, (0, 0, 0, 0))
    silhouette.paste(NAVY, mask=alpha)
    composite_on(silhouette, (255, 255, 255, 255)).save(
        ROUNDS / "lead-mascot-sheet-r40-silhouette-qa.png", optimize=True
    )

    thumb = composite_on(final, (255, 255, 255, 255)).resize(
        (384, 256), Image.Resampling.LANCZOS
    )
    thumb.save(ROUNDS / "lead-mascot-sheet-r40-96px-qa.png", optimize=True)

    digest = hashlib.sha256(FINAL.read_bytes()).hexdigest().upper()
    alpha_values = sorted(set(alpha.getdata()))
    transparent_rgb = np.asarray(final, dtype=np.uint8)[np.asarray(alpha) == 0, :3]
    transparent_nonblack = int(np.count_nonzero(np.any(transparent_rgb != 0, axis=1)))
    print(f"source={SOURCE.relative_to(ROOT)}")
    print(f"master={MASTER.relative_to(ROOT)}")
    print(f"size={final.width}x{final.height} mode={final.mode}")
    print(f"alpha_levels={len(alpha_values)} min={alpha_values[0]} max={alpha_values[-1]}")
    print(f"alpha_bbox={alpha.getbbox()}")
    print(f"corners={[final.getpixel(p)[3] for p in [(0,0),(1535,0),(0,1023),(1535,1023)]]}")
    print(f"transparent_nonblack={transparent_nonblack}")
    print(f"sha256={digest}")


if __name__ == "__main__":
    main()
