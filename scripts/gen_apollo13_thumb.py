#!/usr/bin/env python3
"""Apollo 13 thumbnails — real NASA/JSC + Commons assets, House Style 2.0.

A — real Mission Control frame (from the manually-cut MOCR footage) — zero
    text, the real 1970 room IS the hook.
B — real splashdown frame (parachutes + capsule + recovery ship, from the
    real 1970 live recovery broadcast) — one word "SURVIVED".
C — real Jim Lovell portrait — one word "WRONG" (ties to the differentiation
    hook: everyone thinks they know this story; almost none of it is right).

Run: python3 scripts/gen_apollo13_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "apollo13" / "images"
SCRATCH = Path("/private/tmp/claude-501/-Users-akshay-Documents-GitHub-mindwired/76641aeb-514e-4c51-8a9f-d5588fa3bb05/scratchpad/apollo13_thumb_src")
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


def word_bottom_right(im, word, size=150):
    d = ImageDraw.Draw(im)
    font = ImageFont.truetype(ARIAL_BOLD, size)
    tw = d.textlength(word, font=font)
    x, y = W - tw - 90, H - 230
    d.text((x + 4, y + 6), word, font=font, fill=(0, 0, 0))
    d.text((x, y), word, font=font, fill=(235, 245, 250))
    return im


# ── A: real Mission Control frame, zero text ─────────────────────────────
im = Image.open(SCRATCH / "mocr2.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.45, 0.45))
im = ImageEnhance.Contrast(im).enhance(1.3)
im = ImageEnhance.Brightness(im).enhance(1.1)
im = cool(vignette(im, 0.55), 0.12)
im.save(OUT / "apollo13_A.png")

# ── B: real recovery helicopter over the ocean, "SURVIVED" ───────────────
im = Image.open(SCRATCH / "splashdown_final.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.3))
im = ImageEnhance.Color(im).enhance(1.15)
im = ImageEnhance.Contrast(im).enhance(1.3)
im = vignette(im, 0.5)
im = word_bottom_right(im, "SURVIVED")
im.save(OUT / "apollo13_B.png")

# ── C: real Fred Haise, cropped tight from the group photo, "LAST" ───────
im = Image.open(SRC / "haise_1.jpg").convert("RGB")
im = im.crop((900, 220, 1650, 1200))  # tight box around Haise (center figure)
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.25))
im = ImageEnhance.Contrast(im).enhance(1.25)
im = ImageEnhance.Brightness(im).enhance(1.05)
im = vignette(im, 0.6)
im = word_bottom_right(im, "LAST")
im.save(OUT / "apollo13_C.png")

print("wrote", OUT / "apollo13_A.png", OUT / "apollo13_B.png", OUT / "apollo13_C.png")
