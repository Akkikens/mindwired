#!/usr/bin/env python3
"""Voice pipeline for viral shorts (Hume-first, ElevenLabs fallback, offline-estimate last).

Reads src/viral/plans/<slug>.json, generates one expressive clip per scene with a
tone-matched acting direction, and writes:
  public/shorts/<slug>/audio/<sceneId>.mp3
  public/shorts/<slug>/audio/manifest.json   {clips: {id: {dur, text, words[], estimated?}}}

Word timings: Hume doesn't return word timestamps, so we estimate them across the
real clip duration (same syllable model as the renderer's fallback). If ElevenLabs
is used, its with-timestamps endpoint gives real word timings.

Usage: python3 scripts/build_short.py <slug> [--voice hume|cartesia|eleven|hume-cartesia]
  hume          Octave, falls back to ElevenLabs then silent estimate (default)
  cartesia      Sonic-3.5, falls back to ElevenLabs then silent estimate
  eleven        ElevenLabs only (real word timings, least expressive)
  hume-cartesia Octave -> Cartesia -> silent estimate — NEVER touches ElevenLabs.
                Use this when a video must stay on an emotionally-acted engine only.
Idempotent per clip: existing mp3 + manifest entry are kept.
"""
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))

REPO = Path(__file__).resolve().parent.parent

# Hume acting directions per emotional tone (drives Octave's delivery)
TONE_DIRECTION = {
    "shock":      "Urgent, alarmed documentary narrator. Punchy, clipped delivery, rising intensity.",
    "fear":       "Low, tense, hushed narrator. Slow, deliberate, with dread between phrases.",
    "curiosity":  "Intrigued, leaning-in storyteller. Wondering tone, slight upward inflections.",
    "excitement": "Energetic, fast, thrilled narrator. Momentum building, emphatic peaks.",
    "confidence": "Calm, authoritative, assured narrator. Steady pace, grounded warmth.",
    "awe":        "Breathless wonder, quiet reverence. Spacious pacing, soft emphasis.",
}
BASE_VOICE = ("A deep, cinematic male documentary narrator for a space channel. "
              "Rich, resonant, modern — like a prestige Netflix science doc.")


def host_voice(plan) -> tuple[str, str | None]:
    """(hume_voice_description, eleven_voice_name) for the plan's host —
    each registry host (src/viral/hosts.json) narrates in its own voice."""
    host = plan.get("host")
    if host and "/" not in host:
        reg_path = REPO / "src" / "viral" / "hosts.json"
        entry = json.loads(reg_path.read_text()).get(host) if reg_path.exists() else None
        if entry:
            return entry.get("voiceDescription", BASE_VOICE), entry.get("elevenVoice")
    return BASE_VOICE, None


def ffprobe_dur(p: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
        capture_output=True, text=True, check=True).stdout.strip()
    return float(out)


def estimate_words(text: str, dur: float):
    import re
    words = text.split()
    weights = [max(1, len(re.findall(r"[aeiouy]+", w.lower()))) + (1.1 if re.search(r"[.!?,]$", w) else 0)
               for w in words]
    total = sum(weights) or 1
    usable = max(0.1, dur - 0.25)
    t, out = 0.15, []
    for w, wt in zip(words, weights):
        span = (wt / total) * usable
        out.append({"word": w, "start": round(t, 3), "end": round(t + span, 3)})
        t += span
    return out


ENGINE_CHAINS = {
    "hume": ["hume", "eleven"],
    "cartesia": ["cartesia", "eleven"],
    "eleven": ["eleven"],
    "hume-cartesia": ["hume", "cartesia"],  # emotionally-acted engines only, no ElevenLabs
}


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: build_short.py <slug> [--voice hume|cartesia|eleven|hume-cartesia]")
    slug = sys.argv[1]
    pref = sys.argv[sys.argv.index("--voice") + 1] if "--voice" in sys.argv else "hume"
    chain = ENGINE_CHAINS.get(pref)
    if not chain:
        sys.exit(f"unknown --voice '{pref}' — choose from {', '.join(ENGINE_CHAINS)}")

    plan = json.loads((REPO / "src" / "viral" / "plans" / f"{slug}.json").read_text())
    outdir = REPO / "public" / "shorts" / slug / "audio"
    outdir.mkdir(parents=True, exist_ok=True)
    man_path = outdir / "manifest.json"
    manifest = json.loads(man_path.read_text()) if man_path.exists() else {"clips": {}}

    base_voice, eleven_voice = host_voice(plan)
    cartesia_voice = None
    host = plan.get("host")
    if host and "/" not in host:
        reg = json.loads((REPO / "src/viral/hosts.json").read_text()).get(host, {})
        cartesia_voice = reg.get("cartesiaVoice")

    hume_ctx = None  # chain generation ids so every scene keeps ONE Hume voice
    for sc in plan["scenes"]:
        cid, text, tone = sc["id"], sc["voiceover"], sc.get("emotionalTone", "confidence")
        mp3 = outdir / f"{cid}.mp3"
        prev = manifest["clips"].get(cid, {})
        if mp3.exists() and prev and not prev.get("estimated") and prev.get("text") == text:
            print(f"  [skip] {cid}")
            continue

        audio, words, engine = None, None, None
        direction = f"{base_voice} {TONE_DIRECTION.get(tone, '')}"

        for step in chain:
            if audio is not None:
                break
            try:
                if step == "hume":
                    import hume
                    audio, hume_ctx = hume.tts(text, description=direction, context_gen=hume_ctx)
                elif step == "cartesia":
                    import cartesia
                    audio = cartesia.tts(text, voice=cartesia_voice, tone=tone)
                elif step == "eleven":
                    import eleven
                    audio, words = eleven.tts_aligned(text, voice=eleven_voice)
                engine = step
            except BaseException as e:  # hume.py sys.exits on HTTP errors (e.g. zero credits)
                nxt = " → trying next engine" if step != chain[-1] else " → silent estimate"
                print(f"  [{step} failed: {type(e).__name__}: {e}]{nxt}")

        if audio is not None:
            mp3.write_bytes(audio)
            dur = ffprobe_dur(mp3)
            manifest["clips"][cid] = {
                "dur": round(dur, 3), "text": text,
                "words": words if words else estimate_words(text, dur),
            }
            print(f"  [{engine}] {cid}: {dur:.2f}s ({tone})")
        else:
            dur = max(1.2, sc["end"] - sc["start"])
            subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono",
                            "-t", f"{dur:.2f}", "-q:a", "9", str(mp3)], capture_output=True)
            manifest["clips"][cid] = {"dur": dur, "text": text,
                                      "words": estimate_words(text, dur), "estimated": True}
            print(f"  [estimated] {cid}: {dur:.2f}s")

        man_path.write_text(json.dumps(manifest, indent=1))

    print(f"[{slug}] manifest → {man_path}")


if __name__ == "__main__":
    main()
