#!/usr/bin/env python3
"""Build the 3 thumbnail variants for each Criminal Record episode, from the
real court records the episodes are built on.

House Style 2.0: zero text or ONE word <=10 chars, one focal element separated
from a dark background by BRIGHTNESS, the real archival asset as the subject.
No generation, no faces, no crime-scene material.

  idahomurders  A: affidavit p.3, the cited sheath/DNA line glowing — REDACTED
                   bars over the clinical line (the same bars the episode uses;
                   a thumbnail is not an excuse to drop them)
                B: the 11:58 timeline as a stark graphic, zero text
                C: A + "NO MOTIVE"
  dahmer        A: opinion p.3, the "released Sinthasomphone, who was a minor,
                   into Dahmer's care" line glowing, zero text
                B: the 60-workdays / 60-calendar-days split, zero text
                C: A + "REINSTATED"

Usage: python3 scripts/gen_criminalrecord_thumbs.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "out/thumbs"
W, H = 1280, 720
ACCENT = (127, 180, 255)          # #7FB4FF
FONTS = ["/System/Library/Fonts/Supplemental/Impact.ttf",
         "/Library/Fonts/Arial Black.ttf",
         "/System/Library/Fonts/HelveticaNeue.ttc"]

# page-fraction rectangles measured out of the PDFs themselves
IDAHO = {
    "page": REPO / "public/shorts/idahomurders/images/ex_affidavit_sheath_1.png",
    "highlight": (0.13, 0.652, 0.74, 0.068),
    "redact": [(0.10, 0.520, 0.80, 0.040), (0.10, 0.110, 0.80, 0.030)],
    "word": "NO MOTIVE",
}
DAHMER = {
    "page": REPO / "public/shorts/dahmer/images/ex_release_1.png",
    "highlight": (0.10, 0.674, 0.80, 0.024),
    "redact": [],
    "word": "REINSTATED",
}


def font(size: int) -> ImageFont.FreeTypeFont:
    for f in FONTS:
        if Path(f).exists():
            try:
                return ImageFont.truetype(f, size)
            except OSError:
                continue
    return ImageFont.load_default()


def backdrop() -> Image.Image:
    bg = Image.new("RGB", (W, H), (5, 8, 15))
    d = ImageDraw.Draw(bg)
    for y in range(H):
        v = int(5 + 22 * (y / H) ** 2)
        d.line([(0, y), (W, y)], fill=(v, int(v * 1.05), int(v * 1.35)))
    return bg


def vignette(im: Image.Image, strength: float = 0.5) -> Image.Image:
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([-int(W * .3), -int(H * .45),
                                  int(W * 1.3), int(H * 1.45)], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(150))
    return Image.composite(im, Image.blend(im, Image.new("RGB", (W, H)), strength), mask)


def page_variant(spec: dict) -> Image.Image:
    """The document itself, dark-graded, with the cited line as the one bright
    element — and every redaction the episode applies, still applied."""
    src = Image.open(spec["page"]).convert("RGB")
    pw, ph = src.size
    d = ImageDraw.Draw(src)
    for (rx, ry, rw, rh) in spec["redact"]:
        d.rectangle([rx * pw, ry * ph, (rx + rw) * pw, (ry + rh) * ph],
                    fill=(10, 12, 16))
    hx, hy, hw, hh = spec["highlight"]
    # crop a band around the cited line so the type is large at 170px
    pad_y = hh * 3.1
    top = max(0.0, hy - pad_y)
    bot = min(1.0, hy + hh + pad_y * 0.75)
    crop = src.crop((int(0.06 * pw), int(top * ph), int(0.97 * pw), int(bot * ph)))
    # dark "document on a lit desk" grade
    crop = ImageEnhance.Brightness(crop).enhance(0.52)
    crop = ImageEnhance.Contrast(crop).enhance(1.5)
    scale = W / crop.width
    crop = crop.resize((W, max(1, int(crop.height * scale))), Image.LANCZOS)

    im = backdrop()
    y = int((H - crop.height) / 2)
    im.paste(crop, (0, y))
    # the cited line, glowing
    band_top = y + int((hy - top) * ph * scale)
    band_h = max(10, int(hh * ph * scale))
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    ImageDraw.Draw(glow).rectangle([0, band_top - 6, W, band_top + band_h + 6],
                                   fill=(30, 52, 92))
    im = Image.blend(im, Image.blend(im, glow, 0.55).filter(ImageFilter.GaussianBlur(26)), 0.55)
    im.paste(crop.crop((0, max(0, band_top - y - 4), W,
                        min(crop.height, band_top - y + band_h + 4))),
             (0, band_top - 4))
    d2 = ImageDraw.Draw(im)
    d2.rectangle([6, band_top - 5, W - 6, band_top + band_h + 5],
                 outline=ACCENT, width=5)
    return vignette(im, 0.42)


def word_variant(base: Image.Image, word: str) -> Image.Image:
    im = base.copy()
    d = ImageDraw.Draw(im)
    f = font(118 if len(word) <= 9 else 100)
    box = d.textbbox((0, 0), word, font=f)
    tw, th = box[2] - box[0], box[3] - box[1]
    x, y = int(W * 0.05), int(H * 0.09)
    plate = Image.new("RGB", (W, H), (0, 0, 0))
    ImageDraw.Draw(plate).rectangle([x - 26, y - 18, x + tw + 30, y + th + 34], fill=(4, 6, 11))
    im = Image.blend(im, plate, 0.0)
    for ox, oy in ((-3, 3), (3, 3), (0, 5)):
        d.text((x + ox, y + oy), word, font=f, fill=(0, 0, 0))
    d.text((x, y), word, font=f, fill=(255, 255, 255))
    d.line([(x + 4, y + th + 26), (x + tw, y + th + 26)], fill=ACCENT, width=9)
    return im


def timeline_variant(marks: list[tuple[str, str]], title: str) -> Image.Image:
    """The episode's own timeline device, as a text-free graphic."""
    im = backdrop()
    d = ImageDraw.Draw(im)
    d.text((W // 2, 74), title.upper(), font=font(30), fill=ACCENT, anchor="mm")
    y = int(H * 0.56)
    x0, x1 = int(W * 0.11), int(W * 0.89)
    d.line([(x0, y), (x1, y)], fill=(60, 78, 108), width=6)
    for i, (at, label) in enumerate(marks):
        t = i / max(1, len(marks) - 1)
        mx = int(x0 + (x1 - x0) * t)
        last = i == len(marks) - 1
        if last:
            d.line([(x0, y), (mx, y)], fill=ACCENT, width=8)
        r = 15 if last else 11
        d.ellipse([mx - r, y - r, mx + r, y + r],
                  fill=ACCENT if last else (11, 21, 38), outline=ACCENT, width=5)
        up = i % 2 == 0
        d.text((mx, y - 74 if up else y + 76), at, font=font(58 if last else 46),
               fill=ACCENT if last else (255, 255, 255), anchor="mm")
        d.text((mx, y - 28 if up else y + 128), label, font=font(26),
               fill=(200, 216, 240), anchor="mm")
    return vignette(im, 0.36)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    a = page_variant(IDAHO)
    a.save(OUT / "idahomurders_A.png")
    timeline_variant([("4:00 a.m.", "sounds upstairs"), ("11:58 a.m.", "911 is called")],
                     "November 13, 2022").save(OUT / "idahomurders_B.png")
    word_variant(a, IDAHO["word"]).save(OUT / "idahomurders_C.png")

    b = page_variant(DAHMER)
    b.save(OUT / "dahmer_A.png")
    timeline_variant([("60 workdays", "how it was applied"),
                      ("60 calendar days", "what the court ordered")],
                     "What the appeal was about").save(OUT / "dahmer_B.png")
    word_variant(b, DAHMER["word"]).save(OUT / "dahmer_C.png")

    for n in ("idahomurders", "dahmer"):
        for v in "ABC":
            p = OUT / f"{n}_{v}.png"
            print(f"{p.relative_to(REPO)}  {Image.open(p).size}")


if __name__ == "__main__":
    main()
