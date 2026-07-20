#!/usr/bin/env python3
"""Brand-mascot generator — a hand-drawn recurring character with a reaction-pose
pack, the channel's illustrated "face" (2026-07-19 anti-slop push).

Two-stage identity lock (same recipe as the host system, lipsync/gemini_host.py):
  1. HERO: one definitive character image in the locked art style.
  2. POSES: each reaction pose generated WITH the hero as a reference image, so
     the character stays identical across the pack.
Then paper-white -> alpha (sketch art on white converts cleanly) and a contact
sheet in out/qa/ for the human review.

  .venv-lipsync/bin/python scripts/gen_mascot.py --name astro \
      [--concept "..."] [--only shocked,thinking] [--force]

Output: assets/mascot/<name>/hero.png + <pose>.png (transparent) + sheet in
out/qa/mascot_<name>_sheet.png. assets/ is never bulk-cleared — these are
standing brand assets, generate ONCE and reuse forever (same policy as the
subscribe outros).
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from gemini_host import generate  # noqa: E402

from PIL import Image  # noqa: E402

# The locked art style — every mascot + every SketchScene illustration uses this
# prefix so the whole video reads as ONE illustrator's hand.
STYLE = (
    "hand-drawn cartoon illustration, confident thick black ink outlines with "
    "slightly wobbly hand-inked line quality, flat colors, minimal cross-hatch "
    "shading, single cyan accent color #4DD8FF, clean white paper background, "
    "charming and expressive, in the style of a webcomic artist's character art. "
    "NOT 3D, NOT airbrushed, NOT gradient-shaded, no photorealism, no text, "
    "no watermark, no signature"
)

DEFAULT_CONCEPT = (
    "a small curious astronaut character with an oversized round helmet, "
    "expressive simple dot eyes and eyebrows visible through the visor, "
    "chunky suit with a cyan chest panel"
)

# pose id -> acting direction (kept short; identity comes from the hero ref)
POSES = {
    "neutral":   "standing relaxed, small friendly smile, arms at sides",
    "shocked":   "jaw dropped, eyes huge, hands on cheeks, jumping back slightly",
    "thinking":  "hand on chin, one eyebrow raised, looking up at a floating question mark drawn in the same ink style",
    "pointing":  "leaning forward urgently, pointing to the side with one hand, serious eyebrows",
    "terrified": "cowering, biting fingernails, wide scared eyes, sweat drops drawn in ink",
    "mindblown": "head tilted back, hands on helmet, small ink starburst lines around the head",
    "facepalm":  "palm against visor, eyes closed, exasperated slump",
    "excited":   "both fists up in celebration, huge grin, little motion lines",
    "sad":       "shoulders slumped, looking down, a single drawn teardrop",
    "explaining":"gesturing openly with both hands like a lecturer mid-sentence, warm expression",
}


def white_to_alpha(src: Path, dst: Path, thresh: int = 242) -> None:
    """Paper-white background -> transparency, with a soft ramp so ink
    anti-aliasing keeps its edge (sketch art on white converts cleanly)."""
    im = Image.open(src).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) // 3
            if lum >= thresh and abs(r - g) < 14 and abs(g - b) < 14:
                px[x, y] = (r, g, b, 0)
            elif lum >= thresh - 22 and abs(r - g) < 14 and abs(g - b) < 14:
                fade = int(255 * (thresh - lum) / 22)
                px[x, y] = (r, g, b, min(a, fade))
    im.save(dst)


def contact_sheet(files: list[Path], out_png: Path, label: str) -> None:
    from PIL import ImageDraw
    tiles = []
    for f in files:
        try:
            im = Image.open(f).convert("RGBA")
            bg = Image.new("RGBA", im.size, (245, 242, 235, 255))  # paper tone
            bg.alpha_composite(im)
            bg.thumbnail((300, 300))
            tiles.append((f.stem, bg))
        except Exception:
            continue
    if not tiles:
        return
    cols = min(5, len(tiles))
    rows = (len(tiles) + cols - 1) // cols
    TW, TH, CAP = 310, 310, 24
    sheet = Image.new("RGB", (cols * TW, rows * (TH + CAP) + 34), "black")
    d = ImageDraw.Draw(sheet)
    d.text((8, 8), label, fill="yellow")
    for i, (name, im) in enumerate(tiles):
        x, y = (i % cols) * TW, 34 + (i // cols) * (TH + CAP)
        sheet.paste(im.convert("RGB"), (x + (TW - im.width) // 2, y + (TH - im.height) // 2))
        d.text((x + 6, y + TH + 4), name, fill="white")
    out_png.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_png)
    print(f"contact sheet -> {out_png.relative_to(REPO)}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", default="astro")
    ap.add_argument("--concept", default=DEFAULT_CONCEPT)
    ap.add_argument("--only", default="", help="comma list of pose ids (default: all)")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    out_dir = REPO / "assets" / "mascot" / args.name
    out_dir.mkdir(parents=True, exist_ok=True)
    only = {p.strip() for p in args.only.split(",") if p.strip()}

    # 1. hero (identity anchor)
    hero_raw = out_dir / "hero_raw.png"
    hero = out_dir / "hero.png"
    if not hero_raw.exists() or args.force:
        print("hero: generating identity anchor…")
        generate(
            f"Character design: {args.concept}. Full body, facing slightly left, "
            f"neutral friendly pose, centered, whole character visible with margin. {STYLE}",
            hero_raw, refs=[], aspect="1:1")
    if not hero.exists() or args.force:
        white_to_alpha(hero_raw, hero)
        print(f"  -> {hero.relative_to(REPO)}")

    # 2. poses, identity-locked to the hero
    made = [hero]
    for pose, direction in POSES.items():
        if only and pose not in only:
            continue
        raw = out_dir / f"{pose}_raw.png"
        png = out_dir / f"{pose}.png"
        if png.exists() and not args.force:
            made.append(png)
            continue
        print(f"pose: {pose}…")
        try:
            generate(
                f"The EXACT SAME character as the reference image — identical face, "
                f"helmet, suit, proportions, line style and colors — now {direction}. "
                f"Full body, centered, whole character visible with margin. {STYLE}",
                raw, refs=[hero_raw], aspect="1:1")
            white_to_alpha(raw, png)
            made.append(png)
            print(f"  -> {png.relative_to(REPO)}")
        except Exception as e:  # noqa: BLE001 — one bad pose shouldn't kill the pack
            print(f"  !! {pose} failed: {e}")

    contact_sheet(made, REPO / "out" / "qa" / f"mascot_{args.name}_sheet.png",
                  f"mascot '{args.name}' — review identity consistency before adopting")
    print(f"\n{len(made)} asset(s) in {out_dir.relative_to(REPO)} — copy approved poses "
          f"to public/mascot/ for the comp (Remotion can't read assets/).")


if __name__ == "__main__":
    main()
