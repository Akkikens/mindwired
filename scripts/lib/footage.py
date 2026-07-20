#!/usr/bin/env python3
"""Shared source modules for the REAL-footage-first pipeline (2026-07-19).

Every module searches ONE free archive and returns normalized results;
scripts/fetch_footage.py ranks + orchestrates them per niche. Rules baked in:
  - PD / CC0 / CC-BY / CC-BY-SA only. NC/ND always rejected (can't monetize).
  - Every download logged to <out>/ATTRIBUTION.md (same formats fetch_media.py /
    fetch_video.py use, so audit_scene_relevance.py can parse source titles).
  - Video transcoded to 1080p H.264 mp4 (Remotion OffthreadVideo); long clips
    start ~10% in so archival slates/titles don't eat the b-roll window.
  - Idempotent: existing prefix_N files are never re-downloaded.

Sources needing free keys degrade gracefully when the key is absent:
  PEXELS_API_KEY   https://www.pexels.com/api/      (env or .env)
  PIXABAY_API_KEY  https://pixabay.com/api/docs/    (env or .env)
"""
from __future__ import annotations

import html
import json
import os
import re
import subprocess
import tempfile
from dataclasses import dataclass, field
from pathlib import Path

import httpx

REPO = Path(__file__).resolve().parent.parent.parent
UA = {"User-Agent": "mindwired-footage/1.0 (archival fetcher; akshay@climbtogether.co)"}
REJECT = ("nc", "nd", "noncommercial", "noderiv")
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}


# ---------------------------------------------------------------- normalization

@dataclass
class Asset:
    source: str          # module name, e.g. "archive_org"
    media: str           # "video" | "image"
    title: str
    url: str             # direct file URL
    page: str = ""       # human page for ATTRIBUTION
    author: str = "unknown"
    license: str = ""    # display name, e.g. "Public domain", "CC BY 4.0"
    lic_key: str = ""    # pd|cc0|by|by-sa
    width: int = 0
    duration: float = 0.0
    meta: dict = field(default_factory=dict)


def license_key(name: str) -> str | None:
    n = (name or "").lower()
    if any(f"-{r}" in n or f" {r}" in n or f"/{r}" in n for r in REJECT):
        return None
    if ("public domain" in n or "publicdomain" in n or "no known restrictions" in n
            or "no restrictions" in n or "usgov" in n or n.strip() in {"pd", "pd-us", "pdm"}):
        return "pd"
    if "cc0" in n or "zero/1.0" in n or "zero" in n:
        return "cc0"
    if "by-sa" in n or "attribution-sharealike" in n or "licenses/by-sa" in n:
        return "by-sa"
    if "cc by" in n or "licenses/by" in n or n.startswith("by") or "attribution" in n:
        return "by"
    return None


def strip_html(t: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", t or "")).strip()


def env_key(name: str) -> str | None:
    if os.environ.get(name):
        return os.environ[name]
    envf = REPO / ".env"
    if envf.exists():
        for line in envf.read_text().splitlines():
            if line.strip().startswith(f"{name}="):
                return line.split("=", 1)[1].strip().strip('"') or None
    return None


def _get_json(url: str, params: dict | None = None, timeout: int = 60,
              headers: dict | None = None) -> dict | None:
    try:
        r = httpx.get(url, params=params, headers={**UA, **(headers or {})},
                      timeout=timeout, follow_redirects=True)
        if r.status_code != 200:
            return None
        return r.json()
    except Exception:
        return None


# ---------------------------------------------------------------- sources: video+image

def search_commons(query: str, count: int, media: str) -> list[Asset]:
    """Wikimedia Commons action API. For video we also pull duration/size so the
    orchestrator can prefer substantial clips over 3-second junk."""
    is_vid = media == "video"
    params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": f"{query} filetype:{'video' if is_vid else 'bitmap'}",
        "gsrnamespace": 6, "gsrlimit": min(50, count * 6),
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|size|mime|mediatype",
        "iiextmetadatafilter": "LicenseShortName|Artist|ImageDescription",
        **({} if is_vid else {"iiurlwidth": 1920}),
    }
    data = _get_json("https://commons.wikimedia.org/w/api.php", params)
    out: list[Asset] = []
    for p in ((data or {}).get("query") or {}).get("pages", {}).values():
        for ii in p.get("imageinfo", []):
            if is_vid and not (ii.get("mime", "").startswith("video")
                               or ii.get("mediatype") == "VIDEO"):
                continue
            meta = ii.get("extmetadata") or {}
            lic_name = (meta.get("LicenseShortName") or {}).get("value", "")
            lic = license_key(lic_name)
            if not lic:
                continue
            try:  # iiprop=size returns duration for videos (sometimes garbage —
                dur = float(ii.get("duration") or 0)  # sanity-capped below)
            except (TypeError, ValueError):
                dur = 0.0
            if dur > 7200:
                dur = 0.0
            out.append(Asset(
                source="commons", media=media,
                title=strip_html(p.get("title", "").removeprefix("File:")),
                url=(ii.get("url") if is_vid else (ii.get("thumburl") or ii.get("url"))) or "",
                page=ii.get("descriptionurl", ""),
                author=strip_html((meta.get("Artist") or {}).get("value", "unknown"))[:120],
                license=lic_name or lic, lic_key=lic,
                width=ii.get("width", 0), duration=dur,
                meta={"desc": strip_html(
                    (meta.get("ImageDescription") or {}).get("value", ""))[:400]}))
    if is_vid:  # substantial clips first (10s+), then by resolution
        out.sort(key=lambda a: (-(a.duration >= 8), -a.width))
    else:
        out.sort(key=lambda a: -a.width)
    return out


