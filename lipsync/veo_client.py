#!/usr/bin/env python3
"""Generate a talking-host clip with Google Veo 3.1 (image-to-video with native
speech audio) — the "actually looks like a human speaking" option.

Unlike Sonic/Wav2Lip this is NOT lip-sync-to-our-mp3: Veo animates the host
image AND generates its own voice from dialogue written in the prompt. Full
head/body motion, blinks, natural micro-movement. Use it for short talking
hooks; the engine's ElevenLabs narration still covers the rest of a video.

Billing: uses GEMINI_API_KEY (same account as gemini_host.py image gen).
veo-3.1-fast-generate-preview ≈ cheapest with audio; 8s clip ≈ $1-2.

Usage:
  .venv-lipsync/bin/python lipsync/veo_client.py \
      --image public/host/rio.png \
      --dialogue "Brazil barely survived. Now Haaland is coming." \
      --out lipsync/out/veo_test.mp4 [--aspect 9:16] [--model fast]
"""
import argparse
import base64
import mimetypes
import os
import sys
import time
from pathlib import Path

import httpx

REPO = Path(__file__).resolve().parent.parent
BASE = "https://generativelanguage.googleapis.com/v1beta"
MODELS = {
    "fast": "veo-3.1-fast-generate-preview",
    "standard": "veo-3.1-generate-preview",
    "lite": "veo-3.1-lite-generate-preview",
}


def load_key() -> str:
    if os.environ.get("GEMINI_API_KEY"):
        return os.environ["GEMINI_API_KEY"]
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"')
    sys.exit("GEMINI_API_KEY not set — add it to mindwired/.env")


def generate(image: Path, dialogue: str, out: Path, aspect: str = "9:16",
             model: str = "fast", persona: str = "the man in the image",
             timeout_s: int = 600):
    key = load_key()
    model_id = MODELS.get(model, model)
    mime = mimetypes.guess_type(str(image))[0] or "image/png"
    prompt = (
        f"The person from the input image, a football TV pundit, in the exact same "
        f"studio and outfit. He looks directly into the camera and speaks with natural "
        f"energy, subtle head movement, natural blinks and hand-free framing. He says, "
        f"in a warm British accent: \"{dialogue}\" "
        f"Broadcast-quality, realistic, no camera movement, no captions, no text overlays."
    )
    body = {
        "instances": [{
            "prompt": prompt,
            "image": {"bytesBase64Encoded": base64.b64encode(image.read_bytes()).decode(),
                       "mimeType": mime},
        }],
        "parameters": {"aspectRatio": aspect},
    }
    print(f"  veo: submitting to {model_id} (aspect {aspect})...")
    r = httpx.post(f"{BASE}/models/{model_id}:predictLongRunning", params={"key": key},
                   json=body, timeout=120)
    if r.status_code != 200:
        sys.exit(f"Veo submit error {r.status_code}: {r.text[:500]}")
    op = r.json()["name"]
    print(f"  veo: operation {op} — polling...")
    t0 = time.time()
    while True:
        time.sleep(10)
        pr = httpx.get(f"{BASE}/{op}", params={"key": key}, timeout=60)
        if pr.status_code != 200:
            sys.exit(f"Veo poll error {pr.status_code}: {pr.text[:300]}")
        pj = pr.json()
        if pj.get("done"):
            break
        if time.time() - t0 > timeout_s:
            sys.exit(f"Veo timed out after {timeout_s}s (operation still running: {op})")
    if "error" in pj:
        sys.exit(f"Veo generation failed: {pj['error']}")
    resp = pj.get("response", {})
    vids = (resp.get("generateVideoResponse", {}).get("generatedSamples")
            or resp.get("generatedVideos") or resp.get("videos") or [])
    if not vids:
        sys.exit(f"Veo returned no video: {str(resp)[:500]}")
    v = vids[0]
    uri = (v.get("video", {}) or {}).get("uri") or v.get("uri")
    out.parent.mkdir(parents=True, exist_ok=True)
    if uri:
        # per Veo docs the returned uri (already carrying alt=media) just needs
        # the API key appended — do NOT pass params=, httpx would rebuild the query
        dl = uri + ("&" if "?" in uri else "?") + "key=" + key
        with httpx.stream("GET", dl, timeout=300, follow_redirects=True) as resp_dl:
            resp_dl.raise_for_status()
            with open(out, "wb") as f:
                for chunk in resp_dl.iter_bytes():
                    f.write(chunk)
    else:
        b64 = (v.get("video", {}) or {}).get("bytesBase64Encoded") or v.get("bytesBase64Encoded")
        if not b64:
            sys.exit(f"No uri or bytes in video sample: {str(v)[:300]}")
        out.write_bytes(base64.b64decode(b64))
    print(f"  -> {out}")


