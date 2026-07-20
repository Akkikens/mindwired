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

# The talking rig (2026-07-20, "make it feel like the mascot speaks our videos"):
# a presenter pose + 4 MOUTH STATES, swapped per-frame from the narration's
# loudness envelope (classic cartoon mouth-flaps — build_doc_vo computes the
# track, MascotReact plays it). m0..m3 map to silence -> loud.
HOST_POSE = ("standing waist-up facing the viewer like a friendly presenter, "
             "one hand slightly raised mid-gesture, engaged eyes looking at the camera")
MOUTHS = {
    "host_m0": "mouth fully CLOSED in a relaxed friendly line",
    "host_m1": "mouth slightly open, small relaxed oval, mid-quiet-syllable",
    "host_m2": "mouth clearly open mid-word, rounded 'ah' shape, teeth hinted as a simple ink line",
    "host_m3": "mouth WIDE open on a loud syllable, big expressive oval, tongue hinted with one ink stroke",
}


def white_to_alpha(src: Path, dst: Path, thresh: int = 242,
                   fill_holes: bool = True) -> None:
    """Paper-white background -> transparency, with a soft ramp so ink
    anti-aliasing keeps its edge (sketch art on white converts cleanly).

    fill_holes: near-white regions ENCLOSED by ink (helmet visors, eye
    whites, teeth) are restored to opaque — only transparency connected to
    the image border is real background. Without this the mascot's visor
    was a see-through hole over dark scenes (found on the 2026-07-20
    upgrade smoke still)."""
    im = Image.open(src).convert("RGBA")
    px = im.load()
    w, h = im.size
    whiteish = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) // 3
            whiteish[y][x] = (lum >= thresh - 22 and abs(r - g) < 14
                              and abs(g - b) < 14)
    outside = [[False] * w for _ in range(h)]
    if fill_holes:
        # flood the whiteish region reachable from the border — that is the
        # true background; enclosed whiteish pockets stay opaque
        stack = [(x, y) for x in range(w) for y in (0, h - 1) if whiteish[y][x]]
        stack += [(x, y) for y in range(h) for x in (0, w - 1) if whiteish[y][x]]
        for x, y in stack:
            outside[y][x] = True
        while stack:
            x, y = stack.pop()
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < w and 0 <= ny < h and whiteish[ny][nx] and not outside[ny][nx]:
                    outside[ny][nx] = True
                    stack.append((nx, ny))
    for y in range(h):
        for x in range(w):
            if not whiteish[y][x] or (fill_holes and not outside[y][x]):
                continue
            r, g, b, a = px[x, y]
            lum = (r + g + b) // 3
            if lum >= thresh:
                px[x, y] = (r, g, b, 0)
            else:
                fade = int(255 * (thresh - lum) / 22)
                px[x, y] = (r, g, b, min(a, fade))
    im.save(dst)


def normalize_rig(files: list[Path], pad: float = 0.06) -> None:
    """Align a mouth-state rig IN PLACE so per-frame swaps don't jump: every
    frame is scaled so its ink bounding-box height matches the set's median,
    then anchored bottom-center on a shared square canvas. Gemini's same-image
    edits drift a few percent in framing — enough to wreck flaps without this."""
    imgs = [(f, Image.open(f).convert("RGBA")) for f in files if f.exists()]
    boxes = [(f, im, im.getbbox()) for f, im in imgs]
    boxes = [(f, im, b) for f, im, b in boxes if b]
    if len(boxes) < 2:
        return
    heights = sorted(b[3] - b[1] for _, _, b in boxes)
    target_h = heights[len(heights) // 2]
    canvas = max(im.size[0] for _, im, _ in boxes)
    for f, im, b in boxes:
        crop = im.crop(b)
        s = target_h / crop.height
        crop = crop.resize((max(1, round(crop.width * s)),
                            max(1, round(crop.height * s))), Image.LANCZOS)
        out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
        x = (canvas - crop.width) // 2
        y = canvas - crop.height - int(canvas * pad)
        out.paste(crop, (x, y), crop)
        out.save(f)
        print(f"  aligned {f.name}: box {crop.width}x{crop.height} @ bottom-center")


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

    # ---- talking rig: host pose, then mouth states edited from it ----
    # anchor first (mouth CLOSED = m0), then each state as a same-image edit so
    # only the mouth changes — tiny frame-to-frame drift reads as line boil
    host_raw = out_dir / "host_m0_raw.png"
    if (not only or "host" in only) or args.force:
        if not host_raw.exists() or args.force:
            print("host rig: anchor (mouth closed)…")
            generate(
                f"The EXACT SAME character as the reference image — identical face, "
                f"helmet, suit, proportions, line style and colors — now {HOST_POSE}, "
                f"{MOUTHS['host_m0']}. Waist-up, centered, with margin. {STYLE}",
                host_raw, refs=[hero_raw], aspect="1:1")
        m0 = out_dir / "host_m0.png"
        if not m0.exists() or args.force:
            white_to_alpha(host_raw, m0)
        made.append(m0)
        for mid, mouth in list(MOUTHS.items())[1:]:
            raw = out_dir / f"{mid}_raw.png"
            png = out_dir / f"{mid}.png"
            if png.exists() and not args.force:
                made.append(png)
                continue
            print(f"host rig: {mid}…")
            try:
                generate(
                    f"Reproduce the reference illustration EXACTLY — same character, "
                    f"same pose, same framing, same line work, same colors, same "
                    f"composition. Change ONLY the mouth: {mouth}. Nothing else moves. "
                    f"{STYLE}",
                    raw, refs=[host_raw], aspect="1:1")
                white_to_alpha(raw, png)
                made.append(png)
                print(f"  -> {png.relative_to(REPO)}")
            except Exception as e:  # noqa: BLE001
                print(f"  !! {mid} failed: {e}")

    rig = sorted(out_dir.glob("host_m[0-9].png"))
    if len(rig) >= 2:
        print("aligning talking rig…")
        normalize_rig(rig)

    contact_sheet(made, REPO / "out" / "qa" / f"mascot_{args.name}_sheet.png",
                  f"mascot '{args.name}' — review identity consistency before adopting")
    print(f"\n{len(made)} asset(s) in {out_dir.relative_to(REPO)} — copy approved poses "
          f"to public/mascot/ for the comp (Remotion can't read assets/).")


if __name__ == "__main__":
    main()
