#!/usr/bin/env python3
"""Optional AI b-roll for viral shorts via a KIE/Kagecia-style image API.

For each scene with a backgroundPrompt, generates a 1080x1920 cinematic image to
  public/shorts/<slug>/broll/<sceneId>.jpg
and flips "brollExists": true in the plan JSON so the renderer layers it in.

Needs KIE_API_KEY (or KAGECIA_API_KEY) in .env — without a key it exits cleanly
and the renderer falls back to the procedural layered backdrop (still good).

Usage: python3 scripts/gen_broll.py <slug>
"""
import json
import os
import sys
import time
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
API_BASE = "https://api.kie.ai/api/v1"   # flux/schnell-style endpoint host


def load_key():
    for name in ("KIE_API_KEY", "KAGECIA_API_KEY"):
        if os.environ.get(name):
            return os.environ[name].strip()
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            for name in ("KIE_API_KEY", "KAGECIA_API_KEY"):
                if line.strip().startswith(f"{name}="):
                    return line.split("=", 1)[1].strip().strip('"')
    return None


STYLE = ("cinematic, ultra dark, deep space documentary style, high contrast, "
         "no text, no watermark, vertical 9:16 composition")


def generate(key: str, prompt: str, out: Path) -> bool:
    req = urllib.request.Request(
        f"{API_BASE}/flux/generate",
        data=json.dumps({"prompt": f"{prompt}, {STYLE}", "aspect_ratio": "9:16",
                         "model": "flux-kontext-pro"}).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    task = json.load(urllib.request.urlopen(req, timeout=60))
    tid = task.get("data", {}).get("taskId")
    if not tid:
        print(f"    no taskId in response: {task}")
        return False
    for _ in range(60):  # poll up to ~3 min
        time.sleep(3)
        q = urllib.request.Request(f"{API_BASE}/flux/record-info?taskId={tid}",
                                   headers={"Authorization": f"Bearer {key}"})
        st = json.load(urllib.request.urlopen(q, timeout=30)).get("data", {})
        if st.get("successFlag") == 1:
            url = (st.get("response", {}).get("resultImageUrl")
                   or (st.get("response", {}).get("result_urls") or [None])[0])
            if url:
                out.write_bytes(urllib.request.urlopen(url, timeout=120).read())
                return True
            return False
        if st.get("successFlag") in (2, 3):
            print(f"    generation failed: {st.get('errorMessage')}")
            return False
    return False


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: gen_broll.py <slug>")
    slug = sys.argv[1]
    key = load_key()
    if not key:
        print("No KIE_API_KEY/KAGECIA_API_KEY found — skipping b-roll (procedural backdrop will be used).")
        return

    plan_path = REPO / "src" / "viral" / "plans" / f"{slug}.json"
    plan = json.loads(plan_path.read_text())
    outdir = REPO / "public" / "shorts" / slug / "broll"
    outdir.mkdir(parents=True, exist_ok=True)

    changed = False
    for sc in plan["scenes"]:
        prompt = sc.get("backgroundPrompt")
        if not prompt:
            continue
        out = outdir / f"{sc['id']}.jpg"
        if out.exists():
            sc["brollExists"] = True
            continue
        print(f"  [{sc['id']}] {prompt[:60]}…")
        if generate(key, prompt, out):
            sc["brollExists"] = True
            changed = True
            print(f"    → {out.name}")
    if changed or any(s.get("brollExists") for s in plan["scenes"]):
        plan_path.write_text(json.dumps(plan, indent=2))
        print("plan updated with brollExists flags")


if __name__ == "__main__":
    main()
