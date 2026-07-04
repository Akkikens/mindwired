#!/usr/bin/env python3
"""Generate a photorealistic host portrait with Google's Gemini 2.5 Flash Image
(a.k.a. "nano-banana") via the Gemini API directly — no Replicate, no rate limits
from their queue, and it bills against your own GEMINI_API_KEY.

Why this over Flux/SadTalker input images: Flux renders that airbrushed "AI face"
look. Gemini's image model is much better at real skin texture / candid photography,
which is what we need before feeding a still into a lip-sync model.

Requires: httpx (repo venv: .venv-lipsync)  |  Env: GEMINI_API_KEY in mindwired/.env

Usage:
  .venv-lipsync/bin/python lipsync/gemini_host.py \
      --out public/host/orion_v3.png \
      --prompt "..."                     # optional; a strong default is built in
  # refine/keep-identity from an existing shot:
  .venv-lipsync/bin/python lipsync/gemini_host.py \
      --out public/host/orion_v4.png --ref public/host/orion_v3.png \
      --prompt "same man, now looking straight at camera, mouth slightly open mid-sentence"
"""
import argparse
import base64
import mimetypes
import os
import sys
from pathlib import Path

import httpx

REPO = Path(__file__).resolve().parent.parent
MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")
ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

# A prompt tuned to defeat the "AI face" look: real-photo framing, a specific
# camera/lens, and explicit skin-texture / imperfection cues. Vertical-friendly
# but framed so a 16:9 or 9:16 crop both work for a talking-head Short.
DEFAULT_PROMPT = (
    "A candid, photojournalistic photograph of a real 30-year-old man sitting at a "
    "desk in a dark home studio, recording a science podcast. He has short dark tousled "
    "hair and light stubble, wearing a plain charcoal crew-neck sweater. He is looking "
    "slightly off-camera, calm and thoughtful, mouth relaxed. A black podcast microphone "
    "on a boom arm is in the foreground. Behind him, softly out of focus, a bookshelf and "
    "a purple-blue nebula wall glow. "
    "Shot on a Sony A7 III with an 85mm f/1.4 lens, shallow depth of field, natural soft "
    "key light from one side, subtle color grading. Photorealistic, extremely detailed real "
    "human skin with visible pores, fine wrinkles, slight redness and natural oil sheen, "
    "individual stray hairs, realistic asymmetry. Not airbrushed, not CGI, not illustration, "
    "no plastic skin. Looks like a real frame from a documentary."
)


def load_key() -> str:
    if os.environ.get("GEMINI_API_KEY"):
        return os.environ["GEMINI_API_KEY"]
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"')
    sys.exit("GEMINI_API_KEY not set — add it to mindwired/.env")


def _part_from_image(path: Path) -> dict:
    mime = mimetypes.guess_type(str(path))[0] or "image/png"
    data = base64.b64encode(path.read_bytes()).decode()
    return {"inline_data": {"mime_type": mime, "data": data}}


def generate(prompt: str, out: Path, refs: list[Path], aspect: str | None = None):
    key = load_key()
    parts: list[dict] = [{"text": prompt}]
    for r in refs:
        parts.append(_part_from_image(r))

    gen_cfg: dict = {"responseModalities": ["IMAGE"]}
    if aspect:
        gen_cfg["imageConfig"] = {"aspectRatio": aspect}
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": gen_cfg,
    }
    url = ENDPOINT.format(model=MODEL)
    print(f"  generating with {MODEL} ...")
    resp = httpx.post(
        url, params={"key": key}, json=body,
        headers={"Content-Type": "application/json"}, timeout=180,
    )
    if resp.status_code != 200:
        # Print status + trimmed body so we can see the real error without leaking the key.
        sys.exit(f"Gemini API error {resp.status_code}: {resp.text[:600]}")

    data = resp.json()
    cands = data.get("candidates", [])
    if not cands:
        sys.exit(f"No candidates returned: {str(data)[:600]}")
    saved = False
    for part in cands[0].get("content", {}).get("parts", []):
        inline = part.get("inlineData") or part.get("inline_data")
        if inline and inline.get("data"):
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_bytes(base64.b64decode(inline["data"]))
            print(f"  -> {out}")
            saved = True
            break
        if part.get("text"):
            print(f"  (model text: {part['text'][:200]})")
    if not saved:
        sys.exit(f"Response had no image part: {str(data)[:600]}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--prompt", default=DEFAULT_PROMPT)
    ap.add_argument("--ref", action="append", default=[], type=Path,
                    help="reference image(s) for identity/style; repeatable")
    ap.add_argument("--aspect", default=None,
                    help='aspect ratio, e.g. "9:16", "16:9", "1:1"')
    args = ap.parse_args()
    generate(args.prompt, args.out, args.ref, aspect=args.aspect)