# Collections whose items are reliably safe for monetized reuse. User uploads
# OUTSIDE these need a licenseurl check (done below) and remain lower-trust.
IA_TRUSTED = ["prelinger", "universal_newsreels", "usgovfilms", "FedFlix", "nasa"]


def search_archive_org(query: str, count: int, media: str,
                       collections: list[str] | None = None) -> list[Asset]:
    """Internet Archive advancedsearch -> metadata API -> direct download.
    TRUSTED CURATED COLLECTIONS ONLY: user uploads self-declare licenseurl and
    lie often enough (live-verified: 'boeing 777' + licenseurl:*publicdomain*
    returned a Russian podcast and a 1933 feature film) that they cannot feed a
    monetized channel unreviewed. Pass explicit collections=[...] to widen."""
    if media != "video":
        return []
    coll = collections or IA_TRUSTED
    coll_q = " OR ".join(f"collection:{c}" for c in coll)
    safe = f"({coll_q})"

    def _search(terms: str, by_downloads: bool = True) -> list[dict]:
        params = {
            "q": f"({terms}) AND mediatype:movies AND {safe}",
            "fl[]": ["identifier", "title", "licenseurl", "collection", "downloads"],
            "rows": min(40, count * 8), "output": "json"}
        if by_downloads:
            params["sort[]"] = "downloads desc"
        data = _get_json("https://archive.org/advancedsearch.php", params)
        return ((data or {}).get("response") or {}).get("docs", [])

    docs = _search(query)
    if len(docs) < count:  # IA full-text is AND-by-default; retry OR'd on IA's
        words = [w for w in re.findall(r"[A-Za-z0-9]+", query) if len(w) > 2]
        if len(words) > 1:  # RELEVANCE sort (downloads-sort buries the on-topic
            extra = _search(" OR ".join(words), by_downloads=False)  # tail)
            seen = {d.get("identifier") for d in docs}
            docs += [d for d in extra if d.get("identifier") not in seen]

    def pick_file(files: list[dict]) -> tuple[str | None, int]:
        """Prefer the h.264 mp4 derivative, then 512Kb MPEG4 — never the
        multi-GB MPEG2 master (a 2-min newsreel's master is 170MB+)."""
        by_fmt: dict[str, tuple[str, int]] = {}
        for f in files:
            name, fmt = f.get("name", ""), (f.get("format") or "").lower()
            try:
                size = int(f.get("size", 0))
            except (TypeError, ValueError):
                size = 0
            if not name.lower().endswith((".mp4", ".mpeg", ".mpg", ".ogv")) or size < 500_000:
                continue
            for want in ("h.264", "512kb mpeg4", "mpeg4", "ogg video"):
                if want in fmt and (want not in by_fmt or size > by_fmt[want][1]):
                    by_fmt[want] = (name, size)
        for want in ("h.264", "512kb mpeg4", "mpeg4", "ogg video"):
            if want in by_fmt and by_fmt[want][1] < 800_000_000:
                return by_fmt[want]
        return None, 0

    # rank by title relevance BEFORE spending per-item metadata calls
    docs.sort(key=lambda d: -asset_score(query, str(d.get("title") or "")))
    out: list[Asset] = []
    for d in docs:
        ident = d.get("identifier")
        colls = d.get("collection") or []
        colls = [colls] if isinstance(colls, str) else colls
        licurl = d.get("licenseurl", "") or ""
        trusted = any(c in coll for c in colls)
        # trusted-collection PD assumption ONLY when the item declares no license;
        # an explicit licenseurl that license_key rejected is NC/ND — never
        # relabel it PD (real case: 517 C-SPAN by-nc-sa items inside usgovfilms)
        lic = license_key(licurl) if licurl else ("pd" if trusted else None)
        if not lic or not ident:
            continue
        md = _get_json(f"https://archive.org/metadata/{ident}", timeout=60)
        if not md:
            continue
        best, best_size = pick_file(md.get("files", []))
        if not best:
            continue
        from urllib.parse import quote
        out.append(Asset(
            source="archive_org", media="video",
            title=d.get("title") or ident,
            url=f"https://archive.org/download/{ident}/{quote(best)}",
            page=f"https://archive.org/details/{ident}",
            author=", ".join(colls[:2]) or "Internet Archive",
            license=("Public domain" if lic == "pd" else licurl), lic_key=lic,
            meta={"identifier": ident, "size": best_size,
                  "desc": str((md.get("metadata") or {}).get("description", ""))[:400]}))
        if len(out) >= count * 2:
            break
    return out


