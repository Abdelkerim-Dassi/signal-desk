"""Share-card images (PNG) for the bot, the Telegram channel and social posts.

Three cards, all 1080×1350 (the 4:5 portrait that Telegram, Instagram and X
all show uncropped):

  * ``coin_card``   — one coin's score ring and the full point-by-point breakdown
  * ``today_card``  — "Today's karats": the day's logged ratings for the tracked
                      universe, the same rows the live track record saves
  * ``report_card`` — the weekly report card: how ratings from a week ago did,
                      worst result first

Drawn with Pillow at 2× and downsampled, so arcs and text stay smooth. Labels
are English or French; Pillow here has no Arabic shaping (no libraqm), so
Arabic readers get an English card with an Arabic caption from the bot.
"""

from __future__ import annotations

import io
from datetime import date
from functools import lru_cache
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

from .labels import te

FONT_FILE = Path(__file__).resolve().parent / "assets" / "fonts" / "ReadexPro-Variable.ttf"

W, H = 1080, 1350
S = 2  # supersampling factor

BG = (246, 244, 239)
CARD = (255, 255, 255)
SUBTLE = (241, 238, 231)
TEXT = (21, 23, 28)
MUTED = (107, 111, 120)
GOLD = (154, 107, 20)
GOLD_SOFT = (246, 236, 214)
COLORS = {"STRONG": (14, 159, 110), "NEUTRAL": (100, 116, 139), "WEAK": (224, 72, 78)}
UP, DOWN = (14, 159, 110), (224, 72, 78)

COPY = {
    "en": {
        "setup": {"STRONG": "Strong setup", "NEUTRAL": "Neutral setup", "WEAK": "Weak setup"},
        "why": "Why this score",
        "base": "Starting point",
        "cap": "Risk-off cap",
        "score": "Score",
        "risk_on": "Market risk-on · BTC {pct} above its 200-day average",
        "risk_off": "Market risk-off · scores capped at 66",
        "footer": "Every coin has a karat · t.me/getqirat",
        "nfa": "Not financial advice",
        "today": "Today's karats",
        "today_sub": "{n} coins · logged {date} · saved once, never edited",
        "counts": "{s} Strong · {n} Neutral · {w} Weak",
        "report": "Report card",
        "report_sub": "Ratings from {date}, {h} days later · worst first",
        "strong_avg": "Strong avg",
        "all_avg": "All coins avg",
        "strong_up": "Strong went up",
        "live_note": "Live log · every call kept, losses included",
    },
    "fr": {
        "setup": {"STRONG": "Configuration forte", "NEUTRAL": "Configuration neutre", "WEAK": "Configuration faible"},
        "why": "Pourquoi ce score",
        "base": "Point de départ",
        "cap": "Plafond marché défavorable",
        "score": "Score",
        "risk_on": "Marché favorable · BTC {pct} au-dessus de sa moyenne 200 j",
        "risk_off": "Marché défavorable · scores plafonnés à 66",
        "footer": "Chaque crypto a son carat · t.me/getqirat",
        "nfa": "Pas un conseil financier",
        "today": "Les carats du jour",
        "today_sub": "{n} cryptos · enregistré le {date} · jamais modifié",
        "counts": "{s} Fortes · {n} Neutres · {w} Faibles",
        "report": "Bilan",
        "report_sub": "Notes du {date}, {h} jours après · pires d'abord",
        "strong_avg": "Moy. Fortes",
        "all_avg": "Moy. toutes",
        "strong_up": "Fortes en hausse",
        "live_note": "Journal en direct · toutes les notes, pertes comprises",
    },
}


def _copy(lang: str) -> dict[str, Any]:
    return COPY.get(lang, COPY["en"])


def _label_lang(lang: str) -> str:
    return lang if lang in COPY else "en"


@lru_cache(maxsize=32)
def font(size: int, weight: int = 400) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONT_FILE), size * S)
    f.set_variation_by_axes([weight, 0])  # axes: Weight, Hyper Expansion
    return f


