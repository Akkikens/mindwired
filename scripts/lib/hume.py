#!/usr/bin/env python3
"""Hume Octave TTS toolkit — an expressive alternative narrator for Mindwired.

Octave is voice-design-from-prompt: you describe the narrator and it acts the
text. It does NOT reliably return word timestamps, so for caption sync we pair it
with ElevenLabs forced-alignment (see scripts/lib/eleven.forced_align).

Consistency across a multi-clip episode: the first clip is generated from the
`description`; every later clip passes the previous `generation_id` as `context`
so Octave keeps the same voice and delivery.

Note: Hume's edge (Cloudflare) blocks the default Python user-agent, so a browser
UA header is required — without it you get HTTP 403 / "error code: 1010".
"""
from __future__ import annotations

import base64
import json
import os
import sys
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

API = "https://api.hume.ai/v0"
REPO = Path(__file__).resolve().parent.parent.parent
_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
       "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")

# Deep cosmic-horror documentary narrator (Octave voice design prompt).
NARRATOR = ("A deep, resonant male documentary narrator with gravitas. Slow, "
            "unhurried, cinematic, full of quiet dread — the voice of a cosmic "
            "horror documentary, calm but deeply unsettling.")

_KEY_PATHS = [REPO / ".env"]


def load_key() -> str:
    k = os.environ.get("HUME_API_KEY")
    if k:
        return k.strip()
    for p in _KEY_PATHS:
        if p.exists():
            for line in p.read_text().splitlines():
                if line.strip().startswith("HUME_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("HUME_API_KEY not found (env or mindwired/.env).")


_KEY: str | None = None


def _hdr() -> dict:
    global _KEY
    if _KEY is None:
        _KEY = load_key()
    return {"X-Hume-Api-Key": _KEY, "Content-Type": "application/json",
            "User-Agent": _UA, "Accept": "application/json"}


def split_beats(text: str) -> list[str]:
    """Split narration into human speaking beats at sentence ends, em dashes and
    ellipses — the same punctuation writers use for dramatic weight. Each beat
    becomes its own Octave utterance so trailing_silence lands exactly there
    instead of Octave's own (much smaller, less controllable) sentence pausing."""
    import re
    parts = re.split(r"(?<=[.!?])\s+|(?<=—)\s*|(?<=\.\.\.)\s*", text.strip())
    return [p for p in parts if p]


def _trailing_silence_for(beat: str) -> float:
    """Longer pause after a full sentence or a dramatic dash/ellipsis; a short
    breath after a comma-less clause. Tuned by ear against Octave's own pacing."""
    if beat.endswith("...") or beat.endswith("—"):
        return 0.5
    if beat.endswith((".", "!", "?")):
        return 0.35
    return 0.15


def tts(text: str, *, description: str = NARRATOR, context_gen: str | None = None,
        beats: bool = True) -> tuple[bytes, str]:
    """Synthesize narration. Returns (mp3_bytes, generation_id).
    Pass the prior clip's generation_id as context_gen to keep the voice consistent
    across scenes. When beats=True (default), the text is split into sentence-level
    utterances each carrying trailing_silence, so the delivery breathes with
    human-length pauses instead of racing through the whole line in one breath."""
    chunks = split_beats(text) if beats else [text]
    utterances = []
    for i, chunk in enumerate(chunks):
        utt: dict = {"text": chunk, "trailing_silence": _trailing_silence_for(chunk)}
        # description only seeds a *new* voice; once we have a voice via context
        # (either this call's own beat 0, or a prior scene's generation_id), keep it
        if context_gen is None and i == 0:
            utt["description"] = description
        utterances.append(utt)
    payload: dict = {"utterances": utterances, "format": {"type": "mp3"}, "num_generations": 1}
    if context_gen:
        payload["context"] = {"generation_id": context_gen}
    req = Request(f"{API}/tts", data=json.dumps(payload).encode(), method="POST", headers=_hdr())
    try:
        with urlopen(req, timeout=300) as r:
            obj = json.loads(r.read())
    except HTTPError as e:
        sys.exit(f"Hume HTTP {e.code}: {e.read().decode(errors='replace')[:400]}")
    g = obj["generations"][0]
    return base64.b64decode(g["audio"]), g["generation_id"]
