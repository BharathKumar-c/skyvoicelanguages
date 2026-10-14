"""Round 37 refined signal-starling background extraction and QA exports.

The generated premium rendering is preserved. This script removes only the
border-connected neutral matte, adds the standard label chips, and exports QA.
"""

from collections import Counter, deque
from hashlib import sha256
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "design/mascot/rounds/lead-mascot-sheet-r37-raw.png"
MASTER = ROOT / "apps/web/public/mascot/lead-mascot-sheet.png"
ARCHIVE = ROOT / "design/mascot/rounds/lead-mascot-sheet-r37.png"
ROUNDS = ROOT / "design/mascot/rounds"
FONT_PATH = Path(r"C:\Windows\Fonts\ARLRDBD.TTF")

NAVY = (14, 45, 94)
WHITE = (255, 255, 255)

LABELS = [
    ((67, 459, 317, 494), "FRONT"),
    ((451, 459, 701, 494), "3/4"),
    ((835, 459, 1085, 494), "LISTENING"),
    ((1219, 459, 1469, 494), "SPEAKING"),
    ((67, 985, 317, 1020), "READING"),
    ((451, 985, 701, 1020), "WRITING"),
    ((835, 985, 1085, 1020), "FEEDBACK"),
    ((1219, 985, 1469, 1020), "CELEBRATION"),
]


def border_connected_background(rgb: np.ndarray) -> np.ndarray:
    """Return the neutral bright matte connected to a canvas edge.

    The cream throat and paper are warm enough to fail the neutral test and,
    more importantly, are not connected to the border. Soft neutral cast
    shadows remain removable because they join the surrounding matte.
    """
    high = rgb.max(axis=2).astype(np.int16)
    low = rgb.min(axis=2).astype(np.int16)
    neutral_bright = (low >= 218) & ((high - low) <= 17)
    h, w = neutral_bright.shape
    seen = np.zeros((h, w), dtype=bool)
    queue: deque[int] = deque()

    def seed(y: int, x: int) -> None:
        if neutral_bright[y, x] and not seen[y, x]:
            seen[y, x] = True
            queue.append(y * w + x)

    for x in range(w):
        seed(0, x)
        seed(h - 1, x)
    for y in range(1, h - 1):
        seed(y, 0)
        seed(y, w - 1)

    while queue:
        idx = queue.popleft()
        y, x = divmod(idx, w)
        if x and neutral_bright[y, x - 1] and not seen[y, x - 1]:
            seen[y, x - 1] = True
            queue.append(idx - 1)
        if x + 1 < w and neutral_bright[y, x + 1] and not seen[y, x + 1]:
            seen[y, x + 1] = True
            queue.append(idx + 1)
        if y and neutral_bright[y - 1, x] and not seen[y - 1, x]:
            seen[y - 1, x] = True
            queue.append(idx - w)
        if y + 1 < h and neutral_bright[y + 1, x] and not seen[y + 1, x]:
            seen[y + 1, x] = True
            queue.append(idx + w)
    return seen


def remove_matte(source: Image.Image) -> Image.Image:
    rgb = np.asarray(source.convert("RGB")).copy()
    background = border_connected_background(rgb)
    foreground = ~background

    # The feedback card intentionally uses a neutral near-white fill that is
    # visually identical to the matte. Protect its known rounded silhouette.
    protected = Image.new("L", source.size, 0)
    protected_draw = ImageDraw.Draw(protected)
    protected_draw.rounded_rectangle((925, 681, 1121, 811), radius=18, fill=255)
    foreground |= np.asarray(protected) > 0

    # Drop the outermost source pixel before rebuilding the edge. This removes
    # white-matte contamination while retaining the premium interior shading.
    foreground = np.asarray(
        Image.fromarray((foreground * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))
    ) > 0

    # Retain original premium pixels. Add two narrow shape-coloured edge bands
    # outside the extracted foreground to avoid a white fringe on dark proofs.
    core = Image.fromarray((foreground * 255).astype(np.uint8))
    dilate_1 = np.asarray(core.filter(ImageFilter.MaxFilter(3))) > 0
    dilate_2 = np.asarray(core.filter(ImageFilter.MaxFilter(5))) > 0
    ring_1 = dilate_1 & ~foreground
    ring_2 = dilate_2 & ~dilate_1

    alpha = np.zeros(foreground.shape, dtype=np.uint8)
    alpha[foreground] = 255
    alpha[ring_1] = 176
    alpha[ring_2] = 72

    # Pull RGB into antialias bands from the nearest retained shape pixel.
    result_rgb = rgb.copy()
    known = foreground.copy()
    for ring in (ring_1, ring_2):
        remaining = ring.copy()
        expanded_known = known | ring
        for dy, dx in ((0, -1), (0, 1), (-1, 0), (1, 0), (-1, -1), (-1, 1), (1, -1), (1, 1)):
            src_known = np.zeros_like(known)
            src_rgb = np.zeros_like(result_rgb)
            ys = slice(max(0, -dy), min(known.shape[0], known.shape[0] - dy))
            xs = slice(max(0, -dx), min(known.shape[1], known.shape[1] - dx))
            yd = slice(max(0, dy), min(known.shape[0], known.shape[0] + dy))
            xd = slice(max(0, dx), min(known.shape[1], known.shape[1] + dx))
            src_known[yd, xd] = known[ys, xs]
            src_rgb[yd, xd] = result_rgb[ys, xs]
            take = remaining & src_known
            result_rgb[take] = src_rgb[take]
            remaining[take] = False
        known = expanded_known

    result_rgb[alpha == 0] = 0
    return Image.fromarray(np.dstack((result_rgb, alpha)))


