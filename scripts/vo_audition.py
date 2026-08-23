#!/usr/bin/env python3
"""VO audition harness — head-to-head narrator comparison for Akshay's EAR.

Born from real viewer complaints (2026-08, MH370-Netflix comments: "Using an
AI voice is not a great look... unnatural pacing, intonation, and multiple
mispronunciations" / "why can't they use a plain ole American voice?").
The channel's run-by-EAR rule applies: no voice change ships without a human
listening. This script produces the evidence — the same two real passages
synthesized across the current clone and the strongest Cartesia library
narrator candidates, at the production model/speed, into one folder with an
index. Listen, pick, then update DEFAULT_VOICE in scripts/lib/cartesia.py.

    .venv-lipsync/bin/python scripts/vo_audition.py [--out out/qa/vo_audition]

Cost: ~12 short clips of Cartesia quota (cents). Idempotent per clip.
"""
from __future__ import annotations
import argparse, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent

# Candidates: id -> (label, why it's in the running)
VOICES = {
    cartesia.ORION_CLONE_VOICE: ("orion-clone",
        "Narrator 2026-07-07→08-22 (Veo-clone) — the voice the complaints were about."),
    cartesia.CLIVE_VOICE: ("clive-measured-expert",
        "Previous default, kept as fallback — composed educational delivery."),
    "5568a7df-e5ab-4442-9fae-2e9ba1b15ad8": ("quentin-refined-narrator",
        "Cartesia library: 'Polished narrator with a measured pace' — the on-paper best fit."),
    "79f8b5fb-2cc8-479a-80df-29f7a7cf1a3e": ("theo-modern-narrator",
        "Cartesia library: 'Steady, enunciating, confident young male for narrations'."),
    "5ee9feff-1265-424a-9d7f-8e4d431a12c7": ("ronald-thinker",
        "Cartesia library: 'Intense, deep young adult male' — gravitas option."),
    cartesia.DEFAULT_VOICE: ("grant-neutral-american",
        "CURRENT narrator (Akshay ear-pick 2026-08-22): 'neutral American accent'."),
}

# Two REAL production passages (from the Apollo 13 episode) so the comparison
# is on actual channel content: one dense-factual, one dramatic-reveal.
PASSAGES = {
    "factual": (
        "The tank's safety thermostat is only rated for twenty eight volts — "
        "the normal voltage in flight. Nobody had ever re-tested it at sixty five. "
        "Under that much power, the switch does not open like it's supposed to. "
        "It welds itself shut."
    ),
    "dramatic": (
        "Two minutes later, the spacecraft slams sideways. This is the real radio "
        "call — not the line from the movie. Jack Swigert: \"Okay, Houston, I "
        "believe we've had a problem here.\""
    ),
}
SPEED = 0.97  # production default — compare at the real setting


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="out/qa/vo_audition")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    out = REPO / args.out
    out.mkdir(parents=True, exist_ok=True)

    rows = []
    for vid, (label, why) in VOICES.items():
        for pkey, text in PASSAGES.items():
            dst = out / f"{label}__{pkey}.mp3"
            if dst.exists() and not args.force:
                print(f"    (exists) {dst.name}")
            else:
                try:
                    audio = cartesia.tts(text, voice=vid, speed=SPEED)
                    dst.write_bytes(audio)
                    print(f"->  {dst.name} ({len(audio)}b)")
                except SystemExit as e:
                    print(f"!!  {label}/{pkey} failed: {e}")
                    continue
            rows.append((label, pkey, dst.name, why))

    idx = out / "INDEX.md"
    lines = ["# VO audition — listen in order, per passage\n",
             f"Model: {cartesia.MODEL} · speed {SPEED} · passages from the real Apollo 13 script\n"]
    for pkey in PASSAGES:
        lines.append(f"\n## Passage: {pkey}\n")
        for label, pk, fname, why in rows:
            if pk == pkey:
                lines.append(f"- `{fname}` — **{label}**: {why}")
    lines.append("\n\nPick by ear. To switch: update DEFAULT_VOICE in "
                 "scripts/lib/cartesia.py (and note the change in CLAUDE.md's "
                 "channel table). A switch applies to FUTURE episodes only — "
                 "never re-synth an already-rendered episode's clips mid-catalog.")
    idx.write_text("\n".join(lines))
    print(f"\nindex -> {idx}")


if __name__ == "__main__":
    main()
