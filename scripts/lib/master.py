#!/usr/bin/env python3
"""Audio mastering for finished renders — the step the pipeline never had.

CLAUDE.md targets -14 LUFS for YouTube, but nothing enforced it: every render
went out at whatever level the TTS happened to return, and music beds sat at a
fixed volume with no ducking under the voice. This module is the shared toolkit
for a post-render master pass:

  - loudnorm_measure()  : EBU R128 two-pass measurement (accurate, linear mode)
  - master_audio()      : normalize an audio stream to -14 LUFS / -1.5 dBTP
  - master_video()      : loudnorm a finished mp4's audio in place (video copied)
  - mix_music_ducked()  : mix a music bed UNDER a voice track with sidechain
                          ducking, then loudnorm the result

Two-pass loudnorm is used everywhere (measure, then correct with the measured
values + linear=true) because single-pass loudnorm pumps and misses the target
by 1-2 LU on speech. All calls are idempotent-friendly: they read an input and
write a new output, never mutating the source.
"""
from __future__ import annotations

import json
import subprocess
import tempfile
from pathlib import Path

# YouTube integrated-loudness target. TP just under 0 to survive AAC/Opus
# transcode intersample peaks; LRA wide enough to keep documentary dynamics.
TARGET_I = -14.0
TARGET_TP = -1.5
TARGET_LRA = 11.0
SR = 48000  # loudnorm resamples internally; pin the output rate for clean mux


def _run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True)


def _has_audio(path: Path) -> bool:
    r = _run(["ffprobe", "-v", "error", "-select_streams", "a",
              "-show_entries", "stream=index", "-of", "csv=p=0", str(path)])
    return bool(r.stdout.strip())


def loudnorm_measure(src: Path, audio_filter: str | None = None) -> dict:
    """Pass 1: measure integrated loudness/TP/LRA/threshold with loudnorm's own
    analyzer. `audio_filter` is any pre-chain applied before measuring (so we
    measure the same signal we will render). Returns the measured_* dict."""
    ln = f"loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA={TARGET_LRA}:print_format=json"
    af = f"{audio_filter},{ln}" if audio_filter else ln
    r = _run(["ffmpeg", "-hide_banner", "-i", str(src), "-af", af, "-f", "null", "-"])
    # loudnorm prints its JSON block at the end of stderr
    text = r.stderr
    start = text.rfind("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise RuntimeError(f"loudnorm measurement failed for {src}:\n{text[-500:]}")
    return json.loads(text[start:end + 1])


def _loudnorm_pass2_filter(m: dict) -> str:
    """Pass-2 loudnorm filter string using measured values + linear correction."""
    return (f"loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA={TARGET_LRA}"
            f":measured_I={m['input_i']}:measured_TP={m['input_tp']}"
            f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}"
            f":offset={m['target_offset']}:linear=true:print_format=summary")


def master_audio(src: Path, out: Path, pre_filter: str | None = None) -> Path:
    """Normalize an audio file to -14 LUFS (two-pass). `pre_filter` is applied
    before loudnorm in both passes (e.g. a highpass or the ducked-mix graph)."""
    m = loudnorm_measure(src, pre_filter)
    ln2 = _loudnorm_pass2_filter(m)
    af = f"{pre_filter},{ln2}" if pre_filter else ln2
    r = _run(["ffmpeg", "-y", "-i", str(src), "-af", af, "-ar", str(SR),
              "-c:a", "aac", "-b:a", "192k", str(out)])
    if r.returncode != 0:
        raise RuntimeError(f"master_audio pass 2 failed:\n{r.stderr[-500:]}")
    return out


def master_video(src: Path, out: Path) -> Path:
    """Loudnorm a finished mp4's audio to -14 LUFS, copying the video stream
    untouched. No-op-safe: if the file has no audio, it is just copied."""
    if not _has_audio(src):
        _run(["ffmpeg", "-y", "-i", str(src), "-c", "copy", str(out)])
        return out
    m = loudnorm_measure(src)
    ln2 = _loudnorm_pass2_filter(m)
    r = _run(["ffmpeg", "-y", "-i", str(src), "-af", ln2, "-ar", str(SR),
              "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", str(out)])
    if r.returncode != 0:
        raise RuntimeError(f"master_video pass 2 failed:\n{r.stderr[-500:]}")
    return out


