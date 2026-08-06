#!/usr/bin/env python3
"""Build the 3 thumbnail variants for the SpaceX lunar-impact mindwired
episode, from the real footage/photos it's built on.

House Style 2.0: zero text or ONE word <=10 chars, one focal element
separated from a dark background by BRIGHTNESS, the real archival asset as
the subject. No generation, no faces.

  A: the real Ranger 9 zoom-mosaic frame (the actual 1965 camera feed seconds
     before impact) — zero text
  B: the real 2022 double-crater LROC photo, same treatment as the Criminal
     Record exhibit crops — zero text
  C: A + the one word "AGAIN" (5 chars)

Usage: python3 scripts/gen_spacexlunarimpact_thumb.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "out/thumbs"
W, H = 1280, 720
ACCENT = (77, 216, 255)  # mindwired #4DD8FF
FONTS = ["/System/Library/Fonts/Supplemental/Impact.ttf",
         "/Library/Fonts/Arial Black.ttf",
         "/System/Library/Fonts/HelveticaNeue.ttc"]


def font(size: int) -> ImageFont.FreeTypeFont:
    for f in FONTS:
        if Path(f).exists():
            try:
                return ImageFont.truetype(f, size)
            except OSError:
                continue
    return ImageFont.load_default()


def backdrop() -> Image.Image:
    bg = Image.new("RGB", (W, H), (3, 5, 10))
    d = ImageDraw.Draw(bg)
    for y in range(H):
        v = int(3 + 14 * (y / H) ** 2)
        d.line([(0, y), (W, y)], fill=(v, int(v * 1.1), int(v * 1.4)))
    return bg


def vignette(im: Image.Image, strength: float = 0.45) -> Image.Image:
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([-int(W * .3), -int(H * .45),
                                  int(W * 1.3), int(H * 1.45)], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(150))
    return Image.composite(im, Image.blend(im, Image.new("RGB", (W, H)), strength), mask)


def build_a() -> Image.Image:
    """Real Ranger 9 camera-mosaic frame, seconds before impact (1965)."""
    import subprocess
    tmp = OUT / "_ranger_src.png"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", "72", "-i",
                    str(REPO / "public/shorts/spacexlunarimpact/video/ranger9_impact.mp4"),
                    "-frames:v", "1", str(tmp)], check=True)
    src = Image.open(tmp).convert("RGB")
    src = ImageEnhance.Contrast(src).enhance(1.35)
    src = ImageEnhance.Brightness(src).enhance(1.1)
    sw, sh = src.size
    scale = max(W / sw, H / sh) * 1.05
    src = src.resize((int(sw * scale), int(sh * scale)), Image.LANCZOS)
    left, top = (src.width - W) // 2, (src.height - H) // 2
    im = src.crop((left, top, left + W, top + H))
    tmp.unlink(missing_ok=True)
    return vignette(im, 0.30)


def build_b() -> Image.Image:
    """Real 2022 double-crater LROC photo, dark-graded, glowing."""
    src = Image.open(REPO / "public/shorts/spacexlunarimpact/images/crater2022_1.png").convert("RGB")
    sw, sh = src.size
    crop = src.crop((int(0.30 * sw), int(0.28 * sh), int(0.72 * sw), int(0.70 * sh)))
    crop = ImageEnhance.Brightness(crop).enhance(0.75)
    crop = ImageEnhance.Contrast(crop).enhance(1.4)
    scale = max(W / crop.width, H / crop.height) * 1.08
    crop = crop.resize((int(crop.width * scale), int(crop.height * scale)), Image.LANCZOS)
    left, top = (crop.width - W) // 2, (crop.height - H) // 2
    im = crop.crop((left, top, left + W, top + H))
    # cool the tone slightly toward the accent
    r, g, b = im.split()
    im = Image.merge("RGB", (r.point(lambda v: int(v * 0.94)), g,
                             b.point(lambda v: min(255, int(v * 1.08)))))
    return vignette(im, 0.35)


def word_variant(base: Image.Image, word: str) -> Image.Image:
    im = base.copy()
    d = ImageDraw.Draw(im)
    f = font(140)
    box = d.textbbox((0, 0), word, font=f)
    tw, th = box[2] - box[0], box[3] - box[1]
    x, y = int(W * 0.06), int(H * 0.72)
    for ox, oy in ((-3, 3), (3, 3), (0, 5)):
        d.text((x + ox, y + oy), word, font=f, fill=(0, 0, 0))
    d.text((x, y), word, font=f, fill=(255, 255, 255))
    d.line([(x + 4, y + th + 22), (x + tw, y + th + 22)], fill=ACCENT, width=9)
    return im


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    a = build_a()
    a.save(OUT / "spacexlunarimpact_A.png")
    build_b().save(OUT / "spacexlunarimpact_B.png")
    word_variant(a, "AGAIN").save(OUT / "spacexlunarimpact_C.png")
    for v in "ABC":
        p = OUT / f"spacexlunarimpact_{v}.png"
        print(f"{p.relative_to(REPO)}  {Image.open(p).size}")


if __name__ == "__main__":
    main()
