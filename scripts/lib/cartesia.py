#!/usr/bin/env python3
"""Cartesia Sonic-2 TTS — an alternative expressive narrator to Hume Octave.

Sonic-2 reads natural punctuation as prosody (a period is a bigger pause than a
comma) and supports inline `<break time="500ms"/>` tags for explicit human-like
pauses, plus per-request `emotion` tags in experimental_controls for delivery.

No word-level timestamps from the bytes endpoint, so callers estimate word
timing the same way as the Hume path (see scripts/build_short.py).

Requires: httpx (repo venv: .venv-lipsync)  |  Env: CARTESIA_API_KEY in .env
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

import httpx

API = "https://api.cartesia.ai/tts/bytes"
VERSION = "2024-11-13"
REPO = Path(__file__).resolve().parent.parent.parent

# Channel narrator = "Grant - neutral American" (Cartesia library voice) —
# Akshay's ear-check pick 2026-08-22 from the 6-voice audition
# (scripts/vo_audition.py, out/qa/vo_audition/). Chosen for exactly what real
# viewers asked for ("plain ole American voice") and the most human pause
# structure of the set (5 sentence-boundary pauses vs the clone's 2).
# Applies to FUTURE episodes only — never re-synth an already-rendered
# episode's clips mid-catalog (cadence/timbre splice).
DEFAULT_VOICE = "d46abd1d-2d02-43e8-819f-51fb652c1c61"
# Prior narrators, kept for --only re-synths on their own back-catalog episodes:
ORION_CLONE_VOICE = "00d3c951-0474-4b48-814e-ef815f533e63"  # Veo-clone, default 2026-07-07 → 2026-08-22
CLIVE_VOICE = "b24f41fd-00a3-4cd8-992a-a0c9f13f3ef1"  # default before the clone
# Pin the DATED snapshot, not the floating "sonic-3.5" alias: idempotent per-clip
# builders regenerate missing clips weeks apart, and a floating alias can silently
# change snapshots mid-episode (timbre/prosody drift between clips).
# vo_ab_test.py verifies the pin still resolves; floating alias kept as fallback.
MODEL = "sonic-3.5-2026-05-04"
MODEL_FALLBACK = "sonic-3.5"

# generation_config.emotion — single plain string from Cartesia's documented enum
# (primary: neutral/calm/angry/content/sad/scared; extended incl. excited/curious/
# amazed/mysterious…). Never suffixed ("scared:high") — that syntax belongs to the
# deprecated __experimental_controls. Emotion only lands when the sentence itself
# reads that way. (Verified against docs.cartesia.ai 2026-07-19.)
EMOTION_FOR_TONE = {
    "shock":      "scared",
    "fear":       "scared",
    "curiosity":  "curious",
    "excitement": "excited",
    "confidence": "calm",
    "awe":        "amazed",
}


def load_key() -> str:
    if os.environ.get("CARTESIA_API_KEY"):
        return os.environ["CARTESIA_API_KEY"]
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("CARTESIA_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"')
    sys.exit("CARTESIA_API_KEY not set — add it to mindwired/.env")


def with_pauses(text: str, dramatic_ms: int = 750) -> str:
    """2026-07-19 REWRITE (anti-"robotic VO" push, verified on docs.cartesia.ai):
    the old version injected a <break> after EVERY sentence/em-dash/ellipsis —
    Cartesia's sonic-3 docs warn that exact pattern degrades naturalness ("break
    tags split the generation, so the model has less surrounding context") and
    can cause hallucinations when stacked. Punctuation alone already produces
    the correct pauses.

    Now the ONLY injected break is a deliberate dramatic beat where the writer
    puts the explicit marker [pause] in the scene text (use sparingly — one
    silence before a reveal). Everything else rides on punctuation."""
    import re
    return re.sub(r"\s*\[pause\]\s*", f' <break time="{dramatic_ms}ms"/> ', text)


def tts(text: str, voice: str | None = None, tone: str | None = None,
        pauses: bool = True, speed: float = 1.0, language: str = "en",
        volume: float | None = None, model: str | None = None) -> bytes:
    """Synthesize one clip. Returns mp3 bytes.

    speed: 0.6-1.5 float, default 1.0 — Sonic treats it as guidance; a global
      slowdown is a classic robotic-cadence contributor (old default 0.92 —
      changed 2026-07-19 after the docs audit; A/B evidence in out/qa/vo_ab/).
      For gravitas on a single line, prefer a slightly lower per-call speed
      (e.g. chapter cards at -0.03) over slowing the whole narration.
    volume: 0.5-2.0, optional — hushed/dread beats in disaster docs.
    pauses: keeps the [pause] marker support (see with_pauses).
    language: BCP-47 ("en" default; "hi" for DimaagBatti/Rohan). Pass it
      explicitly per non-English channel — do NOT change the default, the
      mindwired English clone relies on "en".
    NOTE: send whole multi-sentence scene paragraphs per request (we do) —
      per-SENTENCE requests create prosody seams; never split below scene level."""
    key = load_key()
    transcript = with_pauses(text) if pauses else text
    body: dict = {
        "model_id": model or MODEL,
        "transcript": transcript,
        "voice": {"mode": "id", "id": voice or DEFAULT_VOICE},
        "output_format": {"container": "mp3", "bit_rate": 128000, "sample_rate": 44100},
        "language": language,
        "generation_config": {"speed": speed},
    }
    if volume:
        body["generation_config"]["volume"] = volume
    emotion = EMOTION_FOR_TONE.get(tone or "")
    if emotion:
        body["generation_config"]["emotion"] = emotion
    resp = httpx.post(API, json=body, headers={
        "Cartesia-Version": VERSION, "X-API-Key": key, "Content-Type": "application/json",
    }, timeout=120)
    # Fallback ONLY when the pinned snapshot itself is rejected (retired model),
    # and NEVER silently — a quiet fallback on a transient 429/5xx would synth
    # one clip on a different snapshot mid-episode, the exact timbre drift the
    # pin exists to prevent.
    if (resp.status_code in (400, 404, 422) and "model" in resp.text.lower()
            and (model or MODEL) == MODEL != MODEL_FALLBACK):
        print(f"WARNING: pinned model {MODEL} rejected (HTTP {resp.status_code}) — "
              f"falling back to {MODEL_FALLBACK}. Update MODEL in cartesia.py and "
              f"re-synth the episode's clips together.", file=sys.stderr)
        body["model_id"] = MODEL_FALLBACK
        resp = httpx.post(API, json=body, headers={
            "Cartesia-Version": VERSION, "X-API-Key": key,
            "Content-Type": "application/json"}, timeout=120)
    if resp.status_code != 200:
        sys.exit(f"Cartesia HTTP {resp.status_code}: {resp.text[:400]}")
    return resp.content


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--text", required=True)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--voice", default=None)
    ap.add_argument("--tone", default=None)
    ap.add_argument("--language", default="en")
    args = ap.parse_args()
    args.out.write_bytes(tts(args.text, voice=args.voice, tone=args.tone, language=args.language))
    print(f"-> {args.out}")
