#!/usr/bin/env python3
"""Generate the "Next Up" kickoffdaily90 short — every confirmed upcoming
World Cup fixture, pulled fresh from football-data.org (free tier) each run.

Rerun this periodically (every few hours) to refresh: it overwrites the plan
JSON with current fixtures, rebuilds only the changed narration clips
(build_short.py is idempotent per scene, keyed on text match), then you
re-render. No host talking clips (no Veo spend) — this is meant to be cheap
to regenerate on a schedule.

Usage: .venv-lipsync/bin/python3 scripts/build_wc_nextup.py
Then:  python3 scripts/build_short.py wc-nextup --voice eleven
       npx remotion render ShortWC-wc-nextup out/wc_nextup.mp4  (first time: register in Root.tsx)
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
from fetch_football_stats import fixtures, crest_path  # noqa: E402

PLAN_PATH = REPO / "src/viral/plans/wc-nextup.json"

STAGE_LABEL = {
    "LAST_32": "ROUND OF 32", "LAST_16": "ROUND OF 16", "QUARTER_FINALS": "QUARTERFINAL",
    "SEMI_FINALS": "SEMIFINAL", "FINAL": "FINAL", "GROUP_STAGE": "GROUP STAGE",
}


def fmt_date(iso: str) -> str:
    dt = datetime.fromisoformat(iso.replace("Z", "+00:00")).astimezone(timezone.utc)
    return dt.strftime("%b %-d")


def build_plan() -> dict:
    data = fixtures(status="SCHEDULED", limit=20)
    confirmed = [m for m in data["matches"] if m["home"] and m["away"]][:6]
    if not confirmed:
        sys.exit("no confirmed upcoming fixtures found — nothing to build")

    scenes = [{
        "id": "hook",
        "kind": "hook",
        "board": True,
        "start": 0, "end": 6,
        "voiceover": f"Here's every confirmed World Cup match still to come — {len(confirmed)} games, starting with {confirmed[0]['home']} versus {confirmed[0]['away']}.",
        "mainText": "EVERY GAME STILL TO COME",
        "emphasis": ["STILL TO COME"],
        "kicker": "WORLD CUP 2026",
        "visualConcept": "host cold open",
        "emotionalTone": "excitement",
        "transitionOut": "whip",
    }]
    for i, m in enumerate(confirmed):
        stage = STAGE_LABEL.get(m["stage"], m["stage"] or "")
        compare = {"left": m["home"].upper(), "right": m["away"].upper()}
        home_crest = crest_path(m["homeId"], m["home"]) if m.get("homeId") else None
        away_crest = crest_path(m["awayId"], m["away"]) if m.get("awayId") else None
        if home_crest:
            compare["leftImg"] = home_crest
        if away_crest:
            compare["rightImg"] = away_crest
        scenes.append({
            "id": f"fx{i}",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": f"{stage}: {m['home']} against {m['away']}, {fmt_date(m['utcDate'])}.",
            "mainText": f"{m['home'].upper()} vs {m['away'].upper()}",
            "emphasis": [],
            "kicker": f"{stage} — {fmt_date(m['utcDate'])}",
            "visualConcept": "fixture comparison card",
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
        "slug": "wc-nextup",
        "title": "World Cup — Every Game Still To Come",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-nextup] {len(plan['scenes']) - 2} fixtures → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-nextup --voice eleven")
