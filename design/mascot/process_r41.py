"""Extract, arrange, label, and validate the Round 41 Signal Navigator."""

from __future__ import annotations

import hashlib
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[2]
ROUND = "r41"
SOURCE = ROOT / f"design/mascot/rounds/lead-mascot-sheet-{ROUND}-imagegen-white.png"
ROUNDS = ROOT / "design/mascot/rounds"
MASTER = ROOT / "apps/web/public/mascot/lead-mascot-sheet.png"
RAW = ROUNDS / f"lead-mascot-sheet-{ROUND}-raw.png"
FINAL = ROUNDS / f"lead-mascot-sheet-{ROUND}.png"
SOURCE_COLUMNS = ((0, 384), (384, 730), (730, 1152), (1152, 1536))
SEMANTIC_BLUE_PALETTE: tuple[tuple[int, int, int], ...] | None = None

LABELS = (
    "FRONT", "3/4", "LISTENING", "SPEAKING",
    "READING", "WRITING", "FEEDBACK", "CELEBRATION",
)
NAVY = (14, 45, 94, 255)
BLUE = (22, 85, 216, 255)


def connected_neutral_background(rgb: np.ndarray) -> np.ndarray:
    """Find only the border-connected near-white matte."""
    maximum = rgb.max(axis=2).astype(np.int16)
    minimum = rgb.min(axis=2).astype(np.int16)
    chroma = maximum - minimum
    # The generator leaves a soft neutral matte extending well below pure white.
    # A wide luminance gate plus a tight chroma gate removes that matte without
    # admitting the warm cream face, cards, or module tiles.
    candidate = (minimum > 160) & (chroma < 18)

    mask = Image.fromarray(np.where(candidate, 255, 0).astype(np.uint8))
    padded = Image.new("L", (mask.width + 2, mask.height + 2), 255)
    padded.paste(mask, (1, 1))
    ImageDraw.floodfill(padded, (0, 0), 128)
    return np.asarray(padded, dtype=np.uint8)[1:-1, 1:-1] == 128


def extract_from_white(source: Image.Image) -> Image.Image:
    """Remove the white matte while protecting warm cream foreground forms."""
    rgb = np.asarray(source.convert("RGB"), dtype=np.uint8)
    background = connected_neutral_background(rgb)
    maximum = rgb.max(axis=2).astype(np.float32)
    minimum = rgb.min(axis=2).astype(np.float32)
    distance = 255.0 - minimum
    chroma = maximum - minimum

    # Remove the full connected neutral matte, then reconstruct only the narrow
    # one-pixel antialias fringe from its color strength. This avoids retaining
    # pale generator glow as a white halo on dark backgrounds.
    alpha = np.where(background, 0.0, 255.0)
    background_image = Image.fromarray(np.where(background, 255, 0).astype(np.uint8))
    dilated = np.asarray(background_image.filter(ImageFilter.MaxFilter(3))) == 255
    fringe = dilated & ~background
    fringe_alpha = np.clip(
        np.maximum(chroma / 48.0, distance / 110.0) * 255.0,
        0.0,
        255.0,
    )
    alpha[fringe] = fringe_alpha[fringe]
    alpha = alpha.astype(np.uint8)
    alpha[alpha < 8] = 0

    # Warm generated foreground is authoritative. Restore it explicitly so the
    # matte flood can never eat cream cards, module tiles, or softly shaded skin.
    warm_foreground = (
        (rgb[..., 0] > 200)
        & (rgb[..., 1] > 175)
        & (rgb[..., 2] > 145)
        & ((rgb[..., 0].astype(np.int16) - rgb[..., 2].astype(np.int16)) > 18)
        & ((rgb[..., 1].astype(np.int16) - rgb[..., 2].astype(np.int16)) > 3)
    )
    alpha[warm_foreground] = 255

    # Each face window is a locked cream disc. Isolate the connected warm cream
    # component nearest each expected face center, then protect its fitted ellipse
    # so neutral highlights cannot be reached through an open orbit gap.
    protected_faces = Image.new("L", source.size, 0)
    protected_draw = ImageDraw.Draw(protected_faces)
    face_centers = (
        (205, 112), (581, 112), (960, 112), (1341, 112),
        (205, 605), (581, 605), (960, 605), (1347, 605),
    )
    cream_candidate = (
        (rgb[..., 0] > 215)
        & (rgb[..., 1] > 195)
        & (rgb[..., 2] > 160)
        & ((rgb[..., 0].astype(np.int16) - rgb[..., 1].astype(np.int16)) > 3)
        & ((rgb[..., 0].astype(np.int16) - rgb[..., 1].astype(np.int16)) < 55)
        & ((rgb[..., 1].astype(np.int16) - rgb[..., 2].astype(np.int16)) > 5)
        & ((rgb[..., 1].astype(np.int16) - rgb[..., 2].astype(np.int16)) < 55)
    )
    for index, (center_x, center_y) in enumerate(face_centers):
        column, row = index % 4, index // 4
        left, right = column * 384, (column + 1) * 384
        top, bottom = (0, 220) if row == 0 else (480, 710)
        zone = cream_candidate[top:bottom, left:right]
        if not np.any(zone):
            raise ValueError(f"Could not locate face component in cell {index}")
        visited = np.zeros_like(zone, dtype=bool)
        component = np.zeros_like(zone, dtype=bool)
        for start_y, start_x in zip(*np.where(zone & ~visited)):
            if visited[start_y, start_x]:
                continue
            current = np.zeros_like(zone, dtype=bool)
            queue: deque[tuple[int, int]] = deque([(int(start_x), int(start_y))])
            while queue:
                x, y = queue.popleft()
                if x < 0 or y < 0 or x >= zone.shape[1] or y >= zone.shape[0]:
                    continue
                if visited[y, x] or not zone[y, x]:
                    continue
                visited[y, x] = True
                current[y, x] = True
                queue.extend(
                    ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
                )
            if int(current.sum()) > int(component.sum()):
                component = current
        ys, xs = np.where(component)
        if len(xs) == 0:
            raise ValueError(f"Empty face component in cell {index}")
        face_box = (
            left + int(xs.min()),
            top + int(ys.min()),
            left + int(xs.max()),
            top + int(ys.max()),
        )
        width = face_box[2] - face_box[0]
        height = face_box[3] - face_box[1]
        if not (70 <= width <= 135 and 70 <= height <= 145):
            raise ValueError(f"Unexpected face bounds in cell {index}: {face_box}")
        protected_draw.ellipse(face_box, fill=255)
    face_shape = np.asarray(protected_faces, dtype=np.uint8) == 255
    warm_face_pixel = (
        ((rgb[..., 0].astype(np.int16) - rgb[..., 2].astype(np.int16)) > 8)
        & ((rgb[..., 1].astype(np.int16) - rgb[..., 2].astype(np.int16)) > 2)
    )
    alpha[face_shape & warm_face_pixel] = 255

    rgba = np.dstack((rgb, alpha)).astype(np.uint8)
    partial = (alpha > 0) & (alpha < 255)
    if np.any(partial):
        normalized_alpha = alpha.astype(np.float32) / 255.0
        for channel in range(3):
            observed = rgb[..., channel].astype(np.float32)
            unmatted = (observed - 255.0 * (1.0 - normalized_alpha)) / np.maximum(
                normalized_alpha, 1e-6
            )
            rgba[..., channel][partial] = np.clip(
                unmatted[partial], 0, 255
            ).astype(np.uint8)

    rgba[..., :3][alpha == 0] = 0
    return Image.fromarray(rgba)