def mix_music_ducked(video: Path, music: Path, out: Path, *,
                     music_gain_db: float = -18.0,
                     duck_ratio: float = 8.0,
                     duck_threshold: float = 0.04,
                     attack_ms: int = 15,
                     release_ms: int = 400) -> Path:
    """Mix a looping music bed UNDER the video's existing voice track with
    sidechain ducking (music drops whenever the voice is present), then master
    the mix to -14 LUFS. The video's own audio is the sidechain key, so the
    music automatically pulls back under narration and swells in the gaps.

    music_gain_db: base attenuation of the bed before ducking (kept low — the
    voice should always sit clearly on top; -18 dB is a safe documentary bed)."""
    if not _has_audio(video):
        # nothing to duck against — just lay the (attenuated) music under video
        _run(["ffmpeg", "-y", "-i", str(video), "-stream_loop", "-1", "-i", str(music),
              "-filter_complex", f"[1:a]volume={music_gain_db}dB[m]",
              "-map", "0:v", "-map", "[m]", "-c:v", "copy", "-c:a", "aac",
              "-shortest", str(out)])
        return out

    # [voice] splits: one copy is the sidechain key, one is the final voice.
    # [music] is looped, attenuated, then compressed keyed by the voice.
    graph = (
        f"[0:a]asplit=2[vkey][vmix];"
        f"[1:a]volume={music_gain_db}dB[mus];"
        f"[mus][vkey]sidechaincompress="
        f"threshold={duck_threshold}:ratio={duck_ratio}:attack={attack_ms}:release={release_ms}[ducked];"
        f"[vmix][ducked]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[mix]"
    )
    with tempfile.TemporaryDirectory() as td:
        premix = Path(td) / "premix.mp4"
        r = _run(["ffmpeg", "-y", "-i", str(video), "-stream_loop", "-1", "-i", str(music),
                  "-filter_complex", graph, "-map", "0:v", "-map", "[mix]",
                  "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", str(premix)])
        if r.returncode != 0:
            raise RuntimeError(f"music duck-mix failed:\n{r.stderr[-500:]}")
        return master_video(premix, out)


def mix_music_windowed(video: Path, music: Path, out: Path,
                        windows: list[tuple[float, float]], *,
                        music_gain_db: float = -18.0,
                        duck_ratio: float = 8.0,
                        duck_threshold: float = 0.04,
                        attack_ms: int = 15,
                        release_ms: int = 400,
                        fade_s: float = 1.5) -> Path:
    """Like mix_music_ducked, but the bed only plays inside the given
    (start_sec, end_sec) windows — silent everywhere else — instead of looping
    under the entire runtime. Use when continuous music under long factual
    narration feels oppressive (Akshay feedback, 2026-07-17): reserve music for
    the cold open, chapter transitions, and the closing, not the whole doc.
    Each window fades in/out over `fade_s` seconds (clamped so short windows
    like chapter cards don't overlap their own fade)."""
    if not windows:
        raise ValueError("mix_music_windowed requires at least one window")
    if not _has_audio(video):
        raise RuntimeError("mix_music_windowed requires a video with existing voice audio")

    terms = []
    for (s, e) in windows:
        f = max(0.05, min(fade_s, (e - s) / 2 - 0.05))
        terms.append(
            f"if(between(t,{s},{s+f}),(t-{s})/{f},"
            f"if(between(t,{e-f},{e}),({e}-t)/{f},"
            f"if(between(t,{s},{e}),1,0)))"
        )
    gate_expr = "+".join(terms)

    graph = (
        f"[0:a]asplit=2[vkey][vmix];"
        f"[1:a]volume={music_gain_db}dB[mus0];"
        f"[mus0]volume='{gate_expr}':eval=frame[mus];"
        f"[mus][vkey]sidechaincompress="
        f"threshold={duck_threshold}:ratio={duck_ratio}:attack={attack_ms}:release={release_ms}[ducked];"
        f"[vmix][ducked]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[mix]"
    )
    with tempfile.TemporaryDirectory() as td:
        premix = Path(td) / "premix.mp4"
        r = _run(["ffmpeg", "-y", "-i", str(video), "-stream_loop", "-1", "-i", str(music),
                  "-filter_complex", graph, "-map", "0:v", "-map", "[mix]",
                  "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", str(premix)])
        if r.returncode != 0:
            raise RuntimeError(f"windowed music mix failed:\n{r.stderr[-500:]}")
        return master_video(premix, out)


