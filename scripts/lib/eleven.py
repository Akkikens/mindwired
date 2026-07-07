#!/usr/bin/env python3
"""Shared ElevenLabs toolkit for Singaloo videos.

Three capabilities, all on one API key:
  - music_sung()    : POST /music/detailed with a composition_plan (explicit lyrics)
                      -> real sung-vocal mp3 bytes
  - forced_align()  : POST /forced-alignment (audio + known lyrics)
                      -> [{word,start,end}] word-level karaoke timestamps
                      (the Music API's own words_timestamps is always null, so we align)
  - tts_aligned()   : POST /text-to-speech/{voice}/with-timestamps
                      -> spoken mp3 + word timestamps (used for cold-opens/bridges/outro)

Higher level: build_audio() takes a video spec and writes
  public/<slug>/audio/<clip>.mp3  (+  manifest.json with durations + word timings).
Idempotent: a clip whose mp3 + manifest entry already exist is skipped, so reruns
are cheap and don't re-spend quota.
"""
from __future__ import annotations

import base64
import json
import os
import sys
import uuid
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

API = "https://api.elevenlabs.io/v1"
REPO = Path(__file__).resolve().parent.parent.parent  # scripts/lib/ -> repo root

# Deep, resonant documentary narrator for the Mindwired channel
VOICE_PREFS = ["George", "Brian", "Adam", "Daniel", "Bill"]  # George = channel voice (CLAUDE.md)
TTS_MODEL = "eleven_multilingual_v2"
# Authoritative + cinematic: higher stability for gravitas, moderate style for drama
TTS_SETTINGS = {"stability": 0.5, "similarity_boost": 0.85, "style": 0.4, "use_speaker_boost": True}

# Per-tone voice_settings variants. Shock/excitement drop stability + push style
# for punchy, dynamic delivery; fear/awe raise stability + calm the style for
# controlled dread/reverence; confidence/curiosity stay near the base values.
# similarity_boost + use_speaker_boost are held constant so the voice identity
# never drifts across tones.
_TONE_SETTINGS = {
    "shock":      {"stability": 0.35, "style": 0.6},
    "excitement": {"stability": 0.35, "style": 0.6},
    "fear":       {"stability": 0.6,  "style": 0.25},
    "awe":        {"stability": 0.6,  "style": 0.25},
    "confidence": {"stability": 0.5,  "style": 0.4},
    "curiosity":  {"stability": 0.5,  "style": 0.4},
}


def settings_for_tone(tone: str | None) -> dict:
    """voice_settings for an emotional tone, layered over TTS_SETTINGS. Unknown
    or missing tones return the base settings unchanged."""
    base = dict(TTS_SETTINGS)
    if tone:
        base.update(_TONE_SETTINGS.get(tone, {}))
    return base


# ── key + http ────────────────────────────────────────────────────────────────

_KEY_PATHS = [
    Path.home() / ".claude/skills/video-use/.env",
    Path.home() / "Developer/video-use/.env",
    Path.home() / "Documents/GitHub/video-use/.env",
    REPO / ".env",
]


def load_key() -> str:
    k = os.environ.get("ELEVENLABS_API_KEY")
    if k:
        return k.strip()
    for p in _KEY_PATHS:
        if p.exists():
            for line in p.read_text().splitlines():
                if line.strip().startswith("ELEVENLABS_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("ELEVENLABS_API_KEY not found. Set the env var or create "
             f"{REPO / '.env'} with ELEVENLABS_API_KEY=...")


# Lazy: don't fail at import time (lets the data in build_audio.py be imported
# without a key, e.g. for offline manifest estimation).
_KEY_CACHE: str | None = None


def _hdr() -> dict:
    global _KEY_CACHE
    if _KEY_CACHE is None:
        _KEY_CACHE = load_key()
    return {"xi-api-key": _KEY_CACHE}


def _json_req(path: str, payload=None, method=None):
    data = json.dumps(payload).encode() if payload is not None else None
    m = method or ("POST" if data else "GET")
    req = Request(f"{API}{path}", data=data, method=m,
                  headers={**_hdr(), "Content-Type": "application/json"})
    try:
        with urlopen(req, timeout=300) as r:
            return r.status, r.headers.get("Content-Type", ""), r.read()
    except HTTPError as e:
        sys.exit(f"HTTP {e.code} {path}: {e.read().decode(errors='replace')[:400]}")


