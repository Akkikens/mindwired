#!/usr/bin/env python3
"""Thai Cave Rescue thumbnails — real DVIDS/Commons assets, House Style 2.0.

A — real frame of Staff Sgt. Michael Galindo's on-camera DVIDS interview —
    zero text, the real pararescueman IS the hook.
B — real "Wild Boars at the 2018 Summer Youth Olympics" photo — one word
    "SURVIVED".
C — real Craig Challen & Richard Harris portrait — one word "TRIAL" (ties to
    the differentiation hook: the federal case neither major film touches).

Run: python3 scripts/gen_thaicaverescue_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "thaicaverescue" / "images"
SCRATCH = Path("/private/tmp/claude-501/-Users-akshay-Documents-GitHub-mindwired/76641aeb-514e-4c51-8a9f-d5588fa3bb05/scratchpad")
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


def word_bottom_right(im, word, size=140):
    d = ImageDraw.Draw(im)
    font = ImageFont.truetype(ARIAL_BOLD, size)
    tw = d.textlength(word, font=font)
    x, y = W - tw - 90, H - 220
    d.text((x + 4, y + 6), word, font=font, fill=(0, 0, 0))
    d.text((x, y), word, font=font, fill=(235, 245, 250))
    return im


# ── A: Galindo, real DVIDS interview frame, zero text ────────────────────
im = Image.open(SCRATCH / "galindo_thumb_src.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.4, 0.4))
im = ImageEnhance.Contrast(im).enhance(1.3)
im = ImageEnhance.Brightness(im).enhance(1.05)
im = cool(vignette(im, 0.55), 0.1)
im.save(OUT / "thaicaverescue_A.png")

# ── B: real Wild Boars 2018 Youth Olympics photo, word "SURVIVED" ────────
im = Image.open(SRC / "ekkapol_2.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.55, 0.5))
im = ImageEnhance.Color(im).enhance(1.1)
im = ImageEnhance.Contrast(im).enhance(1.25)
im = vignette(im, 0.6)
im = word_bottom_right(im, "SURVIVED")
im.save(OUT / "thaicaverescue_B.png")

# ── C: real Challen & Harris diver portrait, word "TRIAL" ────────────────
im = Image.open(SRC / "caveinterior_4.jpg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.45, 0.4))
im = ImageEnhance.Contrast(im).enhance(1.3)
im = ImageEnhance.Brightness(im).enhance(1.08)
im = vignette(im, 0.6)
im = word_bottom_right(im, "TRIAL")
im.save(OUT / "thaicaverescue_C.png")

print("wrote", OUT / "thaicaverescue_A.png", OUT / "thaicaverescue_B.png", OUT / "thaicaverescue_C.png")
