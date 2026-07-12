#!/usr/bin/env python3
"""Animate the 12 generic (face-free) key-frames via Veo 3.1 fast — 16:9, native
ambient stadium audio baked in. ~$1-2 per clip on GEMINI_API_KEY. Idempotent:
skips clips that already exist. Failures are logged and skipped, not fatal.

Run: .venv-lipsync/bin/python scripts/gen_generic_veo.py [--only name1,name2]
"""
import argparse
import sys
import traceback
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from veo_client import generate_broll  # noqa: E402

KEY = REPO / "public" / "wc-generic" / "keyart"
OUT = REPO / "public" / "wc-generic" / "clips"
OUT.mkdir(parents=True, exist_ok=True)

# (name, motion+sound direction)
SHOTS = [
    ("stadium_dawn",
     "Very slow push across the empty stadium as dawn light creeps over the stands, "
     "dust motes drifting, distant birdsong and faint wind, serene and wistful."),
    ("stadium_night_full",
     "Slow aerial drift over the packed stadium, camera flashes sparkling across the "
     "crowd like stars, a massive roaring crowd wall of sound."),
    ("trophy_macro",
     "Extremely slow orbit around the golden trophy, spotlight glinting off the gold, "
     "dust motes floating through the beam, hushed reverent room tone."),
    ("trophy_reach",
     "The many hands strain upward toward the trophy in slow motion, light flaring "
     "between the fingers, an enormous crowd roar swelling."),
    ("confetti_storm",
     "Gold confetti swirls and tumbles down through the floodlight beams in slow "
     "motion, flags waving below, deafening celebration roar."),
    ("tunnel_silhouettes",
     "The eleven silhouetted players walk steadily toward the blinding light at the "
     "tunnel mouth, their steps echoing, a muffled crowd roar growing louder."),
    ("boot_ball_rain",
     "Slow motion: the boot presses into the wet turf, water droplets scatter and "
     "hang in the air, rain patter and a tense low crowd murmur."),
    ("penalty_silhouette",
     "The lone silhouetted player stands motionless over the penalty spot, the "
     "goalkeeper shifting on the line far ahead, an almost silent stadium holding "
     "its breath, faint whistles."),
    ("arg_fans_sea",
     "The sea of sky-blue fans bounces and waves flags in unison, blue smoke drifting "
     "across, chanting and drums thundering."),
    ("arg_flag_wave",
     "The giant flag ripples across the stand in slow motion, confetti drifting "
     "through the floodlight beams, crowd singing in the background."),
    ("arg_bus_parade",
     "Slow aerial push toward the open-top bus as it inches through the ocean of "
     "fans, ticker tape raining down, an entire city roaring and honking."),
    ("arg_shirt_locker",
     "Very slow push toward the hanging jersey and the trophy beside it, the "
     "spotlight flickering gently, silence except a faint distant crowd echo."),
]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="", help="comma-separated shot names")
    args = ap.parse_args()
    only = {s.strip() for s in args.only.split(",") if s.strip()}

    ok, failed = [], []
    for name, scene in SHOTS:
        if only and name not in only:
            continue
        dst = OUT / f"{name}.mp4"
        if dst.exists():
            print(f"skip {name} (exists)")
            ok.append(name)
            continue
        src = KEY / f"{name}.png"
        print(f"=== {name} ===")
        try:
            generate_broll(src, scene, dst, aspect="16:9", model="fast")
            ok.append(name)
        except SystemExit as e:
            print(f"  FAILED {name}: {e}")
            failed.append(name)
        except Exception:
            traceback.print_exc()
            failed.append(name)

    print(f"\n--- done: {len(ok)} ok, {len(failed)} failed ---")
    if failed:
        print("failed:", ", ".join(failed))
        print("retry with: --only " + ",".join(failed))


if __name__ == "__main__":
    main()
