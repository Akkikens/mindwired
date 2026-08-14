#!/usr/bin/env python3
"""Costa Concordia thumbnails — real Commons/verified photos, House Style 2.0.

Run: .venv-agent/bin/python scripts/gen_costaconcordia_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "costaconcordia" / "images"
OUT = REPO / "out" / "thumbs"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1920, 1080
ARIAL_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def grade(img, contrast=1.28, saturation=0.82, brightness=0.90, teal=0.10):
    img = ImageOps.fit(img.convert("RGB"), (W, H), method=Image.LANCZOS)
    img = ImageEnhance.Color(img).enhance(saturation)
    img = ImageEnhance.Contrast(img).enhance(contrast)
    img = ImageEnhance.Brightness(img).enhance(brightness)
    tint = Image.new("RGB", (W, H), (10, 22, 30))
    img = Image.blend(img, tint, teal * 0.35)
    return img


def vignette(img, strength=0.55):
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


def crush_and_focus(img, focal_box, darken=0.55):
    darker = ImageEnhance.Brightness(img).enhance(darken)
    darker = ImageEnhance.Contrast(darker).enhance(1.1)
    mask = Image.new("L", (W, H), 255)
    d = ImageDraw.Draw(mask)
    l, t, r, b = [int(v * s) for v, s in zip(focal_box, (W, H, W, H))]
    d.ellipse([l, t, r, b], fill=0)
    mask = mask.filter(ImageFilter.GaussianBlur(120))
    return Image.composite(darker, img, mask)


def stamp(img, word, box, angle=-8, color=(210, 40, 35, 255), size=92):
    pw, ph = 640, 190
    stamp_layer = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    d = ImageDraw.Draw(stamp_layer)
    d.rectangle([8, 8, pw - 8, ph - 8], outline=color, width=10)
    font = ImageFont.truetype(ARIAL_BOLD, size)
    bbox = d.textbbox((0, 0), word, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((pw - tw) / 2 - bbox[0], (ph - th) / 2 - bbox[1]), word, font=font, fill=color)
    stamp_layer = stamp_layer.rotate(angle, expand=True, resample=Image.BICUBIC)
    base = img.convert("RGBA")
    base.alpha_composite(stamp_layer, dest=box)
    return base.convert("RGB")


# --- A: the capsized ship itself, real 2013 parbuckling-era photo — zero text ---
a = Image.open(SRC / "salvage_parbuckle.jpg")
a = grade(a, contrast=1.32, saturation=0.75, brightness=0.85, teal=0.16)
a = crush_and_focus(a, (0.20, 0.15, 0.85, 0.85), darken=0.62)
a = vignette(a, strength=0.55)
a.save(OUT / "costaconcordia_A.png")
print("wrote", OUT / "costaconcordia_A.png")

# --- B: the grounded ship near Giglio + a red case-file stamp — the differentiator ---
b = Image.open(SRC / "wreck_3.jpg")
b = grade(b, contrast=1.25, saturation=0.70, brightness=0.88, teal=0.12)
b = vignette(b, strength=0.50)
b = stamp(b, "DAMMIT", box=(1080, 720), angle=-9, size=80)
b.save(OUT / "costaconcordia_B.png")
print("wrote", OUT / "costaconcordia_B.png")

# --- C: the real ship before the disaster, dark cinematic grade — zero text ---
c = Image.open(SRC / "ship_genoa.jpg")
c = grade(c, contrast=1.30, saturation=0.78, brightness=0.80, teal=0.18)
c = crush_and_focus(c, (0.15, 0.10, 0.90, 0.90), darken=0.55)
c = vignette(c, strength=0.58)
c.save(OUT / "costaconcordia_C.png")
print("wrote", OUT / "costaconcordia_C.png")
