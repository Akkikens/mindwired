#!/usr/bin/env python3
"""Doc-driven footage engine — source a WHOLE episode's real visuals in one
command (2026-07-20, built once Pexels/Pixabay/DVIDS keys landed).

Reads the doc spec and fetches every scene's declared media through the ranked
per-niche sources (scripts/fetch_footage.py machinery — PD/CC only, transcode,
ATTRIBUTION.md, contact sheets):

  scene fields it acts on:
    "img": "klia",   "query": "kuala lumpur international airport night"
        -> fetches images into public/shorts/<slug>/images/klia_N.* until the
           prefix pool has --per-prefix files (default 3)
    "video": "b777_1.mp4", "videoQuery": "boeing 777 takeoff night"
        -> fetches video(s) into public/shorts/<slug>/video/ until b777_1.mp4
           exists (prefix pool sized to the highest _N referenced in the doc)
  doc-level field: "niche": aviation|space|ocean|history|football|tech|generic
  (CLI --niche overrides; sketch:true scenes are skipped — those are authored
  illustrations, not archival fetches).
  per-scene overrides (revamp §3.2): "niche": "briefing" or
  "sources": ["dvids","nasa"] (list or comma string) on the scene that
  declares a prefix's query — scene `sources` > scene `niche` > "stock" >
  doc/CLI niche. First scene that declares an override wins for its prefix.

  Clip length: each video prefix's transcode cap is sized from the scenes that
  use it — sum of their on-screen seconds (doctiming LEAD/HOLD over manifest
  durations when <slug>.manifest.json exists, else words/2.3) + the largest
  videoFrom + 6s margin, clamped to 20-120s. The old fixed 20s slice was the
  root cause of clips that never showed what their title said (memory
  footage-20s-slice-root-cause). --max-seconds forces one cap for every prefix.

  .venv-lipsync/bin/python scripts/fetch_doc_footage.py <slug>
      [--per-prefix 3] [--niche aviation] [--uhd] [--max-seconds N] [--dry-run]
      [--no-verify]

  --dry-run prints every prefix's query, effective source ranking and clip cap
  with no network.

Every downloaded file is vision-checked against its query by Gemini before it
counts toward the pool (2026-08-21, see fetch_footage.py's docstring) — a
MISMATCH gets deleted and the next candidate tried instead, logged as
"!! MISMATCH (vision check): ...". `--no-verify` skips this (needs
GEMINI_API_KEY either way to run; skips itself gracefully if absent).

After it runs: eyeball every contact sheet in out/qa/, then
build_doc_vo.py <slug> --manifest-only and audit_scene_relevance.py <slug>.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import doctiming  # noqa: E402
import footage  # noqa: E402

from fetch_footage import NICHE_RANK, existing_titles, norm_title  # noqa: E402

REPO = footage.REPO
DOCS = REPO / "src" / "mindwired-doc" / "docs"
# per-prefix clip cap: floor keeps the old behaviour for one short scene, cap
# keeps a PD/CC archival slice from becoming a whole reel
CLIP_FLOOR_S, CLIP_CAP_S, CLIP_MARGIN_S = 20, 120, 6.0


def prefix_max_seconds(doc: dict, durations: dict) -> dict[str, int]:
    """video prefix -> transcode cap from every scene whose `video` uses it."""
    secs: dict[str, float] = defaultdict(float)
    offs: dict[str, float] = defaultdict(float)
    for s in doc["scenes"]:
        m = re.match(r"(.+?)_(\d+)\.\w+$", s.get("video") or "")
        if not m:
            continue
        secs[m.group(1)] += doctiming.scene_frames(s, durations) / doctiming.FPS
        offs[m.group(1)] = max(offs[m.group(1)], float(s.get("videoFrom") or 0))
    return {p: int(min(CLIP_CAP_S, max(CLIP_FLOOR_S,
                                       round(secs[p] + offs[p] + CLIP_MARGIN_S))))
            for p in secs}


def scene_ranking(s: dict, kind: str) -> tuple[list[str] | None, str]:
    """(ranking, label) from a scene's own `sources`/`niche`, else (None, "")."""
    src = s.get("sources")
    if src:
        lst = [x.strip() for x in (src.split(",") if isinstance(src, str) else src)
               if x.strip()]
        bad = [x for x in lst if x not in footage.SOURCES]
        if bad:
            raise ValueError(f"unknown source(s) {', '.join(bad)}")
        return lst, "scene sources"
    if s.get("niche"):
        if s["niche"] not in NICHE_RANK:
            raise ValueError(f"unknown niche {s['niche']!r}")
        return NICHE_RANK[s["niche"]][kind], f"scene niche={s['niche']}"
    return None, ""


