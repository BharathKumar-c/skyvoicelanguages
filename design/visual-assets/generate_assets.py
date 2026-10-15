"""Generate the Sky Voice vector asset pack in apps/web/public/assets/generated/.

Every asset is hand-authored vector geometry derived from the Sky Voice brand
language (broken orbit, four-point spark, speech/signal waveform) and the
locked palette in SKYVOICE_DESIGN_SYSTEM.md. No AI image generation is used.

Run from the repository root:
    python design/visual-assets/generate_assets.py
"""

from __future__ import annotations

import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "apps" / "web" / "public" / "assets" / "generated"
BRAND_SRC = ROOT / "apps" / "web" / "public" / "brand"

NAVY = "#0E2D5E"
NAVY_DEEP = "#071D3F"
BLUE = "#1655D8"
BLUE_DARK = "#0F3EA8"
BLUE_LIGHT = "#EDF3FF"
ORANGE = "#EB9D13"
ORANGE_LIGHT = "#FFF6E5"
CREAM = "#FFF4D6"
WHITE = "#FFFFFF"
BORDER = "#D7E1EF"

REDUCED_MOTION_CSS = (
    "@media (prefers-reduced-motion: reduce){*{animation:none!important;"
    "transition:none!important}}"
)


# --------------------------------------------------------------------------- #
#  Geometry helpers                                                           #
# --------------------------------------------------------------------------- #


def f(n: float) -> str:
    """Compact number formatting."""
    s = f"{n:.1f}"
    return s[:-2] if s.endswith(".0") else s


def polar(cx: float, cy: float, r: float, deg: float) -> tuple[float, float]:
    rad = math.radians(deg)
    return cx + r * math.cos(rad), cy + r * math.sin(rad)


def arc(cx: float, cy: float, r: float, a0: float, a1: float) -> str:
    """Clockwise arc from a0 to a1 (degrees, 0 = 3 o'clock, y-down)."""
    x0, y0 = polar(cx, cy, r, a0)
    x1, y1 = polar(cx, cy, r, a1)
    large = 1 if (a1 - a0) % 360 > 180 else 0
    return f"M{f(x0)} {f(y0)}A{f(r)} {f(r)} 0 {large} 1 {f(x1)} {f(y1)}"


def spark_path(cx: float, cy: float, s: float) -> str:
    """Sky Voice four-point spark (matches the logo/Aira spark silhouette)."""
    k = 0.16 * s
    return (
        f"M{f(cx)} {f(cy - s)}"
        f"C{f(cx + k)} {f(cy - k * 2)} {f(cx + k * 2)} {f(cy - k)} {f(cx + s)} {f(cy)}"
        f"C{f(cx + k * 2)} {f(cy + k)} {f(cx + k)} {f(cy + k * 2)} {f(cx)} {f(cy + s)}"
        f"C{f(cx - k)} {f(cy + k * 2)} {f(cx - k * 2)} {f(cy + k)} {f(cx - s)} {f(cy)}"
        f"C{f(cx - k * 2)} {f(cy - k)} {f(cx - k)} {f(cy - k * 2)} {f(cx)} {f(cy - s)}Z"
    )


def spark(cx, cy, s, fill=ORANGE, extra="") -> str:
    return f'<path d="{spark_path(cx, cy, s)}" fill="{fill}"{extra}/>'


def orbit(cx, cy, r, segments, width, extra="") -> str:
    """Broken orbit: list of (a0, a1, color[, opacity])."""
    parts = []
    for seg in segments:
        a0, a1, color, *rest = seg
        op = f' stroke-opacity="{rest[0]}"' if rest else ""
        parts.append(
            f'<path d="{arc(cx, cy, r, a0, a1)}" stroke="{color}"{op} '
            f'stroke-width="{f(width)}" stroke-linecap="round" fill="none"/>'
        )
    return f"<g{extra}>" + "".join(parts) + "</g>"


def sine(x0, x1, y, amp, period, phase=0.0, step=8) -> str:
    pts = []
    x = x0
    while x <= x1 + 0.01:
        pts.append((x, y + amp * math.sin((x - x0) / period * 2 * math.pi + phase)))
        x += step
    d = f"M{f(pts[0][0])} {f(pts[0][1])}"
    d += "".join(f"L{f(px)} {f(py)}" for px, py in pts[1:])
    return d


