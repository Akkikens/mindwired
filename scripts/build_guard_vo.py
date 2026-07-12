#!/usr/bin/env python3
"""kickoffdaily90 — "Changing of the Guard" narration (Cartesia cloned narrator).
The golden-era GOATs bow out one by one until only Messi is left, then the reveal
of the next generation who inherit football. Framing is speculative/nostalgic
(nobody is stated to have retired) — safe commentary, not false fact.

Run: .venv-lipsync/bin/python scripts/build_guard_vo.py [--force]
"""
from __future__ import annotations
import argparse, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "guard" / "audio"

# Framing = the real 2026 World Cup: the old gods have been knocked out one by one,
# and Messi is the last of them still standing (Argentina in the quarterfinals).
# Everything below is factually accurate to the R16 results (fact-checked 2026-07-08).
BEATS: list[tuple[str, str, str]] = [
    ("opener",   "The 2026 World Cup promised one last dance for the gods of football.", "awe"),
    ("fell1",    "Then, one by one, they fell. Modric's Croatia, gone. Ronaldo's Portugal, beaten by Spain.", "awe"),
    ("fell2",    "Neymar. Vinicius. Brazil, dumped out by Norway. And Salah's Egypt, broken by Argentina.", "awe"),
    ("legends",  "Kroos. Benzema. Lewandowski. Suarez. De Bruyne. The legends who ruled a decade, now fading into history.", "awe"),
    ("messi",    "When the dust settled, only one god was still standing. Messi. Argentina march on.", "confidence"),
    ("hunters1", "So the crown is up for grabs. Mbappe and Haaland. Seven goals each, tearing it apart.", "excitement"),
    ("hunters2", "Bellingham, dragging England forward. And a teenager named Lamine Yamal.", "excitement"),
    ("hunters3", "Kane. Pedri. Dembele. Olise. Every one of them still hunting.", "excitement"),
    ("verdict",  "A handful of them will fight for the throne.", "confidence"),
    ("finale",   "But right now, the last god standing is Messi. Who takes the crown next? Tell me below.", "curiosity"),
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
    print("\n--- durations ---")
    for bid, d in durs: print(f'  {{ id: "{bid}", aud: {d:.3f} }},')


if __name__ == "__main__":
    main()
