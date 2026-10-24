#!/usr/bin/env python3
"""CLAIMS tracing for on-screen numbers + the sensitivity gate v1.

    python3 scripts/claims_lint.py <slug>            # data gate + tracer + sensitivity
    python3 scripts/claims_lint.py --catalog         # tracer calibration over every
                                                     # doc that has a CLAIMS file

BLACKBOX-2027-REVAMP Phase 1 #3 + #5 (§3.1 claims gate, §4.1 tracing, §4.4
sensitivity). Wired into preflight_doc.py; this CLI prints the same findings
with more detail (every miss, not just a count).

1. HF DATA GATE (BLOCK) — every hyperframes/data/<slug>/*.json is a generated
   data graphic: a number on it reads to the viewer as THE RECORD, the same way
   a radio line does (the quoted-transcript gate's reasoning). So every claim-
   bearing number/time in the data must be declared in the `## ANCHORS` table
   of docs/planning/CLAIMS-<slug>.md:

       ## ANCHORS
       | id | value | unit | source | note |
       |----|-------|------|--------|------|
       | c12 | 09:12:38 | EEST | AAIASB 11/2006 p.133 | CONFIRMED cabin altitude horn |
       | c13 | 12,040 | ft | AAIASB 11/2006 | CONFIRMED cabin altitude at the horn |

   `value` may hold several tokens ("14 Aug 2005"); every number/time in it
   becomes an anchor. `note` carries the CLAIMS label: EXCLUDE anchors never
   match (a data hit on one BLOCKs), DISPUTED/ALLEGED ones match with a WARN.
   No ANCHORS table -> the data is checked against every number in the whole
   CLAIMS file instead (weaker; WARN says so). A data file with neither
   `_facts` nor a `claims` list -> WARN; unknown ids in `claims` -> BLOCK.

   WHAT IS CHECKED (everything else is layout):
     - numeric `v` / `value` / `count` (JSON numbers or numeric strings), any
       magnitude — these are the plotted/printed figures;
     - clock times (H:MM, HH:MM:SS, "01:25h", "8:54 a.m.") in any string;
     - standalone numbers of 2+ digits in any string (single digits in prose —
       "Chapter 2" — are skipped). Numbers glued to letters or joined into
       codes (737-300, 5B-DBY, HCY522, 11/2006, p.171, 3.1.3.9, F-16s, UTC+3,
       1960s) are identifiers, not figures, and are skipped.
     Keys skipped outright: SKIP_KEYS (provenance/enums/ids) and LAYOUT_KEYS
     (whole subtree: geometry, timing, axis ticks, map coordinates). A number
     under a key in neither list -> WARN "unclassified" so a new template
     can't smuggle figures past the gate.

   TOLERANCE (documented so nobody has to guess why something matched):
     - commas ignored; "~"/"≈" prefixes ignored; ordinals/× stripped;
       71% also matches a 0.71 fraction;
     - FL<nnn> == nnn*100 ft; k / M / B / bn suffixes scale (2.3M == 2,300,000);
       the CLAIMS side also scales "<n> thousand|million|billion";
     - ROUNDING to the precision the data shows: 29,000 matches an anchor of
       28,900 (round to its trailing zeros) but only while >=2 significant
       digits remain, so 30,000 does NOT match 28,900; 81.9 matches 81.86;
       a 2+-digit integer matches a decimal claim that rounds to it (45 / 45.1);
     - TIMES: HH:MM:SS needs the same second (":00" also matches a bare HH:MM
       anchor); a bare HH:MM matches any anchor in that minute; a.m./p.m. are
       converted to 24h, and a time with no marker also tries +12h.

2. NARRATION TRACER (WARN-ONLY) — on-screen figures in `stat`, `kinetic.count`
   and exhibit `source` lines are traced (same tokenizer + tolerance, single
   digits included) to the CLAIMS file, ANY section. Reports hits/misses. Kept
   WARN-only until the false-positive rate is low enough to BLOCK `stat`/
   `exhibit` (revamp Phase 1 #3); CALIBRATION below is the measured rate.

3. SENSITIVITY GATE v1 — see docs/guides/SENSITIVITY-GATE.md.
"""
from __future__ import annotations
import argparse, json, re, sys, unicodedata
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DOCS = REPO / "src" / "mindwired-doc" / "docs"
HF_DATA = REPO / "hyperframes" / "data"
PLANNING = REPO / "docs" / "planning"

