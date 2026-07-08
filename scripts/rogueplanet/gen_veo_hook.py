#!/usr/bin/env python3
"""
Generate the FIRST-30-SECONDS hook plates for the rogue-planet episode with Google
Veo 3.1 (text-to-video, 16:9). Four 8s cinematic shots → a hard cut every ~7s in the
cold open (built-in pattern interrupts). Cosmic shots are Veo's lane (the brief
reserves Higgsfield for human close-ups; Veo handles planets/scale/lensing).

Writes public/rogueplanet/clips/<id>.mp4. Idempotent (existing files skipped).
Run: .venv-lipsync/bin/python scripts/rogueplanet/gen_veo_hook.py [--only id1,id2] [--model fast|standard]
"""
import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO / "scripts"))
import gen_veo_broll as V  # noqa: E402  (reuse robust text2video/poll/download)

OUT = REPO / "public" / "rogueplanet" / "clips"

NO = ("Absolutely no on-screen text, no captions, no subtitles, no numbers, no logos, "
      "no watermarks, no UI, no HUD. Original cinematic footage, not stock, not broadcast.")

PROMPTS = {
    # 1 — human tension (astronomer realizes something is wrong)
    "hook_astro": (
        "16:9 cinematic science-documentary shot. A lone astronomer stands in a dark "
        "observatory at night, face lit only by the cold blue glow of a monitor, a slow "
        "dawning terror in their eyes as a faint anomaly appears on a star map. Shallow "
        "depth of field, moody volumetric lighting, slow push-in, premium Netflix-doc "
        "grade, deep blacks and icy cyan. " + NO
    ),
    # 2 — the rogue planet itself (Veo shot 1)
    "hook_rogue": (
        "16:9 cinematic deep-space shot. A massive rogue planet drifts through total "
        "darkness with no star to light it, almost invisible except for a faint blue rim "
        "of light along one edge and a haze of ice particles around it. Slow push-in, "
        "drifting cosmic dust, terrifying sense of scale, ultra realistic, premium space "
        "documentary, deep blue and black palette. " + NO
    ),
    # 3 — gravitational microlensing (Veo shot 2)
    "hook_lens": (
        "16:9 scientific cinematic visualization. A dark invisible mass passes in front of "
        "distant background stars, and for a moment their light bends and magnifies into a "
        "subtle glowing ring before fading again. Clean but dramatic, pure black "
        "background, blue-white starfield, faint Einstein ring of light, premium "
        "documentary look. " + NO
    ),
    # 4 — the scale pullback (rogue tiny and alone against a vast starfield)
    "hook_scale": (
        "16:9 cinematic deep-space shot, slow pull-back revealing a lone dark planet tiny "
        "and alone against a vast cold field of stars, a distant sun reduced to a single "
        "faint pinpoint far away, immense emptiness, drifting dust, awe and dread, ultra "
        "realistic premium space documentary, icy blue and black. " + NO
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
    print(f"veo hook: {len(ids)} clip(s) (16:9) -> {OUT}")
    failed = []
    for sid in ids:
        out = OUT / f"{sid}.mp4"
        if out.exists() and out.stat().st_size > 0:
            print(f"  skip {sid} (exists)")
            continue
        ok = False
        for attempt in range(3):  # RAI audio filter is nondeterministic — retry
            if attempt:
                print(f"  retry {sid} ({attempt + 1}/3)...")
            if V.text2video(PROMPTS[sid], out, model=args.model, aspect="16:9"):
                ok = True
                break
        if not ok:
            failed.append(sid)
    print(f"done. ok={len(ids) - len(failed)} failed={failed}")