def search_nasa(query: str, count: int, media: str) -> list[Asset]:
    """NASA Image and Video Library (images-api.nasa.gov). US-gov PD."""
    mtype = media if media == "video" else "image"

    def _search(q: str) -> list[dict]:
        data = _get_json("https://images-api.nasa.gov/search",
                         {"q": q, "media_type": mtype, "page_size": min(60, count * 8)})
        return ((data or {}).get("collection") or {}).get("items", [])

    # the API ANDs every word — also run progressively shorter prefixes, then
    # rank everything against the FULL query so precision comes back at our end
    items = _search(query)
    words = query.split()
    for k in range(len(words) - 1, 1, -1):
        if len(items) >= count * 10:
            break
        seen_ids = {(i.get("data") or [{}])[0].get("nasa_id") for i in items}
        items += [i for i in _search(" ".join(words[:k]))
                  if (i.get("data") or [{}])[0].get("nasa_id") not in seen_ids]
    items.sort(key=lambda it: -asset_score(
        query, (it.get("data") or [{}])[0].get("title", ""),
        (it.get("data") or [{}])[0].get("description", "")))
    out: list[Asset] = []
    for it in items:
        d = (it.get("data") or [{}])[0]
        nasa_id = d.get("nasa_id")
        if not nasa_id:
            continue
        from urllib.parse import quote
        asset = _get_json(f"https://images-api.nasa.gov/asset/{quote(nasa_id)}")
        hrefs = [x.get("href", "") for x in ((asset or {}).get("collection") or {}).get("items", [])]
        url = ""
        if media == "video":
            mp4s = [h for h in hrefs if h.lower().endswith(".mp4")]
            url = (next((h for h in mp4s if "~orig" in h), "")
                   or next((h for h in mp4s if "~large" in h), "")
                   or (mp4s[0] if mp4s else ""))
        else:
            jpgs = [h for h in hrefs if h.lower().endswith((".jpg", ".png"))]
            url = (next((h for h in jpgs if "~orig" in h), "")
                   or next((h for h in jpgs if "~large" in h), "")
                   or (jpgs[0] if jpgs else ""))
        if not url:
            continue
        out.append(Asset(
            source="nasa", media=media, title=d.get("title", nasa_id),
            url=url, page=f"https://images.nasa.gov/details/{nasa_id}",
            author=d.get("center") or "NASA", license="Public domain (NASA)",
            lic_key="pd",
            meta={"nasa_id": nasa_id, "desc": (d.get("description") or "")[:400]}))
        if len(out) >= count * 2:
            break
    return out


def search_nasa_svs(query: str, count: int, media: str) -> list[Asset]:
    """NASA Scientific Visualization Studio (svs.gsfc.nasa.gov/api) — the
    cinematic space-visualization jackpot (black holes, Earth, data viz). PD,
    credit 'NASA SVS'. Two-step: /api/search/?search= then /api/<id>/ for the
    file manifest (media_groups[].items[].instance)."""
    if media != "video":
        return []
    data = _get_json("https://svs.gsfc.nasa.gov/api/search/",
                     {"search": query, "limit": min(30, count * 4)})
    results = (data or {}).get("results", []) if isinstance(data, dict) else []
    results.sort(key=lambda r: -asset_score(query, r.get("title", ""),
                                            r.get("description", "")))
    out: list[Asset] = []
    for r in results:
        vid = r.get("id")
        if not vid:
            continue
        detail = _get_json(f"https://svs.gsfc.nasa.gov/api/{vid}/")
        if not detail:
            continue
        best_url, best_px = "", -1
        for m in detail.get("media_groups", []) or []:
            for item in (m.get("items") or []):
                inst = item.get("instance") or item
                if not isinstance(inst, dict):
                    continue
                u = inst.get("url", "") or ""
                if not u.lower().endswith(".mp4"):
                    continue
                px = inst.get("width") or 0
                if px > best_px and px <= 3840:
                    best_url, best_px = u, px
        if not best_url:
            continue
        out.append(Asset(
            source="nasa_svs", media="video", title=r.get("title", f"SVS {vid}"),
            url=best_url, page=r.get("url") or f"https://svs.gsfc.nasa.gov/{vid}",
            author="NASA Scientific Visualization Studio",
            license="Public domain (NASA SVS)", lic_key="pd", width=max(best_px, 0),
            meta={"desc": (r.get("description") or "")[:400]}))
        if len(out) >= count * 2:
            break
    return out