# Measured 2026-10-24 by `claims_lint.py --catalog`; every miss hand-classified.
# A miss is a FALSE positive when the on-screen figure is right and supported
# by CLAIMS in a form the tokenizer can't see (a sum, a time difference, a range
# midpoint, "half"); it is a TRUE positive when the figure appears nowhere in
# CLAIMS (an untraced figure, even if correct — e.g. a page cite never logged).
#   target set columbia/swissair111/twa800/challengerdisaster: 173 figures,
#     1 miss (columbia a5_13 "p. 164", page never recorded in CLAIMS) -> 0 FP
#   whole catalog, 57 docs with a CLAIMS file: 1518 figures, 30 misses (2.0%),
#     8 FP (27% of warnings, 0.5% of figures), 22 genuine trace gaps
#   caveat: 277 of 1518 are single-digit figures that match almost any CLAIMS
#     file, so a HIT is weak evidence — this tracer finds untraced figures, it
#     does not prove traced ones right. Hence WARN-only.
# Preflight prints this so the WARN is read with the right weight.
CALIBRATION = ("tracer FP rate (calibrated 2026-10-24): 0 of 173 figures on "
               "columbia/swissair111/twa800/challengerdisaster; catalog-wide 8 FP "
               "of 30 misses in 1518 figures (27% of warnings, 0.5% of figures) — "
               "WARN-only; single-digit hits are weak evidence")

SKIP_KEYS = {"_facts", "claims", "scene", "kind", "mode", "basemap", "image",
             "imageCredit", "anchor", "labelPos", "labelAnchor", "color", "route",
             "id", "from", "to", "order", "tz", "suffix", "focal", "danger",
             "accentLastWord", "n", "channel"}
LAYOUT_KEYS = {"duration", "yMax", "yMin", "max", "min", "yTicks", "xTicks",
               "hourTicks", "start", "end", "grid", "cols", "colW", "rowH",
               "x0", "y0", "nodeW", "nodeH", "col", "row", "labelDy", "labelDx",
               "lon", "lat", "size", "widthKm", "heightKm", "headingDeg",
               "loopsDrawn", "loopSeconds", "legSeconds", "scale", "at", "screenX",
               "screenY", "zoom", "highlightAt", "revealAt", "block", "lines",
               "view", "legs", "cover", "highlight", "delay", "speed", "opacity",
               "width", "height", "x", "y", "dx", "dy"}
DATA_NUM_KEYS = {"v", "value", "count"}

# ── tokenizer ──────────────────────────────────────────────────────────────
TIME_RE = re.compile(
    r"(?<![\d.])(?<!\d:)(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?h?"
    r"(?:\s*([ap])\.?\s?m\b\.?)?(?!\d|:\d)", re.I)
NUM_RE = re.compile(
    r"(?<![\w.\-/+‐‑])(?:[~≈]\s?)?(FL)?(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)"
    r"(k|K|M|B|bn|st|nd|rd|th|%|×)?(?![\w\-/‐‑])(?!\.\d)")
SCALE = {"k": 1e3, "K": 1e3, "M": 1e6, "B": 1e9, "bn": 1e9}
WORD_SCALE = re.compile(r"\s*(thousand|million|billion)\b", re.I)
WORD_MULT = {"thousand": 1e3, "million": 1e6, "billion": 1e9}


# NTSB transcripts/AARs write clock times as HHMM:SS(.s) ("0913:21",
# "0916:14.8"). Normalize to HH:MM:SS before tokenizing so a data file's
# "09:13:21" matches a CLAIMS anchor written the NTSB way (and vice versa),
# instead of splitting into the numbers 913 and 21.
NTSB_TIME_RE = re.compile(r"(?<![\d:.])([01]\d|2[0-3])([0-5]\d):([0-5]\d(?:\.\d+)?)(?![\d:])")


