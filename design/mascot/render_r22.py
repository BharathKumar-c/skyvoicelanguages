"""Render and validate the Round 22 reusable SVG mascot rig."""

from collections import Counter
from pathlib import Path
import hashlib
import re
import xml.etree.ElementTree as ET

import cairosvg
import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
SVG = ROOT / "apps/web/public/mascot/lead-mascot-sheet.svg"
MASTER = ROOT / "apps/web/public/mascot/lead-mascot-sheet.png"
ARCHIVE = ROOT / "design/mascot/rounds/lead-mascot-sheet-r22.png"
ROUNDS = ROOT / "design/mascot/rounds"

EXPECTED_USES = {
    "logo-head": 8,
    "torso": 8,
    "upper-arm": 16,
    "forearm": 16,
    "mitten-hand": 16,
    "thigh": 16,
    "calf": 16,
    "wedge-foot": 16,
    "module-tiles": 8,
    "label-pill": 8,
    "passage-card": 2,
    "feedback-card": 1,
}


def validate_svg():
    text = SVG.read_text(encoding="utf-8")
    root = ET.fromstring(text)
    local = lambda tag: tag.split("}")[-1]
    symbols = {node.attrib["id"] for node in root.iter() if local(node.tag) == "symbol"}
    references = []
    for node in root.iter():
        if local(node.tag) == "use":
            href = node.attrib.get("{http://www.w3.org/1999/xlink}href") or node.attrib.get("href")
            references.append(href[1:] if href and href.startswith("#") else href)

    missing = sorted({ref for ref in references if ref not in symbols})
    counts = Counter(references)
    mismatches = {key: (counts[key], expected) for key, expected in EXPECTED_USES.items() if counts[key] != expected}
    forbidden_tags = sorted({local(node.tag) for node in root.iter()} & {"linearGradient", "radialGradient", "filter", "image"})
    opacity_tokens = re.findall(r"(?:^|[\s;])(?:opacity|fill-opacity|stroke-opacity)\s*[:=]", text)

    assert root.attrib.get("width") == "1536"
    assert root.attrib.get("height") == "1024"
    assert root.attrib.get("viewBox") == "0 0 1536 1024"
    assert not missing, f"Missing symbol references: {missing}"
    assert not mismatches, f"Use-count mismatches: {mismatches}"
    assert not forbidden_tags, f"Forbidden SVG tags: {forbidden_tags}"
    assert not opacity_tokens, "Opacity declarations are forbidden"
    return symbols, counts


def render():
    cairosvg.svg2png(
        url=str(SVG),
        write_to=str(MASTER),
        output_width=1536,
        output_height=1024,
    )
    image = Image.open(MASTER).convert("RGBA")
    image.save(MASTER, optimize=True)
    image.save(ARCHIVE, optimize=True)
    return image


def composite(foreground: Image.Image, rgb):
    background = Image.new("RGBA", foreground.size, rgb + (255,))
    return Image.alpha_composite(background, foreground).convert("RGB")


def export_qa(master: Image.Image):
    white = composite(master, (255, 255, 255))
    black = composite(master, (0, 0, 0))
    white.save(ROUNDS / "lead-mascot-sheet-r22-white-qa.png", optimize=True)
    black.save(ROUNDS / "lead-mascot-sheet-r22-black-qa.png", optimize=True)

    yy, xx = np.indices((1024, 1536))
    checker_mask = ((xx // 32 + yy // 32) % 2).astype(bool)
    checker = np.empty((1024, 1536, 3), dtype=np.uint8)
    checker[~checker_mask] = (232, 236, 243)
    checker[checker_mask] = (177, 186, 201)
    checker_image = Image.fromarray(checker).convert("RGBA")
    Image.alpha_composite(checker_image, master).convert("RGB").save(
        ROUNDS / "lead-mascot-sheet-r22-checker-qa.png", optimize=True
    )

    silhouette = Image.new("RGBA", master.size, (14, 45, 94, 0))
    silhouette.putalpha(master.getchannel("A"))
    composite(silhouette, (255, 255, 255)).resize((576, 384), Image.Resampling.LANCZOS).save(
        ROUNDS / "lead-mascot-sheet-r22-silhouette-qa.png", optimize=True
    )
    white.resize((320, 213), Image.Resampling.LANCZOS).save(
        ROUNDS / "lead-mascot-sheet-r22-96px-qa.png", optimize=True
    )


def report(master: Image.Image, symbols, counts):
    alpha = np.asarray(master.getchannel("A"))
    histogram = Counter(alpha.ravel())
    nonzero = alpha[alpha > 0]
    sha = hashlib.sha256(MASTER.read_bytes()).hexdigest().upper()
    print(f"svg={SVG}")
    print(f"master={MASTER}")
    print(f"size={master.size} mode={master.mode}")
    print(f"symbols={len(symbols)}")
    print("component_use_counts=" + ", ".join(f"{key}:{counts[key]}" for key in EXPECTED_USES))
    print(f"alpha_unique={len(histogram)} alpha_min_nonzero={int(nonzero.min())} alpha_max={int(nonzero.max())}")
    print(f"alpha_zero={histogram[0]} alpha_255={histogram[255]}")
    print(f"corner_alpha={[master.getpixel(point)[3] for point in ((0,0),(1535,0),(0,1023),(1535,1023))]}")
    print(f"archive_byte_match={MASTER.read_bytes() == ARCHIVE.read_bytes()}")
    print(f"sha256={sha}")


if __name__ == "__main__":
    symbol_ids, use_counts = validate_svg()
    result = render()
    export_qa(result)
    report(result, symbol_ids, use_counts)
