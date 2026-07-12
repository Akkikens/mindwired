#!/usr/bin/env python3
"""Public-domain / permissive-license media fetcher — the FREE alternative to
image generation for real events, people and places (archival photos read as
more credible than AI illustration anyway, and cost nothing).

Sources:
  - Wikimedia Commons (action API)  — the deep archive; best for history.
  - Openverse (api.openverse.org)   — CC-licensed aggregate; best for modern topics.

Safety: only PD / CC0 / CC-BY / CC-BY-SA results are kept (NC/ND always
rejected — those can't go in monetized videos). Every download is logged to
<out>/ATTRIBUTION.md with author + license + source URL, because CC-BY(-SA)
requires credit: paste that block into the video description.

Usage (repo venv has httpx):
  .venv-lipsync/bin/python scripts/fetch_media.py "Treaty of Versailles signing" \
      --out public/shorts/ww2/archival --count 6
  # options: --source commons|openverse|both  --licenses pd,cc0,by,by-sa
  #          --min-width 1000  --prefix versailles
"""
from __future__ import annotations

import argparse
import html
import re
import sys
from pathlib import Path

import httpx

UA = {"User-Agent": "mindwired-media-fetcher/1.0 (akshay@climbtogether.co)"}
COMMONS = "https://commons.wikimedia.org/w/api.php"
OPENVERSE = "https://api.openverse.org/v1/images/"
REJECT = ("nc", "nd")  # never allow non-commercial / no-derivatives


def slug(text: str, maxlen: int = 60) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:maxlen] or "media"


def license_key(name: str) -> str | None:
    """Normalize a license label to pd|cc0|by|by-sa, or None if unknown/rejected."""
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


def strip_html(text: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", text or "")).strip()


def fetch_commons(query: str, count: int, min_width: int) -> list[dict]:
    params = {
        "action": "query", "format": "json",
        "generator": "search", "gsrsearch": f"{query} filetype:bitmap",
        "gsrnamespace": 6, "gsrlimit": count * 4,
        "prop": "imageinfo", "iiprop": "url|extmetadata|size|mime",
        "iiurlwidth": 1920,
    }
    r = httpx.get(COMMONS, params=params, headers=UA, timeout=60)
    r.raise_for_status()
    pages = (r.json().get("query") or {}).get("pages") or {}
    out = []
    for p in pages.values():
        for ii in p.get("imageinfo", []):
            meta = ii.get("extmetadata") or {}
            lic = license_key((meta.get("LicenseShortName") or {}).get("value", ""))
            if not lic or ii.get("width", 0) < min_width:
                continue
            out.append({
                "source": "commons",
                "title": strip_html(p.get("title", "").removeprefix("File:")),
                "url": ii.get("thumburl") or ii.get("url"),
                "page": ii.get("descriptionurl", ""),
                "author": strip_html((meta.get("Artist") or {}).get("value", "unknown")),
                "license": (meta.get("LicenseShortName") or {}).get("value", lic),
                "lic_key": lic, "width": ii.get("width", 0),
            })
    return out


def fetch_openverse(query: str, count: int, licenses: set[str]) -> list[dict]:
    # openverse calls public-domain "pdm" (not "pd")
    ov = ",".join(sorted({"pdm" if l == "pd" else l for l in ({"pd", "cc0", "by", "by-sa"} & licenses)}))
    r = httpx.get(OPENVERSE, params={"q": query, "license": ov, "page_size": count * 2},
                  headers=UA, timeout=60)
    if r.status_code != 200:  # anonymous rate limits are modest — degrade gracefully
        print(f"  (openverse skipped: HTTP {r.status_code})")
        return []
    out = []
    for res in r.json().get("results", []):
        lic = license_key(res.get("license", ""))
        if not lic:
            continue
        out.append({
            "source": "openverse",
            "title": res.get("title") or "untitled",
            "url": res.get("url"),
            "page": res.get("foreign_landing_url", ""),
            "author": res.get("creator") or "unknown",
            "license": res.get("license", lic).upper(),
            "lic_key": lic, "width": res.get("width") or 0,
        })
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("query")
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--count", type=int, default=6)
    ap.add_argument("--source", default="both", choices=["commons", "openverse", "both"])
    ap.add_argument("--licenses", default="pd,cc0,by,by-sa")
    ap.add_argument("--min-width", type=int, default=1000)
    ap.add_argument("--prefix", default=None, help="filename prefix (default: query slug)")
    args = ap.parse_args()

    licenses = {s.strip() for s in args.licenses.split(",") if s.strip()}
    args.out.mkdir(parents=True, exist_ok=True)
    prefix = args.prefix or slug(args.query, 40)

    items: list[dict] = []
    if args.source in ("commons", "both"):
        items += fetch_commons(args.query, args.count, args.min_width)
        if not items:  # rare subjects often only exist as smaller scans
            items += fetch_commons(args.query, args.count, max(400, args.min_width // 2))
            if items:
                print(f"  (commons fallback: relaxed min-width to {max(400, args.min_width // 2)})")
    if args.source in ("openverse", "both"):
        items += fetch_openverse(args.query, args.count, licenses)
    items = [i for i in items if i["lic_key"] in licenses and i["url"]]
    # widest first — thumbnails and stamps sink to the bottom
    items.sort(key=lambda i: -i["width"])

    attrib = args.out / "ATTRIBUTION.md"
    saved = 0
    with httpx.Client(headers=UA, timeout=120, follow_redirects=True) as client:
        for it in items:
            if saved >= args.count:
                break
            ext = Path(it["url"].split("?")[0]).suffix.lower() or ".jpg"
            if ext not in {".jpg", ".jpeg", ".png", ".webp"}:
                continue
            dst = args.out / f"{prefix}_{saved + 1}{ext}"
            try:
                resp = client.get(it["url"])
                resp.raise_for_status()
            except Exception as e:  # noqa: BLE001 — skip broken items, keep fetching
                print(f"  skip ({e.__class__.__name__}): {it['title'][:60]}")
                continue
            dst.write_bytes(resp.content)
            saved += 1
            print(f"->  {dst.name}  [{it['license']}] {it['title'][:70]}")
            with attrib.open("a", encoding="utf-8") as f:
                f.write(f"- `{dst.name}` — \"{it['title']}\" by {it['author']} — "
                        f"{it['license']} — {it['page']} ({it['source']})\n")
    print(f"\n{saved} file(s) -> {args.out}  (credits logged in {attrib.name})")
    if saved == 0:
        sys.exit("No results passed the license/size filter — loosen --licenses or --min-width, or reword the query.")


if __name__ == "__main__":
    main()
