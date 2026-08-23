#!/usr/bin/env python3
"""Bermuda Triangle thumbnails — real Commons/NARA assets, House Style 2.0.

A — real TBM Avenger flying low, alone, over open ocean (frame cut from the
    verified NPC-8530 Yorktown reel used in the doc's cold open) — zero text,
    the loneliness of the shot IS the hook.
B — real TBM Avenger formation photo (Fort Lauderdale, 1943, NARA) — one word
    "MYTH", dark grade.
C — the real 1945 Navy Navigation Problem map — one word "PROOF", dark grade.

Run: python3 scripts/gen_bermudatriangle_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "bermudatriangle" / "images"
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


def word_bottom_right(im, word, size=120):
    d = ImageDraw.Draw(im)
    font = ImageFont.truetype(ARIAL_BOLD, size)
    tw = d.textlength(word, font=font)
    x, y = W - tw - 90, H - 200
    d.text((x + 4, y + 6), word, font=font, fill=(0, 0, 0))
    d.text((x, y), word, font=font, fill=(235, 245, 250))
    return im


# ── A: lone Avenger over open ocean, zero text ───────────────────────────
im = Image.open(SRC / "thumb_deck4_frame.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.55, 0.55))
im = ImageEnhance.Color(im).enhance(0.55)
im = ImageEnhance.Contrast(im).enhance(1.5)
im = ImageEnhance.Brightness(im).enhance(0.9)
im = cool(vignette(im, 0.7), 0.18)
im.save(OUT / "bermudatriangle_A.png")

# ── B: real TBF Avenger formation, Fort Lauderdale 1943 + MYTH ──────────
im = Image.open(SRC / "ftlauderdale_1.jpg").convert("RGB")
w, h = im.size
box = (0, int(h * 0.10), w, int(h * 0.75))
im = im.crop(box)
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.4))
im = ImageEnhance.Color(im).enhance(0.7)
im = ImageEnhance.Contrast(im).enhance(1.35)
im = ImageEnhance.Brightness(im).enhance(0.95)
darker = ImageEnhance.Brightness(im).enhance(0.4)
mask = Image.new("L", (W, H), 255)
d = ImageDraw.Draw(mask)
d.rectangle([0, int(H * 0.62), W, H], fill=0)
mask = mask.filter(ImageFilter.GaussianBlur(120))
im = Image.composite(darker, im, mask)
im = cool(vignette(im, 0.6), 0.12)
im = word_bottom_right(im, "MYTH")
im.save(OUT / "bermudatriangle_B.png")

# ── C: the real 1945 Navy Navigation Problem map + PROOF ─────────────────
im = Image.open(SRC / "navmap_1.jpg").convert("RGB")
w, h = im.size
box = (int(w * 0.05), int(h * 0.15), int(w * 0.95), int(h * 0.85))
im = im.crop(box)
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.5))
im = ImageEnhance.Color(im).enhance(0.75)
im = ImageEnhance.Contrast(im).enhance(1.25)
im = ImageEnhance.Brightness(im).enhance(0.92)
darker = ImageEnhance.Brightness(im).enhance(0.42)
mask = Image.new("L", (W, H), 255)
d = ImageDraw.Draw(mask)
d.rectangle([0, int(H * 0.62), W, H], fill=0)
mask = mask.filter(ImageFilter.GaussianBlur(120))
im = Image.composite(darker, im, mask)
im = cool(vignette(im, 0.55), 0.10)
im = word_bottom_right(im, "PROOF")
im.save(OUT / "bermudatriangle_C.png")

print("built:", [str(OUT / f"bermudatriangle_{v}.png") for v in "ABC"])