def _multipart_req(path: str, fields: dict, files: dict):
    boundary = "----sing" + uuid.uuid4().hex
    body = bytearray()
    for name, val in fields.items():
        body += (f"--{boundary}\r\nContent-Disposition: form-data; "
                 f"name=\"{name}\"\r\n\r\n{val}\r\n").encode()
    for name, (fn, raw, ctype) in files.items():
        body += (f"--{boundary}\r\nContent-Disposition: form-data; "
                 f"name=\"{name}\"; filename=\"{fn}\"\r\nContent-Type: {ctype}\r\n\r\n").encode()
        body += raw + b"\r\n"
    body += f"--{boundary}--\r\n".encode()
    req = Request(f"{API}{path}", data=bytes(body), method="POST",
                  headers={**_hdr(), "Content-Type": f"multipart/form-data; boundary={boundary}"})
    try:
        with urlopen(req, timeout=300) as r:
            return r.status, r.read()
    except HTTPError as e:
        sys.exit(f"HTTP {e.code} {path}: {e.read().decode(errors='replace')[:400]}")


def _split_multipart(ct: str, body: bytes):
    boundary = ct.split("boundary=")[-1].strip().strip('"')
    out = []
    for part in body.split(b"--" + boundary.encode()):
        if not part.strip() or part.strip() == b"--":
            continue
        hdr, _, content = part.partition(b"\r\n\r\n")
        out.append((hdr.decode(errors="replace"), content))
    return out


# ── voices ──────────────────────────────────────────────────────────────────

_voice_cache: dict[str, tuple[str, str]] = {}


def pick_voice(preferred: str | None = None) -> tuple[str, str]:
    """Resolve a voice by name; falls back through VOICE_PREFS. `preferred`
    lets a host pin its own voice (src/viral/hosts.json elevenVoice)."""
    cache_key = preferred or ""
    if cache_key in _voice_cache:
        return _voice_cache[cache_key]
    _, _, body = _json_req("/voices")
    voices = json.loads(body).get("voices", [])
    prefs = ([preferred] if preferred else []) + VOICE_PREFS
    for p in prefs:
        for v in voices:
            if v["name"].lower().startswith(p.lower()):
                _voice_cache[cache_key] = (v["voice_id"], v["name"])
                return _voice_cache[cache_key]
    _voice_cache[cache_key] = (voices[0]["voice_id"], voices[0]["name"])
    return _voice_cache[cache_key]


# ── core calls ────────────────────────────────────────────────────────────────

def make_plan(lines, duration_ms, *, pos_global, neg_global, pos_local, neg_local,
              section_name="Verse"):
    """Build a music composition_plan with one section of explicit lyric lines."""
    return {
        "positive_global_styles": pos_global,
        "negative_global_styles": neg_global,
        "sections": [{
            "section_name": section_name,
            "positive_local_styles": pos_local,
            "negative_local_styles": neg_local,
            "duration_ms": int(duration_ms),
            "lines": list(lines),
        }],
    }


def music_sung(plan=None, *, prompt=None, length_ms=None) -> bytes:
    """Generate music. Pass a composition_plan (preferred, for exact lyrics) OR a
    prompt (+optional length_ms) for instrumentals. Returns mp3 bytes."""
    payload: dict = {}
    if plan is not None:
        payload["composition_plan"] = plan
    if prompt is not None:
        payload["prompt"] = prompt
    if length_ms is not None:
        payload["music_length_ms"] = int(length_ms)
    st, ct, body = _json_req("/music/detailed", payload)
    if "multipart" not in ct:
        sys.exit(f"music: unexpected content-type {ct}")
    for hdr, content in _split_multipart(ct, body):
        if "audio" in hdr.lower():
            return content.rstrip(b"\r\n-")
    sys.exit("music: no audio part in response")


def forced_align(audio_bytes: bytes, text: str):
    """Align known lyrics against audio. Returns [{word,start,end}] (whitespace dropped)."""
    st, raw = _multipart_req("/forced-alignment",
                             {"text": text},
                             {"file": ("clip.mp3", audio_bytes, "audio/mpeg")})
    obj = json.loads(raw)
    words = []
    for w in obj.get("words", []):
        t = (w.get("text") or "").strip()
        if not t:
            continue
        words.append({"word": t, "start": round(w["start"], 3), "end": round(w["end"], 3)})
    return words


def _words_from_char_alignment(align):
    chars = align["characters"]
    st = align["character_start_times_seconds"]
    en = align["character_end_times_seconds"]
    out, cur, ws, pe = [], "", None, 0.0
    for c, s, e in zip(chars, st, en):
        if c.isspace():
            if cur:
                out.append({"word": cur, "start": round(ws, 3), "end": round(pe, 3)})
                cur, ws = "", None
            continue
        if ws is None:
            ws = s
        cur += c
        pe = e
    if cur:
        out.append({"word": cur, "start": round(ws, 3), "end": round(pe, 3)})
    return out