def search_nara(query: str, count: int, media: str) -> list[Asset]:
    """US National Archives catalog (keyless /proxy/ mirror of API v2) — the
    deep well of PD newsreel/military/government film. GOTCHAS from live
    testing: spaces MUST be %20 (never '+'), and >3 query params flips the
    response to an HTML shell — keep to exactly 3 and paginate by default."""
    if media != "video":
        return []
    from urllib.parse import quote
    url = (f"https://catalog.archives.gov/proxy/records/search?q={quote(query)}"
           f"&typeOfMaterials={quote('Moving Images')}&availableOnline=true")
    try:
        r = httpx.get(url, headers=UA, timeout=60, follow_redirects=True)
        if r.status_code != 200 or not r.text.lstrip().startswith("{"):
            return []
        data = r.json()
    except Exception:
        return []
    hits = (((data.get("body") or {}).get("hits") or {}).get("hits") or [])
    out: list[Asset] = []
    for h in hits:
        rec = (h.get("_source") or {}).get("record") or {}
        restr = ((rec.get("useRestriction") or {}).get("status") or "").lower()
        if restr and "unrestricted" not in restr:
            continue  # only clean PD-status items
        mp4 = ""
        for obj in rec.get("digitalObjects") or []:
            if "MP4" in (obj.get("objectType") or "") and obj.get("objectUrl"):
                mp4 = obj["objectUrl"]
                break
        if not mp4:
            continue
        na_id = rec.get("naId", "")
        out.append(Asset(
            source="nara", media="video", title=rec.get("title", f"NARA {na_id}"),
            url=mp4, page=f"https://catalog.archives.gov/id/{na_id}",
            author="US National Archives",
            license="Public domain (US National Archives, unrestricted)", lic_key="pd",
            meta={"naId": na_id}))
        if len(out) >= count * 3:
            break
    return out


# djangoplicity sites: ESO + ESA/Hubble + ESA/Webb — all CC BY 4.0, all share
# the same engine. Search page -> item ids -> per-item api/json -> 1080p mp4.
_DJANGO_SITES = [
    ("eso", "https://www.eso.org", "ESO"),
    ("esahubble", "https://esahubble.org", "ESA/Hubble"),
    ("esawebb", "https://esawebb.org", "ESA/Webb"),
]


def _django_video_urls(detail: dict) -> list[str]:
    """Walk a djangoplicity per-item JSON for mp4 URLs (shape varies by site)."""
    found: list[str] = []

    def walk(x):
        if isinstance(x, str):
            if x.lower().endswith(".mp4"):
                found.append(x)
        elif isinstance(x, dict):
            for v in x.values():
                walk(v)
        elif isinstance(x, list):
            for v in x:
                walk(v)
    walk(detail)
    # prefer 1080p screen encodes, then large/medium, never the 200MB+ 4K master
    found.sort(key=lambda u: (0 if "hd_1080p" in u else 1 if "large" in u
                              else 2 if "medium" in u else 3))
    return found


def search_eso(query: str, count: int, media: str) -> list[Asset]:
    """ESO + ESA/Hubble + ESA/Webb archives (CC BY 4.0 — credit required, goes
    in ATTRIBUTION.md). Cinematic space visuals: nebulae, black holes, zooms.
    NOTE: many videos carry scored music — we strip audio at transcode (-an)."""
    if media != "video":
        return []
    from urllib.parse import quote
    out: list[Asset] = []
    for key, base, credit in _DJANGO_SITES:
        if len(out) >= count * 3:
            break
        try:
            r = httpx.get(f"{base}/public/videos/archive/search/?search={quote(query)}"
                          if key == "eso" else
                          f"{base}/videos/archive/search/?search={quote(query)}",
                          headers=UA, timeout=60, follow_redirects=True)
            if r.status_code != 200:
                continue
            pat = (r"/public/videos/([a-z0-9_\-]+)/" if key == "eso"
                   else r"/videos/([a-z0-9_\-]+)/")
            ids = []
            for m in re.finditer(pat, r.text):
                vid = m.group(1)
                if vid not in ids and vid not in ("archive", "d2d") and not vid.startswith("wallpaper"):
                    ids.append(vid)
        except Exception:
            continue
        for vid in ids[: count * 2]:
            detail = _get_json(f"{base}/public/videos/{vid}/api/json/" if key == "eso"
                               else f"{base}/videos/{vid}/api/json/")
            if not detail:
                continue
            urls = _django_video_urls(detail)
            if not urls:
                continue
            out.append(Asset(
                source=f"eso:{key}", media="video",
                title=detail.get("Title") or detail.get("title") or vid,
                url=urls[0],
                page=(f"{base}/public/videos/{vid}/" if key == "eso"
                      else f"{base}/videos/{vid}/"),
                author=strip_html(str(detail.get("Credit") or detail.get("credit") or credit))[:160],
                license="CC BY 4.0", lic_key="by",
                meta={"desc": strip_html(str(detail.get("Description")
                                             or detail.get("description") or ""))[:400]}))
    return out