def _nfkc(t: str) -> str:
    return NTSB_TIME_RE.sub(r"\1:\2:\3", unicodedata.normalize("NFKC", t))


def times_in(text: str) -> list[tuple[str, tuple]]:
    """[(literal, (h, m, s|None, ampm|None))] for every clock time."""
    out = []
    for m in TIME_RE.finditer(_nfkc(text)):
        h, mi = int(m.group(1)), int(m.group(2))
        if h > 24 or mi > 59:
            continue
        s = int(m.group(3)) if m.group(3) else None
        out.append((m.group(0).strip(), (h, mi, s, (m.group(4) or "").lower() or None)))
    return out


def numbers_in(text: str, min_digits: int = 1) -> list[tuple[str, list[float], int]]:
    """[(literal, candidate values, significant digits)] for standalone numbers.
    Times are blanked first so 09:12:38 never yields 09/12/38."""
    t = TIME_RE.sub(lambda m: " " * len(m.group(0)), _nfkc(text))
    out = []
    for m in NUM_RE.finditer(t):
        fl, lit, suf = m.group(1), m.group(2), m.group(3) or ""
        digits = re.sub(r"\D", "", lit)
        if len(digits) < min_digits and not fl:
            continue
        v = float(lit.replace(",", ""))
        cands = [v]
        if fl:
            cands = [v * 100, v]
        elif suf in SCALE:
            cands.append(v * SCALE[suf])
        elif suf == "%":
            cands.append(v / 100)          # 71% == 0.71 (a fraction in CLAIMS)
        out.append((m.group(0).strip(), cands, len(digits.lstrip("0")) or 1))
    return out


def _sig_round_ok(d: float, c: float, lit: str) -> bool:
    """d (as written, literal lit) == c, or c rounded to d's shown precision."""
    if abs(d - c) < 1e-9:
        return True
    core = re.sub(r"[^\d.]", "", lit.replace(",", ""))
    if "." in core:                                   # decimals: round c to d's places
        places = len(core.split(".")[1])
        sig = len(core.replace(".", "").lstrip("0"))
        return sig >= 2 and round(c, places) == round(d, places)
    digits = core.lstrip("0")
    if len(digits) >= 2 and c != int(c) and round(c) == d:
        return True                                   # 45 shown for a 45.1 claim
    z = len(digits) - len(digits.rstrip("0"))
    k = min(z, len(digits) - 2)
    return k >= 1 and round(c, -k) == d


class FactSet:
    """Numbers + times from anchor cells or a whole CLAIMS text."""

    def __init__(self) -> None:
        self.nums: list[float] = []
        self.times: set[tuple] = set()          # (h, m, s|None) in 24h

    def add_text(self, text: str, permissive: bool = True) -> None:
        text = _nfkc(text)
        for _, (h, m, s, ap) in times_in(text):
            for hh in self._hours(h, ap):
                self.times.add((hh, m, s))
        t = TIME_RE.sub(" ", text)
        if permissive:
            # every digit run counts on the CLAIMS side (codes included) —
            # the data side is the strict one
            for m in re.finditer(r"\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?", t):
                v = float(m.group(0).replace(",", ""))
                self.nums.append(v)
                w = WORD_SCALE.match(t, m.end())
                if w:
                    self.nums.append(v * WORD_MULT[w.group(1).lower()])
                sfx = t[m.end():m.end() + 2]
                if sfx[:1] in ("k", "K", "M", "B") and not sfx[1:2].isalpha():
                    self.nums.append(v * SCALE[sfx[:1]])
                if t[max(0, m.start() - 2):m.start()].upper() == "FL":
                    self.nums.append(v * 100)
        else:
            for _, cands, _ in numbers_in(t):
                self.nums.extend(cands)

    @staticmethod
    def _hours(h: int, ap: str | None) -> list[int]:
        if ap == "p" and h < 12:
            return [h + 12]
        if ap == "a" and h == 12:
            return [0]
        if ap:
            return [h]
        return [h, h + 12] if h < 12 else [h]

    def has_time(self, t: tuple) -> bool:
        h, m, s, ap = t
        for hh in self._hours(h, ap):
            for (H, M, S) in self.times:
                if (H, M) != (hh, m):
                    continue
                if s is None or S == s or (S is None and s == 0):
                    return True
        return False

    def has_num(self, cands: list[float], lit: str) -> bool:
        return any(_sig_round_ok(d, c, lit) for d in cands for c in self.nums)