def tts_aligned(text: str, voice: str | None = None, tone: str | None = None):
    """Spoken VO with word timestamps. Returns (mp3_bytes, words[]).

    `tone` (optional) selects a per-tone voice_settings variant via
    settings_for_tone(); omit it to use the base TTS_SETTINGS (backward
    compatible with existing callers)."""
    vid, _ = pick_voice(voice)
    voice_settings = settings_for_tone(tone) if tone else TTS_SETTINGS
    st, ct, body = _json_req(f"/text-to-speech/{vid}/with-timestamps",
                             {"text": text, "model_id": TTS_MODEL,
                              "voice_settings": voice_settings})
    obj = json.loads(body)
    audio = base64.b64decode(obj["audio_base64"])
    words = _words_from_char_alignment(obj["alignment"])
    return audio, words


# ── audio probing ─────────────────────────────────────────────────────────────

def mp3_duration(path: Path) -> float:
    import subprocess
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)], capture_output=True, text=True).stdout.strip()
    try:
        return round(float(out), 3)
    except ValueError:
        return 0.0


# ── high-level driver ───────────────────────────────────────────────────────────

def build_audio(slug: str, sung: list[dict], spoken: list[dict],
                instrumental: list[dict] | None = None):
    """Generate every clip for a video and write a manifest.

    sung:        [{id, lines:[str], duration_ms, pos_global, neg_global,
                   pos_local, neg_local}]
    spoken:      [{id, text}]
    instrumental:[{id, prompt, length_ms}]   (no lyrics, no alignment)

    Writes public/<slug>/audio/<id>.mp3 and .../manifest.json:
      {"clips": {id: {"kind","dur","words"?}}}
    Idempotent per clip.
    """
    out = REPO / "public" / slug / "audio"
    out.mkdir(parents=True, exist_ok=True)
    man_path = out / "manifest.json"
    manifest = {"clips": {}}
    if man_path.exists():
        try:
            manifest = json.loads(man_path.read_text())
            manifest.setdefault("clips", {})
        except Exception:
            manifest = {"clips": {}}

    def have(cid):
        c = manifest["clips"].get(cid)
        # regenerate over silent "estimated" placeholders written for offline preview
        return (out / f"{cid}.mp3").exists() and c is not None and not c.get("estimated")

    print(f"[{slug}] voice: {pick_voice()[1]}")

    for c in sung:
        cid = c["id"]
        mp3 = out / f"{cid}.mp3"
        wj = out / f"{cid}.words.json"
        if have(cid) and wj.exists():
            print(f"  skip sung {cid}")
            continue
        print(f"  sung {cid} ({len(c['lines'])} lines, {c['duration_ms']}ms) ...", flush=True)
        plan = make_plan(c["lines"], c["duration_ms"],
                         pos_global=c["pos_global"], neg_global=c["neg_global"],
                         pos_local=c["pos_local"], neg_local=c["neg_local"],
                         section_name=c.get("section_name", "Verse"))
        audio = music_sung(plan)
        mp3.write_bytes(audio)
        words = forced_align(audio, " ".join(c["lines"]))
        wj.write_text(json.dumps(words))
        manifest["clips"][cid] = {"kind": "sung", "dur": mp3_duration(mp3), "words": words}
        man_path.write_text(json.dumps(manifest, indent=2))
        print(f"    -> {manifest['clips'][cid]['dur']}s, {len(words)} words")

    for c in (instrumental or []):
        cid = c["id"]
        mp3 = out / f"{cid}.mp3"
        if have(cid):
            print(f"  skip instr {cid}")
            continue
        print(f"  instr {cid} ({c['length_ms']}ms) ...", flush=True)
        audio = music_sung(prompt=c["prompt"], length_ms=c["length_ms"])
        mp3.write_bytes(audio)
        manifest["clips"][cid] = {"kind": "instrumental", "dur": mp3_duration(mp3)}
        man_path.write_text(json.dumps(manifest, indent=2))
        print(f"    -> {manifest['clips'][cid]['dur']}s")

    for c in spoken:
        cid = c["id"]
        mp3 = out / f"{cid}.mp3"
        wj = out / f"{cid}.words.json"
        if have(cid) and wj.exists():
            print(f"  skip spoken {cid}")
            continue
        print(f"  spoken {cid} ...", flush=True)
        audio, words = tts_aligned(c["text"])
        mp3.write_bytes(audio)
        wj.write_text(json.dumps(words))
        manifest["clips"][cid] = {"kind": "spoken", "dur": mp3_duration(mp3), "words": words}
        man_path.write_text(json.dumps(manifest, indent=2))
        print(f"    -> {manifest['clips'][cid]['dur']}s, {len(words)} words")

    man_path.write_text(json.dumps(manifest, indent=2))
    print(f"[{slug}] manifest written: {man_path}")
    return manifest
