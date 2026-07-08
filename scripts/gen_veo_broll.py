#!/usr/bin/env python3
"""Generate SILENT cinematic b-roll clips with Google Veo 3.1 (text-to-video) for
a viral-shorts plan, and drop them where the engine's `brollVideo` expects them.

Unlike lipsync/veo_client.py (talking-head, image-to-video with generated
speech), this is pure text-to-video atmosphere footage: no host image, no
dialogue, no audio track that matters — the engine plays it MUTED under the
shared cinematic grade + kinetic captions (see ShortEngine Backdrop.brollVideo).

Writes: public/shorts/<slug>/broll-video/<sceneId>.mp4
Idempotent per clip: existing files are skipped (no re-spend).

Usage:
  python3 scripts/gen_veo_broll.py <slug> [--model fast|standard|lite] [--only id1,id2]
"""
import argparse
import sys
import time
from pathlib import Path

import httpx

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from veo_client import BASE, MODELS, load_key  # noqa: E402

NEG = ("Absolutely no on-screen text, no captions, no subtitles, no scoreboard "
       "numbers, no team logos, no crests, no sponsor boards, no broadcast "
       "graphics, no watermarks. Not real broadcast footage — an original "
       "cinematic recreation. Faces of real people are never shown clearly.")

# One prompt per scene id in src/viral/plans/wc-arg-egypt.json (the 8 board scenes).
PROMPTS = {
    "hook": (
        "Vertical 9:16 cinematic football documentary shot. A dark, packed night "
        "stadium, blue and red floodlights flaring through drifting rain particles, "
        "a slow ominous push-in toward an empty floodlit pitch, deep shadows, "
        "volumetric light, dread in the air, the feeling of a giant about to fall. "
        "Premium Netflix sports-doc grade, teal-and-crimson color palette. " + NEG
    ),
    "penmiss": (
        "Vertical 9:16 cinematic close shot. A lone footballer in a sky-blue and "
        "white kit stands over a penalty spot, head bowed, shoulders low, back to "
        "camera, harsh stadium lights blasting from behind him, crowd blurred into "
        "bokeh, sweat and breath in cold air, shallow depth of field, heavy "
        "dramatic blue-white rim light, a moment of failure. Face never clearly "
        "visible. Premium sports documentary. " + NEG
    ),
    "twogoal": (
        "Vertical 9:16 cinematic shot of underdog footballers in red kits "
        "celebrating a shocking goal, one sliding on his knees, arms wide, "
        "teammates rushing in, golden and warm stadium lights, a roaring blurred "
        "crowd, raw underdog euphoria and disbelief. Realistic sports film look, "
        "faces motion-blurred and indistinct. " + NEG
    ),
    "clock": (
        "Vertical 9:16 cinematic slow shot inside a vast dark stadium at night, a "
        "dramatic red glow washing over stunned home fans holding their heads, "
        "empty seats and drifting haze, a heavy sense of a clock running out, cold "
        "blue shadows against red light, tense and claustrophobic. " + NEG
    ),
    "romero": (
        "Vertical 9:16 cinematic football action recreation. A defender-built "
        "footballer in a sky-blue and white kit rises highest above a cluster of "
        "players and powers a header, ball ripping toward goal, explosive stadium "
        "floodlights, motion blur, spray of light particles, a surge of comeback "
        "energy. Faces indistinct in the blur. " + NEG
    ),
    "messi": (
        "Vertical 9:16 cinematic hero moment, low angle slow motion. A footballer "
        "in a sky-blue and white number 10 kit strikes the ball with his left "
        "foot, the stadium erupting behind him in a blue-white explosion of light, "
        "emotional and euphoric, cinematic lens flare, shallow depth of field. "
        "Face never clearly replicated. Premium sports documentary. " + NEG
    ),
    "storm": (
        "Vertical 9:16 cinematic chaos shot. Footballers in sky-blue and white "
        "sprinting and surging forward in a frenzied late comeback, aggressive "
        "handheld camera shake, streaking stadium lights, motion blur, a delirious "
        "blurred crowd, unstoppable momentum, high drama. " + NEG
    ),
    "enzo": (
        "Vertical 9:16 cinematic stoppage-time winner, ultra dramatic slow motion. "
        "A midfielder in sky-blue and white rises to head the ball into the net as "
        "a goalkeeper dives too late, the crowd exploding, confetti-like light "
        "particles raining down, a blue-white victorious color grade, pure "
        "catharsis. Faces indistinct. Premium sports documentary. " + NEG
    ),
}