def label_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in (
        Path("C:/Windows/Fonts/arialbd.ttf"),
        Path("C:/Windows/Fonts/segoeuib.ttf"),
    ):
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def arrange_and_label(extracted: Image.Image) -> Image.Image:
    """Fit source cells proportionally into the established labeled grid."""
    canvas = Image.new("RGBA", (1536, 1024), (0, 0, 0, 0))
    cell_width = 384
    source_rows = ((0, 480), (480, 1024))
    # LISTENING's extended lower hand crosses the generated 768 px guide. Give
    # that intact artwork to its own cell instead of clipping it into 3/4.
    source_columns = SOURCE_COLUMNS
    art_top = (8, 522)
    art_bottom = (452, 964)

    for index, label in enumerate(LABELS):
        column, row = index % 4, index // 4
        source_top, source_bottom = source_rows[row]
        source_left, source_right = source_columns[column]
        cell = extracted.crop(
            (source_left, source_top, source_right, source_bottom)
        )
        bbox = cell.getchannel("A").getbbox()
        if bbox is None:
            raise ValueError(f"No foreground detected in cell {index}: {label}")
        character = cell.crop(bbox)

        max_width = 350
        max_height = art_bottom[row] - art_top[row]
        scale = min(max_width / character.width, max_height / character.height, 1.0)
        resized = (
            max(1, round(character.width * scale)),
            max(1, round(character.height * scale)),
        )
        if resized != character.size:
            character = character.resize(resized, Image.Resampling.LANCZOS)

        x = column * cell_width + (cell_width - character.width) // 2
        y = art_bottom[row] - character.height
        canvas.alpha_composite(character, (x, y))

    draw = ImageDraw.Draw(canvas)
    typeface = label_font(18)
    label_centers = (482, 994)
    for index, label in enumerate(LABELS):
        column, row = index % 4, index // 4
        center_x = column * cell_width + cell_width // 2
        center_y = label_centers[row]
        box = (center_x - 132, center_y - 18, center_x + 132, center_y + 18)
        draw.rounded_rectangle(
            box, radius=18, fill=(255, 255, 255, 255), outline=NAVY, width=3
        )
        inset = (box[0] + 7, box[1] + 7, box[2] - 7, box[3] - 7)
        draw.rounded_rectangle(inset, radius=11, outline=BLUE, width=1)
        text_box = draw.textbbox((0, 0), label, font=typeface)
        text_width = text_box[2] - text_box[0]
        text_height = text_box[3] - text_box[1]
        draw.text(
            (center_x - text_width / 2, center_y - text_height / 2 - text_box[1]),
            label,
            font=typeface,
            fill=NAVY,
        )
    return canvas


