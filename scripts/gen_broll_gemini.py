#!/usr/bin/env python3
"""AI b-roll for viral shorts via Gemini 2.5 Flash Image — same model/key as
the host portrait pipeline (lipsync/gemini_host.py). scripts/gen_broll.py
uses a Flux/KIE endpoint we don't have a key for and CLAUDE.md's standing
rule is "never Flux" anyway, so this is the Gemini equivalent for scene
backgroundPrompt images.

For each scene with a backgroundPrompt and no existing broll image, generates
a 1080x1920 image to public/shorts/<slug>/broll/<sceneId>.jpg and flips
"brollExists": true in the plan JSON.

Requires: GEMINI_API_KEY in mindwired/.env

Usage: .venv-lipsync/bin/python3 scripts/gen_broll_gemini.py <slug>
"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from gemini_host import generate  # noqa: E402

STYLE = ("cinematic painterly illustration, dramatic lighting, no text, no "
         "watermark, no logos, vertical 9:16 composition")


def main(slug: str) -> None:
    plan_path = REPO / f"src/viral/plans/{slug}.json"
    plan = json.loads(plan_path.read_text())
    broll_dir = REPO / f"public/shorts/{slug}/broll"
    broll_dir.mkdir(parents=True, exist_ok=True)

    changed = False
    for scene in plan["scenes"]:
        prompt = scene.get("backgroundPrompt")
        if not prompt or scene.get("brollExists"):
            continue
        out = broll_dir / f"{scene['id']}.jpg"
        print(f"  [{scene['id']}] generating broll...")
        generate(f"{prompt}, {STYLE}", out, refs=[], aspect="9:16")
        scene["brollExists"] = True
        changed = True

    if changed:
        plan_path.write_text(json.dumps(plan, indent=2) + "\n")
        print(f"[{slug}] broll generated, plan updated → {plan_path}")
    else:
        print(f"[{slug}] no scenes needed broll (already generated or no backgroundPrompt)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: gen_broll_gemini.py <slug>")
    main(sys.argv[1])