def signal_pulse(x0, x1, y, peak, valley, centre, width=60) -> str:
    """Flat line with the Sky Voice speech-wave pulse (tall peak, deep valley)."""
    a = centre - width * 0.5
    return (
        f"M{f(x0)} {f(y)}L{f(a)} {f(y)}L{f(a + width * 0.25)} {f(y - peak)}"
        f"L{f(a + width * 0.62)} {f(y + valley)}L{f(a + width)} {f(y)}L{f(x1)} {f(y)}"
    )


def svg(w, h, body, *, aspect="xMidYMid meet", style="", title=None) -> str:
    style_block = f"<style>{style}</style>" if style else ""
    a11y = (
        f' role="img" aria-labelledby="t"><title id="t">{title}</title>'
        if title
        else ' aria-hidden="true">'
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" preserveAspectRatio="{aspect}" fill="none"'
        f"{a11y}{style_block}{body}</svg>\n"
    )


def write(rel: str, content: str) -> None:
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"{rel:58s} {len(content.encode()):>7,d} B")


def dots(x0, y0, cols, rows, gap, r, color, opacity) -> str:
    return (
        f'<g fill="{color}" fill-opacity="{opacity}">'
        + "".join(
            f'<circle cx="{f(x0 + c * gap)}" cy="{f(y0 + rr * gap)}" r="{r}"/>'
            for rr in range(rows)
            for c in range(cols)
        )
        + "</g>"
    )


# --------------------------------------------------------------------------- #
#  1. Backgrounds                                                             #
# --------------------------------------------------------------------------- #


def hero_signal_field() -> str:
    """Light hero backdrop. Left 45% kept quiet so the H1 stays clean."""
    body = []
    body.append(
        '<defs><radialGradient id="g1" cx="0.5" cy="0.5" r="0.5">'
        f'<stop offset="0" stop-color="{BLUE}" stop-opacity=".10"/>'
        f'<stop offset="1" stop-color="{BLUE}" stop-opacity="0"/></radialGradient>'
        '<radialGradient id="g2" cx="0.5" cy="0.5" r="0.5">'
        f'<stop offset="0" stop-color="{ORANGE}" stop-opacity=".14"/>'
        f'<stop offset="1" stop-color="{ORANGE}" stop-opacity="0"/></radialGradient></defs>'
    )
    body.append('<circle cx="80" cy="40" r="300" fill="url(#g1)"/>')
    body.append('<circle cx="1010" cy="300" r="230" fill="url(#g2)"/>')
    body.append('<circle cx="1180" cy="120" r="320" fill="url(#g1)"/>')
    # Large broken orbit framing the mascot/form side.
    body.append(
        orbit(
            1040, 360, 330,
            [(200, 292, BLUE, 0.10), (300, 338, ORANGE, 0.22), (346, 430, NAVY, 0.07),
             (440, 520, BLUE, 0.08)],
            14,
        )
    )
    body.append(
        orbit(1040, 360, 410, [(214, 262, BLUE, 0.07), (272, 300, ORANGE, 0.16),
                               (12, 64, BLUE, 0.06)], 6)
    )
    body.append(dots(1150, 70, 11, 9, 20, 1.6, BLUE, 0.22))
    body.append(dots(40, 560, 6, 5, 20, 1.6, BLUE, 0.14))
    # (No waveform here: the lower edge sits behind .trust-strip copy.)
    for cx, cy, s, op in [(1330, 520, 14, 0.55), (690, 96, 9, 0.35), (1240, 300, 7, 0.4),
                          (560, 640, 8, 0.3)]:
        body.append(spark(cx, cy, s, ORANGE, f' fill-opacity="{op}"'))
    return svg(1440, 760, "".join(body), aspect="xMidYMid slice")


