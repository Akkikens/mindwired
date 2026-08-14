#!/usr/bin/env python3
"""Everest-bodies thumbnails — real Commons archival photos, House Style 2.0.

Path B (real-photo grade + minimal PIL overlay), no generation. Sources already
fetched via fetch_footage.py into public/shorts/everestbodies/images/ (Commons,
CC-BY/BY-SA/PD — see ATTRIBUTION.md).

Run: .venv-agent/bin/python scripts/gen_everestbodies_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "everestbodies" / "images"
OUT = REPO / "out" / "thumbs"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1920, 1080
ARIAL_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def grade(img, contrast=1.28, saturation=0.82, brightness=0.90, teal=0.10):
    img = ImageOps.fit(img.convert("RGB"), (W, H), method=Image.LANCZOS)
    img = ImageEnhance.Color(img).enhance(saturation)
    img = ImageEnhance.Contrast(img).enhance(contrast)
    img = ImageEnhance.Brightness(img).enhance(brightness)
    # teal-shadow tint: blend a dark teal layer in at low opacity, screen-ish via multiply on a soft mask
    tint = Image.new("RGB", (W, H), (10, 28, 30))
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


def crush_and_focus(img, focal_box):
    """Darken everything outside focal_box (l, t, r, b) fractional coords, keep focal area bright."""
    darker = ImageEnhance.Brightness(img).enhance(0.55)
    darker = ImageEnhance.Contrast(darker).enhance(1.1)
    mask = Image.new("L", (W, H), 255)
    d = ImageDraw.Draw(mask)
    l, t, r, b = [int(v * s) for v, s in zip(focal_box, (W, H, W, H))]
    d.ellipse([l, t, r, b], fill=0)
    mask = mask.filter(ImageFilter.GaussianBlur(120))
    return Image.composite(darker, img, mask)


def add_word(img, word, pos, size=110, fill=(240, 240, 235), stroke=(0, 0, 0), stroke_w=6, angle=0):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    font = ImageFont.truetype(ARIAL_BOLD, size)
    if angle:
        txt_layer = Image.new("RGBA", (900, 260), (0, 0, 0, 0))
        td = ImageDraw.Draw(txt_layer)
        td.text((10, 10), word, font=font, fill=fill, stroke_width=stroke_w, stroke_fill=stroke)
        txt_layer = txt_layer.rotate(angle, expand=True, resample=Image.BICUBIC)
        layer.paste(txt_layer, pos, txt_layer)
    else:
        d.text(pos, word, font=font, fill=fill, stroke_width=stroke_w, stroke_fill=stroke)
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")


def stamp(img, word, box, angle=-8):
    """Case-file rubber-stamp: bordered rect + bold word, rotated, red-on-transparent."""
    pw, ph = 620, 190
    stamp_layer = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    d = ImageDraw.Draw(stamp_layer)
    red = (210, 40, 35, 255)
    d.rectangle([8, 8, pw - 8, ph - 8], outline=red, width=10)
    font = ImageFont.truetype(ARIAL_BOLD, 92)
    bbox = d.textbbox((0, 0), word, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((pw - tw) / 2 - bbox[0], (ph - th) / 2 - bbox[1]), word, font=font, fill=red)
    stamp_layer = stamp_layer.rotate(angle, expand=True, resample=Image.BICUBIC)
    base = img.convert("RGBA")
    base.alpha_composite(stamp_layer, dest=box)
    return base.convert("RGB")


# --- A: lone climber against the dark icefall — zero text, pure real-photo dread ---
a = Image.open(SRC / "expedition_1.jpg")
a = grade(a, contrast=1.35, saturation=0.72, brightness=0.82, teal=0.18)
a = crush_and_focus(a, (0.30, 0.30, 0.72, 0.95))  # keep the climber figure bright
a = vignette(a, strength=0.60)
a.save(OUT / "everestbodies_A.png")
print("wrote", OUT / "everestbodies_A.png")

# --- B: 1920s archival reconnaissance photo + case-file "WRONG" stamp — the differentiator ---
b = Image.open(SRC / "expedition_6.jpg")
b = grade(b, contrast=1.20, saturation=0.55, brightness=0.88, teal=0.05)
b = vignette(b, strength=0.50)
b = stamp(b, "WRONG", box=(1180, 700), angle=-10)
b.save(OUT / "everestbodies_B.png")
print("wrote", OUT / "everestbodies_B.png")

# --- C: the dark summit itself, dramatic and towering — zero text, pure icon shot ---
c = Image.open(SRC / "everest_3.jpg")
c = grade(c, contrast=1.30, saturation=0.75, brightness=0.85, teal=0.14)
c = crush_and_focus(c, (0.28, 0.05, 0.85, 0.65))
c = vignette(c, strength=0.55)
c.save(OUT / "everestbodies_C.png")
print("wrote", OUT / "everestbodies_C.png")
