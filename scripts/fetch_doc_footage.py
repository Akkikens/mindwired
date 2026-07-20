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

  .venv-lipsync/bin/python scripts/fetch_doc_footage.py <slug>
      [--per-prefix 3] [--niche aviation] [--uhd] [--max-seconds 20] [--dry-run]

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
import footage  # noqa: E402

from fetch_footage import NICHE_RANK, existing_titles, norm_title  # noqa: E402

REPO = footage.REPO
DOCS = REPO / "src" / "mindwired-doc" / "docs"


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
                                        min_width=1600 if footage.TARGET_H >= 2160 else 800)
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
    ap.add_argument("--max-seconds", type=int, default=20)
    ap.add_argument("--doc", type=Path, default=None,
                    help="explicit doc JSON path (default src/mindwired-doc/docs/<slug>.json)")
    ap.add_argument("--root", type=Path, default=None,
                    help="media root override (default public/shorts/<slug>)")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    footage.TARGET_H = 2160 if args.uhd else 1080
    doc_path = args.doc or (DOCS / f"{args.slug}.json")
    doc = json.loads(doc_path.read_text())
    niche = args.niche or doc.get("niche", "generic")
    root = args.root or (REPO / "public" / "shorts" / args.slug)
    img_dir, vid_dir = root / "images", root / "video"

    # stock-first order for scenes tagged "stock": true — generic atmosphere
    # b-roll (clouds, waves, city) where modern stock beats archival recall
    STOCK_RANK = {"video": ["pexels", "pixabay", "commons", "archive_org"],
                  "image": ["pexels", "pixabay", "commons", "openverse"]}

    # ---- plan the want-list ----
    img_jobs: dict[str, tuple[str, bool]] = {}    # prefix -> (query, stock?)
    vid_need: dict[str, tuple[str, int, bool]] = {}  # prefix -> (query, maxN, stock?)
    skipped = []
    for s in doc["scenes"]:
        if s.get("sketch"):
            continue  # authored illustrations, not archival fetches
        if s.get("img") and s.get("query"):
            img_jobs.setdefault(s["img"], (s["query"], bool(s.get("stock"))))
        if s.get("video") and s.get("videoQuery"):
            m = re.match(r"(.+?)_(\d+)\.\w+$", s["video"])
            if not m:
                skipped.append(f"{s['id']}: video '{s['video']}' not <prefix>_N.mp4 "
                               f"— fetch it by hand")
                continue
            prefix, n = m.group(1), int(m.group(2))
            q, hi, stk = vid_need.get(prefix, (s["videoQuery"], 0, bool(s.get("stock"))))
            vid_need[prefix] = (q, max(hi, n), stk)

    print(f"{args.slug}: niche={niche} target={footage.TARGET_H}p — "
          f"{len(img_jobs)} image prefix(es), {len(vid_need)} video prefix(es)")
    for msg in skipped:
        print(f"  skip  {msg}")
    if args.dry_run:
        for p, (q, stk) in img_jobs.items():
            print(f"  IMG {p:16s} <- {q!r} (pool target {args.per_prefix}"
                  f"{', stock-first' if stk else ''})")
        for p, (q, hi, stk) in vid_need.items():
            print(f"  VID {p:16s} <- {q!r} (need {hi} file(s)"
                  f"{', stock-first' if stk else ''})")
        return

    total = 0
    for prefix, (query, stk) in img_jobs.items():
        have = len(list(img_dir.glob(f"{prefix}_*"))) if img_dir.exists() else 0
        if have >= args.per_prefix:
            print(f"  IMG {prefix}: pool full ({have}) — skip")
            continue
        print(f"  IMG {prefix}: {query!r}{' [stock]' if stk else ''}")
        rank = (STOCK_RANK if stk else NICHE_RANK[niche])["image"]
        n = fetch_one(query, img_dir, prefix, args.per_prefix, "image",
                      rank, args.max_seconds)
        total += n
        if have + n < 2:
            print(f"    !! thin pool ({have + n}) — reword the query or fetch by hand")
    for prefix, (query, hi, stk) in vid_need.items():
        print(f"  VID {prefix}: {query!r}{' [stock]' if stk else ''}")
        rank = (STOCK_RANK if stk else NICHE_RANK[niche])["video"]
        total += fetch_one(query, vid_dir, prefix, hi, "video",
                           rank, args.max_seconds)

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
