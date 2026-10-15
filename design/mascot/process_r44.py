"""Build and validate the frozen Round 44 Signal Navigator production sheet."""

from __future__ import annotations

import numpy as np
from PIL import Image

import process_r41 as production


production.ROUND = "r44"
production.SOURCE = (
    production.ROOT
    / "design/mascot/rounds/lead-mascot-sheet-r44-imagegen-white.png"
)
production.RAW = production.ROUNDS / "lead-mascot-sheet-r44-raw.png"
production.FINAL = production.ROUNDS / "lead-mascot-sheet-r44.png"
production.MASTER = production.ROUNDS / "lead-mascot-sheet-r44-candidate-master.png"
production.SOURCE_COLUMNS = ((0, 384), (384, 768), (768, 1152), (1152, 1536))


APPROVED = np.array(
    [
        (14, 45, 94),    # navy and contour
        (22, 85, 216),   # cobalt
        (235, 157, 19),  # orange
        (255, 244, 214), # cream
        (255, 255, 255), # labels/open white
        (43, 22, 14),    # restrained facial detail
    ],
    dtype=np.int32,
)


def flatten_approved_planes(image: Image.Image) -> Image.Image:
    """Quantize opaque interiors to the frozen palette while preserving alpha edges."""
    pixels = np.asarray(image.convert("RGBA"), dtype=np.uint8).copy()
    alpha = pixels[..., 3]
    opaque = alpha >= 250
    source = pixels[..., :3][opaque].astype(np.int32)
    distances = ((source[:, None, :] - APPROVED[None, :, :]) ** 2).sum(axis=2)
    pixels[..., :3][opaque] = APPROVED[np.argmin(distances, axis=1)].astype(np.uint8)
    return Image.fromarray(pixels)


production.flatten_semantic_blues = flatten_approved_planes


if __name__ == "__main__":
    production.main()
