#!/usr/bin/env python3
"""kickoffdaily90 — World Cup 2026 FINAL review narration (Jamie-still host cards +
animated stat segments + stadium/anime b-roll). Full-time facts verified 2026-07-19:
Spain 1-0 Argentina (AET). Ferran Torres 106'. Enzo Fernandez red 90'+3 (2nd yellow).
Spain 65% poss, 20 shots (12 OT), xG 1.94; Argentina 2 shots, 0 on target, xG 0.2,
first shot 117'. Emiliano Martinez 11 saves (most in a WC final in 60+ yrs).
Golden Ball: Rodri. Golden Boot: Mbappe. Spain's 2nd WC (1 goal conceded all tournament).

Run: .venv-lipsync/bin/python scripts/build_finalreview_vo.py [--force]
"""
from __future__ import annotations
import argparse, json, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "finalreview" / "audio"

# (id, kind, text, tone)  — kind: host | stats | seg  (drives FinalReview.tsx)
BEATS: list[tuple[str, str, str, str]] = [
    ("i_intro", "host",
     "Spain are champions of the world. And they did it in the most brutal way imaginable — by suffocating Lionel Messi and Argentina so completely that, across a hundred and twenty minutes, Argentina did not manage a single shot on target. Welcome to the full breakdown of the twenty twenty-six World Cup final. Every stat, every moment, everything.",
     "awe"),
    ("open", "seg",
     "MetLife Stadium, New Jersey. The reigning European champions against the reigning world champions. Ferran Torres' extra-time strike settled it: Spain one, Argentina nil, after a hundred and twenty gruelling minutes. But that scoreline does not begin to tell you how one-sided this was.",
     "confidence"),
    ("stakes", "seg",
     "The stakes could not have been higher. For Spain, a chance to be crowned the best team on the planet to go with their European crown. For Argentina, and for a thirty-nine-year-old Lionel Messi, one last, impossible shot at glory. A storybook farewell. Football, though, does not always write happy endings.",
     "sadness"),
    ("road_esp", "seg",
     "Look at how the two finalists arrived here. Spain were, frankly, terrifying. Seven matches, and just one goal conceded in the entire tournament. They had not trailed for a single minute of the knockout rounds. A relentless, suffocating machine.",
     "confidence"),
    ("road_arg", "seg",
     "Argentina's road was very different. Dramatic, nervy, and late. Twelve of their nineteen tournament goals came after the seventy-fifth minute. This was a team that lived on the edge, on Messi's magic and Emiliano Martinez's saves, riding their luck all the way to the final.",
     "excitement"),
    ("teams", "seg",
     "The line-ups. Spain set up in a four-two-three-one: Unai Simon in goal; a back four of Porro, the seventeen-year-old Pau Cubarsi, Laporte and Cucurella; Rodri and Fabian Ruiz screening; Lamine Yamal, Dani Olmo and Baena behind Mikel Oyarzabal. Argentina answered in a four-four-two: Martinez; Montiel, Romero, Lisandro Martinez, Tagliafico; De Paul, Enzo Fernandez, Mac Allister, Nico Gonzalez; and up top, Julian Alvarez alongside Messi.",
     "confidence"),
    ("ko", "seg",
     "From the first whistle, the pattern was set. Spain took the ball, and they did not give it back. Argentina dropped into two banks of four and hoped to survive. It was less a football match and more a siege.",
     "confidence"),
    ("dom", "stats",
     "And the possession numbers tell that story. Sixty-five percent of the ball for Spain. They passed Argentina dizzy, moving them side to side, waiting for the cracks to open. Argentina barely touched it in the final third all night.",
     "confidence"),
    ("shots", "stats",
     "But possession is nothing without threat. So look at the shots. Twenty for Spain, two for Argentina. Twelve of Spain's shots were on target. Argentina's tally on target? Zero. Across the whole match. In a World Cup final.",
     "excitement"),
    ("yamal", "seg",
     "The chief tormentor was Lamine Yamal. Just eighteen years old, and playing in a World Cup final like it was a Tuesday-night kickabout. He roasted the Argentine left flank again and again, cutting inside onto that lethal left foot. Argentina had no answer for him.",
     "excitement"),
    ("mart", "seg",
     "So why, after ninety minutes, was it still nil-nil? One reason, and one reason only. Emiliano Martinez. The Argentine goalkeeper, so often the villain, produced the game of his life to keep his country breathing.",
     "awe"),
    ("mart_stat", "stats",
     "Eleven saves. Eleven. That is the most by any goalkeeper in a World Cup final in over sixty years. Low to his right, tipping over the bar, spreading himself one-on-one. For a hundred and five minutes, Martinez, almost single-handedly, kept the score at nil-nil.",
     "awe"),
    ("messi1", "seg",
     "And the man everyone came to see? Messi was starved. ESPN rated him three out of ten. Every time he dropped in to find the ball, two and three Spanish shirts swarmed him. Rodri and Fabian Ruiz never let him turn. It was a tactical smothering, and it was painful to watch.",
     "sadness"),
    ("ht", "stats",
     "So the sides went in level at the break, but the expected goals already screamed the truth. Spain were carving chance after chance; Argentina were creating almost nothing. The dam was holding — but only just.",
     "fear"),
    ("dom_xg", "stats",
     "By full time the expected goals were staggering. One point nine four for Spain, to zero point two for Argentina. Nearly two goals' worth of chances against almost nothing. On most nights, this is four or five nil. Argentina were hanging on by their fingernails.",
     "confidence"),
    ("subs", "seg",
     "The managers rolled the dice. Luis de la Fuente kept pressing for the winner. Lionel Scaloni threw on fresh legs and prayed to reach penalties, where his goalkeeper could be a hero again. For ninety-three minutes, that plan was working.",
     "confidence"),
    ("hinge", "host",
     "And then, deep into stoppage time at the end of normal time, the entire final turned on one reckless, needless moment.",
     "fear"),
    ("red", "seg",
     "Enzo Fernandez. Already booked for dissent. He lunged into a challenge on the teenager Cubarsi, studs up, late. The referee reached straight for his pocket. Second yellow. Red card. Ninety minutes, plus three. And now Argentina would have to survive all of extra time... a man down.",
     "shock"),
    ("et", "seg",
     "Thirty minutes of extra time. A tiring Argentina, reduced to ten men, against a Spain side with fresh legs and total belief. It was a dam about to burst. And it did not take long.",
     "fear"),
    ("goal", "seg",
     "The hundred and sixth minute. The first minute of extra time. The ball drops to Ferran Torres, twenty yards out. No hesitation. He rifles it high into the roof of the net. Martinez, finally, beaten. One-nil, Spain. And you knew, instantly, there would be no way back.",
     "excitement"),
    ("goal_ctx", "stats",
     "Because think about the mountain in front of Argentina. Not a single shot on target all match. Their first attempt of any kind did not arrive until the hundred and seventeenth minute. Ten men, chasing a game they had never led, against the meanest defence on Earth. It was over.",
     "confidence"),
    ("whistle", "seg",
     "The final whistle. Spain erupt. And in the middle of it all, a still, broken figure. Lionel Messi, on his knees on the turf, staring at nothing.",
     "sadness"),
    ("ratings_esp", "stats",
     "Let's talk performances. For Spain, this was a team display for the ages, but a few stood tallest. Rodri was imperious, running the game from deep. Cubarsi, at seventeen, was flawless. Yamal was the most dangerous player on the pitch. And Ferran Torres came off the bench to write his name into history.",
     "confidence"),
    ("ratings_arg", "stats",
     "For Argentina, it is a strange thing to rate a team that lost while barely being outplayed in spirit. Martinez was a nine out of ten in a losing cause. Cristian Romero and Lisandro Martinez threw their bodies at everything. But the front line, Messi included, was starved into silence.",
     "sadness"),
    ("awards", "stats",
     "The individual honors. The Golden Ball, for the tournament's best player, went to Rodri — the beating heart of Spain's midfield. And the Golden Boot, for the top scorer, went to Kylian Mbappe of France, who pipped Messi in the race for the goals.",
     "confidence"),
    ("messi2", "seg",
     "But the story everyone will remember is Messi. Almost certainly his final World Cup match, at thirty-nine years old. Eight goals in the tournament. A runners-up medal he could barely bring himself to wear. The greatest player of all time, denied one last miracle.",
     "sadness"),
    ("messi_legacy", "seg",
     "And let's be clear: this does not dim him. A World Cup already won in twenty twenty-two. Everything the game has to give, given and taken. But sport can be cruel, and tonight it was cruel to the genius who gave us so much. A quiet, painful goodbye.",
     "sadness"),
    ("spain", "seg",
     "The night, though, belonged to Spain. Their second World Cup, and their first since twenty ten. A golden generation — teenagers and veterans fused into one merciless unit — now sit on top of the entire footballing world.",
     "awe"),
    ("tourn", "stats",
     "And here is the stat that should frighten every other nation. In seven matches across this World Cup, Spain conceded exactly one goal. One. They never trailed in the knockouts. This was not a lucky run. This was the most dominant tournament campaign in a generation.",
     "awe"),
    ("whatnext", "seg",
     "So what now? For Spain, this could be the start of a dynasty — Yamal and Cubarsi are teenagers who will define the next decade. For Argentina, the hardest question in football: how do you replace Lionel Messi? Tonight, the answer was written in white and red.",
     "confidence"),
    ("verdict", "host",
     "So that is your twenty twenty-six World Cup final. A goalkeeping masterclass in defeat, a red card that cracked the game open, an extra-time dagger from Ferran Torres, and a heartbreaking goodbye to the greatest we have ever seen. Spain, deserved, ruthless champions of the world.",
     "confidence"),
    ("cta", "seg",
     "If you made it this far, you are a real one. Drop who your player of the tournament was in the comments, and subscribe to kickoffdaily90 — every big match, broken down the night it happens. See you next time.",
     "excitement"),
]
BEATS = [(b[0], b[2], b[3]) for b in BEATS]  # build_vo needs (id, text, tone)


def duration(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path)], capture_output=True, text=True)
    try:
        return float(out.stdout.strip())
    except ValueError:
        return 0.0


def main() -> None:
    ap = argparse.ArgumentParser(); ap.add_argument("--force", action="store_true")
    args = ap.parse_args(); OUT.mkdir(parents=True, exist_ok=True)
    durs = {}
    for bid, text, tone in BEATS:
        dst = OUT / f"{bid}.mp3"
        if dst.exists() and not args.force:
            durs[bid] = round(duration(dst), 3); print(f"skip {bid} ({durs[bid]}s)"); continue
        try:
            raw = cartesia.tts(text, tone=tone)
        except TypeError:
            raw = cartesia.tts(text)
        dst.write_bytes(raw)
        durs[bid] = round(duration(dst), 3)
        print(f"->  {bid}.mp3  {durs[bid]}s")
    (OUT.parent / "durations.json").write_text(json.dumps(durs, indent=1))
    total = sum(durs.values())
    print(f"\n{len(BEATS)} clips · {total/60:.1f} min narration · durations -> finalreview/durations.json")


if __name__ == "__main__":
    main()
