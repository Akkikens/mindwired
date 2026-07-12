#!/usr/bin/env python3
"""Anime key-frames for the kickoffdaily90 "Changing of the Guard" video, via our
own Gemini API (gemini-2.5-flash-image / nano-banana) — free, no Higgsfield credits.
Legends get a nostalgic fading look; the next generation gets a bright rising look.
Higgsfield only animates these.

Run: .venv-lipsync/bin/python scripts/gen_guard_frames.py
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
        "dimming to embers and smoke, walking away, bittersweet end-of-career mood, " + ANIME)
RISE = ("young, fierce, hungry, bright vivid electric aura blazing, confident hero stance, "
        "floodlit night stadium erupting, rising-star energy, " + ANIME)

FRAMES = [
    ("opener_stadium",
     "A vast empty floodlit football stadium at dusk, one last golden spotlight on the centre "
     "circle, empty stands, long shadows, a lone football on the grass, wistful end-of-an-era "
     "atmosphere, epic and cinematic, " + ANIME),
    # ---- legends fading ----
    ("ronaldo_fade",  "Anime Cristiano Ronaldo in a Portugal red home jersey, short dark hair, "
                      "chiselled jaw, " + FADE),
    ("modric_fade",   "Anime Luka Modric in a Croatia red-and-white checkered jersey, long blond "
                      "hair, " + FADE),
    ("neymar_fade",   "Anime Neymar in a Brazil yellow jersey, short styled hair, " + FADE),
    ("salah_fade",    "Anime Mohamed Salah in an Egypt red jersey, curly hair and full beard, " + FADE),
    ("vini_fade",     "Anime Vinicius Junior in a Brazil yellow jersey, short braided hair, " + FADE),
    # ---- the last one ----
    ("messi_last",
     "Anime Lionel Messi in a sky-blue and white striped Argentina number 10 jersey, short dark "
     "hair and beard, standing alone under a single dramatic spotlight in a dark stadium, calm and "
     "defiant, a steady golden-blue aura still burning bright around him while everything else is "
     "in shadow, the last one standing, " + ANIME),
    # ---- next generation rising ----
    ("haaland",       "Anime Erling Haaland in a Norway jersey, long blond hair tied back, towering, " + RISE),
    ("mbappe",        "Anime Kylian Mbappe in a France blue home jersey, short hair, explosive speed, " + RISE),
    ("bellingham",    "Anime Jude Bellingham in an England white jersey, short dark hair, arms-wide "
                      "celebration pose, " + RISE),
    ("lamine_yamal",  "Anime Lamine Yamal in a Spain red jersey, curly hair, teenage prodigy, number "
                      "19, dribbling, " + RISE),
    ("dembele_olise", "Two anime footballers side by side in France blue jerseys: LEFT Ousmane Dembele "
                      "with short dark curly hair, RIGHT Michael Olise with short hair; both fierce and "
                      "rising, twin electric auras, " + RISE),
    ("pedri_kane",    "Two anime footballers side by side: LEFT Pedri in a Spain red jersey with short "
                      "dark hair, RIGHT Harry Kane in an England white jersey with short hair and light "
                      "beard; both confident, contrasting red and white auras, " + RISE),
    # ---- finale ----
    ("finale_crown",
     "A glowing golden football crown floating above the centre of a floodlit stadium at night, beams "
     "of light, silhouettes of several young footballers looking up at it from below, epic 'who takes "
     "the throne' mood, dramatic, " + ANIME),
]


def main() -> None:
    for name, prompt in FRAMES:
        out = KEY / f"{name}.png"
        if out.exists():
            print(f"skip {name} (exists)")
            continue
        print(f"  generating {name} ...")
        generate(prompt, out, refs=[], aspect="16:9")
        print(f"  -> {out}")


if __name__ == "__main__":
    main()
