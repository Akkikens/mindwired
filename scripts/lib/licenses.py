"""License parse-back + gate rules (BLACKBOX-2027-REVAMP §3.2, Phase 2 #3).

Every visual file a doc episode puts on screen is traced back to its license
string (PROVENANCE.jsonl row first, ATTRIBUTION.md line as fallback) and
normalized to one class:

    pd-usgov  pd  cc0  cc-by  cc-by-sa  ogl  stock-free  generated
    crown-copyright  non-commercial  news-broadcast  unknown

Rules (license_findings):
  news-broadcast, non-commercial  -> BLOCK anywhere
  crown-copyright                 -> BLOCK as an exhibit/dossier page, WARN as b-roll
  unknown                         -> WARN; BLOCK in the hook window (first 25 s)
  cc-by, cc-by-sa, ogl            -> attribution line must name author + license (WARN)
                                     and publish_kit must find each author in the
                                     METADATA credits block (cc_credit_failures -> FAIL)

`ogl` (UK Open Government Licence), `stock-free` (Pexels/Pixabay/Unsplash
licence) and `generated` (code-rendered / own work) are extra classes the
catalog needed so legitimately-licensed files don't land in `unknown`.
Docs: docs/guides/LICENSES-GATE.md. Calibration: `python3 scripts/lib/licenses.py`.
"""
from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SHORTS = REPO / "public" / "shorts"
DOCS = REPO / "src" / "mindwired-doc" / "docs"
HOOK_SECONDS = 25.0

CLASSES = ("pd-usgov", "pd", "cc0", "cc-by", "cc-by-sa", "ogl", "stock-free",
           "generated", "crown-copyright", "non-commercial", "news-broadcast",
           "unknown")
NEEDS_CREDIT = {"cc-by", "cc-by-sa", "ogl"}
BLOCK_CLASSES = {"news-broadcast", "non-commercial", "crown-copyright"}

_FEXT = r"(?:jpg|jpeg|png|webp|gif|mp4|m4v|webm|mov|ogv|ogg)"
_NC = re.compile(r"\bby-nc\b|\bcc[- ]by[- ]nc|\bnc-(?:sa|nd)\b|non-?commercial|"
                 r"\bby-nd\b|\bcc[- ]by[- ]nd|no-?deriv", re.I)
_OGL = re.compile(r"open government licen[cs]e|\bogl\b", re.I)
_CROWN = re.compile(r"crown copyright|©\s*crown|crown ©", re.I)
_NEWS = re.compile(r"\b(cnn|bbc|fox news|nbc news|abc news|cbs news|msnbc|sky news|"
                   r"reuters|associated press|getty images|afp|al jazeera|itn|"
                   r"cbc news|ndtv|news broadcast|broadcast footage)\b", re.I)
_BYSA = re.compile(r"by-sa|\bby sa\b|attribution[- ]share ?alike|share ?alike|gfdl", re.I)
_BY = re.compile(r"\bcc[- ]by\b|creative commons attribution|licenses/by/|"
                 r"\battribution \d|[—–|]\s*by(?: \d\.\d)?\s*(?:[—–|]|$)|"
                 r"[—–|]\s*attribution(?: licen[cs]e)?\s*(?:[—–|(]|$)|attribution licen[cs]e", re.I)
_CC0 = re.compile(r"\bcc0\b|cc-zero|publicdomain/zero|zero/1\.0", re.I)
_PD = re.compile(r"public[- ]domain|publicdomain|\bpd\b|\bpd-|\bpdm\b|"
                 r"no known (?:copyright )?restrictions|no restrictions|"
                 r"government work|work of the (?:u\.?s\.?|united states)|"
                 r"public court record|court opinion|ntsb docket", re.I)
_USGOV = re.compile(r"\bnasa\b|\bnoaa\b|\bnara\b|national archives|\bdvids\b|"
                    r"u\.?s\.? (?:navy|air force|army|coast guard|government|dep|dod|marine)|"
                    r"usgov|\bntsb\b|\bfaa\b|\bfbi\b|\busgs\b|\bnps\b|library of congress|"
                    r"\bloc\b|\bdod\b|\busaf\b|\buscg\b|federal|\bjsc\b|\bksc\b|\bjpl\b", re.I)
