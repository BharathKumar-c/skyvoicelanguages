from collections import deque
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[3]
PIECE = Path(__file__).resolve().parent
SOURCE = PIECE / "source" / "skill-signals-r1-imagegen.png"
RENDERS = PIECE / "renders"
QA = PIECE / "qa"
PUBLIC = ROOT / "apps" / "web" / "public" / "mascot" / "skill-signals"
LEAD = ROOT / "design" / "mascot" / "rounds" / "lead-mascot-sheet-r44.png"

PALETTE = (
    (14, 45, 94),     # navy
    (22, 85, 216),    # cobalt
    (235, 157, 19),   # orange
    (255, 244, 214),  # cream
)

COLS = ("listening", "reading", "writing", "speaking")
ROWS = ("idle", "active", "success")


def nearest_brand(rgb):
    return min(PALETTE, key=lambda p: sum((a - b) ** 2 for a, b in zip(rgb, p)))


def flatten_to_brand(image):
    rgba = image.convert("RGBA")
    pixels = []
    for r, g, b, a in rgba.getdata():
        if a < 12:
            pixels.append((0, 0, 0, 0))
        else:
            nr, ng, nb = nearest_brand((r, g, b))
            pixels.append((nr, ng, nb, a))
    rgba.putdata(pixels)
    return rgba


def trim_with_padding(image, padding=24):
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        return Image.new("RGBA", (1, 1), (0, 0, 0, 0))
    crop = image.crop(bbox)
    out = Image.new("RGBA", (crop.width + padding * 2, crop.height + padding * 2), (0, 0, 0, 0))
    out.alpha_composite(crop, (padding, padding))
    return out


def remove_small_islands(image, minimum_pixels=180, drop_edge_components=False):
    """Remove row-boundary specks without dropping intentional action marks."""
    rgba = image.copy()
    alpha = rgba.getchannel("A")
    width, height = rgba.size
    opaque = alpha.load()
    seen = bytearray(width * height)
    kept_boxes = []
    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if seen[idx] or opaque[x, y] < 32:
                continue
            queue = deque(((x, y),))
            seen[idx] = 1
            count = 0
            min_x = max_x = x
            min_y = max_y = y
            while queue:
                px, py = queue.popleft()
                count += 1
                min_x, max_x = min(min_x, px), max(max_x, px)
                min_y, max_y = min(min_y, py), max(max_y, py)
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        nidx = ny * width + nx
                        if not seen[nidx] and opaque[nx, ny] >= 32:
                            seen[nidx] = 1
                            queue.append((nx, ny))
            touches_edge = min_x <= 2 or min_y <= 2 or max_x >= width - 3 or max_y >= height - 3
            if count >= minimum_pixels and not (drop_edge_components and touches_edge):
                kept_boxes.append((max(0, min_x - 3), max(0, min_y - 3), min(width, max_x + 4), min(height, max_y + 4)))
    mask = Image.new("L", rgba.size, 0)
    for box in kept_boxes:
        mask.paste(alpha.crop(box), box)
    rgba.putalpha(mask)
    return rgba


def remove_detached_orange_components(image):
    """Remove separate orange action marks while preserving orange embedded in a carrier."""
    rgba = image.copy()
    width, height = rgba.size
    pixels = rgba.load()
    seen = bytearray(width * height)
    remove = []
    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if seen[idx] or pixels[x, y][3] < 32:
                continue
            queue = deque(((x, y),))
            seen[idx] = 1
            component = []
            all_orange = True
            while queue:
                px, py = queue.popleft()
                component.append((px, py))
                r, g, b, _ = pixels[px, py]
                if (r, g, b) != PALETTE[2]:
                    all_orange = False
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        nidx = ny * width + nx
                        if not seen[nidx] and pixels[nx, ny][3] >= 32:
                            seen[nidx] = 1
                            queue.append((nx, ny))
            if all_orange:
                remove.extend(component)
    for x, y in remove:
        pixels[x, y] = (0, 0, 0, 0)
    return rgba


def fit(image, size):
    copy = image.copy()
    copy.thumbnail(size, Image.Resampling.LANCZOS)
    return copy


