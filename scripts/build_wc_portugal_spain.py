#!/usr/bin/env python3
"""One-off kickoffdaily90 short: Spain's last-minute Round of 16 win over
Portugal (July 6, 2026) and the immediate fallout — Portugal's head coach
resigned right after. Facts verified against football-data.org match JSON
and Wikipedia's match-report wikitext (goal minute, resignation note).

Usage: .venv-lipsync/bin/python3 scripts/build_wc_portugal_spain.py
Then:  python3 scripts/build_short.py wc-portugal-spain --voice eleven
       python3 scripts/gen_broll_gemini.py wc-portugal-spain
       npx remotion render ShortWC-wc-portugal-spain out/wc_portugal_spain.mp4
       (first time: register in Root.tsx)
"""
import json
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PLAN_PATH = REPO / "src/viral/plans/wc-portugal-spain.json"

PORTUGAL = "shorts/_wc-crests/765.svg"
SPAIN = "shorts/_wc-crests/760.svg"


def build_plan() -> dict:
    scenes = [
        {
            "id": "hook",
            "kind": "hook",
            "board": True,
            "start": 0, "end": 6,
            "voiceover": "Portugal's World Cup ended in the very last minute.",
            "mainText": "PORTUGAL'S WORLD CUP ENDED IN THE LAST MINUTE",
            "emphasis": ["LAST MINUTE"],
            "kicker": "ROUND OF 16 HEARTBREAK",
            "visualConcept": "host cold open",
            "backgroundPrompt": "A footballer on his knees on the pitch in despair after "
                                 "a last-minute loss, stadium lights above, dramatic and "
                                 "somber, cinematic painterly illustration, no text, no watermark",
            "emotionalTone": "shock",
            "transitionOut": "whip",
        },
        {
            "id": "score",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Round of 16: Portugal 0, Spain 1.",
            "mainText": "PORTUGAL 0 - 1 SPAIN",
            "emphasis": [],
            "kicker": "ROUND OF 16 — JUL 6",
            "visualConcept": "fixture comparison card",
            "compare": {"left": "PORTUGAL  0", "right": "1  SPAIN", "leftImg": PORTUGAL, "rightImg": SPAIN},
            "emotionalTone": "shock",
            "transitionOut": "cut",
        },
        {
            "id": "merino",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Mikel Merino scored the winner in the first minute of stoppage time — the ninetieth-plus-first minute.",
            "mainText": "MERINO SCORED IN STOPPAGE TIME — 90+1'",
            "emphasis": ["90+1'"],
            "kicker": "90+1' — MERINO",
            "visualConcept": "decisive late goal moment",
            "backgroundPrompt": "A footballer in a red kit sprinting in explosive "
                                 "celebration after scoring a last-second winning goal, "
                                 "stadium floodlights, roaring crowd, cinematic painterly "
                                 "illustration, no text, no watermark",
            "emotionalTone": "excitement",
            "transitionOut": "cut",
        },
        {
            "id": "resignation",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Minutes later, Portugal's head coach announced his resignation, effective immediately.",
            "mainText": "PORTUGAL'S COACH RESIGNED — EFFECTIVE IMMEDIATELY",
            "emphasis": ["RESIGNED", "IMMEDIATELY"],
            "kicker": "IMMEDIATE FALLOUT",
            "visualConcept": "emotional aftermath",
            "backgroundPrompt": "A football manager in a suit standing alone in an empty "
                                 "stadium tunnel, head down, walking away, somber and final, "
                                 "cinematic painterly illustration, no text, no watermark",
            "emotionalTone": "awe",
            "transitionOut": "cut",
        },
        {
            "id": "cta",
            "kind": "cta",
            "board": True,
            "start": 0, "end": 6,
            "voiceover": "Follow kickoffdaily90 for every World Cup shock as it happens.",
            "mainText": "FOLLOW FOR EVERY WORLD CUP SHOCK",
            "emphasis": ["EVERY WORLD CUP SHOCK"],
            "kicker": "@KICKOFFDAILY90",
            "visualConcept": "cta",
            "emotionalTone": "confidence",
            "transitionOut": "none",
        },
    ]
    return {
        "slug": "wc-portugal-spain",
        "title": "World Cup — Spain's Last-Minute Winner Ends Portugal's Run",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-portugal-spain] → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-portugal-spain --voice eleven")
