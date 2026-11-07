"""Qirat mascot v2: soft-3D renders of three concepts (drop, bar, fennec).

Usage: python mascot2.py <out_dir> [size_px]
"""
import os
import sys

import resvg_py
from PIL import Image, ImageDraw

OUT = sys.argv[1]
SIZE = int(sys.argv[2]) if len(sys.argv) > 2 else 800
os.makedirs(OUT, exist_ok=True)

# warm "gold candy" palette: no brown, shade toward amber/orange
GOLD = {"hi": "#FFF2B8", "light": "#FFE07A", "base": "#FFC93C", "shade": "#F5A524",
        "deep": "#E07B0C", "ao": "#B85A06", "bounce": "#FFE9A6"}
INKC = "#2A1A0C"
BLUSH = "#FF8F7A"

COMMON_DEFS = """
<filter id="b2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="b7" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="b12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
"""


def radial(gid, cx, cy, r, stops):
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<radialGradient id="{gid}" cx="{cx}" cy="{cy}" r="{r}">{s}</radialGradient>'


def linear(gid, x1, y1, x2, y2, stops):
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{gid}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">{s}</linearGradient>'


def soft_shape(d, gid, cid, ao=GOLD["ao"], bounce=GOLD["bounce"], bounce_xy=(120, 214), bounce_r=(70, 22),
               spec=(92, 66, 26, 16, -30), edge=GOLD["deep"]):
    """A soft-plastic 3D shape: gradient fill, inner occlusion toward the
    bottom-right, warm bounce light from the ground, one big soft specular."""
    bx, by = bounce_xy
    sx, sy, srx, sry, srot = spec
    return (
        f'<clipPath id="{cid}"><path d="{d}"/></clipPath>'
        f'<path d="{d}" fill="url(#{gid})"/>'
        f'<g clip-path="url(#{cid})">'
        f'<path d="{d}" fill="none" stroke="{ao}" stroke-width="26" opacity="0.38" filter="url(#b12)" transform="translate(7 9)"/>'
        f'<ellipse cx="{bx}" cy="{by}" rx="{bounce_r[0]}" ry="{bounce_r[1]}" fill="{bounce}" opacity="0.55" filter="url(#b7)"/>'
        f'<ellipse cx="{sx}" cy="{sy}" rx="{srx}" ry="{sry}" fill="#FFFFFF" opacity="0.6" filter="url(#b4)" transform="rotate({srot} {sx} {sy})"/>'
        f'</g>'
        f'<path d="{d}" fill="none" stroke="{edge}" stroke-opacity="0.28" stroke-width="1.6"/>'
    )


def sparkle(x, y, s, fill="#FFFFFF", op=1.0):
    return (f'<path d="M{x} {y - s} C{x + s * .12} {y - s * .12} {x + s * .12} {y - s * .12} {x + s} {y} '
            f'C{x + s * .12} {y + s * .12} {x + s * .12} {y + s * .12} {x} {y + s} '
            f'C{x - s * .12} {y + s * .12} {x - s * .12} {y + s * .12} {x - s} {y} '
            f'C{x - s * .12} {y - s * .12} {x - s * .12} {y - s * .12} {x} {y - s} Z" fill="{fill}" opacity="{op}"/>')


def ground(cx=120, cy=222, rx=58):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="7" fill="#7A4A0A" opacity="0.22" filter="url(#b4)"/>'


# ── faces ──────────────────────────────────────────────────────────────────

def glossy_eye(x, y, rx=10.5, ry=13, look=(0, 0)):
    lx, ly = look
    return (f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{INKC}"/>'
            f'<ellipse cx="{x + lx - rx * .32}" cy="{y + ly - ry * .38}" rx="{rx * .42}" ry="{ry * .36}" fill="#FFFFFF"/>'
            f'<circle cx="{x + lx + rx * .38}" cy="{y + ly + ry * .38}" r="{rx * .17}" fill="#FFFFFF" opacity="0.9"/>')


