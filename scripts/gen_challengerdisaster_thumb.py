#!/usr/bin/env python3
"""Challenger disaster thumbnails — real NASA/Commons assets, House Style 2.0.

A — the real 1986 explosion photo, dark grade, zero text. Primary.
B — the real official STS-51-L crew portrait, dark grade, zero text.
C — a real Rogers Commission investigation photo + "IGNORED" (a fact not
    already in the title's own wording — synergy, not repetition).

Run: python3 scripts/gen_challengerdisaster_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "challengerdisaster" / "images"
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


def cool(img, amt):
    return Image.blend(img, Image.new("RGB", (W, H), (8, 14, 24)), amt)


# ── A: real 1986 explosion photo, zero text ────────────────────────────────
im = Image.open(SRC / "explosion_2.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.45))
im = ImageEnhance.Color(im).enhance(0.75)
im = ImageEnhance.Contrast(im).enhance(1.3)
im = ImageEnhance.Brightness(im).enhance(0.95)
im = vignette(cool(im, 0.05), 0.55)
im.save(OUT / "challengerdisaster_A.png")

# ── B: real official crew portrait, zero text ──────────────────────────────
im = Image.open(SRC / "crewgroup_3.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.4))
im = ImageEnhance.Color(im).enhance(0.7)
im = ImageEnhance.Contrast(im).enhance(1.25)
im = ImageEnhance.Brightness(im).enhance(0.88)
im = vignette(cool(im, 0.08), 0.6)
im.save(OUT / "challengerdisaster_B.png")

# ── C: real Rogers Commission investigation photo + "IGNORED" (the fact the
# title doesn't spell out visually — the warning existed, it was ignored) ──
im = Image.open(SRC / "hearingroom_2.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.35))
im = ImageEnhance.Color(im).enhance(0.55)
im = ImageEnhance.Contrast(im).enhance(1.2)
im = ImageEnhance.Brightness(im).enhance(0.75)
darker = ImageEnhance.Brightness(im).enhance(0.35)
mask = Image.new("L", (W, H), 255)
d = ImageDraw.Draw(mask)
d.ellipse([int(W * 0.15), int(H * 0.35), int(W * 0.85), int(H * 1.15)], fill=0)
mask = mask.filter(ImageFilter.GaussianBlur(160))
im = Image.composite(darker, im, mask)
im = vignette(im, 0.6)
d = ImageDraw.Draw(im)
word = "IGNORED"
font_size = 150
font = ImageFont.truetype(ARIAL_BOLD, font_size)
while d.textlength(word, font=font) > W * 0.5:
    font_size -= 4
    font = ImageFont.truetype(ARIAL_BOLD, font_size)
tw = d.textlength(word, font=font)
x, y = (W - tw) // 2, H - 230
d.text((x + 4, y + 6), word, font=font, fill=(0, 0, 0))
d.text((x, y), word, font=font, fill=(255, 149, 0))
im.save(OUT / "challengerdisaster_C.png")

print("built:", [str(OUT / f"challengerdisaster_{v}.png") for v in "ABC"])
