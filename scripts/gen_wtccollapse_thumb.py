#!/usr/bin/env python3
"""Build the 3 Building 7 thumbnail variants from REAL public-domain assets.

House Style 2.0 (docs/guides/THUMBNAILS.md): zero text, or ONE word <=10 chars;
one focal element separated from a dark background by BRIGHTNESS; the real
archival asset IS the differentiator. No generation, no faces, no invented
imagery — everything here is a NIST or FEMA federal document/simulation.

  A  out/thumbs/wtccollapse_A.png  NIST's own LS-DYNA WTC-7 collapse model,
                                   inverted to glow on black. Zero text.
                                   (source frame keeps NIST's own "LSDYNA Model
                                   of WTC-7" label — honest, not presented as
                                   real footage, matching the video's own
                                   "NIST COMPUTER SIMULATION" convention)
  B  out/thumbs/wtccollapse_B.png  FEMA 403 ch.5 WTC7 framing diagram, dark
                                   blueprint treatment, the real annotated
                                   "kink/fault" line re-inked in Black Box
                                   orange as the single bright element.
  C  out/thumbs/wtccollapse_C.png  = A + the one word "NO PLANE" (8 chars).
                                   This is the text-vs-no-text arm of Test &
                                   Compare; log which wins on watch-time share.

Usage: python3 scripts/gen_wtccollapse_thumb.py
"""
from pathlib import Path
import subprocess

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
IMGS = REPO / "public/shorts/wtccollapse/images"
VIDS = REPO / "public/shorts/wtccollapse/video"
OUT = REPO / "out/thumbs"
W, H = 1280, 720
ORANGE = (255, 149, 0)
FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Impact.ttf",
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "/Library/Fonts/Arial Black.ttf",
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for p in FONT_CANDIDATES:
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                continue
    return ImageFont.load_default()


def sim_frame() -> Image.Image:
    """NIST LS-DYNA WTC-7 model at the visibly-deforming stage (t=7s of the
    real NIST simulation clip). Extracted with ffmpeg — no generative step."""
    tmp = OUT / "_sim_src.png"
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-ss", "7", "-i",
         str(VIDS / "collapse_sim_wtc7_1.mp4"), "-frames:v", "1", str(tmp)],
        check=True)
    return Image.open(tmp).convert("RGB")


def canvas() -> Image.Image:
    """Near-black backdrop with a faint warm floor glow (channel look)."""
    bg = Image.new("RGB", (W, H), (6, 8, 12))
    d = ImageDraw.Draw(bg)
    for y in range(H):
        t = y / H
        v = int(6 + 16 * (t ** 3))
        d.line([(0, y), (W, y)], fill=(v, int(v * 0.92), int(v * 0.8)))
    return bg


def vignette(im: Image.Image, strength: float = 0.62) -> Image.Image:
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([-int(W * 0.28), -int(H * 0.42),
                                  int(W * 1.28), int(H * 1.42)], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(150))
    dark = Image.new("RGB", (W, H), (0, 0, 0))
    return Image.composite(im, Image.blend(im, dark, strength), mask)


def build_a() -> Image.Image:
    src = sim_frame()
    # crop to the structure itself (drop NIST's white margins + axis triad,
    # keep the model label strip at top for honest provenance)
    w, h = src.size
    src = src.crop((int(w * 0.30), 0, int(w * 0.80), int(h * 0.97)))
    # white-paper figure -> glowing wireframe on black
    inv = ImageOps.invert(src)
    inv = ImageEnhance.Contrast(inv).enhance(1.55)
    inv = ImageEnhance.Brightness(inv).enhance(1.22)
    # warm the highlights slightly toward the channel accent
    r, g, b = inv.split()
    inv = Image.merge("RGB", (r, g.point(lambda v: int(v * 0.94)),
                              b.point(lambda v: int(v * 0.82))))
    # scale the structure to sit in the right ~55% with breathing room, so the
    # left stays as negative space (and so variant C's word has somewhere to go)
    target_h = int(H * 0.94)
    scale = target_h / inv.height
    inv = inv.resize((int(inv.width * scale), target_h), Image.LANCZOS)
    x, y = int(W * 0.46), int((H - target_h) / 2)
    # luminance mask: the wireframe is what's bright, the paper black -> the
    # mask is what keeps the paste from stamping a visible rectangle
    lum = inv.convert("L").point(lambda v: min(255, int(v * 1.9)))
    im = canvas()
    glow = inv.filter(ImageFilter.GaussianBlur(18))
    im.paste(glow, (x, y), mask=lum.filter(
        ImageFilter.GaussianBlur(20)).point(lambda v: int(v * 0.55)))
    im.paste(inv, (x, y), mask=lum)
    return vignette(im, 0.5)


