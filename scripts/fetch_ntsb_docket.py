#!/usr/bin/env python3
"""fetch_ntsb_docket.py — download public-domain evidence files from NTSB accident dockets.

Foundation of the Black Box Breakdown "audio evidence engine": pulls the official
investigation docket (CVR transcripts, ATC factual reports, photos, animations)
for any NTSB case. All NTSB docket material is US-government work = public domain.

USAGE
  .venv-lipsync/bin/python scripts/fetch_ntsb_docket.py DCA09MA026 --list
  .venv-lipsync/bin/python scripts/fetch_ntsb_docket.py "Weehawken hudson" --types pdf
  .venv-lipsync/bin/python scripts/fetch_ntsb_docket.py DCA09MA026 --types audio,pdf \
      --match "cockpit voice" --out public/shorts/_evidence/us1549

HOW THE NTSB SIDE WORKS (verified 2026-07-13)
  1. CAROL search API (resolves search terms -> NTSB accident number):
       POST https://data.ntsb.gov/carol-main-public/api/Query/Main
       JSON body quirks that MATTER (wrong values -> opaque errors):
         - "SessionId" must be a non-null int (1 is fine). null => "unknown exception".
         - "RuleType" must be the STRING "Simple" (the int 0 the UI template shows
           => "unknown exception").
         - Column names come from GET .../api/Query/BasicSearchTemplate — e.g.
           "Event.NTSBNumber", "Event.City" (NOT "Event.NtsbNo", which is what the
           RESULT fields call it — asymmetric naming).
         - Operator "search engine" = full-text-ish; "is" = exact.
         - "SortColumn": null is accepted; most guessed column names are rejected.
  2. Docket file listing: server-rendered HTML, no JSON API needed:
       GET https://data.ntsb.gov/Docket/?NTSBNumber=<NtsbNo>
     Every file is an <a href="/Docket/Document/docBLOB?ID=...&FileExtension=...&FileName=...">.
     The DCA09MA026 docket returned all 123 items on one page (no pagination seen);
     the script still follows rel=next-style links defensively if present.
  3. File download: GET the docBLOB URL. Content-Length is honest; server is fine
     with plain httpx + a UA header.

WHAT DIDN'T WORK / QUIRKS
  - The US1549 (DCA09MA026) NTSB docket contains NO standalone ATC audio files —
    121 PDFs + 1 FDR-data zip + 1 .mov animation (the animation has synced ATC
    audio embedded). The famous released ATC recordings are hosted by the FAA:
      https://www.faa.gov/data_research/accident_incident/2009-01-15
    with 8 live mp3s under /sites/faa.gov/files/data_research/accident_incident/2009-01-15/.
    --faa-audio adds those to the download set for this case (also US gov PD).
  - CAROL guessing column names is futile; fetch BasicSearchTemplate for truth.
  - WebFetch-style clients get 403 from faa.gov; curl/httpx with a real UA is fine.
"""

import argparse
import html as htmllib
import re
import sys
import time
import urllib.parse
from pathlib import Path

import httpx

CAROL_API = "https://data.ntsb.gov/carol-main-public/api/Query/Main"
DOCKET_URL = "https://data.ntsb.gov/Docket/"
NTSB_BASE = "https://data.ntsb.gov"
# faa.gov (Akamai) 403s non-browser-looking UAs; a full browser UA passes.
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"}
NTSB_NO_RE = re.compile(r"^[A-Z]{3}\d{2}[A-Z]{2}\d{3}[A-Z]?$", re.I)
DELAY = 0.5  # politeness delay between downloads

TYPE_MAP = {
    "audio": {".mp3", ".wav", ".m4a", ".wma", ".aac", ".ogg"},
    "pdf": {".pdf"},
    "image": {".jpg", ".jpeg", ".png", ".gif", ".tif", ".tiff", ".bmp"},
    "video": {".mov", ".mp4", ".avi", ".wmv", ".mpg", ".mpeg"},
    "data": {".zip", ".csv", ".xls", ".xlsx"},
}