def search_noaa_ocean(query: str, count: int, media: str) -> list[Asset]:
    """NOAA Ocean Exploration (oceanexplorer.noaa.gov) — deep-sea ROV footage,
    US-gov PD (credit line requested). WordPress site: try the WP REST media
    API; it exposes direct mp4s under wp-content/uploads."""
    if media != "video":
        return []
    data = _get_json("https://oceanexplorer.noaa.gov/wp-json/wp/v2/media",
                     {"search": query, "per_page": min(30, count * 5),
                      "media_type": "video"})
    if not isinstance(data, list):
        return []
    out: list[Asset] = []
    for m in data:
        src = m.get("source_url", "") or ""
        if not src.lower().endswith(".mp4"):
            continue
        title = strip_html(((m.get("title") or {}).get("rendered")) or Path(src).stem)
        out.append(Asset(
            source="noaa_ocean", media="video", title=title, url=src,
            page=m.get("link", src), author="NOAA Ocean Exploration",
            license="Public domain (NOAA)", lic_key="pd",
            meta={"desc": strip_html(((m.get("caption") or {}).get("rendered")) or "")[:400]}))
    return out


def search_dvids(query: str, count: int, media: str) -> list[Asset]:
    """DVIDS (api.dvidshub.net) — US-military PD video/photos (carriers, jets,
    launches). Needs a free key: sign up at https://api.dvidshub.net/accounts,
    put DVIDS_API_KEY in .env. Caveat (their terms): no implication of DoD
    endorsement — fine for documentary b-roll, never for ads/thumbnails that
    imply military approval."""
    key = env_key("DVIDS_API_KEY")
    if not key:
        return []
    kind = "video" if media == "video" else "image"
    data = _get_json("https://api.dvidshub.net/search",
                     {"q": query, "type": kind, "hd": 1,
                      "max_results": min(50, count * 4), "api_key": key})
    out: list[Asset] = []
    for res in (data or {}).get("results", []):
        aid = res.get("id", "")
        if not aid:
            continue
        asset = _get_json("https://api.dvidshub.net/asset", {"id": aid, "api_key": key})
        a = (asset or {}).get("results") or {}
        url = ""
        if media == "video":
            files = a.get("files") or []
            mp4s = [f for f in files if isinstance(f, dict) and
                    str(f.get("src", "")).lower().endswith(".mp4")]
            mp4s.sort(key=lambda f: -(f.get("width") or 0))
            url = mp4s[0]["src"] if mp4s else ""
        else:
            url = a.get("image", "")
        if not url:
            continue
        out.append(Asset(
            source="dvids", media=media, title=res.get("title", aid),
            url=url, page=res.get("url", ""),
            author=res.get("credit") or res.get("branch") or "DVIDS",
            license="Public domain (US DoD via DVIDS)", lic_key="pd",
            meta={"desc": (a.get("description") or "")[:400]}))
        if len(out) >= count * 2:
            break
    return out


def search_loc(query: str, count: int, media: str) -> list[Asset]:
    """Library of Congress (loc.gov JSON API) — film/video with mp4 derivatives.
    Mostly 'no known restrictions' (PD); we keep only items that say so."""
    if media != "video":
        return []
    # rate limit: LoC JSON API is 20 req/min and blocks for an HOUR past it —
    # one search call per fetch keeps us far under
    data = _get_json("https://www.loc.gov/search/", {
        "q": query, "fo": "json", "fa": "online-format:video", "c": min(30, count * 5)})
    out: list[Asset] = []
    for r in (data or {}).get("results", []):
        rights = " ".join(str(x) for x in (r.get("rights") or [])) if isinstance(
            r.get("rights"), list) else str(r.get("rights") or "")
        blob = f"{rights} {r.get('rights_advisory','')}".lower()
        if blob and "no known restrictions" not in blob and "public domain" not in blob:
            continue  # unknown rights -> skip, honesty first
        mp4 = ""
        for res in r.get("resources", []) or []:
            for k in ("video", "url"):
                u = res.get(k, "") or ""
                if u.lower().endswith(".mp4"):
                    mp4 = u
        if not mp4:
            continue
        out.append(Asset(
            source="loc", media="video", title=strip_html(r.get("title", "")),
            url=mp4, page=r.get("id", ""), author="Library of Congress",
            license="No known restrictions (LoC)", lic_key="pd"))
        if len(out) >= count * 2:
            break
    return out


