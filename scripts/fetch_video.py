#!/usr/bin/env python3
"""FREE real archival VIDEO fetcher — Wikimedia Commons (PD/CC only), transcoded to
1080p H.264 mp4 for Remotion OffthreadVideo. The video sibling of fetch_media.py.

Only PD / CC0 / CC-BY / CC-BY-SA kept (NC/ND rejected — can't monetize). Every clip
logged to <out>/ATTRIBUTION.md (author + license + source URL) — CC-BY(-SA) needs credit.

  .venv-lipsync/bin/python scripts/fetch_video.py "ocean waves aerial" \
      --out public/shorts/mh370/video --count 3 --prefix oceanvid [--max-seconds 15]
"""
from __future__ import annotations
import argparse, html, re, subprocess, sys, tempfile
from pathlib import Path
import httpx

COMMONS = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "mindwired-doc/1.0 (archival video; contact akshay@climbtogether.co)"}
REJECT = ("nc", "nd", "noncommercial", "noderivs")


def license_key(name: str) -> str | None:
    n = name.lower()
    if any(f"-{r}" in n or f" {r}" in n for r in REJECT):
        return None
    if "public domain" in n or n.strip() in {"pd", "pd-us", "pdm"} or "no restrictions" in n:
        return "pd"
    if "cc0" in n or "zero" in n:
        return "cc0"
    if "by-sa" in n or "attribution-sharealike" in n:
        return "by-sa"
    if "cc by" in n or n.startswith("by") or "attribution" in n:
        return "by"
    return None


def strip_html(t: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", t or "")).strip()


def fetch_commons_video(query: str, count: int) -> list[dict]:
    params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": f"{query} filetype:video", "gsrnamespace": 6, "gsrlimit": count * 5,
        "prop": "imageinfo", "iiprop": "url|extmetadata|size|mime|mediatype",
    }
    r = httpx.get(COMMONS, params=params, headers=UA, timeout=60)
    r.raise_for_status()
    pages = (r.json().get("query") or {}).get("pages") or {}
    out = []
    for p in pages.values():
        for ii in p.get("imageinfo", []):
            if not (ii.get("mime", "").startswith("video") or ii.get("mediatype") == "VIDEO"):
                continue
            meta = ii.get("extmetadata") or {}
            lic = license_key((meta.get("LicenseShortName") or {}).get("value", ""))
            if not lic:
                continue
            out.append({
                "title": strip_html(p.get("title", "").removeprefix("File:")),
                "url": ii.get("url"),
                "page": ii.get("descriptionurl", ""),
                "author": strip_html((meta.get("Artist") or {}).get("value", "unknown")),
                "license": (meta.get("LicenseShortName") or {}).get("value", lic),
                "lic_key": lic,
            })
    return out


def transcode(src: Path, dst: Path, max_seconds: int) -> bool:
    """webm/ogv/mp4 -> 1080p H.264 mp4, capped duration, silent (b-roll plays muted)."""
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(src),
           "-t", str(max_seconds),
           "-vf", "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,fps=30",
           "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium",
           "-an", str(dst)]
    return subprocess.run(cmd).returncode == 0 and dst.exists() and dst.stat().st_size > 0


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("query")
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--count", type=int, default=3)
    ap.add_argument("--prefix", required=True)
    ap.add_argument("--max-seconds", type=int, default=15)
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    items = fetch_commons_video(args.query, args.count)
    if not items:
        print(f"  no PD/CC video for {args.query!r}")
        return
    attrib = args.out / "ATTRIBUTION.md"
    n = 0
    with httpx.Client(headers=UA, timeout=300, follow_redirects=True) as client:
        for it in items:
            if n >= args.count:
                break
            dst = args.out / f"{args.prefix}_{n+1}.mp4"
            if dst.exists():
                n += 1; continue
            try:
                with client.stream("GET", it["url"]) as rd:
                    rd.raise_for_status()
                    suffix = Path(it["url"]).suffix or ".webm"
                    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tf:
                        for chunk in rd.iter_bytes():
                            tf.write(chunk)
                        tmp = Path(tf.name)
            except Exception as e:
                print(f"  !! download failed: {it['title'][:40]}: {e}"); continue
            ok = transcode(tmp, dst, args.max_seconds)
            tmp.unlink(missing_ok=True)
            if not ok:
                print(f"  !! transcode failed: {it['title'][:40]}"); continue
            with attrib.open("a") as f:
                f.write(f"- **{dst.name}** — {it['title']} — {it['license']} — "
                        f"{it['author']} — {it['page']}\n")
            print(f"  -> {dst.name}  [{it['lic_key']}] {it['title'][:50]}")
            n += 1
    print(f"{n} video(s) -> {args.out}  (credits in ATTRIBUTION.md)")


if __name__ == "__main__":
    main()
