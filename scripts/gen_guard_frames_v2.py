#!/usr/bin/env python3
"""Flagship expansion frames for "Changing of the Guard" — free via Gemini.
Adds 5 more fading legends, solo versions of the duo players, and a verdict frame.
Higgsfield only animates these (spend happens per 110-credit recharge).

Run: .venv-lipsync/bin/python scripts/gen_guard_frames_v2.py
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from gemini_host import generate  # noqa: E402

KEY = REPO / "public" / "guard" / "keyart"
KEY.mkdir(parents=True, exist_ok=True)

ANIME = "cinematic shonen anime illustration, dramatic rim lighting, high detail, no caption text, no watermark"
FADE = ("veteran, older, weary but proud, nostalgic golden-hour dusk light, his coloured aura "
        "dimming to embers and smoke, walking away or looking back, bittersweet end-of-career mood, " + ANIME)
RISE = ("young, fierce, hungry, bright vivid electric aura blazing, confident hero stance, "
        "floodlit night stadium erupting, rising-star energy, " + ANIME)

FRAMES = [
    # ---- more legends fading ----
    ("kroos_fade",      "Anime Toni Kroos in a Germany white jersey, short blond hair, calm composed veteran, " + FADE),
    ("benzema_fade",    "Anime Karim Benzema in a France blue jersey, short dark hair and beard, elegant veteran striker, " + FADE),
    ("lewandowski_fade","Anime Robert Lewandowski in a Poland white and red jersey, short dark hair, veteran striker, " + FADE),
    ("suarez_fade",     "Anime Luis Suarez in a Uruguay sky-blue jersey, short dark hair, stocky veteran striker, " + FADE),
    ("debruyne_fade",   "Anime Kevin De Bruyne in a Belgium red jersey, short ginger hair, veteran playmaker, " + FADE),
    # ---- duo players broken into solo rising shots ----
    ("dembele_solo",    "Anime Ousmane Dembele in a France blue jersey, short dark curly hair, explosive winger, " + RISE),
    ("olise_solo",      "Anime Michael Olise in a France blue jersey, short hair, creative winger, " + RISE),
    ("pedri_solo",      "Anime Pedri in a Spain red jersey, short dark hair, elegant midfielder, " + RISE),
    ("kane_solo",       "Anime Harry Kane in an England white jersey, short hair and light beard, powerful striker, " + RISE),
    # ---- verdict / finalists ----
    ("finalists_three", "Three young anime footballers stand on a glowing podium under three spotlights in a dark "
                        "stadium, a towering blond striker, a fast player in France blue, and a curly-haired teen in "
                        "Spain red, each with a vivid aura, a golden crown glowing above them, epic 'the final "
                        "contenders' mood, " + ANIME),
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
