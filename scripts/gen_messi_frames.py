#!/usr/bin/env python3
"""Extra anime key-frames for the Messi-vs-Salah AMV, via our own Gemini API
(gemini-2.5-flash-image / nano-banana) — free, no Higgsfield credits. Each frame
passes the existing character frames as identity refs so the anime Messi/Salah
stay on-model across every new shot. Higgsfield is used ONLY to animate these.

Run: .venv-lipsync/bin/python scripts/gen_messi_frames.py
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from gemini_host import generate  # noqa: E402

KEY = REPO / "public" / "messi-vs-salah" / "keyart"
MESSI, SALAH = KEY / "messi.png", KEY / "salah.png"
STRIKE, VICTORY = KEY / "strike.png", KEY / "victory.png"

STYLE = ("cinematic shonen anime illustration, dramatic rim lighting, high detail, "
         "floodlit World Cup stadium at night, no watermark, no caption text")

# (out name, prompt, refs)
FRAMES = [
    ("walkout",
     "Two anime footballers walk side by side out of a stadium tunnel onto the pitch: "
     "LEFT an Argentine in a sky-blue and white striped jersey number 10 with short dark "
     "hair and beard, faint blue aura; RIGHT an Egyptian in a red jersey with curly hair "
     "and beard, faint red aura. Slow heroic hero-walk, backs of a roaring crowd, lens flare, "
     "epic rivalry face-off entrance, " + STYLE, [MESSI, SALAH]),
    ("salah_score",
     "The Egyptian anime footballer in the red jersey unleashes a powerful strike, the ball "
     "rockets into the net wrapped in a crimson-orange fire trail, the goalkeeper beaten and "
     "diving, net rippling, explosive red energy, speed lines, dominant goal moment, " + STYLE,
     [SALAH]),
    ("pen_miss",
     "A goalkeeper dives full-stretch and saves a penalty, the ball tipped wide, in the "
     "background an Argentine anime footballer in a sky-blue and white striped number 10 "
     "jersey stands with both hands on his head in anguish, rain, dim cold floodlights, "
     "desaturated tension, " + STYLE, [MESSI]),
    ("messi_eyes",
     "Extreme close-up of the Argentine anime footballer's face, short dark hair and beard, "
     "gritted teeth, eyes blazing with igniting golden-blue energy, sparks and lightning "
     "reflecting in his pupils, intense determination, dramatic power-up moment, " + STYLE,
     [MESSI]),
    ("net_bulge",
     "Behind-the-goal view: a soccer ball smashes into the top corner of the net wrapped in "
     "a blazing golden-blue energy trail, the net bulging violently, the goalkeeper beaten on "
     "the ground, sky-blue Argentine fans erupting behind the goal, explosive goal moment, "
     + STYLE, [STRIKE]),
    ("winner",
     "Chaotic stoppage-time winning goal: an Argentine anime footballer in a sky-blue and "
     "white striped jersey smashes the ball into the net in a crowded penalty box, defenders "
     "sprawling, the ball crossing the line, teammates beginning to erupt, golden-blue energy "
     "burst, dramatic last-minute climax, " + STYLE, [VICTORY]),
    ("salah_dejected",
     "The Egyptian anime footballer in the red jersey walks off the pitch alone, head bowed "
     "in defeat, his fiery red aura reduced to fading smoke, rain falling, empty blurred "
     "stadium behind, somber desaturated tones, emotional heartbreak, " + STYLE, [SALAH]),
]


def main() -> None:
    for name, prompt, refs in FRAMES:
        out = KEY / f"{name}.png"
        if out.exists():
            print(f"skip {name} (exists)")
            continue
        print(f"  generating {name} ...")
        generate(prompt, out, refs=refs, aspect="16:9")
        print(f"  -> {out}")


if __name__ == "__main__":
    main()
