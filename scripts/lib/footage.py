#!/usr/bin/env python3
"""Shared source modules for the REAL-footage-first pipeline (2026-07-19).

Every module searches ONE free archive and returns normalized results;
scripts/fetch_footage.py ranks + orchestrates them per niche. Rules baked in:
  - PD / CC0 / CC-BY / CC-BY-SA only. NC/ND always rejected (can't monetize).
  - Every download logged to <out>/ATTRIBUTION.md (same formats fetch_media.py /
    fetch_video.py use, so audit_scene_relevance.py can parse source titles),
    plus one JSON row per file in the episode root's PROVENANCE.jsonl.
  - Video transcoded to 1080p H.264 mp4 (Remotion OffthreadVideo); a source
    longer than its cap is sliced where a frame scan (0/8/15s + every ~10%)
    finds the query, past black/slate frames (pick_slice) — offset recorded.
  - Vision verdict over 3 frames: subject, era (doc `era`, aftermath/briefing
    exempt) and real-person identity (verify_clip).
  - Idempotent: existing prefix_N files are never re-downloaded.

Sources needing free keys degrade gracefully when the key is absent:
  PEXELS_API_KEY   https://www.pexels.com/api/      (env or .env)
  PIXABAY_API_KEY  https://pixabay.com/api/docs/    (env or .env)
"""
from __future__ import annotations

import base64
import concurrent.futures as cf
import html
import json
import os
import re
import subprocess
import tempfile
import time
from dataclasses import dataclass, field
from pathlib import Path

import httpx

REPO = Path(__file__).resolve().parent.parent.parent
# target render height — fetch_footage sets 2160 for --uhd; source pickers use
# it to choose the smallest file that still covers the render resolution
TARGET_H = 1080
# Largest source file worth downloading for one b-roll clip (see SIZE CAP below).
MAX_SOURCE_BYTES = 2 << 30  # 2 GiB

UA = {"User-Agent": "mindwired-footage/1.0 (archival fetcher; akshay@climbtogether.co)"}
REJECT = ("nc", "nd", "noncommercial", "noderiv")
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}
# vision relevance check (2026-08-21) — on by default; --no-verify / VERIFY=False
# skips it (e.g. no GEMINI_API_KEY, or a fast/dry run)
VERIFY = True


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
            # OR-recall is loose — a title must hit >=2 query tokens to qualify
            # ('Progress 71 Launch' matching only 'launch' polluted a jet query)
            docs += [d for d in extra
                     if d.get("identifier") not in seen
                     and query_score(query, str(d.get("title") or "")) >= 2]

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


def _noaa_ocean_index() -> list[dict]:
    """Build (and cache) an index of NOAA Ocean Exploration video pages.

    Why not the WP REST media API (which this used to call): on 2026-09-13 every
    /wp-json/wp/v2/media request began returning HTTP 500 "Database Error" —
    the site's WordPress backend is down while the static pages stay up. The
    ocean niche ranks noaa_ocean FIRST, so that outage silently emptied the
    primary source for every ocean episode and pushed the fetcher down to
    Pexels, which answers "deep sea amphipods" with a man fishing on a river.

    The static Yoast sitemaps survive the database outage, so the index is
    built from those instead: ~2,000 multimedia pages, of which the video ones
    embed a direct mp4 under wp-content/uploads. Cached for a day.
    """
    cache = REPO / "public" / "shorts" / "_cache" / "noaa_ocean_video_index.json"
    if cache.exists() and (time.time() - cache.stat().st_mtime) < 86400:
        try:
            return json.loads(cache.read_text())
        except Exception:
            pass
    urls: list[str] = []
    for sm in ("https://oceanexplorer.noaa.gov/multimedia-sitemap.xml",
               "https://oceanexplorer.noaa.gov/multimedia-sitemap2.xml"):
        try:
            r = httpx.get(sm, headers=UA, timeout=60, follow_redirects=True)
            if r.status_code == 200:
                urls += re.findall(r"<loc>([^<]+)</loc>", r.text)
        except Exception:
            continue
    KEY = ("video", "dive", "deep", "rov", "seafloor", "lander", "water-column",
           "sediment", "marine-snow", "crustacean", "coral", "biolum", "canyon",
           "vent", "squid", "octopus", "fish", "jelly", "shrimp", "crab", "seep")
    cand = [u for u in urls if any(k in u.rstrip("/").split("/")[-1] for k in KEY)]

    out: list[dict] = []
    def grab(u: str):
        try:
            r = httpx.get(u, headers=UA, timeout=30, follow_redirects=True)
            if r.status_code != 200:
                return None
            mp4 = re.findall(
                r"https?://oceanexplorer\.noaa\.gov/wp-content/uploads/[^\"')\s]+\.mp4", r.text)
            if not mp4:
                return None
            t = re.search(r"<title>([^<]{3,140})</title>", r.text)
            title = (t.group(1) if t else "").split("|")[0].strip()
            # widest variant wins (…_1280x720.mp4 over …_640x360.mp4)
            return {"page": u, "url": sorted(set(mp4), key=len)[-1], "title": title}
        except Exception:
            return None

    with cf.ThreadPoolExecutor(max_workers=12) as ex:
        for res in ex.map(grab, cand):
            if res:
                out.append(res)
    seen, uniq = set(), []
    for a in out:
        if a["url"] in seen:
            continue
        seen.add(a["url"]); uniq.append(a)
    try:
        cache.parent.mkdir(parents=True, exist_ok=True)
        cache.write_text(json.dumps(uniq, indent=1))
    except Exception:
        pass
    return uniq


