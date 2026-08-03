#!/usr/bin/env python3
"""
codewired podcast — two-host dialogue VO builder.

Reads a dialogue script (list of turns, each {id, speaker, text, tone?}) from
scripts/codewired/podcast_script.py, generates one Cartesia clip per turn using
the SPEAKER'S OWN voice (two already-configured, distinct pinned voices — no
new cloning), and writes manifest.json with per-clip word timings + which
speaker spoke it (the Remotion side reads `speaker` to pick cyan/amber).

Idempotent per clip, same convention as build_audio.py. Every clip is
ffprobe-validated (duration < 1s = failed/empty TTS, abort loudly).

Run:  .venv-lipsync/bin/python scripts/codewired/build_podcast_audio.py [--episode NAME]
Out:  public/codewired/podcast/audio/<turn_id>.mp3 + manifest.json
"""
import argparse
import importlib
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO / "scripts" / "lib"))
import cartesia  # noqa: E402

SLUG = "codewired/podcast"
OUT = REPO / "public" / SLUG / "audio"

# Two distinct, already-pinned Cartesia voices — no new cloning needed.
# DEV  = the channel's main narrator clone (measured, skeptical senior-engineer tone)
# VIBE = the previous default "Clive" voice (energetic, builder/enthusiast tone)
VOICE_FOR_SPEAKER = {
    "A": cartesia.DEFAULT_VOICE,  # DEV
    "B": cartesia.CLIVE_VOICE,    # VIBE
}
SPEED_FOR_SPEAKER = {"A": 0.95, "B": 1.0}  # VIBE talks slightly faster/looser


def dur_of(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
         "csv=p=0", str(path)], capture_output=True, text=True).stdout.strip()
    return round(float(out), 3)


def timings(words, dur, lead=0.15, tail=0.25):
    n = len(words)
    usable = max(0.1, dur - lead - tail)
    step = usable / max(n, 1)
    return [{"word": w, "start": round(lead + i * step, 3),
              "end": round(lead + i * step + step * 0.9, 3)} for i, w in enumerate(words)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--episode", default="podcast_script",
                     help="module name in scripts/codewired/ exporting TURNS")
    args = ap.parse_args()

    mod = importlib.import_module(args.episode)
    turns = mod.TURNS

    OUT.mkdir(parents=True, exist_ok=True)
    man_path = OUT / "manifest.json"
    manifest = {"clips": {}}
    if man_path.exists():
        manifest = json.loads(man_path.read_text())

    for t in turns:
        tid, speaker, text = t["id"], t["speaker"], t["text"]
        mp3 = OUT / f"{tid}.mp3"
        entry = manifest["clips"].get(tid, {})
        if mp3.exists() and entry and not entry.get("estimated") and entry.get("speaker") == speaker:
            print(f"  {tid:<12} [{speaker}] exists ({entry['dur']:.1f}s) — skip")
            continue
        voice = VOICE_FOR_SPEAKER[speaker]
        speed = SPEED_FOR_SPEAKER[speaker]
        audio = cartesia.tts(text, voice=voice, tone=t.get("tone"), speed=speed)
        mp3.write_bytes(audio)
        d = dur_of(mp3)
        if d < 1.0:
            sys.exit(f"FATAL: {tid} rendered {d}s — empty/failed TTS, aborting")
        words = timings(text.split(), d)
        manifest["clips"][tid] = {"dur": d, "words": words, "speaker": speaker,
                                   "provider": "cartesia"}
        man_path.write_text(json.dumps(manifest, indent=2))
        print(f"  {tid:<12} [{speaker}] {d:6.1f}s  ({len(words)} words)")

    total = sum(c["dur"] for c in manifest["clips"].values())
    print(f"done — {len(manifest['clips'])} turns, {total/60:.1f} min spoken -> {man_path}")

    # Export the turn structure (id/speaker/chapter/gap, no audio) for the
    # Remotion side to build the timeline from — single source of truth stays
    # this Python script; TS never hand-duplicates the dialogue.
    turns_path = OUT.parent / "turns.json"
    turns_path.write_text(json.dumps(
        [{"id": t["id"], "speaker": t["speaker"], "chapter": t.get("chapter", ""),
          "gap": t.get("gap", 0)} for t in turns], indent=2))
    print(f"turns -> {turns_path}")


if __name__ == "__main__":
    main()