def search_pexels(query: str, count: int, media: str) -> list[Asset]:
    """Pexels API (free key). Pexels license: free commercial use, no attribution
    required (we log it anyway). NOTE: modern stock, not archival — use for
    generic b-roll (ocean, clouds, city), never for real events."""
    key = env_key("PEXELS_API_KEY")
    if not key:
        return []
    if media == "video":
        data = _get_json("https://api.pexels.com/videos/search",
                         {"query": query, "per_page": min(30, count * 3)},
                         headers={"Authorization": key})
        out = []
        for v in (data or {}).get("videos", []):
            files = sorted((f for f in v.get("video_files", [])
                            if (f.get("width") or 0) <= 1920 and f.get("link")),
                           key=lambda f: -(f.get("width") or 0))
            if not files:
                continue
            out.append(Asset(
                source="pexels", media="video",
                title=(v.get("url", "").rstrip("/").rsplit("/", 1)[-1] or "pexels video").replace("-", " "),
                url=files[0]["link"], page=v.get("url", ""),
                author=(v.get("user") or {}).get("name", "Pexels contributor"),
                license="Pexels License (free commercial use)", lic_key="free",
                width=files[0].get("width") or 0, duration=v.get("duration") or 0))
        return out
    data = _get_json("https://api.pexels.com/v1/search",
                     {"query": query, "per_page": min(30, count * 3)},
                     headers={"Authorization": key})
    return [Asset(source="pexels", media="image", title=p.get("alt") or "pexels photo",
                  url=(p.get("src") or {}).get("large2x") or (p.get("src") or {}).get("original", ""),
                  page=p.get("url", ""), author=p.get("photographer", "Pexels contributor"),
                  license="Pexels License (free commercial use)", lic_key="free", width=p.get("width") or 0)
            for p in (data or {}).get("photos", []) if p.get("src")]


def search_pixabay(query: str, count: int, media: str) -> list[Asset]:
    """Pixabay API (free key). Pixabay Content License: free commercial use.
    Same caveat as Pexels: generic b-roll only."""
    key = env_key("PIXABAY_API_KEY")
    if not key:
        return []
    if media == "video":
        data = _get_json("https://pixabay.com/api/videos/",
                         {"key": key, "q": query[:100], "per_page": min(30, count * 3),
                          "safesearch": "true"})
        out = []
        for h in (data or {}).get("hits", []):
            v = (h.get("videos") or {})
            best = v.get("large") or v.get("medium") or v.get("small") or {}
            if not best.get("url"):
                continue
            out.append(Asset(
                source="pixabay", media="video",
                title=(h.get("tags") or "pixabay video"),
                url=best["url"], page=h.get("pageURL", ""),
                author=h.get("user", "Pixabay contributor"),
                license="Pixabay Content License (free commercial use)", lic_key="free",
                width=best.get("width") or 0, duration=h.get("duration") or 0))
        return out
    data = _get_json("https://pixabay.com/api/",
                     {"key": key, "q": query[:100], "per_page": min(30, count * 3),
                      "image_type": "photo", "safesearch": "true"})
    return [Asset(source="pixabay", media="image", title=h.get("tags") or "pixabay photo",
                  url=h.get("largeImageURL") or h.get("webformatURL", ""),
                  page=h.get("pageURL", ""), author=h.get("user", "Pixabay contributor"),
                  license="Pixabay Content License (free commercial use)", lic_key="free",
                  width=h.get("imageWidth") or 0)
            for h in (data or {}).get("hits", []) if h.get("largeImageURL")]


def search_openverse(query: str, count: int, media: str) -> list[Asset]:
    """Openverse (images only) — CC aggregate; already the fetch_media fallback."""
    if media != "image":
        return []
    data = _get_json("https://api.openverse.org/v1/images/",
                     {"q": query, "license": "pdm,cc0,by,by-sa",
                      "page_size": min(30, count * 3)})
    out = []
    for r in (data or {}).get("results", []):
        lic = license_key(r.get("license", ""))
        if not lic or not r.get("url"):
            continue
        out.append(Asset(source="openverse", media="image",
                         title=r.get("title") or "untitled", url=r["url"],
                         page=r.get("foreign_landing_url", ""),
                         author=r.get("creator") or "unknown",
                         license=(r.get("license") or lic).upper(), lic_key=lic,
                         width=r.get("width") or 0))
    return out


SOURCES = {
    "commons": search_commons,
    "archive_org": search_archive_org,
    "nasa": search_nasa,
    "nasa_svs": search_nasa_svs,
    "nara": search_nara,
    "loc": search_loc,
    "eso": search_eso,
    "noaa_ocean": search_noaa_ocean,
    "dvids": search_dvids,
    "pexels": search_pexels,
    "pixabay": search_pixabay,
    "openverse": search_openverse,
}


