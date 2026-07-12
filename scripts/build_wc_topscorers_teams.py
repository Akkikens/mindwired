#!/usr/bin/env python3
"""Generate the "Top Scoring Teams" kickoffdaily90 short — the highest-goals
teams across all 12 World Cup groups, pulled fresh from football-data.org
(free tier). This is TEAM-level goals (goalsFor from the standings table),
not individual player goalscorers — the free tier has no player data at all,
so a real Golden Boot leaderboard needs a paid API-Football tier (declined
2026-07-05, "use free"). This is the richest free-tier stat we can show.

Usage: .venv-lipsync/bin/python3 scripts/build_wc_topscorers_teams.py
Then:  python3 scripts/build_short.py wc-topscorers-teams --voice eleven
       npx remotion render ShortWC-wc-topscorers-teams out/wc_topscorers_teams.mp4
       (first time: register in Root.tsx)
"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
from fetch_football_stats import standings  # noqa: E402

PLAN_PATH = REPO / "src/viral/plans/wc-topscorers-teams.json"


def build_plan() -> dict:
    data = standings()
    teams = [t for g in data["groups"] for t in g["table"]]
    if not teams:
        sys.exit("no standings found — nothing to build")

    ranked = sorted(teams, key=lambda t: (-t["goalsFor"], t["goalsAgainst"]))[:8]
    top4 = ", ".join(f"{t['team']} with {t['goalsFor']}" for t in ranked[:4])
    scenes = [{
        "id": "hook",
        "kind": "hook",
        "board": True,
        "start": 0, "end": 6,
        "voiceover": f"Here are the highest scoring teams at this World Cup — {top4} goals.",
        "mainText": "TOP SCORING TEAMS",
        "emphasis": ["SCORING"],
        "kicker": "WORLD CUP 2026",
        "visualConcept": "host cold open",
        "emotionalTone": "excitement",
        "transitionOut": "whip",
    }]
    for half, chunk in enumerate([ranked[:4], ranked[4:8]]):
        bars = [{"label": t["team"], "value": t["goalsFor"]} for t in chunk]
        voice_bits = "; ".join(f"{t['team']}, {t['goalsFor']} goals" for t in chunk)
        scenes.append({
            "id": f"ts{half}",
            "kind": "data",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": f"{'The top four' if half == 0 else 'Rounding out the top eight'}: {voice_bits}.",
            "mainText": "TOP SCORING TEAMS" if half == 0 else "TOP SCORING TEAMS, CONTINUED",
            "emphasis": [],
            "kicker": "GOALS SCORED" if half == 0 else "GOALS SCORED (5-8)",
            "visualConcept": "top scoring teams bar chart",
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
        "slug": "wc-topscorers-teams",
        "title": "World Cup — Top Scoring Teams",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-topscorers-teams] top {len(plan['scenes']) - 2} of 8 teams → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-topscorers-teams --voice eleven")
