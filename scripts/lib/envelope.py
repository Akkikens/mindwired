#!/usr/bin/env python3
"""Real amplitude envelope from an mp3, dependency-free (no numpy).

envelope_from_mp3(path, hz) decodes the mp3 to mono 8 kHz s16le via ffmpeg,
computes RMS over non-overlapping windows of (8000/hz) samples, and normalizes
to 0..1. Used to drive the VoicePulse bars off the actual voice instead of a
faked word-density heuristic. Best-effort: returns [] on any failure.
"""
from __future__ import annotations

import array
import math
import subprocess
import tempfile
import wave
from pathlib import Path


def envelope_from_mp3(path, hz: int = 20) -> list[float]:
    """RMS amplitude envelope of an mp3 at `hz` samples/second, normalized 0..1
    and rounded to 3 decimals. Returns [] on any failure."""
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tf:
            wav_path = tf.name
        try:
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(path), "-ac", "1", "-ar", "8000",
                 "-f", "wav", "-acodec", "pcm_s16le", wav_path],
                capture_output=True, check=True)

            with wave.open(wav_path, "rb") as w:
                nframes = w.getnframes()
                raw = w.readframes(nframes)
            samples = array.array("h")
            samples.frombytes(raw)

            win = max(1, 8000 // hz)
            env: list[float] = []
            for i in range(0, len(samples), win):
                chunk = samples[i:i + win]
                if not chunk:
                    continue
                rms = math.sqrt(sum(s * s for s in chunk) / len(chunk))
                env.append(rms)

            peak = max(env) if env else 0.0
            if peak <= 0:
                return []
            return [round(v / peak, 3) for v in env]
        finally:
            try:
                Path(wav_path).unlink()
            except OSError:
                pass
    except BaseException:
        return []
