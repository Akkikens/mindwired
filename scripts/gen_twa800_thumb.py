#!/usr/bin/env python3
"""TWA Flight 800 thumbnails — real NTSB/FOIA assets, House Style 2.0.

A — the real Calverton/Ashburn wreckage-reconstruction photo, dark grade,
    zero text. Primary: matches the locked ctr-engine concept.
B — the real 2026 Judicial Watch FOIA-released FBI teletype page, dark
    grade, one word "BURIED".
C — the real accident aircraft (N93119) photo, dark grade, zero text.

Run: python3 scripts/gen_twa800_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "twa800" / "images"
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


def cool(img, amt):
    return Image.blend(img, Image.new("RGB", (W, H), (8, 14, 24)), amt)


# ── A: real wreckage-reconstruction photo, zero text ─────────────────────
im = Image.open(SRC / "reconstruction_2.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.42))
im = ImageEnhance.Color(im).enhance(0.55)
im = ImageEnhance.Contrast(im).enhance(1.35)
im = ImageEnhance.Brightness(im).enhance(0.85)
im = vignette(cool(im, 0.08), 0.6)
im.save(OUT / "twa800_A.png")

# ── B: real 2026 FOIA-released FBI teletype page + "BURIED" ──────────────
im = Image.open(SRC / "foiadoc_1.jpg").convert("RGB")
# portrait document — crop tight on the upper-middle third (the "CAIRO
# claiming credit" paragraph) rather than fitting the whole page
iw, ih = im.size
crop_h = int(iw * H / W)
top = int(ih * 0.30)
im = im.crop((0, top, iw, min(ih, top + crop_h)))
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.4))
im = ImageEnhance.Color(im).enhance(0.3)
im = ImageEnhance.Contrast(im).enhance(1.15)
im = ImageEnhance.Brightness(im).enhance(1.05)
darker = ImageEnhance.Brightness(im).enhance(0.3)
mask = Image.new("L", (W, H), 255)
d = ImageDraw.Draw(mask)
d.ellipse([int(W * 0.20), int(-H * 0.1), int(W * 0.80), int(H * 1.0)], fill=0)
mask = mask.filter(ImageFilter.GaussianBlur(160))
im = Image.composite(darker, im, mask)
im = vignette(im, 0.6)
d = ImageDraw.Draw(im)
font = ImageFont.truetype(ARIAL_BOLD, 130)
word = "BURIED"
tw = d.textlength(word, font=font)
x, y = (W - tw) // 2, H - 210
d.text((x + 4, y + 6), word, font=font, fill=(0, 0, 0))
d.text((x, y), word, font=font, fill=(255, 149, 0))
im.save(OUT / "twa800_B.png")

# ── C: real accident aircraft (N93119), zero text ────────────────────────
im = Image.open(SRC / "n93119_1.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.45))
im = ImageEnhance.Color(im).enhance(0.7)
im = ImageEnhance.Contrast(im).enhance(1.3)
im = ImageEnhance.Brightness(im).enhance(0.9)
im = vignette(warm(im, 0.05), 0.55)
im.save(OUT / "twa800_C.png")

print("built:", [str(OUT / f"twa800_{v}.png") for v in "ABC"])
