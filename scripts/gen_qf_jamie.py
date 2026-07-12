#!/usr/bin/env python3
"""Jamie (kickoffdaily90 host) Veo talking-head clips for the QF review show.
6 clips × 8s ≈ $9-14 on GEMINI_API_KEY. Idempotent — skips existing files.

Run: .venv-lipsync/bin/python scripts/gen_qf_jamie.py
"""
import sys, traceback
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from veo_client import generate  # noqa: E402

HOST = REPO / "public/host/jamie_wide.png"
OUT = REPO / "public/qf-review/host"
OUT.mkdir(parents=True, exist_ok=True)

LINES = [
    ("hook",    "Four quarterfinals. Two extra-time wars. And a semifinal draw that is pure cinema. Let's run through all of it."),
    ("arg_sui", "First up: Argentina, Switzerland. And trust me — it was not comfortable."),
    ("fra_mar", "Next, France Morocco. The twenty twenty-two rematch. Morocco came for revenge... Mbappe said no."),
    ("esp_bel", "Spain Belgium. An absolute banger — a goalkeeper in tears, a late late winner, and Belgian hearts broken."),
    ("eng_nor", "And then England Norway. Haaland against Bellingham. Honestly? What a game."),
    ("verdict", "So your semifinals: Spain France — a European final come early. And Argentina England. Messi... against Bellingham. Football, man."),
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