_STOCK = re.compile(r"pexels|pixabay|unsplash", re.I)
_GEN = re.compile(r"code-rendered|hyperframes|ai-generated|generated|synthesi[sz]ed|"
                  r"gemini|imagen|\bveo\b|higgsfield|ai illustration|"
                  r"own work \(mindwired|rendered by|dossier_gen|illustrated, not a real",
                  re.I)


def classify(text: str) -> str:
    """Free-text license string (or whole attribution line) -> class."""
    t = text or ""
    if _NC.search(t):
        return "non-commercial"
    if _OGL.search(t):
        return "ogl"
    if _CROWN.search(t):
        return "crown-copyright"
    if _BYSA.search(t):
        return "cc-by-sa"
    if _BY.search(t):
        return "cc-by"
    if _CC0.search(t):
        return "cc0"
    if _PD.search(t):
        return "pd-usgov" if _USGOV.search(t) else "pd"
    if _STOCK.search(t):
        return "stock-free"
    if _NEWS.search(t):
        return "news-broadcast"
    if _GEN.search(t):
        return "generated"
    return "unknown"


# section prose that talks ABOUT a license it did not use ("non-commercial, so
# it cannot appear", "NOT used (copyrighted — deliberately avoided)")
_NEGATION = re.compile(r"\bnot\b|cannot|can't|never|avoid|rejected|pending|instead|"
                       r"nothing from|deliberately", re.I)

_KEY = {"pd": "pd", "pd-us": "pd", "pdm": "pd", "cc0": "cc0", "by": "cc-by",
        "by-sa": "cc-by-sa", "free": "stock-free", "ogl": "ogl"}


@dataclass
class Rec:
    file: str
    cls: str
    license: str = ""
    author: str = ""
    url: str = ""
    line: str = ""
    src: str = ""          # where the record came from (path)


def _url(s: str) -> str:
    m = re.search(r"https?://\S+", s)
    return m.group(0).rstrip(").,;") if m else ""


def _author(line: str, rest: str) -> str:
    """Best-effort author from the fetcher shapes + hand-written variants."""
    m = re.search(r'["”]\s+by\s+(.+?)\s+[—–]\s+', rest)
    if m:
        return m.group(1).strip()
    segs = [x.strip() for x in re.split(r"\s+[—–]\s+", rest)]
    for i, seg in enumerate(segs):
        if classify(seg) not in ("unknown", "generated") and len(seg) < 80:
            # video shape: Title — License — Author — url
            if i + 1 < len(segs) and not segs[i + 1].startswith("http"):
                return segs[i + 1]
            # table/hand shape: License — Author at the end
            break
    m = re.search(r"(?:CC[- ]BY[\w.\- ]*|Public domain[^,(]*)\s*\(([^)]+)\)", rest, re.I)
    if m and not re.search(r"\d{3,}x\d{3,}|nasa|commons|us gov", m.group(1), re.I):
        return m.group(1).strip()
    m = re.search(r"credited\s+[\"“]?([^\"”—–]+)", rest)
    if m:
        return m.group(1).strip(" ,")
    m = re.search(r"\bby\s+([^,—–(]+)", rest)
    if m:
        return m.group(1).strip()
    m = re.search(r"(?:CC[- ]BY[^,]*|Public domain[^,]*),\s*([^,.(]+)", rest, re.I)
    if m and re.fullmatch(r"[\d\sx×px]+", m.group(1)):
        return ""
    return m.group(1).strip() if m else ""


def _license_part(rest: str) -> str:
    """The license-bearing chunk of an entry with the quoted title cut out (so a
    title like 'BBC Television Centre.jpg' never classifies the file) and
    negated mentions removed ('NOT PD', 'nothing from CNN/BBC')."""
    r = re.sub(r'^\s*["“][^"”]*["”]', "", rest)
    r = re.sub(r"\bnot (?:pd|public[- ]domain)\b|nothing from [^.]*|"
               r"\bno (?:cnn|bbc|broadcast)[^.]*", " ", r, flags=re.I)
    return r


_NAME = re.compile(rf"[\w.()\-*]+?(?:\.{_FEXT})|[\w\-]+_\d+(?:/\d+)+|[\w\-*]+_(?:\d+|\*)", re.I)


def _expand(tok: str) -> list[str]:
    """'x_1/2/3.jpg' -> x_1.jpg x_2.jpg x_3.jpg; 'b2_glass_1/2' -> stems."""
    tok = tok.strip(" `*,.;:") if "*" not in tok.strip("`") else tok.strip(" `,.;:")
    gm = re.match(r"(.+?_)(\d+(?:/\d+)+)((?:\.\w+)?)$", tok)
    if gm:
        return [f"{gm.group(1)}{n}{gm.group(3)}" for n in gm.group(2).split("/")]
    return [tok] if tok else []


