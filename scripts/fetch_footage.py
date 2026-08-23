#!/usr/bin/env python3
"""ONE entry point for real archival footage + photos — the anti-"AI slop" fetcher.

Tries every legitimate free source in per-niche ranked order until it has
`--count` files, transcodes video to 1080p H.264, logs every file to
ATTRIBUTION.md, and drops a contact sheet in out/qa/ for the mandatory eyeball.
PD / CC0 / CC-BY / CC-BY-SA only — NC/ND never pass the filter.

  .venv-lipsync/bin/python scripts/fetch_footage.py "boeing 777 landing" \
      --niche aviation --kind video --out public/shorts/<slug>/video \
      --prefix b777 --count 4

  --kind video|image      what to fetch (default video)
  --niche aviation|space|ocean|history|football|tech|generic
                          picks the source ranking (see scripts/SOURCES-GUIDE.md)
  --sources a,b,c         override the ranking explicitly
  --max-seconds N         video clip cap (default 20; long reels start ~10% in)
  --no-sheet              skip the contact sheet
  --no-verify             skip the Gemini vision relevance check (on by default)

Free keys unlock more sources (optional, graceful without them):
  PEXELS_API_KEY   sign up at https://www.pexels.com/api/
  PIXABAY_API_KEY  sign up at https://pixabay.com/api/docs/
Keys go in mindwired/.env. Pexels/Pixabay are MODERN GENERIC b-roll (ocean,
clouds, city) — for real events/people/places always prefer the archival
sources, and never present stock as the real thing.

Vision relevance check (2026-08-21): every downloaded file is shown to Gemini
(GEMINI_API_KEY in .env — same key the Veo/host pipelines use) with the search
query, asking whether it actually depicts that subject. A MISMATCH is deleted
and the next candidate is tried instead — this is what catches a source's
full-text search handing back something that only matches on words (a NASA
telescope named "Fermi" for a query about the physicist, an observatory's own
asteroid-radar output for a query wanting a photo of the dish). Fails OPEN: no
key, no PIL, or an API error just skips the check rather than blocking the
fetch. It removes most of the need to eyeball every contact sheet by hand, but
doesn't replace a final human glance before render — it's a second-opinion
model, not a guarantee.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import footage  # noqa: E402

REPO = footage.REPO

# Ranked per niche: archival/real first, generic stock last. Mirrors
# scripts/SOURCES-GUIDE.md — update both together.
NICHE_RANK: dict[str, dict[str, list[str]]] = {
    "aviation": {"video": ["dvids", "nara", "archive_org", "commons", "loc", "pexels", "pixabay"],
                 "image": ["commons", "openverse", "pexels", "pixabay"]},
    "space":    {"video": ["nasa", "nasa_svs", "eso", "commons", "archive_org", "pexels"],
                 "image": ["nasa", "commons", "openverse"]},
    "ocean":    {"video": ["noaa_ocean", "commons", "nasa", "archive_org", "pexels", "pixabay"],
                 "image": ["commons", "openverse", "pexels", "pixabay"]},
    "history":  {"video": ["archive_org", "nara", "loc", "commons"],
                 "image": ["commons", "loc", "openverse"]},
    "football": {"video": ["commons", "pexels", "pixabay"],
                 "image": ["commons", "openverse", "pexels"]},
    "tech":     {"video": ["archive_org", "commons", "pexels", "pixabay"],
                 "image": ["commons", "openverse", "pexels", "pixabay"]},
    "generic":  {"video": ["commons", "archive_org", "pexels", "pixabay"],
                 "image": ["commons", "openverse", "pexels", "pixabay"]},
    # Official government press conferences/briefings — the LEGAL analog to a
    # network news broadcast: real podium, real officials, PD because it's a
    # federal government work. NASA/NTSB/FAA press conferences, Pentagon
    # briefings (via DVIDS), White House/C-SPAN archives. Never substitute
    # actual CNN/BBC/Fox/local-news broadcast footage — copyrighted,
    # Content-ID-fingerprinted, no clip-length safe harbor (2026-08-21).
    "briefing": {"video": ["dvids", "nasa", "archive_org", "nara", "commons"],
                 "image": ["nasa", "dvids", "commons"]},
}


norm_title = footage.norm_title


def existing_titles(out_dir: Path) -> set[str]:
    """Titles already fetched into this dir — never fetch a dupe. Reads the
    .fetched_titles sidecar (exact norm_title round-trip); the ATTRIBUTION.md
    regex is only a fallback for dirs fetched before the sidecar existed (it
    truncates titles containing ' — '/' by ', so it under-dedupes)."""
    titles = set()
    side = out_dir / ".fetched_titles"
    if side.exists():
        titles |= {l.strip() for l in side.read_text(encoding="utf-8").splitlines()
                   if l.strip()}
    att = out_dir / "ATTRIBUTION.md"
    if att.exists():
        for line in att.read_text(encoding="utf-8", errors="replace").splitlines():
            m = re.match(r"-\s+(?:\*\*|`)(?:.+?)(?:\*\*|`)\s+[—-]\s+[\"“]?(.+?)[\"”]?\s+(?:by |[—-])", line)
            if m:
                titles.add(norm_title(m.group(1)))
    return titles


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("query")
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--prefix", required=True)
    ap.add_argument("--count", type=int, default=4)
    ap.add_argument("--kind", default="video", choices=["video", "image"])
    ap.add_argument("--niche", default="generic", choices=sorted(NICHE_RANK))
    ap.add_argument("--sources", default="",
                    help=f"comma list overriding the niche ranking; valid: {', '.join(footage.SOURCES)}")
    ap.add_argument("--max-seconds", type=int, default=20)
    ap.add_argument("--min-width", type=int, default=800)
    ap.add_argument("--no-sheet", action="store_true")
    ap.add_argument("--uhd", action="store_true",
                    help="keep footage up to 2160p (4K episodes; default caps at 1080p)")
    ap.add_argument("--no-verify", action="store_true",
                    help="skip the Gemini vision relevance check (default: on if "
                         "GEMINI_API_KEY is set) — use for speed or if the API is down")
    args = ap.parse_args()

    footage.TARGET_H = 2160 if args.uhd else 1080
    footage.VERIFY = not args.no_verify
    ranking = ([s.strip() for s in args.sources.split(",") if s.strip()]
               if args.sources else NICHE_RANK[args.niche][args.kind])
    bad = [s for s in ranking if s not in footage.SOURCES]
    if bad:
        sys.exit(f"unknown source(s): {', '.join(bad)} — valid: {', '.join(footage.SOURCES)}")

    print(f"fetch_footage: {args.query!r}  niche={args.niche} kind={args.kind} "
          f"count={args.count}\n  ranking: {' > '.join(ranking)}")
    seen_titles = existing_titles(args.out)
    seen_urls: set[str] = set()
    got: list[Path] = []
    tally: dict[str, int] = {}
    for src in ranking:
        if len(got) >= args.count:
            break
        try:
            found = footage.SOURCES[src](args.query, args.count, args.kind)
        except Exception as e:  # noqa: BLE001 — a dead source never kills the run
            print(f"  ({src} failed: {e.__class__.__name__} {e})")
            continue
        found = footage.rank_by_query(
            [a for a in found
             if a.url and a.url not in seen_urls
             and norm_title(a.title) not in seen_titles], args.query)
        if not found:
            print(f"  ({src}: no usable results)")
            continue
        print(f"  {src}: {len(found)} candidate(s)")
        # download_assets re-globs existing prefix files each call, so passing the
        # full target keeps the run incremental across sources
        saved = footage.download_assets(
            found, args.out, args.prefix, args.count,
            max_seconds=args.max_seconds, min_width=args.min_width,
            max_h=2160 if args.uhd else 1080, query=args.query)
        for p, a in saved:
            got.append(p)
            tally[src] = tally.get(src, 0) + 1
            # blacklist ONLY what actually saved — a failed download here must
            # not stop a later source from providing its working copy
            seen_titles.add(norm_title(a.title))
            seen_urls.add(a.url)
        if len(got) >= args.count:
            break

    print(f"\n{len(got)} new file(s) -> {args.out}")
    for src, n in tally.items():
        print(f"  {src}: {n}")
    if not got:
        print("  (nothing new — either already fetched, or no source had a licensed match; "
          "reword the query or try --sources)")
    if got and not args.no_sheet:
        sheet = REPO / "out" / "qa" / f"footage_{args.prefix}_sheet.png"
        if footage.contact_sheet(got, sheet, label=f"{args.query} [{args.niche}/{args.kind}]"):
            print(f"  contact sheet -> {sheet.relative_to(REPO)}  (EYEBALL IT before wiring scenes)")
    print("  credits -> ATTRIBUTION.md (paste CC-BY lines into the video description)")


if __name__ == "__main__":
    main()