# ------------------------------------------------------------- query relevance

_QSTOP = set("the a an of in on at to and or for with from video footage film clip "
             "hd 4k real archival".split())


def _qtokens(text: str) -> set[str]:
    return {t for t in re.findall(r"[a-z0-9]+", (text or "").lower())
            if len(t) >= 3 and t not in _QSTOP} | set(re.findall(r"\b\d+\b", text or ""))


def _bigrams(text: str) -> set[str]:
    ws = re.findall(r"[a-z0-9]+", (text or "").lower())
    return {f"{a} {b}" for a, b in zip(ws, ws[1:])}


def query_score(query: str, haystack: str) -> int:
    """Keyword overlap + double-weighted phrase (bigram) overlap — 'Saturn V'
    as a phrase beats scattered 'launch'/'rocket' word hits."""
    return (len(_qtokens(query) & _qtokens(haystack))
            + 2 * len(_bigrams(query) & _bigrams(haystack)))


def asset_score(query: str, title: str, desc: str = "", fname: str = "") -> int:
    """Title matches dominate (3x) — long archive descriptions namedrop
    everything and would otherwise drown out an exact-title hit."""
    return 3 * query_score(query, f"{title} {fname}") + query_score(query, desc)


def rank_by_query(assets: list[Asset], query: str) -> list[Asset]:
    """Sort by query relevance on title(3x)+description+filename; when any
    candidate matches, drop the zero-scorers (kills 'Wikipedia Edit 2014' junk
    that full-text search surfaces for 'boeing 777 landing')."""
    scored = []
    for a in assets:
        s = asset_score(query, a.title, a.meta.get("desc", ""), Path(a.url).name)
        scored.append((s, a))
    scored.sort(key=lambda t: (-t[0], -(t[1].duration >= 8), -t[1].width))
    if any(s > 0 for s, _ in scored):
        scored = [(s, a) for s, a in scored if s > 0]
    return [a for _, a in scored]


# ---------------------------------------------------------------- download side

def norm_title(t: str) -> str:
    """Alphanumeric-only key so 'Foo-Bar.ogg' and 'Foo Bar.webm' dedupe —
    strips media extensions (Commons titles keep them) and resolution suffixes
    (NOAA publishes 640x360/1920x1080 variants of the same clip)."""
    t = re.sub(r"\.(webm|ogv|ogg|mp4|mov|mpg|mpeg|avi|jpe?g|png|webp|tiff?)$",
               "", (t or "").strip(), flags=re.I)
    t = re.sub(r"\b\d{3,4}\s?[x×]\s?\d{3,4}\b", "", t)
    return re.sub(r"[^a-z0-9]+", " ", t.lower()).strip()


