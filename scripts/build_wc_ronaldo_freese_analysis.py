#!/usr/bin/env python3
"""One-off kickoffdaily90 16:9 long-form: two Round of 16 storylines from the
same day — Ronaldo's confirmed last World Cup (Portugal 0-1 Spain, Merino's
90+1' winner, coach Roberto Martínez's resignation) and USA's elimination via
goalkeeper Matt Freese's costly 57th-minute error (USA 1-4 Belgium). Facts
verified against football-data.org match JSON, Wikipedia's match-report
wikitext, and ESPN's match report (Freese error, ESPN gameId 760507) plus
Ronaldo's own quotes (Sky Sports, Al Jazeera, Fox Sports) — he confirmed this
was his last World Cup but did NOT announce full international retirement,
so the script says exactly that, not more.

Usage: .venv-lipsync/bin/python3 scripts/build_wc_ronaldo_freese_analysis.py
Then:  python3 scripts/build_short.py wc-ronaldo-freese-analysis --voice eleven
       python3 scripts/gen_broll_gemini.py wc-ronaldo-freese-analysis
       .venv-lipsync/bin/python lipsync/batch.py wc-ronaldo-freese-analysis --only hook --engine veo
       npx remotion render RonaldoFreeseAnalysisWide out/wc_ronaldo_freese_analysis.mp4
       (first time: register in Root.tsx)
"""
import json
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PLAN_PATH = REPO / "src/viral/plans/wc-ronaldo-freese-analysis.json"

PORTUGAL = "shorts/_wc-crests/765.svg"
SPAIN = "shorts/_wc-crests/760.svg"
BELGIUM = "shorts/_wc-crests/805.svg"


def build_plan() -> dict:
    scenes = [
        {
            "id": "hook",
            "kind": "hook",
            "start": 0, "end": 8,
            "voiceover": "Two Round of 16 storylines from the same day — one ended a legend's World Cup, the other ended a co-host's tournament with a goalkeeping disaster.",
            "mainText": "ONE DAY. TWO WORLD CUP DISASTERS.",
            "emphasis": ["TWO WORLD CUP DISASTERS"],
            "kicker": "ROUND OF 16 — JULY 6",
            "visualConcept": "cold open",
            "backgroundPrompt": "A split, dramatic stadium scene at dusk, two "
                                 "different football matches happening in "
                                 "parallel, cinematic painterly illustration, "
                                 "no text, no watermark",
            "emotionalTone": "shock",
            "transitionOut": "whip",
        },
        {
            "id": "por-score",
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
            "voiceover": "Mikel Merino scored the winner in the first minute of stoppage time — 90 plus 1.",
            "mainText": "MERINO SCORED IN STOPPAGE TIME — 90+1'",
            "emphasis": ["90+1'"],
            "kicker": "90+1' — MERINO",
            "visualConcept": "decisive late goal moment",
            "backgroundPrompt": "A footballer in a red kit sprinting in explosive "
                                 "celebration after scoring a last-second winning "
                                 "goal, stadium floodlights, roaring crowd, "
                                 "cinematic painterly illustration, no text, no watermark",
            "emotionalTone": "excitement",
            "transitionOut": "cut",
        },
        {
            "id": "ronaldo-before",
            "kind": "quote",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Before kickoff, Cristiano Ronaldo had already said it: 'This will be my last World Cup, but let's hope tomorrow isn't my last game.'",
            "mainText": "\"THIS WILL BE MY LAST WORLD CUP\"",
            "emphasis": [],
            "kicker": "RONALDO — BEFORE THE MATCH",
            "visualConcept": "quote card",
            "emotionalTone": "awe",
            "transitionOut": "cut",
        },
        {
            "id": "ronaldo-after",
            "kind": "quote",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "After the loss, he confirmed it: 'It's been my last World Cup, yes. But now I will have time to think, stay with my family, and life continues.'",
            "mainText": "\"IT'S BEEN MY LAST WORLD CUP\"",
            "emphasis": [],
            "kicker": "RONALDO — AFTER THE MATCH",
            "visualConcept": "quote card",
            "emotionalTone": "awe",
            "transitionOut": "cut",
        },
        {
            "id": "resignation",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Minutes later, Portugal's head coach Roberto Martínez announced his resignation, effective immediately.",
            "mainText": "PORTUGAL'S COACH RESIGNED — EFFECTIVE IMMEDIATELY",
            "emphasis": ["RESIGNED", "IMMEDIATELY"],
            "kicker": "IMMEDIATE FALLOUT",
            "visualConcept": "emotional aftermath",
            "backgroundPrompt": "A football manager in a suit standing alone in "
                                 "an empty stadium tunnel, head down, walking "
                                 "away, somber and final, cinematic painterly "
                                 "illustration, no text, no watermark",
            "emotionalTone": "awe",
            "transitionOut": "cut",
        },
        {
            "id": "transition",
            "kind": "hook",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Meanwhile, in Seattle, a World Cup co-host was falling apart in a completely different way.",
            "mainText": "MEANWHILE, IN SEATTLE...",
            "emphasis": [],
            "kicker": "USA vs BELGIUM",
            "visualConcept": "transition card",
            "emotionalTone": "curiosity",
            "transitionOut": "cut",
        },
        {
            "id": "usa-score",
            "kind": "comparison",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "Round of 16: USA 1, Belgium 4.",
            "mainText": "USA 1 - 4 BELGIUM",
            "emphasis": [],
            "kicker": "ROUND OF 16 — JUL 6",
            "visualConcept": "fixture comparison card",
            "compare": {"left": "USA  1", "right": "4  BELGIUM", "rightImg": BELGIUM},
            "emotionalTone": "shock",
            "transitionOut": "cut",
        },
        {
            "id": "freese-error",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "USA goalkeeper Matt Freese came out of his area, hesitated, and booted the ball straight to Belgium's Hans Vanaken, who fired it back in from thirty yards for the 57th-minute goal.",
            "mainText": "USA'S GOALKEEPER GIFTED BELGIUM THE THIRD GOAL",
            "emphasis": ["GIFTED"],
            "kicker": "57' — FREESE'S ERROR",
            "visualConcept": "goalkeeping error moment",
            "backgroundPrompt": "A goalkeeper in a white kit standing alone in "
                                 "an open goal area, head in hands, stadium "
                                 "lights above, a moment of visible despair, "
                                 "cinematic painterly illustration, no text, no watermark",
            "emotionalTone": "shock",
            "transitionOut": "cut",
        },
        {
            "id": "co-host",
            "kind": "shockfact",
            "board": True,
            "start": 0, "end": 0,
            "voiceover": "The United States became the final World Cup co-host to be eliminated — after Canada fell to Morocco, and Mexico fell to England.",
            "mainText": "USA: THE LAST CO-HOST STANDING — NOW ELIMINATED",
            "emphasis": ["LAST CO-HOST"],
            "kicker": "CANADA • MEXICO • USA — ALL OUT",
            "visualConcept": "historical stat card",
            "emotionalTone": "shock",
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
        "slug": "wc-ronaldo-freese-analysis",
        "title": "Ronaldo's Last World Cup Ends — And a Co-Host's Goalkeeper Meltdown",
        "host": "jamie",
        "channel": "kickoffdaily90",
        "scenes": scenes,
    }


if __name__ == "__main__":
    plan = build_plan()
    PLAN_PATH.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"[wc-ronaldo-freese-analysis] {len(plan['scenes'])} scenes → {PLAN_PATH}")
    print("Next: python3 scripts/build_short.py wc-ronaldo-freese-analysis --voice eleven")