def happy_eye(x, y, w=11):
    return (f'<path d="M{x - w} {y + 3} Q{x} {y - w * 1.15} {x + w} {y + 3}" stroke="{INKC}" stroke-width="4.6" '
            f'stroke-linecap="round" fill="none"/>')


def blush(x, y, rx=11, ry=6.5, op=0.5):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{BLUSH}" opacity="{op}" filter="url(#b2)"/>'


def face(mood, lx, rx, ey, mx, my, eye=(10.5, 13), blush_dx=16, blush_dy=19):
    erx, ery = eye
    out = []
    if mood == "happy":
        out += [glossy_eye(lx, ey, erx, ery), glossy_eye(rx, ey, erx, ery),
                f'<path d="M{mx - 8} {my - 1} Q{mx} {my + 8} {mx + 8} {my - 1}" stroke="{INKC}" stroke-width="3.6" '
                f'stroke-linecap="round" fill="none"/>']
    elif mood == "excited":
        out += [happy_eye(lx, ey, erx * 1.05), happy_eye(rx, ey, erx * 1.05),
                f'<path d="M{mx - 10} {my - 3} Q{mx} {my + 15} {mx + 10} {my - 3} Z" fill="{INKC}"/>',
                f'<path d="M{mx - 5.5} {my + 5.5} Q{mx} {my + 10} {mx + 5.5} {my + 5.5} Q{mx} {my + 2.5} {mx - 5.5} {my + 5.5} Z" fill="#FF7A6B"/>']
    elif mood == "worried":
        out += [glossy_eye(lx, ey + 1, erx * .95, ery * 1.04, (0, 1.5)), glossy_eye(rx, ey + 1, erx * .95, ery * 1.04, (0, 1.5)),
                f'<path d="M{lx - erx - 2} {ey - ery - 4} Q{lx - 2} {ey - ery - 6} {lx + erx - 1} {ey - ery - 12}" stroke="{INKC}" '
                f'stroke-width="3.4" stroke-linecap="round" fill="none"/>',
                f'<path d="M{rx + erx + 2} {ey - ery - 4} Q{rx + 2} {ey - ery - 6} {rx - erx + 1} {ey - ery - 12}" stroke="{INKC}" '
                f'stroke-width="3.4" stroke-linecap="round" fill="none"/>',
                f'<path d="M{mx - 8} {my + 3} Q{mx - 4} {my - 2} {mx} {my + 2} Q{mx + 4} {my + 6} {mx + 8} {my + 1}" stroke="{INKC}" '
                f'stroke-width="3.2" stroke-linecap="round" fill="none"/>']
    elif mood == "thinking":
        out += [glossy_eye(lx, ey, erx, ery, (2.5, -3.5)), glossy_eye(rx, ey, erx, ery, (2.5, -3.5)),
                f'<path d="M{lx - erx} {ey - ery - 6} L{lx + erx} {ey - ery - 6}" stroke="{INKC}" stroke-width="3.2" stroke-linecap="round"/>',
                f'<path d="M{rx - erx} {ey - ery - 7} Q{rx} {ey - ery - 15} {rx + erx + 1} {ey - ery - 8}" stroke="{INKC}" '
                f'stroke-width="3.2" stroke-linecap="round" fill="none"/>',
                f'<path d="M{mx - 6} {my + 2} Q{mx + 1} {my - 1} {mx + 7} {my + 2}" stroke="{INKC}" stroke-width="3.4" '
                f'stroke-linecap="round" fill="none"/>']
    elif mood == "wink":
        out += [glossy_eye(lx, ey, erx, ery), happy_eye(rx, ey, erx),
                f'<path d="M{mx - 9} {my - 2} Q{mx} {my + 10} {mx + 9} {my - 2}" stroke="{INKC}" stroke-width="3.6" '
                f'stroke-linecap="round" fill="none"/>']
    out += [blush(lx - blush_dx, ey + blush_dy), blush(rx + blush_dx, ey + blush_dy)]
    return "".join(out)


def sweat(x, y, s=1.0):
    return (f'<path d="M{x} {y - 11 * s} C{x + 5 * s} {y - 3 * s} {x + 8 * s} {y + 1 * s} {x + 8 * s} {y + 5 * s} '
            f'A8 8 0 0 1 {x - 8 * s} {y + 5 * s} C{x - 8 * s} {y + 1 * s} {x - 5 * s} {y - 3 * s} {x} {y - 11 * s} Z" '
            f'fill="#BFE8FF" stroke="#7CC7EE" stroke-width="1.4"/>'
            f'<ellipse cx="{x - 3 * s}" cy="{y + 3 * s}" rx="{2 * s}" ry="{3 * s}" fill="#FFFFFF" opacity="0.8"/>')


def tag(x, y, rot, label="24K"):
    """Little hallmark tag, like a jeweler's price tag."""
    return (f'<g transform="translate({x} {y}) rotate({rot})">'
            f'<path d="M-15 -9 L9 -9 Q15 -9 18 -4 L22 0 L18 4 Q15 9 9 9 L-15 9 Q-19 9 -19 5 L-19 -5 Q-19 -9 -15 -9 Z" '
            f'fill="#FFFDF6" stroke="#E2B04A" stroke-width="1.6"/>'
            f'<circle cx="14" cy="0" r="2.4" fill="#F3E3BC" stroke="#E2B04A" stroke-width="1"/>'
            f'<text x="-2.5" y="4.3" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="800" '
            f'font-size="11.5" fill="#B5650A">{label}</text></g>')


# ── concept A: the drop ────────────────────────────────────────────────────

DROP = ("M121 20 C126 44 168 78 182 118 C198 166 168 206 120 206 C72 206 42 166 58 118 "
        "C72 78 116 44 121 20 Z")


def drop(mood):
    defs = radial("gA", 0.4, 0.42, 0.62, [(0, GOLD["hi"]), (0.25, GOLD["light"]), (0.62, GOLD["base"]), (1, GOLD["shade"])])
    feet = (f'<ellipse cx="103" cy="207" rx="13" ry="7.5" fill="{GOLD["shade"]}"/>'
            f'<ellipse cx="137" cy="207" rx="13" ry="7.5" fill="{GOLD["shade"]}"/>')
    arms = (f'<ellipse cx="56" cy="152" rx="8" ry="12" transform="rotate(28 56 152)" fill="{GOLD["base"]}"/>'
            f'<ellipse cx="184" cy="152" rx="8" ry="12" transform="rotate(-28 184 152)" fill="{GOLD["base"]}"/>')
    thread = '<path d="M122 26 C134 22 146 26 152 36" stroke="#C98A1C" stroke-width="1.6" fill="none"/>'
    extra = ""
    if mood == "excited":
        extra = sparkle(46, 70, 9, "#FFD34D") + sparkle(196, 84, 6, "#FFD34D") + sparkle(36, 116, 5, "#FFFFFF", .9)
    if mood == "worried":
        extra = sweat(176, 96, 0.9)
    return ("<defs>" + COMMON_DEFS + defs + "</defs>" + ground(120, 214, 52) + feet + arms
            + soft_shape(DROP, "gA", "cA", spec=(96, 92, 20, 30, -24), bounce_xy=(120, 214))
            + sparkle(152, 74, 6, "#FFFFFF", .95)
            + face(mood, 99, 141, 140, 120, 163)
            + thread + tag(166, 44, 22) + extra)


# ── concept B: the gold bar ────────────────────────────────────────────────

def bar(mood):
    front = "M52 112 L162 112 Q166 112 167 116 L180 184 Q181 192 173 192 L41 192 Q33 192 34 184 L47 116 Q48 112 52 112 Z"
    top = "M55 110 L84 86 Q87 84 91 84 L188 84 Q194 84 191 88 L166 110 Z"
    side = "M168 112 L193 89 Q197 86 198 92 L208 160 Q209 166 204 170 L182 189 Z"
    defs = (linear("gFront", 0, 0, 0, 1, [(0, GOLD["light"]), (0.45, GOLD["base"]), (1, GOLD["shade"])])
            + linear("gTop", 0, 0, 1, 1, [(0, "#FFF6CC"), (1, "#FFD45C")])
            + linear("gSide", 0, 0, 1, 1, [(0, GOLD["shade"]), (1, GOLD["deep"])]))
    stamp = ('<g transform="matrix(1 0 -1.12 0.56 126 97)">'
             '<text x="0" y="7" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="900" '
             'font-size="25" fill="#C27408">24K</text>'
             '<text x="-1.2" y="5.6" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="900" '
             'font-size="25" fill="#FFF3C4" opacity="0.55">24K</text></g>')
    gloss = ('<g clip-path="url(#cFront)"><path d="M70 112 L96 112 L70 192 L44 192 Z" fill="#FFFFFF" opacity="0.28" filter="url(#b2)"/>'
             '<path d="M104 112 L112 112 L86 192 L78 192 Z" fill="#FFFFFF" opacity="0.2" filter="url(#b2)"/></g>')
    arms = (f'<ellipse cx="34" cy="152" rx="8.5" ry="13" transform="rotate(24 34 152)" fill="{GOLD["base"]}"/>'
            f'<ellipse cx="211" cy="132" rx="8.5" ry="13" transform="rotate(-20 211 132)" fill="{GOLD["shade"]}"/>')
    feet = (f'<ellipse cx="78" cy="196" rx="15" ry="7" fill="{GOLD["shade"]}"/>'
            f'<ellipse cx="142" cy="196" rx="15" ry="7" fill="{GOLD["shade"]}"/>')
    extra = ""
    if mood == "excited":
        extra = sparkle(30, 70, 9, "#FFD34D") + sparkle(214, 60, 7, "#FFD34D") + sparkle(24, 108, 5, "#FFFFFF", .9)
    if mood == "worried":
        extra = sweat(190, 54, 0.9)
    if mood == "thinking":
        extra = ('<circle cx="196" cy="60" r="3.5" fill="#FFF3D1" stroke="#E2B04A" stroke-width="1.4"/>'
                 '<circle cx="206" cy="46" r="5" fill="#FFF3D1" stroke="#E2B04A" stroke-width="1.4"/>'
                 '<circle cx="220" cy="28" r="7" fill="#FFF3D1" stroke="#E2B04A" stroke-width="1.4"/>')
    return ("<defs>" + COMMON_DEFS + defs + "</defs>" + ground(122, 200, 82) + feet + arms
            + f'<path d="{side}" fill="url(#gSide)" stroke="{GOLD["deep"]}" stroke-opacity="0.3" stroke-width="1.5" stroke-linejoin="round"/>'
            + f'<path d="{top}" fill="url(#gTop)" stroke="#F0B43A" stroke-opacity="0.45" stroke-width="1.5" stroke-linejoin="round"/>'
            + stamp
            + soft_shape(front, "gFront", "cFront", bounce_xy=(108, 196), bounce_r=(80, 14), spec=(70, 124, 22, 8, -8))
            + gloss
            + sparkle(176, 98, 6, "#FFFFFF", .95)
            + face(mood, 86, 132, 146, 109, 168, eye=(10, 12.5), blush_dx=15, blush_dy=18)
            + extra)


# ── concept C: the fennec ──────────────────────────────────────────────────

FUR = {"hi": "#FFE7B0", "light": "#FCD58A", "base": "#F4BC5E", "shade": "#E39A3A", "deep": "#C97A22",
       "cream": "#FFF4E0", "inner": "#FFC9B0"}


def fennec(mood):
    head = ("M120 66 C158 66 184 92 184 124 C184 158 156 178 120 178 C84 178 56 158 56 124 "
            "C56 92 82 66 120 66 Z")
    ear_l = "M74 96 C60 70 50 40 52 22 C54 14 60 12 66 16 C82 28 100 52 108 74 Z"
    ear_r = "M166 96 C180 70 190 40 188 22 C186 14 180 12 174 16 C158 28 140 52 132 74 Z"
    in_l = "M78 86 C68 66 62 44 62 30 C70 38 86 56 96 74 Z"
    in_r = "M162 86 C172 66 178 44 178 30 C170 38 154 56 144 74 Z"
    body = "M84 170 C80 196 92 212 120 212 C148 212 160 196 156 170 Z"
    tail = ("M150 196 C176 204 206 190 212 162 C218 136 204 116 190 112 C200 132 196 160 176 172 "
            "C166 178 156 180 150 182 Z")
    muzzle = "M120 116 C140 116 156 128 156 144 C156 160 140 168 120 168 C100 168 84 160 84 144 C84 128 100 116 120 116 Z"
    defs = (radial("gH", 0.4, 0.32, 0.75, [(0, FUR["hi"]), (0.3, FUR["light"]), (0.7, FUR["base"]), (1, FUR["shade"])])
            + linear("gE", 0, 0, 0, 1, [(0, FUR["light"]), (1, FUR["base"])])
            + linear("gT", 0, 0, 1, 0, [(0, FUR["base"]), (1, FUR["shade"])])
            + linear("gB", 0, 0, 0, 1, [(0, FUR["base"]), (1, FUR["shade"])]))
    tail_tip = '<path d="M190 112 C204 116 218 136 212 162 C208 150 202 132 190 112 Z" fill="#FFF4E0"/>'
    belly = '<ellipse cx="120" cy="196" rx="20" ry="14" fill="#FFF1D8" opacity="0.95"/>'
    paws = (f'<ellipse cx="102" cy="211" rx="11" ry="6.5" fill="{FUR["shade"]}"/>'
            f'<ellipse cx="138" cy="211" rx="11" ry="6.5" fill="{FUR["shade"]}"/>')
    loupe = ('<g transform="translate(70 186) rotate(-38)">'
             '<rect x="-4.5" y="2" width="9" height="26" rx="4.5" fill="#3A2A1E"/>'
             '<rect x="-6" y="-1" width="12" height="6" rx="2" fill="#E2A93A"/>'
             '<circle cx="0" cy="-15" r="15" fill="#DDF1FA" fill-opacity="0.65" stroke="#2C2F36" stroke-width="5"/>'
             '<path d="M-8 -20 A9 9 0 0 1 -1 -25" stroke="#FFFFFF" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>'
             f'<ellipse cx="82" cy="190" rx="9" ry="7" fill="{FUR["base"]}"/>')
    nose = (f'<path d="M113 134 Q120 130 127 134 Q125 141 120 142 Q115 141 113 134 Z" fill="{INKC}"/>'
            '<ellipse cx="118" cy="134.5" rx="2.6" ry="1.4" fill="#FFFFFF" opacity="0.7"/>')
    extra = ""
    if mood == "excited":
        extra = sparkle(34, 86, 9, "#FFD34D") + sparkle(212, 70, 7, "#FFD34D") + sparkle(30, 128, 5, "#FFFFFF", .9)
    if mood == "worried":
        extra = sweat(190, 92, 0.9)
    eyes_mouth = face(mood, 98, 142, 112, 120, 150, eye=(10, 12.5), blush_dx=13, blush_dy=20)
    # the fennec's mouth sits under the nose: shift the generic mouth a little
    return ("<defs>" + COMMON_DEFS + defs + "</defs>" + ground(126, 218, 70)
            + f'<path d="{tail}" fill="url(#gT)"/>' + tail_tip
            + f'<path d="{body}" fill="url(#gB)"/>' + belly + paws
            + f'<path d="{ear_l}" fill="url(#gE)" stroke="{FUR["deep"]}" stroke-opacity="0.25" stroke-width="1.5"/>'
            + f'<path d="{ear_r}" fill="url(#gE)" stroke="{FUR["deep"]}" stroke-opacity="0.25" stroke-width="1.5"/>'
            + f'<path d="{in_l}" fill="{FUR["inner"]}" opacity="0.9"/>'
            + f'<path d="{in_r}" fill="{FUR["inner"]}" opacity="0.9"/>'
            + soft_shape(head, "gH", "cHead", ao=FUR["deep"], bounce=FUR["cream"], bounce_xy=(120, 182),
                         bounce_r=(60, 18), spec=(94, 84, 22, 12, -24), edge=FUR["deep"])
            + f'<path d="{muzzle}" fill="{FUR["cream"]}" opacity="0.96"/>'
            + nose + eyes_mouth + loupe + extra)


def svg(inner):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">{inner}</svg>'


def render(text, path, size):
    data = resvg_py.svg_to_bytes(svg_string=text, width=size, height=size)
    with open(path, "wb") as fh:
        fh.write(bytes(data))


MOODS = ["happy", "excited", "worried", "thinking", "wink"]
for m in MOODS:
    t = svg(bar(m))
    base = os.path.join(OUT, f"bar-{m}")
    open(base + ".svg", "w", encoding="utf-8").write(t)
    render(t, base + ".png", SIZE)

# avatar: close crop on the bar, warm gradient disc
inner = bar("happy")
avatar = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">'
          '<defs><radialGradient id="av" cx="0.5" cy="0.38" r="0.7"><stop offset="0" stop-color="#FFF8E4"/>'
          '<stop offset="1" stop-color="#F6E3B4"/></radialGradient></defs>'
          '<rect width="240" height="240" fill="url(#av)"/>'
          '<g transform="translate(-41 -50) scale(1.3)">' + inner + '</g></svg>')
