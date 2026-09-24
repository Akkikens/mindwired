#!/usr/bin/env python3
"""Jeju Air 2216 thumbnails — real Commons assets, House Style 2.0.

A — the real fuselage crumpled against the localizer berm, concrete slab visible
    on top (frame 2650s of the CC BY 3.0 crash-site video by 자연). Zero text.
    Pairs with "The Concrete That Was Supposed to Break". Primary.
B — the real tail fin standing past the berm + "SURVIVABLE" — the government
    simulation's finding, a fact the title does not give away (synergy rule).
C — the real CVR of HL8088 (MOLIT, KOGL Type 1) on black + "4:07", the
    minutes both recorders are missing. Channel-native black-box hook.

Run: python3 scripts/gen_jeju2216_thumb.py
"""
import math, subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
EV = REPO / "public/shorts/_evidence/jeju2216/commons"
VID = EV / "Jeju_Air_flight_2216_Muan_Int_l_Airport_29_December_2024.webm"
OUT = REPO / "out/thumbs"; OUT.mkdir(parents=True, exist_ok=True)
W, H = 1920, 1080
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
ACCENT = (255, 149, 0)  # Black Box theme accent


def frame(t):
    p = OUT / f"_jeju_{t}.png"
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(t), "-i", str(VID),
                    "-frames:v", "1", "-vf", "crop=2560:1120:0:0", str(p)], check=True)
    im = Image.open(p).convert("RGB"); p.unlink(); return im


def vignette(img, strength):
    mask = Image.new("L", (W, H), 0); d = ImageDraw.Draw(mask); mr = math.hypot(W / 2, H / 2)
    for y in range(0, H, 4):
        for x in range(0, W, 4):
            r = math.hypot(x - W / 2, y - H / 2) / mr
            d.rectangle([x, y, x + 4, y + 4], fill=max(0, 255 - int(255 * strength * r ** 2.1)))
    return Image.composite(img, Image.new("RGB", (W, H)), mask.filter(ImageFilter.GaussianBlur(30)))


def grade(im, color=0.7, contrast=1.3, bright=0.85):
    im = ImageEnhance.Color(im).enhance(color)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    return ImageEnhance.Brightness(im).enhance(bright)


def word(im, text, y_frac=0.80, size=150):
    d = ImageDraw.Draw(im); f = ImageFont.truetype(FONT, size)
    tw = d.textlength(text, font=f); x, y = (W - tw) // 2, int(H * y_frac)
    d.text((x + 5, y + 7), text, font=f, fill=(0, 0, 0)); d.text((x, y), text, font=f, fill=ACCENT)
    return im


# A — fuselage against the concrete-topped berm; crop left of the ambulance
im = frame(2650).crop((0, 40, 1830, 1069))
im = vignette(grade(ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.5))), 0.55)
im.save(OUT / "jeju2216_A.png")

# B — tail fin over the wreck, tight on the fin; one word
im = frame(790).crop((900, 0, 2560, 934))
im = vignette(grade(ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.35)), bright=0.8), 0.6)
darken = Image.new("L", (W, H), 0); dd = ImageDraw.Draw(darken)
for y in range(H):
    dd.line([(0, y), (W, y)], fill=int(215 * max(0, (y / H - 0.5) / 0.5)))
im = Image.composite(Image.new("RGB", (W, H)), im, darken)
word(im, "SURVIVABLE", y_frac=0.82, size=118).save(OUT / "jeju2216_B.png")

# C — the real CVR, isolated on black; "4:07"
cvr = Image.open(EV / "CVR_of_Jeju_Air_Flight_2216_aircraft_01.png").convert("RGB")
cvr = grade(cvr, color=1.05, contrast=1.2, bright=0.95)
cvr = ImageOps.contain(cvr, (int(W * 0.78), int(H * 0.72)), Image.LANCZOS)
im = Image.new("RGB", (W, H), (6, 7, 9))
mask = Image.new("L", cvr.size, 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, *cvr.size], 40, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(28))
im.paste(cvr, ((W - cvr.width) // 2, int(H * 0.06)), mask)
im = vignette(im, 0.5)
word(im, "4:07", y_frac=0.78, size=190).save(OUT / "jeju2216_C.png")

print("built:", [str(OUT / f"jeju2216_{v}.png") for v in "ABC"])