def composite_on(image: Image.Image, color: tuple[int, int, int, int]) -> Image.Image:
    base = Image.new("RGBA", image.size, color)
    base.alpha_composite(image)
    return base.convert("RGB")


def flatten_semantic_blues(image: Image.Image) -> Image.Image:
    """Map only blue/navy pixels to an optional controlled solid palette."""
    if SEMANTIC_BLUE_PALETTE is None:
        return image
    pixels = np.asarray(image, dtype=np.uint8).copy()
    rgb = pixels[..., :3]
    alpha = pixels[..., 3]
    blue_mask = (
        (alpha > 0)
        & (rgb[..., 2].astype(np.int16) > rgb[..., 0].astype(np.int16) + 18)
        & (rgb[..., 2].astype(np.int16) > rgb[..., 1].astype(np.int16) + 8)
    )
    source_colors = rgb[blue_mask].astype(np.int32)
    palette = np.asarray(SEMANTIC_BLUE_PALETTE, dtype=np.int32)
    distances = ((source_colors[:, None, :] - palette[None, :, :]) ** 2).sum(axis=2)
    rgb[blue_mask] = palette[np.argmin(distances, axis=1)].astype(np.uint8)
    return Image.fromarray(pixels)


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")
    if source.size != (1536, 1024):
        raise ValueError(f"Unexpected source size: {source.size}")

    extracted = extract_from_white(source)
    extracted.save(RAW, optimize=True)
    final = flatten_semantic_blues(arrange_and_label(extracted))

    pixels = np.asarray(final, dtype=np.uint8).copy()
    pixels[..., :3][pixels[..., 3] == 0] = 0
    final = Image.fromarray(pixels)
    final.save(FINAL, optimize=True)
    MASTER.parent.mkdir(parents=True, exist_ok=True)
    final.save(MASTER, optimize=True)

    composite_on(final, (255, 255, 255, 255)).save(
        ROUNDS / f"lead-mascot-sheet-{ROUND}-white-qa.png", optimize=True
    )
    composite_on(final, (7, 13, 24, 255)).save(
        ROUNDS / f"lead-mascot-sheet-{ROUND}-black-qa.png", optimize=True
    )

    checker = Image.new("RGBA", final.size, (255, 255, 255, 255))
    checker_draw = ImageDraw.Draw(checker)
    tile = 32
    for y in range(0, final.height, tile):
        for x in range(0, final.width, tile):
            if (x // tile + y // tile) % 2:
                checker_draw.rectangle(
                    (x, y, x + tile - 1, y + tile - 1),
                    fill=(220, 226, 234, 255),
                )
    checker.alpha_composite(final)
    checker.convert("RGB").save(
        ROUNDS / f"lead-mascot-sheet-{ROUND}-checker-qa.png", optimize=True
    )

    alpha = final.getchannel("A")
    silhouette = Image.new("RGBA", final.size, (0, 0, 0, 0))
    silhouette.paste(NAVY, mask=alpha)
    composite_on(silhouette, (255, 255, 255, 255)).save(
        ROUNDS / f"lead-mascot-sheet-{ROUND}-silhouette-qa.png", optimize=True
    )
    composite_on(final, (255, 255, 255, 255)).resize(
        (384, 256), Image.Resampling.LANCZOS
    ).save(ROUNDS / f"lead-mascot-sheet-{ROUND}-96px-qa.png", optimize=True)

    digest = hashlib.sha256(FINAL.read_bytes()).hexdigest().upper()
    alpha_array = np.asarray(alpha, dtype=np.uint8)
    alpha_values = sorted(set(alpha_array.reshape(-1).tolist()))
    final_array = np.asarray(final, dtype=np.uint8)
    transparent_rgb = final_array[alpha_array == 0, :3]
    transparent_nonblack = int(np.count_nonzero(np.any(transparent_rgb != 0, axis=1)))
    corners = [
        final.getpixel(point)[3]
        for point in ((0, 0), (1535, 0), (0, 1023), (1535, 1023))
    ]
    print(f"source={SOURCE.relative_to(ROOT)}")
    print(f"raw={RAW.relative_to(ROOT)}")
    print(f"archive={FINAL.relative_to(ROOT)}")
    print(f"master={MASTER.relative_to(ROOT)}")
    print(f"size={final.width}x{final.height} mode={final.mode}")
    print(f"alpha_levels={len(alpha_values)} min={alpha_values[0]} max={alpha_values[-1]}")
    print(f"alpha_bbox={alpha.getbbox()}")
    print(f"corners={corners}")
    print(f"transparent_nonblack={transparent_nonblack}")
    print(f"sha256={digest}")


if __name__ == "__main__":
    main()