render(avatar, os.path.join(OUT, "bar-avatar.png"), 1080)
open(os.path.join(OUT, "bar-avatar.svg"), "w", encoding="utf-8").write(avatar)
icon = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">'
        '<defs><radialGradient id="ig" cx="0.5" cy="0.42" r="0.65"><stop offset="0" stop-color="#2A2C33"/>'
        '<stop offset="1" stop-color="#15171C"/></radialGradient></defs>'
        '<rect width="240" height="240" rx="54" fill="url(#ig)"/>'
        '<g transform="translate(6 2) scale(0.95)">' + inner + '</g></svg>')
render(icon, os.path.join(OUT, "bar-icon.png"), 1024)
open(os.path.join(OUT, "bar-icon.svg"), "w", encoding="utf-8").write(icon)

cell = 260
sheet = Image.new("RGB", (cell * 5 + 40, cell * 2 + 40), "#F7F3EA")
for c, m in enumerate(MOODS):
    im = Image.open(os.path.join(OUT, f"bar-{m}.png")).convert("RGBA").resize((cell - 20, cell - 20), Image.LANCZOS)
    sheet.paste(im, (20 + c * cell, 20), im)
av = Image.open(os.path.join(OUT, "bar-avatar.png")).convert("RGBA").resize((220, 220), Image.LANCZOS)
mask = Image.new("L", (220, 220), 0); ImageDraw.Draw(mask).ellipse((0, 0, 219, 219), fill=255)
sheet.paste(av, (40, cell + 30), mask)
small = av.resize((110, 110), Image.LANCZOS); m2 = mask.resize((110, 110))
sheet.paste(small, (300, cell + 85), m2)
ic = Image.open(os.path.join(OUT, "bar-icon.png")).convert("RGBA").resize((220, 220), Image.LANCZOS)
sheet.paste(ic, (460, cell + 30), ic)
sheet.save(os.path.join(OUT, "bar-sheet.png"))
print("ok")
