#!/usr/bin/env python3
"""Tournament status tracker for kickoffdaily90's live loop — shows any
currently in-play match live, confirmed Quarterfinal matchups, and notes
which QF slots are still undecided. All facts pulled fresh from
football-data.org each refresh cycle.

Usage: .venv-lipsync/bin/python3 scripts/build_wc_tournament_status.py
Then:  python3 scripts/build_short.py wc-tournament-status --voice eleven
       npx remotion render ShortWC-wc-tournament-status out/wc_tournament_status.mp4
       (first time: register in Root.tsx)
"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
from fetch_football_stats import crest_path, get  # noqa: E402

PLAN_PATH = REPO / "src/viral/plans/wc-tournament-status.json"

# football-data.org's own "crest" field sometimes points at a different id
# than the team's own id (seen with Norway: team id 8872, crest id 813).
CREST_ID_OVERRIDES = {8872: 813}


def build_plan() -> dict:
    data = get("/competitions/2000/matches")
    matches = data.get("matches", [])
    live = [m for m in matches if m["status"] in ("IN_PLAY", "PAUSED", "LIVE")]
    qf = [m for m in matches if m["stage"] == "QUARTER_FINALS"]

    scenes = [{
        "id": "hook",
        "kind": "hook",
        "board": True,
        "start": 0, "end": 6,
        "voiceover": "Here's exactly where the World Cup stands right now.",
        "mainText": "WORLD CUP — LIVE TOURNAMENT STATUS",
        "emphasis": ["LIVE"],
        "kicker": "WORLD CUP 2026",
        "visualConcept": "host cold open",
        "emotionalTone": "excitement",
        "transitionOut": "whip",
    }]

    if live:
        m = live[0]
        home, away = m.get("homeTeam") or {}, m.get("awayTeam") or {}
        score = m.get("score", {}).get("fullTime", {})
        h_crest = crest_path(CREST_ID_OVERRIDES.get(home.get("id"), home.get("id")), home.get("name", "")) if home.get("id") else None
        a_crest = crest_path(CREST_ID_OVERRIDES.get(away.get("id"), away.get("id")), away.get("name", "")) if away.get("id") else None
        scenes.append({
            "id": "live",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": f"Live right now: {home.get('name')} {score.get('home', 0)}, {away.get('name')} {score.get('away', 0)}.",
            "mainText": f"{home.get('name', '').upper()} {score.get('home', 0)} - {score.get('away', 0)} {away.get('name', '').upper()}",
            "emphasis": [],
            "kicker": "🔴 LIVE NOW",
            "visualConcept": "live match card",
            "compare": {
                "left": f"{home.get('name', '').upper()}  {score.get('home', 0)}",
                "right": f"{score.get('away', 0)}  {away.get('name', '').upper()}",
                **({"leftImg": h_crest} if h_crest else {}),
                **({"rightImg": a_crest} if a_crest else {}),
            },
            "emotionalTone": "excitement",
            "transitionOut": "cut",
        })

    confirmed_qf = [m for m in qf if (m.get("homeTeam") or {}).get("name") and (m.get("awayTeam") or {}).get("name")]
    pending_qf = len(qf) - len(confirmed_qf)
    for i, m in enumerate(confirmed_qf):
        home, away = m["homeTeam"], m["awayTeam"]
        h_crest = crest_path(CREST_ID_OVERRIDES.get(home["id"], home["id"]), home["name"])
        a_crest = crest_path(CREST_ID_OVERRIDES.get(away["id"], away["id"]), away["name"])
        date = m["utcDate"][5:10].replace("-", "/")
        scenes.append({
            "id": f"qf{i}",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": f"Quarterfinal: {home['name']} versus {away['name']}, {date}.",
            "mainText": f"{home['name'].upper()} vs {away['name'].upper()}",
            "emphasis": [],
            "kicker": f"QUARTERFINAL — {date}",
            "visualConcept": "quarterfinal matchup card",
            "compare": {"left": home["name"].upper(), "right": away["name"].upper(),
                        "leftImg": h_crest, "rightImg": a_crest},
            "emotionalTone": "curiosity",
            "transitionOut": "cut",
        })

    if pending_qf > 0:
        scenes.append({
            "id": "pending",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": f"{pending_qf} more Quarterfinal spots are still up for grabs.",
            "mainText": f"{pending_qf} QUARTERFINAL SPOTS STILL UP FOR GRABS",
            "emphasis": [str(pending_qf)],
            "kicker": "STILL TO BE DECIDED",
            "visualConcept": "pending slots",
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
        "slug": "wc-tournament-status",
        "title": "World Cup — Live Tournament Status",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-tournament-status] {len(plan['scenes'])} scenes → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-tournament-status --voice eleven")
