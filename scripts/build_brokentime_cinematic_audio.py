#!/usr/bin/env python3
"""
"Time Is Breaking — And You Can't Feel It" — cinematic Higgsfield re-cut of the
brokentime facts (see research/BROKENTIME-FACTS-2026-07-04.md). This is a NEW
edit, not a continuation of mindwired_brokentime.mp4 (already uploaded 2026-07-05):
Higgsfield-generated cinematic space-documentary visuals instead of the Remotion
kinetic engine, assembled with a straight ffmpeg cut (no Root.tsx comp).

Narration: Hume Octave, voice-chained for consistency, using Orion's documentary
voiceDescription from src/viral/hosts.json. Word timings via ElevenLabs
forced-alignment (Octave doesn't return reliable timestamps) — used for caption
burn-in once clips are assembled.

10 beats: 1 wordmark-intro beat (no matching Higgsfield clip — plays over the
mindwired wordmark bloom, per CLAUDE.md hook -> wordmark -> title structure) +
9 beats, one per Higgsfield shot in the brief.

Run: python3 scripts/build_brokentime_cinematic_audio.py
Writes public/brokentime-cinematic/audio/<id>.mp3 + .words.json + manifest.json.
Idempotent — skips any clip whose mp3 + manifest entry already exist.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import hume  # noqa: E402
import eleven  # noqa: E402

SLUG = "brokentime-cinematic"
REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / SLUG / "audio"

# Orion's documentary voice (src/viral/hosts.json) — same narrator brand as every
# other mindwired space video, so the channel voice stays consistent even though
# this edit skips the viral-shorts host pipeline.
ORION_VOICE = (
    "A deep, cinematic male documentary narrator for a space channel. Rich, "
    "resonant, modern — like a prestige Netflix science doc, full of quiet dread "
    "and human pauses."
)

NARRATION = [
    {"id": "hook", "higgsfield": "HOOK [Crash Zoom In]", "text": (
        "Your head is aging faster than your feet. Right now. It is not a "
        "thought experiment — it has been measured, in a lab. And it is the "
        "smallest example of something far stranger: nowhere in this universe "
        "do two clocks agree."
    )},
    {"id": "wordmark", "higgsfield": None, "text": (
        "This is Mindwired. And this is proof that time itself is broken."
    )},
    {"id": "labclock", "higgsfield": "[Dolly In]", "text": (
        "Two atomic clocks, thirty-three centimeters apart. Raise one just "
        "that little, and it starts ticking faster than the other. Over a "
        "lifetime, the gap is measurable — your head outpaces your feet by "
        "about ninety billionths of a second."
    )},
    {"id": "gps", "higgsfield": "[FPV Drone]", "text": (
        "Twenty thousand kilometers above you, a GPS satellite is quietly "
        "disagreeing with the ground. Its speed slows its clock. Weaker "
        "gravity speeds it back up. Left uncorrected, that mismatch would "
        "throw your location off by ten kilometers a day — so engineers built "
        "the clock deliberately wrong, just so it would become right in orbit."
    )},
    {"id": "core", "higgsfield": "[Pull Back]", "text": (
        "Point that same physics straight down. The deeper you go, the slower "
        "time runs. Over four and a half billion years, gravity has made the "
        "center of the Earth about two and a half years younger than the "
        "ground beneath your feet."
    )},
    {"id": "iss", "higgsfield": "[Orbit]", "text": (
        "Two hundred fifty miles up, the same rules apply to a human being. "
        "Orbiting at seventeen thousand miles an hour bends an astronaut's "
        "clock far more than the weaker gravity up there speeds it back up."
    )},
    {"id": "kelly", "higgsfield": "[Bullet Time]", "text": (
        "After three hundred forty days in space, astronaut Scott Kelly came "
        "home about five milliseconds younger than his identical twin, still "
        "standing on Earth. He did not imagine the future. He traveled into it."
    )},
    {"id": "s2", "higgsfield": "[Crane Down]", "text": (
        "Push the effect to its limit, and you get this: a star, swinging past "
        "a black hole four million times the mass of our Sun, at nearly three "
        "percent of the speed of light. Its light stretched exactly the way "
        "Einstein predicted — a century before anyone could prove it."
    )},
    {"id": "clockwall", "higgsfield": "[Static + Slow Push]", "text": (
        "GPS satellites. The Moon. Mars. The surface of the Sun. Every clock "
        "in this universe is running at its own private speed. There is no "
        "master clock, anywhere. Now only exists exactly where you are "
        "standing."
    )},
    {"id": "cta", "higgsfield": "CTA [Dolly Out]", "text": (
        "You will never feel any of this. Your own clock always ticks "
        "normally — it is everyone else's that drifts. Time is not one river. "
        "It is billions of them, all flowing at different speeds. Subscribe "
        "to Mindwired. Yours is running out."
    )},
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    man_path = OUT / "manifest.json"
    manifest = {"clips": {}}
    if man_path.exists():
        manifest = json.loads(man_path.read_text())
        manifest.setdefault("clips", {})

    print(f"[{SLUG}] generating Orion narration via Hume Octave + ElevenLabs alignment")
    prev_gen = None
    for c in NARRATION:
        cid, text = c["id"], c["text"]
        mp3_path = OUT / f"{cid}.mp3"
        if cid in manifest["clips"] and mp3_path.exists():
            print(f"  skip {cid} (already built)")
            continue
        print(f"  hume {cid} ...", flush=True)
        audio, prev_gen = hume.tts(text, description=ORION_VOICE, context_gen=prev_gen)
        mp3_path.write_bytes(audio)
        words = eleven.forced_align(audio, text)
        (OUT / f"{cid}.words.json").write_text(json.dumps(words))
        manifest["clips"][cid] = {
            "kind": "spoken",
            "dur": eleven.mp3_duration(mp3_path),
            "words": words,
            "voice": "hume-octave-orion",
            "higgsfield": c["higgsfield"],
        }
        man_path.write_text(json.dumps(manifest, indent=2))
        print(f"    -> {manifest['clips'][cid]['dur']}s, {len(words)} words")

    man_path.write_text(json.dumps(manifest, indent=2))
    total = sum(v["dur"] for v in manifest["clips"].values())
    print(f"[{SLUG}] done. Total narration: {total:.1f}s across {len(manifest['clips'])} beats.")
    print(f"Audio in {OUT} — time Higgsfield clips to each beat's duration before generating.")


if __name__ == "__main__":
    main()
