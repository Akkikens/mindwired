"""Structured provenance for doc-engine media (BLACKBOX-2027-REVAMP §3.2,
Phase 2 #1) — the ONE place that turns an episode's footage/photo origin into
per-file records the gates can trust.

Sources, in precedence order (per file):
  1. public/shorts/<slug>/PROVENANCE.jsonl  — written by footage.log_attribution
     (fresh fetches, with the vision-verify verdict), build_hf_scenes.py (hf_*
     clips) and provenance_backfill.py (legacy rows). Last row per file wins,
     so a re-fetch or a manual `--verify` row supersedes an older one.
  2. images/ATTRIBUTION.md, video/ATTRIBUTION.md — the human log. Parsed with
     the four shapes found in real files (audit_scene_relevance's historical
     parser, moved here). A file known ONLY from the markdown has never been
     through the vision check: verify.status = "legacy-unverified".

build_doc_vo.py snapshots both into manifest.assets (images/) and
manifest.videos (video/); audit_scene_relevance.py and preflight_doc.py read
the manifest FIRST and fall back to `live_maps()` per file, so a doc whose
manifest predates this module behaves identically.

Stdlib only — the gates run under plain python3 (footage.py needs httpx).
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import unquote, urlparse

REPO = Path(__file__).resolve().parent.parent.parent
SHORTS = REPO / "public" / "shorts"

# verify.status values. "verified" = the Gemini check (or a recorded human
# eyeball via provenance_backfill.py --verify) said MATCH. Everything else is
# unverified: the gates WARN on it, and BLOCK when it sits in the hook window.
VERIFIED = "verified"
LEGACY = "legacy-unverified"
GENERATED = "generated"   # hf_* clips (source: hyperframes) — exempt
UNVERIFIED_STATUSES = {LEGACY, "skipped", "error"}

_MEDIA_RE = r"jpg|jpeg|png|webp|mp4|webm|ogv|ogg|mov"
_SUBDIR_MEDIA = {"images": "image", "video": "video"}
# compact manifest record: everything a gate reads, nothing bulky
_KEEP = ("source", "title", "license", "lic_key", "author", "page", "url",
         "verify", "suggested_from", "origin")


def lic_key(name: str) -> str:
    """Display license -> key. Mirrors footage.license_key (pd|cc0|by|by-sa)
    plus the two stock licenses and 'unknown', so the license gate (§3.2,
    Phase 2 #3) has a key on every row without importing footage/httpx."""
    n = (name or "").lower()
    if "pexels" in n:
        return "pexels"
    if "pixabay" in n:
        return "pixabay"
    if any(f"-{r}" in n or f" {r}" in n or f"/{r}" in n
           for r in ("nc", "nd", "noncommercial", "noderiv")):
        return "rejected"
    if ("public domain" in n or "publicdomain" in n or "no known restrictions" in n
            or "no restrictions" in n or "usgov" in n or "17 u.s.c. 105" in n
            or n.strip() in {"pd", "pd-us", "pdm"}):
        return "pd"
    if "cc0" in n or "zero/1.0" in n:
        return "cc0"
    if "by-sa" in n or "attribution-sharealike" in n:
        return "by-sa"
    if "cc by" in n or "licenses/by" in n or "attribution" in n:
        return "by"
    if "code-rendered" in n:
        return "generated"
    return "unknown"


def _source_of(url: str, tail: str) -> str:
    """'(nasa)' suffix fetch_media writes, else the URL host's short name."""
    m = re.search(r"\(([a-z_]+)\)\s*$", tail)
    if m:
        return m.group(1)
    host = urlparse(url).netloc.lower().removeprefix("www.") if url else ""
    for key, name in (("images.nasa.gov", "nasa"), ("nasa.gov", "nasa"),
                      ("commons.wikimedia", "commons"), ("archive.org", "archive_org"),
                      ("dvidshub", "dvids"), ("pexels", "pexels"), ("pixabay", "pixabay"),
                      ("loc.gov", "loc"), ("archives.gov", "nara"), ("ntsb.gov", "ntsb"),
                      ("noaa.gov", "noaa"), ("eso.org", "eso"), ("openverse", "openverse")):
        if key in host:
            return name
    return host or "unknown"


def _license_of(segments: list[str]) -> str:
    for seg in segments:
        if lic_key(seg) not in ("unknown",):
            return seg.strip()
    return ""


def parse_attribution_rows(dirpath: Path) -> dict[str, dict]:
    """filename -> {title, license, lic_key, author, page, url, source, line}.

    The `title` extraction is byte-for-byte the historical
    audit_scene_relevance.parse_attribution logic (fetch_video `- **f** —
    Title — …`, fetch_media `` - `f` — "Title" by … ``, hand-written bare
    lines, grouped `amphipod_1/2/3.jpg` shorthand, mariana's markdown table) so
    relevance verdicts don't move; the other fields are best-effort extras."""
    out: dict[str, dict] = {}
    att = dirpath / "ATTRIBUTION.md"
    if not att.exists():
        return out
    for line in att.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        tmrow = re.match(
            r"([\w./()\- ]+\.(?:jpg|jpeg|png|webp|mp4|webm|ogv|ogg))\s*\|"
            r"\s*([^|]*)\|\s*(\S+)\s*\|", line, re.I)
        if tmrow:
            url = tmrow.group(3)
            urlname = unquote(url.rsplit("File:", 1)[-1].rsplit("/", 1)[-1])
            title = f"{tmrow.group(2).strip()} {urlname.replace('_', ' ')}".strip()
            cells = [c.strip() for c in line.split("|")]
            lic = cells[3] if len(cells) > 3 else ""
            out[tmrow.group(1).strip()] = dict(
                title=title, license=lic, lic_key=lic_key(lic), author="",
                page=url, url=url, source=_source_of(url, ""), line=line)
            continue
        m = re.match(
            r"-\s+\*{0,2}`?(.+?\.(?:jpg|jpeg|png|webp|mp4|webm|ogv|ogg))`?\*{0,2}"
            r"\s+[—–-]\s+(.+)$", line, re.I)
        if not m:
            continue
        fname_part, rest = m.group(1).strip(), m.group(2).strip()
        tm = re.match(r'["“](.+?)["”]', rest)
        title = tm.group(1) if tm else re.split(r"\s+[—–-]\s+", rest)[0]
        gm = re.match(r"(.+?_)(\d+(?:/\d+)+)(\.\w+)$", fname_part)
        names = ([f"{gm.group(1)}{n}{gm.group(3)}" for n in gm.group(2).split("/")]
                 if gm else [fname_part])
        # fetch_media: `"Title" by Author — License — URL (src)`;
        # fetch_video: `Title — License — Author — URL`
        after_title = rest[tm.end():] if tm else rest[len(title):]
        segs = [p for p in re.split(r"\s+[—–]\s+", after_title) if p.strip()]
        # NASA page URLs carry raw spaces, so take the whole URL segment
        useg = next((p.strip() for p in segs if p.strip().startswith("http")), "")
        if not useg:
            urlm = re.search(r"https?://\S+", rest)
            useg = urlm.group(0) if urlm else ""
        url = re.sub(r"\s+\([a-z_]+\)$", "", useg).rstrip(".,")
        lic = _license_of(segs) or _license_of([rest])
        author = ""
        bym = re.match(r"\s*by\s+(.+?)\s+[—–]\s", after_title)
        if bym:
            author = bym.group(1).strip()
        elif not tm and len(segs) >= 3 and segs[0].strip() == lic:
            author = segs[1].strip()
        for nme in names:
            out[nme] = dict(title=title.strip(), license=lic, lic_key=lic_key(lic),
                            author=author, page=url, url=url,
                            source=_source_of(url, rest), line=line)
    return out


def attribution_mentions(dirpath: Path) -> str:
    """Raw ATTRIBUTION.md text ('' when absent) — a file whose name appears in
    an unparseable line is still SOURCED (it has an entry), just untitled."""
    att = dirpath / "ATTRIBUTION.md"
    return att.read_text(encoding="utf-8", errors="replace") if att.exists() else ""


def load_jsonl(slug: str) -> dict[str, dict]:
    """'video/x.mp4' -> last PROVENANCE.jsonl row for that file."""
    out: dict[str, dict] = {}
    p = SHORTS / slug / "PROVENANCE.jsonl"
    if not p.exists():
        return out
    for ln in p.read_text(encoding="utf-8", errors="replace").splitlines():
        ln = ln.strip()
        if not ln:
            continue
        try:
            row = json.loads(ln)
        except json.JSONDecodeError:
            continue
        if isinstance(row, dict) and row.get("file"):
            out[row["file"]] = row
    return out


def _compact(row: dict, origin: str) -> dict:
    rec = {k: row[k] for k in _KEEP if k in row and row[k] not in (None, "")}
    rec["origin"] = row.get("origin") or origin
    v = row.get("verify")
    if not isinstance(v, dict):
        if row.get("source") == "hyperframes":
            # build_hf_scenes.py output: code-rendered from CLAIMS-gated data,
            # nothing for a vision check to verify
            v = {"status": GENERATED}
        else:
            v = {"status": LEGACY if origin == "attribution" else "skipped"}
    rec["verify"] = v
    if "lic_key" not in rec or not rec["lic_key"]:
        rec["lic_key"] = lic_key(rec.get("license", ""))
    return rec


def live_maps(slug: str) -> tuple[dict[str, dict], dict[str, dict]]:
    """(assets, videos) computed now from PROVENANCE.jsonl + ATTRIBUTION.md —
    exactly what build_doc_vo.py embeds in the manifest."""
    root = SHORTS / slug
    jl = load_jsonl(slug)
    maps: dict[str, dict[str, dict]] = {"images": {}, "video": {}}
    for sub in maps:
        for fname, row in parse_attribution_rows(root / sub).items():
            r = dict(row)
            r.pop("line", None)
            r["verify"] = {"status": LEGACY,
                           "note": "known only from ATTRIBUTION.md — never vision-checked"}
            maps[sub][fname] = _compact(r, "attribution")
    for rel, row in jl.items():
        sub, _, fname = rel.partition("/")
        if sub in maps and fname:
            maps[sub][fname] = _compact(row, "provenance")
    return maps["images"], maps["video"]


class Provenance:
    """Per-file lookup, manifest FIRST, live (jsonl + markdown) fallback."""

    def __init__(self, slug: str, manifest: dict | None = None):
        self.slug = slug
        man = manifest or {}
        self._man = {"images": man.get("assets") or {}, "video": man.get("videos") or {}}
        self._live: tuple[dict, dict] | None = None
        self._mentions: dict[str, str] = {}
        self.stale: set[str] = set()

    def _live_for(self, sub: str) -> dict:
        if self._live is None:
            self._live = live_maps(self.slug)
        return self._live[0] if sub == "images" else self._live[1]

    def get(self, sub: str, fname: str) -> dict | None:
        """sub = 'images' | 'video'. The manifest record wins unless a newer
        PROVENANCE.jsonl row changed its verify status since the snapshot
        (a re-fetch or a `provenance_backfill.py --verify` after the last
        build_doc_vo) — then the live row is used and the file is listed in
        `self.stale` so preflight can say "rerun --manifest-only"."""
        rec = self._man[sub].get(fname)
        live = self._live_for(sub).get(fname)
        if rec is None:
            return live
        if live is not None and (live.get("verify") or {}).get("status") != \
                (rec.get("verify") or {}).get("status"):
            self.stale.add(f"{sub}/{fname}")
            return live
        return rec

    def mentioned(self, sub: str, fname: str) -> bool:
        if sub not in self._mentions:
            self._mentions[sub] = attribution_mentions(SHORTS / self.slug / sub)
        return fname in self._mentions[sub]

    def sourced(self, sub: str, fname: str) -> bool:
        return self.get(sub, fname) is not None or self.mentioned(sub, fname)

    def status(self, sub: str, fname: str) -> str | None:
        rec = self.get(sub, fname)
        if rec is None:
            # named in ATTRIBUTION.md in a shape the parser can't read (kursk's
            # `- priz_1.jpg / priz_2.jpg — …`): sourced, never vision-checked
            return LEGACY if self.mentioned(sub, fname) else None
        return (rec.get("verify") or {}).get("status") or "skipped"


def hook_scene_ids(doc: dict, durations: dict, seconds: float = 30.0) -> list[str]:
    """Scene ids whose start falls inside the first `seconds` — the same walk
    audit_scene_relevance has always used for HOOK-REUSE (narration or the
    words/2.3 estimate + 34 frames of LEAD/HOLD)."""
    ids: list[str] = []
    t = 0.0
    for s in doc["scenes"]:
        ids.append(s["id"])
        est = len(s.get("text", "").split()) / 2.3
        t += durations.get(s["id"], est) + 34 / 30
        if t >= seconds:
            break
    return ids
