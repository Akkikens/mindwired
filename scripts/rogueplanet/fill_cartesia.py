#!/usr/bin/env python3
"""
Stopgap: fill any rogue-planet narration clips ElevenLabs couldn't finish (monthly
quota exhausted 2026-07-07) with Cartesia Sonic-3.5 so the episode is complete and
renderable end-to-end NOW. Only touches clips whose manifest entry is still
'estimated' (i.e. silent placeholders) — the George clips already built stay.

Cartesia gives no word timestamps, so word timing is distributed linearly across
the MEASURED audio duration (accurate enough for the key-line captions this comp
burns in).

⚠ Voice note: these fills use Cartesia "Clive" (measured documentary), not the
pinned channel voice George. To unify the voice once the ElevenLabs quota resets,
delete these clips' mp3s + manifest entries and re-run build_audio.py:
    for c in worstcase frozen ending outro; do rm -f public/rogueplanet/audio/$c.mp3; done
    # then remove those keys from public/rogueplanet/audio/manifest.json and:
    python3 scripts/rogueplanet/build_audio.py

Run: python3 scripts/rogueplanet/fill_cartesia.py
"""
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "lib"))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_audio as B  # noqa: E402
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent.parent
OUT = REPO / "public" / B.SLUG / "audio"
LEAD, TAIL = 0.4, 0.5


def dur_of(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
         "csv=p=0", str(path)], capture_output=True, text=True).stdout.strip()
    return round(float(out), 3)


def timings(words, dur):
    n = len(words)
    usable = max(0.1, dur - LEAD - TAIL)
    step = usable / max(n, 1)
    return [{"word": w, "start": round(LEAD + i * step, 3),
             "end": round(LEAD + i * step + step * 0.9, 3)} for i, w in enumerate(words)]


def main():
    man_path = OUT / "manifest.json"
    manifest = json.loads(man_path.read_text())
    # only fill silent placeholders (estimated) or clips with no audio yet —
    # NEVER clobber a clip that already has real audio (no 'estimated' flag).
    todo = [c for c in B.NARRATION
            if manifest["clips"].get(c["id"], {}).get("estimated", False)
            or not (OUT / f"{c['id']}.mp3").exists()]
    if not todo:
        print("nothing to fill — all narration clips already have real audio")
        return
    print(f"filling {len(todo)} clip(s) via Cartesia: {[c['id'] for c in todo]}")
    for c in todo:
        cid = c["id"]
        audio = cartesia.tts(c["text"], tone="fear", speed=0.9)
        mp3 = OUT / f"{cid}.mp3"
        mp3.write_bytes(audio)
        d = dur_of(mp3)
        words = timings(c["text"].split(), d)
        (OUT / f"{cid}.words.json").write_text(json.dumps(words))
        manifest["clips"][cid] = {"kind": "spoken", "dur": d, "words": words,
                                  "provider": "cartesia"}
        man_path.write_text(json.dumps(manifest, indent=2))
        print(f"  {cid:<12} {d:6.1f}s  ({len(words)} words)  [cartesia/clive]")
    print("done — manifest updated")


if __name__ == "__main__":
    main()
