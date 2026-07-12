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

# Channel narrator = "orion_veo_clone": a Cartesia voice CLONED from the mindwired
# Veo talking-host outro (Akshay approved the sound 2026-07-07). This captures the
# nice Veo documentary voice as a pinned, consistent, ~free TTS voice — no Veo
# per-clip cost, no cross-clip drift. This is the default for all mindwired
# narration now. (Prev default "Clive - Measured Expert" b24f41fd-… kept below.)
DEFAULT_VOICE = "00d3c951-0474-4b48-814e-ef815f533e63"
CLIVE_VOICE = "b24f41fd-00a3-4cd8-992a-a0c9f13f3ef1"  # previous default, kept as fallback
# break tags + generation_config.emotion require sonic-3/3.5 (sonic-2 ignores them)
MODEL = "sonic-3.5"

# generation_config.emotion — Cartesia's documented primary set is
# neutral/calm/angry/content/sad/scared; the rest of this map picks the closest
# match per narration tone (tone vocabulary defined in src/viral/lib/tone.ts).
EMOTION_FOR_TONE = {
    "shock":      "scared",
    "fear":       "scared",
    "curiosity":  "content",
    "excitement": "excited",
    "confidence": "calm",
    "awe":        "content",
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


def with_pauses(text: str, beat_ms: int = 260, sentence_ms: int = 480) -> str:
    """Insert explicit <break> tags at clause and sentence boundaries so the
    delivery breathes like a human narrator instead of racing through text.
    Em dashes and ellipses (the two beats writers use for dramatic weight)
    get the same treatment as sentence ends."""
    import re
    text = re.sub(r"(\.\.\.|—)\s*", rf'\1<break time="{beat_ms}ms"/> ', text)
    text = re.sub(r"([.!?])\s+", rf'\1<break time="{sentence_ms}ms"/> ', text)
    return text


def tts(text: str, voice: str | None = None, tone: str | None = None,
        pauses: bool = True, speed: float = 0.92, language: str = "en") -> bytes:
    """Synthesize one clip. Returns mp3 bytes. speed 0.6-1.5 (1.0 = normal);
    slightly under 1.0 reads as a more deliberate, human documentary pace.
    language: BCP-47 code ("en" default; "hi" for DimaagBatti/Rohan). Pass it
    explicitly per non-English channel — do NOT change the default, the mindwired
    English clone relies on "en"."""
    key = load_key()
    transcript = with_pauses(text) if pauses else text
    body: dict = {
        "model_id": MODEL,
        "transcript": transcript,
        "voice": {"mode": "id", "id": voice or DEFAULT_VOICE},
        "output_format": {"container": "mp3", "bit_rate": 128000, "sample_rate": 44100},
        "language": language,
        "generation_config": {"speed": speed},
    }
    emotion = EMOTION_FOR_TONE.get(tone or "")
    if emotion:
        body["generation_config"]["emotion"] = emotion
    resp = httpx.post(API, json=body, headers={
        "Cartesia-Version": VERSION, "X-API-Key": key, "Content-Type": "application/json",
    }, timeout=120)
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
