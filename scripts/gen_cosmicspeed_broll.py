#!/usr/bin/env python3
"""Veo 3.1 (9:16) b-roll for the cosmic-speed Short — the cosmic scenes the
viral engine plays via brollVideo. Higgsfield covers the human/hero beats
(hook/galaxy/universe/twist); Veo covers Earth spin/orbit + the zoom-outs.

Writes public/shorts/cosmicspeed/broll-video/<id>.mp4. Idempotent.
Run: .venv-lipsync/bin/python scripts/gen_cosmicspeed_broll.py [--only id1,id2]
"""
import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
import gen_veo_broll as V  # noqa: E402

OUT = REPO / "public" / "shorts" / "cosmicspeed" / "broll-video"
NO = ("Absolutely no on-screen text, no captions, no numbers, no logos, no "
      "watermarks, no UI. Original cinematic footage.")

PROMPTS = {
    "problem": (
        "Vertical 9:16 cinematic shot, a lone silhouetted person standing on a dark "
        "hilltop at night looking up at a vast slowly wheeling starry sky, the Milky "
        "Way arching overhead, a feeling of awe and smallness, premium space "
        "documentary, deep blue and black. " + NO
    ),
    "spin": (
        "Vertical 9:16 cinematic view of planet Earth rotating in space, the day-night "
        "terminator line sweeping across the continents, faint city lights on the dark "
        "side, glowing blue atmosphere on the limb, ultra realistic, premium space "
        "documentary. " + NO
    ),
    "orbit": (
        "Vertical 9:16 cinematic shot of planet Earth sweeping along its orbital path "
        "with the brilliant Sun flaring at the edge of frame, a strong sense of speed "
        "and motion, subtle streaking starfield, ultra realistic premium space "
        "documentary. " + NO
    ),
    "stack": (
        "Vertical 9:16 cinematic dizzying continuous zoom out, from a tiny still human "
        "figure on Earth outward past the planet, then the solar system, then into the "
        "vast glittering starfield of the whole galaxy, epic scale and vertigo, awe, "
        "premium space documentary. " + NO
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
    print(f"veo cosmicspeed b-roll: {len(ids)} clip(s) (9:16) -> {OUT}")
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