def fetch_one(query: str, out_dir: Path, prefix: str, count: int, kind: str,
              ranking: list[str], max_seconds: int) -> int:
    """fetch_footage's source loop, importable (same dedup + ranking)."""
    seen_titles = existing_titles(out_dir)
    seen_urls: set[str] = set()
    got = 0
    for src in ranking:
        if got >= count:
            break
        try:
            found = footage.SOURCES[src](query, count, kind)
        except Exception as e:  # noqa: BLE001
            print(f"    ({src} failed: {e.__class__.__name__})")
            continue
        found = footage.rank_by_query(
            [a for a in found if a.url and a.url not in seen_urls
             and norm_title(a.title) not in seen_titles], query)
        if not found:
            continue
        saved = footage.download_assets(found, out_dir, prefix, count,
                                        max_seconds=max_seconds,
                                        max_h=footage.TARGET_H,
                                        # 4K episodes need sharper stills too —
                                        # Ken Burns exposes soft sources at 2160p
                                        min_width=1600 if footage.TARGET_H >= 2160 else 800,
                                        query=query)
        for _, a in saved:
            got += 1
            seen_titles.add(norm_title(a.title))
            seen_urls.add(a.url)
    return got


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--per-prefix", type=int, default=3,
                    help="target image-pool size per prefix (variety floor)")
    ap.add_argument("--niche", default=None, choices=sorted(NICHE_RANK))
    ap.add_argument("--uhd", action="store_true",
                    help="fetch up to 2160p (use with the 4K render default)")
    ap.add_argument("--max-seconds", type=int, default=None,
                    help="force one clip cap for every video prefix "
                         "(default: sized per prefix from its scenes)")
    ap.add_argument("--doc", type=Path, default=None,
                    help="explicit doc JSON path (default src/mindwired-doc/docs/<slug>.json)")
    ap.add_argument("--root", type=Path, default=None,
                    help="media root override (default public/shorts/<slug>)")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--no-verify", action="store_true",
                    help="skip the Gemini vision relevance check on every fetched file")
    args = ap.parse_args()

    footage.TARGET_H = 2160 if args.uhd else 1080
    footage.VERIFY = not args.no_verify
    doc_path = args.doc or (DOCS / f"{args.slug}.json")
    doc = json.loads(doc_path.read_text())
    niche = args.niche or doc.get("niche", "generic")
    man_path = doc_path.with_name(f"{args.slug}.manifest.json")
    durations = (json.loads(man_path.read_text()).get("durations", {})
                 if man_path.exists() else {})
    clip_s = prefix_max_seconds(doc, durations)
    root = args.root or (REPO / "public" / "shorts" / args.slug)
    img_dir, vid_dir = root / "images", root / "video"

    # stock-first order for scenes tagged "stock": true — generic atmosphere
    # b-roll (clouds, waves, city) where modern stock beats archival recall
    STOCK_RANK = {"video": ["pexels", "pixabay", "commons", "archive_org"],
                  "image": ["pexels", "pixabay", "commons", "openverse"]}

    # ---- plan the want-list ----
    # ranking per job: scene sources > scene niche > stock-first > doc niche
    img_jobs: dict[str, tuple[str, list[str], str]] = {}       # prefix -> (query, rank, why)
    vid_need: dict[str, tuple[str, int, list[str], str]] = {}  # prefix -> (query, maxN, rank, why)
    img_over: set[str] = set()  # prefixes whose ranking came from a scene override
    vid_over: set[str] = set()
    skipped = []

    def rank_for(s: dict, kind: str) -> tuple[list[str], str, bool]:
        try:
            r, why = scene_ranking(s, kind)
        except ValueError as e:
            skipped.append(f"{s['id']}: {e} — using the default ranking")
            r, why = None, ""
        if r:
            return r, why, True
        if s.get("stock"):
            return STOCK_RANK[kind], "stock-first", False
        return NICHE_RANK[niche][kind], f"niche={niche}", False

    for s in doc["scenes"]:
        if s.get("sketch"):
            continue  # authored illustrations, not archival fetches
        if s.get("img") and s.get("query"):
            r, why, over = rank_for(s, "image")
            if s["img"] not in img_jobs or (over and s["img"] not in img_over):
                q = img_jobs[s["img"]][0] if s["img"] in img_jobs else s["query"]
                img_jobs[s["img"]] = (q, r, why)
                if over:
                    img_over.add(s["img"])
        if s.get("video") and s.get("videoQuery"):
            m = re.match(r"(.+?)_(\d+)\.\w+$", s["video"])
            if not m:
                skipped.append(f"{s['id']}: video '{s['video']}' not <prefix>_N.mp4 "
                               f"— fetch it by hand")
                continue
            prefix, n = m.group(1), int(m.group(2))
            r, why, over = rank_for(s, "video")
            q, hi, rk, wy = vid_need.get(prefix, (s["videoQuery"], 0, r, why))
            if over and prefix not in vid_over:
                rk, wy = r, why
                vid_over.add(prefix)
            vid_need[prefix] = (q, max(hi, n), rk, wy)

    def cap(prefix: str) -> int:
        return args.max_seconds or clip_s.get(prefix, CLIP_FLOOR_S)

    print(f"{args.slug}: niche={niche} target={footage.TARGET_H}p — "
          f"{len(img_jobs)} image prefix(es), {len(vid_need)} video prefix(es)"
          f" — clip caps from {'--max-seconds' if args.max_seconds else 'manifest durations' if durations else 'words/2.3 estimate'}")
    for msg in skipped:
        print(f"  skip  {msg}")
    if args.dry_run:
        for p, (q, rk, why) in img_jobs.items():
            print(f"  IMG {p:16s} <- {q!r} (pool target {args.per_prefix})\n"
                  f"      ranking [{why}]: {' > '.join(rk)}")
        for p, (q, hi, rk, why) in vid_need.items():
            print(f"  VID {p:16s} <- {q!r} (need {hi} file(s), max_seconds={cap(p)})\n"
                  f"      ranking [{why}]: {' > '.join(rk)}")
        return

    total = 0
    for prefix, (query, rank, why) in img_jobs.items():
        have = len(list(img_dir.glob(f"{prefix}_*"))) if img_dir.exists() else 0
        if have >= args.per_prefix:
            print(f"  IMG {prefix}: pool full ({have}) — skip")
            continue
        print(f"  IMG {prefix}: {query!r} [{why}]")
        n = fetch_one(query, img_dir, prefix, args.per_prefix, "image",
                      rank, CLIP_FLOOR_S)
        total += n
        if have + n < 2:
            print(f"    !! thin pool ({have + n}) — reword the query or fetch by hand")
    for prefix, (query, hi, rank, why) in vid_need.items():
        print(f"  VID {prefix}: {query!r} [{why}] max_seconds={cap(prefix)}")
        total += fetch_one(query, vid_dir, prefix, hi, "video",
                           rank, cap(prefix))

    # one contact sheet over everything new-ish for the mandatory eyeball
    fresh = []
    for d in (img_dir, vid_dir):
        if d.exists():
            fresh += sorted(d.iterdir(), key=lambda f: -f.stat().st_mtime)[:16]
    if fresh:
        sheet = REPO / "out" / "qa" / f"docfootage_{args.slug}_sheet.png"
        if footage.contact_sheet(fresh[:20], sheet, label=f"{args.slug} doc footage"):
            print(f"\ncontact sheet -> {sheet.relative_to(REPO)}  (EYEBALL IT)")
    print(f"{total} new file(s). Next: build_doc_vo.py {args.slug} --manifest-only "
          f"&& audit_scene_relevance.py {args.slug}")


if __name__ == "__main__":
    main()
