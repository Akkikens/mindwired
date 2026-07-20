#!/usr/bin/env python3
"""AF447 thumbnail keyart candidates via Gemini (nano-banana) — SCENE ONLY, NO TEXT.
Text is added later by hand. 16:9, dark, one dramatic focal point, negative space.

Run: .venv-lipsync/bin/python scripts/gen_af447_thumb.py
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from gemini_host import generate  # noqa: E402

OUT = REPO / "public" / "shorts" / "af447" / "thumb"
OUT.mkdir(parents=True, exist_ok=True)

STYLE = ("photorealistic cinematic film still, blockbuster documentary key art, "
         "ultra-high contrast, dramatic moody lighting, teal-and-orange color grade, "
         "heavy vignette, shallow depth of field, 16:9, no watermark, "
         "absolutely no text, no letters, no numbers, no logos anywhere in the image")

FRAMES = [
    ("thumb_tailfin",
     "A large Air France Airbus A330 vertical tail fin — white with the iconic red, "
     "white and blue stripe — half submerged and being lifted dripping from a black, "
     "storm-dark Atlantic Ocean at night, cold sea spray, harsh searchlight raking "
     "across the wet metal, a small dark recovery boat silhouette far behind, ominous "
     "and forensic. The left third of the frame is deep near-black empty ocean and sky "
     "(negative space). " + STYLE),
    ("thumb_stall",
     "A commercial airliner silhouette in an extreme nose-high stalled attitude, "
     "backlit against a colossal moonlit thunderstorm anvil cloud towering over a pitch "
     "black ocean at night, faint red glow from the cockpit, tiny and doomed against the "
     "vast storm, sense of falling. Lower left kept dark and empty for negative space. "
     + STYLE),
    ("thumb_pitot",
     "Extreme macro close-up of three small metal pitot probe tubes on the aluminium "
     "skin of an airliner fuselage, sheathed and choked in glittering white ice crystals, "
     "cold blue rim light, a blurred towering storm cloud in the dark background, "
     "clinical and sinister, the tiny cause of a catastrophe. Right side darker for "
     "negative space. " + STYLE),
    ("thumb_cockpit",
     "Dark airliner cockpit interior at night from behind the two pilots' seats, two "
     "pilot silhouettes, ominous red master-warning glow washing the instrument panel, "
     "violent lightning and black storm churning through the windscreen ahead, rain "
     "streaking the glass, tense and claustrophobic. Foreground shadow gives negative "
     "space. " + STYLE),
]

for name, prompt in FRAMES:
    dst = OUT / f"{name}.png"
    if dst.exists():
        print(f"skip {name}"); continue
    print(f"=== {name} ===")
    try:
        generate(prompt, dst, [], aspect="16:9")
    except Exception as e:
        print(f"  FAILED {name}: {e}")
print(f"done -> {OUT}")
