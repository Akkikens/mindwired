#!/usr/bin/env python3
"""Carla Walker thumbnails — real assets, House Style 2.0.

A — McCurley's real 2020 booking photo (CBS News/Tarrant County Jail),
    dark-crushed grade, zero text.
B — the real mugshot again, tighter crop, one word "CLEARED" (the hook).
C — real Tarrant County Courthouse (Commons, generic Fort Worth judicial
    architecture — not claimed as the specific trial building), dark grade,
    zero text.

Run: python3 scripts/gen_carlawalker_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "carlawalker" / "images"
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
    return Image.blend(img, Image.new("RGB", (W, H), (6, 18, 30)), amt)


# ── A: booking photo, zero text ──────────────────────────────────────────
im = Image.open(SRC / "mugshot_1.jpg").convert("RGB")
w0, h0 = im.size
im = im.crop((int(w0 * 0.25), 0, int(w0 * 0.74), h0))  # drop CBS's blue chyron border
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.4))
im = ImageEnhance.Color(im).enhance(0.75)
im = ImageEnhance.Contrast(im).enhance(1.35)
im = ImageEnhance.Brightness(im).enhance(0.85)
im = cool(vignette(im, 0.62), 0.1)
im.save(OUT / "carlawalker_A.png")

# ── B: booking photo, tight crop + "CLEARED" ─────────────────────────────
im = Image.open(SRC / "mugshot_1.jpg").convert("RGB")
w, h = im.size
im = im.crop((int(w * 0.27), 0, int(w * 0.70), h))  # drop CBS's blue chyron border
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.35))
im = ImageEnhance.Color(im).enhance(0.7)
im = ImageEnhance.Contrast(im).enhance(1.4)
im = ImageEnhance.Brightness(im).enhance(0.78)
darker = ImageEnhance.Brightness(im).enhance(0.4)
mask = Image.new("L", (W, H), 255)
d = ImageDraw.Draw(mask)
d.ellipse([int(W * 0.26), int(-H * 0.05), int(W * 0.76), int(H * 1.05)], fill=0)
mask = mask.filter(ImageFilter.GaussianBlur(150))
im = Image.composite(darker, im, mask)
im = cool(vignette(im, 0.66), 0.1)
d = ImageDraw.Draw(im)
font = ImageFont.truetype(ARIAL_BOLD, 130)
word = "CLEARED"
tw = d.textlength(word, font=font)
x, y = W - tw - 90, H - 210
d.text((x + 4, y + 6), word, font=font, fill=(0, 0, 0))
d.text((x, y), word, font=font, fill=(235, 245, 250))
im.save(OUT / "carlawalker_B.png")

# ── C: courthouse, zero text ──────────────────────────────────────────────
im = Image.open(SRC / "courthouse_3.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.4))
im = ImageEnhance.Color(im).enhance(0.85)
im = ImageEnhance.Contrast(im).enhance(1.25)
im = ImageEnhance.Brightness(im).enhance(0.82)
im = cool(vignette(im, 0.6), 0.12)
im.save(OUT / "carlawalker_C.png")

print("built:", [str(OUT / f"carlawalker_{v}.png") for v in "ABC"])