def search_noaa_ocean(query: str, count: int, media: str) -> list[Asset]:
    """NOAA Ocean Exploration — real deep-sea ROV footage, US-gov PD
    (credit line "NOAA Ocean Exploration" requested; log it).

    Matches the query against the page title and slug of the cached index
    rather than the dead WP search endpoint. NOTE for scripting: NOAA's dives
    are overwhelmingly 300-3,000 m, NOT hadal — there is no amphipod, snailfish,
    hadal, Mariana or abyssal page in the whole index. Anything deeper than
    Okeanos goes belongs to Schmidt/MBARI/Caladan, which are NC or
    permission-only and stay barred.
    """
    if media != "video":
        return []
    idx = _noaa_ocean_index()
    if not idx:
        return []
    stop = {"noaa", "ocean", "exploration", "the", "a", "of", "and", "deep", "sea", "footage"}
    terms = [w for w in re.split(r"[^a-z0-9]+", query.lower()) if len(w) > 2 and w not in stop]
    scored = []
    for a in idx:
        hay = f"{a['title']} {a['page']}".lower()
        score = sum(1 for w in terms if w in hay)
        if score:
            scored.append((score, a))
    scored.sort(key=lambda x: -x[0])
    out: list[Asset] = []
    for _, a in scored[: max(count * 4, 12)]:
        out.append(Asset(
            source="noaa_ocean", media="video", title=a["title"], url=a["url"],
            page=a["page"], author="NOAA Ocean Exploration",
            license="Public domain (NOAA)", lic_key="pd", meta={"desc": a["title"]}))
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
    results = (data or {}).get("results", [])
    # produced DVIDS packages carry burned-in captions/graphics; raw "b-roll"
    # tagged items cut cleanly — try those first
    results.sort(key=lambda r: 0 if "b-roll" in
                 f"{r.get('title','')} {r.get('keywords','')}".lower() else 1)
    out: list[Asset] = []
    for res in results:
        aid = res.get("id", "")
        if not aid:
            continue
        asset = _get_json("https://api.dvidshub.net/asset", {"id": aid, "api_key": key})
        a = (asset or {}).get("results") or {}
        url = ""
        if media == "video":
            files = a.get("files") or []
            # older (pre-2010) DVIDS archival video assets often carry only a
            # legacy .mpg/.mpeg derivative, no .mp4 — don't silently drop those
            vids = [f for f in files if isinstance(f, dict) and
                    str(f.get("src", "")).lower().endswith((".mp4", ".mpeg", ".mpg", ".ogv"))]
            vids.sort(key=lambda f: -(f.get("width") or 0))
            url = vids[0]["src"] if vids else ""
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
            fs = [f for f in v.get("video_files", []) if f.get("link")]
            covering = sorted((f for f in fs if (f.get("height") or 0) >= TARGET_H),
                              key=lambda f: f.get("height") or 0)
            files = covering or sorted(fs, key=lambda f: -(f.get("height") or 0))
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
            tiers = [v.get(k) or {} for k in ("small", "medium", "large")]
            covering = [x for x in tiers if (x.get("height") or 0) >= TARGET_H and x.get("url")]
            best = covering[0] if covering else next(
                (x for x in reversed(tiers) if x.get("url")), {})
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


def transcode(src: Path, dst: Path, max_seconds: int, max_h: int = 1080,
              start: float | None = None) -> bool:
    """-> H.264 mp4 (1080p default; max_h=2160 for 4K episodes), silent.
    `start` is the source offset of the kept window (download_assets picks it
    with pick_slice's frame scan); None keeps the legacy guess — long reels
    start ~10% in."""
    if start is None:
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


_clip_start_mod_cache = None


def _clip_start_mod():
    """scripts/find_clip_start.py as a module (numpy/PIL) — one source of
    truth for the slate statistics. Raises when it can't load."""
    global _clip_start_mod_cache
    if _clip_start_mod_cache is None:
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            "find_clip_start", REPO / "scripts" / "find_clip_start.py")
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        _clip_start_mod_cache = mod
    return _clip_start_mod_cache


