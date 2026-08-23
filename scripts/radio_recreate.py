#!/usr/bin/env python3
"""Black Box Evidence Engine — radio-authentic CVR/ATC recreations.

Real CVR audio is rarely released (US law: NTSB publishes transcripts only).
Industry standard (Mayday etc.) is a voice-acted recreation with radio EQ,
clearly labeled on screen. This tool generates those lines.

Reads the doc spec (src/mindwired-doc/docs/<slug>.json) and, for every scene
that has a "speaker" field (e.g. "CAPT", "FO", "ATC", "CVR"), synthesizes the
scene's text with Cartesia, then runs it through an ffmpeg radio chain
(bandpass + compression + pink-noise bed + per-speaker pitch offset so voices
are distinct even with one base voice). Output goes to
public/shorts/<slug>/audio/<id>.mp3 — the SAME path the VO builder uses, so
manifest durations, DocWide timing and idempotency all work unchanged. Run
this BEFORE build_doc_vo.py (which will skip these existing files).

Real released ATC audio (from scripts/fetch_ntsb_docket.py) should be trimmed
per scene and dropped into the same audio/<id>.mp3 slots by hand — mark those
scenes radioLabel:"ACTUAL ATC RECORDING"; recreations get
radioLabel:"CVR RECREATION" (DocWide shows the label — never pass one off as
the other).

    .venv-lipsync/bin/python scripts/radio_recreate.py <slug> [--only id1,id2] [--force]
"""
from __future__ import annotations
import argparse, json, subprocess, sys, tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
DOCS = REPO / "src" / "mindwired-doc" / "docs"

# per-speaker differentiation: (pitch cents via asetrate factor, extra gain dB)
# one base voice → three distinct-sounding radio voices; drop in real stock
# Cartesia voice ids per speaker later via the doc's optional "voices" map.
SPEAKER_SHIFT = {"CAPT": 0.94, "FO": 1.00, "ATC": 1.07, "CVR": 0.97,
                 "CAPTAIN": 0.92, "FIRST OFFICER": 1.10, "BUFFALO APPROACH": 1.0,
                 "PILOT FLYING": 1.06, "PILOT MONITORING": 0.98,
                 "LUMPUR RADAR": 1.05, "MH370": 0.93,
                 # flight93: two CVR hijacker voices differentiated even when
                 # sharing one base Cartesia voice id (2nd speaker's identity
                 # is only "likely" per the Commission, not fully confirmed)
                 "JARRAH": 0.95, "HIJACKER2": 1.06}


def radio_chain(src: Path, dst: Path, factor: float) -> None:
    """Radio treatment, SOFTENED 2026-08-22 (Akshay: the old walkie-talkie
    sound was "so irritating"). The old chain triple-stacked harshness:
    telephone-narrow 250-3200Hz bandpass + 6:1 compression + pink AND white
    noise baked into the clip — and then DocWide looped a SECOND static bed
    on top at render. New chain reads as "radio" without fatiguing:
    wider 180-4400Hz band (intelligible, still period-correct), gentle 3:1
    compression, one faint noise floor (half the old level), no crackle
    layer. DocWide's looping static bed is gone (see RadioScene) — the
    baked floor is the only static now, so it can't double up."""
    dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(src)], capture_output=True, text=True).stdout.strip()
    f = (
        f"[0:a]asetrate=44100*{factor},atempo={1/factor:.4f},aresample=44100,"
        f"highpass=f=180,lowpass=f=4400,"
        f"acompressor=threshold=-20dB:ratio=3:attack=6:release=140,"
        f"volume=1.25,alimiter=limit=0.92,aformat=channel_layouts=mono[v];"
        f"anoisesrc=color=pink:amplitude=0.016:duration={dur}:seed=42,"
        f"highpass=f=300,lowpass=f=3400[n];"
        f"[v][n]amix=inputs=2:duration=first:normalize=0"
    )
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(src),
        "-filter_complex", f, "-c:a", "libmp3lame", "-q:a", "2", str(dst)], check=True)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--only", default="")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--speed", type=float, default=1.0)  # radio speech = natural pace
    args = ap.parse_args()

    doc = json.loads((DOCS / f"{args.slug}.json").read_text())
    audio = REPO / "public" / "shorts" / args.slug / "audio"
    audio.mkdir(parents=True, exist_ok=True)
    only = {s.strip() for s in args.only.split(",") if s.strip()}
    voices = doc.get("voices", {})  # optional {"CAPT": "<cartesia id>", ...}

    n = 0
    for s in doc["scenes"]:
        spk = s.get("speaker")
        if not spk: continue
        if only and s["id"] not in only: continue
        dst = audio / f"{s['id']}.mp3"
        if dst.exists() and not args.force:
            print(f"skip {s['id']} (exists)"); continue
        voice = voices.get(spk, doc.get("voice"))
        raw = cartesia.tts(s["text"], voice=voice, language=doc.get("language", "en"),
                           speed=args.speed)
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tf:
            tf.write(raw); tmp = Path(tf.name)
        radio_chain(tmp, dst, SPEAKER_SHIFT.get(spk, 1.0))
        tmp.unlink()
        n += 1
        print(f"->  {s['id']}.mp3  [{spk}] {s['text'][:50]}")
    print(f"\n{n} radio lines generated (run build_doc_vo.py next — it will skip these)")


if __name__ == "__main__":
    main()
