#!/usr/bin/env python3
"""Sketch-brand THUMBNAIL composer (2026-07-20) — CTR is the viral lever and the
illustrated look is the brand's unfair advantage in a feed of AI-render thumbs:
handwritten title + ink illustration + the mascot reacting.

Follows docs/guides/THUMBNAILS.md house style (3-5 word title, one dramatic
scene, dark background) in the sketch dialect: chalky handwriting on dark
paper (or --paper light for the in-video look).

  .venv-lipsync/bin/python scripts/gen_sketch_thumb.py \
      --slug sketchdemo \
      --illustration public/shorts/sketchdemo/images/krakatoa_1.png \
      --mascot shocked \
      --text "THE LOUDEST|SOUND EVER" --accent-line 1

Output: out/thumbs/<slug>_sketch.png (1280x720). Generate 2-3 variants
(different mascot pose / accent line) and A/B them.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

REPO = Path(__file__).resolve().parent.parent
FONT = REPO / "assets" / "fonts" / "Caveat.ttf"

PAPERS = {
    "dark":  {"bg": (16, 20, 24), "ink": (245, 242, 233), "vign": 90},
    "light": {"bg": (244, 240, 230), "ink": (28, 26, 23), "vign": 40},
}
ACCENT = (77, 216, 255)  # mindwired cyan


def paper_bg(w: int, h: int, spec: dict) -> Image.Image:
    im = Image.new("RGB", (w, h), spec["bg"])
    # grain: coarse noise, softened — reads as paper tooth even at feed size
    import random
    rnd = random.Random(7)
    noise = Image.new("L", (w // 3, h // 3))
    noise.putdata([rnd.randint(108, 148) for _ in range((w // 3) * (h // 3))])
    noise = noise.resize((w, h)).filter(ImageFilter.GaussianBlur(0.6))
    im = Image.composite(
        ImageEnhance.Brightness(im).enhance(1.12), im, noise.point(lambda v: (v - 108) * 2))
    # vignette
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse((-w * 0.25, -h * 0.35, w * 1.25, h * 1.35), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(120))
    dark = ImageEnhance.Brightness(im).enhance(1 - spec["vign"] / 255)
    return Image.composite(im, dark, mask)


def fit(im: Image.Image, box: tuple[int, int]) -> Image.Image:
    im = im.copy()
    im.thumbnail(box, Image.LANCZOS)
    return im


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--illustration", type=Path, required=True,
                    help="white->alpha'd scene illustration png")
    ap.add_argument("--mascot", default="shocked",
                    help="pose name (public/mascot/) or a png path")
    ap.add_argument("--text", required=True, help="title lines separated by |, 3-5 words total")
    ap.add_argument("--accent-line", type=int, default=-1,
                    help="0-based line rendered in the accent color (default: last)")
    ap.add_argument("--paper", default="dark", choices=sorted(PAPERS))
    ap.add_argument("--out", type=Path, default=None)
    args = ap.parse_args()

    spec = PAPERS[args.paper]
    W, H = 1280, 720
    canvas = paper_bg(W, H, spec)

    # illustration: right two-thirds, big — the dramatic scene
    illus = Image.open(args.illustration).convert("RGBA")
    if args.paper == "dark":
        # ink art was drawn for white paper — lift it onto dark with a soft
        # paper card behind it so the linework stays readable
        card = Image.new("RGBA", illus.size, (240, 236, 226, 255))
        card.alpha_composite(illus)
        illus = card
    illus = fit(illus, (int(W * 0.62), int(H * 0.86)))
    ix = W - illus.width - 28
    iy = (H - illus.height) // 2
    if illus.mode == "RGBA":
        shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        sh = Image.new("RGBA", illus.size, (0, 0, 0, 110))
        shadow.paste(sh, (ix + 10, iy + 14), illus if args.paper == "light" else None)
        canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow).convert("RGB")
    canvas.paste(illus, (ix, iy), illus)

    # title: huge handwriting, left, stroked for feed legibility
    lines = [l.strip() for l in args.text.split("|") if l.strip()]
    total_words = sum(len(l.split()) for l in lines)
    if not 2 <= total_words <= 6:
        print(f"WARNING: {total_words} words — house style is 3-5")
    draw = ImageDraw.Draw(canvas)
    size = 150 if len(lines) <= 2 else 120
    font = ImageFont.truetype(str(FONT), size)
    try:
        font.set_variation_by_axes([700])
    except OSError:
        pass
    y = 56
    accent_i = args.accent_line if args.accent_line >= 0 else len(lines) - 1
    for i, line in enumerate(lines):
        col = ACCENT if i == accent_i else spec["ink"]
        draw.text((52, y), line, font=font, fill=col,
                  stroke_width=6, stroke_fill=spec["bg"])
        if i == accent_i:
            bbox = draw.textbbox((52, y), line, font=font)
            uy = bbox[3] + 6
            draw.line((56, uy, min(bbox[2] + 8, W - 20), uy + 4),
                      fill=ACCENT, width=9)
        y = draw.textbbox((52, y), line, font=font)[3] + 4

    # mascot: bottom-left, big, overlapping the title zone slightly
    mpath = Path(args.mascot) if str(args.mascot).endswith(".png") \
        else REPO / "public" / "mascot" / f"{args.mascot}.png"
    if mpath.exists():
        mascot = fit(Image.open(mpath).convert("RGBA"), (430, 430))
        canvas.paste(mascot, (10, H - mascot.height + 14), mascot)
    else:
        sys.exit(f"mascot not found: {mpath}")

    out = args.out or (REPO / "out" / "thumbs" / f"{args.slug}_sketch.png")
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out)
    print(f"-> {out.relative_to(REPO)}  (1280x720, {args.paper} paper)")


if __name__ == "__main__":
    main()