def _head_names(head: str) -> list[str]:
    ticks = re.findall(r"`([^`]+)`", head)
    raw = ticks if ticks else re.split(r",\s*|\s+and\s+|\s+through\s+", head.strip("*` "))
    names: list[str] = []
    for t in raw:
        for part in re.split(r",\s*", t):
            names += [n for n in _expand(part) if _NAME.fullmatch(n)]
    th = re.match(r"`?([\w\-]+_)(\d+)(\.\w+)?`?\s+through\s+`?\1(\d+)\3?`?", head.strip("*` "))
    if th:  # `galindo_1.mp4` through `galindo_6.mp4`
        names = [f"{th.group(1)}{n}{th.group(3) or ''}"
                 for n in range(int(th.group(2)), int(th.group(4)) + 1)]
    return names


@dataclass
class Entry:
    names: list[str]
    rec: Rec


def parse_attribution(path: Path) -> list[Entry]:
    """Entries in file order. Each bullet (+ its indented continuation lines)
    or table row is one entry; an entry with no license of its own inherits
    its section's (heading + prose since the last heading), then the file
    header's — hand-written files declare the license once per section
    (apollo13 'Rights: public domain' over the clip list). Inherited
    BLOCK-class licenses are downgraded to unknown: section prose is where
    negations live ('nothing from CNN', 'non-commercial, so it cannot appear')."""
    if not path.exists():
        return []
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    entries: list[Entry] = []
    section: list[str] = []
    header: list[str] = []
    seen_entry = False
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        st = line.strip()
        if st.startswith("#"):
            section = [st]
            i += 1
            continue
        cells = [c.strip() for c in st.strip("|").split("|")] if st.count("|") >= 2 else []
        bullet = re.match(r"^\s*[-*]\s+(.*)$", line)
        if cells and _NAME.fullmatch(cells[0].strip("`* ")) and not set(cells[0]) <= set("-: "):
            names = _head_names(cells[0])
            body = " — ".join(cells[2:]) if len(cells) > 2 else " — ".join(cells[1:])
            lic_i = next((k for k, c in enumerate(cells[1:], 1)
                          if classify(_license_part(c)) not in ("unknown",)), None)
            cls = classify(_license_part(cells[lic_i])) if lic_i else classify(_license_part(body))
            author = cells[-1] if lic_i and lic_i < len(cells) - 1 else ""
            if lic_i and not author:
                parts = re.split(r"\s+[—–]\s+", cells[lic_i])
                author = parts[1] if len(parts) > 1 else ""
            rec = Rec("", cls, cells[lic_i] if lic_i else "", author, _url(st), st, str(path))
            entries.append(Entry(names, rec))
            seen_entry = True
            i += 1
            continue
        if bullet:
            text = bullet.group(1)
            j = i + 1
            while j < len(lines) and lines[j].strip() and not re.match(r"^\s*[-*|#]", lines[j]) \
                    and lines[j][:1] in (" ", "\t"):
                text += " " + lines[j].strip()
                j += 1
            m = re.match(r"(.+?)\s+[—–-]{1,2}\s+(.*)$", text) or re.match(r"(.+?)[,:]\s+(.*)$", text)
            head, rest = (m.group(1), m.group(2)) if m else (text, "")
            names = _head_names(head)
            if names:
                cls = classify(_license_part(rest))
                same = re.search(r"same (?:source|license)[^.]*?\bas\s+`?([\w-]+?)(?:\.\w+)?`?(?:\b|$)",
                                 rest, re.I)
                inherited = ""
                above = re.search(r"same [\w/ ]+?\bas above\b", rest, re.I)
                if above:
                    same = None
                if cls == "unknown" and (same or above or re.match(r"same source\b", rest, re.I)):
                    # 'same source/license as x_1' -> x_1; bare 'same source
                    # (NPC-8530), …' -> the entry right above it
                    ref = (next((e.rec for e in reversed(entries)
                                 if any(Path(n).stem == same.group(1) for n in e.names)), None)
                           if same else (entries[-1].rec if entries else None))
                    if ref:
                        entries.append(Entry(names, Rec("", ref.cls, ref.license, ref.author,
                                                        _url(rest) or ref.url, text, str(path))))
                        seen_entry = True
                        i = j
                        continue
                if cls == "unknown":
                    for ctx in (" ".join(section), " ".join(header)):
                        c2 = classify(_license_part(ctx))
                        if c2 != "unknown":
                            cls = c2 if (c2 not in BLOCK_CLASSES
                                         or not _NEGATION.search(ctx)) else "unknown"
                            inherited = " [inherited from section]"
                            break
                author = _author(text, rest)
                if re.match(r"same\b.*\babove\b", author, re.I) and entries:
                    author = entries[-1].rec.author
                entries.append(Entry(names, Rec("", cls, inherited.strip(" []"),
                                                author, _url(text), text, str(path))))
                seen_entry = True
                i = j
                continue
        # prose: a backticked glob ("All `*_1.png` … AI-generated") is an entry
        for g in re.findall(r"`([^`]*\*[^`]*)`", st):
            c = classify(_license_part(st))
            if c != "unknown" and c not in BLOCK_CLASSES:
                entries.append(Entry([g], Rec("", c, "glob", "", _url(st), st, str(path))))
        if st:
            section.append(st)
            if not seen_entry:
                header.append(st)
        i += 1
    return entries


