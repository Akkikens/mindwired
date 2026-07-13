#!/usr/bin/env python3
"""3 Veo hero clips for "63" — ~$4.50 total, native ambient audio. No player names in
prompts (Veo likeness filter). Idempotent; failures logged not fatal.

Run: .venv-lipsync/bin/python scripts/gen_bvb63_veo.py
"""
import sys, traceback
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from veo_client import generate_broll  # noqa: E402

KEY = REPO / "public/bvb63/keyart"
OUT = REPO / "public/bvb63/clips"
OUT.mkdir(parents=True, exist_ok=True)

SHOTS = [
    ("embrace_rain",
     "The two players hold the embrace in the pouring rain, rain streaking through the floodlight "
     "halos, the taller one closes his eyes, slow almost imperceptible camera push-in, distant "
     "melancholy crowd murmur and rain patter."),
    ("clock_stadium",
     "The frozen confetti begins to drift UPWARD as if time is flowing in reverse, the giant "
     "ghostly clock hands slowly turn backwards, dust rising, a deep reversed-sounding ambient "
     "hum and faint ticking."),
    ("haaland_dark",
     "The tall player walks slowly away from camera into the darkness of the tunnel, rain falling "
     "behind him in the floodlight, he pauses once but does not look back, then continues into "
     "the black, echoing footsteps and distant rain."),
]

for name, scene in SHOTS:
    dst = OUT / f"{name}.mp4"
    if dst.exists():
        print(f"skip {name}")
        continue
    print(f"=== {name} ===")
    try:
        generate_broll(KEY / f"{name}.png", scene, dst, aspect="16:9", model="fast")
    except SystemExit as e:
        print(f"FAILED {name}: {e}")
    except Exception:
        traceback.print_exc()
print("done")