def modules_orbit_field() -> str:
    """Dark navy-deep modules section backdrop."""
    body = [
        '<defs><radialGradient id="glow" cx=".5" cy=".5" r=".5">'
        f'<stop offset="0" stop-color="{BLUE}" stop-opacity=".55"/>'
        f'<stop offset="1" stop-color="{BLUE}" stop-opacity="0"/></radialGradient>'
        '<radialGradient id="warm" cx=".5" cy=".5" r=".5">'
        f'<stop offset="0" stop-color="{ORANGE}" stop-opacity=".16"/>'
        f'<stop offset="1" stop-color="{ORANGE}" stop-opacity="0"/></radialGradient></defs>',
        '<circle cx="0" cy="0" r="420" fill="url(#glow)"/>',
        '<circle cx="1440" cy="900" r="460" fill="url(#glow)" opacity=".6"/>',
        '<circle cx="1180" cy="260" r="200" fill="url(#warm)"/>',
        '<defs><pattern id="dp" width="24" height="24" patternUnits="userSpaceOnUse">'
        f'<circle cx="12" cy="12" r="1.2" fill="{WHITE}" fill-opacity=".05"/></pattern></defs>',
        '<rect width="1440" height="1400" fill="url(#dp)"/>',
        orbit(260, 470, 300, [(160, 250, BLUE, 0.35), (258, 296, ORANGE, 0.45),
                              (304, 400, BLUE, 0.22), (410, 500, WHITE, 0.06)], 10),
        orbit(1240, 1040, 380, [(180, 268, BLUE, 0.28), (276, 312, ORANGE, 0.35),
                                (320, 350, WHITE, 0.08)], 10),
        orbit(1240, 1040, 470, [(200, 250, WHITE, 0.07), (258, 286, BLUE, 0.22)], 4),
    ]
    for cx, cy, s, op in [(1150, 170, 16, 0.85), (210, 1180, 12, 0.6), (1360, 640, 9, 0.6),
                          (90, 760, 8, 0.5)]:
        body.append(spark(cx, cy, s, ORANGE, f' fill-opacity="{op}"'))
    return svg(1440, 1400, "".join(body), aspect="xMidYMin slice")


def section_wave_edge() -> str:
    """Single-colour mask shape for organic section transitions (top edge)."""
    w, h = 1440, 80
    d = (
        f"M0 {h}V46C120 22 260 8 420 18C560 27 640 58 790 60C960 62 1060 20 1210 12"
        f"C1320 6 1390 16 1440 26V{h}Z"
    )
    return svg(w, h, f'<path d="{d}" fill="#000"/>', aspect="none")


def final_cta_signal_waves() -> str:
    """White line-work over the navy→blue final CTA gradient."""
    body = []
    for i, (amp, op, ph) in enumerate([(26, 0.10, 0), (18, 0.08, 1.2), (34, 0.06, 2.4)]):
        body.append(
            f'<path d="{sine(-20, 1460, 560 + i * 26, amp, 520 + i * 60, ph)}" stroke="{WHITE}" '
            f'stroke-opacity="{op}" stroke-width="2" stroke-linecap="round"/>'
        )
    body.append(
        f'<path d="{signal_pulse(-20, 1460, 120, 60, 46, 1180, 130)}" stroke="{WHITE}" '
        'stroke-opacity=".12" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'
    )
    body.append(orbit(1220, 140, 120, [(150, 250, WHITE, 0.12), (258, 300, ORANGE, 0.55),
                                        (308, 420, WHITE, 0.08)], 8))
    body.append(spark(1330, 52, 18, ORANGE, ' fill-opacity=".9"'))
    body.append(spark(150, 640, 10, ORANGE, ' fill-opacity=".5"'))
    body.append(spark(760, 70, 7, WHITE, ' fill-opacity=".35"'))
    return svg(1440, 720, "".join(body), aspect="xMidYMid slice")


# --------------------------------------------------------------------------- #
#  2. Illustrations                                                           #
# --------------------------------------------------------------------------- #

OUTLINE = f'stroke="{NAVY}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"'