def _gate_expr(windows: list[tuple[float, float]], fade_s: float) -> str:
    """A frame-eval volume expression that is 1 inside each window (with fade_s
    ramps) and 0 elsewhere. Shared by the windowed mixers."""
    terms = []
    for (s, e) in windows:
        f = max(0.05, min(fade_s, (e - s) / 2 - 0.05))
        terms.append(
            f"if(between(t,{s},{s+f}),(t-{s})/{f},"
            f"if(between(t,{e-f},{e}),({e}-t)/{f},"
            f"if(between(t,{s},{e}),1,0)))"
        )
    return "+".join(terms)


def mix_music_multi_windowed(video: Path, groups: list[tuple[Path, list[tuple[float, float]]]],
                             out: Path, *,
                             music_gain_db: float = -18.0,
                             duck_ratio: float = 8.0,
                             duck_threshold: float = 0.04,
                             attack_ms: int = 15,
                             release_ms: int = 400,
                             fade_s: float = 1.5) -> Path:
    """Per-act windowed scoring: each (bed, windows) group plays its OWN bed only
    inside its windows — so Act 1 can be awe, Act 2 tension, Act 3 somber — and
    all gated beds are summed, ducked once under the voice, and mastered to
    -14 LUFS. The mood-leads-the-story upgrade over the single-bed
    mix_music_windowed. Windows across groups should be disjoint (they are, when
    built from consecutive act ranges); overlaps just sum (kept low by the bed
    gain). Empty-window groups are dropped."""
    groups = [(b, w) for (b, w) in groups if w]
    if not groups:
        raise ValueError("mix_music_multi_windowed requires at least one non-empty group")
    if len(groups) == 1:
        return mix_music_windowed(video, groups[0][0], out, groups[0][1],
                                  music_gain_db=music_gain_db, duck_ratio=duck_ratio,
                                  duck_threshold=duck_threshold, attack_ms=attack_ms,
                                  release_ms=release_ms, fade_s=fade_s)
    if not _has_audio(video):
        raise RuntimeError("mix_music_multi_windowed requires a video with existing voice audio")

    # inputs: 0 = video; 1..N = each bed, stream-looped
    inputs: list[str] = ["-i", str(video)]
    for (bed, _w) in groups:
        inputs += ["-stream_loop", "-1", "-i", str(bed)]

    parts = ["[0:a]asplit=2[vkey][vmix]"]
    bed_labels = []
    for i, (_bed, windows) in enumerate(groups, start=1):
        lbl = f"b{i}"
        parts.append(f"[{i}:a]volume={music_gain_db}dB,"
                     f"volume='{_gate_expr(windows, fade_s)}':eval=frame[{lbl}]")
        bed_labels.append(f"[{lbl}]")
    parts.append(f"{''.join(bed_labels)}amix=inputs={len(bed_labels)}:duration=longest:normalize=0[bedsum]")
    parts.append(f"[bedsum][vkey]sidechaincompress="
                 f"threshold={duck_threshold}:ratio={duck_ratio}:attack={attack_ms}:release={release_ms}[ducked]")
    parts.append("[vmix][ducked]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[mix]")
    graph = ";".join(parts)

    with tempfile.TemporaryDirectory() as td:
        premix = Path(td) / "premix.mp4"
        r = _run(["ffmpeg", "-y", *inputs, "-filter_complex", graph,
                  "-map", "0:v", "-map", "[mix]", "-c:v", "copy", "-c:a", "aac",
                  "-b:a", "192k", "-shortest", str(premix)])
        if r.returncode != 0:
            raise RuntimeError(f"multi-bed windowed mix failed:\n{r.stderr[-600:]}")
        return master_video(premix, out)


def probe_loudness(path: Path) -> float | None:
    """Report a file's integrated loudness (LUFS) for verification. None if no audio."""
    if not _has_audio(path):
        return None
    try:
        m = loudnorm_measure(path)
        return float(m["input_i"])
    except (RuntimeError, KeyError, ValueError):
        return None