def suggest_clip_start(path: Path, max_scan: float = 30.0) -> float | None:
    """First second of a saved clip that is real footage, not a near-black
    frame or a dark title slate — the suggested DocWide `videoFrom`. Reuses
    scripts/find_clip_start.py's frame statistics (one source of truth for the
    thresholds). None when the scan can't run (numpy/PIL missing). It misses
    BRIGHT slates (columbia's green Moon graphic), so the contact sheet is
    still the final word (memory footage-20s-slice-root-cause)."""
    try:
        return float(_clip_start_mod().find_start(path, max_scan))
    except Exception:  # noqa: BLE001 — advisory only, never kill the fetch run
        return None


def is_real_frame(path: Path, t: float) -> bool:
    """True when the frame at `t` is real footage, False for near-black or a
    dark title slate — find_clip_start.find_start's exact test. Fails open
    (True) when numpy/PIL are missing."""
    try:
        mod = _clip_start_mod()
        with tempfile.TemporaryDirectory() as td:
            black, spread, sat = mod.frame_stats(path, t, Path(td) / "f.png")
    except Exception:  # noqa: BLE001
        return True
    return black < 0.55 and (spread > 14 or sat > 6)


def scan_times(dur: float) -> list[float]:
    """Where pick_slice looks in a long source: 0/8/15s (the contact-sheet
    strip) plus one frame per ~10% of the full length, so a launch that starts
    at minute 3 of a NASA reel is found instead of the first 20s being kept
    blindly (memory footage-20s-slice-root-cause)."""
    if dur <= 0:
        return [0.0]
    ts = {0.0, 8.0, 15.0} | {round(dur * k / 10, 1) for k in range(1, 10)}
    last = max(0.0, dur - 0.5)
    return sorted(t for t in ts if t <= last)


# ------------------------------------------------------------- clip-length gates

def detect_freezes(path: Path, min_s: float = 2.0,
                   noise: str = "-60dB") -> list[tuple[float, float]]:
    """[(start, end)] spans where the picture does not change for >= min_s
    (ffmpeg freezedetect) — a held frame / still-in-a-video-wrapper reads as a
    broken render on screen. Empty on any ffmpeg failure."""
    r = subprocess.run(["ffmpeg", "-nostdin", "-v", "info", "-i", str(path),
                        "-vf", f"freezedetect=n={noise}:d={min_s}", "-map", "0:v:0",
                        "-f", "null", "-"], capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r"freeze_start: ([\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"freeze_end: ([\d.]+)", r.stderr)]
    if len(ends) < len(starts):  # frozen through EOF: no freeze_end is printed
        ends.append(ffprobe_duration(path))
    return list(zip(starts, ends))


def clip_warnings(path: Path, need_s: float | None = None, offset: float = 0.0,
                  freeze: bool = True) -> list[str]:
    """WARN lines for one saved clip: shorter than the on-screen time it has
    to fill from `offset` (DocWide holds the last frame — a freeze on screen),
    and freezedetect spans inside that window."""
    out: list[str] = []
    dur = ffprobe_duration(path)
    if need_s is not None and dur - offset < need_s - 0.5:
        out.append(f"WARN clip-short: {path.name} has {max(0.0, dur - offset):.1f}s "
                   f"from {offset:g}s, scene needs {need_s:.1f}s "
                   f"(short by {need_s - (dur - offset):.1f}s)")
    if freeze:
        hi = offset + need_s if need_s is not None else dur
        for a, b in detect_freezes(path):
            if b > offset and a < hi:
                out.append(f"WARN freeze: {path.name} picture frozen "
                           f"{a:.1f}-{b:.1f}s")
    return out


def blocked_by(a: Asset, blocklist: list[str] | None) -> str | None:
    """The doc's fetchRules.blocklist entry this asset hits, else None. An
    entry that looks like a domain (has a dot, no spaces) matches the url/page
    host; anything else is a case-insensitive title substring."""
    if not blocklist:
        return None
    from urllib.parse import urlparse
    hosts = {urlparse(u).hostname or "" for u in (a.url, a.page) if u}
    title = (a.title or "").lower()
    for entry in blocklist:
        e = str(entry).strip().lower()
        if not e:
            continue
        if "." in e and " " not in e and any(h == e or h.endswith("." + e) for h in hosts):
            return entry
        if e in title:
            return entry
    return None


def log_attribution(out_dir: Path, dst_name: str, a: Asset, query: str = "",
                    verify: dict | None = None,
                    suggested_from: float | None = None,
                    slice_: dict | None = None) -> None:
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
    # machine-readable twin (revamp §3.2): one JSON row per saved file in the
    # episode root (public/shorts/<slug>/PROVENANCE.jsonl) so gates stop
    # regex-parsing the markdown above
    root = out_dir.parent if out_dir.name in ("video", "images") else out_dir
    row = {"file": str((out_dir / dst_name).relative_to(root)), "media": a.media,
           "source": a.source, "title": a.title, "url": a.url, "page": a.page,
           "author": a.author, "license": a.license, "lic_key": a.lic_key,
           "query": query, "verify": verify or {"status": "skipped", "note": "no query"},
           "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    if suggested_from is not None:
        row["suggested_from"] = suggested_from
    if slice_:
        # where in the SOURCE the kept window starts — the title/page describe
        # the whole source, this says which part of it the file actually is
        row["slice"] = slice_
        row["source_offset"] = slice_.get("start", 0.0)
    with (root / "PROVENANCE.jsonl").open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")


# --------------------------------------------------------- vision relevance check

# rank_by_query is pure lexical overlap on TITLE/description/filename — it has
# no idea what the file actually SHOWS, so a source's own full-text search can
# hand it something that scores well on words alone (a NASA gamma-ray telescope
# named "Fermi" for a query about the physicist Fermi; "Arecibo Observatory
# Radar Imagery of [an asteroid]" for a query wanting a photo OF the dish).
# This asks an actual vision model to look at the downloaded file and confirm
# it shows what the query says, before it's allowed to count toward `count`.
_GEMINI_VERIFY_MODEL = os.environ.get("GEMINI_VERIFY_MODEL", "gemini-2.5-flash")
_GEMINI_ENDPOINT = ("https://generativelanguage.googleapis.com/v1beta/models/"
                    "{model}:generateContent")
_gemini_key_cache: str | None = None
_gemini_key_missing_warned = False


def _load_gemini_key() -> str | None:
    global _gemini_key_cache, _gemini_key_missing_warned
    if _gemini_key_cache:
        return _gemini_key_cache
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        env = REPO / ".env"
        if env.exists():
            for line in env.read_text(encoding="utf-8").splitlines():
                if line.strip().startswith("GEMINI_API_KEY="):
                    key = line.split("=", 1)[1].strip().strip('"')
                    break
    if not key and not _gemini_key_missing_warned:
        print("  !! GEMINI_API_KEY not set — skipping vision relevance checks "
              "(fetched files are NOT auto-verified; eyeball the contact sheet)")
        _gemini_key_missing_warned = True
    _gemini_key_cache = key or ""
    return _gemini_key_cache or None


def extract_frame(path: Path, t: float = 0.0, max_px: int = 768) -> Path | None:
    """A downscaled JPEG still for the vision model: the image itself, or the
    video frame at `t` seconds. The caller unlinks it. None on any failure."""
    try:
        from PIL import Image
    except ImportError:
        return None
    fd, name = tempfile.mkstemp(suffix=".jpg")
    os.close(fd)
    tmp = Path(name)
    try:
        if path.suffix.lower() not in IMG_EXT:
            r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.2f}",
                                "-i", str(path), "-frames:v", "1", str(tmp)])
            if r.returncode != 0 or not tmp.exists() or tmp.stat().st_size == 0:
                tmp.unlink(missing_ok=True)
                return None
            im = Image.open(tmp).convert("RGB")
        else:
            im = Image.open(path).convert("RGB")
        im.thumbnail((max_px, max_px))
        im.save(tmp, "JPEG", quality=85)
        return tmp
    except Exception:  # noqa: BLE001
        tmp.unlink(missing_ok=True)
        return None