def build_b() -> Image.Image:
    """FEMA 403's WTC7 north-elevation framing panel as a single glowing
    blueprint tower on black. The full col79 sheet was tried first and
    rejected: every crop of it lands on a wall of callout labels that turns to
    mush at 170px (verified on a squint sheet). One elevation panel, cropped
    above its captions, is the shape that survives."""
    src = Image.open(IMGS / "tubeframe_diagram_1.jpg").convert("RGB")
    w, h = src.size
    # panel A ("North Elevation"), stopping above its caption text
    src = src.crop((int(w * 0.015), int(h * 0.008), int(w * 0.275), int(h * 0.375)))
    dark = ImageOps.invert(src).convert("L")
    dark = ImageEnhance.Contrast(dark).enhance(1.5)
    blue = Image.merge("RGB", (
        dark.point(lambda v: int(v * 0.62)),
        dark.point(lambda v: int(v * 0.80)),
        dark.point(lambda v: min(255, int(v * 1.0)))))
    target_h = int(H * 0.92)
    scale = target_h / blue.height
    blue = blue.resize((int(blue.width * scale), target_h), Image.LANCZOS)
    lum = blue.convert("L").point(lambda v: min(255, int(v * 2.0)))
    im = canvas()
    x, y = int(W * 0.52), int((H - target_h) / 2)
    im.paste(blue.filter(ImageFilter.GaussianBlur(16)), (x, y),
             mask=lum.filter(ImageFilter.GaussianBlur(18)).point(lambda v: int(v * 0.6)))
    im.paste(blue, (x, y), mask=lum)
    # NO synthetic annotation here. An earlier pass drew an orange "fault line"
    # over this elevation: FEMA's real kink/fault annotation belongs to the
    # col79 sheet, and its position on THIS drawing would have been invented —
    # a fabricated marking on a real federal document, on the channel's most
    # sensitivity-critical episode. The glowing frame alone carries the
    # brightness separation House Style 2.0 asks for.
    im = Image.blend(im, im.filter(ImageFilter.GaussianBlur(11)), 0.16)
    return vignette(im, 0.46)


def _build_b_col79_rejected() -> Image.Image:
    src = Image.open(IMGS / "col79_diagram_1.jpg").convert("RGB")
    # isolate the real annotated red "kink/fault" line before darkening
    px = src.load()
    red = Image.new("L", src.size, 0)
    rp = red.load()
    for y in range(src.height):
        for x in range(src.width):
            r, g, b = px[x, y]
            if r > 120 and r - g > 55 and r - b > 55:
                rp[x, y] = 255
    red = red.filter(ImageFilter.MaxFilter(3))
    # blueprint treatment: invert to dark, cool it down
    dark = ImageOps.invert(src).convert("L")
    dark = ImageEnhance.Contrast(dark).enhance(1.35)
    blue = Image.merge("RGB", (
        dark.point(lambda v: int(v * 0.52)),
        dark.point(lambda v: int(v * 0.72)),
        dark.point(lambda v: min(255, int(v * 1.0)))))
    # re-ink the real annotation in Black Box orange = the one bright element
    blue.paste(Image.new("RGB", src.size, ORANGE), mask=red)
    glow = blue.filter(ImageFilter.GaussianBlur(9))
    blue = Image.blend(blue, glow, 0.28)
    # squint test: the full diagram is a wall of callout labels that turns to
    # mush at 170px. Crop hard around the annotated fault line so ONE bright
    # vertical stroke on dark blueprint is the whole image.
    bw, bh = blue.size
    crop = blue.crop((int(bw * 0.46), int(bh * 0.02), bw, int(bh * 0.90)))
    scale = max(W / crop.width, H / crop.height) * 1.34
    crop = crop.resize((int(crop.width * scale), int(crop.height * scale)),
                       Image.LANCZOS)
    left = int((crop.width - W) * 0.30)
    top = int((crop.height - H) / 2)
    return vignette(crop.crop((left, top, left + W, top + H)), 0.46)


def build_c(base: Image.Image) -> Image.Image:
    """A + one word. 8 chars, does not repeat any title word."""
    im = base.copy()
    d = ImageDraw.Draw(im)
    word = "NO PLANE"
    font = load_font(132)
    box = d.textbbox((0, 0), word, font=font)
    tw, th = box[2] - box[0], box[3] - box[1]
    x, y = int(W * 0.055), int(H * 0.40)
    # shadow plate so the word survives any underlying value
    for ox, oy in ((-3, 3), (3, 3), (0, 5)):
        d.text((x + ox, y + oy), word, font=font, fill=(0, 0, 0))
    d.text((x, y), word, font=font, fill=(255, 255, 255))
    d.line([(x + 4, y + th + 34), (x + tw, y + th + 34)], fill=ORANGE, width=9)
    return im


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    a = build_a()
    a.save(OUT / "wtccollapse_A.png")
    build_b().save(OUT / "wtccollapse_B.png")
    build_c(a).save(OUT / "wtccollapse_C.png")
    (OUT / "_sim_src.png").unlink(missing_ok=True)
    for n in "ABC":
        p = OUT / f"wtccollapse_{n}.png"
        print(f"{p.relative_to(REPO)}  {Image.open(p).size}")


if __name__ == "__main__":
    main()