_IMG = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def _kind(name: str) -> str:
    e = Path(name).suffix.lower()
    return "" if not e else ("img" if e in _IMG else "vid")


def lookup(entries: list[Entry], file: str) -> Rec | None:
    """exact name, then same-stem (same media kind, or an extension-less
    entry — 'csmutest_1.jpg' logged, .png on disk after conversion), then
    glob. Later entries win (a corrected line further down supersedes)."""
    import fnmatch
    stem, kind = Path(file).stem, _kind(file)
    for test in (lambda n: n == file,
                 lambda n: "*" not in n and Path(n).stem == stem and _kind(n) in ("", kind)
                 if _kind(n) else n == stem,
                 lambda n: "*" in n and fnmatch.fnmatch(file, n)):
        hits = [e.rec for e in entries if any(test(n) for n in e.names)]
        if hits:
            # later lines win, but a trailing free-text NOTE about the same file
            # ('ops_floor_1.mp4 — trimmed 11s from the head') carries no
            # license and must not erase the real line above it
            known = [r for r in hits if r.cls != "unknown"]
            return (known or hits)[-1]
    return None


def parse_provenance(path: Path) -> dict[str, Rec]:
    out: dict[str, Rec] = {}
    if not path.exists():
        return out
    for raw in path.read_text(encoding="utf-8", errors="replace").splitlines():
        try:
            row = json.loads(raw)
        except ValueError:
            continue
        f = Path(str(row.get("file", ""))).name
        if not f:
            continue
        lic = str(row.get("license") or "")
        cls = classify(lic) if lic else _KEY.get(str(row.get("lic_key") or ""), "unknown")
        if cls == "unknown" and row.get("lic_key"):
            cls = _KEY.get(str(row["lic_key"]), "unknown")
        if cls == "pd" and _USGOV.search(f"{row.get('source', '')} {lic} {row.get('author', '')}"):
            cls = "pd-usgov"
        out[f] = Rec(f, cls, lic, str(row.get("author") or ""),
                     str(row.get("page") or row.get("url") or ""), raw, str(path))
    return out


def episode_record(slug: str, file: str) -> Rec | None:
    """PROVENANCE.jsonl row first; then the ATTRIBUTION.md matching the file's
    media dir, the other dir, the root prose file; then the episode's
    <slug>.dossier.json (prefixes generated by dossier_gen.py)."""
    root = SHORTS / slug
    cache = _CACHE.setdefault(slug, {})
    if "prov" not in cache:
        cache["prov"] = parse_provenance(root / "PROVENANCE.jsonl")
        cache["video"] = parse_attribution(root / "video" / "ATTRIBUTION.md")
        cache["images"] = parse_attribution(root / "images" / "ATTRIBUTION.md")
        cache["root"] = parse_attribution(root / "ATTRIBUTION.md")
        dj = DOCS / f"{slug}.dossier.json"
        try:
            cache["dossier"] = set(json.loads(dj.read_text())) if dj.exists() else set()
        except ValueError:
            cache["dossier"] = set()
    if file in cache["prov"]:
        return cache["prov"][file]
    order = ("video", "images", "root") if _kind(file) == "vid" else ("images", "video", "root")
    for k in order:
        r = lookup(cache[k], file)
        if r:
            return Rec(file, r.cls, r.license, r.author, r.url, r.line, r.src)
    if re.sub(r"_\d+$", "", Path(file).stem) in cache["dossier"]:
        return Rec(file, "generated", "dossier_gen.py", "", "", "", f"{slug}.dossier.json")
    return None


