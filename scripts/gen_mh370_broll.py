#!/usr/bin/env python3
"""MH370 cinematic hero b-roll — Veo 3.1 (Gemini API), 16:9, played MUTED under VO.
BUDGET-CAPPED: exactly 5 clips (~$1-2 each, fast model → ≤ $10 total, Akshay 2026-07-16).
Reserved only for MH370-specific motion with no free/archival equivalent. Everything else
uses owned NASA/Pexels clips + the Remotion animated map + fetched photos.

Output → public/shorts/mh370/video/<id>.mp4 (the path DocWide `video` scenes read).
Idempotent: existing non-empty files are skipped (no re-spend).

  .venv-lipsync/bin/python scripts/gen_mh370_broll.py [--model fast] [--only id1,id2]
"""
import argparse, sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
from gen_veo_broll import text2video  # noqa: E402  (reuse the tested t2v helper)

NEG = ("Absolutely no on-screen text, no captions, no subtitles, no numbers, no airline "
       "logos or liveries, no watermarks, no broadcast graphics. An original cinematic "
       "recreation, NOT real news footage. Faces of real people are never shown clearly. "
       "No blood, no gore, no bodies.")

# 16:9, cinematic documentary grade, teal/steel palette, slow ominous moves.
PROMPTS = {
    # 1 — the departure / signature opener motion
    "b777night": (
        "Cinematic aerial documentary shot, 16:9. A large twin-engine wide-body airliner, "
        "unmarked white, taxiing then lifting off into a pitch-black moonless night sky, "
        "runway edge lights streaking past, navigation strobes blinking, the jet shrinking "
        "into total darkness until only its lights remain. Slow, ominous, a sense of "
        "swallowing. Premium dark documentary grade, deep blacks, faint cold blue rim "
        "light. " + NEG
    ),
    # 2 — the mystery interior, no faces
    "cockpitnight": (
        "Cinematic shot inside a dark wide-body airliner cockpit at night, 16:9. Soft amber "
        "and green instrument glow on empty seats and switches, no people visible, faint "
        "reflections on the windscreen, a vast black void of ocean and sky beyond the glass. "
        "Silent, eerie, abandoned feeling. Shallow depth of field, moody documentary grade. "
        + NEG
    ),
    # 3 — the ocean gives back a piece (emotional, unique)
    "flaperonbeach": (
        "Cinematic slow shot, 16:9. A large weathered white aircraft wing control-surface "
        "fragment, barnacle-crusted along one edge, washing back and forth in shallow foamy "
        "surf on a remote tropical volcanic-sand beach at overcast dawn, gentle waves, no "
        "people, a lonely and haunting mood. Realistic, desaturated cool documentary grade. "
        + NEG
    ),
    # 4 — the modern search (covers 'ship' + 'auv' beats in one)
    "searchship": (
        "Cinematic night shot, 16:9. A lone offshore survey ship on a black open ocean under "
        "a cold moon, deck floodlights and a launch crane, a torpedo-shaped yellow autonomous "
        "underwater vehicle being lowered into dark water, faint sonar-blue glow, spray and "
        "swell, immense isolation, the scale of an impossible search. Premium documentary "
        "grade, steel-blue palette. " + NEG
    ),
    # 5 — the human cost / closing (crowd indistinct)
    "vigil": (
        "Cinematic shot, 16:9. Dozens of small candle flames and paper lanterns held in a "
        "dark crowd at a night vigil, hands and warm flame light in focus, faces soft and "
        "indistinct in shadow behind, a wall of small handwritten notes and flowers, grief "
        "and quiet hope, warm amber light against deep blue night. Respectful, tender "
        "documentary grade. " + NEG
    ),
}

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="fast")
    ap.add_argument("--only", default="")
    args = ap.parse_args()
    only = {s.strip() for s in args.only.split(",") if s.strip()}
    outdir = REPO / "public" / "shorts" / "mh370" / "video"
    ids = [i for i in PROMPTS if not only or i in only]
    print(f"MH370 Veo b-roll: {len(ids)} clip(s) (cap 5, model={args.model}) -> {outdir}")
    failed = []
    for sid in ids:
        out = outdir / f"{sid}.mp4"
        if out.exists() and out.stat().st_size > 0:
            print(f"  skip {sid} (exists)"); continue
        ok = False
        for attempt in range(3):
            if attempt: print(f"  retry {sid} ({attempt+1}/3)...")
            if text2video(PROMPTS[sid], out, model=args.model, aspect="16:9"):
                ok = True; break
        if not ok: failed.append(sid)
    print(f"done with FAILURES: {failed}" if failed else "done — 5 clips, ≤ $10.")
