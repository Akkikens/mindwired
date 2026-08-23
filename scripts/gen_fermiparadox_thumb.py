#!/usr/bin/env python3
"""Fermi Paradox thumbnails — real Commons/NASA assets, House Style 2.0.

A — real "Enrico Fermi at the blackboard" photo (Commons, PD) — zero text,
    the man mid-equation IS the hook.
B — real Gemini North observation of 3I/ATLAS (NOIRLab, CC BY 4.0) — one word
    "REAL", dark grade.
C — real K2-18b illustration (ESA/Hubble, CC BY 4.0) — one word "SIGNAL".

Run: python3 scripts/gen_fermiparadox_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "fermiparadox" / "images"
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
    return Image.blend(img, Image.new("RGB", (W, H), (6, 16, 26)), amt)


def word_bottom_right(im, word, size=130):
    d = ImageDraw.Draw(im)
    font = ImageFont.truetype(ARIAL_BOLD, size)
    tw = d.textlength(word, font=font)
    x, y = W - tw - 90, H - 210
    d.text((x + 4, y + 6), word, font=font, fill=(0, 0, 0))
    d.text((x, y), word, font=font, fill=(235, 245, 250))
    return im


# ── A: Fermi at the blackboard, zero text ────────────────────────────────
im = Image.open(SRC / "fermiblackboard_2.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.45, 0.35))
im = ImageEnhance.Contrast(im).enhance(1.35)
im = ImageEnhance.Brightness(im).enhance(1.05)
im = cool(vignette(im, 0.55), 0.12)
im.save(OUT / "fermiparadox_A.png")

# ── B: real 3I/ATLAS (Gemini North), word "REAL" ─────────────────────────
im = Image.open(SRC / "atlasstill_1.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.5))
im = ImageEnhance.Color(im).enhance(1.15)
im = ImageEnhance.Contrast(im).enhance(1.4)
im = ImageEnhance.Brightness(im).enhance(0.95)
im = vignette(im, 0.65)
im = word_bottom_right(im, "REAL")
im.save(OUT / "fermiparadox_B.png")

# ── C: real K2-18b illustration (ESA/Hubble), word "SIGNAL" ─────────────
im = Image.open(SRC / "k218b_3.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.45))
im = ImageEnhance.Color(im).enhance(1.2)
im = ImageEnhance.Contrast(im).enhance(1.3)
im = vignette(im, 0.6)
im = word_bottom_right(im, "SIGNAL")
im.save(OUT / "fermiparadox_C.png")

print("wrote", OUT / "fermiparadox_A.png", OUT / "fermiparadox_B.png", OUT / "fermiparadox_C.png")
