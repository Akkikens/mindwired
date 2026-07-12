#!/usr/bin/env python3
"""Clone a voice from a reference audio clip into a pinned Cartesia voice ID, then
TTS a test line with it. Lets us capture the (nice) Veo talking-host voice ONCE and
reuse it consistently + near-free for all narration (no Veo per-clip cost, no drift).

Run: .venv-lipsync/bin/python scripts/clone_voice.py --clip <ref.wav> --name orion_veo \
        --sample "A rogue planet could enter our solar system tomorrow." --out <sample.mp3>
Prints the new voice_id. Put that id in scripts/lib/cartesia.py DEFAULT_VOICE
(and/or hosts.json <host>.cartesiaVoice) to make it the channel narrator.
"""
import argparse
import sys
from pathlib import Path

import httpx

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts" / "lib"))
import cartesia as C  # noqa: E402

CLONE_URL = "https://api.cartesia.ai/voices/clone"
CLONE_VERSION = "2026-03-01"


def clone(clip: Path, name: str, description: str) -> str:
    key = C.load_key()
    with open(clip, "rb") as f:
        resp = httpx.post(
            CLONE_URL,
            headers={"Cartesia-Version": CLONE_VERSION, "X-API-Key": key},
            data={"name": name, "language": "en", "description": description},
            files={"clip": (clip.name, f, "audio/wav")},
            timeout=180,
        )
    if resp.status_code not in (200, 201):
        sys.exit(f"clone failed HTTP {resp.status_code}: {resp.text[:500]}")
    vid = resp.json().get("id")
    if not vid:
        sys.exit(f"no voice id in response: {resp.text[:500]}")
    return vid


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--clip", required=True, type=Path)
    ap.add_argument("--name", default="cloned_voice")
    ap.add_argument("--description", default="Cloned cinematic documentary narrator")
    ap.add_argument("--sample", default="A rogue planet could enter our solar system tomorrow, and no one on Earth would see it coming.")
    ap.add_argument("--out", type=Path, default=None)
    args = ap.parse_args()

    vid = clone(args.clip, args.name, args.description)
    print(f"VOICE_ID={vid}")

    if args.out:
        audio = C.tts(args.sample, voice=vid, tone="fear", speed=0.92)
        args.out.write_bytes(audio)
        print(f"sample -> {args.out}")
