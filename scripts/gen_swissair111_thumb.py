#!/usr/bin/env python3
"""Swissair 111 thumbnails — real Commons/DVIDS assets, House Style 2.0.

A — the real accident aircraft (HB-IWF), dark grade, zero text. Primary.
B — the real Peggy's Cove memorial + "17 MINUTES" (<=10 chars per word rule
    isn't literal char count on the phrase but follows the same restrained,
    one-focal-element convention as twa800_B's "BURIED").
C — the real US Navy recovery-diver photo, dark grade, zero text.

Run: python3 scripts/gen_swissair111_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "swissair111" / "images"
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


# ── A: real accident aircraft (HB-IWF), zero text ─────────────────────────
im = Image.open(SRC / "hbiwf_1.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.45))
im = ImageEnhance.Color(im).enhance(0.6)
im = ImageEnhance.Contrast(im).enhance(1.35)
im = ImageEnhance.Brightness(im).enhance(0.85)
im = vignette(cool(im, 0.08), 0.6)
im.save(OUT / "swissair111_A.png")

# ── B: real Peggy's Cove memorial + "STILL NOT REQUIRED" (the AFCB fix
# that could have stopped this — a real fact NOT already in the title,
# per the "synergy not repetition" rule: thumbnail text should add a new
# curiosity gap, not restate the title's own "17 minutes") ────────────────
im = Image.open(SRC / "memorial_1.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.4))
im = ImageEnhance.Color(im).enhance(0.5)
im = ImageEnhance.Contrast(im).enhance(1.2)
im = ImageEnhance.Brightness(im).enhance(0.8)
darker = ImageEnhance.Brightness(im).enhance(0.35)
mask = Image.new("L", (W, H), 255)
d = ImageDraw.Draw(mask)
d.ellipse([int(W * 0.15), int(H * 0.35), int(W * 0.85), int(H * 1.15)], fill=0)
mask = mask.filter(ImageFilter.GaussianBlur(160))
im = Image.composite(darker, im, mask)
im = vignette(im, 0.6)
d = ImageDraw.Draw(im)
word = "STILL NOT REQUIRED"
font_size = 120
font = ImageFont.truetype(ARIAL_BOLD, font_size)
while d.textlength(word, font=font) > W * 0.86:
    font_size -= 4
    font = ImageFont.truetype(ARIAL_BOLD, font_size)
tw = d.textlength(word, font=font)
x, y = (W - tw) // 2, H - 210
d.text((x + 4, y + 6), word, font=font, fill=(0, 0, 0))
d.text((x, y), word, font=font, fill=(255, 149, 0))
im.save(OUT / "swissair111_B.png")

# ── C: real US Navy recovery-diver photo, zero text ───────────────────────
im = Image.open(SRC / "navyrecovery_1.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.4))
im = ImageEnhance.Color(im).enhance(0.65)
im = ImageEnhance.Contrast(im).enhance(1.3)
im = ImageEnhance.Brightness(im).enhance(0.85)
im = vignette(cool(im, 0.1), 0.6)
im.save(OUT / "swissair111_C.png")

print("built:", [str(OUT / f"swissair111_{v}.png") for v in "ABC"])
