from pathlib import Path
from PIL import Image, ImageDraw

from process_piece2 import (
    COLS,
    ROWS,
    PALETTE,
    ROOT,
    PIECE,
    LEAD,
    fit,
    flatten_to_brand,
    font,
    label,
    remove_detached_orange_components,
    remove_small_islands,
    trim_with_padding,
)


SOURCE = PIECE / "source" / "skill-signals-r2-imagegen.png"
RENDERS = PIECE / "renders"
QA = PIECE / "qa"
PUBLIC = ROOT / "apps" / "web" / "public" / "mascot" / "skill-signals"


def place_on_standard_canvas(image, canvas_size=420, content_limit=380):
    """Preserve relative state scale while giving every asset identical registration."""
    content = image.copy()
    if content.width > content_limit or content.height > content_limit:
        content.thumbnail((content_limit, content_limit), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    canvas.alpha_composite(content, ((canvas_size - content.width) // 2, (canvas_size - content.height) // 2))
    return canvas


def emphasize_directional_active(image, skill):
    """Increase the carrier-body expansion enough to survive a 48 px render."""
    x_factors = {
        "listening": 1.15,
        "reading": 1.12,
        "writing": 1.12,
        "speaking": 1.10,
    }
    y_factors = {
        "listening": 0.98,
        "reading": 0.96,
        "writing": 1.04,
        "speaking": 1.02,
    }
    expanded = image.resize(
        (round(image.width * x_factors[skill]), round(image.height * y_factors[skill])),
        Image.Resampling.LANCZOS,
    )
    return flatten_to_brand(expanded)


def build_round(version="r2", source_path=SOURCE, clean_active_marks=False):
    RENDERS.mkdir(parents=True, exist_ok=True)
    QA.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)

    source = Image.open(source_path).convert("RGBA")
    master = flatten_to_brand(source)
    master_path = RENDERS / f"skill-signal-system-{version}.png"
    master.save(master_path, optimize=True)

    cell_w = source.width // 4
    row_edges = (0, source.height // 3, (source.height * 2) // 3, source.height)
    assets = {}
    for row_index, state in enumerate(ROWS):
        for col_index, skill in enumerate(COLS):
            top = row_edges[row_index]
            if state == "success":
                # The released spark intentionally crosses the nominal row boundary.
                top = max(0, top - 90)
            box = (col_index * cell_w, top, (col_index + 1) * cell_w, row_edges[row_index + 1])
            raw = master.crop(box)
            if clean_active_marks and state == "active":
                raw = remove_detached_orange_components(raw)
            minimum = (180 if clean_active_marks else 400) if state == "active" else (100 if state == "success" else 180)
            drop_edges = state == "success" if clean_active_marks else True
            item = trim_with_padding(
                remove_small_islands(raw, minimum_pixels=minimum, drop_edge_components=drop_edges),
                24,
            )
            if clean_active_marks and state == "active":
                item = emphasize_directional_active(item, skill)
            item = place_on_standard_canvas(item)
            versioned_name = f"{skill}-{state}-{version}.png"
            item.save(RENDERS / versioned_name, optimize=True)
            assets[(skill, state)] = item

    production_master = Image.new("RGBA", (420 * len(COLS), 420 * len(ROWS)), (0, 0, 0, 0))
    for row_index, state in enumerate(ROWS):
        for col_index, skill in enumerate(COLS):
            production_master.alpha_composite(assets[(skill, state)], (col_index * 420, row_index * 420))
    production_master.save(master_path, optimize=True)

    board = Image.new("RGBA", (1680, 1220), (255, 255, 255, 255))
    draw = ImageDraw.Draw(board)
    draw.rounded_rectangle((24, 24, 1656, 1196), radius=28, fill=(255, 255, 255, 255), outline=PALETTE[0] + (255,), width=3)
    label(draw, (840, 64), f"AIRA SKILL SIGNALS — {version.upper()}", 36)
    for c, skill in enumerate(COLS):
        label(draw, (300 + c * 360, 128), skill.upper(), 25)
    for r, state in enumerate(ROWS):
        label(draw, (86, 306 + r * 326), state.upper(), 24)
        for c, skill in enumerate(COLS):
            item = fit(assets[(skill, state)], (250, 250))
            x = 300 + c * 360 - item.width // 2
            y = 306 + r * 326 - item.height // 2
            board.alpha_composite(item, (x, y))
    board.convert("RGB").save(QA / f"skill-signal-system-{version}-labeled-qa.png", quality=95)

    # State-mechanics proof removes scale variance and lets critics compare the carrier itself.
    mechanics = Image.new("RGBA", (1440, 760), (255, 255, 255, 255))
    mdraw = ImageDraw.Draw(mechanics)
    mdraw.rounded_rectangle((24, 24, 1416, 736), radius=28, fill=(255, 255, 255, 255), outline=PALETTE[0] + (255,), width=3)
    label(mdraw, (720, 64), "SHARED CARRIER STATE MECHANICS", 32)
    for c, state in enumerate(ROWS):
        label(mdraw, (345 + c * 390, 125), state.upper(), 23)
    for r, skill in enumerate(COLS):
        label(mdraw, (88, 215 + r * 125), skill.upper(), 19, anchor="lm")
        for c, state in enumerate(ROWS):
            item = fit(assets[(skill, state)], (108, 108))
            cx, cy = 345 + c * 390, 215 + r * 125
            mechanics.alpha_composite(item, (cx - item.width // 2, cy - item.height // 2))
    mechanics.convert("RGB").save(QA / f"skill-signal-system-{version}-state-mechanics-qa.png", quality=95)

    lead_sheet = Image.open(LEAD).convert("RGBA")
    aira = trim_with_padding(lead_sheet.crop((20, 0, 360, 455)), 8)
    hierarchy = Image.new("RGBA", (1400, 800), (255, 255, 255, 255))
    hdraw = ImageDraw.Draw(hierarchy)
    hdraw.rounded_rectangle((24, 24, 1376, 776), radius=28, fill=(255, 255, 255, 255), outline=PALETTE[0] + (255,), width=3)
    label(hdraw, (700, 70), "LEAD + COHERENT SUPPORTING FAMILY", 32)
    aira_fit = fit(aira, (430, 610))
    hierarchy.alpha_composite(aira_fit, (110, 132))
    label(hdraw, (325, 736), "AIRA — SOLE LEAD", 24)
    positions = ((750, 240), (1090, 240), (750, 560), (1090, 560))
    for (skill, state), (cx, cy) in zip(((s, "idle") for s in COLS), positions):
        item = fit(assets[(skill, state)], (150, 150))
        hierarchy.alpha_composite(item, (cx - item.width // 2, cy - item.height // 2))
        label(hdraw, (cx, cy + 110), skill.upper(), 21)
    hierarchy.convert("RGB").save(QA / f"skill-signal-system-{version}-hierarchy-qa.png", quality=95)

    small = Image.new("RGBA", (1180, 500), (255, 255, 255, 255))
    sdraw = ImageDraw.Draw(small)
    label(sdraw, (590, 38), "48 PX IDENTITY + STATE CHECK", 28)
    for row, state in enumerate(ROWS):
        label(sdraw, (75, 130 + row * 135), state.upper(), 20, anchor="lm")
        for col, skill in enumerate(COLS):
            item = fit(assets[(skill, state)], (48, 48))
            cx, cy = 290 + col * 235, 130 + row * 135
            small.alpha_composite(item, (cx - item.width // 2, cy - item.height // 2))
    small.convert("RGB").save(QA / f"skill-signal-system-{version}-48px-qa.png", quality=95)

    checker = Image.new("RGBA", production_master.size, (255, 255, 255, 255))
    cdraw = ImageDraw.Draw(checker)
    tile = 32
    for y in range(0, production_master.height, tile):
        for x in range(0, production_master.width, tile):
            if (x // tile + y // tile) % 2:
                cdraw.rectangle((x, y, x + tile - 1, y + tile - 1), fill=(226, 232, 240, 255))
    checker.alpha_composite(production_master)
    checker.convert("RGB").save(QA / f"skill-signal-system-{version}-checker-qa.png", quality=95)

    black = Image.new("RGBA", production_master.size, (0, 0, 0, 255))
    black.alpha_composite(production_master)
    black.convert("RGB").save(QA / f"skill-signal-system-{version}-black-qa.png", quality=95)

    # Publish only after the complete Round 2 master and QA assets have been built.
    production_master.save(PUBLIC / "skill-signal-system.png", optimize=True)
    for (skill, state), item in assets.items():
        item.save(PUBLIC / f"{skill}-{state}.png", optimize=True)


if __name__ == "__main__":
    build_round()