def norm_era(era) -> dict | None:
    """Doc-level `era` -> {"from": "YYYY", "to": "YYYY"}. Accepts that dict,
    a [from, to] pair or "1981-2003". None when absent; ValueError when
    malformed (a typo'd era must not silently switch the gate off)."""
    if era in (None, "", {}, []):
        return None
    if isinstance(era, dict):
        f, t = era.get("from"), era.get("to")
    elif isinstance(era, (list, tuple)) and len(era) == 2:
        f, t = era
    elif isinstance(era, str) and re.fullmatch(r"\s*\d{4}\s*[-–]\s*\d{4}\s*", era):
        f, t = re.split(r"\s*[-–]\s*", era.strip())
    else:
        raise ValueError(f"era {era!r} — want {{\"from\": \"YYYY\", \"to\": \"YYYY\"}}")
    f, t = str(f or "").strip(), str(t or "").strip()
    if not (re.fullmatch(r"\d{4}", f) and re.fullmatch(r"\d{4}", t)) or f > t:
        raise ValueError(f"era {era!r} — want {{\"from\": \"YYYY\", \"to\": \"YYYY\"}}, from <= to")
    return {"from": f, "to": t}


def _era_exempt(ctx: dict | None) -> bool:
    """Scenes tagged era:"aftermath" and briefing-niche fetches expect footage
    recorded AFTER the event (NTSB/NASA press conferences, recovery) — the
    anachronism rejection would delete exactly the material CLAUDE.md asks for."""
    return bool(ctx and (ctx.get("aftermath") or ctx.get("briefing")))


