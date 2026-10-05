#!/usr/bin/env python3
"""Thai Cave Rescue thumbnails — real DVIDS/Commons assets, House Style 2.0.

Pairs with the title "The Thai Cave Rescue That Shouldn't Have Worked":
the title asks the question, the thumbnail names the method (synergy rule,
CLAUDE.md 2026-08-25 — never restate a word the title already uses).

A — real Tham Luang dive-prep photo (Capt. Jessica Tait / 353rd SOG, PD),
    cropped tight on the actual full-face masks + regulators the boys were
    carried out in — one word "SEDATED".
B — real frame of Staff Sgt. Michael Galindo's on-camera DVIDS interview —
    zero text, the real pararescueman IS the hook.
C — the real Tham Luang cave mouth (Commons, CC BY) — zero text, the
    location alone as the hook.

Every source lives in the repo; the Galindo still is re-extracted from the
committed DVIDS clip at run time (the previous version of this script read a
session scratchpad that no longer exists, which made it unrunnable).

Run: python3 scripts/gen_thaicaverescue_thumb.py
"""
import math
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "thaicaverescue" / "images"
VID = REPO / "public" / "shorts" / "thaicaverescue" / "video"
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


def galindo_still():
    """Pull the interview frame straight from the committed DVIDS clip."""
    tmp = Path(tempfile.mkdtemp()) / "galindo.png"
    subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", "8", "-i", str(VID / "galindo_3.mp4"),
         "-frames:v", "1", str(tmp), "-y"],
        check=True,
    )
    return Image.open(tmp).convert("RGB")


# ── A: real dive-prep photo, cropped to the full-face masks, word "SEDATED" ──
im = Image.open(SRC / "caveinterior_1.jpg").convert("RGB")
# the gear table occupies the lower-left third of the 5168x3448 original
im = im.crop((300, 2120, 2260, 3220))
im = ImageOps.fit(im, (W, H), Image.LANCZOS)
im = ImageEnhance.Contrast(im).enhance(1.5)
im = ImageEnhance.Brightness(im).enhance(0.92)
im = ImageEnhance.Color(im).enhance(0.75)
im = cool(vignette(im, 0.85), 0.22)
im = word_bottom_right(im, "SEDATED")
im.save(OUT / "thaicaverescue_A.png")

# ── B: Galindo, real DVIDS interview frame, zero text ────────────────────
im = galindo_still()
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.4, 0.4))
im = ImageEnhance.Contrast(im).enhance(1.3)
im = ImageEnhance.Brightness(im).enhance(1.05)
im = cool(vignette(im, 0.55), 0.1)
im.save(OUT / "thaicaverescue_B.png")

# ── C: the real Tham Luang cave mouth, zero text ─────────────────────────
im = Image.open(SRC / "cavemap_1.jpeg").convert("RGB")
im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.45))
im = ImageEnhance.Contrast(im).enhance(1.4)
im = ImageEnhance.Color(im).enhance(0.8)
im = ImageEnhance.Brightness(im).enhance(0.9)
im = cool(vignette(im, 0.85), 0.2)
im.save(OUT / "thaicaverescue_C.png")

print("wrote", OUT / "thaicaverescue_A.png", OUT / "thaicaverescue_B.png", OUT / "thaicaverescue_C.png")