# ── CLAIMS parsing ─────────────────────────────────────────────────────────
def claims_path(slug: str) -> Path:
    return PLANNING / f"CLAIMS-{slug}.md"


def section(text: str, pattern: str) -> str | None:
    """Body of the first `## ...` heading matching pattern (to the next `## `)."""
    m = re.search(rf"^##\s+[^\n]*{pattern}[^\n]*$", text, re.I | re.M)
    if not m:
        return None
    nxt = re.search(r"^##\s", text[m.end():], re.M)
    return text[m.end(): m.end() + nxt.start()] if nxt else text[m.end():]


def parse_anchors(text: str) -> dict[str, dict] | None:
    body = section(text, r"\bANCHORS\b")
    if body is None:
        return None
    anchors: dict[str, dict] = {}
    for line in body.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 2 or cells[0].lower() == "id" or set(cells[0]) <= set("-: "):
            continue
        cells += [""] * (5 - len(cells))
        aid, value, unit, source, note = cells[:5]
        fs = FactSet()
        fs.add_text(value.replace("`", ""))
        # Status from the note column by word, or from a one-letter label
        # column (C/D/A/U/X — the CLAIMS-american587 ANCHORS shape).
        label = {"D": "DISPUTED", "A": "ALLEGED", "U": "UNVERIFIED", "X": "EXCLUDE",
                 "E": "EXCLUDE"}.get(note.strip().upper())
        status = label or next((s for s in ("EXCLUDE", "DISPUTED", "ALLEGED", "UNVERIFIED")
                                if s in note.upper()), "CONFIRMED")
        anchors[aid] = {"value": value, "unit": unit, "source": source,
                        "note": note, "status": status, "facts": fs}
    return anchors


def parse_victims(text: str) -> list[str]:
    """Victim names from the CLAIMS file's sensitivity section: a line
    `victims: A B; C D` or a `### Victims` sub-list of `- Name` bullets."""
    body = section(text, r"SENSITIVITY")
    if not body:
        return []
    names: list[str] = []
    m = re.search(r"^\s*[-*]?\s*\**victims\**\s*:\s*(.+)$", body, re.I | re.M)
    if m:
        names += [n.strip(" *.") for n in re.split(r"[;,]", m.group(1)) if n.strip(" *.")]
    m = re.search(r"^###\s*victims\b[^\n]*\n((?:\s*[-*][^\n]*\n?)+)", body, re.I | re.M)
    if m:
        names += [re.sub(r"\s*[—(].*$", "", l.strip(" -*\t")).strip()
                  for l in m.group(1).splitlines() if l.strip(" -*\t")]
    return names


def surname(name: str) -> str:
    parts = [p for p in re.split(r"\s+", name.strip())
             if p.rstrip(".,").lower() not in {"jr", "sr", "ii", "iii", "iv"}]
    return parts[-1].strip(".,") if parts else ""


# ── 1. HF data gate ────────────────────────────────────────────────────────
def _walk(node, path: str, key: str | None):
    """Yield (path, key, value) for every leaf, skipping SKIP/LAYOUT subtrees."""
    if key in SKIP_KEYS or key in LAYOUT_KEYS:
        return
    if isinstance(node, dict):
        for k, v in node.items():
            yield from _walk(v, f"{path}.{k}" if path else k, k)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from _walk(v, f"{path}[{i}]", key)
    else:
        yield path, key, node