def build_verify_prompt(query: str, title: str = "", ctx: dict | None = None,
                        times: list[float] | None = None) -> str:
    """The three-question clip verdict: subject, visual era, real-person
    identity (memory footage-era-identity-niche — the old subject-only check
    passed a 2022 VP-Harris ISS call under a 2003 breakup). Strict JSON out."""
    era = (ctx or {}).get("era")
    n = len(times) if times else 1
    what = (f"{n} frames from ONE video clip (at {', '.join(f'{t:g}s' for t in times)})"
            if times and n > 1 else "one image (a video frame or the photo itself)")
    p = ("You are a strict fact-checker for a documentary's archival-footage pool. "
         f"The editor searched for: \"{query}\"."
         + (f" The source's own title/caption for this file is: \"{title}\"." if title else "")
         + f" Attached: {what}. Judge ONLY what is visibly depicted — ignore the "
           "title/caption wherever it contradicts what you actually see. Answer three "
           "questions.\n"
           "1. SUBJECT: MATCH if the frames genuinely show the subject searched for (the "
           "right object/person/place/event, not a thematically-similar stand-in); MISMATCH "
           "if they show something else (wrong subject, wrong specific entity, unrelated "
           "stock, a title slate, or a chart/diagram/screenshot when real footage was "
           "wanted).\n")
    if era and _era_exempt(ctx):
        p += (f"2. ERA: the story happened {era['from']}-{era['to']}, but this scene uses "
              f"official AFTERMATH material — footage recorded after {era['to']} (press "
              "briefings, investigation, recovery, hearings, memorials) is EXPECTED and is "
              f"NOT anachronistic. Answer ANACHRONISTIC only if it plainly predates "
              f"{era['from']}; otherwise PLAUSIBLE or UNSURE.\n")
    elif era:
        p += (f"2. ERA: the story is set {era['from']}-{era['to']}. Is the footage visually "
              "plausible for that period? Look for anachronistic technology, screens and "
              "UI, vehicles, aircraft liveries, rockets/spacecraft, clothing, and image "
              f"quality (modern HD digital video of a pre-digital era). Footage clearly "
              f"recorded after {era['to']} or before {era['from']} is ANACHRONISTIC. "
              "Answer PLAUSIBLE, ANACHRONISTIC or UNSURE.\n")
    else:
        p += "2. ERA: no era is set for this story — answer NA.\n"
    p += ("3. IDENTITY: does any frame show a specific, identifiable real person (a "
          "recognisable face, a name caption, a well-known public figure)? If so, who — "
          "a name if you recognise them, else a short description. If the search names "
          "a specific person, does the person shown match them (YES/NO); NA when the "
          "search names no person or nobody identifiable is shown.\n"
          "Reply with ONLY this JSON object, no prose, no code fence:\n"
          "{\"subject\": \"MATCH|MISMATCH\", \"era\": \"PLAUSIBLE|ANACHRONISTIC|UNSURE|NA\", "
          "\"identity\": {\"person\": true|false, \"who\": \"...\", \"matches_query\": "
          "\"YES|NO|NA\"}, \"reason\": \"one sentence\"}")
    return p


def build_scan_prompt(query: str, title: str, n: int) -> str:
    """One call over every scanned frame of a long source: which of them show
    the subject? pick_slice keeps the window around those."""
    return ("You are choosing which part of a long archival video to keep for a "
            f"documentary. The editor searched for: \"{query}\"."
            + (f" The source's title is: \"{title}\" (it describes the whole video, not "
               "every part of it)." if title else "")
            + f" Attached are {n} frames sampled in time order from ONE source video, "
              f"numbered 1 to {n}. For each, decide whether it genuinely shows the "
              "subject searched for — not a title card, slate, interview talking head, "
              "audience shot or unrelated b-roll. Reply with ONLY this JSON object, no "
              "prose: {\"match\": [numbers of the frames that show it]}")


def _parse_json(text: str) -> dict:
    t = re.sub(r"^```(?:json)?|```$", "", (text or "").strip(), flags=re.M).strip()
    m = re.search(r"\{.*\}", t, re.S)
    if not m:
        raise ValueError("no JSON object in vision reply")
    return json.loads(m.group(0))


def parse_verdict(text: str) -> dict:
    """Vision reply -> {subject, era, identity:{person, who, matches_query},
    reason}. Falls back to the legacy 'MATCH/MISMATCH\\nreason' shape."""
    try:
        d = _parse_json(text)
    except Exception:  # noqa: BLE001 — legacy two-line answer
        lines = [l.strip() for l in (text or "").strip().splitlines() if l.strip()]
        if not lines:
            raise ValueError("empty vision reply")
        first = lines[0].upper()
        if not first.startswith(("MATCH", "MISMATCH")):
            raise ValueError(f"unparseable vision reply: {lines[0][:60]!r}")
        return {"subject": "MATCH" if first.startswith("MATCH") else "MISMATCH",
                "era": "NA", "identity": {"person": False, "who": "", "matches_query": "NA"},
                "reason": lines[1] if len(lines) > 1 else lines[0]}
    ident = d.get("identity") if isinstance(d.get("identity"), dict) else {}
    return {"subject": str(d.get("subject", "")).strip().upper() or "MISMATCH",
            "era": str(d.get("era", "NA")).strip().upper() or "NA",
            "identity": {"person": bool(ident.get("person")),
                         "who": str(ident.get("who") or "").strip(),
                         "matches_query": str(ident.get("matches_query") or "NA").strip().upper()},
            "reason": str(d.get("reason") or "").strip()}


