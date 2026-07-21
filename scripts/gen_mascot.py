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
# prefix so the whole video reads as ONE illustrator's hand. The accent color is
# per-channel (mindwired cyan #4DD8FF, blackbox orange #FF9500) via --accent.
STYLE_TEMPLATE = (
    "hand-drawn cartoon illustration, confident thick black ink outlines with "
    "slightly wobbly hand-inked line quality, flat colors, minimal cross-hatch "
    "shading, single {accent_name} accent color {accent}, clean white paper background, "
    "charming and expressive, in the style of a webcomic artist's character art. "
    "NOT 3D, NOT airbrushed, NOT gradient-shaded, no photorealism, no text, "
    "no watermark, no signature"
)
STYLE = STYLE_TEMPLATE.format(accent_name="cyan", accent="#4DD8FF")

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
    # auto-detect the backdrop from the corners: Gemini sometimes returns a
    # gray studio bg instead of paper-white — remove whatever neutral tone the
    # corners agree on (2026-07-20, batti rig came back gray)
    corners = [px[2, 2], px[w - 3, 2], px[2, h - 3], px[w - 3, h - 3]]
    bg_lum = sum((c[0] + c[1] + c[2]) // 3 for c in corners) // 4
    lo = min(thresh - 22, bg_lum - 26)
    whiteish = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) // 3
            whiteish[y][x] = (lum >= lo and abs(r - g) < 16 and abs(g - b) < 16)
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
            if lum >= lo + 14:
                px[x, y] = (r, g, b, 0)
            else:
                fade = int(255 * (lo + 14 - lum) / 14)
                px[x, y] = (r, g, b, min(a, max(0, fade)))
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


def head_align(files: list[Path], ref: Path, head_frac: float = 0.45) -> None:
    """Align gesture frames to `ref` BY THE HEAD (not the full ink bbox): scale
    so head heights match, translate so head centers coincide. Arms/legs may
    move — that's the point of a gesture — but the face must sit pixel-stable
    so mouth patches land correctly and eyes never 'glitch'."""
    def head_box(im):
        b = im.getbbox()
        if not b:
            return None
        return (b[0], b[1], b[2], b[1] + int((b[3] - b[1]) * head_frac))
    R = Image.open(ref).convert("RGBA")
    rb = head_box(R)
    rcx, rcy = (rb[0] + rb[2]) / 2, (rb[1] + rb[3]) / 2
    rh = rb[3] - rb[1]
    for f in files:
        im = Image.open(f).convert("RGBA")
        hb = head_box(im)
        if not hb:
            continue
        s = rh / (hb[3] - hb[1])
        im2 = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))),
                        Image.LANCZOS)
        hb2 = head_box(im2)
        cx, cy = (hb2[0] + hb2[2]) / 2, (hb2[1] + hb2[3]) / 2
        out = Image.new("RGBA", R.size, (0, 0, 0, 0))
        out.paste(im2, (round(rcx - cx), round(rcy - cy)), im2)
        out.save(f)
        print(f"  head-aligned {f.name} (scale {s:.3f})")


def mouth_region(base: Path, opens: list[Path], margin: int = 26) -> tuple[int, int, int, int]:
    """Find the mouth: the union bbox of significant pixel differences between
    the closed-mouth base and the open-mouth frames, searched in the lower half
    of the head zone. Everything OUTSIDE this box stays literally identical
    across mouth states — the fix for drifting eyes/hair between flaps."""
    B = Image.open(base).convert("RGBA")
    bb = B.getbbox()
    # search ONLY the lower-face band (28-52%% of body height): the differ must
    # not see the eye region, otherwise inter-frame eye drift inflates the box
    # and the patch would carry the glitch back in
    face_top = bb[1] + int((bb[3] - bb[1]) * 0.28)
    head_bottom = bb[1] + int((bb[3] - bb[1]) * 0.52)
    x0 = y0 = 10**9
    x1 = y1 = -1
    for o in opens:
        O = Image.open(o).convert("RGBA")
        w, h = min(B.width, O.width), min(B.height, O.height)
        bp, op = B.load(), O.load()
        for y in range(face_top, min(head_bottom, h), 2):
            for x in range(bb[0], min(bb[2], w), 2):
                p1, p2 = bp[x, y], op[x, y]
                if abs(p1[3] - p2[3]) > 60 or (p1[3] > 100 and p2[3] > 100 and
                        abs(p1[0] - p2[0]) + abs(p1[1] - p2[1]) + abs(p1[2] - p2[2]) > 140):
                    x0, y0 = min(x0, x), min(y0, y)
                    x1, y1 = max(x1, x), max(y1, y)
    if x1 < 0:
        raise RuntimeError("no mouth diff found between base and open frames")
    return (max(0, x0 - margin), max(0, y0 - margin),
            min(B.width, x1 + margin), min(B.height, y1 + margin))


def build_rig_v2(out_dir: Path, rig: str = "host", gestures: int = 3) -> list[Path]:
    """Compose the glitch-free talking rig: <rig>_g{G}_m{M}.png where every
    gesture body is a LOCKED image and only the mouth-box pixels differ between
    mouth states. Requires <rig>_m0..3 (aligned) and optional <rig>_gest1/2."""
    base = out_dir / f"{rig}_m0.png"
    opens = [out_dir / f"{rig}_m{i}.png" for i in (1, 2, 3)]
    box = mouth_region(base, opens)
    print(f"  mouth box: {box}")
    bodies = [Image.open(base).convert("RGBA")]
    for g in range(1, gestures):
        gp = out_dir / f"{rig}_gest{g}.png"
        if gp.exists():
            bodies.append(Image.open(gp).convert("RGBA"))
    made = []
    patches = [None] + [Image.open(o).convert("RGBA").crop(box) for o in opens]
    for gi, body in enumerate(bodies):
        for mi in range(4):
            frame = body.copy()
            if mi > 0:
                # clear the mouth box then paste the open-mouth patch — the rest
                # of the body is byte-identical across mouth states
                frame.paste(patches[mi], (box[0], box[1]))
            dst = out_dir / f"{rig}_g{gi}_m{mi}.png"
            frame.save(dst)
            made.append(dst)
    print(f"  rig v2: {len(made)} frames ({len(bodies)} gestures x 4 mouths)")
    return made


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
    ap.add_argument("--accent", default="#4DD8FF",
                    help="channel accent hex (mindwired #4DD8FF, blackbox #FF9500)")
    ap.add_argument("--accent-name", default=None,
                    help="color word for the prompt (auto: cyan/orange)")
    ap.add_argument("--only", default="", help="comma list of pose ids (default: all)")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    global STYLE
    accent_name = args.accent_name or {"#4DD8FF": "cyan", "#FF9500": "orange"}.get(
        args.accent.upper(), "bright")
    STYLE = STYLE_TEMPLATE.format(accent_name=accent_name, accent=args.accent)
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