def proof_evidence_chain() -> str:
    """Marked essay → correction route → rising band bars. No embedded text."""
    b = []
    # Soft ground disc.
    b.append(f'<circle cx="250" cy="236" r="200" fill="{BLUE_LIGHT}"/>')
    b.append(orbit(250, 236, 222, [(200, 300, BLUE, 0.35), (308, 336, ORANGE, 0.9),
                                   (346, 470, BORDER, 1), (480, 545, BLUE, 0.2)], 6))
    # Essay sheet (tilted).
    b.append('<g transform="rotate(-6 150 210)">')
    b.append(f'<rect x="62" y="96" width="176" height="226" rx="18" fill="{WHITE}" {OUTLINE}/>')
    for i, wdt in enumerate([120, 136, 98, 128, 110, 132, 84]):
        y = 134 + i * 24
        col = ORANGE if i == 3 else BORDER
        sw = 8 if i == 3 else 7
        b.append(f'<path d="M86 {y}H{86 + wdt}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"/>')
    # Tutor annotation: orange underline loop + blue check.
    b.append(f'<path d="M84 222C120 236 180 236 222 220" stroke="{ORANGE}" stroke-width="4" stroke-linecap="round"/>')
    b.append(f'<circle cx="214" cy="290" r="20" fill="{BLUE}" stroke="{NAVY}" stroke-width="4"/>')
    b.append(f'<path d="M204 290l7 7 13-14" stroke="{WHITE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>')
    b.append("</g>")
    # Correction route (dashed) from sheet to chart.
    b.append(
        f'<path d="M226 330C276 382 330 372 352 318" stroke="{NAVY}" stroke-width="4" '
        'stroke-dasharray="2 12" stroke-linecap="round"/>'
    )
    b.append(f'<circle cx="290" cy="364" r="13" fill="{ORANGE}" stroke="{NAVY}" stroke-width="4"/>')
    # Band chart card.
    b.append(f'<rect x="300" y="132" width="152" height="176" rx="20" fill="{WHITE}" {OUTLINE}/>')
    b.append(f'<path d="M322 280H430" stroke="{BORDER}" stroke-width="4" stroke-linecap="round"/>')
    for i, (hgt, col) in enumerate([(52, BORDER), (82, "#B7CEF9"), (118, BLUE)]):
        x = 330 + i * 34
        b.append(f'<rect x="{x}" y="{272 - hgt}" width="22" height="{hgt}" rx="8" fill="{col}" stroke="{NAVY}" stroke-width="4"/>')
    b.append(spark(432, 138, 20, ORANGE, f' stroke="{NAVY}" stroke-width="3.5" stroke-linejoin="round"'))
    b.append(spark(78, 70, 11, ORANGE))
    b.append(spark(470, 360, 8, BLUE, ' fill-opacity=".5"'))
    return svg(500, 460, "".join(b))


def route_lost_404() -> str:
    b = []
    b.append(f'<ellipse cx="280" cy="318" rx="250" ry="22" fill="{BLUE_LIGHT}"/>')
    # Route: solid left part with milestones, a break, faint continuation.
    b.append(f'<path d="M40 280C90 230 140 300 196 252" stroke="{BLUE}" stroke-width="8" stroke-linecap="round"/>')
    b.append(f'<path d="M196 252C214 236 228 230 238 228" stroke="{BLUE}" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 16"/>')
    b.append(f'<path d="M330 214C380 206 420 270 520 218" stroke="{BORDER}" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 16"/>')
    for x, y in [(40, 280), (124, 270)]:
        b.append(f'<circle cx="{x}" cy="{y}" r="12" fill="{WHITE}" stroke="{NAVY}" stroke-width="5"/>')
    # Target on the far side.
    b.append(f'<circle cx="520" cy="218" r="26" fill="{WHITE}" stroke="{BORDER}" stroke-width="6"/>')
    b.append(f'<circle cx="520" cy="218" r="10" fill="{BORDER}"/>')
    # Signal beacon in the gap: broken orbit + spark searching.
    b.append(f'<circle cx="284" cy="150" r="54" fill="{WHITE}" {OUTLINE}/>')
    b.append(orbit(284, 150, 74, [(200, 290, BLUE), (298, 334, ORANGE), (344, 400, NAVY)], 10))
    b.append(f'<path d="M284 204V250" stroke="{NAVY}" stroke-width="6" stroke-linecap="round"/>')
    b.append(f'<circle cx="284" cy="262" r="8" fill="{NAVY}"/>')
    b.append(f'<path d="{signal_pulse(250, 318, 152, 22, 16, 284, 40)}" stroke="{BLUE}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>')
    b.append(spark(356, 80, 16, ORANGE))
    b.append(spark(200, 96, 8, ORANGE, ' fill-opacity=".5"'))
    return svg(560, 360, "".join(b))


def signal_interrupted_error() -> str:
    b = []
    b.append(f'<circle cx="160" cy="110" r="96" fill="{ORANGE_LIGHT}"/>')
    b.append(orbit(160, 110, 96, [(200, 300, BLUE, 0.45), (310, 340, ORANGE), (352, 520, BORDER)], 6))
    b.append(f'<path d="M48 112H104L118 78L136 140L146 112" stroke="{NAVY}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>')
    b.append(f'<path d="M176 112L190 92L206 128L218 112H272" stroke="{NAVY}" stroke-opacity=".28" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="1 14"/>')
    b.append(spark(161, 112, 15, ORANGE, f' stroke="{NAVY}" stroke-width="3" stroke-linejoin="round"'))
    return svg(320, 220, "".join(b))


