#!/usr/bin/env python3
"""kickoffdaily90 — "What If Argentina Wins the World Cup" narration (Cartesia
cloned narrator). 6-part, ~26-beat epic. Parts 1-2 are the REAL story (fact-checked
R16 comeback + real QF opponent); parts 3-5 are explicitly framed as "imagine/what
if" — speculative, never asserted as fact. Ends teasing the 5-video series.

Run: .venv-lipsync/bin/python scripts/build_argentina_vo.py [--force]
"""
from __future__ import annotations
import argparse, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "argentina-wc" / "audio"

BEATS: list[tuple[str, str, str]] = [
    # ---- PART 1 — THE OLD GOD ----
    ("p1_cold",    "In 2014, he lost the final, and they said his chance was gone. In 2022, he finally won it, and they said the story was complete. But now it's 2026. He's thirty-nine years old. And Lionel Messi is playing what everyone insists... is his last dance.", "awe"),
    ("p1_gods",    "This tournament has been a graveyard for gods. Ronaldo, knocked out by Spain. Modric's Croatia, gone. Neymar and Vinicius, dumped out by Norway. Salah's Egypt, broken in the cruelest way possible.", "awe"),
    ("p1_comeback","Because against Egypt, Argentina were dead. Two nil down with eight minutes left. Messi had even missed a penalty. And then the old god woke up one more time. A goal. An assist. And an Enzo Fernandez thunderbolt in stoppage time. Three two. The greatest comeback of the tournament.", "excitement"),
    ("p1_resurrection", "That was the resurrection. This... is what happens next.", "confidence"),
    ("p1_title",   "What if Argentina wins the World Cup?", "awe"),
    # ---- PART 1B — THE WEIGHT OF HISTORY ----
    ("p1b_history","To understand what that would mean, you have to understand the weight of the shirt. Nineteen seventy-eight. Nineteen eighty-six. Twenty twenty-two. Three stars. Three generations of legends — Kempes, Maradona, Messi.", "awe"),
    ("p1b_fourth", "No South American nation has ever won back-to-back World Cups in the modern era. A fourth star, in twenty twenty-six, would make this Argentina side... arguably the greatest international team of all time.", "confidence"),
    # ---- PART 2 — THE QUARTERFINAL ----
    ("p2_swiss",   "The quarterfinal. Switzerland. A team that doesn't lose to fear, because they don't feel any. Disciplined. Ruthless. For eighty minutes, they hold the door shut and dare Argentina to break it down.", "confidence"),
    ("p2_pens",    "So imagine it goes all the way. One hundred and twenty scoreless minutes. Penalties. And a shootout against Argentina means staring down Emiliano Martinez — the best penalty goalkeeper of his generation. He saves one. The stadium holds its breath. Then... he saves another.", "fear"),
    ("p2_alvarez", "And the winning kick? It isn't even Messi. Julian Alvarez. The apprentice. The one they call the spider. Ice in his veins... top corner. Argentina are through.", "excitement"),
    ("p2_torch",   "And after the whistle, a quiet moment nobody films. The master... and the next in line. Some things don't need words.", "calm"),
    # ---- PART 2B — THE MACHINE AROUND MESSI ----
    ("p2b_squad",  "Because here's what people miss about this Argentina. It was never just Messi. Enzo Fernandez, running the midfield like he owns it. Rodrigo De Paul, the bodyguard. Julian Alvarez, the future. And Emiliano Martinez — the wall that wins penalty shootouts before they even start.", "confidence"),
    ("p2b_hunger", "Half this squad already knows what lifting the trophy feels like. The other half is starving for it. That combination... is the most dangerous thing in football.", "confidence"),
    # ---- PART 3 — THE SEMIFINAL (speculative from here) ----
    ("p3_imagine", "Now — imagine the semifinal. Nobody reaches the final four of a World Cup by accident. Whoever stands across from Argentina will be the best team they've faced in years.", "curiosity"),
    ("p3_down",    "So imagine the worst start. A sucker punch inside twenty minutes. The stadium goes silent... and for the first time all tournament, Argentina look mortal.", "fear"),
    ("p3_level",   "But this team has never known how to lose quietly. Messi picks the lock — because of course he does — and drags them level before the hour.", "excitement"),
    ("p3_extra",   "Extra time. Legs gone. Lungs burning. The clock crawls past the hundred and seventeenth minute. And then — one last surge. One last ball into the box. And Argentina, somehow, find one more goal.", "excitement"),
    # ---- PART 4 — THE FINAL ----
    ("p3b_boot",   "And there's a subplot. The Golden Boot. Messi sits on eight goals — ahead of Mbappe and Haaland on seven. A World Cup, and a Golden Boot, at thirty-nine? There are video games that would reject that storyline.", "excitement"),
    # ---- PART 4 — THE FINAL ----
    ("p4_final",   "The final. One nation chasing history. One man chasing the perfect ending. Whoever the opponent is, the story writes itself — because every great story ends with a dragon.", "awe"),
    ("p4_concede", "And imagine the dragon strikes first. Argentina concede. Doubt — real doubt — creeps into the greatest fairy tale football has ever written.", "fear"),
    ("p4_equal",   "Then the equalizer. And it's nothing pretty. A scramble. A stab of a boot. The kind of goal that says: we want this more than you.", "excitement"),
    ("p4_winner",  "Eighty-ninth minute. A cutback. One touch. You already know whose touch it is. Messi. Ice cold. The final winner, in the final game, of the final dance.", "excitement"),
    ("p4_whistle", "And then... the whistle.", "awe"),
    # ---- PART 5 — THE LIFT ----
    ("p5_champions","Champions of the world. Again. Back to back.", "excitement"),
    ("p5_lift",    "Two World Cups in a row. At thirty-nine. The greatest career football has ever seen, closing with the greatest ending anyone has ever dared to imagine.", "awe"),
    ("p5_maradona","And somewhere above all of it... Diego is smiling.", "calm"),
    ("p5_parade",  "Buenos Aires doesn't sleep for a week. Five million people in the streets. A sky-blue ocean, singing one name.", "excitement"),
    ("p5_records", "Think about what would actually be true in that moment. Back-to-back world champions — only Italy and Brazil have ever done it, and nobody since nineteen sixty-two. The oldest player to ever score in a World Cup final. The first man to win it twice as captain, twenty years after his first final. Every argument about the greatest of all time... over. Permanently.", "awe"),
    ("p5_shirt",   "And when the noise finally fades, what's left is simple. A shirt. A trophy. And a story nobody will ever tell better.", "calm"),
    # ---- PART 6 — OUTRO ----
    ("p6_whatif",  "This is what if. Nobody knows how this World Cup really ends — that's exactly why we watch.", "curiosity"),
    ("p6_series",  "So... what if it's France instead? What if it's Spain? England? Norway? We're building all five endings. Tell me in the comments which one you want next.", "excitement"),
    ("p6_cta",     "And subscribe — because one of these what-ifs is about to come true.", "confidence"),
]


def duration(path: Path) -> float:
    out = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
        "-of","default=noprint_wrappers=1:nokey=1", str(path)], capture_output=True, text=True)
    try: return float(out.stdout.strip())
    except ValueError: return 0.0


def main() -> None:
    ap = argparse.ArgumentParser(); ap.add_argument("--force", action="store_true")
    args = ap.parse_args(); OUT.mkdir(parents=True, exist_ok=True)
    durs = []
    for bid, text, tone in BEATS:
        dst = OUT / f"{bid}.mp3"
        if dst.exists() and not args.force:
            print(f"skip {bid}")
        else:
            dst.write_bytes(cartesia.tts(text, tone=tone, speed=0.93))
            print(f"->  {bid}.mp3")
        durs.append((bid, duration(dst)))
    total = sum(d for _, d in durs)
    print(f"\n--- durations (total speech {total:.0f}s) ---")
    for bid, d in durs: print(f'  {{ id: "{bid}", aud: {d:.3f} }},')


if __name__ == "__main__":
    main()