def _run(prompt: str, image: Path | None, out: Path, aspect: str, model: str, timeout_s: int = 600):
    """Shared submit/poll/download for Veo. image=None -> text-to-video."""
    key = load_key()
    model_id = MODELS.get(model, model)
    inst: dict = {"prompt": prompt}
    if image is not None:
        mime = mimetypes.guess_type(str(image))[0] or "image/png"
        inst["image"] = {"bytesBase64Encoded": base64.b64encode(image.read_bytes()).decode(), "mimeType": mime}
    body = {"instances": [inst], "parameters": {"aspectRatio": aspect}}
    print(f"  veo: submitting to {model_id} (aspect {aspect})...")
    r = httpx.post(f"{BASE}/models/{model_id}:predictLongRunning", params={"key": key}, json=body, timeout=120)
    if r.status_code != 200:
        sys.exit(f"Veo submit error {r.status_code}: {r.text[:500]}")
    op = r.json()["name"]
    print(f"  veo: operation {op} — polling...")
    t0 = time.time()
    while True:
        time.sleep(10)
        pr = httpx.get(f"{BASE}/{op}", params={"key": key}, timeout=60)
        if pr.status_code != 200:
            sys.exit(f"Veo poll error {pr.status_code}: {pr.text[:300]}")
        pj = pr.json()
        if pj.get("done"):
            break
        if time.time() - t0 > timeout_s:
            sys.exit(f"Veo timed out ({op})")
    if "error" in pj:
        sys.exit(f"Veo failed: {pj['error']}")
    resp = pj.get("response", {})
    vids = (resp.get("generateVideoResponse", {}).get("generatedSamples")
            or resp.get("generatedVideos") or resp.get("videos") or [])
    if not vids:
        sys.exit(f"Veo returned no video: {str(resp)[:400]}")
    v = vids[0]
    uri = (v.get("video", {}) or {}).get("uri") or v.get("uri")
    out.parent.mkdir(parents=True, exist_ok=True)
    if uri:
        dl = uri + ("&" if "?" in uri else "?") + "key=" + key
        with httpx.stream("GET", dl, timeout=300, follow_redirects=True) as rd:
            rd.raise_for_status()
            with open(out, "wb") as f:
                for chunk in rd.iter_bytes():
                    f.write(chunk)
    else:
        b64 = (v.get("video", {}) or {}).get("bytesBase64Encoded") or v.get("bytesBase64Encoded")
        out.write_bytes(base64.b64decode(b64))
    print(f"  -> {out}")


def generate_broll(image: Path, scene: str, out: Path, aspect: str = "16:9", model: str = "fast"):
    """Animate an anime key-frame into a cinematic clip WITH native ambient audio
    (crowd, atmosphere) — no talking. `scene` describes the motion + sound."""
    prompt = (
        f"Cinematic anime scene, keep the exact same character(s), art style, kit and "
        f"background as the input image. {scene} "
        f"Natural ambient stadium sound — crowd murmur and roar, no music, no speech, no "
        f"captions or text overlays. Smooth cinematic motion, high quality."
    )
    _run(prompt, image, out, aspect, model)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", type=Path)
    ap.add_argument("--dialogue")
    ap.add_argument("--scene", help="use with --broll instead of --dialogue")
    ap.add_argument("--broll", action="store_true", help="b-roll mode (ambient audio, no speech)")
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--aspect", default="9:16")
    ap.add_argument("--model", default="fast", help="fast | standard | lite or full model id")
    args = ap.parse_args()
    if args.broll:
        generate_broll(args.image, args.scene, args.out, aspect=args.aspect, model=args.model)
    else:
        generate(args.image, args.dialogue, args.out, aspect=args.aspect, model=args.model)
