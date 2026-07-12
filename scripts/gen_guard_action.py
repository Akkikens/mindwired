#!/usr/bin/env python3
"""Tranche 2 — signature ACTION key-frames for the next-gen stars (free via Gemini).
Dynamic goal/dribble/celebration moments to cut fast in the flagship. Higgsfield
only animates these (spend per 110-credit recharge).

Run: .venv-lipsync/bin/python scripts/gen_guard_action.py
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from gemini_host import generate  # noqa: E402

KEY = REPO / "public" / "guard" / "keyart"
KEY.mkdir(parents=True, exist_ok=True)

ANIME = ("cinematic shonen anime illustration, dynamic action, motion speed lines, dramatic rim "
         "lighting, floodlit night stadium erupting, vivid energy aura, high detail, no caption text, "
         "no watermark")

FRAMES = [
    ("haaland_header",   "Anime Erling Haaland in a Norway jersey leaps high for a thunderous header, the "
                         "ball rocketing off his forehead trailing blue-white energy, towering power, " + ANIME),
    ("mbappe_sprint",    "Anime Kylian Mbappe in a France blue jersey blazing down the wing at full sprint, "
                         "the ball at his feet, explosive speed blur and lightning trail, " + ANIME),
    ("yamal_dribble",    "Anime Lamine Yamal in a Spain red jersey number 19, dazzling close-control dribble "
                         "cutting inside past a sprawling defender, teenage genius, " + ANIME),
    ("bellingham_roar",  "Anime Jude Bellingham in an England white jersey, iconic arms-wide open-armed "
                         "celebration after scoring, roaring with passion, confetti, " + ANIME),
    ("kane_finish",      "Anime Harry Kane in an England white jersey smashing a powerful finish, the ball "
                         "blasting into the top corner, net rippling, clinical striker, " + ANIME),
    ("pedri_turn",       "Anime Pedri in a Spain red jersey performing a silky turn and a no-look through pass, "
                         "elegant control, swirling aura, " + ANIME),
    ("dembele_goal",     "Anime Ousmane Dembele in a France blue jersey curling a shot into the far top corner, "
                         "the ball trailing electric energy, net bulging, " + ANIME),
    ("olise_curl",       "Anime Michael Olise in a France blue jersey curling a precise finish into the top "
                         "corner, keeper beaten, energy trail, " + ANIME),
    ("nextgen_united",   "A group of young anime footballers standing together in a line, facing camera, fierce "
                         "and united: a tall blond striker, a France-blue speedster, a Spain-red teenager, an "
                         "England-white midfielder, blazing multi-coloured auras, the new generation rising, "
                         "epic team hero shot, " + ANIME),
    ("mbappe_celebrate", "Anime Kylian Mbappe in a France blue jersey, iconic arms-crossed cool celebration "
                         "after scoring, confident, blazing blue aura, " + ANIME),
    ("haaland_celebrate","Anime Erling Haaland in a Norway jersey, calm zen cross-legged meditation celebration "
                         "on the pitch after scoring, blue-white aura, " + ANIME),
    ("yamal_celebrate",  "Anime Lamine Yamal in a Spain red jersey celebrating a goal, pointing to the sky, "
                         "joyful teenage energy, red aura, confetti, " + ANIME),
]


def main() -> None:
    for name, prompt in FRAMES:
        out = KEY / f"{name}.png"
        if out.exists():
            print(f"skip {name}"); continue
        print(f"  generating {name} ...")
        generate(prompt, out, refs=[], aspect="16:9")
        print(f"  -> {out}")


if __name__ == "__main__":
    main()