def judge_verdict(v: dict, ctx: dict | None = None) -> tuple[bool, str, str]:
    """(passed, category, reason). category: subject | era | identity | "".
    ANACHRONISTIC only rejects when the doc has an era and the scene is not
    aftermath/briefing; WRONG-PERSON rejects whenever the query named someone
    and the model says the person shown is not them."""
    reason = v.get("reason") or ""
    if not v.get("subject", "").startswith("MATCH"):
        return False, "subject", reason
    if v.get("era") == "ANACHRONISTIC" and (ctx or {}).get("era") and not _era_exempt(ctx):
        return False, "era", f"ANACHRONISTIC — {reason}"
    if (v.get("identity") or {}).get("matches_query") == "NO":
        who = (v.get("identity") or {}).get("who") or "someone else"
        return False, "identity", f"WRONG-PERSON (shows {who}) — {reason}"
    return True, "", reason


def _vision_call(prompt: str, frames: list[Path]) -> str:
    """One Gemini request: prompt + JPEG frames -> reply text. Raises on any
    error (callers fail open). Tests monkeypatch this — no live API needed."""
    key = _load_gemini_key()
    if not key:
        raise RuntimeError("no GEMINI_API_KEY")
    parts: list[dict] = [{"text": prompt}]
    for f in frames:
        parts.append({"inline_data": {"mime_type": "image/jpeg",
                                      "data": base64.b64encode(f.read_bytes()).decode()}})
    body = {"contents": [{"parts": parts}],
            "generationConfig": {"temperature": 0, "maxOutputTokens": 1024,
                                 "responseMimeType": "application/json"}}
    r = httpx.post(_GEMINI_ENDPOINT.format(model=_GEMINI_VERIFY_MODEL),
                   params={"key": key}, json=body, timeout=60)
    r.raise_for_status()
    return r.json()["candidates"][0]["content"]["parts"][0]["text"].strip()


_CATEGORY_VERDICT = {"subject": "MISMATCH", "era": "ANACHRONISTIC", "identity": "WRONG-PERSON"}


def verify_clip(query: str, path: Path, title: str = "",
                ctx: dict | None = None) -> dict:
    """Vision verdict for one saved file over 3 frames (0/8/15s of the kept
    slice, or the image) in ONE call. Returns the PROVENANCE `verify` dict plus
    `passed`. Fails OPEN (passed=True, status skipped|error) on a missing key,
    PIL or API error — a flaky verifier never blocks a fetch, but the status
    says it was not checked."""
    if not VERIFY or not _load_gemini_key():
        return {"passed": True, "status": "skipped", "note": "verification skipped"}
    is_vid = path.suffix.lower() not in IMG_EXT
    times = _strip_times(ffprobe_duration(path)) if is_vid else [0.0]
    shots = [(t, extract_frame(path, t)) for t in times]
    shots = [(t, f) for t, f in shots if f]
    if not shots:
        return {"passed": True, "status": "skipped", "note": "no frame extracted"}
    try:
        prompt = build_verify_prompt(query, title, ctx,
                                     [t for t, _ in shots] if is_vid else None)
        v = parse_verdict(_vision_call(prompt, [f for _, f in shots]))
        passed, cat, reason = judge_verdict(v, ctx)
        return {"passed": passed, "status": "verified", "model": _GEMINI_VERIFY_MODEL,
                "frames": [t for t, _ in shots],
                "verdict": "MATCH" if passed else _CATEGORY_VERDICT[cat],
                "category": cat, "subject": v["subject"], "era": v["era"],
                "era_window": (ctx or {}).get("era"), "era_exempt": _era_exempt(ctx),
                "identity": v["identity"], "reason": reason, "note": reason}
    except Exception as e:  # noqa: BLE001 — fail open, never kill the fetch run
        return {"passed": True, "status": "error",
                "note": f"verify error ({e.__class__.__name__}) — kept unverified"}
    finally:
        for _, f in shots:
            f.unlink(missing_ok=True)


def verify_relevance(query: str, path: Path, title: str = "",
                     ctx: dict | None = None) -> tuple[bool, str]:
    """(passed, reason) wrapper over verify_clip for older callers."""
    v = verify_clip(query, path, title, ctx)
    return v["passed"], v.get("reason") or v.get("note", "")