# Known off-NTSB public-domain audio supplements, keyed by NTSB number.
# US1549: NTSB docket has no standalone ATC audio; FAA released the tapes (PD).
FAA_AUDIO = {
    "DCA09MA026": {
        "page": "https://www.faa.gov/data_research/accident_incident/2009-01-15",
        "files": [
            "LGA_AWE1549_1-15-09_(ATIS_2000z-2130z).mp3",
            "LGA_AWE1549_1-15-09_(CBA_2019z-2104z).mp3",
            "LGA_AWE1549_1-15-09_(CC_2020z-2100z).mp3",
            "LGA_AWE1549_1-15-09_(CD_2000z-2020z).mp3",
            "LGA_AWE1549_1-15-09_(GC_1958z-2025z).mp3",
            "LGA_AWE1549_1-15-09_(LC_2010z-2025z).mp3",
            "N90_AWE1546_1-15-09_L116.mp3",  # NY TRACON departure ctl — the "we're gonna be in the Hudson" tape
            "TEB_AWE1549_1-15-09_AS-LC1.mp3",
        ],
        "base": "https://www.faa.gov/sites/faa.gov/files/data_research/accident_incident/2009-01-15/",
    },
}


def carol_search(client: httpx.Client, terms: str):
    """Resolve free-text terms (or verify an NTSB no) to case dicts via CAROL."""
    if NTSB_NO_RE.match(terms.strip()):
        rules = [{"RuleType": "Simple", "Values": [terms.strip().upper()],
                  "Columns": ["Event.NTSBNumber"], "Operator": "is"}]
    else:
        # NOTE: multiple Columns in ONE rule silently returns 0 results (it is
        # not an OR). Use one rule per column, grouped with AndOr "or".
        rules = [{"RuleType": "Simple", "Values": [terms],
                  "Columns": [col], "Operator": "search engine"}
                 for col in ("Event.NTSBNumber", "Event.City",
                             "Aircraft.RegistrationNumber")]
    group_op = "and" if len(rules) == 1 else "or"
    body = {"ResultSetSize": 10, "ResultSetOffset": 0,
            "QueryGroups": [{"QueryRules": rules, "AndOr": group_op}],
            "AndOr": "and", "SortColumn": None, "SortDescending": True,
            "TargetCollection": "cases", "SessionId": 1}
    r = client.post(CAROL_API, json=body)
    r.raise_for_status()
    data = r.json()
    if isinstance(data, str) or "Results" not in data:
        raise RuntimeError(f"CAROL error: {data}")
    cases = []
    for res in data["Results"]:
        f = {fl["FieldName"]: fl["Values"] for fl in res["Fields"]}
        cases.append({
            "ntsb_no": f.get("NtsbNo", ["?"])[0],
            "date": f.get("EventDate", ["?"])[0][:10],
            "city": f.get("City", ["?"])[0],
            "make": f.get("VehicleMake", ["?"])[0] if f.get("VehicleMake") else "?",
        })
    return cases


def list_docket_files(client: httpx.Client, ntsb_no: str):
    """Scrape docBLOB links from the server-rendered docket page (follows pagination if any)."""
    files, seen_ids = [], set()
    url = f"{DOCKET_URL}?NTSBNumber={ntsb_no}"
    for _ in range(50):  # pagination guard
        r = client.get(url, follow_redirects=True)
        r.raise_for_status()
        page = r.text
        for m in re.finditer(r'href="(/Docket/Document/docBLOB\?[^"]+)"', page):
            href = htmllib.unescape(m.group(1))
            q = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
            fid = q.get("ID", ["?"])[0]
            if fid in seen_ids:
                continue
            seen_ids.add(fid)
            name = q.get("FileName", ["file"])[0]
            ext = q.get("FileExtension", [""])[0].lower()
            if not ext.startswith("."):
                ext = "." + ext if ext else Path(name).suffix.lower()
            files.append({"id": fid, "name": name, "ext": ext,
                          "url": NTSB_BASE + href, "source": "NTSB docket"})
        nxt = re.search(r'href="([^"]*)"[^>]*>\s*(?:Next|&gt;|»)', page, re.I)
        if not nxt or htmllib.unescape(nxt.group(1)) in ("#", url):
            break
        url = urllib.parse.urljoin(url, htmllib.unescape(nxt.group(1)))
    return files


def wanted(f, exts, match):
    if exts and f["ext"] not in exts:
        return False
    if match and match.lower() not in f["name"].lower():
        return False
    return True


def safe_name(name, ext):
    base = re.sub(r'[\\/:*?"<>|]+', "_", name).strip()
    if not base.lower().endswith(ext):
        base += ext
    return base