_CACHE: dict[str, dict] = {}


@dataclass
class Use:
    scene: str
    file: str
    role: str        # exhibit | dossier | broll
    start: float     # seconds into the body
    hook: bool


def episode_uses(doc: dict, man: dict, on_disk_only: bool = True) -> list[Use]:
    """Every (scene, file) the render will show, mirroring DocWide's router
    precedence and per-prefix rotation (makeDocComp sceneFileIdx)."""
    sys.path.insert(0, str(REPO / "scripts" / "lib"))
    import doctiming  # noqa: E402
    spans = doctiming.scene_spans(doc, man.get("durations", {}))
    rot: dict[str, int] = {}
    out: list[Use] = []
    for s, t0, _ in spans:
        idx = None
        if s.get("img"):
            idx = rot.get(s["img"], 0)
            rot[s["img"]] = idx + 1
        hook = t0 < HOOK_SECONDS
        if s.get("chapter") or s.get("sting") or s.get("speaker"):
            role, vid = "broll", None
        elif s.get("hf"):
            continue                         # code-rendered data scene
        elif s.get("video"):
            out.append(Use(s["id"], s["video"], "broll", t0, hook))
            continue
        elif s.get("exhibit"):
            role = "exhibit"
        elif s.get("dossier"):
            role = "dossier"
        else:
            role = "broll"
        files = (man.get("images", {}) or {}).get(s.get("img") or "", []) if s.get("img") else []
        if files and idx is not None:
            out.append(Use(s["id"], files[idx % len(files)], role, t0, hook))
    # files missing on disk are preflight's ref-check BLOCK, not a license question
    slug = doc.get("slug", "")
    if not on_disk_only:
        return out
    out = [u for u in out if (SHORTS / slug / ("video" if _kind(u.file) == "vid" else "images")
                              / u.file).exists()]
    return out


def license_findings(slug: str, doc: dict, man: dict,
                     on_disk_only: bool = True) -> tuple[list[str], list[str], dict]:
    """(blocks, warns, stats) for one episode. stats = {class: n_files_used}."""
    uses = episode_uses(doc, man, on_disk_only)
    blocks: list[str] = []
    warns: list[str] = []
    seen_cls: dict[str, str] = {}
    credit_warned: set[str] = set()
    for u in uses:
        r = episode_record(slug, u.file)
        cls = r.cls if r else "unknown"
        seen_cls[u.file] = cls
        where = f"{u.scene} ({u.role}, {u.start:.0f}s): {u.file}"
        url = (r.url if r else "") or "no URL recorded"
        if cls in ("news-broadcast", "non-commercial"):
            blocks.append(f"license {cls}: {where} — never usable on a monetized "
                          f"channel ({url})")
        elif cls == "crown-copyright":
            msg = (f"license crown-copyright: {where} — Crown Copyright reproduced as a "
                   f"document page needs the issuing body's written terms ({url})")
            (blocks if u.role in ("exhibit", "dossier") else warns).append(
                msg if u.role in ("exhibit", "dossier") else
                f"license crown-copyright as b-roll: {where} ({url})")
        elif cls == "unknown":
            why = "no ATTRIBUTION/PROVENANCE entry" if not r else "license string unrecognised"
            msg = f"license unknown: {where} — {why}"
            (blocks if u.hook else warns).append(
                msg + (" — inside the first 25s hook window" if u.hook else ""))
        elif cls in NEEDS_CREDIT and u.file not in credit_warned:
            if not (r and r.author and r.author.lower() not in ("unknown", "?")):
                credit_warned.add(u.file)
                warns.append(f"license {cls}: {u.file} — attribution line names no "
                             f"author; CC-BY credit needs author + license ({url})")
    stats: dict[str, int] = {}
    for c in seen_cls.values():
        stats[c] = stats.get(c, 0) + 1
    return blocks, warns, stats


