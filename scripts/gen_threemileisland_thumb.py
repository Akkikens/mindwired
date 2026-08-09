#!/usr/bin/env python3
"""Three Mile Island thumbnails — House Style 2.0: real archival photo, dark
cinematic grade, one bright focal highlight, zero/minimal text. No AI keyart —
we have a strong real asset (the actual TMI aerial photo), so grade it directly.
Run: python3 scripts/gen_threemileisland_thumb.py
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageDraw, ImageFont, ImageFilter

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public/shorts/threemileisland/images/tmi_unit1_1.jpg"
OUT = REPO / "out/thumbs"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1280, 720


def base_grade(crop_box):
    im = Image.open(SRC).convert("RGB")
    im = im.crop(crop_box).resize((W, H), Image.LANCZOS)
    # dark cinematic grade: desaturate slightly, darken, cool tint, vignette
    im = ImageEnhance.Color(im).enhance(0.55)
    im = ImageEnhance.Contrast(im).enhance(1.25)
    im = ImageEnhance.Brightness(im).enhance(0.55)
    # cool blue tint overlay
    tint = Image.new("RGB", im.size, (10, 25, 45))
    im = Image.blend(im, tint, 0.22)
    # vignette
    vignette = Image.new("L", im.size, 0)
    vd = ImageDraw.Draw(vignette)
    vd.ellipse([-W * 0.25, -H * 0.35, W * 1.25, H * 1.35], fill=255)
    vignette = vignette.filter(ImageFilter.GaussianBlur(120))
    black = Image.new("RGB", im.size, (0, 0, 0))
    im = Image.composite(im, black, vignette)
    return im


def add_word(im, word):
    im = im.copy()
    draw = ImageDraw.Draw(im)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 88)
    except Exception:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), word, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x, y = 70, H - th - 90
    # subtle dark backing for legibility
    draw.rectangle([x - 20, y - 15, x + tw + 20, y + th + 25], fill=(0, 0, 0, 140))
    draw.text((x, y), word, font=font, fill=(255, 160, 40))
    return im


# Variant A: no text, tight crop on the cooling towers (170px squint test: one bold silhouette)
a = base_grade((0, 400, 2592, 2288))
a.save(OUT / "threemileisland_A.png")

# Variant B: same crop, single word "REOPENED"
b = add_word(base_grade((0, 400, 2592, 2288)), "REOPENED")
b.save(OUT / "threemileisland_B.png")

# Variant C: wider crop showing the full plant + towers, single word "RESTARTED"
c = add_word(base_grade((0, 0, 2592, 2488)), "RESTARTED")
c.save(OUT / "threemileisland_C.png")

print("wrote:", OUT / "threemileisland_A.png", OUT / "threemileisland_B.png", OUT / "threemileisland_C.png")