def download(client: httpx.Client, f, out_dir: Path):
    dest = out_dir / safe_name(f["name"], f["ext"])
    if dest.exists() and dest.stat().st_size > 0:
        print(f"  skip (exists) {dest.name}")
        return dest
    with client.stream("GET", f["url"], follow_redirects=True) as r:
        r.raise_for_status()
        tmp = dest.with_suffix(dest.suffix + ".part")
        with open(tmp, "wb") as fh:
            for chunk in r.iter_bytes(1 << 16):
                fh.write(chunk)
        tmp.rename(dest)
    print(f"  saved {dest.name} ({dest.stat().st_size/1e6:.1f} MB)")
    time.sleep(DELAY)
    return dest


def main():
    ap = argparse.ArgumentParser(description="Download PD evidence files from NTSB dockets")
    ap.add_argument("query", help="NTSB number (e.g. DCA09MA026) or search terms")
    ap.add_argument("--out", default=None, help="output dir (default public/shorts/_evidence/<ntsb_no>)")
    ap.add_argument("--types", default="", help="comma list: audio,pdf,image,video,data (default: all)")
    ap.add_argument("--match", default="", help="substring filter on file name")
    ap.add_argument("--list", action="store_true", help="list docket files, download nothing")
    ap.add_argument("--faa-audio", action="store_true",
                    help="also fetch known FAA-released ATC audio for this case (US gov PD)")
    ap.add_argument("--limit", type=int, default=0, help="max files to download")
    args = ap.parse_args()

    exts = set()
    for t in filter(None, args.types.split(",")):
        if t not in TYPE_MAP:
            sys.exit(f"unknown type '{t}' (choose from {', '.join(TYPE_MAP)})")
        exts |= TYPE_MAP[t]

    with httpx.Client(headers=UA, timeout=120) as client:
        cases = carol_search(client, args.query)
        if not cases:
            sys.exit(f"No CAROL case found for: {args.query}")
        case = cases[0]
        if len(cases) > 1:
            print(f"{len(cases)} cases matched; using first:")
            for c in cases:
                print(f"  {c['ntsb_no']}  {c['date']}  {c['city']}  {c['make']}")
        ntsb_no = case["ntsb_no"]
        docket_url = f"{DOCKET_URL}?NTSBNumber={ntsb_no}"
        print(f"Case {ntsb_no} — {case['date']} {case['city']} ({case['make']})")
        print(f"Docket: {docket_url}")

        files = list_docket_files(client, ntsb_no)
        print(f"{len(files)} files in docket")

        if args.faa_audio and ntsb_no in FAA_AUDIO:
            fa = FAA_AUDIO[ntsb_no]
            for fn in fa["files"]:
                files.append({"id": fn, "name": Path(fn).stem, "ext": ".mp3",
                              "url": fa["base"] + urllib.parse.quote(fn),
                              "source": f"FAA ({fa['page']})"})
            print(f"+ {len(fa['files'])} FAA-released ATC audio files")

        sel = [f for f in files if wanted(f, exts, args.match)]
        if args.limit:
            sel = sel[: args.limit]

        if args.list:
            for f in files:
                mark = "*" if f in sel else " "
                print(f" {mark} [{f['ext']:>5}] {f['name']}  ({f['source']})")
            print(f"\n{len(sel)} would be downloaded with current filters")
            return

        out_dir = Path(args.out) if args.out else Path("public/shorts/_evidence") / ntsb_no.lower()
        out_dir.mkdir(parents=True, exist_ok=True)
        print(f"Downloading {len(sel)} files -> {out_dir}")
        got = []
        for f in sel:
            print(f"[{f['ext']}] {f['name']}")
            try:
                got.append((f, download(client, f, out_dir)))
            except Exception as e:
                print(f"  FAILED: {e}")

        src = out_dir / "SOURCES.md"
        old_rows = []
        if src.exists():
            old_rows = [l for l in src.read_text().splitlines()
                        if l.startswith("| ") and not l.startswith("| file ")]
        lines = [f"# Evidence sources — NTSB {ntsb_no}", "",
                 f"- Case: {case['date']} {case['city']} ({case['make']})",
                 f"- NTSB docket: {docket_url}",
                 "- License: NTSB docket material and FAA-released recordings are works of",
                 "  the US federal government — **public domain** (17 U.S.C. § 105).",
                 "", "| file | source | url |", "|---|---|---|"]
        lines += old_rows
        for f, dest in got:
            row = f"| {dest.name} | {f['source']} | {f['url']} |"
            if row not in lines:
                lines.append(row)
        src.write_text("\n".join(lines) + "\n")
        print(f"Wrote {src}")


if __name__ == "__main__":
    main()
