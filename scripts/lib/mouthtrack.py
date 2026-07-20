#!/usr/bin/env python3
"""Narration loudness -> cartoon mouth-flap track (2026-07-20).

Classic animated-storytime lip-sync: the mascot's mouth cycles through 4 drawn
states (closed / small / open / wide) driven by the VO's per-frame RMS envelope.
No phonemes, no AI face models — amplitude flapping quantized "on twos" is the
hand-animation grammar and reads charming, not uncanny.

mouth_track(mp3) -> "0011233210..." one char per video frame (30fps):
  0 = silence/closed   1 = quiet   2 = speaking   3 = loud/emphasis
Stored per scene in the doc manifest ("mouth") by build_doc_vo.py; played by
MascotReact (src/mindwired-doc/Sketch.tsx) for scenes with "speak": true.
"""
from __future__ import annotations

import struct
import subprocess
from pathlib import Path

FPS = 30
SR = 16000  # analysis sample rate — plenty for an amplitude envelope


def _pcm(mp3: Path) -> bytes:
    r = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(mp3), "-ac", "1", "-ar", str(SR),
         "-f", "s16le", "-"],
        capture_output=True)
    return r.stdout if r.returncode == 0 else b""


def mouth_track(mp3: Path, fps: int = FPS) -> str:
    raw = _pcm(mp3)
    if len(raw) < 2:
        return ""
    n = len(raw) // 2
    samples = struct.unpack(f"<{n}h", raw[: n * 2])
    win = SR // fps
    rms: list[float] = []
    for i in range(0, n - win + 1, win):
        acc = 0
        for s in samples[i:i + win]:
            acc += s * s
        rms.append((acc / win) ** 0.5)
    if not rms:
        return ""
    peak = max(rms) or 1.0
    # relative thresholds: floor cuts breath/room noise; the rest split speech
    states = []
    for v in rms:
        r = v / peak
        states.append(0 if r < 0.08 else 1 if r < 0.28 else 2 if r < 0.58 else 3)
    # animate on twos: hold each mouth drawing for 2 frames (cartoon cadence),
    # taking the louder state of the pair so plosives still land
    out = []
    for i in range(0, len(states), 2):
        pair = states[i:i + 2]
        out += [str(max(pair))] * len(pair)
    # close the mouth on the final frames so scenes never end mid-flap
    if len(out) >= 2:
        out[-1] = out[-2] = "0"
    return "".join(out)
