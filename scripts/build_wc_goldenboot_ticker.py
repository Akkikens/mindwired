#!/usr/bin/env python3
"""Dedicated Golden Boot ticker for kickoffdaily90's third live stream —
top 20 World Cup 2026 goalscorers, sourced free from Wikipedia's live
Goalscorers data module (see fetch_wikipedia_scorers.py). No assists
equivalent exists there — goals only, don't fabricate an assists scene.

This is its own standalone loop (not concatenated with the other 5 stat
videos) — the third live stream just streams this file on repeat.

Usage: .venv-lipsync/bin/python3 scripts/build_wc_goldenboot_ticker.py
Then:  python3 scripts/build_short.py wc-goldenboot-ticker --voice eleven
       npx remotion render ShortWC-wc-goldenboot-ticker out/wc_goldenboot_ticker.mp4
       (first time: register in Root.tsx)
"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
from fetch_wikipedia_scorers import top_scorers  # noqa: E402

PLAN_PATH = REPO / "src/viral/plans/wc-goldenboot-ticker.json"
CHUNK = 4


def build_plan() -> dict:
    scorers = top_scorers(limit=20)
    if not scorers:
        sys.exit("no goalscorer data found — nothing to build")

    top4 = ", ".join(f"{s['player']} with {s['goals']}" for s in scorers[:4])
    scenes = [{
        "id": "hook",
        "kind": "hook",
        "board": True,
        "start": 0, "end": 6,
        "voiceover": f"The Golden Boot race at this World Cup — {top4} goals.",
        "mainText": "THE GOLDEN BOOT RACE",
        "emphasis": ["GOLDEN BOOT"],
        "kicker": "WORLD CUP 2026 — TOP 20",
        "visualConcept": "host cold open",
        "emotionalTone": "excitement",
        "transitionOut": "whip",
    }]
    chunks = [scorers[i:i + CHUNK] for i in range(0, len(scorers), CHUNK)]
    for i, chunk in enumerate(chunks):
        lo, hi = i * CHUNK + 1, i * CHUNK + len(chunk)
        bars = [{"label": f"{s['player']} ({s['team']})", "value": s["goals"]} for s in chunk]
        voice_bits = "; ".join(f"{s['player']}, {s['goals']} goals" for s in chunk)
        scenes.append({
            "id": f"gb{i}",
            "kind": "data",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": f"Ranked {lo} through {hi}: {voice_bits}.",
            "mainText": "GOLDEN BOOT RACE" if i == 0 else f"GOLDEN BOOT RACE, {lo}-{hi}",
            "emphasis": [],
            "kicker": f"RANKED {lo}-{hi}",
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
        "slug": "wc-goldenboot-ticker",
        "title": "World Cup — Golden Boot Race (Top 20)",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-goldenboot-ticker] {len(plan['scenes'])} scenes → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-goldenboot-ticker --voice eleven")
