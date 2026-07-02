#!/usr/bin/env python3
"""
Alternative narration for "The Scariest Places" using **Hume Octave** (expressive
voice) instead of ElevenLabs Brian. Word timings come from ElevenLabs
forced-alignment (Octave doesn't return reliable timestamps), so captions still
sync frame-accurately. Music beds are left as-is (ElevenLabs).

Run: python3 scripts/scariest/build_audio_hume.py
  ⚠️ This OVERWRITES public/scariest/audio/<clip>.mp3 with Hume voice, then you
     must re-render. Don't run it while a render of ScariestPlaces is in progress.

A/B first: scripts/scariest/build_audio.py is the ElevenLabs version.
"""
import json
import sys
from pathlib import Path

LIB = Path(__file__).resolve().parent.parent / "lib"
sys.path.insert(0, str(LIB))
import build_audio as B  # noqa: E402  (NARRATION / SLUG data)
import hume  # noqa: E402
import eleven  # noqa: E402

REPO = Path(__file__).resolve().parent.parent.parent
OUT = REPO / "public" / B.SLUG / "audio"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    man_path = OUT / "manifest.json"
    manifest = {"clips": {}}
    if man_path.exists():
        manifest = json.loads(man_path.read_text())
        manifest.setdefault("clips", {})

    print("[scariest/hume] generating narration via Hume Octave + ElevenLabs alignment")
    prev_gen = None
    for c in B.NARRATION:
        cid, text = c["id"], c["text"]
        print(f"  hume {cid} ...", flush=True)
        audio, prev_gen = hume.tts(text, context_gen=prev_gen)  # chain context → consistent voice
        (OUT / f"{cid}.mp3").write_bytes(audio)
        words = eleven.forced_align(audio, text)                # accurate word timings
        (OUT / f"{cid}.words.json").write_text(json.dumps(words))
        manifest["clips"][cid] = {
            "kind": "spoken", "dur": eleven.mp3_duration(OUT / f"{cid}.mp3"),
            "words": words, "voice": "hume-octave",
        }
        man_path.write_text(json.dumps(manifest, indent=2))
        print(f"    -> {manifest['clips'][cid]['dur']}s, {len(words)} words")

    man_path.write_text(json.dumps(manifest, indent=2))
    print(f"[scariest/hume] done. Re-render: "
          f"pnpm exec remotion render src/index.ts ScariestPlaces out/scariest-raw.mp4 --gl=angle --concurrency=3")


if __name__ == "__main__":
    main()
