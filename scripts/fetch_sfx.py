#!/usr/bin/env python3
"""CC0 sound-effect fetcher — the audio sibling of fetch_footage.py (2026-07-19).

Sources (from the SFX research in docs/guides/SKETCH-BRAND.md):
  1. Freesound.org — best catalog; free key (https://freesound.org/apiv2/apply,
     FREESOUND_API_KEY in .env). CC0-filtered; HQ previews download keyless.
  2. Openverse /v1/audio/ — zero-key fallback (aggregates Freesound CC0 +
     Wikimedia audio). ~20 req/min anonymous.
Rejected after license audit: BBC Sound Effects (RemArc = non-commercial),
freesfx.co.uk (mandatory attribution + no API), Pixabay (no audio API).

Every hit converts to mono 48k wav trimmed to --max-seconds, logged to
public/sfx/LICENSES.md. CC0 only — safe for monetized use, no credit needed
(we log provenance anyway).

  .venv-lipsync/bin/python scripts/fetch_sfx.py "pencil scribble" --name sketch_scribble
"""
from __future__ import annotations

import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import footage  # noqa: E402  (UA, env_key, _get_json helpers)

REPO = footage.REPO
SFX_DIR = REPO / "public" / "sfx"


def search_freesound(query: str, count: int) -> list[dict]:
    key = footage.env_key("FREESOUND_API_KEY")
    if not key:
        return []
    data = footage._get_json("https://freesound.org/apiv2/search/", {
        "query": query, "filter": 'license:"Creative Commons 0"',
        "fields": "id,name,previews,username,duration,license",
        "page_size": count * 3, "token": key})
    out = []
    for r in (data or {}).get("results", []):
        prev = (r.get("previews") or {}).get("preview-hq-ogg") or \
               (r.get("previews") or {}).get("preview-hq-mp3")
        if not prev:
            continue
        out.append(dict(source="freesound", title=r.get("name", ""), url=prev,
                        author=r.get("username", ""), duration=r.get("duration") or 0,
                        page=f"https://freesound.org/s/{r.get('id')}/"))
    return out


def search_openverse_audio(query: str, count: int) -> list[dict]:
    data = footage._get_json("https://api.openverse.org/v1/audio/", {
        "q": query, "license": "cc0", "page_size": count * 3})
    out = []
    for r in (data or {}).get("results", []):
        if not r.get("url"):
            continue
        out.append(dict(source="openverse", title=r.get("title") or "untitled",
                        url=r["url"], author=r.get("creator") or "unknown",
                        duration=(r.get("duration") or 0) / 1000.0,
                        page=r.get("foreign_landing_url", "")))
    return out


def convert(src: Path, dst: Path, max_seconds: float) -> bool:
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(src), "-t", str(max_seconds),
           "-ac", "1", "-ar", "48000", "-af", "loudnorm=I=-23", str(dst)]
    return subprocess.run(cmd).returncode == 0 and dst.exists() and dst.stat().st_size > 1000


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("query")
    ap.add_argument("--name", required=True, help="output stem -> public/sfx/<name>.wav")
    ap.add_argument("--max-seconds", type=float, default=4.0)
    ap.add_argument("--prefer-short", action="store_true",
                    help="rank shortest first (pops/ticks)")
    args = ap.parse_args()
    SFX_DIR.mkdir(parents=True, exist_ok=True)
    dst = SFX_DIR / f"{args.name}.wav"
    if dst.exists():
        print(f"{dst.relative_to(REPO)} exists — delete to refetch")
        return

    cands = search_freesound(args.query, 4) or search_openverse_audio(args.query, 4)
    if not cands:
        sys.exit(f"no CC0 hits for {args.query!r}")
    # sane duration first: sfx should be snappy
    cands.sort(key=lambda c: (c["duration"] or 99) if args.prefer_short
               else abs((c["duration"] or 99) - args.max_seconds))
    import httpx
    for c in cands:
        try:
            with httpx.Client(headers=footage.UA, timeout=120, follow_redirects=True) as cl:
                r = cl.get(c["url"])
                r.raise_for_status()
            with tempfile.NamedTemporaryFile(suffix=Path(c["url"]).suffix or ".mp3",
                                             delete=False) as tf:
                tf.write(r.content)
                tmp = Path(tf.name)
            ok = convert(tmp, dst, args.max_seconds)
            tmp.unlink(missing_ok=True)
            if not ok:
                continue
        except Exception as e:  # noqa: BLE001
            print(f"  skip ({e.__class__.__name__}): {c['title'][:40]}")
            continue
        with (SFX_DIR / "LICENSES.md").open("a", encoding="utf-8") as f:
            f.write(f"- `{dst.name}` — \"{c['title']}\" by {c['author']} — CC0 — "
                    f"{c['page']} ({c['source']}, fetched via fetch_sfx.py)\n")
        print(f"-> {dst.relative_to(REPO)}  \"{c['title'][:50]}\" [{c['source']}/CC0] "
              f"— LISTEN to it before shipping")
        return
    sys.exit("all candidates failed to download/convert")


if __name__ == "__main__":
    main()