class Canvas:
    def __init__(self) -> None:
        self.img = Image.new("RGB", (W * S, H * S), BG)
        self.d = ImageDraw.Draw(self.img)

    # all coordinates are in 1080×1350 space; scaling happens here
    def text(self, xy, s, size, weight=400, fill=TEXT, anchor="la") -> None:
        self.d.text((xy[0] * S, xy[1] * S), s, font=font(size, weight), fill=fill, anchor=anchor)

    def text_width(self, s, size, weight=400) -> float:
        return self.d.textlength(s, font=font(size, weight)) / S

    def rrect(self, box, radius, fill, outline=None) -> None:
        self.d.rounded_rectangle([v * S for v in box], radius=radius * S, fill=fill, outline=outline, width=S)

    def circle(self, center, r, fill) -> None:
        x, y = center
        self.d.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=fill)

    def ring(self, center, r, width, score, color) -> None:
        x, y = center
        box = [(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S]
        self.d.arc(box, 0, 360, fill=SUBTLE, width=width * S)
        frac = max(0.0, min(1.0, score / 100))
        if frac > 0:
            self.d.arc(box, -90, -90 + 360 * frac, fill=color, width=width * S)

    def gem(self, x, y, size) -> None:
        """The Qirat mark, scaled from its 32-unit design grid."""
        k = size / 32
        pts = [(9, 5), (23, 5), (29, 13), (16, 28), (3, 13)]
        poly = [((x + px * k) * S, (y + py * k) * S) for px, py in pts]
        # diagonal gold gradient, masked to the gem outline
        grad = Image.new("RGB", (int(size * S), int(size * S)))
        gd = ImageDraw.Draw(grad)
        top, bottom = (243, 207, 122), (154, 107, 20)
        n = int(size * S * 2)
        for i in range(n):
            t = i / n
            c = tuple(int(top[j] + (bottom[j] - top[j]) * t) for j in range(3))
            gd.line([(i, 0), (0, i)], fill=c, width=2)
        mask = Image.new("L", grad.size, 0)
        ImageDraw.Draw(mask).polygon([(px * k * S, py * k * S) for px, py in pts], fill=255)
        self.img.paste(grad, (int(x * S), int(y * S)), mask)
        facet = (255, 247, 230)
        lines = [[(3, 13), (29, 13)], [(9, 5), (13, 13), (16, 5), (19, 13), (23, 5)], [(13, 13), (16, 28), (19, 13)]]
        for line in lines:
            self.d.line([((x + px * k) * S, (y + py * k) * S) for px, py in line], fill=facet, width=max(1, int(size * S / 40)))
        del poly

    def triangle(self, x, y, size, color, up=True) -> None:
        if up:
            pts = [(x, y + size), (x + size, y + size), (x + size / 2, y)]
        else:
            pts = [(x, y), (x + size, y), (x + size / 2, y + size)]
        self.d.polygon([(px * S, py * S) for px, py in pts], fill=color)

    def png(self) -> bytes:
        out = self.img.resize((W, H), Image.LANCZOS)
        buf = io.BytesIO()
        out.save(buf, format="PNG", optimize=True)
        return buf.getvalue()


def _header(c: Canvas, right: str) -> None:
    c.gem(64, 58, 56)
    c.text((132, 86), "qirat", 44, 600, anchor="lm")
    c.text((W - 64, 86), right, 26, 400, MUTED, anchor="rm")


def _footer(c: Canvas, lang: str) -> None:
    cp = _copy(lang)
    c.d.line([(64 * S, (H - 96) * S), ((W - 64) * S, (H - 96) * S)], fill=(225, 221, 212), width=S)
    c.text((64, H - 56), cp["footer"], 26, 500, GOLD, anchor="lm")
    c.text((W - 64, H - 56), cp["nfa"], 24, 400, MUTED, anchor="rm")


def _pill(c: Canvas, x, y, rating: str, label: str, size=30) -> float:
    color = COLORS[rating]
    tint = tuple(int(255 - (255 - v) * 0.12) for v in color)
    w = c.text_width(label, size, 600) + size * 1.9
    h = size * 1.7
    c.rrect((x, y, x + w, y + h), h / 2, tint)
    tri = size * 0.5
    ty = y + (h - tri) / 2
    if rating == "NEUTRAL":
        c.circle((x + size * 0.85, y + h / 2), tri / 2.3, color)
    else:
        c.triangle(x + size * 0.6, ty, tri, color, up=rating == "STRONG")
    c.text((x + size * 1.35, y + h / 2), label, size, 600, color, anchor="lm")
    return w


def _pct(v: float | None) -> str:
    return "--" if v is None else f"{v:+.2f}%"


def _price(v: float | None) -> str:
    if v is None:
        return "--"
    if abs(v) >= 1000:
        return f"${v:,.0f}"
    if abs(v) >= 1:
        return f"${v:,.2f}"
    return f"${v:.4f}"


def _regime_line(c: Canvas, y: float, regime: dict[str, Any] | None, lang: str) -> None:
    cp = _copy(lang)
    state = (regime or {}).get("state")
    if state not in ("risk_on", "risk_off"):
        return
    on = state == "risk_on"
    pct = f"{abs((regime or {}).get('distance_pct') or 0):.1f}%"
    c.circle((78, y), 9, COLORS["STRONG"] if on else COLORS["WEAK"])
    c.text((100, y), cp["risk_on" if on else "risk_off"].format(pct=pct), 28, 500, TEXT, anchor="lm")


def coin_card(a: dict[str, Any], regime: dict[str, Any] | None, lang: str = "en") -> bytes:
    lang = _label_lang(lang)
    cp = _copy(lang)
    c = Canvas()
    _header(c, date.today().isoformat())

    rating = a.get("rating", "NEUTRAL")
    color = COLORS.get(rating, COLORS["NEUTRAL"])
    name = str(a.get("name") or a.get("symbol"))
    c.text((64, 200), name, 72, 700)
    # symbol · price · 24h change, with the change coloured
    line = f"{a.get('symbol', '')} · {_price(a.get('current_price'))} · "
    c.text((66, 300), line, 32, 400, MUTED)
    ch = a.get("change_24h")
    c.text((66 + c.text_width(line, 32), 300), f"{_pct(ch)} 24h", 32, 500, UP if (ch or 0) >= 0 else DOWN)
    _pill(c, 64, 360, rating, cp["setup"].get(rating, rating), 30)

    c.ring((880, 290), 118, 24, float(a.get("score") or 0), color)
    c.text((880, 290), f"{float(a.get('score') or 0):.0f}", 92, 700, anchor="mm")

    # breakdown card
    sb = a.get("score_breakdown") or {}
    rows: list[tuple[str, str, tuple[int, int, int]]] = [(cp["base"], str(sb.get("base", 50)), MUTED)]
    for comp in sb.get("components") or []:
        d = comp.get("delta", 0)
        rows.append((te(lang, comp.get("label")), f"{'+' if d > 0 else ''}{d:g}", UP if d >= 0 else DOWN))
    if sb.get("cap"):
        rows.append((cp["cap"], f"≤{sb['cap']['value']}", COLORS["WEAK"]))
    rows = rows[:10]
    top = 480
    row_h = 62
    bottom = top + 96 + row_h * len(rows) + 92
    c.rrect((64, top, W - 64, bottom), 36, CARD)
    c.text((104, top + 58), cp["why"], 32, 600, anchor="lm")
    y = top + 128
    for label, value, vcolor in rows:
        c.text((104, y), label, 32, 400, MUTED if vcolor == MUTED else TEXT, anchor="lm")
        c.text((W - 104, y), value, 34, 600, vcolor, anchor="rm")
        y += row_h
    c.d.line([(104 * S, (y - 22) * S), ((W - 104) * S, (y - 22) * S)], fill=(232, 228, 220), width=S)
    c.text((104, y + 20), cp["score"], 34, 700, anchor="lm")
    c.text((W - 104, y + 20), f"{float(sb.get('final', a.get('score') or 0)):.0f}", 38, 700, GOLD, anchor="rm")

    # where the score sits on the 0–100 scale, with the rating thresholds
    scale_y = max(bottom + 90, H - 300)
    if scale_y + 60 < H - 170:
        score = float(a.get("score") or 0)
        bx, bw = 64, W - 128
        c.rrect((bx, scale_y - 8, bx + bw, scale_y + 8), 8, SUBTLE)
        c.rrect((bx, scale_y - 8, bx + bw * max(0.02, min(1, score / 100)), scale_y + 8), 8, color)
        for thr in (38, 67):
            tx = bx + bw * thr / 100
            c.d.line([(tx * S, (scale_y - 16) * S), (tx * S, (scale_y + 16) * S)], fill=BG, width=3 * S)
        c.text((bx, scale_y + 44), "0", 24, 500, MUTED, anchor="lm")
        c.text((bx + bw * 0.38, scale_y + 44), f"{te(lang, 'WEAK')} ≤38", 24, 500, COLORS["WEAK"], anchor="mm")
        c.text((bx + bw * 0.67, scale_y + 44), f"{te(lang, 'STRONG')} ≥67", 24, 500, COLORS["STRONG"], anchor="mm")
        c.text((bx + bw, scale_y + 44), "100", 24, 500, MUTED, anchor="rm")

    _regime_line(c, H - 150, regime, lang)
    _footer(c, lang)
    return c.png()


def _mini_row(c: Canvas, x: float, y: float, w: float, symbol: str, rating: str, score: float, right: str | None, right_color=None) -> None:
    color = COLORS.get(rating, COLORS["NEUTRAL"])
    c.rrect((x, y - 34, x + w, y + 34), 20, CARD)
    c.circle((x + 30, y), 9, color)
    c.text((x + 52, y), symbol, 30, 600, anchor="lm")
    if right is None:
        # score bar
        bx, bw = x + 190, w - 300
        c.rrect((bx, y - 6, bx + bw, y + 6), 6, SUBTLE)
        c.rrect((bx, y - 6, bx + bw * max(0.04, min(1, score / 100)), y + 6), 6, color)
        c.text((x + w - 24, y), f"{score:.0f}", 30, 700, anchor="rm")
    else:
        c.text((x + 160, y), f"{score:.0f}", 28, 500, MUTED, anchor="lm")
        c.text((x + w - 24, y), right, 30, 700, right_color or TEXT, anchor="rm")


def today_card(rows: list[dict[str, Any]], regime: dict[str, Any] | None, day: str, lang: str = "en") -> bytes:
    lang = _label_lang(lang)
    cp = _copy(lang)
    c = Canvas()
    _header(c, day)
    c.text((64, 200), cp["today"], 68, 700)
    c.text((66, 290), cp["today_sub"].format(n=len(rows), date=day), 28, 400, MUTED)
    counts = {k: sum(1 for r in rows if r.get("rating") == k) for k in COLORS}
    c.text((66, 336), cp["counts"].format(s=counts["STRONG"], n=counts["NEUTRAL"], w=counts["WEAK"]), 28, 600, GOLD)

    ordered = sorted(rows, key=lambda r: r.get("score", 0), reverse=True)[:18]
    col_w = (W - 64 * 2 - 24) / 2
    per_col = (len(ordered) + 1) // 2
    for i, r in enumerate(ordered):
        col, idx = divmod(i, per_col)
        x = 64 + col * (col_w + 24)
        y = 446 + idx * 82
        _mini_row(c, x, y, col_w, r["symbol"], r.get("rating", "NEUTRAL"), float(r.get("score", 0)), None)

    _regime_line(c, H - 150, regime, lang)
    _footer(c, lang)
    return c.png()


def report_card(resolved: dict[str, Any], stats: dict[str, Any], lang: str = "en") -> bytes:
    """resolved = {day, horizon, rows:[{symbol, rating, score, return}]}; stats = ratings at that horizon."""
    lang = _label_lang(lang)
    cp = _copy(lang)
    c = Canvas()
    _header(c, date.today().isoformat())
    c.text((64, 200), cp["report"], 68, 700)
    c.text((66, 290), cp["report_sub"].format(date=resolved["day"], h=resolved["horizon"]), 28, 400, MUTED)

    # three summary tiles
    tiles = [
        (cp["strong_avg"], _pct((stats.get("STRONG") or {}).get("mean"))),
        (cp["all_avg"], _pct((stats.get("ALL") or {}).get("mean"))),
        (cp["strong_up"], f"{(stats.get('STRONG') or {}).get('hit_rate', '--')}%"),
    ]
    tw = (W - 64 * 2 - 2 * 20) / 3
    for i, (label, value) in enumerate(tiles):
        x = 64 + i * (tw + 20)
        c.rrect((x, 350, x + tw, 470), 28, CARD)
        c.text((x + 24, 386), label, 24, 500, MUTED, anchor="lm")
        positive = not value.startswith("-")
        c.text((x + 24, 436), value, 38, 700, (UP if positive else DOWN) if "%" in value and i < 2 else GOLD, anchor="lm")

    rows = sorted(resolved["rows"], key=lambda r: r.get("return", 0))[:18]  # worst first
    col_w = (W - 64 * 2 - 24) / 2
    per_col = (len(rows) + 1) // 2
    for i, r in enumerate(rows):
        col, idx = divmod(i, per_col)
        x = 64 + col * (col_w + 24)
        y = 540 + idx * 74
        ret = r.get("return")
        _mini_row(c, x, y, col_w, r["symbol"], r.get("rating", "NEUTRAL"), float(r.get("score", 0)),
                  _pct(ret), UP if (ret or 0) >= 0 else DOWN)

    c.text((64, H - 140), cp["live_note"], 26, 500, MUTED, anchor="lm")
    _footer(c, lang)
    return c.png()
