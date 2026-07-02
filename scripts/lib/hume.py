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


def tts(text: str, *, description: str = NARRATOR, context_gen: str | None = None) -> tuple[bytes, str]:
    """Synthesize one utterance. Returns (mp3_bytes, generation_id).
    Pass the prior clip's generation_id as context_gen to keep the voice consistent."""
    utt: dict = {"text": text}
    # description only seeds a *new* voice; once we have a voice via context, keep it
    if context_gen is None:
        utt["description"] = description
    payload: dict = {"utterances": [utt], "format": {"type": "mp3"}, "num_generations": 1}
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
