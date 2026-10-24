#!/usr/bin/env python3
"""American Airlines 587 thumbnails — real NTSB/FAA assets, House Style 2.0.

A — the real vertical stabilizer hanging from the Army Corps crane over Jamaica
    Bay (fin_1, NTSB PD). Tight crop on the fin + red "A", everything else
    graded dark so the fin is the only bright element. Zero text. Primary.
B — the real Triborough toll-plaza security-camera frame (toll_2, TBTA via
    NTSB, PD). Low-res, so it is graded near-black and ONE drawn bright circle
    around the falling aircraft is the frame's only bright element. Zero text.
C — the real Belle Harbor ground scene, NTSB investigators on the fuselage
    (site_1, FAA PD) + "62 DAYS" in accent #FF9500 — a fact the title
    ("New York Thought It Was 9/11 Again. It Wasn't") doesn't spell out:
    the crash came 62 days after 9/11 (synergy, not repetition).

All sources are upscaled to 1920x1080 with Lanczos.
Run: python3 scripts/gen_american587_thumb.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "public" / "shorts" / "american587" / "images"
OUT = REPO / "assets" / "thumbs"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1920, 1080
ACCENT = (255, 149, 0)  # Black Box #FF9500
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
    return Image.blend(img, Image.new("RGB", (W, H), (8, 14, 24)), amt)


def spotlight(img, box, dark, blur):
    """Keep `box` (ellipse) at full grade, push everything else to `dark`."""
    darker = ImageEnhance.Brightness(img).enhance(dark)
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse(box, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(blur))
    return Image.composite(img, darker, mask)


def crop_up(name, box):
    """Crop a source region (16:9) and Lanczos-upscale it to 1920x1080."""
    im = Image.open(SRC / name).convert("RGB").crop(box)
    return im.resize((W, H), Image.LANCZOS)


# ── A: the fin on the crane over Jamaica Bay, zero text ────────────────────
# fin spans ~x330-900, y240-500 in the 1229x777 source; 16:9 crop around it.
im = crop_up("fin_1.jpg", (200, 140, 1000, 590))
im = ImageEnhance.Color(im).enhance(0.85)
im = ImageEnhance.Contrast(im).enhance(1.25)
im = spotlight(im, [int(W * 0.08), int(H * 0.12), int(W * 0.98), int(H * 0.88)], 0.22, 120)
im = vignette(cool(im, 0.06), 0.6)
im.save(OUT / "american587_A.png")

# ── B: toll-plaza camera frame + ONE bright circle around the aircraft ─────
# toll_2 is 460x292; the falling aircraft (bright streak) sits ~(258,95) next to
# NTSB's own faint annotation ring at ~(283,110). Our circle encloses both.
SW, SH = 460, 259  # 16:9 crop of the 460-wide frame
im = crop_up("toll_2.jpg", (0, 10, SW, 10 + SH))
im = im.filter(ImageFilter.GaussianBlur(1.6))  # soften the 4x upscale blocking
im = ImageOps.grayscale(im).convert("RGB")
im = ImageEnhance.Contrast(im).enhance(1.15)
im = ImageEnhance.Brightness(im).enhance(0.36)
sx, sy = W / SW, H / SH
cx, cy, r = 268 * sx, (102 - 10) * sy, 34 * sx
# lift only the aircraft streak (~258,95 src) so it reads inside our circle;
# NTSB's own annotation ring stays at the dark grade (not painted out)
lit = ImageEnhance.Brightness(im).enhance(2.4)
ax, ay, ar = 257 * sx, (95 - 10) * sy, 11 * sx
m = Image.new("L", (W, H), 0)
ImageDraw.Draw(m).ellipse([ax - ar, ay - ar, ax + ar, ay + ar], fill=255)
im = Image.composite(lit, im, m.filter(ImageFilter.GaussianBlur(25)))
im = vignette(cool(im, 0.10), 0.7)
glow = Image.new("RGB", (W, H), (0, 0, 0))
g = ImageDraw.Draw(glow)
g.ellipse([cx - r, cy - r, cx + r, cy + r], outline=ACCENT, width=34)
glow = glow.filter(ImageFilter.GaussianBlur(22))
im = Image.blend(im, Image.composite(glow, im, glow.convert("L")), 0.85)
ImageDraw.Draw(im).ellipse([cx - r, cy - r, cx + r, cy + r], outline=ACCENT, width=14)
im.save(OUT / "american587_B.png")

# ── C: Belle Harbor ground scene + "62 DAYS" ──────────────────────────────
# investigators on the fuselage ~x350-1150, y280-900 of the 1627x1210 source.
im = crop_up("site_1.jpg", (120, 170, 1500, 946))
im = ImageEnhance.Color(im).enhance(0.6)
im = ImageEnhance.Contrast(im).enhance(1.2)
im = ImageEnhance.Brightness(im).enhance(0.8)
im = spotlight(im, [int(W * 0.12), int(H * 0.05), int(W * 0.80), int(H * 0.85)], 0.35, 150)
im = vignette(cool(im, 0.08), 0.65)
d = ImageDraw.Draw(im)
word = "62 DAYS"
font_size = 150
font = ImageFont.truetype(ARIAL_BOLD, font_size)
while d.textlength(word, font=font) > W * 0.36:
    font_size -= 4
    font = ImageFont.truetype(ARIAL_BOLD, font_size)
tw = d.textlength(word, font=font)
x, y = W - tw - 110, H - 250
d.text((x + 5, y + 7), word, font=font, fill=(0, 0, 0))
d.text((x, y), word, font=font, fill=ACCENT)
im.save(OUT / "american587_C.png")

print("built:", [str(OUT / f"american587_{v}.png") for v in "ABC"])