# --------------------------------------------------------------------------- #
#  3. Motion graphics (animated SVG + static twin)                            #
# --------------------------------------------------------------------------- #


def hero_aira_orbit_stage(animated: bool) -> str:
    """Backdrop that sits behind <AiraContext context="hero-speaking"> (480×560)."""
    cx, cy = 240, 250
    style = ""
    if animated:
        style = (
            ".spin-a{transform-origin:240px 250px;animation:spinA 60s linear infinite}"
            ".spin-b{transform-origin:240px 250px;animation:spinB 90s linear infinite}"
            ".tw{transform-box:fill-box;transform-origin:center;animation:tw 4.8s ease-in-out infinite}"
            ".tw2{animation-delay:1.6s}.tw3{animation-delay:3.2s}"
            ".halo{transform-origin:240px 250px;animation:halo 6s ease-in-out infinite}"
            "@keyframes spinA{to{transform:rotate(360deg)}}"
            "@keyframes spinB{to{transform:rotate(-360deg)}}"
            "@keyframes tw{0%,100%{opacity:.35;transform:scale(.7)}45%{opacity:1;transform:scale(1)}}"
            "@keyframes halo{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.04);opacity:.85}}"
            + REDUCED_MOTION_CSS
        )
    b = [
        '<defs><radialGradient id="h" cx=".5" cy=".5" r=".5">'
        f'<stop offset="0" stop-color="{BLUE}" stop-opacity=".16"/>'
        f'<stop offset=".7" stop-color="{BLUE}" stop-opacity=".05"/>'
        f'<stop offset="1" stop-color="{BLUE}" stop-opacity="0"/></radialGradient></defs>',
        f'<circle class="halo" cx="{cx}" cy="{cy}" r="230" fill="url(#h)"/>',
        f'<circle cx="{cx}" cy="{cy}" r="150" fill="{WHITE}" fill-opacity=".55"/>',
        orbit(cx, cy, 176, [(196, 286, BLUE, 0.35), (294, 330, ORANGE, 0.85),
                            (340, 420, NAVY, 0.18), (430, 520, BLUE, 0.2)], 10,
              ' class="spin-a"'),
        orbit(cx, cy, 214, [(150, 200, BLUE, 0.18), (210, 230, ORANGE, 0.5),
                            (20, 96, BLUE, 0.14)], 4, ' class="spin-b"'),
        # Floor shadow is a separate asset (mascots/aira-ground-shadow.svg) so it can
        # breathe in phase with Aira's float.
    ]
    for cls, (x, y, s) in zip(["tw", "tw tw2", "tw tw3"], [(420, 120, 14), (58, 210, 10), (404, 400, 9)]):
        b.append(spark(x, y, s, ORANGE, f' class="{cls}"' if animated else ""))
    return svg(480, 560, "".join(b), style=style)


