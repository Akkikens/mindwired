#!/usr/bin/env python3
"""GENERIC (no-face / no-likeness) key-frames for the "What If X Wins" series —
free via Gemini. These are the Veo-safe shots: stadiums, crowds, confetti, trophy
close-ups, silhouettes, boots, flags. Deliberately reusable across ALL FIVE videos
(Argentina/France/Spain/England/Norway) — team-specific colour variants noted.

Veo blocks real-person likenesses, so every frame here must contain NO recognizable
face: silhouettes, backs, distance shots, objects only.

Run: .venv-lipsync/bin/python scripts/gen_generic_frames.py
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from gemini_host import generate  # noqa: E402

OUT = REPO / "public" / "wc-generic" / "keyart"
OUT.mkdir(parents=True, exist_ok=True)

ANIME = ("cinematic shonen anime illustration, dramatic lighting, high detail, "
         "no recognizable faces, no caption text, no watermark")

FRAMES = [
    # ---- fully team-agnostic (reusable in all 5 videos) ----
    ("stadium_dawn",
     "A vast empty World Cup stadium at dawn, golden light spilling over empty stands, "
     "a single football resting on the centre spot, epic scale, wistful, " + ANIME),
    ("stadium_night_full",
     "A packed World Cup stadium at night from high above, tens of thousands of tiny "
     "crowd figures, floodlights blazing, camera-flash sparkles everywhere, " + ANIME),
    ("trophy_macro",
     "Extreme close-up of the golden World Cup trophy on a plinth, dramatic spotlight, "
     "golden reflections, dust motes in the beam, dark background, reverent, " + ANIME),
    ("trophy_reach",
     "Gloved hands and taped wrists of many players reaching up together toward the "
     "golden World Cup trophy against blinding stadium lights, seen from below, faces "
     "not visible, epic triumph, " + ANIME),
    ("confetti_storm",
     "A storm of gold confetti falling through floodlight beams in a packed stadium at "
     "night, silhouetted crowd below with flags waving, pure celebration atmosphere, " + ANIME),
    ("tunnel_silhouettes",
     "Silhouettes of eleven footballers walking down a dark stadium tunnel toward "
     "blinding light at the far end, seen from behind, no faces visible, tense epic "
     "walk-out, " + ANIME),
    ("boot_ball_rain",
     "Macro close-up of a football boot stepping onto a rain-soaked pitch beside a "
     "match ball, water droplets flying, floodlight bokeh behind, tension, " + ANIME),
    ("penalty_silhouette",
     "Distant wide silhouette of a lone footballer standing over a penalty spot facing "
     "a goalkeeper, seen from far behind the player, packed stands beyond, no faces, "
     "maximum tension, " + ANIME),
    # ---- Argentina-tinted (still no faces) ----
    ("arg_fans_sea",
     "A sea of Argentina fans in sky-blue and white, waving giant flags and scarves, "
     "flares and blue smoke, shot from behind the crowd looking toward the pitch, no "
     "individual faces distinct, euphoric, " + ANIME),
    ("arg_flag_wave",
     "A giant Argentina flag rippling in slow motion across a packed stand at night, "
     "floodlights behind it, blue and white confetti in the air, " + ANIME),
    ("arg_bus_parade",
     "An open-top bus covered in Argentina colours moving through a massive street "
     "parade seen from high above, an ocean of tiny sky-blue crowd figures filling the "
     "avenue, ticker tape falling, victory parade scale, no faces distinct, " + ANIME),
    ("arg_shirt_locker",
     "A pristine Argentina sky-blue and white striped number 10 jersey hanging alone in "
     "a dark locker room under a single spotlight, the World Cup trophy on the bench "
     "beside it, quiet reverence, " + ANIME),
]


def main() -> None:
    for name, prompt in FRAMES:
        out = OUT / f"{name}.png"
        if out.exists():
            print(f"skip {name}"); continue
        print(f"  generating {name} ...")
        generate(prompt, out, refs=[], aspect="16:9")
        print(f"  -> {out}")


if __name__ == "__main__":
    main()
