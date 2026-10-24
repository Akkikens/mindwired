#!/usr/bin/env python3
"""Backfill public/shorts/<slug>/PROVENANCE.jsonl for an episode fetched before
the structured-provenance row existed (BLACKBOX-2027-REVAMP §3.2, Phase 2 #1).

For every entry in images/ATTRIBUTION.md and video/ATTRIBUTION.md that has no
PROVENANCE.jsonl row yet, appends one row in footage.log_attribution's shape:

  {file, sha256, media, source, title, url, page, author, license, lic_key,
   query: "", verify: {status: "legacy-unverified", verdict: "legacy-unverified",
   note}, fetched_at: null, backfilled_at, file_present, attribution_line}

"legacy-unverified" is honest: these files never went through the vision check
(or did, and the verdict was never persisted). preflight_doc.py WARNs on every
one and BLOCKs when it sits in the first ~30s hook — which is the point: the
columbia hook shipped an Apollo-era clip under a 2003 breakup.

Once a human has actually LOOKED at frames from a file (0/8/15s, memory
footage-20s-slice-root-cause) and confirmed subject + era, record that:

    python3 scripts/provenance_backfill.py <slug> --verify video/h1clip_1.mp4 \\
        --note "frames 0/8/15s: 2003 MCC, matches h1"

which appends a superseding row with verify.status "verified" (model
"human-eyeball"). Rows are append-only; the last row per file wins.

    python3 scripts/provenance_backfill.py <slug> [--dry-run]
    python3 scripts/provenance_backfill.py --all [--dry-run]   # every slug with
                                                               # an ATTRIBUTION.md
Idempotent: a file that already has a row is never re-backfilled.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import provenance  # noqa: E402

SHORTS = provenance.SHORTS
SUBS = {"images": "image", "video": "video"}


def sha256(p: Path) -> str | None:
    try:
        h = hashlib.sha256()
        with p.open("rb") as f:
            for chunk in iter(lambda: f.read(1 << 20), b""):
                h.update(chunk)
        return h.hexdigest()
    except OSError:
        return None


def now() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def backfill(slug: str, dry: bool = False) -> tuple[int, int]:
    """-> (rows written, rows already present)."""
    root = SHORTS / slug
    have = provenance.load_jsonl(slug)
    rows, skipped = [], 0
    for sub, media in SUBS.items():
        parsed = provenance.parse_attribution_rows(root / sub)
        # files on disk that ATTRIBUTION.md names only in a shape the parser
        # can't read (`- a_1.jpg / a_2.jpg — "Title", …`): still a real entry
        text = provenance.attribution_mentions(root / sub)
        d = root / sub
        for f in (sorted(d.iterdir()) if d.is_dir() else []):
            if f.name in parsed or f.name == "ATTRIBUTION.md" or f.name not in text:
                continue
            line = next(l.strip() for l in text.splitlines() if f.name in l)
            tm = re.search(r'["“](.+?)["”]', line)
            parsed[f.name] = dict(title=tm.group(1) if tm else "", license="",
                                  lic_key=provenance.lic_key(line), author="",
                                  page="", url="", source="unknown", line=line)
        for fname, a in parsed.items():
            rel = f"{sub}/{fname}"
            if rel in have:
                skipped += 1
                continue
            p = root / sub / fname
            rows.append({
                "file": rel, "sha256": sha256(p) if p.exists() else None,
                "media": media, "source": a["source"], "title": a["title"],
                "url": a["url"], "page": a["page"], "author": a["author"] or "unknown",
                "license": a["license"], "lic_key": a["lic_key"], "query": "",
                "verify": {"status": provenance.LEGACY, "verdict": provenance.LEGACY,
                           "note": "backfilled from ATTRIBUTION.md — never vision-checked; "
                                   "eyeball frames 0/8/15s then --verify"},
                "fetched_at": None, "backfilled_at": now(),
                "file_present": p.exists(), "attribution_line": a["line"],
            })
    if rows and not dry:
        with (root / "PROVENANCE.jsonl").open("a", encoding="utf-8") as f:
            for r in rows:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
    return len(rows), skipped


def mark_verified(slug: str, files: list[str], note: str, dry: bool) -> int:
    root = SHORTS / slug
    have = provenance.load_jsonl(slug)
    live_a, live_v = provenance.live_maps(slug)
    out = []
    for rel in files:
        sub, _, fname = rel.partition("/")
        if sub not in SUBS or not fname:
            sys.exit(f"--verify wants images/<file> or video/<file>, got {rel!r}")
        base = have.get(rel) or (live_a if sub == "images" else live_v).get(fname)
        if base is None and fname in provenance.attribution_mentions(root / sub):
            base = {"title": "", "source": "unknown", "license": ""}
        if base is None:
            sys.exit(f"{rel}: no provenance at all — log its real source first "
                     f"(ATTRIBUTION.md line, then rerun without --verify)")
        row = {k: v for k, v in base.items() if k not in ("verify", "origin")}
        row["file"] = rel
        row.setdefault("media", SUBS[sub])
        p = root / rel
        row["sha256"] = sha256(p) if p.exists() else row.get("sha256")
        row["verify"] = {"status": provenance.VERIFIED, "verdict": "MATCH",
                         "model": "human-eyeball", "note": note, "at": now()}
        out.append(row)
    if not dry:
        with (root / "PROVENANCE.jsonl").open("a", encoding="utf-8") as f:
            for r in out:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
    return len(out)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug", nargs="?")
    ap.add_argument("--all", action="store_true",
                    help="every public/shorts/<slug> that has an ATTRIBUTION.md")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--verify", default="",
                    help="comma list of images/<f>|video/<f> a human has eyeballed")
    ap.add_argument("--note", default="", help="what you looked at (required with --verify)")
    args = ap.parse_args()

    if args.verify:
        if not args.slug or not args.note:
            ap.error("--verify needs a slug and --note")
        n = mark_verified(args.slug, [f.strip() for f in args.verify.split(",") if f.strip()],
                          args.note, args.dry_run)
        print(f"{args.slug}: {n} row(s) marked verified (human-eyeball)"
              f"{' [dry-run]' if args.dry_run else ''}")
        return 0

    if args.all:
        slugs = sorted(d.name for d in SHORTS.iterdir()
                       if d.is_dir() and not d.name.startswith("_")
                       and any((d / s / "ATTRIBUTION.md").exists() for s in SUBS))
    elif args.slug:
        slugs = [args.slug]
    else:
        ap.error("give a slug or --all")
    total = 0
    for slug in slugs:
        if not (SHORTS / slug).is_dir():
            print(f"{slug}: no public/shorts/{slug}/ — nothing to backfill")
            continue
        n, had = backfill(slug, args.dry_run)
        total += n
        print(f"{slug}: {n} legacy-unverified row(s) "
              f"{'would be ' if args.dry_run else ''}written, {had} already had rows")
    if total and not args.dry_run:
        print("next: build_doc_vo.py <slug> --manifest-only to snapshot them into "
              "manifest.assets/videos (the gates also read PROVENANCE.jsonl live)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