def lint_data(slug: str, claims_text: str | None = None) -> tuple[list[str], list[str]]:
    blocks: list[str] = []
    warns: list[str] = []
    files = sorted((HF_DATA / slug).glob("*.json")) if (HF_DATA / slug).is_dir() else []
    if not files:
        return blocks, warns
    if claims_text is None:
        cp = claims_path(slug)
        claims_text = cp.read_text() if cp.exists() else ""
    if not claims_text:
        blocks.append(f"hf data exists under hyperframes/data/{slug}/ but there is no "
                      f"CLAIMS-{slug}.md — numbers on screen with nothing to trace to")
        return blocks, warns
    anchors = parse_anchors(claims_text)
    if anchors is None:
        warns.append(f"CLAIMS-{slug}.md has no `## ANCHORS` table — hf data checked "
                     f"against every number in the whole CLAIMS file (weaker; add "
                     f"ANCHORS, see CLAIMS-helios522.md)")
        whole = FactSet(); whole.add_text(claims_text)
        pools = {"(CLAIMS text)": {"facts": whole, "status": "CONFIRMED"}}
    else:
        pools = anchors
    for f in files:
        rel = f.relative_to(REPO)
        try:
            data = json.loads(f.read_text())
        except ValueError as e:
            blocks.append(f"{rel}: not valid JSON ({e})")
            continue
        cited = data.get("claims")
        if not (data.get("_facts") or cited):
            warns.append(f"{rel}: no `_facts`/`claims` reference — cite the CLAIMS "
                         f"anchors this graphic draws on")
        if isinstance(cited, list) and anchors is not None:
            for aid in cited:
                if aid not in anchors:
                    blocks.append(f"{rel}: claims id {aid!r} is not in the ANCHORS table")

        def check(where: str, kind: str, payload, lit: str) -> None:
            hit = [aid for aid, a in pools.items()
                   if (a["facts"].has_time(payload) if kind == "t"
                       else a["facts"].has_num(payload, lit))]
            live = [aid for aid in hit if pools[aid]["status"] != "EXCLUDE"]
            if not live:
                why = (f" (matches EXCLUDE anchor {', '.join(hit)})" if hit else "")
                blocks.append(f"{rel}: {where} = {lit!r} is not in the ANCHORS table"
                              f"{why} — a typo, or a figure with no CLAIMS trace")
            elif all(pools[a]["status"] in ("DISPUTED", "ALLEGED", "UNVERIFIED")
                     for a in live):
                warns.append(f"{rel}: {where} = {lit!r} traces only to "
                             f"{pools[live[0]]['status']} anchor {live[0]} — the graphic "
                             f"must carry that attribution")

        for path, key, val in _walk(data, "", None):
            if isinstance(val, bool) or val is None:
                continue
            if isinstance(val, (int, float)):
                if key in DATA_NUM_KEYS:
                    check(path, "n", [float(val)], str(val))
                else:
                    warns.append(f"{rel}: numeric key {path} is unclassified — add "
                                 f"{key!r} to DATA_NUM_KEYS or LAYOUT_KEYS in "
                                 f"claims_lint.py")
                continue
            if not isinstance(val, str):
                continue
            for lit, t in times_in(val):
                check(path, "t", t, lit)
            min_d = 1 if key in DATA_NUM_KEYS else 2
            for lit, cands, _ in numbers_in(val, min_digits=min_d):
                check(path, "n", cands, lit)
    return blocks, warns


