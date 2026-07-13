#!/usr/bin/env python3
"""Messi-vs-Bellingham thumbnail keyart via Gemini (nano-banana) — scene only,
text added by Remotion MvBThumb (Workflow B). Identity refs from guard keyart.

Run: .venv-lipsync/bin/python scripts/gen_mvb_thumb.py
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from gemini_host import generate  # noqa: E402

KEY = REPO / "public" / "guard" / "keyart"
OUT = REPO / "public" / "mvb"
OUT.mkdir(parents=True, exist_ok=True)

STYLE = ("cinematic shonen anime illustration, ultra-high-contrast YouTube thumbnail "
         "style, dramatic rim lighting, hyper-saturated, floodlit World Cup stadium at "
         "night, 16:9, no watermark, absolutely no text or letters anywhere")

FRAMES = [
    ("thumb_faceoff",
     "Epic face-off, two anime footballers glaring at each other in extreme close "
     "profile, noses almost touching, lightning crackling between them: LEFT the "
     "Argentine legend in sky-blue and white striped number 10 jersey, short dark hair "
     "and beard, calm golden-blue aura; RIGHT the young English midfielder in white "
     "England jersey, short hair, burning red-orange flame aura in his eyes. Storm "
     "clouds and stadium lights behind, World Cup trophy glowing small between them, "
     "bottom third of frame darker for text overlay, " + STYLE,
     [KEY / "messi_last.png", KEY / "bellingham_roar.png"]),
    ("thumb_collide",
     "Split-composition duel poster: LEFT half the Argentine legend in sky-blue and "
     "white striped number 10 jersey walking calmly through golden light, serene and "
     "certain; RIGHT half the young English midfielder in white England jersey "
     "mid-scream, red lightning and fire behind him; a jagged gold energy crack splits "
     "the frame down the middle, both facing the viewer, chest-up, bottom quarter "
     "darker for text overlay, " + STYLE,
     [KEY / "messi_last.png", KEY / "bellingham_roar.png"]),
]

for name, prompt, refs in FRAMES:
    dst = OUT / f"{name}.png"
    if dst.exists():
        print(f"skip {name}")
        continue
    print(f"=== {name} ===")
    generate(prompt, dst, refs, aspect="16:9")
print("done")
