#!/usr/bin/env python3
"""One-off kickoffdaily90 16:9 long-form: Neymar's last match, Brazil's
earliest World Cup exit since 1990, and the Golden Boot + England threads that
converge on the July 11 quarterfinal. Narrative story format (not a highlights
reel) — research this session found that angle underserved even by big
outlets covering the raw event. All facts verified against football-data.org
match JSON and Wikipedia's match-report wikitext / goalscorers data module.

Hook scene uses a real Veo 3.1 Fast talking clip for host "rio" (~$1-2, well
under the $3 kickoffdaily90 cap) — NOT Replicate/Sonic, which is banned per
standing instruction. Everything else is $0: kinetic board scenes + Gemini
broll.

Usage: .venv-lipsync/bin/python3 scripts/build_wc_neymar_legacy.py
Then:  python3 scripts/build_short.py wc-neymar-legacy --voice eleven
       python3 scripts/gen_broll_gemini.py wc-neymar-legacy
       .venv-lipsync/bin/python lipsync/batch.py wc-neymar-legacy --only hook --engine veo
       npx remotion render NeymarLegacyWide out/wc_neymar_legacy.mp4
       (first time: register in Root.tsx)
"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
from fetch_football_stats import crest_path  # noqa: E402

PLAN_PATH = REPO / "src/viral/plans/wc-neymar-legacy.json"

BRAZIL = crest_path(764, "Brazil")
NORWAY = crest_path(813, "Norway")
JAPAN = crest_path(766, "Japan")
ENGLAND = crest_path(770, "England")
MEXICO = crest_path(769, "Mexico")


def build_plan() -> dict:
    scenes = [
        {
            # NOT board:true — Veo talking clips need a non-board scene so the
            # facecam bubble renders (see lipsync/batch.py --engine veo).
            "id": "hook",
            "kind": "hook",
            "start": 0, "end": 8,
            "voiceover": "Brazil's World Cup dream just died — and their biggest star just played his very last game for the national team.",
            "mainText": "BRAZIL'S WORLD CUP DREAM JUST DIED",
            "emphasis": ["JUST DIED"],
            "kicker": "NEYMAR'S LAST MATCH",
            "visualConcept": "cold open",
            "backgroundPrompt": "A lone footballer walking off a dark stadium pitch under "
                                 "fading floodlights, back turned to camera, somber and final, "
                                 "cinematic painterly illustration, no text, no watermark",
            "emotionalTone": "shock",
            "transitionOut": "whip",
        },
        {
            "id": "favorites",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Brazil came into this tournament as five-time champions and heavy favorites — a draw with Morocco, then routs of Haiti and Scotland, three goals each.",
            "mainText": "BRAZIL LOOKED UNSTOPPABLE IN THE GROUP STAGE",
            "emphasis": ["UNSTOPPABLE"],
            "kicker": "5-TIME CHAMPIONS",
            "visualConcept": "context setup",
            "backgroundPrompt": "A football team celebrating together on the pitch after "
                                 "a win, yellow and green kits, confident and joyful, "
                                 "cinematic painterly illustration, no text, no watermark",
            "emotionalTone": "confidence",
            "transitionOut": "cut",
        },
        {
            "id": "japan",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Round of 32: Brazil 2, Japan 1. Still rolling.",
            "mainText": "BRAZIL 2 - 1 JAPAN",
            "emphasis": [],
            "kicker": "ROUND OF 32",
            "visualConcept": "fixture comparison card",
            "compare": {"left": "BRAZIL  2", "right": "1  JAPAN", "leftImg": BRAZIL, "rightImg": JAPAN},
            "emotionalTone": "confidence",
            "transitionOut": "cut",
        },
        {
            "id": "score",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Then, the Round of 16: Brazil 1, Norway 2.",
            "mainText": "BRAZIL 1 - 2 NORWAY",
            "emphasis": [],
            "kicker": "ROUND OF 16 — JUL 5",
            "visualConcept": "fixture comparison card",
            "compare": {"left": "BRAZIL  1", "right": "2  NORWAY", "leftImg": BRAZIL, "rightImg": NORWAY},
            "emotionalTone": "shock",
            "transitionOut": "cut",
        },
        {
            "id": "haaland",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Erling Haaland scored both Norway goals — the 79th minute, then the 90th-minute winner.",
            "mainText": "HAALAND SCORED TWICE — INCLUDING THE 90TH MINUTE WINNER",
            "emphasis": ["TWICE", "90TH MINUTE WINNER"],
            "kicker": "79' & 90' — HAALAND",
            "visualConcept": "decisive goal moment",
            "backgroundPrompt": "A footballer in a white and blue kit sprinting in wild "
                                 "celebration after scoring a late winning goal, stadium "
                                 "floodlights, roaring crowd, cinematic painterly "
                                 "illustration, no text, no watermark",
            "emotionalTone": "excitement",
            "transitionOut": "cut",
        },
        {
            "id": "neymar",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Neymar pulled one back with a stoppage-time penalty, in the tenth minute of added time — too little, too late. Then, right after the final whistle, he announced his international retirement.",
            "mainText": "NEYMAR'S PENALTY CAME TOO LATE — THEN HE RETIRED",
            "emphasis": ["TOO LATE", "RETIRED"],
            "kicker": "90+10' PEN. — NEYMAR'S FINAL MATCH",
            "visualConcept": "emotional final moment",
            "backgroundPrompt": "A lone footballer in a yellow kit standing on the pitch "
                                 "looking down, head bowed, stadium lights dimming around "
                                 "him, quiet emotional moment after a loss, cinematic "
                                 "painterly illustration, no text, no watermark",
            "emotionalTone": "awe",
            "transitionOut": "cut",
        },
        {
            "id": "history",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "This is Brazil's earliest World Cup exit since 1990 — thirty-six years ago.",
            "mainText": "BRAZIL'S EARLIEST WORLD CUP EXIT SINCE 1990",
            "emphasis": ["EARLIEST", "1990"],
            "kicker": "36 YEARS",
            "visualConcept": "historical stat card",
            "emotionalTone": "shock",
            "transitionOut": "cut",
        },
        {
            "id": "goldenboot",
            "kind": "data",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "That brace also pulled Haaland level with Messi and Mbappé at the top of the Golden Boot race — seven goals each.",
            "mainText": "HAALAND'S BRACE PULLED HIM LEVEL FOR THE GOLDEN BOOT",
            "emphasis": ["LEVEL"],
            "kicker": "GOLDEN BOOT RACE",
            "visualConcept": "top scorers bar chart",
            "stat": {"to": 0, "bars": [
                {"label": "Lionel Messi (ARG)", "value": 7},
                {"label": "Kylian Mbappé (FRA)", "value": 7},
                {"label": "Erling Haaland (NOR)", "value": 7},
            ]},
            "emotionalTone": "excitement",
            "transitionOut": "cut",
        },
        {
            "id": "england",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "On the same day, England also advanced — beating Mexico 3-2 in the Round of 16.",
            "mainText": "ENGLAND ALSO ADVANCED TODAY",
            "emphasis": [],
            "kicker": "ROUND OF 16 — JUL 6",
            "visualConcept": "fixture comparison card",
            "compare": {"left": "MEXICO  2", "right": "3  ENGLAND", "leftImg": MEXICO, "rightImg": ENGLAND},
            "emotionalTone": "curiosity",
            "transitionOut": "cut",
        },
        {
            "id": "nextup",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Which sets up the Quarterfinals: Norway versus England, July 11th.",
            "mainText": "NORWAY NOW FACES ENGLAND — QUARTERFINALS, JULY 11",
            "emphasis": ["ENGLAND"],
            "kicker": "QUARTERFINALS — JUL 11",
            "visualConcept": "sequel tease",
            "compare": {"left": "NORWAY", "right": "ENGLAND", "leftImg": NORWAY, "rightImg": ENGLAND},
            "emotionalTone": "excitement",
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
        "slug": "wc-neymar-legacy",
        "title": "Neymar's Last Game Ended in Tears — Brazil's Earliest Exit Since 1990",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-neymar-legacy] {len(plan['scenes'])} scenes → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-neymar-legacy --voice eleven")
