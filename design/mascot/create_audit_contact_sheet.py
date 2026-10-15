from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
ROUNDS = ROOT / "rounds"
OUTPUT = ROOT / "audit-contact-sheet-r1-r43.png"

cols = 5
thumb_w, thumb_h = 300, 200
label_h = 30
rows = 9

canvas = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + label_h)), "white")
draw = ImageDraw.Draw(canvas)
font = ImageFont.load_default(size=18)

for round_number in range(1, 44):
    source = ROUNDS / f"lead-mascot-sheet-r{round_number}.png"
    col = (round_number - 1) % cols
    row = (round_number - 1) // cols
    x = col * thumb_w
    y = row * (thumb_h + label_h)

    if source.exists():
        image = Image.open(source).convert("RGBA")
        background = Image.new("RGBA", image.size, "white")
        background.alpha_composite(image)
        preview = background.convert("RGB")
        preview.thumbnail((thumb_w - 12, thumb_h - 12), Image.Resampling.LANCZOS)
        px = x + (thumb_w - preview.width) // 2
        py = y + (thumb_h - preview.height) // 2
        canvas.paste(preview, (px, py))
        status = "asset"
    else:
        status = "missing"

    draw.rectangle((x, y + thumb_h, x + thumb_w - 1, y + thumb_h + label_h - 1), outline="#D7E1EF")
    draw.text((x + 10, y + thumb_h + 6), f"Round {round_number} — {status}", fill="#0E2D5E", font=font)

canvas.save(OUTPUT, optimize=True)
print(OUTPUT)
