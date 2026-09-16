#!/usr/bin/env python3
"""Remap a doc spec's `video` refs onto the clips that actually exist on disk.

Why this exists: scene `video` values are written as <pool>_<N>.mp4 BEFORE the
fetch, so the variant numbers are a guess. fetch_doc_footage sizes each pool from
the scene counts at fetch time, and any scene added afterwards (or any clip the
Gemini vision check deletes as a mismatch) leaves a dangling ref that
preflight_doc.py blocks the render on.

This walks each pool, round-robins its scenes across the files that are really
there, and reports any pool that ended up with zero clips - those scenes need a
real fix (refetch or an img/dossier beat), never a silent substitution from
another pool.
"""
import json, io, os, sys, collections

slug = sys.argv[1] if len(sys.argv) > 1 else "sept11timeline"
spec = f"src/mindwired-doc/docs/{slug}.json"
vdir = f"public/shorts/{slug}/video"

d = json.load(io.open(spec, encoding="utf-8"))
scenes = d["scenes"]
have = sorted(f for f in os.listdir(vdir) if f.endswith(".mp4")) if os.path.isdir(vdir) else []
by_pool = collections.defaultdict(list)
for f in have:
    by_pool[f.rsplit("_", 1)[0]].append(f)

pool_scenes = collections.defaultdict(list)
for s in scenes:
    if "video" in s:
        pool_scenes[s["video"].rsplit("_", 1)[0]].append(s)

empty, remapped = [], 0
for pool, ss in sorted(pool_scenes.items()):
    files = by_pool.get(pool, [])
    if not files:
        empty.append((pool, len(ss)))
        continue
    for i, s in enumerate(ss):
        new = files[i % len(files)]
        if s["video"] != new:
            s["video"] = new
            remapped += 1

io.open(spec, "w", encoding="utf-8").write(json.dumps(d, indent=1, ensure_ascii=False))

print(f"{len(have)} clips on disk across {len(by_pool)} pools; {remapped} scene refs remapped")
if empty:
    print("\n!! POOLS WITH ZERO CLIPS - these scenes still have no footage:")
    for pool, n in empty:
        print(f"   {pool}: {n} scenes")
    print("   Fix by refetching that pool, or convert the scenes to img/exhibit/dossier beats.")
    print("   Do NOT point them at another pool's footage - that is how a clip ends up")
    print("   illustrating a scene it has nothing to do with.")
else:
    print("\nno empty pools - every video scene resolves to a real file")

still = [s["video"] for s in scenes if "video" in s and s["video"] not in have]
print(f"\ndangling refs after remap: {len(still)}")
c = collections.Counter(s["video"] for s in scenes if "video" in s)
N = len(scenes)
over = [(k, v) for k, v in c.items() if v > N * 0.12]
print(f"12% monotony cap = {N*0.12:.1f} scenes; over-cap: {over or 'none'}")
runs, cur, ln = [], None, 0
for s in scenes:
    a = s.get("video") or s.get("img")
    if a == cur:
        ln += 1
    else:
        if cur:
            runs.append((cur, ln))
        cur, ln = a, 1
runs.append((cur, ln))
worst = max(runs, key=lambda x: x[1])
print(f"max consecutive repeat: {worst[0]} x{worst[1]}" + ("  !! gate blocks at 5" if worst[1] > 4 else ""))