# ── 2. narration tracer (WARN-only) ────────────────────────────────────────
def trace_figures(doc: dict, claims_text: str) -> dict:
    """{'checked': n, 'hits': n, 'misses': [(scene id, field, literal)]}."""
    fs = FactSet(); fs.add_text(claims_text)
    checked, misses = 0, []
    for s in doc.get("scenes", []):
        fields = []
        if isinstance(s.get("stat"), str):
            fields.append(("stat", s["stat"]))
        k = s.get("kinetic")
        if isinstance(k, dict) and k.get("count") is not None:
            fields.append(("kinetic.count", f"{k['count']}{k.get('suffix') or ''}"))
        if s.get("exhibit") and isinstance(s.get("source"), str):
            fields.append(("exhibit.source", s["source"]))
        for fld, txt in fields:
            for lit, t in times_in(txt):
                checked += 1
                if not fs.has_time(t):
                    misses.append((s["id"], fld, lit))
            for lit, cands, _ in numbers_in(txt):
                checked += 1
                if not fs.has_num(cands, lit):
                    misses.append((s["id"], fld, lit))
    return {"checked": checked, "hits": checked - len(misses), "misses": misses}


# ── 3. sensitivity gate v1 ─────────────────────────────────────────────────
TIERS = ("standard", "high", "wtc")
ASSERT_RE = (r"(?:is|was|are)\s+(?:lying|guilty|responsible|to\s+blame|a\s+liar|"
             r"a\s+murderer|a\s+killer|covering\s+up)|lied|lies|knew|knows|caused|"
             r"covered\s+(?:it\s+|this\s+)?up|killed|murdered|falsified|sabotaged")
ATTRIB_RE = re.compile(
    r"\b(according\s+to|testif\w*|told|said|says|claim\w*|alleg\w*|accus\w*|"
    r"argued|ruled|found|concluded|convicted|acquitted|charged)\b", re.I)
SCREEN_FIELDS = ("cap", "stat", "mainText", "chapter")


def sensitivity_gate(doc: dict, claims_text: str) -> tuple[list[str], list[str]]:
    blocks: list[str] = []
    warns: list[str] = []
    sens = doc.get("sensitivity")
    channel = doc.get("channel", "mindwired")
    if sens is None:
        if channel == "blackbox":
            warns.append("no doc-level `sensitivity` block — declare {tier, victimsNamed, "
                         "livingParties} (docs/guides/SENSITIVITY-GATE.md)")
        sens = {}
    elif not isinstance(sens, dict):
        blocks.append("`sensitivity` must be an object {tier, victimsNamed, livingParties}")
        sens = {}
    tier = sens.get("tier")
    if tier is not None and tier not in TIERS:
        blocks.append(f"sensitivity.tier {tier!r} is not one of {'|'.join(TIERS)}")
    named = sens.get("victimsNamed", False)
    if not isinstance(named, bool):
        blocks.append(f"sensitivity.victimsNamed must be true/false, got {named!r}")
        named = False
    parties = sens.get("livingParties", [])
    if not (isinstance(parties, list) and all(isinstance(p, str) for p in parties)):
        blocks.append("sensitivity.livingParties must be a list of names")
        parties = []
    if named and not sens.get("victimsRationale"):
        warns.append("sensitivity.victimsNamed is true with no `victimsRationale` — "
                     "say why naming victims on screen is right for this episode")

    victims = parse_victims(claims_text) if claims_text else []
    if tier in ("high", "wtc") and not victims:
        warns.append(f"sensitivity tier {tier!r} but the CLAIMS sensitivity section "
                     f"has no `victims:` list — the on-screen victim-name gate can't run")
    if victims and not named:
        sn = {surname(v): v for v in victims if len(surname(v)) >= 3}
        for s in doc.get("scenes", []):
            for f in SCREEN_FIELDS:
                txt = s.get(f)
                if not isinstance(txt, str):
                    continue
                for last, full in sn.items():
                    if re.search(rf"\b{re.escape(last)}\b", txt, re.I):
                        blocks.append(
                            f"{s['id']}: victim surname {last!r} ({full}) on screen in "
                            f"`{f}` but sensitivity.victimsNamed is not true — victims "
                            f"are not named in on-screen text without a declared, "
                            f"reasoned decision (SENSITIVITY-GATE.md)")

    for p in parties:
        alts = {p.strip()}
        if len(surname(p)) >= 3:
            alts.add(surname(p))
        names = "|".join(re.escape(a) for a in sorted(alts, key=len, reverse=True))
        pat = re.compile(rf"\b(?:{names})\b(?:'s)?\s+(?:\w+ly\s+)?(?:{ASSERT_RE})\b", re.I)
        for s in doc.get("scenes", []):
            for f in ("text",) + SCREEN_FIELDS:
                txt = s.get(f)
                if not isinstance(txt, str):
                    continue
                for sent in re.split(r"(?<=[.!?])\s+", txt):
                    m = pat.search(sent)
                    if m and not ATTRIB_RE.search(sent):
                        blocks.append(
                            f"{s['id']}: `{f}` asserts {m.group(0)!r} about living party "
                            f"{p} with no attribution in the sentence — attribute it "
                            f"(\"according to…\", \"prosecutors alleged…\", \"the court "
                            f"found…\") or cut it (SENSITIVITY-GATE.md)")
    return blocks, warns


