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

# Extra per-phrase gesture BODIES (2026-07-21 rig upgrade — "animations way
# better"). With the base host pose + gest1/gest2 this makes 5 gesture bodies.
# Same-image edits from the host anchor: only the arms/stance change; the HEAD
# stays put so head_align + build_rig_v2 keep the face pixel-stable across flaps.
EXTRA_GESTURES = {
    # gest1/gest2 regenerated clean 2026-07-21 (the originals had raised hands
    # running off-frame -> detached ink fragments + bad head-align). Keep BOTH
    # ARMS FULLY IN FRAME so head_align stays stable and no bits float loose.
    "gest1": ("gesturing with both hands open near chest height, palms turned up, "
              "explaining warmly — both arms fully in frame, elbows bent"),
    "gest2": ("one hand raised with the index finger pointing up making a point, "
              "the other hand resting on the hip — both arms fully in frame"),
    "gest3": ("shrugging — both shoulders raised, both hands turned palm-up out "
              "to the sides, a slightly unsure 'who knows?' expression"),
    "gest4": ("arms crossed over the chest, one hand lifted to the chin in a "
              "thoughtful considering pose, a small knowing look"),
}
# One eyes-CLOSED frame, edited from the closed-mouth anchor: build_rig_v2 lifts
# the eye-region patch from this and composites it onto every gesture body to
# make the _blink frames. A character that never blinks is the last digital tell.
BLINK = ("eyes fully CLOSED — relaxed closed eyelids drawn as simple downward "
         "ink curves, mid-blink; mouth relaxed and closed; every other detail "
         "of the character, pose and framing EXACTLY identical")


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


def feature_region(base: Path, opens: list[Path], band: tuple[float, float],
                   margin: int = 26) -> tuple[int, int, int, int]:
    """Union bbox of significant pixel differences between the base frame and the
    variant frames, searched ONLY within a vertical band of the ink bbox (given
    as fractions of body height). Everything OUTSIDE this box stays byte-identical
    across variants — the fix for drifting features between swapped frames. Used
    for both the mouth band (0.28-0.52) and the eye band (0.08-0.30)."""
    B = Image.open(base).convert("RGBA")
    bb = B.getbbox()
    face_top = bb[1] + int((bb[3] - bb[1]) * band[0])
    head_bottom = bb[1] + int((bb[3] - bb[1]) * band[1])
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
        raise RuntimeError("no pixel diff found between base and variant frames")
    return (max(0, x0 - margin), max(0, y0 - margin),
            min(B.width, x1 + margin), min(B.height, y1 + margin))


def mouth_region(base: Path, opens: list[Path], margin: int = 18):
    """Tight box around the MOUTH only. The raw diff between same-image mouth
    edits also picks up chest/rivet/arm noise (Gemini redraws the whole body a
    little each time), which ballooned the box to the full torso and made
    build_rig_v2 paste a base-pose slab over the gesture bodies — the visible
    'torn while speaking' seam (2026-07-21). Fix: search a tight upper-face band
    and HARD-CLAMP the result to a central, small rectangle so it can never grab
    the chest ECG line or the arms."""
    box = feature_region(base, opens, band=(0.18, 0.42), margin=margin)
    B = Image.open(base).convert("RGBA")
    bb = B.getbbox()
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    # central-x clamp (mouth sits mid-face; arms are at the sides)
    x0 = max(box[0], bb[0] + int(0.30 * w))
    x1 = min(box[2], bb[0] + int(0.70 * w))
    # upper-face-y clamp (mouth is above the chest; ECG line sits ~0.45+)
    y0 = max(box[1], bb[1] + int(0.16 * h))
    y1 = min(box[3], bb[1] + int(0.42 * h))
    if x1 <= x0 or y1 <= y0:      # degenerate → fall back to a nominal mouth box
        x0, x1 = bb[0] + int(0.34 * w), bb[0] + int(0.66 * w)
        y0, y1 = bb[1] + int(0.24 * h), bb[1] + int(0.40 * h)
    return (x0, y0, x1, y1)


def eye_region(base: Path, blink: Path, margin: int = 22):
    """The upper-face band (8-30%) where the eyes differ open vs. closed."""
    return feature_region(base, [blink], band=(0.08, 0.30), margin=margin)


