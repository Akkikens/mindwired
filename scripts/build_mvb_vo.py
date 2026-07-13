#!/usr/bin/env python3
"""kickoffdaily90 — "Messi vs Bellingham" semifinal-preview narration.
Canon (QF review, fact-checked 2026-07-11): ENG 2-1 NOR aet (Bellingham x2, second
QF in a row with a brace — only Pele younger), ARG 3-1 SUI aet, Messi & Mbappe 8
goals, semis ARG-ENG + ESP-FRA. Open loop: "one number tells you who wins" -> "zero".

Run: .venv-lipsync/bin/python scripts/build_mvb_vo.py [--force]
"""
from __future__ import annotations
import argparse, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "mvb" / "audio"

BEATS: list[tuple[str, str, str]] = [
    # hook continuation (right after jamie_hook Veo clip)
    ("n_hook2", "And in four days, that twenty-three-year-old walks into the Azteca... to end Lionel Messi's career. There is one number in this matchup that already tells you who wins. It's coming at the end.", "shock"),
    # CH 1 — THE LAST DANCE
    ("n_messi1", "Thirty-nine years old. His fifth World Cup. And still — eight goals in six games, top of the Golden Boot race. Nobody in history has carried a title defence this deep, at this age.", "awe"),
    ("n_messi2", "But watch how he leads. He barely speaks. He walks... until the moment arrives. Then he decides the game in ninety seconds. Argentina don't follow orders. They follow belief.", "confidence"),
    ("s_messi", "The resume is absurd. Eight goals, three assists this tournament. Twenty-six major trophies. And one last dance — four hundred minutes of football, maximum, left in the greatest career of all time.", "awe"),
    # CH 2 — THE HEIR
    ("n_jude1", "Two goals against Norway in extra time. Two more in the round before that. The second-youngest man ever to score twice in back-to-back World Cup knockouts. The only name above him... Pele, nineteen fifty-eight.", "shock"),
    ("n_jude2", "And where Messi conserves, Bellingham consumes. Fourteen kilometres a game. Tackles in his own box, headers in yours. He doesn't take over matches. He swallows them.", "excitement"),
    ("s_jude", "Four knockout goals — every one of them with England behind or level. Twenty-three years old. He isn't chasing Messi's throne politely. He's kicking the door in.", "excitement"),
    # CH 3 — THE COLLISION
    ("n_clash1", "The tactical war is brutal. England will hunt the space Messi refuses to press. Argentina will aim everything at English legs carrying two straight extra times — two hundred and forty minutes of war in eight days.", "fear"),
    ("n_number", "And that number I promised you? Zero. That is how many teams have knocked Messi's Argentina out of a tournament since twenty nineteen. Twenty-three tried. Bellingham has to be the first man on Earth to do it.", "awe"),
    ("n_cta", "The semifinal kicks off in four days — and we review it right here, the night it happens. Subscribe, so you're in the room when history picks a side.", "confidence"),
]


def duration(path: Path) -> float:
    out = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
        "-of","default=noprint_wrappers=1:nokey=1", str(path)], capture_output=True, text=True)
    try: return float(out.stdout.strip())
    except ValueError: return 0.0


def main() -> None:
    ap = argparse.ArgumentParser(); ap.add_argument("--force", action="store_true")
    args = ap.parse_args(); OUT.mkdir(parents=True, exist_ok=True)
    durs = []
    for bid, text, tone in BEATS:
        dst = OUT / f"{bid}.mp3"
        if dst.exists() and not args.force:
            print(f"skip {bid}")
        else:
            dst.write_bytes(cartesia.tts(text, tone=tone, speed=0.95))
            print(f"->  {bid}.mp3")
        d = duration(dst)
        if d < 1.0:
            sys.exit(f"BAD CLIP {bid}: {d}s — check for leading ellipsis / empty audio")
        durs.append((bid, d))
    print(f"\n--- durations (total {sum(d for _,d in durs):.0f}s) ---")
    for bid, d in durs: print(f'  {{ id: "{bid}", aud: {d:.3f} }},')


if __name__ == "__main__":
    main()
