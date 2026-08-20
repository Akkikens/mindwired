#!/usr/bin/env python3
"""D.B. Cooper thumbnails — real FBI/Commons assets, House Style 2.0.

A — the real FBI composite sketch (Composite A), dark grade, zero text.
B — the real Northwest Orient 727 airstair mechanism, dark grade, one word
    "VANISHED".
C — the real 1980 Tena Bar recovered ransom money photo, dark grade, zero
    text.

Run: python3 scripts/gen_dbcooper_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "dbcooper" / "images"
OUT = REPO / "out" / "thumbs"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1920, 1080
ARIAL_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def vignette(img, strength):
    mask = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(mask)
    mr = math.hypot(W / 2, H / 2)
    for y in range(0, H, 4):
        for x in range(0, W, 4):
            r = math.hypot(x - W / 2, y - H / 2) / mr
            d.rectangle([x, y, x + 4, y + 4], fill=max(0, 255 - int(255 * strength * r ** 2.1)))
    mask = mask.filter(ImageFilter.GaussianBlur(30))
    return Image.composite(img, Image.new("RGB", (W, H), (0, 0, 0)), mask)


def warm(img, amt):
    return Image.blend(img, Image.new("RGB", (W, H), (30, 20, 8)), amt)


# ── A: FBI composite sketch, zero text ───────────────────────────────────
im = Image.open(SRC / "sketch_2.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.3))
im = ImageEnhance.Color(im).enhance(0.4)
im = ImageEnhance.Contrast(im).enhance(1.3)
im = ImageEnhance.Brightness(im).enhance(0.95)
darker = ImageEnhance.Brightness(im).enhance(0.35)
mask = Image.new("L", (W, H), 255)
d = ImageDraw.Draw(mask)
d.ellipse([int(W * 0.24), int(-H * 0.05), int(W * 0.76), int(H * 1.05)], fill=0)
mask = mask.filter(ImageFilter.GaussianBlur(150))
im = Image.composite(darker, im, mask)
im = vignette(im, 0.62)
im.save(OUT / "dbcooper_A.png")

# ── B: real airstair mechanism + "VANISHED" ──────────────────────────────
im = Image.open(SRC / "airstair_1.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.5))
im = ImageEnhance.Color(im).enhance(0.9)
im = ImageEnhance.Contrast(im).enhance(1.3)
im = ImageEnhance.Brightness(im).enhance(0.8)
im = vignette(warm(im, 0.06), 0.55)
d = ImageDraw.Draw(im)
font = ImageFont.truetype(ARIAL_BOLD, 130)
word = "VANISHED"
tw = d.textlength(word, font=font)
x, y = (W - tw) // 2, H - 210
d.text((x + 4, y + 6), word, font=font, fill=(0, 0, 0))
d.text((x, y), word, font=font, fill=(240, 244, 248))
im.save(OUT / "dbcooper_B.png")

# ── C: real 1980 recovered ransom money, zero text ───────────────────────
im = Image.open(SRC / "money_4.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.5))
im = ImageEnhance.Color(im).enhance(0.75)
im = ImageEnhance.Contrast(im).enhance(1.35)
im = ImageEnhance.Brightness(im).enhance(1.0)
im = vignette(warm(im, 0.05), 0.5)
im.save(OUT / "dbcooper_C.png")

print("built:", [str(OUT / f"dbcooper_{v}.png") for v in "ABC"])
