#!/usr/bin/env python3
"""Key-frames for "63" — the Bellingham/Haaland BVB Nolan-style anime short (free via
Gemini). Moody, cinematic, time-motif heavy; football is the backdrop, not the subject.
Refs lock identity to our existing anime Bellingham/Haaland.

Run: .venv-lipsync/bin/python scripts/gen_bvb63_frames.py
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from gemini_host import generate  # noqa: E402

OUT = REPO / "public" / "bvb63" / "keyart"
OUT.mkdir(parents=True, exist_ok=True)

G = REPO / "public/guard/keyart"
BELL = G / "bellingham.png"
HAAL = G / "haaland.png"

NOLAN = ("cinematic anime illustration in a moody Christopher-Nolan-film style, muted "
         "desaturated palette with one accent colour, volumetric light, film grain, wide "
         "anamorphic composition, high detail, no caption text, no watermark")

FRAMES = [
    ("embrace_rain",
     "Two anime footballers embracing on a rain-soaked pitch at night after a match, one in an "
     "England white kit with short dark hair, one taller in a Norway red kit with long blond hair, "
     "both drenched, floodlights haloed in the rain, stands emptying behind them, quiet devastating "
     "emotion, " + NOLAN, [BELL, HAAL]),
    ("clock_stadium",
     "A colossal antique clock face superimposed like a ghost over a dark empty football stadium, "
     "its hands frozen between seconds, dust and confetti suspended motionless in mid-air, "
     "surreal dreamlike physics, deep blacks and pale gold light, " + NOLAN, []),
    ("snow_arrival",
     "A tall teenage anime footballer with long blond hair in a black winter coat stepping off a "
     "team bus into falling snow at night, yellow stadium wall glowing faintly in the distance, "
     "breath visible, January cold, beginning-of-a-story mood, " + NOLAN, [HAAL]),
    ("summer_arrival",
     "A young anime footballer with short dark hair, seventeen years old, in a black tracksuit "
     "walking alone into a vast empty yellow-and-black stadium for the first time, holding a "
     "gym bag, looking up in awe at the towering yellow terrace, summer light, " + NOLAN, [BELL]),
    ("training_dawn",
     "Two young anime footballers in yellow-and-black training kits sprinting side by side at "
     "dawn on an empty training pitch, mist on the grass, low golden sun flaring behind them, "
     "matching strides, brotherhood, " + NOLAN, [BELL, HAAL]),
    ("tunnel_laugh",
     "Two young anime footballers in yellow-and-black kits laughing together in a dark stadium "
     "tunnel before a match, one tall and blond, one younger with short dark hair, easy genuine "
     "friendship, single shaft of light from the pitch entrance, " + NOLAN, [BELL, HAAL]),
    ("cup_lift",
     "Two young anime footballers in yellow-and-black kits lifting a large silver cup trophy "
     "together at night, gold confetti falling, both roaring with joy, teammates blurred around "
     "them, one perfect frozen moment of triumph, " + NOLAN, [BELL, HAAL]),
    ("corridors_split",
     "A surreal image of two long parallel corridors diverging at an angle from a single point: "
     "the left corridor bathed in sky-blue light, the right corridor in pure white light, a lone "
     "silhouetted figure walking away down each one, impossible architecture, " + NOLAN, []),
    ("two_clocks",
     "Two pocket watches side by side on dark wet concrete, ticking at visibly different angles, "
     "one reflecting a sky-blue stadium in its glass, the other reflecting a white stadium, "
     "rain droplets, macro cinematic close-up, " + NOLAN, []),
    ("bracket_fate",
     "A dark war-room style wall covered in a glowing tournament bracket like constellation "
     "lines, two glowing paths from opposite sides converging toward a single point of light, "
     "seen over the silhouette shoulder of a man watching it, " + NOLAN, []),
    ("duel_miami",
     "Two anime footballers facing each other at midfield under Miami floodlights at night, one "
     "in England white with short dark hair, one taller in Norway red with blond hair, rain "
     "starting to fall, the crowd a dark blur, shot like a western standoff, " + NOLAN, [BELL, HAAL]),
    ("haaland_dark",
     "A tall anime footballer in a Norway red kit with long blond hair walking alone away from "
     "camera into the darkness of a stadium tunnel, floodlit rain behind him, head slightly "
     "bowed, dignified exit, " + NOLAN, [HAAL]),
    ("bell_watch",
     "An anime footballer in an England white kit with short dark hair standing alone on a wet "
     "pitch at night, watching someone leave, rain on his face that could be tears, floodlight "
     "halo, restrained grief, " + NOLAN, [BELL]),
    ("title_63",
     "A dark cinematic title-card image: the number 63 formed from tiny embedded photographs "
     "glowing faintly gold on black, film grain, dust motes, minimal and monumental, " + NOLAN, []),
]


def main() -> None:
    for name, prompt, refs in FRAMES:
        out = OUT / f"{name}.png"
        if out.exists():
            print(f"skip {name}"); continue
        print(f"  generating {name} ...")
        generate(prompt, out, refs=refs, aspect="16:9")
        print(f"  -> {out}")


if __name__ == "__main__":
    main()
