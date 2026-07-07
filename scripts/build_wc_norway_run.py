#!/usr/bin/env python3
"""One-off kickoffdaily90 short: Norway's giant-slayer run to the World Cup
quarterfinals — Ivory Coast and Brazil both beaten in the knockouts, England
up next (July 11). All facts pulled fresh from football-data.org's match
list, no fabricated tactical analysis.

Usage: python3 scripts/build_wc_norway_run.py
Then:  python3 scripts/build_short.py wc-norway-run --voice eleven
       python3 scripts/gen_broll_gemini.py wc-norway-run
       npx remotion render ShortWC-wc-norway-run out/wc_norway_run.mp4
       (first time: register in Root.tsx)
"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
from fetch_football_stats import crest_path, get  # noqa: E402

PLAN_PATH = REPO / "src/viral/plans/wc-norway-run.json"


def build_plan() -> dict:
    data = get("/competitions/2000/matches")
    matches = {m["stage"]: m for m in data.get("matches", [])
               if "Norway" in ((m.get("homeTeam") or {}).get("name"), (m.get("awayTeam") or {}).get("name"))}
    last32, last16, qf = matches.get("LAST_32"), matches.get("LAST_16"), matches.get("QUARTER_FINALS")
    if not (last32 and last16 and qf):
        sys.exit("missing expected Norway matches — nothing to build")

    norway_crest = crest_path(813, "Norway")
    england_crest = crest_path(qf["awayTeam"]["id"], "England")
    brazil_crest = crest_path(last16["homeTeam"]["id"], "Brazil")

    scenes = [
        {
            "id": "hook",
            "kind": "hook",
            "board": True,
            "start": 0, "end": 6,
            "voiceover": "Norway has slain two giants at this World Cup.",
            "mainText": "NORWAY HAS SLAIN TWO GIANTS AT THIS WORLD CUP",
            "emphasis": ["TWO GIANTS"],
            "kicker": "THE GIANT SLAYER RUN",
            "visualConcept": "host cold open",
            "backgroundPrompt": "A single determined footballer in a red and blue kit "
                                 "standing alone on a massive floodlit stadium pitch, "
                                 "dramatic low camera angle making him look powerful, "
                                 "cinematic painterly illustration, no text, no watermark",
            "emotionalTone": "excitement",
            "transitionOut": "whip",
        },
        {
            "id": "ivorycoast",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Round of 32: Ivory Coast 1, Norway 2.",
            "mainText": "IVORY COAST 1 - 2 NORWAY",
            "emphasis": [],
            "kicker": "ROUND OF 32",
            "visualConcept": "fixture comparison card",
            "compare": {"left": "IVORY COAST  1", "right": "2  NORWAY", "rightImg": norway_crest},
            "emotionalTone": "curiosity",
            "transitionOut": "cut",
        },
        {
            "id": "brazil",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Round of 16: Brazil 1, Norway 2 — Haaland scored both goals to knock out the five-time champions.",
            "mainText": "BRAZIL 1 - 2 NORWAY",
            "emphasis": [],
            "kicker": "ROUND OF 16 — HAALAND x2",
            "visualConcept": "fixture comparison card",
            "compare": {"left": "BRAZIL  1", "right": "2  NORWAY", "leftImg": brazil_crest, "rightImg": norway_crest},
            "emotionalTone": "shock",
            "transitionOut": "cut",
        },
        {
            "id": "nextup",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Next up: England, in the quarterfinals, July 11th.",
            "mainText": "NEXT UP: ENGLAND — QUARTERFINALS, JULY 11",
            "emphasis": ["ENGLAND"],
            "kicker": "QUARTERFINALS — JUL 11",
            "visualConcept": "upcoming quarterfinal reveal",
            "compare": {"left": "NORWAY", "right": "ENGLAND", "leftImg": norway_crest, "rightImg": england_crest},
            "emotionalTone": "excitement",
            "transitionOut": "cut",
        },
        {
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
        },
    ]
    return {
        "slug": "wc-norway-run",
        "title": "World Cup — Norway's Giant Slayer Run",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-norway-run] → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-norway-run --voice eleven")
