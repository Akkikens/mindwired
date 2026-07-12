#!/usr/bin/env python3
"""Key-frames for "What If Argentina Wins the World Cup" (kickoffdaily90, 10-min
anime epic) — free via Gemini. New characters/beats only; Part 1 reuses existing
Messi frames/clips from messi-vs-salah + guard. Messi refs keep his identity locked
across all three videos. Higgsfield/Veo only animates these.

Run: .venv-lipsync/bin/python scripts/gen_argentina_frames.py
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from gemini_host import generate  # noqa: E402

OUT = REPO / "public" / "argentina-wc" / "keyart"
OUT.mkdir(parents=True, exist_ok=True)

MESSI_REF = REPO / "public/messi-vs-salah/keyart/messi.png"
MESSI_LAST_REF = REPO / "public/guard/keyart/messi_last.png"

ANIME = ("cinematic shonen anime illustration, dramatic rim lighting, high detail, "
         "floodlit World Cup stadium, no caption text, no watermark")

FRAMES = [
    ("alvarez_goal",
     "Anime Julian Alvarez in a sky-blue and white striped Argentina jersey number 9, "
     "short light hair, wheeling away in celebration after scoring the winning goal "
     "against a generic dark-kit opponent, confident young striker energy, blue-white "
     "aura, " + ANIME, []),

    ("locker_torch_pass",
     "Anime Lionel Messi in Argentina number 10, handing the captain's armband to a "
     "younger teammate Julian Alvarez in the locker room, warm respectful lighting, "
     "symbolic passing-the-torch moment, both in Argentina kit, quiet mentorship mood, "
     + ANIME, [MESSI_REF]),

    ("semifinal_winner",
     "Anime Argentina midfielder in a sky-blue and white striped jersey smashing a "
     "dramatic extra-time winning goal against a generic dark-kit opponent, exhausted "
     "but euphoric, teammates sprinting in to celebrate, stadium erupting at night, "
     + ANIME, []),

    ("opponent_generic_open",
     "Anime footballer in a plain dark navy unbranded kit striking a shot into the net, "
     "wheeling away in celebration, opposing a sky-blue and white Argentina side visible "
     "dejected in the background, floodlit night stadium, " + ANIME, []),

    ("argentina_equalizer_scrappy",
     "Anime Argentina forward in a sky-blue and white striped jersey scrambling the ball "
     "over the line in a goalmouth crowd, scrappy unglamorous poacher's finish, pure "
     "desperation and joy, teammates piling in, " + ANIME, []),

    ("messi_final_winner",
     "Anime Lionel Messi in a sky-blue and white striped Argentina number 10 jersey, "
     "calm ice-cold expression mid one-touch finish from a cutback, ball rocketing into "
     "the net trailing golden-blue energy, the decisive World Cup Final winning goal, "
     "explosive golden aura blazing, slow-motion intensity, " + ANIME, [MESSI_REF]),

    ("fulltime_chaos",
     "Anime wide shot of an Argentina football team in sky-blue and white jerseys "
     "piling on top of each other in delirious celebration on the pitch after the "
     "World Cup Final final whistle, confetti beginning to fall, floodlit stadium "
     "erupting, " + ANIME, []),

    ("trophy_confetti",
     "Anime wide stadium shot, gold and blue confetti raining down over a packed "
     "floodlit stadium at night, World Cup Final atmosphere, epic scale, " + ANIME, []),

    ("trophy_hoist",
     "Anime Argentina teammates in sky-blue and white jerseys hoisting Lionel Messi "
     "onto their shoulders in triumph, confetti falling, golden light, joyous chaos, "
     + ANIME, [MESSI_REF]),

    ("messi_lift_alone",
     "Anime Lionel Messi alone in frame, in a sky-blue and white Argentina number 10 "
     "jersey, lifting the World Cup trophy high overhead, brilliant golden aura "
     "blazing outward, confetti falling, roaring crowd blurred behind, the definitive "
     "hero shot, ultra dramatic, " + ANIME, [MESSI_LAST_REF]),

    ("maradona_tribute",
     "Anime Lionel Messi in Argentina number 10 jersey looking up at the sky with a "
     "respectful, emotional expression, a faint golden ghostly silhouette of a "
     "legendary number 10 Argentina player watching over him in the clouds above the "
     "stadium, tasteful and reverent, not overdone, warm light, " + ANIME, [MESSI_REF]),

    ("outro_five_flags",
     "Anime wide shot of five national football jerseys hanging in a dramatic dark "
     "locker-room row bathed in individual spotlights: Argentina sky-blue and white, "
     "France navy blue, Spain red, England white, Norway red — a teaser for a series, "
     "moody and epic, " + ANIME, []),
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