def build_rig_v2(out_dir: Path, rig: str = "host", gestures: int = 3) -> list[Path]:
    """Compose the glitch-free talking rig: <rig>_g{G}_m{M}.png where every
    gesture body is a LOCKED image and only the mouth-box pixels differ between
    mouth states. Requires <rig>_m0..3 (aligned) and optional <rig>_gest1..N.

    If a PER-BODY eyes-closed frame exists (<rig>_m0_blink.png for the base,
    <rig>_gest{G}_blink.png for each gesture), also emit <rig>_g{G}_blink.png:
    that body's OWN eye-region patch composited back onto the body, so the body
    stays byte-identical and only the eyes close — a ~4-frame blink the comp
    plays every 2-4s (MascotReact.isBlinking). Per-body (not one shared patch)
    because each body draws its face at a slightly different internal spot."""
    base = out_dir / f"{rig}_m0.png"
    opens = [out_dir / f"{rig}_m{i}.png" for i in (1, 2, 3)]
    box = mouth_region(base, opens)
    print(f"  mouth box: {box}")
    # (body path, its eyes-closed source or None) per gesture index
    body_paths = [base] + [out_dir / f"{rig}_gest{g}.png" for g in range(1, gestures)]
    body_paths = [p for p in body_paths if p.exists()]
    blink_srcs = [(base, out_dir / f"{rig}_m0_blink.png")] + \
        [(out_dir / f"{rig}_gest{g}.png", out_dir / f"{rig}_gest{g}_blink.png")
         for g in range(1, gestures)]
    made = []
    patches = [None] + [Image.open(o).convert("RGBA").crop(box) for o in opens]
    nblink = 0
    for gi, bpath in enumerate(body_paths):
        body = Image.open(bpath).convert("RGBA")
        for mi in range(4):
            frame = body.copy()
            if mi > 0:
                # clear the mouth box then paste the open-mouth patch — the rest
                # of the body is byte-identical across mouth states
                frame.paste(patches[mi], (box[0], box[1]))
            dst = out_dir / f"{rig}_g{gi}_m{mi}.png"
            frame.save(dst)
            made.append(dst)
        # blink = this body's OWN eyes-closed frame, used WHOLE (not an eye-patch
        # composite — bodies draw their eyes at different heights, so a patch band
        # ghosts a second face; the full frame is a clean same-image edit and a
        # tiny arm drift over a 4-frame blink is invisible under the boil).
        _, blink_src = blink_srcs[gi]
        if blink_src.exists():
            bframe = Image.open(blink_src).convert("RGBA")
            if bframe.size != body.size:
                bframe = bframe.resize(body.size, Image.LANCZOS)
            bdst = out_dir / f"{rig}_g{gi}_blink.png"
            bframe.save(bdst)
            made.append(bdst); nblink += 1
    print(f"  rig v2: {len(made)} frames ({len(body_paths)} gestures x 4 mouths"
          f" + {nblink} blink)")
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

    # ---- 2026-07-21 rig upgrade: 2 extra gesture bodies + a blink frame ----
    # (only runs when the host rig exists; idempotent — skips existing files)
    host_m0 = out_dir / "host_m0.png"
    if host_m0.exists() and ((not only) or "host" in only or "rig" in only):
        new_frames: list[Path] = []
        for gid, direction in EXTRA_GESTURES.items():   # gest3, gest4 (shrug, arms-crossed)
            png = out_dir / f"host_{gid}.png"
            if png.exists() and not args.force:
                continue
            raw = out_dir / f"host_{gid}_raw.png"
            print(f"host rig: {gid}…")
            try:
                generate(
                    f"The EXACT SAME character as the reference — identical face, "
                    f"head, helmet/body, line style and colors, same waist-up framing "
                    f"— now {direction}. Only the arms and stance change; the head and "
                    f"face stay in the same place. {STYLE}",
                    raw, refs=[host_m0], aspect="1:1")
                white_to_alpha(raw, png)
                # align a NEW gesture body to host_m0 once, right after it's made
                # (idempotent — existing bodies are never re-aligned, so re-runs
                # can't compound the rescale, 2026-07-21)
                head_align([png], ref=host_m0)
                new_frames.append(png); made.append(png)
                print(f"  -> {png.relative_to(REPO)}")
            except Exception as e:  # noqa: BLE001
                print(f"  !! {gid} failed: {e}")
        # PER-BODY eyes-closed frame: each gesture body draws its face at a
        # slightly different internal position, so ONE shared eye patch doubles
        # the face on the others (found on the 2026-07-21 blink still: g1/g2
        # ghosted a second face). Instead, close the eyes of EACH body with its
        # own same-image edit — the whole body stays put, only the eyes change,
        # and each blink is aligned to ITS OWN body so the eye patch lands right.
        bodies = [host_m0] + sorted(out_dir.glob("host_gest[0-9].png"))
        for body in bodies:
            stem = body.stem  # host_m0 / host_gest1 ...
            bl = out_dir / f"{stem}_blink.png"
            if bl.exists() and not args.force:
                continue
            raw = out_dir / f"{stem}_blink_raw.png"
            print(f"host rig: blink for {stem} (eyes closed)…")
            try:
                generate(
                    f"Reproduce the reference illustration EXACTLY — same character, "
                    f"pose, arms, framing, line work, colors, composition. Change "
                    f"ONLY the eyes: {BLINK}. {STYLE}",
                    raw, refs=[body], aspect="1:1")
                white_to_alpha(raw, bl)
                head_align([bl], ref=body)   # align to its OWN body, not host_m0
                made.append(bl)
                print(f"  -> {bl.relative_to(REPO)}")
            except Exception as e:  # noqa: BLE001
                print(f"  !! blink for {stem} failed: {e}")
        # rebuild the composited talking rig across ALL gesture bodies + blink
        gcount = 1 + len(sorted(out_dir.glob("host_gest[0-9].png")))
        print(f"building rig v2 ({gcount} gesture bodies)…")
        made += build_rig_v2(out_dir, rig="host", gestures=gcount)

    contact_sheet(made, REPO / "out" / "qa" / f"mascot_{args.name}_sheet.png",
                  f"mascot '{args.name}' — review identity consistency before adopting")
    print(f"\n{len(made)} asset(s) in {out_dir.relative_to(REPO)} — copy approved poses "
          f"to public/mascot/ for the comp (Remotion can't read assets/).")


if __name__ == "__main__":
    main()
