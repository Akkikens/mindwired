#!/usr/bin/env python3
"""Generate the "Top Scorers" kickoffdaily90 short — real per-player goal
counts for the 2026 World Cup, sourced free from Wikipedia's live-maintained
Goalscorers data module (see fetch_wikipedia_scorers.py). No assists
equivalent exists there, so this covers goals only — don't add a fabricated
assists scene.

Usage: .venv-lipsync/bin/python3 scripts/build_wc_topscorers.py
Then:  python3 scripts/build_short.py wc-topscorers --voice eleven
       npx remotion render ShortWC-wc-topscorers out/wc_topscorers.mp4
       (first time: register in Root.tsx)
"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
from fetch_wikipedia_scorers import top_scorers  # noqa: E402

PLAN_PATH = REPO / "src/viral/plans/wc-topscorers.json"


def build_plan() -> dict:
    scorers = top_scorers(limit=8)
    if not scorers:
        sys.exit("no goalscorer data found — nothing to build")

    top4 = ", ".join(f"{s['player']} with {s['goals']}" for s in scorers[:4])
    scenes = [{
        "id": "hook",
        "kind": "hook",
        "board": True,
        "start": 0, "end": 6,
        "voiceover": f"Here are the top scorers at this World Cup — {top4} goals.",
        "mainText": "TOP SCORERS",
        "emphasis": ["SCORERS"],
        "kicker": "WORLD CUP 2026",
        "visualConcept": "host cold open",
        "emotionalTone": "excitement",
        "transitionOut": "whip",
    }]
    for half, chunk in enumerate([scorers[:4], scorers[4:8]]):
        bars = [{"label": f"{s['player']} ({s['team']})", "value": s["goals"]} for s in chunk]
        voice_bits = "; ".join(f"{s['player']}, {s['goals']} goals" for s in chunk)
        scenes.append({
            "id": f"gs{half}",
            "kind": "data",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": f"{'The top four' if half == 0 else 'Rounding out the top eight'}: {voice_bits}.",
            "mainText": "TOP SCORERS" if half == 0 else "TOP SCORERS, CONTINUED",
            "emphasis": [],
            "kicker": "GOLDEN BOOT RACE" if half == 0 else "GOLDEN BOOT RACE (5-8)",
            "visualConcept": "top scorers bar chart",
            "stat": {"to": 0, "bars": bars},
            "emotionalTone": "curiosity",
            "transitionOut": "cut",
        })
    scenes.append({
        "id": "cta",
        "kind": "cta",
        "board": True,
        "start": 0, "end": 6,
        "voiceover": "Follow kickoffdaily90 for every result as it happens.",
        "mainText": "FOLLOW FOR EVERY RESULT",
        "emphasis": ["EVERY RESULT"],
        "kicker": "@KICKOFFDAILY90",
        "visualConcept": "cta",
        "emotionalTone": "confidence",
        "transitionOut": "none",
    })
    return {
        "slug": "wc-topscorers",
        "title": "World Cup — Top Scorers",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-topscorers] → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-topscorers --voice eleven")
