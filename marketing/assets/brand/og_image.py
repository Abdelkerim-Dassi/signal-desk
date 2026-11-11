"""Link-preview image for qirat.tn (1200x630): what WhatsApp, Telegram and
Facebook show when someone pastes the address.

Usage: python og_image.py <repo_root>
Writes frontend/public/og-image.png. Run with the qirat-media environment
(Pillow, arabic_reshaper, python-bidi) and PYTHONIOENCODING=utf-8.

The image carries the one promise the videos make (trading from zero, in Darija).
The Darija comes from the app where possible:
  - «تعلّم»                                  the Learn tab
  - «من الصفر، بالدارجة»                     the "start here" strip on Learn
  - «تدرّب بـ 10 دولار» · «تجربة، موش فلوس حقيقية»   the Practice title and its label
"""
import os
import sys

import arabic_reshaper
from bidi.algorithm import get_display
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = sys.argv[1]
W, H = 1200, 630
BG, INK, MUTED = (247, 243, 234), (21, 23, 28), (107, 111, 120)
GOLD, MARKER, BAND = (154, 107, 20), (255, 206, 84), (201, 150, 47)
BRAND = os.path.join(ROOT, "marketing", "assets", "brand")
LATIN = os.path.join(ROOT, "server", "assets", "fonts", "ReadexPro-Variable.ttf")
AR_BOLD, AR_SEMI = "C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/seguisb.ttf"
RIGHT = W - 80  # Arabic text hangs from this edge


def ar(text):
    return get_display(arabic_reshaper.reshape(text))


def latin(size, weight=600):
    f = ImageFont.truetype(LATIN, size)
    f.set_variation_by_axes([weight, 0])
    return f


def draw_right(d, text, y, font, fill):
    """Draw one line ending at the right margin; return its left edge."""
    w = d.textlength(text, font=font)
    d.text((RIGHT - w, y), text, font=font, fill=fill)
    return RIGHT - w


im = Image.new("RGBA", (W, H), BG + (255,))

# soft gold glow behind the mascot, as in the reels
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(glow).ellipse((20, 95, 500, 575), fill=(255, 206, 84, 95))
im.alpha_composite(glow.filter(ImageFilter.GaussianBlur(70)))

d = ImageDraw.Draw(im)
d.rectangle((0, 0, W, 14), fill=BAND)  # the gold band that means "Qirat's answer"

bar = Image.open(os.path.join(BRAND, "bar-happy.png")).convert("RGBA")
size = 400
bar = bar.resize((size, int(bar.height * size / bar.width)), Image.LANCZOS)
im.alpha_composite(bar, (60, (H - bar.height) // 2 + 6))

# headline on a gold marker stroke
head_font = ImageFont.truetype(AR_BOLD, 100)
head = ar("تعلّم الـ trading")
hw = d.textlength(head, font=head_font)
d.rounded_rectangle((RIGHT - hw - 18, 196, RIGHT + 18, 246), radius=14, fill=MARKER)
draw_right(d, head, 112, head_font, INK)

draw_right(d, ar("من الصفر، بالدارجة"), 282, ImageFont.truetype(AR_BOLD, 62), INK)
draw_right(d, ar("تدرّب بـ 10 دولار · تجربة، موش فلوس حقيقية"), 392, ImageFont.truetype(AR_SEMI, 32), MUTED)

# the address, large enough to read in a small preview
url_font = latin(52, 700)
uw = d.textlength("qirat.tn", font=url_font)
d.text((RIGHT - uw, 496), "qirat.tn", font=url_font, fill=GOLD)
name_font = ImageFont.truetype(AR_BOLD, 50)
name = ar("قيراط")
d.text((RIGHT - uw - 28 - d.textlength(name, font=name_font), 488), name, font=name_font, fill=INK)

out = os.path.join(ROOT, "frontend", "public", "og-image.png")
im.convert("RGB").save(out, optimize=True)
print(out, os.path.getsize(out))
