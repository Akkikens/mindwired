#!/usr/bin/env python3
"""Generate the "Group Winners" kickoffdaily90 short — who topped each of
the 12 World Cup groups, pulled fresh from football-data.org (free tier).
Group stage is finished, so this is mostly stable/reference content — rerun
after any standings correction, otherwise it doesn't need frequent refresh
like wc-nextup/wc-results do.

Usage: .venv-lipsync/bin/python3 scripts/build_wc_groupwinners.py
Then:  python3 scripts/build_short.py wc-groupwinners --voice eleven
       npx remotion render ShortWC-wc-groupwinners out/wc_groupwinners.mp4  (first time: register in Root.tsx)
"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
from fetch_football_stats import standings  # noqa: E402

PLAN_PATH = REPO / "src/viral/plans/wc-groupwinners.json"


def build_plan() -> dict:
    data = standings()
    winners = [(g["group"], g["table"][0]) for g in data["groups"] if g["table"]]
    if not winners:
        sys.exit("no group standings found — nothing to build")

    names = ", ".join(f"{w['team']}" for _, w in winners[:4])
    scenes = [{
        "id": "hook",
        "kind": "hook",
        "board": True,
        "start": 0, "end": 6,
        "voiceover": f"Twelve groups, twelve winners. Here's who topped every single one — starting with {names}.",
        "mainText": "12 GROUPS. 12 WINNERS.",
        "emphasis": ["12 WINNERS."],
        "kicker": "FINAL GROUP STAGE STANDINGS",
        "visualConcept": "host cold open",
        "emotionalTone": "excitement",
        "transitionOut": "whip",
    }]
    # split into 2 data/bars scenes of 6 groups each — a 12-bar chart in one
    # scene would be too cramped to read.
    for half, chunk in enumerate([winners[:6], winners[6:]]):
        bars = [{"label": f"{grp}: {t['team']}", "value": t["points"]} for grp, t in chunk]
        voice_bits = "; ".join(f"{grp}, {t['team']}, {t['points']} points" for grp, t in chunk)
        scenes.append({
            "id": f"gw{half}",
            "kind": "data",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": f"{'Groups A through F' if half == 0 else 'Groups G through L'}: {voice_bits}.",
            "mainText": "GROUP WINNERS" if half == 0 else "GROUP WINNERS, CONTINUED",
            "emphasis": [],
            "kicker": "GROUPS A-F" if half == 0 else "GROUPS G-L",
            "visualConcept": "group winners bar chart",
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
        "slug": "wc-groupwinners",
        "title": "World Cup — Every Group Winner",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-groupwinners] 12 groups → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-groupwinners --voice eleven")
