#!/usr/bin/env python3
"""Broadcast polish chain for narration clips — the "news anchor" finish.

Raw TTS mp3s ship with no vocal processing; real broadcast VO always passes
through a chain. This applies, per clip, via ffmpeg:

  1. highpass 70 Hz        — remove sub-vocal rumble/mud
  2. deesser               — tame synthetic sibilance (a top AI-voice tell)
  3. gentle compression    — 2.5:1, slow release: evens syllable peaks the
                             way a broadcast chain does, WITHOUT changing
                             pacing/prosody (nothing here touches timing)
  4. loudnorm to −16 LUFS  — consistent clip-to-clip level, so quiet scene
                             ends don't force the master pass to pump

Deliberately conservative: no EQ coloring, no exciter, no stereo tricks —
polish, not disguise. The channel's honesty rules are unaffected (this is
the same processing a human narrator's recording would get).
"""
from __future__ import annotations
import subprocess, tempfile
from pathlib import Path

CHAIN = (
    "highpass=f=70,"
    "deesser=i=0.28,"
    "acompressor=threshold=-19dB:ratio=2.5:attack=9:release=180:makeup=2,"
    "loudnorm=I=-16:TP=-1.8:LRA=11"
)


def polish(mp3_bytes: bytes) -> bytes:
    """Run one clip's mp3 bytes through the chain; returns processed bytes.
    Raises on ffmpeg failure — callers decide whether to fall back to raw."""
    with tempfile.TemporaryDirectory() as td:
        src = Path(td) / "in.mp3"
        dst = Path(td) / "out.mp3"
        src.write_bytes(mp3_bytes)
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(src), "-af", CHAIN,
             "-ar", "44100", "-b:a", "192k", str(dst)],
            check=True, capture_output=True)
        return dst.read_bytes()
