#!/usr/bin/env python3
"""Cut vertical Shorts out of a master host-video plan — no new TTS, no new
lip-sync, no new assets. A cut is just a subset of the master's scenes; the
derived plans keep the master's slug so every audio/broll/host-clip path
resolves to the files already on disk.

Author the cuts in the master plan JSON:
  "shortCuts": [
    {"id": "spainpor", "title": "Spain vs Portugal is a final in disguise",
     "scenes": ["s41","s42","s43","cta"]},
    ...
  ]

Then:  python3 scripts/cut_shorts.py <slug>
Writes src/viral/plans/<slug>.shorts.json — an array of full VisualPlan objects
(register once in Root.tsx; comp ids become Short<Slug>Cut<id>).

Each cut is duration-checked against the audio manifest (target 15-60s for
Shorts; warns outside 10-75s).
"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
FPS, HOLD, LEAD, LEAD_FIRST = 30, 14, 5, 14  # mirror src/viral/lib/plan.ts


def cut_seconds(scene_ids, plan_scenes, clips) -> float:
    frames = 0
    for i, sid in enumerate(scene_ids):
        sc = plan_scenes[sid]
        dur = max(1.2, clips.get(sid, {}).get("dur", sc["end"] - sc["start"]))
        frames += (LEAD_FIRST if i == 0 else LEAD) + round(dur * FPS) + HOLD
    return frames / FPS


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: cut_shorts.py <slug>")
    slug = sys.argv[1]
    plan_path = REPO / "src/viral/plans" / f"{slug}.json"
    plan = json.loads(plan_path.read_text())
    cuts = plan.get("shortCuts")
    if not cuts:
        sys.exit(f"{plan_path.name} has no \"shortCuts\" — author them first (see docstring)")
    man_path = REPO / "public/shorts" / slug / "audio/manifest.json"
    clips = json.loads(man_path.read_text())["clips"] if man_path.exists() else {}
    by_id = {s["id"]: s for s in plan["scenes"]}

    out = []
    for cut in cuts:
        missing = [sid for sid in cut["scenes"] if sid not in by_id]
        if missing:
            sys.exit(f"cut '{cut['id']}': unknown scene ids {missing}")
        secs = cut_seconds(cut["scenes"], by_id, clips)
        flag = "" if 10 <= secs <= 75 else "  ⚠️ outside Shorts range"
        print(f"  [{cut['id']}] {len(cut['scenes'])} scenes, {secs:.1f}s{flag}")
        scenes = [dict(by_id[sid]) for sid in cut["scenes"]]
        # a cut's first scene is its hook — make sure it slams, not fades
        scenes[0] = {**scenes[0], "kind": "hook"}
        out.append({
            "slug": plan["slug"],           # keep master slug: shared assets resolve
            "cutId": cut["id"],
            "title": cut["title"],
            **({"host": plan["host"]} if plan.get("host") else {}),
            **({"channel": plan["channel"]} if plan.get("channel") else {}),
            **({"music": plan["music"]} if plan.get("music") else {}),
            "scenes": scenes,
        })

    out_path = REPO / "src/viral/plans" / f"{slug}.shorts.json"
    out_path.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    print(f"{len(out)} cuts → {out_path}")


if __name__ == "__main__":
    main()
