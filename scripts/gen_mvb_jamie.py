#!/usr/bin/env python3
"""Jamie Veo talking-head clips for "Messi vs Bellingham" semifinal preview.
5 clips x 8s ~= $8-12 on GEMINI_API_KEY. Idempotent — skips existing files.

Run: .venv-lipsync/bin/python scripts/gen_mvb_jamie.py
"""
import sys, traceback
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from veo_client import generate  # noqa: E402

HOST = REPO / "public/host/jamie_wide.png"
OUT = REPO / "public/mvb/host"
OUT.mkdir(parents=True, exist_ok=True)

LINES = [
    # NOTE: Veo RAI-filters "Pele" in dialogue — the name reveal lives in n_jude1 narration instead
    ("hook",    "Only one man in the history of the World Cup has ever done what Jude Bellingham just did. And that man... played in nineteen fifty-eight."),
    ("setup",   "Argentina. England. A semifinal for the ages — and the two best players on Earth could not be more different. Let's break them down."),
    ("jude",    "Now the other dressing room. Bellingham doesn't whisper — he burns. Screaming, demanding, dragging England through extra time. Twice. That's a captain being born."),
    ("verdict", "So who wins the semifinal? Leadership by silence... or leadership by fire? Here's my call."),
    ("call",    "Argentina two, England one — after extra time. But if Bellingham scores first... tear that script up."),
]

for name, dialogue in LINES:
    dst = OUT / f"jamie_{name}.mp4"
    if dst.exists():
        print(f"skip {name}")
        continue
    print(f"=== {name} ===")
    try:
        generate(HOST, dialogue, dst, aspect="16:9", model="fast")
    except SystemExit as e:
        print(f"FAILED {name}: {e}")
    except Exception:
        traceback.print_exc()
print("done")
