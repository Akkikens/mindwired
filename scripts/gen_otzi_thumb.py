#!/usr/bin/env python3
"""Ötzi thumbnails — real Commons/paper assets, House Style 2.0.

Path B (real-photo grade + minimal PIL overlay), no generation. Assets already
fetched into public/shorts/otzi/images/ (Commons CC BY/BY-SA + CC BY paper
figures — see ATTRIBUTION.md there). Concepts per ctr-engine Run A (memory
icahn-otzi):
  A — Kennis museum reconstruction full figure on crushed dark, ice-blue rim,
      zero text (reconstruction_2.jpg).
  B — the real flint dagger macro on black, one word "EVIDENCE"
      (artifacts_3.jpg).
  C — extreme close crop of the reconstruction's face, zero text
      (reconstruction_3.jpg).

Run: python3 scripts/gen_otzi_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "otzi" / "images"
OUT = REPO / "out" / "thumbs"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1920, 1080
ARIAL_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def grade(img, contrast=1.30, saturation=0.80, brightness=0.88, cool=0.12):
    img = ImageOps.fit(img.convert("RGB"), (W, H), method=Image.LANCZOS)
    img = ImageEnhance.Color(img).enhance(saturation)
    img = ImageEnhance.Contrast(img).enhance(contrast)
    img = ImageEnhance.Brightness(img).enhance(brightness)
    tint = Image.new("RGB", (W, H), (8, 24, 34))
    return Image.blend(img, tint, cool * 0.35)


def vignette(img, strength=0.6):
    mask = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(mask)
    max_r = math.hypot(W / 2, H / 2)
    for y in range(0, H, 4):
        for x in range(0, W, 4):
            r = math.hypot(x - W / 2, y - H / 2) / max_r
            v = max(0, 255 - int(255 * strength * (r ** 2.1)))
            d.rectangle([x, y, x + 4, y + 4], fill=v)
    mask = mask.filter(ImageFilter.GaussianBlur(30))
    black = Image.new("RGB", (W, H), (0, 0, 0))
    return Image.composite(img, black, mask)


def crush_and_focus(img, focal_box, dark=0.5):
    darker = ImageEnhance.Brightness(img).enhance(dark)
    darker = ImageEnhance.Contrast(darker).enhance(1.1)
    mask = Image.new("L", (W, H), 255)
    d = ImageDraw.Draw(mask)
    l, t, r, b = [int(v * s) for v, s in zip(focal_box, (W, H, W, H))]
    d.ellipse([l, t, r, b], fill=0)
    mask = mask.filter(ImageFilter.GaussianBlur(120))
    return Image.composite(darker, img, mask)


def fit_tall(img_path, focal_frac):
    """Fit a portrait source so the figure fills the frame height, centered on focal_frac x."""
    im = Image.open(img_path).convert("RGB")
    scale = H / im.height * 1.15
    im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
    cx = int(im.width * focal_frac)
    left = max(0, min(im.width - W, cx - W // 2))
    return im.crop((left, 0, left + W, H))


# ── A: reconstruction full figure, zero text ─────────────────────────────
a = fit_tall(SRC / "reconstruction_2.jpg", 0.46)
a = grade(a, contrast=1.35, brightness=0.92)
a = crush_and_focus(a, (0.30, 0.02, 0.72, 0.95), dark=0.42)
a = vignette(a, 0.65)
a.save(OUT / "otzi_A.png")

# ── B: real dagger macro + one word ──────────────────────────────────────
b = Image.open(SRC / "artifacts_3.jpg")
b = grade(b, contrast=1.4, saturation=0.9, brightness=0.95, cool=0.08)
b = crush_and_focus(b, (0.18, 0.05, 0.62, 0.95), dark=0.35)
b = vignette(b, 0.7)
d = ImageDraw.Draw(b)
font = ImageFont.truetype(ARIAL_BOLD, 118)
word = "EVIDENCE"
tw = d.textlength(word, font=font)
x, y = W - tw - 90, H - 210
d.text((x + 4, y + 6), word, font=font, fill=(0, 0, 0))
d.text((x, y), word, font=font, fill=(240, 244, 248))
b.save(OUT / "otzi_B.png")

# ── C: the face, extreme crop, zero text ─────────────────────────────────
c = fit_tall(SRC / "reconstruction_3.jpg", 0.5)
c = grade(c, contrast=1.32, saturation=0.85, brightness=0.9)
c = vignette(c, 0.72)
c.save(OUT / "otzi_C.png")

print("built:", [str(OUT / f"otzi_{v}.png") for v in "ABC"])
