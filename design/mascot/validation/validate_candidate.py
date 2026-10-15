"""Deterministic technical and palette evidence for a Piece 1 candidate."""

from __future__ import annotations

import argparse
import hashlib
import json
import platform
from pathlib import Path

import numpy as np
from PIL import Image, __version__ as pillow_version


ROOT = Path(__file__).resolve().parents[3]
APPROVED = np.array(
    [
        (14, 45, 94),
        (22, 85, 216),
        (235, 157, 19),
        (255, 244, 214),
        (255, 255, 255),
        (43, 22, 14),
    ],
    dtype=np.int16,
)
REQUIRED_SUFFIXES = ("white-qa", "black-qa", "checker-qa", "silhouette-qa", "96px-qa")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest().upper()


def inspect(candidate: Path, round_name: str) -> dict:
    image = Image.open(candidate)
    mode = image.mode
    rgba = image.convert("RGBA")
    arr = np.asarray(rgba)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]

    transparent = alpha == 0
    opaque = alpha >= 250
    transparent_count = int(transparent.sum())
    opaque_count = int(opaque.sum())
    total = int(alpha.size)
    contaminated = transparent & np.any(rgb != 0, axis=2)

    if opaque_count:
        pixels = rgb[opaque].astype(np.int32)
        palette = APPROVED.astype(np.int32)
        distances = np.sqrt(((pixels[:, None, :] - palette[None, :, :]) ** 2).sum(axis=2))
        palette_coverage = float((distances.min(axis=1) <= 18).mean())
        unique_opaque = int(np.unique(pixels, axis=0).shape[0])
    else:
        palette_coverage = 0.0
        unique_opaque = 0

    edge_alpha = np.concatenate((alpha[0], alpha[-1], alpha[:, 0], alpha[:, -1]))
    edge_clear = bool(np.all(edge_alpha == 0))

    stem = candidate.name.removesuffix(".png")
    if stem.endswith(f"-{round_name}"):
        prefix = stem
    else:
        prefix = f"lead-mascot-sheet-{round_name}"
    proof_dir = candidate.parent
    proofs = {
        suffix: str(proof_dir / f"{prefix}-{suffix}.png")
        for suffix in REQUIRED_SUFFIXES
    }
    proof_exists = {key: Path(value).exists() for key, value in proofs.items()}

    checks = {
        "canvas_1536x1024": rgba.size == (1536, 1024),
        "source_mode_rgba": mode == "RGBA",
        "transparent_area_at_least_25_percent": transparent_count / total >= 0.25,
        "transparent_rgb_contamination_at_most_0_1_percent": (
            int(contaminated.sum()) / max(transparent_count, 1) <= 0.001
        ),
        "outer_edge_clear": edge_clear,
        "all_required_proofs_exist": all(proof_exists.values()),
    }

    return {
        "candidate": str(candidate),
        "round": round_name,
        "sha256": sha256(candidate),
        "tool_versions": {
            "python": platform.python_version(),
            "pillow": pillow_version,
            "numpy": np.__version__,
        },
        "image": {
            "mode": mode,
            "size": list(rgba.size),
            "transparent_fraction": round(transparent_count / total, 6),
            "transparent_rgb_contamination_fraction": round(
                int(contaminated.sum()) / max(transparent_count, 1), 8
            ),
            "opaque_palette_coverage_within_rgb_distance_18": round(palette_coverage, 6),
            "unique_fully_opaque_rgb_colors": unique_opaque,
            "outer_edge_clear": edge_clear,
        },
        "proofs": proof_exists,
        "checks": checks,
        "technical_gate": "PASS" if all(checks.values()) else "FAIL",
        "system_palette_evidence": "PASS" if palette_coverage >= 0.90 else "FAIL",
        "notes": [
            "Palette evidence supports the System critic but cannot prove visual flatness or outline consistency.",
            "This tool does not issue Brief, System, or Craft verdicts.",
        ],
    }


def markdown(result: dict) -> str:
    lines = [
        f"# {result['round'].upper()} Deterministic Validation Evidence",
        "",
        f"- Candidate: `{result['candidate']}`",
        f"- SHA-256: `{result['sha256']}`",
        f"- Technical gate: **{result['technical_gate']}**",
        f"- System palette evidence: **{result['system_palette_evidence']}**",
        "",
        "## Checks",
        "",
        "| Check | Result |",
        "|---|---|",
    ]
    lines.extend(
        f"| {name.replace('_', ' ')} | {'PASS' if value else 'FAIL'} |"
        for name, value in result["checks"].items()
    )
    lines.extend(["", "## Metrics", "", "```json", json.dumps(result["image"], indent=2), "```", ""])
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--candidate", required=True, type=Path)
    parser.add_argument("--round", required=True)
    parser.add_argument("--output-dir", type=Path, default=ROOT / "design/mascot/validation/results")
    args = parser.parse_args()

    candidate = args.candidate.resolve()
    result = inspect(candidate, args.round)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    json_path = args.output_dir / f"{args.round}-evidence.json"
    md_path = args.output_dir / f"{args.round}-evidence.md"
    json_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    md_path.write_text(markdown(result), encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