def font(size, bold=False):
    candidates = [
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def label(draw, xy, text, size=28, anchor="mm"):
    draw.text(xy, text, font=font(size, True), fill=PALETTE[0] + (255,), anchor=anchor)


def main():
    RENDERS.mkdir(parents=True, exist_ok=True)
    QA.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)

    source = Image.open(SOURCE).convert("RGBA")
    master = flatten_to_brand(source)
    master.save(RENDERS / "skill-signal-system-r1.png", optimize=True)
    master.save(PUBLIC / "skill-signal-system.png", optimize=True)

    cell_w = source.width // 4
    row_edges = (0, source.height // 3, (source.height * 2) // 3, source.height)
    assets = {}
    for row_index, state in enumerate(ROWS):
        for col_index, skill in enumerate(COLS):
            box = (col_index * cell_w, row_edges[row_index], (col_index + 1) * cell_w, row_edges[row_index + 1])
            item = trim_with_padding(remove_small_islands(master.crop(box)), 24)
            name = f"{skill}-{state}.png"
            item.save(RENDERS / name, optimize=True)
            item.save(PUBLIC / name, optimize=True)
            assets[(skill, state)] = item

    # Critic-facing labeled board: labels are deterministic and never image-generated.
    board = Image.new("RGBA", (1680, 1220), (255, 255, 255, 255))
    draw = ImageDraw.Draw(board)
    draw.rounded_rectangle((24, 24, 1656, 1196), radius=28, fill=(255, 255, 255, 255), outline=PALETTE[0] + (255,), width=3)
    label(draw, (840, 64), "AIRA SKILL SIGNALS", 36)
    for c, skill in enumerate(COLS):
        label(draw, (300 + c * 360, 128), skill.upper(), 25)
    for r, state in enumerate(ROWS):
        label(draw, (86, 306 + r * 326), state.upper(), 24)
        for c, skill in enumerate(COLS):
            item = fit(assets[(skill, state)], (250, 250))
            x = 300 + c * 360 - item.width // 2
            y = 306 + r * 326 - item.height // 2
            board.alpha_composite(item, (x, y))
    board.convert("RGB").save(QA / "skill-signal-system-r1-labeled-qa.png", quality=95)

    # Hierarchy proof: approved Aira stays dominant; signals remain supporting-scale objects.
    lead_sheet = Image.open(LEAD).convert("RGBA")
    aira = trim_with_padding(lead_sheet.crop((20, 0, 360, 455)), 8)
    hierarchy = Image.new("RGBA", (1400, 800), (255, 255, 255, 255))
    hdraw = ImageDraw.Draw(hierarchy)
    hdraw.rounded_rectangle((24, 24, 1376, 776), radius=28, fill=(255, 255, 255, 255), outline=PALETTE[0] + (255,), width=3)
    label(hdraw, (700, 70), "LEAD + SUPPORTING-SCALE CHECK", 32)
    aira_fit = fit(aira, (430, 610))
    hierarchy.alpha_composite(aira_fit, (110, 132))
    label(hdraw, (325, 736), "AIRA — SOLE LEAD", 24)
    positions = ((750, 240), (1090, 240), (750, 560), (1090, 560))
    for (skill, state), (cx, cy) in zip(((s, "idle") for s in COLS), positions):
        item = fit(assets[(skill, state)], (150, 150))
        hierarchy.alpha_composite(item, (cx - item.width // 2, cy - item.height // 2))
        label(hdraw, (cx, cy + 110), skill.upper(), 21)
    hierarchy.convert("RGB").save(QA / "skill-signal-system-r1-hierarchy-qa.png", quality=95)

    # Readability proofs at actual compact output sizes.
    small = Image.new("RGBA", (1180, 360), (255, 255, 255, 255))
    sdraw = ImageDraw.Draw(small)
    label(sdraw, (590, 38), "SMALL-SIZE READABILITY", 28)
    for index, size in enumerate((96, 48)):
        label(sdraw, (75, 125 + index * 145), f"{size} PX", 22, anchor="lm")
        for col, skill in enumerate(COLS):
            item = fit(assets[(skill, "active")], (size, size))
            cx = 290 + col * 235
            cy = 125 + index * 145
            small.alpha_composite(item, (cx - item.width // 2, cy - item.height // 2))
    small.convert("RGB").save(QA / "skill-signal-system-r1-small-size-qa.png", quality=95)

    # Transparency proofs expose halos and accidental holes.
    checker = Image.new("RGBA", master.size, (255, 255, 255, 255))
    cdraw = ImageDraw.Draw(checker)
    tile = 32
    for y in range(0, master.height, tile):
        for x in range(0, master.width, tile):
            if (x // tile + y // tile) % 2:
                cdraw.rectangle((x, y, x + tile - 1, y + tile - 1), fill=(226, 232, 240, 255))
    checker.alpha_composite(master)
    checker.convert("RGB").save(QA / "skill-signal-system-r1-checker-qa.png", quality=95)

    black = Image.new("RGBA", master.size, (0, 0, 0, 255))
    black.alpha_composite(master)
    black.convert("RGB").save(QA / "skill-signal-system-r1-black-qa.png", quality=95)


if __name__ == "__main__":
    main()