def celebration_spark_burst(animated: bool) -> str:
    """One-shot brand-colour burst behind Aira on /thank-you (600×600)."""
    cx, cy = 300, 300
    style = ""
    if animated:
        style = (
            ".p{transform-box:fill-box;transform-origin:center;opacity:0;"
            "animation:pop .9s cubic-bezier(.22,1,.36,1) forwards}"
            ".ring{transform-origin:300px 300px;opacity:0;animation:ring 1.1s cubic-bezier(.22,1,.36,1) .05s forwards}"
            ".idle{transform-box:fill-box;transform-origin:center;opacity:0;animation:pop .9s cubic-bezier(.22,1,.36,1) forwards,"
            "tw 4s ease-in-out 1.4s infinite}"
            "@keyframes pop{0%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.2)}"
            "60%{opacity:1}100%{opacity:1;transform:translate(0,0) scale(1)}}"
            "@keyframes ring{0%{opacity:0;transform:scale(.55)}100%{opacity:1;transform:scale(1)}}"
            "@keyframes tw{0%,100%{opacity:1}50%{opacity:.45}}"
            "@media (prefers-reduced-motion: reduce){.p,.ring,.idle{animation:none!important;opacity:1!important}}"
        )
    b = [
        '<defs><radialGradient id="c" cx=".5" cy=".5" r=".5">'
        f'<stop offset="0" stop-color="{ORANGE}" stop-opacity=".18"/>'
        f'<stop offset=".55" stop-color="{BLUE}" stop-opacity=".07"/>'
        f'<stop offset="1" stop-color="{BLUE}" stop-opacity="0"/></radialGradient></defs>',
        f'<circle cx="{cx}" cy="{cy}" r="290" fill="url(#c)"/>',
        orbit(cx, cy, 236, [(200, 280, BLUE, 0.35), (288, 330, ORANGE, 0.9),
                            (340, 400, NAVY, 0.15), (60, 120, BLUE, 0.2)], 8,
              ' class="ring"' if animated else ""),
    ]
    pieces = [
        # (angle, radius, kind, size, colour)
        (-140, 250, "spark", 18, ORANGE), (-100, 270, "dot", 7, BLUE), (-60, 262, "spark", 13, ORANGE),
        (-20, 270, "bar", 22, BLUE), (15, 262, "dot", 6, ORANGE), (50, 268, "spark", 11, BLUE),
        (95, 266, "bar", 18, ORANGE), (135, 262, "dot", 8, NAVY), (170, 268, "spark", 15, ORANGE),
        (205, 262, "bar", 20, BLUE), (-165, 210, "dot", 5, ORANGE), (-35, 205, "dot", 5, BLUE),
    ]
    for i, (ang, r, kind, s, col) in enumerate(pieces):
        x, y = polar(cx, cy, r, ang)
        dx, dy = (cx - x) * 0.75, (cy - y) * 0.75
        delay = 0.08 + (i % 6) * 0.05
        cls = ("idle" if kind == "spark" else "p") if animated else ""
        attr = (
            f' class="{cls}" style="--dx:{f(dx)}px;--dy:{f(dy)}px;animation-delay:{delay:.2f}s'
            + (f",{1.4 + i * 0.3:.1f}s" if animated and kind == "spark" else "")
            + '"'
            if animated
            else ""
        )
        if kind == "spark":
            b.append(f'<path d="{spark_path(x, y, s)}" fill="{col}"{attr}/>')
        elif kind == "dot":
            b.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{s}" fill="{col}"{attr}/>')
        else:
            x2, y2 = polar(cx, cy, r + s, ang)
            b.append(
                f'<path d="M{f(x)} {f(y)}L{f(x2)} {f(y2)}" stroke="{col}" stroke-width="7" '
                f'stroke-linecap="round"{attr}/>'
            )
    return svg(600, 600, "".join(b), style=style)


def vsl_signal_backdrop(animated: bool) -> str:
    """Signal rings radiating from the score badge inside .vsl-card (900×240, right-anchored)."""
    cx, cy = 790, 120
    style = ""
    if animated:
        style = (
            ".r{transform-origin:790px 120px;animation:emit 4.5s cubic-bezier(.22,1,.36,1) infinite;opacity:0}"
            ".r2{animation-delay:1.5s}.r3{animation-delay:3s}"
            "@keyframes emit{0%{opacity:0;transform:scale(.55)}20%{opacity:1}100%{opacity:0;transform:scale(1.25)}}"
            "@media (prefers-reduced-motion: reduce){.r{animation:none!important;opacity:1!important}}"
        )
    b = []
    for i, r in enumerate([110, 160, 210]):
        segs = [(200, 300, WHITE, 0.22), (308, 338, ORANGE, 0.7), (348, 470, WHITE, 0.12)]
        cls = f' class="r r{i + 1}"' if animated else ""
        b.append(orbit(cx, cy, r, segs, 3 if i else 4, cls))
    b.append(f'<path d="{signal_pulse(0, 640, 196, 26, 20, 470, 70)}" stroke="{WHITE}" stroke-opacity=".10" '
             'stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>')
    b.append(spark(880, 34, 10, ORANGE, ' fill-opacity=".8"'))
    return svg(900, 240, "".join(b), aspect="xMaxYMid slice", style=style)


# --------------------------------------------------------------------------- #
#  4. Mascot support                                                          #
# --------------------------------------------------------------------------- #


def aira_ground_shadow() -> str:
    return svg(
        240, 48,
        '<defs><filter id="b" x="-20%" y="-80%" width="140%" height="260%">'
        '<feGaussianBlur stdDeviation="5"/></filter></defs>'
        f'<ellipse cx="120" cy="24" rx="96" ry="10" fill="{NAVY}" fill-opacity=".16" filter="url(#b)"/>',
    )