# ── CLI ────────────────────────────────────────────────────────────────────
def run_slug(slug: str, verbose: bool = True) -> int:
    cp = claims_path(slug)
    claims_text = cp.read_text() if cp.exists() else ""
    blocks, warns = lint_data(slug, claims_text if cp.exists() else None)
    doc_path = DOCS / f"{slug}.json"
    tr = None
    if doc_path.exists():
        doc = json.loads(doc_path.read_text())
        b, w = sensitivity_gate(doc, claims_text)
        blocks += b; warns += w
        if claims_text:
            tr = trace_figures(doc, claims_text)
    for m in blocks:
        print(f"BLOCK  {m}")
    for m in warns:
        print(f"warn   {m}")
    if tr is not None:
        print(f"tracer {slug}: {tr['checked']} on-screen figures, {tr['hits']} traced to "
              f"CLAIMS, {len(tr['misses'])} not found (WARN-only)")
        if verbose:
            for sid, fld, lit in tr["misses"]:
                print(f"  miss   {sid:10s} {fld:15s} {lit}")
    elif not claims_text:
        print(f"tracer {slug}: no CLAIMS-{slug}.md — nothing to trace against")
    print(f"\n{slug}: {len(blocks)} blocking, {len(warns)} warnings")
    return 1 if blocks else 0


def run_catalog() -> int:
    tot_c = tot_m = 0
    for doc_path in sorted(DOCS.glob("*.json")):
        if doc_path.name.endswith(".manifest.json"):
            continue
        slug = doc_path.stem
        cp = claims_path(slug)
        if not cp.exists():
            continue
        try:
            doc = json.loads(doc_path.read_text())
        except ValueError:
            continue
        if not isinstance(doc, dict) or "scenes" not in doc:
            continue
        claims_text = cp.read_text()
        tr = trace_figures(doc, claims_text)
        b, w = sensitivity_gate(doc, claims_text)
        db, dw = lint_data(slug, claims_text)
        tot_c += tr["checked"]; tot_m += len(tr["misses"])
        rate = len(tr["misses"]) / tr["checked"] if tr["checked"] else 0
        print(f"{slug:24s} figures {tr['checked']:4d}  misses {len(tr['misses']):3d} "
              f"({rate:5.1%})  sens {len(b)}B/{len(w)}W  data {len(db)}B/{len(dw)}W")
        for m in b + db:
            print(f"    BLOCK {m}")
    print(f"\nTOTAL figures {tot_c}, misses {tot_m} "
          f"({(tot_m / tot_c if tot_c else 0):.1%})\n{CALIBRATION}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug", nargs="?")
    ap.add_argument("--catalog", action="store_true",
                    help="tracer + sensitivity + data gate over every doc with a CLAIMS file")
    ap.add_argument("-q", "--quiet", action="store_true", help="tracer counts only")
    a = ap.parse_args()
    if a.catalog:
        return run_catalog()
    if not a.slug:
        ap.error("slug or --catalog required")
    return run_slug(a.slug, verbose=not a.quiet)


if __name__ == "__main__":
    sys.exit(main())
