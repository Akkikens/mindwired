#!/usr/bin/env python3
"""Venera thumbnails — real Commons assets, House Style 2.0.

A — real Venera 13 color panorama, cropped tight on the lens-cap "disk"
    (the anomaly hook), zero text (v13pano_1.jpg — CC BY/PD Commons).
B — real cutaway lander model, dark grade, one word "EVIDENCE"
    (cutaway_1.jpg — PD, Commons).
C — museum lander replica close crop, zero text (museum_1.jpg — CC BY-SA).

Run: python3 scripts/gen_venera_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "venera" / "images"
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
    return Image.blend(img, Image.new("RGB", (W, H), (8, 20, 30)), amt)


# ── A: real V13 panorama, cropped on the lens-cap "disk" ────────────────
im = Image.open(SRC / "v13pano_1.jpg").convert("RGB")
w, h = im.size
# panorama strip; the lens cap sits left-of-center in the frame
box = (int(w * 0.28), 0, int(w * 0.68), h)
im = im.crop(box)
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.55))
im = ImageEnhance.Color(im).enhance(1.15)
im = ImageEnhance.Contrast(im).enhance(1.35)
im = ImageEnhance.Brightness(im).enhance(1.05)
im = vignette(im, 0.6)
im.save(OUT / "venera_A.png")

# ── B: real Venera lander replica + EVIDENCE ─────────────────────────────
im = Image.open(SRC / "museum_2.jpg").convert("RGB")
w, h = im.size
box = (int(w * 0.05), int(h * 0.05), int(w * 0.85), int(h * 0.95))
im = im.crop(box)
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.35))
im = ImageEnhance.Color(im).enhance(0.85)
im = ImageEnhance.Contrast(im).enhance(1.4)
im = ImageEnhance.Brightness(im).enhance(0.82)
darker = ImageEnhance.Brightness(im).enhance(0.35)
mask = Image.new("L", (W, H), 255)
d = ImageDraw.Draw(mask)
d.ellipse([int(W * 0.24), int(-H * 0.05), int(W * 0.80), int(H * 1.05)], fill=0)
mask = mask.filter(ImageFilter.GaussianBlur(150))
im = Image.composite(darker, im, mask)
im = cool(vignette(im, 0.65), 0.08)
d = ImageDraw.Draw(im)
font = ImageFont.truetype(ARIAL_BOLD, 120)
word = "EVIDENCE"
tw = d.textlength(word, font=font)
x, y = W - tw - 90, H - 200
d.text((x + 4, y + 6), word, font=font, fill=(0, 0, 0))
d.text((x, y), word, font=font, fill=(235, 245, 250))
im.save(OUT / "venera_B.png")

# ── C: museum replica lander, zero text ──────────────────────────────────
im = Image.open(SRC / "museum_1.jpg").convert("RGB")
w, h = im.size
box = (int(w * 0.08), int(h * 0.05), int(w * 0.85), int(h * 0.95))
im = im.crop(box)
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.4))
im = ImageEnhance.Color(im).enhance(0.9)
im = ImageEnhance.Contrast(im).enhance(1.3)
im = ImageEnhance.Brightness(im).enhance(0.88)
im = cool(vignette(im, 0.62), 0.07)
im.save(OUT / "venera_C.png")

print("built:", [str(OUT / f"venera_{v}.png") for v in "ABC"])