def aira_spark() -> str:
    return svg(
        64, 64,
        '<defs><radialGradient id="g" cx=".5" cy=".5" r=".5">'
        f'<stop offset="0" stop-color="{ORANGE}" stop-opacity=".45"/>'
        f'<stop offset="1" stop-color="{ORANGE}" stop-opacity="0"/></radialGradient></defs>'
        '<circle cx="32" cy="32" r="32" fill="url(#g)"/>'
        + spark(32, 32, 17, ORANGE),
    )


# Measured from apps/web/public/mascot/canonical/aira-*.png (384×456 art box)
# by connected-component detection of the orange spark; verified visually.
SPARK_ANCHORS = {
    "front": {"x_pct": 68.17, "y_pct": 6.46, "size_pct": 10.68},
    "three-quarter": {"x_pct": 66.09, "y_pct": 6.53, "size_pct": 10.68},
    "listening": {"x_pct": 75.2, "y_pct": 7.65, "size_pct": 10.16},
    "speaking": {"x_pct": 60.5, "y_pct": 6.28, "size_pct": 10.16},
    "reading": {"x_pct": 67.88, "y_pct": 6.75, "size_pct": 9.38},
    "writing": {"x_pct": 64.12, "y_pct": 6.73, "size_pct": 8.59},
    "feedback": {"x_pct": 51.76, "y_pct": 6.93, "size_pct": 9.38},
    "celebration": {"x_pct": 69.5, "y_pct": 6.67, "size_pct": 10.68},
}


# --------------------------------------------------------------------------- #
#  5. Brand derivatives (transparent, tightly cropped)                        #
# --------------------------------------------------------------------------- #


def brand_derivative(src_name: str) -> str:
    text = (BRAND_SRC / src_name).read_text(encoding="utf-8")
    text = re.sub(r"<\?xml[^>]*\?>\s*", "", text)
    # Remove the full-artboard navy background rectangle (white variant only).
    text = re.sub(r'<rect class="cls-\d+" width="1080" height="1080"\s*/>\s*', "", text)
    # Crop to the same box BrandLogo uses: viewBox="135 430 810 220".
    text = text.replace('viewBox="0 0 1080 1080"', 'viewBox="135 430 810 220" width="810" height="220"')
    text = text.replace('id="Layer_1" data-name="Layer 1" ', 'role="img" aria-label="Sky Voice Languages" ')
    return text


def main() -> None:
    write("backgrounds/hero-signal-field.svg", hero_signal_field())
    write("backgrounds/modules-orbit-field.svg", modules_orbit_field())
    write("backgrounds/section-wave-edge.svg", section_wave_edge())
    write("backgrounds/final-cta-signal-waves.svg", final_cta_signal_waves())

    write("illustrations/proof-evidence-chain.svg", proof_evidence_chain())
    write("illustrations/route-lost-404.svg", route_lost_404())
    write("illustrations/signal-interrupted-error.svg", signal_interrupted_error())

    write("motion-graphics/hero-aira-orbit-stage.svg", hero_aira_orbit_stage(True))
    write("motion-graphics/hero-aira-orbit-stage-static.svg", hero_aira_orbit_stage(False))
    write("motion-graphics/celebration-spark-burst.svg", celebration_spark_burst(True))
    write("motion-graphics/celebration-spark-burst-static.svg", celebration_spark_burst(False))
    write("motion-graphics/vsl-signal-backdrop.svg", vsl_signal_backdrop(True))
    write("motion-graphics/vsl-signal-backdrop-static.svg", vsl_signal_backdrop(False))

    write("mascots/aira-ground-shadow.svg", aira_ground_shadow())
    write("mascots/aira-spark.svg", aira_spark())
    write(
        "mascots/aira-spark-anchors.json",
        json.dumps(
            {
                "$comment": "Spark centre per canonical pose as % of the 384x456 art box "
                "(apps/web/public/mascot/canonical/aira-<pose>.png). size_pct = spark width / 384.",
                "anchors": SPARK_ANCHORS,
            },
            indent=2,
        )
        + "\n",
    )

    write("brand/skyvoice-horizontal-cropped.svg", brand_derivative("skyvoice-horizontal.svg"))
    write("brand/skyvoice-horizontal-white-transparent.svg",
          brand_derivative("skyvoice-horizontal-white.svg"))


if __name__ == "__main__":
    main()
