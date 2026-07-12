#!/usr/bin/env python3
"""One-off kickoffdaily90 short: "The Haaland Effect" — Norway's Round of 16
upset over Brazil, July 5, 2026. Facts hard-coded and verified against TWO
independent sources before writing this: football-data.org's structured
match JSON (score, winner, timestamps) AND Wikipedia's raw {{football box}}
match-report wikitext (goalscorers, minutes, Neymar retirement note) — an
earlier WebFetch summary of the bracket TABLE page got the score wrong
(misread a bracket grid), which is why the primary match-report wikitext
was checked directly instead of trusting a second prose summary.

This is a one-off historical-result story, not a live-refreshing stat feed
like wc-nextup/wc-results — so it's not wired into wc_check_and_refresh.py.

Usage: python3 scripts/build_wc_haaland.py
Then:  python3 scripts/build_short.py wc-haaland --voice eleven
       python3 scripts/gen_broll_gemini.py wc-haaland
       npx remotion render ShortWC-wc-haaland out/wc_haaland.mp4
       (first time: register in Root.tsx)
"""
import json
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PLAN_PATH = REPO / "src/viral/plans/wc-haaland.json"

BRAZIL_CREST = "shorts/_wc-crests/764.svg"
NORWAY_CREST = "shorts/_wc-crests/813.svg"


def build_plan() -> dict:
    scenes = [
        {
            "id": "hook",
            "kind": "hook",
            "board": True,
            "start": 0, "end": 6,
            "voiceover": "Erling Haaland just ended Brazil's World Cup dream.",
            "mainText": "NORWAY JUST ENDED BRAZIL'S WORLD CUP",
            "emphasis": ["ENDED"],
            "kicker": "THE HAALAND EFFECT",
            "visualConcept": "host cold open",
            "backgroundPrompt": "Dramatic wide shot of a packed night football stadium, "
                                 "floodlights blazing, tense atmosphere, World Cup knockout "
                                 "match energy, cinematic painterly illustration",
            "emotionalTone": "shock",
            "transitionOut": "whip",
        },
        {
            "id": "score",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Round of 16: Brazil 1, Norway 2.",
            "mainText": "BRAZIL 1 - 2 NORWAY",
            "emphasis": [],
            "kicker": "ROUND OF 16 — JUL 5",
            "visualConcept": "fixture comparison card",
            "compare": {
                "left": "BRAZIL  1", "right": "2  NORWAY",
                "leftImg": BRAZIL_CREST, "rightImg": NORWAY_CREST,
            },
            "emotionalTone": "shock",
            "transitionOut": "cut",
        },
        {
            "id": "haaland",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Haaland scored twice — in the 79th minute, and again in the 90th, to seal it.",
            "mainText": "HAALAND SCORED TWICE — INCLUDING THE 90TH MINUTE WINNER",
            "emphasis": ["TWICE", "90TH MINUTE WINNER"],
            "kicker": "79' & 90' — HAALAND",
            "visualConcept": "striker celebrating a decisive late goal",
            "backgroundPrompt": "A footballer in a white and blue kit sprinting in wild "
                                 "celebration after scoring a late winning goal, stadium "
                                 "floodlights, roaring crowd in the background, cinematic "
                                 "painterly illustration, no text, no watermark",
            "emotionalTone": "excitement",
            "transitionOut": "cut",
        },
        {
            "id": "neymar",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Neymar pulled one back with a stoppage-time penalty — too little, too late. Then he announced his international retirement.",
            "mainText": "NEYMAR'S PENALTY CAME TOO LATE — THEN HE RETIRED",
            "emphasis": ["TOO LATE", "RETIRED"],
            "kicker": "90+10' PEN. — NEYMAR'S FINAL MATCH",
            "visualConcept": "a player's emotional final moment",
            "backgroundPrompt": "A lone footballer in a yellow kit standing on the pitch "
                                 "looking down, head bowed, stadium lights dimming around "
                                 "him, quiet emotional moment after a loss, cinematic "
                                 "painterly illustration, no text, no watermark",
            "emotionalTone": "awe",
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
        "slug": "wc-haaland",
        "title": "World Cup — The Haaland Effect: Norway Ends Brazil's Dream",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-haaland] → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-haaland --voice eleven")