def pick_slice(src: Path, max_seconds: float, query: str = "",
               title: str = "") -> dict | None:
    """Which `max_seconds` window of a long source to keep (revamp §3.2,
    memory footage-20s-slice-root-cause). Scans scan_times(): drops near-black
    / dark-slate frames locally, sends the rest to ONE vision call asking which
    show the query, and keeps the window holding the most matches (earliest on
    a tie), starting at a matching frame. Returns {start, end, source_duration,
    method, hits, scanned}, or None when the vision scan ran and NO frame of
    the source shows the query — the caller rejects it as a MISMATCH. Without a
    vision key (or on an API error) it still skips black/slate openings."""
    dur = ffprobe_duration(src)
    if dur <= max_seconds + 0.5:
        return {"start": 0.0, "end": round(dur, 1), "source_duration": round(dur, 1),
                "method": "whole"}
    times = scan_times(dur)
    real = [t for t in times if is_real_frame(src, t)]
    hits, method = real, "slate-scan"
    if query and VERIFY and _load_gemini_key() and real:
        shots = [(t, extract_frame(src, t, 512)) for t in real]
        shots = [(t, f) for t, f in shots if f]
        try:
            d = _parse_json(_vision_call(build_scan_prompt(query, title, len(shots)),
                                         [f for _, f in shots]))
            idx = [int(i) for i in (d.get("match") or [])
                   if str(i).strip().lstrip("-").isdigit()]
            hits = sorted({shots[i - 1][0] for i in idx if 1 <= i <= len(shots)})
            method = "vision-scan"
            if not hits:
                return None
        except Exception as e:  # noqa: BLE001 — fail open to the slate scan
            method = f"slate-scan (verify error {e.__class__.__name__})"
        finally:
            for _, f in shots:
                f.unlink(missing_ok=True)
    latest = max(0.0, dur - max_seconds)
    if not hits:  # every scanned frame black/slate: legacy guess, contact sheet decides
        start, method = min(dur * 0.10, 45.0, latest), "legacy (no real frame found)"
    else:
        best = None
        for c in hits:
            s = min(c, latest)
            score = sum(1 for h in hits if s <= h <= s + max_seconds)
            if best is None or score > best[0]:
                best = (score, s)
        start = best[1]
    start = round(start, 1)
    return {"start": start, "end": round(min(dur, start + max_seconds), 1),
            "source_duration": round(dur, 1), "method": method,
            "hits": hits, "scanned": times}


def download_assets(assets: list[Asset], out_dir: Path, prefix: str, count: int,
                    max_seconds: int = 20, min_width: int = 800, max_h: int = 1080,
                    query: str = "", verify_ctx: dict | None = None,
                    need_seconds: float | None = None,
                    ) -> list[tuple[Path, Asset]]:
    """Download up to `count` assets as <prefix>_N.<ext>, resuming numbering after
    existing files (idempotent). Videos are transcoded; images saved as-is.
    A source longer than `max_seconds` is sliced where pick_slice's frame scan
    finds the query (not blindly from the top); the offset lands in
    PROVENANCE.jsonl as `source_offset`. When `query` is given (and VERIFY is
    on + GEMINI_API_KEY is set), each saved file is vision-checked for subject,
    era (`verify_ctx` = {"era": {...}, "aftermath": bool, "briefing": bool})
    and identity before it counts toward `count` — a rejection is deleted and
    the loop moves to the next candidate. `need_seconds` (on-screen time the
    clip must fill) drives the clip-short WARN. Returns (path, asset) pairs for
    what was actually saved and passed verification."""
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
                            # SIZE CAP (2026-09-16). Archives serve preservation
                            # masters over the same url shape as web copies; on
                            # columbia one b-roll candidate streamed past 9 GB and
                            # silently stalled the whole fetch for ~25 min with a
                            # block-buffered log showing nothing. We only ever keep
                            # a transcoded 1080p/2160p clip, so a source this large
                            # is never worth finishing.
                            got = 0
                            too_big = False
                            for chunk in rd.iter_bytes():
                                tf.write(chunk)
                                got += len(chunk)
                                if got > MAX_SOURCE_BYTES:
                                    too_big = True
                                    break
                        tmp = Path(tf.name)
                    if too_big:
                        print(f"  !! skipped (source over "
                              f"{MAX_SOURCE_BYTES // (1 << 30)} GB): {a.title[:60]}",
                              flush=True)
                        tmp.unlink(missing_ok=True)
                        continue
                    sl = pick_slice(tmp, max_seconds, query, a.title)
                    if sl is None:
                        tmp.unlink(missing_ok=True)
                        print(f"  !! MISMATCH (vision check): {a.title[:50]} — no scanned "
                              f"frame of the source shows the query")
                        continue
                    ok = transcode(tmp, dst, max_seconds, max_h=max_h, start=sl["start"])
                    tmp.unlink(missing_ok=True)
                    if ok and sl["method"] != "whole":
                        print(f"     slice {sl['start']:g}-{sl['end']:g}s of a "
                              f"{sl['source_duration']:g}s source [{sl['method']}]")
                    # PORTRAIT GUARD (2026-09-13). Stock libraries serve a lot of
                    # 608x1080 phone video. In a 1920x1080 doc it renders as a
                    # narrow strip between black bars — thegrounding shipped 16
                    # such scenes into a 4K master, two of them inside the cold
                    # open, before anyone looked at a frame. Landscape only.
                    if ok:
                        try:
                            wh = subprocess.run(
                                ["ffprobe", "-v", "error", "-select_streams", "v",
                                 "-show_entries", "stream=width,height",
                                 "-of", "csv=p=0", str(dst)],
                                capture_output=True, text=True, check=True).stdout.strip()
                            vw, vh = (int(x) for x in wh.split(",")[:2])
                            if vw < vh:
                                dst.unlink(missing_ok=True)
                                print(f"  !! PORTRAIT {vw}x{vh}, skipped: {a.title[:44]}")
                                continue
                        except Exception:
                            pass  # unprobeable: let the contact sheet catch it
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
            vres: dict = {"status": "skipped", "note": "no query"}
            if query:
                vres = verify_clip(query, dst, a.title, verify_ctx)
                if not vres.pop("passed"):
                    dst.unlink(missing_ok=True)
                    label = {"era": "era", "identity": "identity"}.get(
                        vres.get("category", ""), "vision check")
                    print(f"  !! MISMATCH ({label}): {a.title[:50]} — {vres.get('reason', '')}")
                    continue
            n += 1
            saved.append((dst, a))
            batch_titles.add(norm_title(a.title))
            # DocWide starts every clip at videoFrom ?? 0 — surface where the
            # real footage starts so a slate never opens a scene
            start = suggest_clip_start(dst) if a.media == "video" else None
            log_attribution(out_dir, dst.name, a, query=query, verify=vres,
                            suggested_from=start,
                            slice_=({k: sl[k] for k in ("start", "end", "source_duration",
                                                        "method")}
                                    if a.media == "video" else None))
            extra = f" {ffprobe_duration(dst):.0f}s" if a.media == "video" else ""
            print(f"  -> {dst.name}  [{a.source}/{a.lic_key}]{extra}  {a.title[:56]}")
            if a.media == "video":
                if sl["start"]:
                    print(f"     source_offset={sl['start']:g}s  ({dst.name})")
                if start is not None:
                    print(f"     suggested videoFrom={start:g}  ({dst.name})")
                for w in clip_warnings(dst, need_seconds, offset=start or 0.0):
                    print(f"     {w}")
    return saved