def centered_text(draw: ImageDraw.ImageDraw, box, text: str, font, fill) -> None:
    x0, y0, x1, y1 = box
    bounds = draw.textbbox((0, 0), text, font=font)
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    x = x0 + ((x1 - x0) - width) / 2 - bounds[0]
    y = y0 + ((y1 - y0) - height) / 2 - bounds[1]
    draw.text((round(x), round(y)), text, font=font, fill=fill)


def add_labels(master: Image.Image) -> Image.Image:
    # Render 4x then downsample for crisp rounded chips in the narrow clear bands.
    scale = 4
    layer = Image.new("RGBA", (master.width * scale, master.height * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    font_size = 19
    font = ImageFont.truetype(str(FONT_PATH), font_size * scale)
    for box, label in LABELS:
        sb = tuple(v * scale for v in box)
        draw.rounded_rectangle(sb, radius=17 * scale, fill=WHITE + (255,), outline=NAVY + (255,), width=3 * scale)
        centered_text(draw, sb, label, font, NAVY + (255,))
    layer = layer.resize(master.size, Image.Resampling.LANCZOS)
    return Image.alpha_composite(master, layer)


def build_master() -> Image.Image:
    source = Image.open(RAW).convert("RGB")
    if source.size != (1536, 1024):
        source = source.resize((1536, 1024), Image.Resampling.LANCZOS)
    master = add_labels(remove_matte(source))
    arr = np.asarray(master).copy()
    arr[arr[:, :, 3] == 0, :3] = 0
    master = Image.fromarray(arr)
    MASTER.parent.mkdir(parents=True, exist_ok=True)
    master.save(MASTER, optimize=True)
    master.save(ARCHIVE, optimize=True)
    return master


def composite(foreground: Image.Image, color: tuple[int, int, int]) -> Image.Image:
    bg = Image.new("RGBA", foreground.size, color + (255,))
    return Image.alpha_composite(bg, foreground).convert("RGB")


def export_qa(master: Image.Image) -> None:
    composite(master, WHITE).save(ROUNDS / "lead-mascot-sheet-r37-white-qa.png", optimize=True)
    composite(master, (0, 0, 0)).save(ROUNDS / "lead-mascot-sheet-r37-black-qa.png", optimize=True)

    tile = 32
    checker = Image.new("RGB", master.size)
    pixels = checker.load()
    for y in range(master.height):
        for x in range(master.width):
            pixels[x, y] = (232, 236, 243) if ((x // tile + y // tile) % 2 == 0) else (177, 186, 201)
    Image.alpha_composite(checker.convert("RGBA"), master).convert("RGB").save(
        ROUNDS / "lead-mascot-sheet-r37-checker-qa.png", optimize=True
    )

    alpha = master.getchannel("A")
    silhouette = Image.new("RGBA", master.size, NAVY + (0,))
    silhouette.putalpha(alpha)
    composite(silhouette, WHITE).resize((576, 384), Image.Resampling.LANCZOS).save(
        ROUNDS / "lead-mascot-sheet-r37-silhouette-qa.png", optimize=True
    )
    composite(master, WHITE).resize((320, 213), Image.Resampling.LANCZOS).save(
        ROUNDS / "lead-mascot-sheet-r37-96px-qa.png", optimize=True
    )


def validate(master: Image.Image) -> None:
    arr = np.asarray(master)
    alpha_hist = Counter(arr[:, :, 3].ravel())
    corners = [int(arr[y, x, 3]) for x, y in ((0, 0), (1535, 0), (0, 1023), (1535, 1023))]
    transparent_rgb_nonzero = int(np.count_nonzero(arr[:, :, :3][arr[:, :, 3] == 0]))
    digest = sha256(MASTER.read_bytes()).hexdigest().upper()
    print(f"master={MASTER}")
    print(f"size={master.size} mode={master.mode}")
    print(f"alpha_values={len(alpha_hist)} min={min(alpha_hist)} max={max(alpha_hist)}")
    print(f"alpha_zero={alpha_hist[0]} alpha_opaque={alpha_hist[255]}")
    print(f"corner_alpha={corners}")
    print(f"transparent_rgb_nonzero={transparent_rgb_nonzero}")
    print(f"archive_byte_match={MASTER.read_bytes() == ARCHIVE.read_bytes()}")
    print(f"sha256={digest}")


if __name__ == "__main__":
    image = build_master()
    export_qa(image)
    validate(image)
