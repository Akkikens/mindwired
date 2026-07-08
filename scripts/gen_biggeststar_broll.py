#!/usr/bin/env python3
"""Veo 3.1 (9:16) b-roll for the biggest-star Short's board scenes.
Writes public/shorts/biggeststar/broll-video/<id>.mp4. Idempotent.
Run: .venv-lipsync/bin/python scripts/gen_biggeststar_broll.py [--only id]
"""
import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
import gen_veo_broll as V  # noqa: E402

OUT = REPO / "public" / "shorts" / "biggeststar" / "broll-video"
NO = ("Absolutely no on-screen text, no captions, no numbers, no logos, no "
      "watermarks, no UI. Original cinematic footage.")

PROMPTS = {
    "reveal": (
        "Vertical 9:16 cinematic view of a colossal deep red hypergiant star filling "
        "the frame, roiling convecting molten surface, dark sunspots, immense scale, "
        "deep black space with a few tiny distant stars for scale, ultra realistic "
        "premium space documentary. " + NO
    ),
    "scale": (
        "Vertical 9:16 cinematic space visualization: an enormous deep red hypergiant "
        "star with the thin glowing orbital rings of the inner planets drawn engulfed "
        "inside it, a tiny Sun and tiny planets utterly dwarfed, dark space, premium "
        "scientific documentary, cyan and red accents. " + NO
    ),
    "volume": (
        "Vertical 9:16 cinematic size-comparison shot: a single tiny bright yellow Sun "
        "dot beside an immense deep red hypergiant sphere that dwarfs it completely, "
        "clean dark space, dramatic scale contrast, slow drift, premium space "
        "documentary. " + NO
    ),
    "death": (
        "Vertical 9:16 cinematic supernova: a massive star detonating into a brilliant "
        "expanding shockwave of light and debris, blinding white-blue core, glowing "
        "shells of gas racing outward, epic and violent, ultra realistic premium space "
        "documentary. " + NO
    ),
}

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--model", default="fast")
    args = ap.parse_args()
    only = {s.strip() for s in args.only.split(",") if s.strip()}
    ids = [i for i in PROMPTS if not only or i in only]
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"veo biggeststar b-roll: {len(ids)} clip(s) (9:16) -> {OUT}")
    failed = []
    for sid in ids:
        out = OUT / f"{sid}.mp4"
        if out.exists() and out.stat().st_size > 0:
            print(f"  skip {sid} (exists)")
            continue
        ok = False
        for attempt in range(3):
            if attempt:
                print(f"  retry {sid} ({attempt + 1}/3)...")
            if V.text2video(PROMPTS[sid], out, model=args.model, aspect="9:16"):
                ok = True
                break
        if not ok:
            failed.append(sid)
    print(f"done. ok={len(ids) - len(failed)} failed={failed}")