def _strip_times(dur: float) -> list[float]:
    """Contact-sheet sample points: 0/8/15s, or evenly spaced when shorter."""
    if dur >= 16:
        return [0.0, 8.0, 15.0]
    end = max(0.0, dur - 0.5)
    return [0.0, round(end / 2, 1), round(end, 1)]


def contact_sheet(files: list[Path], out_png: Path, label: str = "") -> Path | None:
    """One-glance QA sheet: a 3-frame strip (0/8/15s) per video — one frame
    hid that columbia's whole launch pool showed no launch (memory
    footage-20s-slice-root-cause) — and a thumbnail per image. Video tiles
    are two grid cells wide."""
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return None
    TW, TH, CAP = 370, 210, 26
    tiles = []
    for f in files:
        try:
            if f.suffix.lower() == ".mp4":
                times = _strip_times(ffprobe_duration(f))
                frames = []
                for t in times:
                    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tf:
                        tmp = Path(tf.name)
                    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.1f}",
                                    "-i", str(f), "-frames:v", "1", str(tmp)], check=True)
                    fr = Image.open(tmp).convert("RGB")
                    fr.load()
                    tmp.unlink(missing_ok=True)
                    fr.thumbnail(((2 * TW - 16) // 3, TH))
                    frames.append(fr)
                im = Image.new("RGB", (sum(fr.width for fr in frames) + 4 * (len(frames) - 1),
                                       max(fr.height for fr in frames)), "black")
                x = 0
                for fr in frames:
                    im.paste(fr, (x, (im.height - fr.height) // 2))
                    x += fr.width + 4
                name = f"{f.name}  @" + "/".join(f"{t:g}" for t in times) + "s"
                tiles.append((name, im, 2))
            else:
                im = Image.open(f).convert("RGB")
                im.thumbnail((360, 200))
                tiles.append((f.name, im, 1))
        except Exception:
            continue
    if not tiles:
        return None
    # flow layout on a 4-cell grid; a 2-cell video strip wraps to the next row
    cols = min(4, sum(w for _, _, w in tiles))
    places, c, r = [], 0, 0
    for _, _, w in tiles:
        if c + w > cols:
            c, r = 0, r + 1
        places.append((c, r))
        c += w
    rows = r + 1
    from PIL import Image as PImage, ImageDraw as PDraw
    sheet = PImage.new("RGB", (cols * TW, rows * (TH + CAP) + 30), "black")
    d = PDraw.Draw(sheet)
    d.text((8, 6), label or out_png.stem, fill="yellow")
    for (name, im, w), (c, r) in zip(tiles, places):
        x, y = c * TW, 30 + r * (TH + CAP)
        sheet.paste(im, (x + (w * TW - im.width) // 2, y + (TH - im.height) // 2))
        d.text((x + 4, y + TH + 4), name[:52 * w], fill="white")
    out_png.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_png)
    return out_png