def cc_authors(slug: str, doc: dict, man: dict) -> dict[str, list[str]]:
    """author -> [files] for every CC-BY/BY-SA/OGL file the episode shows."""
    out: dict[str, list[str]] = {}
    for u in episode_uses(doc, man):
        r = episode_record(slug, u.file)
        if r and r.cls in NEEDS_CREDIT:
            files = out.setdefault(r.author or "", [])
            if u.file not in files:
                files.append(u.file)
    return out


def _norm(s: str) -> str:
    s = re.sub(r"\((?:talk|contribs)[^)]*\)|\buser:\s*", " ", s, flags=re.I)
    return re.sub(r"[^0-9a-zÀ-￿]+", " ", s.lower()).strip()


def credits_text(meta_text: str) -> str:
    """Every block in METADATA whose heading/label line says 'credit'
    (e.g. '## Credits / attribution', 'FOOTAGE AND IMAGE CREDITS'), up to the
    next heading or MORE FROM line."""
    lines = meta_text.splitlines()
    out: list[str] = []
    for i, ln in enumerate(lines):
        if re.search(r"credit", ln, re.I) and (ln.lstrip().startswith("#") or ln.isupper()
                                              or ln.strip().endswith(":")):
            for nxt in lines[i + 1:i + 60]:
                if nxt.lstrip().startswith("#") or "MORE FROM" in nxt.upper():
                    break
                out.append(nxt)
    return "\n".join(out)


def cc_credit_failures(slug: str, doc: dict, man: dict, meta_text: str) -> list[str]:
    authors = cc_authors(slug, doc, man)
    if not authors:
        return []
    block = _norm(credits_text(meta_text))
    fails: list[str] = []
    if not block:
        return [f"METADATA: no credits block, but {sum(len(v) for v in authors.values())} "
                f"CC-BY/BY-SA/OGL file(s) need author credit: "
                + ", ".join(sorted(a or "<no author>" for a in authors))]
    words = set(block.split())
    for a, files in sorted(authors.items()):
        # 'Kentaro Iemoto from Tokyo, Japan' is credited as 'Kentaro Iemoto':
        # accept the full name, or every word of its core (before from/,/(/via)
        core = _norm(re.split(r"\s+from\s+|,|\(|\s/\s|\svia\s|;", a)[0])
        ok = bool(a) and (_norm(a) in block or (core and all(w in words for w in core.split())))
        if ok:
            continue
        if not a:
            fails.append(f"CC credit: {', '.join(files)} — attribution names no author, "
                         f"cannot credit it (fix ATTRIBUTION.md, then credit in METADATA)")
        else:
            fails.append(f"CC credit: author {a!r} ({', '.join(files[:3])}"
                         f"{'…' if len(files) > 3 else ''}) not in the METADATA credits block")
    return fails


def _calibrate() -> int:
    """Catalog run: class counts over every doc with a manifest + every hit."""
    totals: dict[str, int] = {}
    nb = nw = 0
    only = {a for a in sys.argv[1:] if not a.startswith("-")}
    for dp in sorted(DOCS.glob("*.json")):
        if dp.name.endswith(".manifest.json"):
            continue
        mp = dp.with_name(dp.stem + ".manifest.json")
        if not mp.exists():
            continue
        try:
            doc, man = json.loads(dp.read_text()), json.loads(mp.read_text())
            slug = doc.get("slug") or dp.stem
            if "scenes" not in doc:
                continue
            if only and slug not in only:
                continue
            b, w, st = license_findings(slug, doc, man, on_disk_only=False)
            if only:
                for u in episode_uses(doc, man, on_disk_only=False):
                    r = episode_record(slug, u.file)
                    print(f"  {u.scene:7s} {u.role:7s} {(r.cls if r else 'unknown'):15s} {u.file:32s} "
                          f"| {(r.author if r else '')[:30]:30s} | {(r.line if r else '')[:110]}")
        except Exception as e:  # noqa: BLE001 — calibration must cover everything
            print(f"{dp.stem}: ERROR {e}")
            continue
        for k, v in st.items():
            totals[k] = totals.get(k, 0) + v
        nb += len(b)
        nw += len(w)
        for m in b:
            print(f"{slug}: BLOCK {m}")
        if "-v" in sys.argv:
            for m in w:
                print(f"{slug}: warn  {m}")
    print("\nclass counts (files on screen, catalog):")
    for c in CLASSES:
        print(f"  {c:16s} {totals.get(c, 0)}")
    print(f"\n{nb} BLOCK, {nw} warn")
    return 0


if __name__ == "__main__":
    sys.exit(_calibrate())
