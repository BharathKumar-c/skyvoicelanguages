from pathlib import Path
from PIL import Image, ImageDraw


def make_sheet(paths: list[Path], output: Path, columns: int = 2, width: int = 700) -> None:
    thumbs: list[tuple[Path, Image.Image]] = []
    for path in paths:
        image = Image.open(path).convert("RGB")
        height = round(image.height * width / image.width)
        thumbs.append((path, image.resize((width, height))))

    label_height = 36
    rows = (len(thumbs) + columns - 1) // columns
    row_heights: list[int] = []
    for row in range(rows):
        row_items = thumbs[row * columns : (row + 1) * columns]
        row_heights.append(max(image.height for _, image in row_items) + label_height)

    sheet = Image.new("RGB", (columns * width, sum(row_heights)), "white")
    draw = ImageDraw.Draw(sheet)
    y = 0
    for row in range(rows):
        row_items = thumbs[row * columns : (row + 1) * columns]
        for column, (path, image) in enumerate(row_items):
            x = column * width
            draw.text((x + 8, y + 8), path.name, fill="black")
            sheet.paste(image, (x, y + label_height))
        y += row_heights[row]

    sheet.save(output, optimize=True)


root = Path(__file__).parent
make_sheet(sorted((root / "landing").glob("*.png")), root / "landing-contact.png")
funnel = sorted((root / "funnel").glob("*.png"))
make_sheet(funnel[:7], root / "funnel-contact-1.png")
make_sheet(funnel[7:], root / "funnel-contact-2.png")


def make_logo_sheet() -> None:
    logo_root = root.parents[1] / "SKYVOICE - LOGO FILES" / "PNG"
    paths = sorted(logo_root.glob("*.png"))
    tile = 520
    label = 46
    sheet = Image.new("RGB", (tile * 2, (tile + label) * 4), "white")
    draw = ImageDraw.Draw(sheet)
    for index, path in enumerate(paths):
        row, column = divmod(index, 2)
        x, y = column * tile, row * (tile + label)
        background = Image.new("RGBA", (tile, tile), "#eef3fb")
        ImageDraw.Draw(background).rectangle((tile // 2, 0, tile, tile), fill="#0e2d5e")
        logo = Image.open(path).convert("RGBA")
        logo.thumbnail((tile, tile), Image.Resampling.LANCZOS)
        background.alpha_composite(logo, ((tile - logo.width) // 2, (tile - logo.height) // 2))
        sheet.paste(background.convert("RGB"), (x, y))
        draw.text((x + 8, y + tile + 10), path.stem, fill="black")
    sheet.save(root / "logo-contact.png", optimize=True)


make_logo_sheet()
