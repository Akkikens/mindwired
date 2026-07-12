#!/usr/bin/env python3
"""Generate the "Latest Results" kickoffdaily90 short — the most recent
finished World Cup matches with scores, pulled fresh from football-data.org
(free tier) each run. Same pattern as build_wc_nextup.py — rerun periodically
to refresh, no host talking clips (no Veo spend).

Usage: .venv-lipsync/bin/python3 scripts/build_wc_results.py
Then:  python3 scripts/build_short.py wc-results --voice eleven
       npx remotion render ShortWC-wc-results out/wc_results.mp4  (first time: register in Root.tsx)
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
from fetch_football_stats import results, crest_path  # noqa: E402

PLAN_PATH = REPO / "src/viral/plans/wc-results.json"

STAGE_LABEL = {
    "LAST_32": "ROUND OF 32", "LAST_16": "ROUND OF 16", "QUARTER_FINALS": "QUARTERFINAL",
    "SEMI_FINALS": "SEMIFINAL", "FINAL": "FINAL", "GROUP_STAGE": "GROUP STAGE",
}


def fmt_date(iso: str) -> str:
    dt = datetime.fromisoformat(iso.replace("Z", "+00:00")).astimezone(timezone.utc)
    return dt.strftime("%b %-d")


def build_plan() -> dict:
    # football-data.org returns finished matches in ascending chronological
    # order — the most recent ones are at the END of the list, so fetch a
    # generous limit and take the tail.
    data = results(limit=100)
    latest = data["matches"][-6:][::-1]  # most recent first
    if not latest:
        sys.exit("no finished matches found — nothing to build")

    first = latest[0]
    scenes = [{
        "id": "hook",
        "kind": "hook",
        "board": True,
        "start": 0, "end": 6,
        "voiceover": f"Here are the latest World Cup results — starting with {first['home']} {first['score']['home']}, {first['away']} {first['score']['away']}.",
        "mainText": "THE LATEST RESULTS",
        "emphasis": ["LATEST"],
        "kicker": "WORLD CUP 2026",
        "visualConcept": "host cold open",
        "emotionalTone": "excitement",
        "transitionOut": "whip",
    }]
    for i, m in enumerate(latest):
        stage = STAGE_LABEL.get(m["stage"], m["stage"] or "")
        home_score, away_score = m["score"]["home"], m["score"]["away"]
        compare = {
            "left": f"{m['home'].upper()}  {home_score}",
            "right": f"{away_score}  {m['away'].upper()}",
        }
        home_crest = crest_path(m.get("homeId"), m["home"])
        away_crest = crest_path(m.get("awayId"), m["away"])
        if home_crest:
            compare["leftImg"] = home_crest
        if away_crest:
            compare["rightImg"] = away_crest
        scenes.append({
            "id": f"res{i}",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": f"{stage}: {m['home']} {home_score}, {m['away']} {away_score}, {fmt_date(m['utcDate'])}.",
            "mainText": f"{m['home'].upper()} {home_score} - {away_score} {m['away'].upper()}",
            "emphasis": [],
            "kicker": f"{stage} — {fmt_date(m['utcDate'])}",
            "visualConcept": "result comparison card",
            "compare": compare,
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
        "slug": "wc-results",
        "title": "World Cup — The Latest Results",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-results] {len(plan['scenes']) - 2} results → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-results --voice eleven")
