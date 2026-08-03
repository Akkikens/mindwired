#!/usr/bin/env python3
"""Generate the space backplates for the 24/7 rain sleep stream.

The visual concept (Akshay, 2026-08-01 — "space rain… unique to mindwired"):
you are inside a quiet spacecraft cabin, looking out through a rain-streaked
window at deep space. Rain on a spaceship window is the mindwired twist — no
other lofi-rain channel has it, and it marries the channel's space identity
to the rain/sleep niche.

These are STATIC plates. The rain, the parallax drift and the wordmark are
animated in Remotion (src/rainstream/RainStream.tsx) so the loop is
mathematically seamless — a generated video clip would visibly jump at the
splice, which is fatal on a 24/7 stream.

Usage: python3 scripts/gen_rain_backplates.py [name ...] [--force]
Output: public/rain/plates/<name>.png (2560x1440, downscaled from the model's
native aspect fill)
"""
from __future__ import annotations
import argparse, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "lipsync"))
import gemini_host  # noqa: E402

OUT = ROOT / "public" / "rain" / "plates"

BASE = (
    "Ultra-wide cinematic view of deep space, filling the entire frame edge to "
    "edge. No window, no window frame, no spacecraft interior, no foreground "
    "objects, no water droplets — just the clean astronomical vista: "
)
STYLE = (
    ". Extremely dark, moody, restful and calm — a sleep/study ambience "
    "backdrop. Deep blacks, gentle cyan and indigo tones. No people, no text, "
    "no logos, no lens flare, no bright light sources that would strain the "
    "eyes at night. Photorealistic astrophotography look, quiet and "
    "contemplative, 4k, fills the whole frame."
)

PLATES = {
    "nebula": BASE + (
        "an immense violet and teal nebula with scattered stars, slow and vast, filling the frame"
    ) + STYLE,
    "earthlimb": BASE + (
        "the curve of Earth at night seen from orbit, faint city lights "
        "glittering through cloud, a thin blue atmospheric glow along the "
        "horizon, stars above"
    ) + STYLE,
    "ringed_planet": BASE + (
        "a huge dim ringed gas giant filling much of the view, its rings "
        "catching a sliver of distant sunlight, deep space and stars behind"
    ) + STYLE,
    "deepstars": BASE + (
        "nothing but the deep starfield and a faint band of the Milky Way, "
        "utterly still and empty"
    ) + STYLE,
    "moonrise": BASE + (
        "a cratered grey moon rising over a dark planetary horizon, soft "
        "earthshine on its dark side, stars scattered behind"
    ) + STYLE,
}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("names", nargs="*", default=[])
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    names = args.names or list(PLATES)
    ok = 0
    for n in names:
        if n not in PLATES:
            print(f"[{n}] unknown plate — options: {', '.join(PLATES)}")
            continue
        dest = OUT / f"{n}.png"
        if dest.exists() and not args.force:
            print(f"[{n}] exists, skipping (--force to regenerate)")
            ok += 1
            continue
        print(f"[{n}] generating…")
        try:
            gemini_host.generate(PLATES[n], dest, [], aspect="16:9")
            print(f"[{n}] -> {dest}")
            ok += 1
        except BaseException as e:  # gemini_host sys.exits on HTTP errors
            print(f"[{n}] FAILED: {e}")
    print(f"\ndone: {ok}/{len(names)}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
