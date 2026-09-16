#!/usr/bin/env python3
"""Build the three Run A thumbnail variants for 911conspiracyaudit.

House Style 2.0 (docs/guides/THUMBNAILS.md): zero text or ONE word <=10 chars,
one focal element separated from a dark background by BRIGHTNESS, and a REAL
archival asset as the subject. No generated imagery, no faces, no CGI.

Assets (all US federal works, public domain):
  A  EPA Office of Inspector General, Report No. 2003-P-00012, "EPA's Response
     to the World Trade Center Collapse", 21 Aug 2003, PDF page 5 — the finding
     that EPA "did not have sufficient data and analyses to make such a blanket
     statement" and that the White House CEQ "convinced EPA to add reassuring
     statements and delete cautionary ones".
  B  FEMA photo 3989, Michael Rieger, 20 Sep 2001, New York (Commons, PD).
  C  FEMA photo 5399, Andrea Booher, 28 Sep 2001, New York (Commons, PD).
     (4238, the aerial plume, was built and rejected on the 170px squint test.)

Run from the repo root:  python3 scripts/gen_911conspiracyaudit_thumb.py
(uses the Homebrew python3 that has Pillow; /usr/bin/python3 has httpx but no PIL)
"""
import subprocess
from pathlib import Path

from PIL import (Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont,
                 ImageOps)

SRC = Path("out/thumbs/_src")
OUT = Path("out/thumbs")
W, H = 1920, 1080
ACCENT = (255, 149, 0)  # Black Box Breakdown accent


def _fit(im: Image.Image, w: int = W, h: int = H) -> Image.Image:
    """Cover-crop to exactly w x h."""
    im = im.convert("RGB")
    s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    return im.crop(((im.width - w) // 2, (im.height - h) // 2,
                    (im.width - w) // 2 + w, (im.height - h) // 2 + h))


def _vignette(im: Image.Image, strength: float = 0.85) -> Image.Image:
    """Darken the edges so the frame's peak brightness sits on the subject."""
    mask = Image.new("L", (im.width, im.height), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse([-im.width * 0.35, -im.height * 0.45,
               im.width * 1.35, im.height * 1.45], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(im.width // 12))
    dark = ImageEnhance.Brightness(im).enhance(1 - strength)
    return Image.composite(im, dark, mask)


def _font(size: int):
    for p in ("/System/Library/Fonts/Supplemental/Arial Bold.ttf",
              "/System/Library/Fonts/Helvetica.ttc"):
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                pass
    return ImageFont.load_default()


def variant_a() -> None:
    """The document. The damning line, inverted to glow on black.

    A full sentence can never be READ at 170px, so this is built to survive as a
    SHAPE: one bright horizontal bar of text on a black field. The words are
    fully legible at the sizes YouTube actually serves on home/desktop.
    Crop is driven by the pdftotext -bbox coordinates of the finding line
    (page 5, y 480-491pt): "...did not have sufficient data and analyses to
    make such a blanket statement."
    """
    png = SRC / "epa_ig_p5.png"
    if not png.exists():
        subprocess.run(["pdftoppm", "-f", "5", "-l", "5", "-r", "300", "-png",
                        str(SRC / "epa_ig.pdf"), str(SRC / "epa_ig_p5")],
                       check=True)
        cand = sorted(SRC.glob("epa_ig_p5*.png"))
        if cand and cand[0] != png:
            cand[0].rename(png)

    page = Image.open(png).convert("L")
    dpi = 300 / 72.0  # pdftoppm -r 300; bbox coords are in points
    # Crop to the verbatim fragment "did not have sufficient data" (word bboxes
    # from pdftotext -bbox: x 207.4 -> 338.3, y 480.2 -> 491.0). The whole
    # sentence at 88% width renders type too small to register at 170px; this
    # fragment is 3.4x larger and is still an exact quote, not a paraphrase.
    box = (int(204 * dpi), int(477 * dpi), int(341 * dpi), int(494 * dpi))
    line = page.crop(box)

    # paper -> black, ink -> bright. Autocontrast first so the scan's grey
    # paper clamps to true black instead of staying muddy.
    line = ImageOps.autocontrast(line, cutoff=1)
    line = ImageOps.invert(line)

    im = Image.new("RGB", (W, H), (8, 8, 9))
    tw = int(W * 0.88)
    th = max(1, round(line.height * (tw / line.width)))
    line = line.resize((tw, th), Image.LANCZOS)

    # tint the glowing ink with the channel accent
    tinted = ImageOps.colorize(line, black=(8, 8, 9), white=ACCENT)
    glow = tinted.filter(ImageFilter.GaussianBlur(9))
    x, y = (W - tw) // 2, (H - th) // 2
    im.paste(Image.blend(Image.new("RGB", (tw, th), (8, 8, 9)), glow, 0.9),
             (x, y))
    im.paste(tinted, (x, y), line)
    im = _vignette(im, 0.45)
    im.save(OUT / "911conspiracyaudit_A.png")


def variant_b() -> None:
    """The people who were told it was safe. One word: SAFE."""
    im = _fit(Image.open(SRC / "fema_3989.jpg"))
    im = ImageEnhance.Color(im).enhance(0.75)
    im = ImageEnhance.Contrast(im).enhance(1.15)
    im = _vignette(im, 0.8)

    d = ImageDraw.Draw(im)
    f = _font(190)
    word = "SAFE"
    bb = d.textbbox((0, 0), word, font=f)
    x, y = int(W * 0.06), int(H * 0.70)
    # soft shadow so it holds on a busy plate
    for dx, dy in ((6, 6), (4, 4)):
        d.text((x + dx, y + dy), word, font=f, fill=(0, 0, 0))
    d.text((x, y), word, font=f, fill=ACCENT)
    im.save(OUT / "911conspiracyaudit_B.png")


def variant_c() -> None:
    """Ground Zero under a dark sky. Zero text.

    fema_4238 (the aerial plume) was built first and rejected on the squint
    test - at 170px it is grey cityscape mush with no focal element. 5399 has
    real brightness separation: lit debris and workers against a near-black sky.
    """
    im = _fit(Image.open(SRC / "fema_5399.jpg"))
    im = ImageEnhance.Color(im).enhance(0.8)
    im = ImageEnhance.Contrast(im).enhance(1.3)
    im = _vignette(im, 0.9)
    im.save(OUT / "911conspiracyaudit_C.png")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    variant_a()
    variant_b()
    variant_c()
    for p in sorted(OUT.glob("911conspiracyaudit_*.png")):
        print(p, Image.open(p).size)