def ffprobe_duration(p: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def transcode(src: Path, dst: Path, max_seconds: int, max_h: int = 1080) -> bool:
    """-> H.264 mp4 (1080p default; max_h=2160 for 4K episodes), silent. Long
    archival reels start ~10% in (skip slates/titles) instead of always taking
    the first seconds."""
    dur = ffprobe_duration(src)
    start = 0.0
    if dur > max_seconds * 3:
        start = min(dur * 0.10, 45.0)
    max_w = max_h * 16 // 9
    cmd = ["ffmpeg", "-y", "-v", "error"]
    if start:
        cmd += ["-ss", f"{start:.1f}"]
    cmd += ["-i", str(src), "-t", str(max_seconds),
            # force_divisible_by=2: libx264+yuv420p rejects odd dimensions
            # (853x480 archival derivatives are common and would all fail)
            "-vf", f"scale='min({max_w},iw)':'min({max_h},ih)':force_original_aspect_ratio=decrease"
                   ":force_divisible_by=2,fps=30",
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium",
            "-movflags", "+faststart", "-an", str(dst)]
    return (subprocess.run(cmd).returncode == 0 and dst.exists()
            and dst.stat().st_size > 0 and ffprobe_duration(dst) > 0.5)


def log_attribution(out_dir: Path, dst_name: str, a: Asset) -> None:
    att = out_dir / "ATTRIBUTION.md"
    with att.open("a", encoding="utf-8") as f:
        if a.media == "video":
            f.write(f"- **{dst_name}** — {a.title} — {a.license} — {a.author} — {a.page or a.url}\n")
        else:
            f.write(f"- `{dst_name}` — \"{a.title}\" by {a.author} — {a.license} — "
                    f"{a.page or a.url} ({a.source})\n")
    # sidecar of normalized titles: ATTRIBUTION.md is for humans and its titles
    # can contain — / "by" that break regex round-trips; dedup reads this instead
    with (out_dir / ".fetched_titles").open("a", encoding="utf-8") as f:
        f.write(norm_title(a.title) + "\n")


def download_assets(assets: list[Asset], out_dir: Path, prefix: str, count: int,
                    max_seconds: int = 20, min_width: int = 800, max_h: int = 1080,
                    ) -> list[tuple[Path, Asset]]:
    """Download up to `count` assets as <prefix>_N.<ext>, resuming numbering after
    existing files (idempotent). Videos are transcoded; images saved as-is.
    Returns (path, asset) pairs for what was actually saved."""
    out_dir.mkdir(parents=True, exist_ok=True)
    media = assets[0].media if assets else "video"
    kind_ext = {".mp4"} if media == "video" else IMG_EXT
    # count/number ONLY exact <prefix>_N files of THIS media kind — a bare glob
    # also matched sibling prefixes (b777_zoom_1) and the other media kind,
    # silently reporting "already present" and fetching nothing
    existing = [f for f in out_dir.glob(f"{prefix}_*")
                if f.suffix.lower() in kind_ext
                and re.fullmatch(rf"{re.escape(prefix)}_(\d+)", f.stem)]
    n = max((int(re.match(rf"{re.escape(prefix)}_(\d+)$", f.stem).group(1))
             for f in existing), default=0)
    saved: list[tuple[Path, Asset]] = []
    have = len(existing)
    need = count - have
    if need <= 0:
        print(f"  {prefix}: {have} file(s) already present — skipping (idempotent)")
        return saved
    batch_titles: set[str] = set()
    with httpx.Client(headers=UA, timeout=600, follow_redirects=True) as client:
        for a in assets:
            if len(saved) >= need:
                break
            if norm_title(a.title) in batch_titles:  # same clip republished
                continue
            try:
                if a.media == "video":
                    dst = out_dir / f"{prefix}_{n + 1}.mp4"
                    with tempfile.NamedTemporaryFile(
                            suffix=Path(httpx.URL(a.url).path).suffix or ".mp4",
                            delete=False) as tf:
                        with client.stream("GET", a.url) as rd:
                            rd.raise_for_status()
                            for chunk in rd.iter_bytes():
                                tf.write(chunk)
                        tmp = Path(tf.name)
                    ok = transcode(tmp, dst, max_seconds, max_h=max_h)
                    tmp.unlink(missing_ok=True)
                    if not ok:
                        dst.unlink(missing_ok=True)
                        print(f"  !! transcode failed: {a.title[:50]}")
                        continue
                else:
                    if a.width and a.width < min_width:
                        continue
                    ext = Path(httpx.URL(a.url).path).suffix.lower() or ".jpg"
                    if ext not in IMG_EXT:
                        continue
                    dst = out_dir / f"{prefix}_{n + 1}{ext}"
                    r = client.get(a.url)
                    r.raise_for_status()
                    dst.write_bytes(r.content)
            except Exception as e:  # noqa: BLE001 — skip broken items, keep going
                print(f"  skip ({e.__class__.__name__}): {a.title[:50]}")
                continue
            n += 1
            saved.append((dst, a))
            batch_titles.add(norm_title(a.title))
            log_attribution(out_dir, dst.name, a)
            extra = f" {ffprobe_duration(dst):.0f}s" if a.media == "video" else ""
            print(f"  -> {dst.name}  [{a.source}/{a.lic_key}]{extra}  {a.title[:56]}")
    return saved


def contact_sheet(files: list[Path], out_png: Path, label: str = "") -> Path | None:
    """One-glance QA sheet: first frame of each video / thumbnail of each image."""
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return None
    tiles = []
    for f in files:
        try:
            if f.suffix.lower() == ".mp4":
                with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tf:
                    tmp = Path(tf.name)
                subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", "1", "-i", str(f),
                                "-frames:v", "1", str(tmp)], check=True)
                im = Image.open(tmp).convert("RGB")
                tmp.unlink(missing_ok=True)
            else:
                im = Image.open(f).convert("RGB")
            im.thumbnail((360, 200))
            tiles.append((f.name, im))
        except Exception:
            continue
    if not tiles:
        return None
    cols = min(4, len(tiles))
    rows = (len(tiles) + cols - 1) // cols
    TW, TH, CAP = 370, 210, 26
    from PIL import Image as PImage, ImageDraw as PDraw
    sheet = PImage.new("RGB", (cols * TW, rows * (TH + CAP) + 30), "black")
    d = PDraw.Draw(sheet)
    d.text((8, 6), label or out_png.stem, fill="yellow")
    for i, (name, im) in enumerate(tiles):
        x, y = (i % cols) * TW, 30 + (i // cols) * (TH + CAP)
        sheet.paste(im, (x + (TW - im.width) // 2, y + (TH - im.height) // 2))
        d.text((x + 4, y + TH + 4), name[:52], fill="white")
    out_png.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_png)
    return out_png