def text2video(prompt: str, out: Path, model: str = "fast", aspect: str = "9:16",
               timeout_s: int = 600) -> bool:
    """Returns True on success. Non-fatal on RAI/no-video so a batch keeps going.

    Veo 3.1 always auto-generates audio here (generateAudio is unsupported on
    this endpoint) and its audio safety filter (raiMediaFilteredReasons: "issue
    with the audio for your prompt") blocks nondeterministically — so callers
    retry. We play these clips MUTED regardless."""
    key = load_key()
    model_id = MODELS.get(model, model)
    body = {"instances": [{"prompt": prompt}],
            "parameters": {"aspectRatio": aspect,
                           "negativePrompt": ("text, captions, subtitles, on-screen numbers, "
                                              "team logos, crests, sponsor boards, broadcast "
                                              "graphics, watermarks, blood, gore")}}
    print(f"  veo t2v: submitting {out.stem} to {model_id} ({aspect})...")
    r = httpx.post(f"{BASE}/models/{model_id}:predictLongRunning", params={"key": key},
                   json=body, timeout=120)
    if r.status_code != 200:
        print(f"  !! submit error {r.status_code} for {out.stem}: {r.text[:300]}")
        return False
    op = r.json()["name"]
    t0 = time.time()
    while True:
        time.sleep(10)
        pr = httpx.get(f"{BASE}/{op}", params={"key": key}, timeout=60)
        if pr.status_code != 200:
            print(f"  !! poll error {pr.status_code} for {out.stem}")
            return False
        pj = pr.json()
        if pj.get("done"):
            break
        if time.time() - t0 > timeout_s:
            print(f"  !! timed out for {out.stem}")
            return False
    if "error" in pj:
        print(f"  !! generation failed for {out.stem}: {pj['error']}")
        return False
    resp = pj.get("response", {})
    vids = (resp.get("generateVideoResponse", {}).get("generatedSamples")
            or resp.get("generatedVideos") or resp.get("videos") or [])
    if not vids:
        reasons = resp.get("generateVideoResponse", {}).get("raiMediaFilteredReasons")
        print(f"  !! no video for {out.stem} (filtered: {reasons})")
        return False
    v = vids[0]
    uri = (v.get("video", {}) or {}).get("uri") or v.get("uri")
    out.parent.mkdir(parents=True, exist_ok=True)
    dl = uri + ("&" if "?" in uri else "?") + "key=" + key
    with httpx.stream("GET", dl, timeout=300, follow_redirects=True) as rd:
        rd.raise_for_status()
        with open(out, "wb") as f:
            for chunk in rd.iter_bytes():
                f.write(chunk)
    print(f"  -> {out}  ({out.stat().st_size // 1024} KB)")
    return True


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--model", default="fast")
    ap.add_argument("--only", default="", help="comma-separated scene ids")
    args = ap.parse_args()

    only = {s.strip() for s in args.only.split(",") if s.strip()}
    outdir = REPO / "public" / "shorts" / args.slug / "broll-video"
    ids = [i for i in PROMPTS if not only or i in only]
    print(f"veo b-roll: {len(ids)} clip(s) for {args.slug} -> {outdir}")
    failed = []
    for sid in ids:
        out = outdir / f"{sid}.mp4"
        if out.exists() and out.stat().st_size > 0:
            print(f"  skip {sid} (exists)")
            continue
        ok = False
        for attempt in range(3):  # RAI audio filter is nondeterministic — retry
            if attempt:
                print(f"  retry {sid} (attempt {attempt + 1}/3)...")
            if text2video(PROMPTS[sid], out, model=args.model):
                ok = True
                break
        if not ok:
            failed.append(sid)
    if failed:
        print(f"done with FAILURES: {failed} — rerun to retry just these.")
    else:
        print("done.")
