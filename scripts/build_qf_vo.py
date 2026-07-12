#!/usr/bin/env python3
"""kickoffdaily90 — QF review narration (between Jamie's Veo talking segments).
All results fact-checked 2026-07-11: ARG 3-1 SUI aet, FRA 2-0 MAR, ESP 2-1 BEL,
ENG 2-1 NOR aet → semis ESP-FRA, ARG-ENG.

Run: .venv-lipsync/bin/python scripts/build_qf_vo.py [--force]
"""
from __future__ import annotations
import argparse, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "qf-review" / "audio"

BEATS: list[tuple[str, str, str]] = [
    ("n_arg1", "Alexis Mac Allister, inside ten minutes. Argentina cruising. Then Switzerland grew into the game — and Dan Ndoye silenced the stadium on sixty-seven.", "shock"),
    ("n_arg2", "But a red card left the Swiss with ten men, and in extra time the champions did what champions do. Three one. Messi's last dance rolls on.", "excitement"),
    ("n_fra1", "Everyone remembered twenty twenty-two. Morocco pressed, the Atlas Lions roared... but Mbappe doesn't do nostalgia. One nil.", "confidence"),
    ("n_fra2", "Then Ousmane Dembele put it to bed. Two nil. France, ice cold and ruthless, march into the semifinals.", "confidence"),
    ("n_esp1", "Fabian Ruiz put Spain ahead. De Ketelaere dragged Belgium level. And then the moment that broke Belgian hearts — Courtois, their wall, forced off injured, in tears.", "fear"),
    ("n_esp2", "And in the dying minutes, Mikel Merino pounced on a goalkeeper error. Two one. Spain through — and Lamine Yamal's coronation tour continues.", "excitement"),
    ("n_eng1", "Andreas Schjelderup stunned England on thirty-six minutes. Miami went quiet... for nine minutes. Because on the stroke of half time — Jude Bellingham. Level.", "shock"),
    ("n_eng2", "Extra time. Again. And again... Bellingham. Two one. Haaland's seven-goal World Cup is over. England march on.", "excitement"),
    ("s_arg",  "The numbers tell it: two point zero expected goals to zero point five three. That's a third semifinal in Argentina's last four World Cups.", "confidence"),
    ("s_fra",  "Look at this. Three point zero four x G... to zero point one four. Total control. And Mbappe joins Messi on eight goals for the Golden Boot.", "confidence"),
    ("s_esp",  "Sixty six percent possession. Ten shots to two. Ninety percent passing. And Merino? Scored one minute fifty seven seconds after stepping on the pitch.", "excitement"),
    ("s_eng",  "Fourteen shots to thirteen — an absolute war. And here's the history: Bellingham is now the second youngest ever to score twice in back-to-back World Cup knockout games. The only man ahead of him... is Pele.", "awe"),
    ("s_boot",  "And the Golden Boot race? Dead level at the top. Messi, eight. Mbappe, eight. Haaland stuck on seven... and going home.", "excitement"),
    ("n_semis", "So here we are. Spain against France. Argentina against England. Four giants. Two tickets to the final. It does not get bigger than this.", "awe"),
    ("n_cta",  "Every semifinal, reviewed the night it happens — right here. Subscribe so you don't miss the ending.", "confidence"),
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
        durs.append((bid, duration(dst)))
    print(f"\n--- durations (total {sum(d for _,d in durs):.0f}s) ---")
    for bid, d in durs: print(f'  {{ id: "{bid}", aud: {d:.3f} }},')


if __name__ == "__main__":
    main()
