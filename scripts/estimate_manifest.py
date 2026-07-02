#!/usr/bin/env python3
"""
Offline placeholder manifest so the cinematic video can be built + previewed
WITHOUT the ElevenLabs key. Estimates per-clip duration + word timings from the
narration text. The real scripts/build_audio.py overwrites this with accurate
Brian-voiced audio + forced-aligned timings (same schema), and the video
re-times automatically.

Run: python3 scripts/estimate_manifest.py
"""
import json
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_audio as B  # noqa: E402  (importing data only; eleven key is lazy now)

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / B.SLUG / "audio"
OUT.mkdir(parents=True, exist_ok=True)

WPS = 2.35          # Brian's effective words/sec incl. dramatic delivery
PAUSE = 0.38        # extra seconds per sentence boundary
LEAD, TAIL = 0.45, 0.55


def silent_mp3(path: Path, dur: float):
    """Write a silent mp3 of the given duration so the video renders offline.
    The real build_audio.py overwrites it (manifest 'estimated' flag triggers regen)."""
    if path.exists():
        return
    subprocess.run(
        ["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono",
         "-t", f"{dur:.3f}", "-q:a", "9", str(path)],
        capture_output=True, check=True)


def estimate(text: str):
    words = text.split()
    n = len(words)
    sentences = len(re.findall(r"[.!?]+", text)) or 1
    dur = round(n / WPS + sentences * PAUSE + LEAD + TAIL, 3)
    usable = dur - LEAD - TAIL
    step = usable / max(n, 1)
    timed = []
    for i, w in enumerate(words):
        start = round(LEAD + i * step, 3)
        end = round(start + step * 0.92, 3)
        timed.append({"word": w, "start": start, "end": end})
    return dur, timed


def main():
    man_path = OUT / "manifest.json"
    manifest = {"clips": {}}
    # Keep any real (non-estimated) clips already generated
    if man_path.exists():
        try:
            existing = json.loads(man_path.read_text())
            for cid, c in existing.get("clips", {}).items():
                if not c.get("estimated"):
                    manifest["clips"][cid] = c
        except Exception:
            pass

    for clip in B.NARRATION:
        if clip["id"] in manifest["clips"]:
            continue  # real audio exists; don't clobber
        dur, words = estimate(clip["text"])
        manifest["clips"][clip["id"]] = {
            "kind": "spoken", "dur": dur, "words": words, "estimated": True,
        }
        (OUT / f"{clip['id']}.words.json").write_text(json.dumps(words))
        silent_mp3(OUT / f"{clip['id']}.mp3", dur)

    for clip in B.SCORE:
        if clip["id"] in manifest["clips"]:
            continue
        dur = round(clip["length_ms"] / 1000, 3)
        manifest["clips"][clip["id"]] = {
            "kind": "instrumental", "dur": dur, "estimated": True,
        }
        silent_mp3(OUT / f"{clip['id']}.mp3", dur)

    man_path.write_text(json.dumps(manifest, indent=2))
    total = sum(c["dur"] for c in manifest["clips"].values() if c["kind"] == "spoken")
    print(f"wrote {man_path}")
    print(f"narration clips: {len(B.NARRATION)}, est. total narration: {total:.1f}s "
          f"({total/60:.1f} min)")
    for clip in B.NARRATION:
        c = manifest["clips"][clip["id"]]
        print(f"  {clip['id']:<14} {c['dur']:6.1f}s  {'(real)' if not c.get('estimated') else ''}")


if __name__ == "__main__":
    main()
